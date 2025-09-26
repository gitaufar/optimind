from fastapi import APIRouter, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from models.risk import (
    ContractRiskAnalysisRequest, 
    ContractRiskAnalysisResult,
    RiskSummaryRequest,
    RiskSummaryResult,
    ModelInfoResult
)
from services.risk_services import RiskAnalysisService
from services.ocr_services import OCRService
from utils.pdf_parser import PDFParser
from datetime import datetime
import time
import os

# Create router
router = APIRouter(prefix="/api/risk", tags=["risk-management"])

# Initialize services
risk_service = RiskAnalysisService()
ocr_service = OCRService()
pdf_parser = PDFParser()

@router.get("/model/info", response_model=ModelInfoResult)
async def get_model_info():
    """
    Get information about the risk analysis model
    """
    try:
        model_info = risk_service.get_model_info()
        
        if "error" in model_info:
            return ModelInfoResult(
                model_path="",
                model_type="",
                risk_levels={},
                model_available=False,
                device="",
                error_message=model_info["error"]
            )
        
        return ModelInfoResult(**model_info)
        
    except Exception as e:
        return ModelInfoResult(
            model_path="",
            model_type="",
            risk_levels={},
            model_available=False,
            device="",
            error_message=f"Failed to get model info: {str(e)}"
        )

@router.post("/analyze/text", response_model=ContractRiskAnalysisResult)
async def analyze_contract_risk_from_text(request: ContractRiskAnalysisRequest):
    """
    Analyze contract risk from provided text using fine-tuned Indonesian BERT model
    
    Args:
        request: Contract text and optional metadata
        
    Returns:
        Risk analysis result with level, confidence, and detailed assessment
    """
    start_time = time.time()
    
    try:
        if not request.contract_text or len(request.contract_text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Contract text is required and must be at least 10 characters long"
            )
        
        # Perform risk analysis
        analysis_result = await risk_service.analyze_contract_risk(request.contract_text)
        
        # Handle error cases
        if "error" in analysis_result:
            return ContractRiskAnalysisResult(
                success=False,
                risk_level="Unknown",
                confidence=0.0,
                risk_factors=[],
                risk_assessment={
                    "description": "Risk analysis failed",
                    "confidence_interpretation": "No confidence data",
                    "recommendations": [],
                    "risk_factor_count": 0,
                    "high_severity_factors": 0,
                    "medium_severity_factors": 0,
                    "low_severity_factors": 0
                },
                error_message=analysis_result["error"],
                analysis_timestamp=datetime.now(),
                processing_time=time.time() - start_time
            )
        
        # Return successful result
        return ContractRiskAnalysisResult(
            success=analysis_result.get("success", True),
            risk_level=analysis_result["risk_level"],
            confidence=analysis_result["confidence"],
            risk_factors=analysis_result["risk_factors"],
            risk_assessment=analysis_result["risk_assessment"],
            processed_text_length=analysis_result.get("processed_text_length"),
            model_used=analysis_result.get("model_used", "indo_finetuned_bert"),
            analysis_timestamp=datetime.now(),
            processing_time=time.time() - start_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return ContractRiskAnalysisResult(
            success=False,
            risk_level="Unknown",
            confidence=0.0,
            risk_factors=[],
            risk_assessment={
                "description": "Risk analysis failed due to internal error",
                "confidence_interpretation": "No confidence data",
                "recommendations": [],
                "risk_factor_count": 0,
                "high_severity_factors": 0,
                "medium_severity_factors": 0,
                "low_severity_factors": 0
            },
            error_message=f"Internal error: {str(e)}",
            analysis_timestamp=datetime.now(),
            processing_time=time.time() - start_time
        )

@router.post("/analyze/file", response_model=ContractRiskAnalysisResult)
async def analyze_contract_risk_from_file(file: UploadFile):
    """
    Analyze contract risk from uploaded file (PDF, image, or text)
    
    Args:
        file: Contract file (PDF, JPG, PNG, TIFF, BMP, or TXT)
        
    Returns:
        Risk analysis result with level, confidence, and detailed assessment
    """
    start_time = time.time()
    
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        file_extension = file.filename.lower().split('.')[-1] if '.' in file.filename else ""
        
        # Extract text from file
        extracted_text = ""
        extraction_method = ""
        
        if file_extension == 'pdf':
            # Try PDF text extraction first
            try:
                extracted_text = await pdf_parser.extract_text_from_pdf(file)
                extraction_method = "PDF text extraction"
                
                # If little text found, use OCR
                if len(extracted_text.strip()) < 100:
                    await file.seek(0)  # Reset file position
                    extracted_text = await ocr_service.extract_text_from_pdf_file(file)
                    extraction_method = "OCR (PDF to image)"
                    
            except Exception:
                # Fallback to OCR
                await file.seek(0)
                extracted_text = await ocr_service.extract_text_from_pdf_file(file)
                extraction_method = "OCR (PDF to image)"
                
        elif file_extension in ['jpg', 'jpeg', 'png', 'tiff', 'bmp']:
            # Use OCR for images
            extracted_text = await ocr_service.extract_text_from_image_file(file)
            extraction_method = "OCR (image)"
            
        elif file_extension in ['txt']:
            # Read text file directly
            content = await file.read()
            extracted_text = content.decode('utf-8')
            extraction_method = "Direct text reading"
            
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type: {file_extension}. Please upload PDF, JPG, PNG, TIFF, BMP, or TXT files."
            )
        
        # Validate extracted text
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient text from file for risk analysis"
            )
        
        # Perform risk analysis
        analysis_result = await risk_service.analyze_contract_risk(extracted_text)
        
        # Handle error cases
        if "error" in analysis_result:
            return ContractRiskAnalysisResult(
                success=False,
                risk_level="Unknown",
                confidence=0.0,
                risk_factors=[],
                risk_assessment={
                    "description": "Risk analysis failed",
                    "confidence_interpretation": "No confidence data",
                    "recommendations": [],
                    "risk_factor_count": 0,
                    "high_severity_factors": 0,
                    "medium_severity_factors": 0,
                    "low_severity_factors": 0
                },
                error_message=f"Risk analysis failed: {analysis_result['error']}",
                analysis_timestamp=datetime.now(),
                processing_time=time.time() - start_time
            )
        
        # Return successful result
        return ContractRiskAnalysisResult(
            success=analysis_result.get("success", True),
            risk_level=analysis_result["risk_level"],
            confidence=analysis_result["confidence"],
            risk_factors=analysis_result["risk_factors"],
            risk_assessment=analysis_result["risk_assessment"],
            processed_text_length=analysis_result.get("processed_text_length"),
            model_used=analysis_result.get("model_used", "indo_finetuned_bert"),
            analysis_timestamp=datetime.now(),
            processing_time=time.time() - start_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return ContractRiskAnalysisResult(
            success=False,
            risk_level="Unknown", 
            confidence=0.0,
            risk_factors=[],
            risk_assessment={
                "description": "Risk analysis failed due to internal error",
                "confidence_interpretation": "No confidence data", 
                "recommendations": [],
                "risk_factor_count": 0,
                "high_severity_factors": 0,
                "medium_severity_factors": 0,
                "low_severity_factors": 0
            },
            error_message=f"Internal error during file processing: {str(e)}",
            analysis_timestamp=datetime.now(),
            processing_time=time.time() - start_time
        )

@router.post("/analyze/batch", response_model=RiskSummaryResult)
async def analyze_multiple_contracts_risk(request: RiskSummaryRequest):
    """
    Analyze risk for multiple contracts and provide summary
    
    Args:
        request: List of contract texts and summary type
        
    Returns:
        Risk summary across all contracts
    """
    start_time = time.time()
    
    try:
        if not request.contract_texts or len(request.contract_texts) == 0:
            raise HTTPException(status_code=400, detail="At least one contract text is required")
        
        # Analyze each contract
        analysis_results = []
        risk_distribution = {"Low": 0, "Medium": 0, "High": 0, "Unknown": 0}
        total_confidence = 0
        all_risk_factors = []
        high_risk_contracts = []
        
        for i, contract_text in enumerate(request.contract_texts):
            if len(contract_text.strip()) < 10:
                continue
                
            result = await risk_service.analyze_contract_risk(contract_text)
            
            if "error" not in result:
                analysis_results.append(result)
                risk_level = result.get("risk_level", "Unknown")
                risk_distribution[risk_level] = risk_distribution.get(risk_level, 0) + 1
                total_confidence += result.get("confidence", 0)
                
                # Collect risk factors
                all_risk_factors.extend(result.get("risk_factors", []))
                
                # Track high-risk contracts
                if risk_level == "High":
                    high_risk_contracts.append({
                        "contract_index": i,
                        "risk_level": risk_level,
                        "confidence": result.get("confidence", 0),
                        "risk_factor_count": len(result.get("risk_factors", []))
                    })
        
        if not analysis_results:
            raise HTTPException(
                status_code=400, 
                detail="No valid contract texts found for analysis"
            )
        
        # Calculate summary statistics
        total_contracts = len(analysis_results)
        average_confidence = total_confidence / total_contracts if total_contracts > 0 else 0
        
        # Find common risk factors
        risk_factor_counts = {}
        for factor in all_risk_factors:
            factor_type = factor.get("type", "unknown")
            risk_factor_counts[factor_type] = risk_factor_counts.get(factor_type, 0) + 1
        
        common_risk_factors = [
            {"type": rf_type, "occurrence_count": count, "percentage": round(count/total_contracts*100, 1)}
            for rf_type, count in sorted(risk_factor_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]
        
        # Generate summary recommendations
        summary_recommendations = []
        if risk_distribution["High"] > 0:
            summary_recommendations.append(f"{risk_distribution['High']} kontrak berisiko tinggi memerlukan review mendalam")
        if risk_distribution["Medium"] > total_contracts * 0.5:
            summary_recommendations.append("Mayoritas kontrak memiliki risiko sedang - perlu monitoring ketat")
        if average_confidence < 0.7:
            summary_recommendations.append("Confidence score rendah - pertimbangkan review manual tambahan")
        
        # Create summary result
        risk_summary = {
            "total_contracts": total_contracts,
            "risk_distribution": risk_distribution,
            "average_confidence": round(average_confidence, 3),
            "common_risk_factors": common_risk_factors,
            "high_risk_contracts": high_risk_contracts,
            "recommendations": summary_recommendations
        }
        
        return RiskSummaryResult(
            success=True,
            risk_summary=risk_summary,
            processing_time=time.time() - start_time,
            analysis_timestamp=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return RiskSummaryResult(
            success=False,
            error_message=f"Batch analysis failed: {str(e)}",
            processing_time=time.time() - start_time,
            analysis_timestamp=datetime.now()
        )