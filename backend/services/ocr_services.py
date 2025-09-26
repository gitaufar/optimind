# services/ocr_services.py
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import os

# Path ke executable Tesseract (Windows), sesuaikan dengan installasi Anda
pytesseract.pytesseract.tesseract_cmd = "tesseract"


def ocr_image(image_path: str) -> str:
    """
    OCR untuk file gambar (JPG/PNG) menggunakan Tesseract.
    """
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
        return text
    except Exception as e:
        raise Exception(f"OCR failed for image: {str(e)}")


def ocr_pdf(pdf_path: str, dpi: int = 300) -> str:
    """
    OCR untuk file PDF (multi-page).
    Convert PDF ke gambar per halaman, lalu OCR tiap halaman.
    """
    try:
        pages = convert_from_path(pdf_path, dpi=dpi)
    except Exception as e:
        raise Exception(f"Unable to get page count. Make sure Poppler is installed and in PATH. {str(e)}")

    text_output = []
    for i, page in enumerate(pages):
        # buat path sementara untuk halaman
        page_path = f"temp_page_{i+1}.png"
        page.save(page_path, "PNG")

        try:
            page_text = pytesseract.image_to_string(Image.open(page_path))
            text_output.append(f"--- Page {i+1} ---\n{page_text}")
        except Exception as e:
            raise Exception(f"OCR failed on page {i+1}: {str(e)}")
        finally:
            os.remove(page_path)  # hapus file sementara

    return "\n".join(text_output)
