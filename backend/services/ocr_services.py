# services/ocr_services.py
import asyncio
import io
from typing import Optional, List, Dict, Any
from fastapi import UploadFile
from pdf2image import convert_from_path

try:
    import pytesseract
    from pdf2image import convert_from_bytes
    from PIL import Image
    OCR_AVAILABLE = True
    print("OCR libraries loaded successfully")
except ImportError as e:
    print(f"OCR libraries not available: {e}")
    OCR_AVAILABLE = False

import os

class OCRService:
    """OCR service for extracting text from images and scanned documents"""
    
    def __init__(self):
        self.ocr_available = OCR_AVAILABLE
        if self.ocr_available:
            # Path ke executable Tesseract (Windows), sesuaikan dengan installasi Anda
            pytesseract.pytesseract.tesseract_cmd = "tesseract"
            self._test_ocr()
    
    def _test_ocr(self):
        """Test OCR functionality"""
        try:
            # Test with a simple version check
            version = pytesseract.get_tesseract_version()
            print(f"Tesseract version: {version}")
        except Exception as e:
            print(f"Warning: Tesseract test failed: {e}")
            self.ocr_available = False

    async def extract_text_from_image_file(
        self, 
        file: UploadFile,
        language: str = 'eng+ind'
    ) -> str:
        """Extract text from uploaded image file using OCR"""
        if not self.ocr_available:
            return "OCR not available - required libraries not installed"
        
        try:
            # Read file content
            content = await file.read()
            
            # Open image
            image = Image.open(io.BytesIO(content))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using OCR
            text = await asyncio.get_event_loop().run_in_executor(
                None, 
                lambda: pytesseract.image_to_string(image, lang=language)
            )
            
            return self._clean_text(text)
            
        except Exception as e:
            return f"OCR extraction failed: {str(e)}"

    async def extract_text_from_pdf_file(
        self, 
        file: UploadFile,
        dpi: int = 300,
        language: str = 'eng+ind'
    ) -> str:
        """Extract text from PDF file using OCR (convert to images first)"""
        if not self.ocr_available:
            return "OCR not available - required libraries not installed"
        
        try:
            # Read PDF content
            content = await file.read()
            
            # Convert PDF pages to images
            pages = await asyncio.get_event_loop().run_in_executor(
                None, 
                lambda: convert_from_bytes(content, dpi=dpi, fmt='JPEG')
            )
            
            text_output = []
            
            for i, page in enumerate(pages):
                try:
                    # Extract text from each page
                    page_text = await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: pytesseract.image_to_string(page, lang=language)
                    )
                    
                    if page_text.strip():  # Only add non-empty pages
                        text_output.append(f"--- Page {i+1} ---\n{page_text}")
                        
                except Exception as page_error:
                    text_output.append(f"--- Page {i+1} (Error) ---\nOCR failed: {str(page_error)}")
            
            return "\n\n".join(text_output) if text_output else "No text extracted from PDF"
            
        except Exception as e:
            return f"PDF OCR extraction failed: {str(e)}"

    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove common OCR artifacts
        text = text.replace('|', 'I')  # Common OCR mistake
        
        # Fix common punctuation issues
        text = text.replace(' .', '.')
        text = text.replace(' ,', ',')
        text = text.replace(' ;', ';')
        text = text.replace(' :', ':')
        
        return text.strip()

# Legacy functions for backward compatibility
def ocr_image(image_path: str) -> str:
    """Legacy OCR function for image files"""
    if not OCR_AVAILABLE:
        return "OCR not available - required libraries not installed"
    
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
        return text
    except Exception as e:
        return f"OCR failed for image: {str(e)}"

def ocr_pdf(pdf_path: str, dpi: int = 300) -> str:
    """Legacy OCR function for PDF files"""
    if not OCR_AVAILABLE:
        return "OCR not available - required libraries not installed"
    
    try:
        pages = convert_from_path(pdf_path, dpi=dpi)
        text_output = []
        
        for i, page in enumerate(pages):
            # Create temporary path for page
            page_path = f"temp_page_{i+1}.png"
            page.save(page_path, "PNG")

            try:
                page_text = pytesseract.image_to_string(Image.open(page_path))
                text_output.append(f"--- Page {i+1} ---\n{page_text}")
            except Exception as e:
                text_output.append(f"--- Page {i+1} (Error) ---\nOCR failed: {str(e)}")
            finally:
                if os.path.exists(page_path):
                    os.remove(page_path)  # Remove temporary file

        return "\n".join(text_output)
        
    except Exception as e:
        return f"PDF OCR failed: {str(e)}"
