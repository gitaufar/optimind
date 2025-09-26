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
            self.model = getattr(settings, 'GROQ_MODEL', 'llama-3.1-8b-instant')
            self.max_tokens = getattr(settings, 'GROQ_MAX_TOKENS', 2000)
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
        if len(text) > 15000:
            print(f"Very long text detected: {len(text)} characters. Using smart chunking...")
            text = self._extract_relevant_contract_sections(text, max_chars=12000)
            print(f"Relevant sections extracted: {len(text)} characters")
        elif len(text) > 8000:
            # For medium-long texts, keep more content but focus on key sections
            text = self._extract_relevant_contract_sections(text, max_chars=8000)
            print(f"Medium text processed: {len(text)} characters")
        
        # Continue with analysis
        return await self._continue_analysis(text)
    
    def _extract_relevant_contract_sections(self, text: str, max_chars: int = 6000) -> str:
        """
        Extract the most relevant sections for contract analysis from long text.
        Enhanced version that preserves critical contract information.
        """
        # Keywords that indicate important contract sections (in Indonesian)
        critical_keywords = [
            # Core contract terms
            'kontrak', 'perjanjian', 'agreement', 'surat',
            
            # Parties (high priority)
            'pihak pertama', 'pihak kedua', 'pihak ketiga', 'pihak kesatu',
            'yang selanjutnya disebut', 'yang dalam', 'berkedudukan',
            'alamat', 'direktur', 'manager', 'wakil', 'bertindak',
            
            # Company identifiers
            'pt ', 'cv ', 'ud ', 'firma', 'persero', 'tbk', 'ltd',
            
            # Personal info
            'nama', 'nik', 'nomor induk', 'identitas', 'ktp',
            
            # Financial terms (very high priority)
            'nilai', 'harga', 'biaya', 'rupiah', 'rp', 'usd', '$',
            'pembayaran', 'tagihan', 'invoice', 'pelunasan',
            
            # Time terms (very high priority)
            'tanggal', 'waktu', 'periode', 'jangka', 'masa',
            'berlaku', 'berakhir', 'expired', 'mulai', 'sampai',
            
            # Legal structure
            'pasal', 'ayat', 'point', 'butir', 'bab',
            'kewajiban', 'hak', 'tanggung jawab'
        ]
        
        # Split into lines for more granular control
        lines = text.split('\n')
        scored_lines = []
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            if not line_stripped or len(line_stripped) < 5:
                continue
                
            line_lower = line_stripped.lower()
            score = 0
            
            # Score based on critical keywords
            for keyword in critical_keywords:
                if keyword in line_lower:
                    if keyword in ['pihak pertama', 'pihak kedua', 'nama', 'nilai', 'tanggal', 'berakhir']:
                        score += 25  # Super high priority for key contract info
                    elif keyword in ['alamat', 'direktur', 'harga', 'berlaku', 'rupiah', 'rp']:
                        score += 15  # High priority
                    else:
                        score += 8   # Medium priority
            
            # Extra scoring for specific patterns
            
            # Lines with monetary values
            import re
            money_patterns = [
                r'rp\.?\s*\d+', r'rupiah\s*\d+', r'\$\s*\d+', 
                r'\d+\s*rupiah', r'\d+\s*juta', r'\d+\s*milyar'
            ]
            for pattern in money_patterns:
                if re.search(pattern, line_lower):
                    score += 20
            
            # Lines with dates
            date_patterns = [
                r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',  # DD-MM-YYYY
                r'\d{1,2}\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+\d{2,4}',
                r'\d{4}[-/]\d{1,2}[-/]\d{1,2}'  # YYYY-MM-DD
            ]
            for pattern in date_patterns:
                if re.search(pattern, line_lower):
                    score += 20
            
            # Lines with proper names (capitalize first letter)
            words = line_stripped.split()
            capitalized_words = [w for w in words if len(w) > 2 and w[0].isupper()]
            if len(capitalized_words) >= 2:
                score += 10
            
            # Lines with addresses
            address_indicators = ['jalan', 'jl.', 'no.', 'nomor', 'kota', 'jakarta', 'surabaya', 'bandung', 'medan', 'semarang']
            if any(indicator in line_lower for indicator in address_indicators):
                score += 12
            
            # Boost early lines (headers, important info usually at top)
            if i < 50:
                score += 5
            elif i < 100:
                score += 2
            
            # Penalize very long lines (might be noise or OCR artifacts)
            if len(line) > 300:
                score -= 5
            
            scored_lines.append((score, i, line))
        
        # Sort by score descending
        scored_lines.sort(key=lambda x: x[0], reverse=True)
        
        # Select lines until we reach character limit
        selected_lines = []
        total_chars = 0
        
        for score, line_idx, line in scored_lines:
            if score > 0 and total_chars + len(line) < max_chars:
                selected_lines.append((line_idx, line))
                total_chars += len(line) + 1  # +1 for newline
                
            # Stop if we have enough high-scoring content
            if total_chars > max_chars * 0.9:
                break
        
        # Sort selected lines back to original order
        selected_lines.sort(key=lambda x: x[0])
        
        # Reconstruct text
        result_lines = []
        last_idx = -1
        
        for line_idx, line in selected_lines:
            # Add gap indicator if we skipped many lines
            if line_idx > last_idx + 5:
                result_lines.append("[...]")
            result_lines.append(line)
            last_idx = line_idx
        
        result_text = '\n'.join(result_lines)
        
        # Add summary note
        if len(result_text) < len(text) * 0.4:
            result_text = f"[Dokumen dipotong untuk fokus pada informasi kontrak penting]\n\n{result_text}"
        
        return result_text
        
    async def _continue_analysis(self, text: str) -> Dict[str, Any]:
        """Continue with the actual Groq analysis"""
        try:
            prompt = f"""
TUGAS: Ekstrak informasi spesifik dari dokumen kontrak Indonesia ini.

ATURAN KONVERSI TANGGAL WAJIB:
Jika menemukan tanggal seperti:
- "Dua Puluh Bulan Februari Tahun Dua Ribu Dua Puluh Lima" → KONVERSI menjadi "20 Februari 2025"
- "Tiga Puluh Satu Desember Dua Ribu Dua Puluh Empat" → KONVERSI menjadi "31 Desember 2024"
- "Lima Belas Januari Tahun Dua Ribu Dua Puluh Enam" → KONVERSI menjadi "15 Januari 2026"

WAJIB DIPERHATIKAN:
- NAMA SPESIFIK pihak-pihak (PT, CV, nama lengkap individu) - BUKAN "Pihak Pertama/Kedua"  
- ALAMAT LENGKAP jika tertulis
- KONVERSI semua tanggal teks Indonesia ke format: DD Bulan YYYY
- NILAI KONTRAK dalam Rupiah jika disebutkan
- TIDAK boleh menggunakan placeholder generik

Format output JSON yang diinginkan:
{{
    "contract_name": "nama/judul kontrak yang spesifik",
    "first_party": {{
        "name": "NAMA SPESIFIK (PT ABC, CV XYZ, atau Tuan John Doe)", 
        "type": "perusahaan/individu",
        "address": "alamat lengkap jika disebutkan"
    }},
    "second_party": {{
        "name": "NAMA SPESIFIK (bukan Pihak Kedua)",
        "type": "perusahaan/individu", 
        "address": "alamat lengkap jika disebutkan"
    }},
    "contract_end_date": "DD Bulan YYYY (WAJIB konversi dari teks panjang)",
    "contract_start_date": "DD Bulan YYYY (WAJIB konversi dari teks panjang)",
    "contract_duration": "durasi yang disebutkan",
    "contract_value": "nilai dalam rupiah jika ada",
    "contract_type": "jenis kontrak spesifik",
    "key_terms": ["poin-poin penting faktual"]
}}

CONTOH KONVERSI YANG BENAR:
- Tanggal: "20 Februari 2025" ✓ (BUKAN "Dua Puluh Bulan Februari Tahun Dua Ribu Dua Puluh Lima" ✗)
- Nama: "PT Maju Jaya Tbk" ✓ (BUKAN "Pihak Pertama" ✗)
- Nilai: "Rp 500.000.000,-" ✓ (BUKAN "tidak disebutkan" ✗)

DOKUMEN KONTRAK:
{text}

OUTPUT HANYA JSON VALID:"""
            
            # Make API call
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Anda adalah AI ahli analisis kontrak Indonesia. TUGAS UTAMA: 1) Ekstrak nama spesifik perusahaan/individu (PT, CV, nama lengkap) BUKAN 'Pihak Pertama/Kedua', 2) WAJIB konversi tanggal teks Indonesia panjang menjadi format 'DD Bulan YYYY'. Contoh: 'Dua Puluh Bulan Februari Tahun Dua Ribu Dua Puluh Lima' HARUS menjadi '20 Februari 2025'. Response JSON valid tanpa teks tambahan."},
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
                
                # Post-process: Convert Indonesian date text to proper format
                result = self._convert_indonesian_dates(result)
                
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
    
    def _convert_indonesian_dates(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Convert Indonesian date text to DD Bulan YYYY format"""
        if not isinstance(result, dict):
            return result
        
        # Mapping number words to digits
        number_map = {
            'satu': '1', 'dua': '2', 'tiga': '3', 'empat': '4', 'lima': '5',
            'enam': '6', 'tujuh': '7', 'delapan': '8', 'sembilan': '9', 'sepuluh': '10',
            'sebelas': '11', 'dua belas': '12', 'tiga belas': '13', 'empat belas': '14', 'lima belas': '15',
            'enam belas': '16', 'tujuh belas': '17', 'delapan belas': '18', 'sembilan belas': '19',
            'dua puluh': '20', 'dua puluh satu': '21', 'dua puluh dua': '22', 'dua puluh tiga': '23',
            'dua puluh empat': '24', 'dua puluh lima': '25', 'dua puluh enam': '26', 'dua puluh tujuh': '27',
            'dua puluh delapan': '28', 'dua puluh sembilan': '29', 'tiga puluh': '30', 'tiga puluh satu': '31',
            'ribu': '1000', 'dua ribu': '2000', 'dua ribu dua puluh': '2020', 'dua ribu dua puluh lima': '2025',
            'dua ribu dua puluhan lima': '2025', 'dua ribu dua puluh empat': '2024', 'dua ribu dua puluh tiga': '2023',
            'dua ribu dua puluh enam': '2026', 'dua ribu dua puluh tujuh': '2027'
        }
        
        # Month mapping
        month_map = {
            'januari': 'Januari', 'februari': 'Februari', 'maret': 'Maret', 'april': 'April',
            'mei': 'Mei', 'juni': 'Juni', 'juli': 'Juli', 'agustus': 'Agustus',
            'september': 'September', 'oktober': 'Oktober', 'november': 'November', 'desember': 'Desember'
        }
        
        def convert_date_text(date_text: str) -> str:
            """Convert Indonesian date text to DD Bulan YYYY"""
            if not date_text or len(date_text) < 10:
                return date_text
                
            original = date_text
            text = date_text.lower().strip()
            
            # If already in correct format, return as is
            import re
            if re.match(r'\d{1,2}\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+\d{4}', text):
                return date_text
            
            # Try to extract day, month, year from Indonesian text
            day = None
            month = None 
            year = None
            
            # Find day number
            for word_num, digit in number_map.items():
                if word_num in text and len(digit) <= 2:  # Day should be 1-31
                    day = digit
                    break
            
            # Find month
            for month_word, month_name in month_map.items():
                if month_word in text:
                    month = month_name
                    break
            
            # Find year  
            for word_num, digit in number_map.items():
                if word_num in text and len(digit) >= 4:  # Year should be 4 digits
                    year = digit
                    break
            
            # Additional year patterns
            if 'dua ribu dua puluh lima' in text:
                year = '2025'
            elif 'dua ribu dua puluhan lima' in text:
                year = '2025'
            elif 'dua ribu dua puluh empat' in text:
                year = '2024'
            
            # If we found all components, format properly
            if day and month and year:
                return f"{day} {month} {year}"
            
            return original
        
        # Convert date fields if they exist
        if 'contract_start_date' in result and result['contract_start_date']:
            result['contract_start_date'] = convert_date_text(str(result['contract_start_date']))
            
        if 'contract_end_date' in result and result['contract_end_date']:
            result['contract_end_date'] = convert_date_text(str(result['contract_end_date']))
        
        return result
    
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