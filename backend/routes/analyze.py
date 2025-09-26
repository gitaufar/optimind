# routes/analyze.py
from fastapi import APIRouter, UploadFile
from services import ocr_services, nlp_services
from utils import pdf_parser

router = APIRouter()

@router.post("/analyze")
async def analyze(file: UploadFile):
    file_path = f"data/uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    # OCR
    text = ocr_services.extract_text_from_pdf(file_path)
    
    # NLP
    result = nlp_services.analyze_contract(text)
    
    return {"filename": file.filename, "analysis": result}
