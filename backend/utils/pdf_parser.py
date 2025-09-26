"""
PDF parsing utilities for contract documents
"""

import io
from typing import Dict, Any,List
from fastapi import UploadFile

try:
    import fitz  # PyMuPDF
    PDF_PARSER_AVAILABLE = True
    print("PyMuPDF library loaded successfully")
except ImportError:
    print("PyMuPDF not available, using fallback text extraction")
    PDF_PARSER_AVAILABLE = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


class PDFParser:
    """Utility class for parsing PDF documents"""
    
    def __init__(self):
        self.supported_formats = ['.pdf']
        self.pymupdf_available = PDF_PARSER_AVAILABLE
    
    async def extract_text_from_pdf(self, file: UploadFile) -> str:
        """
        Extract text from PDF file
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            Extracted text string
        """
        if not self.pymupdf_available:
            return "PDF parsing not available - PyMuPDF library not installed"
        
        try:
            # Read file content
            content = await file.read()
            
            # Open PDF with PyMuPDF
            doc = fitz.open(stream=content, filetype="pdf")
            
            # Extract text from all pages
            text_parts = []
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                if text.strip():  # Only add non-empty pages
                    text_parts.append(f"--- Page {page_num + 1} ---\n{text}")
            
            # Close document
            doc.close()
            
            return "\n\n".join(text_parts) if text_parts else "No text found in PDF"
            
        except Exception as e:
            return f"PDF text extraction failed: {str(e)}"
    
    async def extract_text_with_formatting(self, file: UploadFile) -> Dict[str, Any]:
        """
        Extract text with formatting information
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            Dictionary with text and formatting info
        """
        try:
            # Read file content
            content = await file.read()
            
            # Open PDF with PyMuPDF
            doc = fitz.open(stream=content, filetype="pdf")
            
            pages_data = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                
                # Get text blocks with formatting
                blocks = page.get_text("dict")
                
                page_data = {
                    'page_number': page_num + 1,
                    'text': page.get_text(),
                    'blocks': blocks['blocks'],
                    'width': page.rect.width,
                    'height': page.rect.height
                }
                
                pages_data.append(page_data)
            
            # Close document
            doc.close()
            
            return {
                'pages': pages_data,
                'total_pages': len(pages_data),
                'full_text': '\n\n'.join([p['text'] for p in pages_data])
            }
            
        except Exception as e:
            print(f"PDF formatting extraction failed: {e}")
            return {'error': str(e)}
    
    async def extract_images_from_pdf(self, file: UploadFile) -> List[Dict[str, Any]]:
        """
        Extract images from PDF
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            List of image data dictionaries
        """
        try:
            # Read file content
            content = await file.read()
            
            # Open PDF with PyMuPDF
            doc = fitz.open(stream=content, filetype="pdf")
            
            images_data = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                image_list = page.get_images()
                
                for img_index, img in enumerate(image_list):
                    # Get image object
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Create PIL Image
                    image = Image.open(io.BytesIO(image_bytes))
                    
                    images_data.append({
                        'page_number': page_num + 1,
                        'image_index': img_index,
                        'format': image_ext,
                        'size': image.size,
                        'mode': image.mode,
                        'image': image  # PIL Image object
                    })
            
            # Close document
            doc.close()
            
            return images_data
            
        except Exception as e:
            print(f"PDF image extraction failed: {e}")
            return []
    
    async def get_pdf_metadata(self, file: UploadFile) -> Dict[str, Any]:
        """
        Extract metadata from PDF
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            PDF metadata dictionary
        """
        try:
            # Read file content
            content = await file.read()
            
            # Open PDF with PyMuPDF
            doc = fitz.open(stream=content, filetype="pdf")
            
            # Get metadata
            metadata = doc.metadata
            
            # Get additional info
            info = {
                'title': metadata.get('title', ''),
                'author': metadata.get('author', ''),
                'subject': metadata.get('subject', ''),
                'creator': metadata.get('creator', ''),
                'producer': metadata.get('producer', ''),
                'creation_date': metadata.get('creationDate', ''),
                'modification_date': metadata.get('modDate', ''),
                'total_pages': len(doc),
                'encrypted': doc.needs_pass,
                'page_count': len(doc),
                'file_size': len(content)
            }
            
            # Close document
            doc.close()
            
            return info
            
        except Exception as e:
            print(f"PDF metadata extraction failed: {e}")
            return {'error': str(e)}
    
    async def extract_text_from_document(self, content: bytes, filename: str) -> str:
        """
        Extract text from various document types
        
        Args:
            content: File content as bytes
            filename: Name of the file
            
        Returns:
            Extracted text string
        """
        try:
            file_ext = filename.lower().split('.')[-1]
            
            if file_ext == 'pdf':
                # Handle PDF
                doc = fitz.open(stream=content, filetype="pdf")
                text_parts = []
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    text = page.get_text()
                    text_parts.append(text)
                doc.close()
                return "\n\n".join(text_parts)
                
            elif file_ext in ['txt', 'text']:
                # Handle plain text
                return content.decode('utf-8', errors='ignore')
                
            elif file_ext in ['doc', 'docx']:
                # Handle Word documents (requires python-docx)
                try:
                    from docx import Document
                    doc = Document(io.BytesIO(content))
                    text_parts = []
                    for paragraph in doc.paragraphs:
                        text_parts.append(paragraph.text)
                    return "\n".join(text_parts)
                except ImportError:
                    return "Word document processing requires python-docx library"
                    
            else:
                return f"Unsupported file type: {file_ext}"
                
        except Exception as e:
            print(f"Document text extraction failed: {e}")
            return ""
    
    def validate_pdf_file(self, file: UploadFile) -> Dict[str, Any]:
        """
        Validate PDF file
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            Validation result dictionary
        """
        validation_result = {
            'is_valid': False,
            'errors': [],
            'warnings': [],
            'file_info': {}
        }
        
        try:
            # Check file extension
            if not file.filename.lower().endswith('.pdf'):
                validation_result['errors'].append("File is not a PDF")
                return validation_result
            
            # Check file size (example: max 10MB)
            max_size = 10 * 1024 * 1024  # 10MB
            if hasattr(file, 'size') and file.size > max_size:
                validation_result['errors'].append(f"File size exceeds {max_size/1024/1024}MB limit")
            
            validation_result['is_valid'] = len(validation_result['errors']) == 0
            validation_result['file_info'] = {
                'filename': file.filename,
                'content_type': file.content_type
            }
            
        except Exception as e:
            validation_result['errors'].append(f"Validation failed: {str(e)}")
        
        return validation_result
