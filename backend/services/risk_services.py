import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import pipeline
import logging
from typing import Dict, Any, List, Optional
import asyncio
import re

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RiskAnalysisService:
    """Risk Analysis Service using fine-tuned Indonesian BERT model"""
    
    def __init__(self):
        self.model_path = "models/indo_finetuned/checkpoint-21"
        self.model = None
        self.tokenizer = None
        self.classifier = None
        self.risk_available = False
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize the fine-tuned model and tokenizer"""
        try:
            # Check if model directory exists
            if not os.path.exists(self.model_path):
                logger.error(f"Model path not found: {self.model_path}")
                return
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path)
            
            # Create classification pipeline
            self.classifier = pipeline(
                "text-classification",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if torch.cuda.is_available() else -1  # Use GPU if available
            )
            
            self.risk_available = True
            logger.info("Risk analysis model loaded successfully")
            
            # Print model info
            logger.info(f"Model architecture: {self.model.config.architectures[0]}")
            logger.info(f"Risk levels: {self.model.config.id2label}")
            
        except Exception as e:
            logger.error(f"Failed to load risk analysis model: {e}")
            self.risk_available = False
    
    def _preprocess_contract_text(self, text: str) -> str:
        """Preprocess contract text for risk analysis"""
        if not text:
            return ""
        
        # Clean the text
        text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with single space
        text = text.strip()
        
        # Focus on risk-relevant sections
        risk_keywords = [
            'kewajiban', 'tanggung jawab', 'sanksi', 'denda', 'penalty',
            'force majeure', 'pembatalan', 'terminasi', 'pelanggaran',
            'ganti rugi', 'kompensasi', 'asuransi', 'jaminan', 'garansi',
            'risiko', 'bahaya', 'kerugian', 'default', 'wanprestasi'
        ]
        
        # Extract sentences containing risk keywords
        sentences = text.split('.')
        risk_relevant_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if any(keyword in sentence.lower() for keyword in risk_keywords):
                risk_relevant_sentences.append(sentence)
        
        # If no risk-relevant sentences found, use first part of contract
        if not risk_relevant_sentences:
            return text[:512]  # Limit to 512 characters for model input
        
        risk_text = '. '.join(risk_relevant_sentences)
        
        # Limit text length for model input (BERT has 512 token limit)
        if len(risk_text) > 1000:
            risk_text = risk_text[:1000]
        
        return risk_text
    
    async def analyze_contract_risk(self, contract_text: str) -> Dict[str, Any]:
        """
        Analyze contract risk using fine-tuned Indonesian BERT model
        
        Args:
            contract_text: Full contract text
            
        Returns:
            Risk analysis result with level and confidence
        """
        if not self.risk_available:
            return {
                "error": "Risk analysis model not available",
                "risk_level": "Unknown",
                "confidence": 0.0,
                "risk_factors": []
            }
        
        try:
            # Preprocess text for risk analysis
            processed_text = self._preprocess_contract_text(contract_text)
            
            if not processed_text:
                return {
                    "error": "No text provided for risk analysis",
                    "risk_level": "Unknown",
                    "confidence": 0.0,
                    "risk_factors": []
                }
            
            # Run risk classification in executor to avoid blocking
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.classifier(processed_text)
            )
            
            # Extract results
            risk_level = result[0]['label']
            confidence = result[0]['score']
            
            # Analyze specific risk factors
            risk_factors = self._identify_risk_factors(contract_text)
            
            # Generate risk assessment
            risk_assessment = self._generate_risk_assessment(risk_level, confidence, risk_factors)
            
            return {
                "success": True,
                "risk_level": risk_level,
                "confidence": round(confidence, 3),
                "risk_factors": risk_factors,
                "risk_assessment": risk_assessment,
                "processed_text_length": len(processed_text),
                "model_used": "indo_finetuned_bert"
            }
            
        except Exception as e:
            logger.error(f"Risk analysis failed: {e}")
            return {
                "error": f"Risk analysis failed: {str(e)}",
                "risk_level": "Unknown",
                "confidence": 0.0,
                "risk_factors": []
            }
    
    def _identify_risk_factors(self, contract_text: str) -> List[Dict[str, Any]]:
        """Identify specific risk factors in contract text"""
        risk_factors = []
        text_lower = contract_text.lower()
        
        # Define risk factor patterns
        risk_patterns = {
            "payment_delay": {
                "keywords": ["terlambat bayar", "keterlambatan pembayaran", "denda keterlambatan"],
                "description": "Risiko keterlambatan pembayaran",
                "severity": "Medium"
            },
            "force_majeure": {
                "keywords": ["force majeure", "keadaan kahar", "bencana alam", "pandemi"],
                "description": "Risiko force majeure",
                "severity": "High"
            },
            "penalty_clause": {
                "keywords": ["denda", "sanksi", "penalty", "ganti rugi"],
                "description": "Klausul denda dan sanksi",
                "severity": "Medium"
            },
            "termination_risk": {
                "keywords": ["pembatalan", "terminasi", "pemutusan kontrak"],
                "description": "Risiko pembatalan kontrak",
                "severity": "High"
            },
            "warranty_risk": {
                "keywords": ["garansi", "jaminan", "warranty"],
                "description": "Risiko terkait garansi",
                "severity": "Low"
            },
            "legal_compliance": {
                "keywords": ["peraturan", "undang-undang", "hukum", "regulasi"],
                "description": "Risiko kepatuhan hukum",
                "severity": "Medium"
            }
        }
        
        for risk_type, risk_info in risk_patterns.items():
            found_keywords = [kw for kw in risk_info["keywords"] if kw in text_lower]
            if found_keywords:
                risk_factors.append({
                    "type": risk_type,
                    "description": risk_info["description"],
                    "severity": risk_info["severity"],
                    "found_keywords": found_keywords,
                    "keyword_count": len(found_keywords)
                })
        
        return risk_factors
    
    def _generate_risk_assessment(self, risk_level: str, confidence: float, risk_factors: List[Dict]) -> Dict[str, Any]:
        """Generate comprehensive risk assessment"""
        
        # Risk level mapping
        risk_descriptions = {
            "Low": "Kontrak memiliki tingkat risiko rendah dengan potensi masalah minimal",
            "Medium": "Kontrak memiliki tingkat risiko sedang yang memerlukan perhatian khusus",
            "High": "Kontrak memiliki tingkat risiko tinggi yang memerlukan review mendalam"
        }
        
        # Risk recommendations
        recommendations = {
            "Low": [
                "Review berkala terhadap pelaksanaan kontrak",
                "Monitoring standar sesuai jadwal",
                "Dokumentasi yang baik untuk audit trail"
            ],
            "Medium": [
                "Review mendalam pada klausul-klausul kritis",
                "Konsultasi dengan legal expert untuk klausul berisiko",
                "Implementasi monitoring ketat pada milestone penting",
                "Persiapan contingency plan untuk skenario risiko"
            ],
            "High": [
                "Review komprehensif dengan tim legal",
                "Negosiasi ulang untuk klausul berisiko tinggi",
                "Implementasi sistem monitoring real-time",
                "Persiapan exit strategy dan contingency plan",
                "Pertimbangkan asuransi untuk risiko tertentu"
            ]
        }
        
        return {
            "description": risk_descriptions.get(risk_level, "Tingkat risiko tidak dapat ditentukan"),
            "confidence_interpretation": self._interpret_confidence(confidence),
            "recommendations": recommendations.get(risk_level, []),
            "risk_factor_count": len(risk_factors),
            "high_severity_factors": len([rf for rf in risk_factors if rf.get("severity") == "High"]),
            "medium_severity_factors": len([rf for rf in risk_factors if rf.get("severity") == "Medium"]),
            "low_severity_factors": len([rf for rf in risk_factors if rf.get("severity") == "Low"])
        }
    
    def _interpret_confidence(self, confidence: float) -> str:
        """Interpret confidence score"""
        if confidence >= 0.9:
            return "Sangat yakin - hasil analisis sangat reliable"
        elif confidence >= 0.7:
            return "Yakin - hasil analisis dapat diandalkan"
        elif confidence >= 0.5:
            return "Cukup yakin - hasil analisis perlu validasi tambahan"
        else:
            return "Kurang yakin - hasil analisis memerlukan review manual"
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the risk analysis model"""
        if not self.risk_available:
            return {"error": "Model not available"}
        
        return {
            "model_path": self.model_path,
            "model_type": "BERT for Sequence Classification",
            "risk_levels": self.model.config.id2label if self.model else {},
            "model_available": self.risk_available,
            "device": "GPU" if torch.cuda.is_available() else "CPU"
        }