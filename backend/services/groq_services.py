"""
Groq AI service for advanced contract analysis
"""

import asyncio
from typing import Dict, Any, List, Optional
import json

try:
    from groq import Groq
    GROQ_AVAILABLE = True
    print("Groq library loaded successfully")
except ImportError:
    print("Groq library not available. Install with: pip install groq")
    GROQ_AVAILABLE = False

from config.settings import settings


class GroqService:
    """Service for using Groq API for contract analysis"""
    
    def __init__(self):
        self.groq_available = GROQ_AVAILABLE
        if self.groq_available and hasattr(settings, 'GROQ_API_KEY') and settings.GROQ_API_KEY:
            self.client = Groq(api_key=settings.GROQ_API_KEY)
            self.model = getattr(settings, 'GROQ_MODEL', 'llama-3.1-70b-versatile')
            self.max_tokens = getattr(settings, 'GROQ_MAX_TOKENS', 1024)
            self.temperature = getattr(settings, 'GROQ_TEMPERATURE', 0.1)
            print(f"Groq service initialized with model: {self.model}")
        else:
            print("Groq service not available - API key missing or library not installed")
            self.groq_available = False
    
    async def analyze_contract_details(self, text: str) -> Dict[str, Any]:
        """
        Extract specific contract details using Groq AI:
        - Contract name
        - First party (pihak pertama)  
        - Second party (pihak kedua)
        - Contract end date (tanggal berakhir)
        
        For long texts (>10000 chars), uses smart chunking to find relevant sections.
        
        Args:
            text: Contract text to analyze
            
        Returns:
            Analysis result dictionary with contract details
        """
        if not self.groq_available:
            return {
                "error": "Groq service not available",
                "fallback": True
            }
            
        # Handle long texts with smart preprocessing
        if len(text) > 10000:
            print(f"Long text detected: {len(text)} characters. Using smart chunking...")
            text = self._extract_relevant_contract_sections(text)
            print(f"Relevant sections extracted: {len(text)} characters")
        elif len(text) > 6000:
            # For medium texts, take first and last parts which usually contain key info
            middle_cut = len(text) // 2
            text = text[:3000] + "\n\n[...bagian tengah dipotong...]\n\n" + text[middle_cut:]
        
        # Continue with analysis
        return await self._continue_analysis(text)
    
    def _extract_relevant_contract_sections(self, text: str, max_chars: int = 6000) -> str:
        """
        Extract the most relevant sections for contract analysis from long text.
        Looks for sections containing contract information like parties, dates, etc.
        """
        # Keywords that indicate important contract sections (in Indonesian)
        important_keywords = [
            'kontrak', 'perjanjian', 'agreement', 'pihak pertama', 'pihak kedua',
            'berakhir', 'berlaku', 'tanggal', 'mulai', 'sampai', 'jangka waktu',
            'nama', 'judul', 'alamat', 'perusahaan', 'pt ', 'cv ', 'tuan', 'nyonya',
            'nilai', 'harga', 'biaya', 'rupiah', 'rp', 'usd', '$'
        ]
        
        # Split text into paragraphs
        paragraphs = text.split('\n\n')
        scored_paragraphs = []
        
        for i, paragraph in enumerate(paragraphs):
            if len(paragraph.strip()) < 20:  # Skip very short paragraphs
                continue
                
            # Score paragraph based on keyword density
            score = 0
            paragraph_lower = paragraph.lower()
            
            for keyword in important_keywords:
                score += paragraph_lower.count(keyword) * len(keyword)
            
            # Boost score for paragraphs at the beginning (usually contain key info)
            if i < 10:
                score *= 1.5
            
            # Boost score for paragraphs with dates (common patterns)
            import re
            date_patterns = [
                r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',  # DD-MM-YYYY or DD/MM/YYYY
                r'\d{1,2}\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+\d{2,4}',
                r'\d{4}[-/]\d{1,2}[-/]\d{1,2}'  # YYYY-MM-DD
            ]
            
            for pattern in date_patterns:
                if re.search(pattern, paragraph_lower):
                    score *= 2
                    break
            
            scored_paragraphs.append((score, paragraph))
        
        # Sort by score and take top paragraphs
        scored_paragraphs.sort(key=lambda x: x[0], reverse=True)
        
        selected_text = ""
        for score, paragraph in scored_paragraphs:
            if len(selected_text) + len(paragraph) > max_chars:
                break
            selected_text += paragraph + "\n\n"
        
        # If still too little content, add more from beginning
        if len(selected_text) < 2000:
            beginning = text[:3000]
            selected_text = beginning + "\n\n" + selected_text
        
        return selected_text[:max_chars]
        
    async def _continue_analysis(self, text: str) -> Dict[str, Any]:
        """Continue with the actual Groq analysis"""
        try:
            prompt = f"""
            Analisis kontrak berikut dan ekstrak informasi spesifik ini dalam format JSON:
            
            {{
                "contract_name": "nama kontrak atau judul dokumen",
                "first_party": {{
                    "name": "nama pihak pertama", 
                    "type": "jenis (perusahaan/individu)",
                    "address": "alamat jika ada"
                }},
                "second_party": {{
                    "name": "nama pihak kedua",
                    "type": "jenis (perusahaan/individu)", 
                    "address": "alamat jika ada"
                }},
                "contract_end_date": "tanggal berakhir kontrak (format: DD-MM-YYYY atau format yang ditemukan)",
                "contract_start_date": "tanggal mulai kontrak jika ada",
                "contract_duration": "durasi kontrak",
                "contract_value": "nilai kontrak jika disebutkan",
                "contract_type": "jenis kontrak",
                "key_terms": ["poin-poin penting dalam kontrak"]
            }}
            
            Instruksi:
            1. Fokus pada informasi yang diminta: nama kontrak, pihak pertama, pihak kedua, dan tanggal berakhir
            2. Untuk pihak pertama dan kedua, cari nama perusahaan, organisasi, atau individu
            3. Untuk tanggal berakhir, cari istilah seperti "berakhir pada", "berlaku sampai", "jangka waktu", "masa berlaku"
            4. Jika informasi tidak ditemukan, berikan null
            5. Berikan respons dalam bahasa Indonesia
            6. Jika teks terpotong, analisis dengan informasi yang tersedia
            
            Teks kontrak (karakter: {len(text)}):
            {text}
            """
            
            # Make API call
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Anda adalah AI yang ahli dalam menganalisis kontrak Indonesia. Ekstrak informasi spesifik yang diminta dengan akurat dari teks kontrak."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=self.max_tokens,
                    temperature=self.temperature
                )
            )
            
            # Extract and parse response
            content = response.choices[0].message.content
            
            # Clean up the response - remove markdown code blocks if present
            if "```json" in content:
                # Extract JSON from markdown code blocks
                import re
                json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
                if json_match:
                    content = json_match.group(1).strip()
            
            # Try to parse as JSON
            try:
                result = json.loads(content)
                result["groq_analysis"] = True
                result["confidence_score"] = 0.9  # High confidence for Groq analysis
                return result
            except json.JSONDecodeError:
                # If not valid JSON, return as text analysis with parsing attempt
                return {
                    "groq_analysis": True,
                    "raw_analysis": content,
                    "error": "Failed to parse JSON response",
                    "confidence_score": 0.5
                }
                
        except Exception as e:
            return {
                "error": f"Groq contract analysis failed: {str(e)}",
                "groq_analysis": False,
                "confidence_score": 0.0
            }
    
    async def extract_entities_with_groq(self, text: str) -> Dict[str, Any]:
        """
        Extract entities from contract text using Groq
        
        Args:
            text: Contract text
            
        Returns:
            Extracted entities
        """
        if not self.groq_available:
            return {"error": "Groq service not available"}
        
        try:
            prompt = f"""
            Ekstrak entitas penting dari teks kontrak berikut dan berikan dalam format JSON:
            
            {{
                "parties": [
                    {{
                        "name": "nama lengkap pihak",
                        "type": "individual/company/organization",
                        "role": "peran dalam kontrak"
                    }}
                ],
                "dates": [
                    {{
                        "type": "jenis tanggal",
                        "date": "tanggal (YYYY-MM-DD)",
                        "description": "deskripsi"
                    }}
                ],
                "financial": [
                    {{
                        "type": "jenis keuangan",
                        "amount": "jumlah",
                        "currency": "mata uang",
                        "description": "deskripsi"
                    }}
                ],
                "locations": ["lokasi yang disebutkan"],
                "obligations": [
                    {{
                        "party": "pihak yang berkewajiban",
                        "obligation": "kewajiban",
                        "deadline": "tenggat waktu jika ada"
                    }}
                ]
            }}
            
            Teks kontrak:
            {text[:3000]}
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Anda adalah sistem ekstraksi entitas yang akurat untuk dokumen kontrak Indonesia."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=800,
                    temperature=0.1
                )
            )
            
            content = response.choices[0].message.content
            
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"raw_extraction": content, "error": "Failed to parse JSON"}
                
        except Exception as e:
            return {"error": f"Entity extraction failed: {str(e)}"}
    
    async def assess_risk_with_groq(self, text: str) -> Dict[str, Any]:
        """
        Assess contract risks using Groq
        
        Args:
            text: Contract text or clause
            
        Returns:
            Risk assessment result
        """
        if not self.groq_available:
            return {"error": "Groq service not available"}
        
        try:
            prompt = f"""
            Lakukan penilaian risiko terhadap teks kontrak berikut dan berikan hasil dalam format JSON:
            
            {{
                "overall_risk": "low/medium/high",
                "risk_score": "1-10",
                "risks": [
                    {{
                        "category": "kategori risiko",
                        "risk": "deskripsi risiko",
                        "probability": "kemungkinan (low/medium/high)",
                        "impact": "dampak (low/medium/high)",
                        "mitigation": "strategi mitigasi"
                    }}
                ],
                "red_flags": ["bendera merah yang ditemukan"],
                "recommendations": ["rekomendasi untuk mengurangi risiko"],
                "legal_compliance": {{
                    "compliant": true/false,
                    "issues": ["masalah kepatuhan jika ada"]
                }}
            }}
            
            Fokus pada risiko keuangan, hukum, operasional, dan kepatuhan terhadap regulasi Indonesia.
            
            Teks kontrak:
            {text[:3000]}
            """
            
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Anda adalah ahli manajemen risiko kontrak dengan keahlian dalam hukum Indonesia."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1000,
                    temperature=0.1
                )
            )
            
            content = response.choices[0].message.content
            
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"raw_assessment": content, "error": "Failed to parse JSON"}
                
        except Exception as e:
            return {"error": f"Risk assessment failed: {str(e)}"}
    
    def is_available(self) -> bool:
        """Check if Groq service is available"""
        return self.groq_available


# Create a global instance
groq_service = GroqService()

def get_groq_service() -> GroqService:
    """Get the Groq service instance"""
    return groq_service