# routes/analyze.py
from fastapi import APIRouter, UploadFile, HTTPException
from services.ocr_services import OCRService
from services.groq_services import get_groq_service
from models.contract import ContractAnalysisResult, ContractDetails, ContractParty
from utils.pdf_parser import PDFParser
import os
import time

router = APIRouter()

@router.get("/health")
async def health():
    """Simple health check endpoint"""
    return {"status": "healthy", "message": "Analyze service is running"}

@router.post("/ocr/extract")
async def extract_text_with_ocr(file: UploadFile):
    """
    Extract text using OCR and save result to .txt file
    """
    start_time = time.time()
    
    try:
        # Initialize OCR service
        ocr_service = OCRService()
        
        # Check file type
        file_extension = file.filename.lower().split('.')[-1] if '.' in file.filename else ""
        
        extracted_text = ""
        ocr_filepath = ""
        
        if file_extension == 'pdf':
            # Extract from PDF using OCR
            extracted_text, ocr_filepath = await ocr_service.extract_and_save_from_pdf(file)
        elif file_extension in ['jpg', 'jpeg', 'png', 'tiff', 'bmp']:
            # Extract from image using OCR
            extracted_text, ocr_filepath = await ocr_service.extract_and_save_from_image(file)
        else:
            return {
                "success": False,
                "error": "Unsupported file type. Please upload PDF, JPG, PNG, TIFF, or BMP files.",
                "processing_time": time.time() - start_time
            }
        
        if not extracted_text:
            return {
                "success": False,
                "error": "Failed to extract text from file",
                "processing_time": time.time() - start_time
            }
        
        return {
            "success": True,
            "filename": file.filename,
            "file_type": file_extension,
            "extracted_text": extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
            "extracted_text_length": len(extracted_text),
            "ocr_file_path": ocr_filepath,
            "processing_time": time.time() - start_time
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"OCR extraction failed: {str(e)}",
            "processing_time": time.time() - start_time
        }

@router.post("/contract/details", response_model=ContractAnalysisResult)
async def analyze_contract_details(file: UploadFile):
    """
    Extract contract details using OCR + Groq AI:
    - Nama kontrak
    - Pihak pertama 
    - Pihak kedua
    - Tanggal berakhir kontrak
    """
    start_time = time.time()
    
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "data/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Initialize services
        ocr_service = OCRService()
        pdf_parser = PDFParser()
        groq_service = get_groq_service()
        
        extracted_text = ""
        extraction_method = ""
        ocr_filepath = ""  # Path to saved OCR result
        
        # Check file type and extract text accordingly
        file_extension = file.filename.lower().split('.')[-1] if '.' in file.filename else ""
        
        if file_extension == 'pdf':
            # For PDF files, first try to extract text directly
            try:
                extracted_text = await pdf_parser.extract_text_from_pdf(file)
                extraction_method = "PDF text extraction"
                
                # If PDF text extraction yields little content, use OCR
                if len(extracted_text.strip()) < 100:
                    print("PDF has little extractable text, using OCR...")
                    # Reset file position
                    await file.seek(0)
                    extracted_text, ocr_filepath = await ocr_service.extract_and_save_from_pdf(file)
                    extraction_method = "OCR (PDF to image) + saved to file"
                else:
                    # Even if PDF extraction is successful, also save OCR for backup
                    print("PDF text extracted successfully, also saving OCR backup...")
                    await file.seek(0)
                    ocr_text, ocr_filepath = await ocr_service.extract_and_save_from_pdf(file)
                    extraction_method = "PDF text extraction + OCR backup saved"
                    
            except Exception as pdf_error:
                print(f"PDF extraction failed: {pdf_error}, trying OCR...")
                # Reset file position and try OCR
                await file.seek(0)
                extracted_text, ocr_filepath = await ocr_service.extract_and_save_from_pdf(file)
                extraction_method = "OCR (PDF to image) + saved to file"
                
        elif file_extension in ['jpg', 'jpeg', 'png', 'tiff', 'bmp']:
            # For image files, use OCR directly and save result
            extracted_text, ocr_filepath = await ocr_service.extract_and_save_from_image(file)
            extraction_method = "OCR (image) + saved to file"
            
        else:
            # For text files, read directly
            content = await file.read()
            extracted_text = content.decode('utf-8')
            extraction_method = "Direct text reading"
        
        if not extracted_text or extracted_text.strip() == "":
            return ContractAnalysisResult(
                success=False,
                error_message="Failed to extract text from file",
                processing_time=time.time() - start_time
            )
        
        # Analyze contract details with Groq
        print("Analyzing contract details with Groq...")
        groq_result = await groq_service.analyze_contract_details(extracted_text)
        
        if groq_result.get("error"):
            return ContractAnalysisResult(
                success=False,
                error_message=f"Groq analysis failed: {groq_result['error']}",
                extracted_text=extracted_text[:1000],
                processing_time=time.time() - start_time,
                analysis_method="groq_ai_failed"
            )
        
        # Parse Groq result into our models
        contract_details = ContractDetails()
        
        if "contract_name" in groq_result:
            contract_details.contract_name = groq_result["contract_name"]
        
        if "first_party" in groq_result and groq_result["first_party"]:
            first_party_data = groq_result["first_party"]
            if isinstance(first_party_data, dict):
                contract_details.first_party = ContractParty(
                    name=first_party_data.get("name", ""),
                    type=first_party_data.get("type"),
                    address=first_party_data.get("address")
                )
            elif isinstance(first_party_data, str):
                contract_details.first_party = ContractParty(name=first_party_data)
        
        if "second_party" in groq_result and groq_result["second_party"]:
            second_party_data = groq_result["second_party"]
            if isinstance(second_party_data, dict):
                contract_details.second_party = ContractParty(
                    name=second_party_data.get("name", ""),
                    type=second_party_data.get("type"),
                    address=second_party_data.get("address")
                )
            elif isinstance(second_party_data, str):
                contract_details.second_party = ContractParty(name=second_party_data)
        
        if "contract_end_date" in groq_result:
            contract_details.contract_end_date = groq_result["contract_end_date"]
        
        if "contract_start_date" in groq_result:
            contract_details.contract_start_date = groq_result["contract_start_date"]
        
        if "contract_duration" in groq_result:
            contract_details.contract_duration = groq_result["contract_duration"]
        
        if "contract_value" in groq_result:
            contract_details.contract_value = groq_result["contract_value"]
        
        if "contract_type" in groq_result:
            contract_details.contract_type = groq_result["contract_type"]
        
        if "key_terms" in groq_result:
            contract_details.key_terms = groq_result["key_terms"]
        
        # Return successful result
        return ContractAnalysisResult(
            success=True,
            contract_details=contract_details,
            extracted_text=extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
            ocr_file_path=ocr_filepath if ocr_filepath else None,
            confidence_score=groq_result.get("confidence_score", 0.9),
            analysis_method="groq_ai",
            processing_time=time.time() - start_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return ContractAnalysisResult(
            success=False,
            error_message=f"Contract details analysis failed: {str(e)}",
            processing_time=time.time() - start_time,
            analysis_method="error"
        )
