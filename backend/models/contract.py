from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class ContractParty(BaseModel):
    """Model for contract party information"""
    name: str
    type: Optional[str] = None  # "company", "individual", etc.
    address: Optional[str] = None
    
class ContractDetails(BaseModel):
    """Model for detailed contract analysis results"""
    contract_name: Optional[str] = None
    first_party: Optional[ContractParty] = None
    second_party: Optional[ContractParty] = None
    contract_end_date: Optional[str] = None  # Keep as string to handle various date formats
    contract_start_date: Optional[str] = None
    contract_duration: Optional[str] = None
    contract_value: Optional[str] = None
    contract_type: Optional[str] = None
    key_terms: Optional[List[str]] = None
    
class ContractAnalysisResult(BaseModel):
    """Complete contract analysis result"""
    success: bool = True
    contract_details: Optional[ContractDetails] = None
    extracted_text: Optional[str] = None
    confidence_score: Optional[float] = None
    analysis_method: str = "groq_ai"  # "groq_ai", "rule_based", "hybrid"
    error_message: Optional[str] = None
    processing_time: Optional[float] = None

class Contract(BaseModel):
    """Base contract model"""
    id: Optional[str] = None
    title: Optional[str] = None
    content: str
    file_name: Optional[str] = None
    uploaded_at: Optional[datetime] = None
    analysis_result: Optional[ContractAnalysisResult] = None