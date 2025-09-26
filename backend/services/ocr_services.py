import os
from google.cloud import vision
from pdf2image import convert_from_path

# Pastikan environment variable diarahkan ke JSON key
# Bisa juga di-set manual di app.py sekali saja
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "backend/config/slashcom-hackathon-481f0017f399.json"

client = vision.ImageAnnotatorClient()

def ocr_image(image_path: str) -> str:
    """
    OCR untuk file gambar (JPG/PNG) menggunakan Google Vision API.
    """
    with open(image_path, "rb") as f:
        content = f.read()

    image = vision.Image(content=content)
    response = client.document_text_detection(image=image)

    if response.error.message:
        raise Exception(f"OCR failed: {response.error.message}")

    return response.full_text_annotation.text


def ocr_pdf(pdf_path: str, dpi: int = 300) -> str:
    """
    OCR untuk file PDF (multi-page).
    Convert PDF ke gambar per halaman, lalu OCR tiap halaman.
    """
    pages = convert_from_path(pdf_path, dpi=dpi)

    text_output = []
    for i, page in enumerate(pages):
        page_path = f"temp_page_{i+1}.png"
        page.save(page_path, "PNG")

        with open(page_path, "rb") as f:
            content = f.read()
        image = vision.Image(content=content)
        response = client.document_text_detection(image=image)

        if response.error.message:
            raise Exception(f"OCR failed on page {i+1}: {response.error.message}")

        text_output.append(f"--- Page {i+1} ---\n{response.full_text_annotation.text}")

        os.remove(page_path)  # hapus file temp

    return "\n".join(text_output)
