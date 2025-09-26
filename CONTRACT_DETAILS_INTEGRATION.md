# Contract Details API Integration

## Overview
Sistem sekarang sudah terintegrasi dengan API contract details extraction yang akan:

1. **Upload file ke storage** - File PDF/DOCX disimpan di Supabase storage
2. **Extract contract details** - API `/contract/details` mengekstrak informasi kontrak
3. **Analyze risk** - API `/api/risk/analyze/file` menganalisis risiko kontrak
4. **Save to database** - Semua data disimpan ke database yang sesuai

## API Endpoints

### Contract Details Extraction
```
POST http://127.0.0.1:8000/contract/details
Content-Type: multipart/form-data
Body: file (PDF/DOCX)
```

**Response:**
```json
{
  "success": true,
  "contract_details": {
    "contract_name": "Surat Perjanjian Kontrak Kerja",
    "first_party": {
      "name": "dr. Titiek Ernawati, S.PM",
      "type": "individu",
      "address": "Wisma Permai Tengah III/BB1, Surabaya"
    },
    "second_party": {
      "name": "Ir. Achmad Ridho'I, ST.",
      "type": "perusahaan", 
      "address": "Perum Mangliawan Permai E-39, Kec. Pakis, Kab. Malang"
    },
    "contract_end_date": "20 Februari 2025",
    "contract_start_date": "20 Februari 2025",
    "contract_duration": "365 hari kalender",
    "contract_value": "Rp 4.338.283.000,00",
    "contract_type": "Surat Perjanjian Kontrak Kerja",
    "key_terms": [
      "Pekerjaan Pelaksanaan Pembangunan Rumah Tinggal Wisma Permai Tengah III/BB1"
    ]
  },
  "extracted_text": "--- Page 1 ---\\n\\nPIHAK I...",
  "confidence_score": 0.9,
  "analysis_method": "groq_ai",
  "error_message": null,
  "processing_time": 34.0215003490448
}
```

## Database Schema

### contracts table (updated)
```sql
create table public.contracts (
  id uuid not null default gen_random_uuid (),
  name text not null,                    -- dari contract_details.contract_name
  first_party text null,                 -- dari contract_details.first_party.name
  second_party text null,                -- dari contract_details.second_party.name
  value_rp numeric(18, 2) null,         -- parsed dari contract_value
  duration_months integer null,          -- converted dari contract_duration
  start_date date null,                  -- parsed dari contract_start_date
  end_date date null,                    -- parsed dari contract_end_date
  risk public.risk_level null,          -- dari AI risk analysis
  status public.contract_status null default 'Draft'::contract_status,
  file_url text null,                    -- dari storage upload
  created_by text null,
  created_at timestamp with time zone null default now(),
  constraint contracts_pkey primary key (id)
);
```

### contract_extractions table (new)
```sql
CREATE TABLE public.contract_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    extraction_result JSONB NOT NULL,  -- Full API response
    confidence_score NUMERIC(4,3) NULL,
    analysis_method TEXT NULL,
    processing_time NUMERIC(10,4) NULL,
    extracted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT contract_extractions_contract_id_unique UNIQUE (contract_id)
);
```

## Service Integration

### contractDetailsService.ts
- `extractContractDetails(file)` - Call API untuk ekstrak details
- `saveContractDetails(contractId, details)` - Simpan hasil ke database
- `extractAndSaveContractDetails(contractId, file)` - Full workflow

### riskAnalysisService.ts (updated) 
- `uploadAndAnalyzeContract()` sekarang menjalankan:
  1. Upload file ke storage
  2. Extract contract details (parallel)
  3. Analyze risk (parallel) 
  4. Return gabungan hasil

### Upload.tsx (updated)
- Progress indicators untuk extraction dan analysis
- Error handling yang lebih detail
- Success notification dengan status setiap proses

## Data Flow

1. **User upload file** → Upload.tsx
2. **File validation** → File type/size check
3. **Create contract record** → Basic contract entry
4. **Upload to storage** → Supabase storage
5. **Extract details** → Contract details API (parallel)
6. **Analyze risk** → Risk analysis API (parallel)  
7. **Save to database** → Update contracts table + save extraction results
8. **Show results** → User notification dengan status

## Error Handling

- Auth token refresh handled by `authHelper.ts`
- API errors logged dan tracked
- Partial failures handled (e.g. details success, analysis fails)
- Database schema mismatches corrected
- File upload errors properly propagated

## Testing

Untuk test full workflow:

1. Start backend servers:
   ```bash
   # Risk analysis server
   cd backend && python main.py
   
   # Contract details server (jika terpisah)
   # Sesuaikan dengan setup backend Anda
   ```

2. Start frontend:
   ```bash
   cd frontend && npm run dev
   ```

3. Upload test file di `/procurement/upload`
4. Monitor browser console untuk log API calls
5. Check database untuk data yang tersimpan

## Database Setup

Jalankan migration SQL files:

```bash
# Setup contract_extractions table
psql -h localhost -d your_db -f supabase/contract_extractions.sql

# Atau via Supabase dashboard SQL editor
```