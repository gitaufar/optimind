# 🛡️ Risk Management API Documentation

API Risk Management menggunakan model **indo_finetuned BERT** untuk analisis risiko kontrak dalam bahasa Indonesia.

## 🔧 Model Information

- **Model**: Fine-tuned Indonesian BERT for Sequence Classification
- **Risk Levels**: Low, Medium, High
- **Confidence**: 0.0 - 1.0
- **Device**: CPU/GPU support

## 📝 API Endpoints

### 1. Get Model Info
```
GET /api/risk/model/info
```
**Response:**
```json
{
  "model_path": "models/indo_finetuned/checkpoint-21",
  "model_type": "BERT for Sequence Classification",
  "risk_levels": {"0": "Low", "1": "Medium", "2": "High"},
  "model_available": true,
  "device": "CPU"
}
```

### 2. Analyze Risk from Text
```
POST /api/risk/analyze/text
```
**Request Body:**
```json
{
  "contract_text": "Teks kontrak dalam bahasa Indonesia...",
  "contract_id": "optional-id",
  "additional_context": "optional context"
}
```

**Response:**
```json
{
  "success": true,
  "risk_level": "Medium",
  "confidence": 0.876,
  "risk_factors": [
    {
      "type": "penalty_clause",
      "description": "Klausul denda dan sanksi",
      "severity": "Medium",
      "found_keywords": ["denda", "sanksi"],
      "keyword_count": 2
    }
  ],
  "risk_assessment": {
    "description": "Kontrak memiliki tingkat risiko sedang yang memerlukan perhatian khusus",
    "confidence_interpretation": "Yakin - hasil analisis dapat diandalkan",
    "recommendations": [
      "Review mendalam pada klausul-klausul kritis",
      "Konsultasi dengan legal expert untuk klausul berisiko"
    ],
    "risk_factor_count": 1,
    "high_severity_factors": 0,
    "medium_severity_factors": 1,
    "low_severity_factors": 0
  },
  "processed_text_length": 450,
  "model_used": "indo_finetuned_bert",
  "analysis_timestamp": "2025-09-26T10:30:00Z",
  "processing_time": 2.34
}
```

### 3. Analyze Risk from File
```
POST /api/risk/analyze/file
```
**Request:** Multipart form with file upload
- Supported formats: PDF, JPG, PNG, TIFF, BMP, TXT
- File extraction: OCR + PDF parsing

**Response:** Same as text analysis

### 4. Batch Risk Analysis
```
POST /api/risk/analyze/batch
```
**Request Body:**
```json
{
  "contract_texts": [
    "Kontrak pertama...",
    "Kontrak kedua...",
    "Kontrak ketiga..."
  ],
  "summary_type": "overview"
}
```

**Response:**
```json
{
  "success": true,
  "risk_summary": {
    "total_contracts": 3,
    "risk_distribution": {"Low": 1, "Medium": 2, "High": 0},
    "average_confidence": 0.834,
    "common_risk_factors": [
      {
        "type": "penalty_clause",
        "occurrence_count": 2,
        "percentage": 66.7
      }
    ],
    "high_risk_contracts": [],
    "recommendations": [
      "Mayoritas kontrak memiliki risiko sedang - perlu monitoring ketat"
    ]
  },
  "processing_time": 5.67,
  "analysis_timestamp": "2025-09-26T10:35:00Z"
}
```

## 🚨 Risk Factors Detected

### 1. **Payment Delay** (Medium)
- Keywords: `terlambat bayar`, `keterlambatan pembayaran`, `denda keterlambatan`
- Description: Risiko keterlambatan pembayaran

### 2. **Force Majeure** (High)
- Keywords: `force majeure`, `keadaan kahar`, `bencana alam`, `pandemi`
- Description: Risiko force majeure

### 3. **Penalty Clause** (Medium)
- Keywords: `denda`, `sanksi`, `penalty`, `ganti rugi`
- Description: Klausul denda dan sanksi

### 4. **Termination Risk** (High)
- Keywords: `pembatalan`, `terminasi`, `pemutusan kontrak`
- Description: Risiko pembatalan kontrak

### 5. **Warranty Risk** (Low)
- Keywords: `garansi`, `jaminan`, `warranty`
- Description: Risiko terkait garansi

### 6. **Legal Compliance** (Medium)
- Keywords: `peraturan`, `undang-undang`, `hukum`, `regulasi`
- Description: Risiko kepatuhan hukum

## 📊 Risk Assessment Levels

### 🟢 **Low Risk**
- **Description**: Kontrak memiliki tingkat risiko rendah dengan potensi masalah minimal
- **Recommendations**:
  - Review berkala terhadap pelaksanaan kontrak
  - Monitoring standar sesuai jadwal
  - Dokumentasi yang baik untuk audit trail

### 🟡 **Medium Risk**
- **Description**: Kontrak memiliki tingkat risiko sedang yang memerlukan perhatian khusus
- **Recommendations**:
  - Review mendalam pada klausul-klausul kritis
  - Konsultasi dengan legal expert untuk klausul berisiko
  - Implementasi monitoring ketat pada milestone penting
  - Persiapan contingency plan untuk skenario risiko

### 🔴 **High Risk**
- **Description**: Kontrak memiliki tingkat risiko tinggi yang memerlukan review mendalam
- **Recommendations**:
  - Review komprehensif dengan tim legal
  - Negosiasi ulang untuk klausul berisiko tinggi
  - Implementasi sistem monitoring real-time
  - Persiapan exit strategy dan contingency plan
  - Pertimbangkan asuransi untuk risiko tertentu

## 🎯 Confidence Score Interpretation

| Score Range | Interpretation |
|-------------|----------------|
| 0.9 - 1.0   | Sangat yakin - hasil analisis sangat reliable |
| 0.7 - 0.89  | Yakin - hasil analisis dapat diandalkan |
| 0.5 - 0.69  | Cukup yakin - hasil analisis perlu validasi tambahan |
| 0.0 - 0.49  | Kurang yakin - hasil analisis memerlukan review manual |

## 🧪 Testing Examples

### Test with cURL:
```bash
# Text Analysis
curl -X POST "http://localhost:8000/api/risk/analyze/text" \
  -H "Content-Type: application/json" \
  -d '{
    "contract_text": "Kontrak kerja dengan denda 5% jika terlambat penyelesaian. Dalam hal force majeure kontrak dapat dibatalkan."
  }'

# File Analysis
curl -X POST "http://localhost:8000/api/risk/analyze/file" \
  -F "file=@contract.pdf"
```

## ⚠️ Error Handling

Common error responses:
- `400`: Invalid input (text too short, unsupported file type)
- `500`: Model loading error or processing failure

## 📈 Performance

- **Processing Time**: 1-5 seconds per contract
- **File Size Limit**: Recommended < 10MB for files
- **Text Length**: Optimized for contracts up to 10,000 characters
- **Batch Processing**: Up to 10 contracts per request recommended

## 🔄 Model Updates

The indo_finetuned model can be updated by replacing files in:
```
models/indo_finetuned/checkpoint-21/
├── config.json
├── model.safetensors
├── tokenizer.json
├── tokenizer_config.json
└── vocab.txt
```

Restart the API server after model updates.