-- Dummy Data untuk Legal Dashboard - Comprehensive Test Data
-- File: legal_dummy_data.sql

-- Insert dummy data untuk semua tabel legal dashboard
-- Data ini akan memberikan gambaran lengkap functionality dashboard

BEGIN;

-- Insert dummy contracts (base data)
INSERT INTO contracts (id, name, first_party, second_party, value_rp, duration_months, start_date, end_date, risk, status, file_url, created_by, created_at, reviewed_by, reviewed_at, legal_priority) VALUES
-- High Risk Contracts
('550e8400-e29b-41d4-a716-446655441001', 'Enterprise Software License Agreement', 'PT ILCS', 'Microsoft Indonesia', 4500000000.00, 36, '2023-01-15', '2026-01-14', 'High', 'Reviewed', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-001.pdf', 'procurement@ilcs.co.id', '2023-01-15 08:00:00+07', 'legal@ilcs.co.id', '2023-01-16 14:30:00+07', 'urgent'),
('550e8400-e29b-41d4-a716-446655441002', 'Data Center Colocation Services', 'PT ILCS', 'PT Telkom Indonesia', 3200000000.00, 60, '2022-06-01', '2027-05-31', 'High', 'Active', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-002.pdf', 'procurement@ilcs.co.id', '2022-06-01 09:15:00+07', 'legal@ilcs.co.id', '2022-06-02 16:45:00+07', 'high'),
('550e8400-e29b-41d4-a716-446655441003', 'Cloud Infrastructure Agreement', 'PT ILCS', 'Amazon Web Services', 6800000000.00, 24, '2023-03-01', '2025-02-28', 'High', 'Active', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-003.pdf', 'procurement@ilcs.co.id', '2023-03-01 10:30:00+07', 'legal@ilcs.co.id', '2023-03-02 11:20:00+07', 'urgent'),

-- Medium Risk Contracts
('550e8400-e29b-41d4-a716-446655441004', 'Office Equipment Rental', 'PT ILCS', 'PT Furniture Solutions', 720000000.00, 18, '2023-09-15', '2025-03-14', 'Medium', 'Active', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-004.pdf', 'procurement@ilcs.co.id', '2023-09-15 14:20:00+07', 'legal@ilcs.co.id', '2023-09-16 09:10:00+07', 'normal'),
('550e8400-e29b-41d4-a716-446655441005', 'Security Services Contract', 'PT ILCS', 'PT Securitas Indonesia', 1800000000.00, 24, '2023-05-01', '2025-04-30', 'Medium', 'Active', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-005.pdf', 'procurement@ilcs.co.id', '2023-05-01 11:45:00+07', 'legal@ilcs.co.id', '2023-05-02 13:25:00+07', 'normal'),
('550e8400-e29b-41d4-a716-446655441006', 'Marketing Services Agreement', 'PT ILCS', 'PT Creative Agency', 950000000.00, 12, '2024-01-10', '2024-12-31', 'Medium', 'Pending Review', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-006.pdf', 'procurement@ilcs.co.id', '2024-01-10 16:30:00+07', NULL, NULL, 'normal'),

-- Low Risk Contracts
('550e8400-e29b-41d4-a716-446655441007', 'Catering Services Contract', 'PT ILCS', 'PT Katering Prima', 480000000.00, 12, '2024-09-20', '2025-09-19', 'Low', 'Active', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-007.pdf', 'procurement@ilcs.co.id', NOW() - INTERVAL '3 days', 'legal@ilcs.co.id', NOW() - INTERVAL '2 days', 'low'),
('550e8400-e29b-41d4-a716-446655441008', 'Cleaning Services Agreement', 'PT ILCS', 'PT Bersih Nusantara', 360000000.00, 18, '2024-09-22', '2026-03-21', 'Low', 'Active', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-008.pdf', 'procurement@ilcs.co.id', NOW() - INTERVAL '5 days', 'legal@ilcs.co.id', NOW() - INTERVAL '4 days', 'low'),
('550e8400-e29b-41d4-a716-446655441009', 'Transportation Services', 'PT ILCS', 'PT Transport Logistik', 1200000000.00, 24, '2024-09-25', '2026-09-24', 'Low', 'Pending Review', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-009.pdf', 'procurement@ilcs.co.id', NOW() - INTERVAL '2 days', NULL, NULL, 'normal'),

-- Recent contracts (for "this week" KPI)
('550e8400-e29b-41d4-a716-446655441010', 'IT Consultant Services', 'PT ILCS', 'PT Tech Consulting', 850000000.00, 6, '2024-09-26', '2025-03-25', 'Medium', 'Pending Review', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-010.pdf', 'procurement@ilcs.co.id', NOW() - INTERVAL '1 day', NULL, NULL, 'high'),
('550e8400-e29b-41d4-a716-446655441011', 'Legal Advisory Services', 'PT ILCS', 'Law Firm Associates', 650000000.00, 12, '2024-09-27', '2025-09-26', 'Low', 'Pending Review', 'https://gjxazvkhtckpfhczoswk.supabase.co/storage/v1/object/public/pdf_storage/contracts/contract-legal-011.pdf', 'procurement@ilcs.co.id', NOW(), NULL, NULL, 'normal')

ON CONFLICT (id) DO NOTHING;

-- Insert contract entities (AI analysis results)
INSERT INTO contract_entities (contract_id, first_party, second_party, value_rp, duration_months, penalty, initial_risk, analyzed_at) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'PT Integrasi Logistik Cipta Solusi', 'Microsoft Indonesia', 4500000000.00, 36, 'Penalty for early termination: 25% of remaining contract value. Service level penalties: 2% per incident up to 10% of monthly fee', 'High', '2023-01-16 10:15:00+07'),
('550e8400-e29b-41d4-a716-446655441002', 'PT Integrasi Logistik Cipta Solusi', 'PT Telkom Indonesia', 3200000000.00, 60, 'Force majeure limited to 90 days. Breach penalties up to 15% of annual contract value', 'High', '2022-06-02 11:30:00+07'),
('550e8400-e29b-41d4-a716-446655441003', 'PT Integrasi Logistik Cipta Solusi', 'Amazon Web Services', 6800000000.00, 24, 'Data breach penalties: up to $50,000 per incident. Service downtime penalties: 5% monthly fee per hour', 'High', '2023-03-02 14:45:00+07'),
('550e8400-e29b-41d4-a716-446655441004', 'PT Integrasi Logistik Cipta Solusi', 'PT Furniture Solutions', 720000000.00, 18, 'Standard equipment replacement within 48 hours. Late penalty: 0.1% per day', 'Medium', '2023-09-16 15:20:00+07'),
('550e8400-e29b-41d4-a716-446655441005', 'PT Integrasi Logistik Cipta Solusi', 'PT Securitas Indonesia', 1800000000.00, 24, 'Security breach penalties: up to 20% annual fee. Response time violations: Rp 5,000,000 per incident', 'Medium', '2023-05-02 16:10:00+07'),
('550e8400-e29b-41d4-a716-446655441007', 'PT Integrasi Logistik Cipta Solusi', 'PT Katering Prima', 480000000.00, 12, 'Food safety violations: immediate termination. Quality issues: warning system with 3 strikes', 'Low', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655441008', 'PT Integrasi Logistik Cipta Solusi', 'PT Bersih Nusantara', 360000000.00, 18, 'Performance standards: 95% completion rate. Penalty: 2% monthly fee per percentage below', 'Low', NOW() - INTERVAL '4 days')

ON CONFLICT (id) DO NOTHING;

-- Insert risk findings (detailed findings for each contract)
INSERT INTO risk_findings (contract_id, section, level, title, severity_score, recommendation, status, created_at) VALUES
-- High Risk Contract Findings
('550e8400-e29b-41d4-a716-446655441001', 'Termination Clause 8.2', 'High', 'Excessive early termination penalties detected', 9, 'Negotiate to reduce penalty to 10-15% of remaining value', 'open', '2023-01-16 10:30:00+07'),
('550e8400-e29b-41d4-a716-446655441001', 'Intellectual Property Section 12', 'High', 'IP ownership rights heavily favor vendor', 8, 'Include explicit work product ownership clauses', 'acknowledged', '2023-01-16 10:45:00+07'),
('550e8400-e29b-41d4-a716-446655441001', 'Liability Limitation 15.3', 'Medium', 'Liability cap may be insufficient for business risks', 6, 'Increase liability cap to at least 2x annual contract value', 'open', '2023-01-16 11:00:00+07'),

('550e8400-e29b-41d4-a716-446655441002', 'Force Majeure 14.1', 'High', 'Force majeure clause too restrictive', 8, 'Expand force majeure definition and extend notice period', 'resolved', '2022-06-02 12:00:00+07'),
('550e8400-e29b-41d4-a716-446655441002', 'Service Level Agreement 6.2', 'Medium', 'SLA penalties disproportionate to service value', 7, 'Cap SLA penalties at 5% of monthly fees', 'open', '2022-06-02 12:15:00+07'),
('550e8400-e29b-41d4-a716-446655441002', 'Data Security 11.4', 'High', 'Inadequate data security requirements', 9, 'Require ISO 27001 certification and regular security audits', 'acknowledged', '2022-06-02 12:30:00+07'),

('550e8400-e29b-41d4-a716-446655441003', 'Data Processing 9.1', 'High', 'Data processing terms lack GDPR compliance', 9, 'Add comprehensive GDPR compliance clauses', 'open', '2023-03-02 15:00:00+07'),
('550e8400-e29b-41d4-a716-446655441003', 'Service Credits 7.3', 'Medium', 'Service credit calculation methodology unclear', 5, 'Define clear service credit calculation formula', 'open', '2023-03-02 15:15:00+07'),

-- Medium Risk Findings
('550e8400-e29b-41d4-a716-446655441004', 'Equipment Replacement 5.1', 'Medium', 'Equipment replacement timeline too lenient', 5, 'Reduce replacement timeline to 24 hours for critical equipment', 'open', '2023-09-16 16:00:00+07'),
('550e8400-e29b-41d4-a716-446655441004', 'Insurance Coverage 13.2', 'Medium', 'Insurance coverage limits may be insufficient', 6, 'Increase minimum insurance coverage to Rp 1 billion', 'acknowledged', '2023-09-16 16:15:00+07'),

('550e8400-e29b-41d4-a716-446655441005', 'Background Check 4.3', 'Medium', 'Security personnel background check requirements unclear', 6, 'Specify detailed background check requirements and intervals', 'open', '2023-05-02 17:00:00+07'),
('550e8400-e29b-41d4-a716-446655441005', 'Incident Reporting 10.2', 'High', 'Security incident reporting timeline too long', 8, 'Require immediate notification within 2 hours', 'open', '2023-05-02 17:15:00+07'),

('550e8400-e29b-41d4-a716-446655441006', 'Payment Terms 3.4', 'Medium', 'Payment terms favor vendor with long payment cycles', 5, 'Negotiate standard 30-day payment terms', 'open', '2024-01-10 17:00:00+07'),

-- Low Risk Findings  
('550e8400-e29b-41d4-a716-446655441007', 'Quality Standards 2.1', 'Low', 'Food quality standards could be more specific', 3, 'Add detailed food quality and freshness requirements', 'acknowledged', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655441008', 'Performance Metrics 6.1', 'Low', 'Cleaning performance metrics need clarification', 4, 'Define specific cleanliness standards and measurement methods', 'open', NOW() - INTERVAL '4 days'),

-- Recent findings
('550e8400-e29b-41d4-a716-446655441010', 'Deliverable Timeline 4.2', 'Medium', 'Project deliverable timelines are aggressive', 6, 'Add buffer time for complex deliverables', 'open', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655441011', 'Confidentiality 8.1', 'Low', 'Client confidentiality clauses standard but could be stronger', 3, 'Add specific penalties for confidentiality breaches', 'open', NOW())

ON CONFLICT (id) DO NOTHING;

-- Insert legal notes
INSERT INTO legal_notes (contract_id, author, note, created_at) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'legal@ilcs.co.id', 'Contract negotiation completed after 3 rounds. Key issues: termination penalties and IP ownership. Vendor agreed to reduce penalty by 5% but refused IP ownership changes. Recommended for approval with annual review.', '2023-01-16 14:30:00+07'),
('550e8400-e29b-41d4-a716-446655441001', 'legal@ilcs.co.id', 'Post-signature review: Monitor compliance with SLA requirements. Schedule quarterly review meetings with vendor to address performance issues.', '2023-01-20 10:15:00+07'),

('550e8400-e29b-41d4-a716-446655441002', 'legal@ilcs.co.id', 'Extended negotiation period due to data security requirements. Final agreement includes additional security audits and compliance reporting. Force majeure clause resolved favorably.', '2022-06-02 16:45:00+07'),
('550e8400-e29b-41d4-a716-446655441002', 'senior-legal@ilcs.co.id', '6-month performance review: Vendor meeting SLA requirements. Data security audits completed successfully. No issues to report.', '2022-12-02 14:20:00+07'),

('550e8400-e29b-41d4-a716-446655441003', 'legal@ilcs.co.id', 'High-value contract requiring board approval. GDPR compliance terms added per request. Cloud security requirements exceed industry standard. Recommended for approval.', '2023-03-02 11:20:00+07'),

('550e8400-e29b-41d4-a716-446655441004', 'legal@ilcs.co.id', 'Standard equipment rental contract with minor modifications. Insurance requirements updated to current standards. Ready for procurement signature.', '2023-09-16 09:10:00+07'),

('550e8400-e29b-41d4-a716-446655441005', 'legal@ilcs.co.id', 'Security services contract reviewed and approved. Background check requirements strengthened. Incident reporting procedures clarified and accepted by vendor.', '2023-05-02 13:25:00+07'),

('550e8400-e29b-41d4-a716-446655441006', 'legal@ilcs.co.id', 'Marketing agreement under review. Payment terms need adjustment. Intellectual property clauses for creative work require clarification. Pending vendor response.', '2024-01-10 17:30:00+07'),

('550e8400-e29b-41d4-a716-446655441007', 'legal@ilcs.co.id', 'Simple catering contract with standard terms. Food safety requirements updated per current regulations. No significant legal risks identified.', NOW() - INTERVAL '2 days'),

('550e8400-e29b-41d4-a716-446655441008', 'legal@ilcs.co.id', 'Cleaning services agreement approved with minor modifications to performance standards. Environmental requirements added per company policy.', NOW() - INTERVAL '4 days'),

('550e8400-e29b-41d4-a716-446655441009', 'legal@ilcs.co.id', 'Transportation contract pending final review. Insurance coverage verified. Driver background check requirements confirmed with vendor.', NOW() - INTERVAL '2 days'),

('550e8400-e29b-41d4-a716-446655441010', 'legal@ilcs.co.id', 'IT consulting agreement requires timeline adjustment. Technical specifications review completed. Awaiting final approval from technical team.', NOW() - INTERVAL '1 day'),

('550e8400-e29b-41d4-a716-446655441011', 'legal@ilcs.co.id', 'Legal advisory services contract under initial review. Conflict of interest provisions standard. Fee structure reasonable compared to market rates.', NOW())

ON CONFLICT (id) DO NOTHING;

-- Insert contract approvals (workflow tracking)
INSERT INTO contract_approvals (contract_id, action, actor, comment, created_at) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'approve', 'legal@ilcs.co.id', 'Approved after successful negotiation of key terms. Monitor termination clause implementation.', '2023-01-16 14:35:00+07'),
('550e8400-e29b-41d4-a716-446655441002', 'approve', 'senior-legal@ilcs.co.id', 'High-value contract approved. Security requirements meet compliance standards.', '2022-06-02 16:50:00+07'),
('550e8400-e29b-41d4-a716-446655441003', 'approve', 'senior-legal@ilcs.co.id', 'Cloud infrastructure contract approved for maximum 24-month term with annual review.', '2023-03-02 11:25:00+07'),
('550e8400-e29b-41d4-a716-446655441004', 'approve', 'legal@ilcs.co.id', 'Equipment rental approved. Standard terms with updated insurance requirements.', '2023-09-16 09:15:00+07'),
('550e8400-e29b-41d4-a716-446655441005', 'approve', 'legal@ilcs.co.id', 'Security services approved with enhanced background check procedures.', '2023-05-02 13:30:00+07'),
('550e8400-e29b-41d4-a716-446655441006', 'request_revision', 'legal@ilcs.co.id', 'Payment terms require adjustment. IP clauses need clarification before approval.', '2024-01-10 17:35:00+07'),
('550e8400-e29b-41d4-a716-446655441007', 'approve', 'legal@ilcs.co.id', 'Catering services approved. Food safety compliance verified.', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655441008', 'approve', 'legal@ilcs.co.id', 'Cleaning services approved with environmental compliance requirements.', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655441009', 'request_revision', 'legal@ilcs.co.id', 'Insurance coverage documentation needs update before final approval.', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655441010', 'request_revision', 'legal@ilcs.co.id', 'Timeline adjustment required. Technical review pending.', NOW() - INTERVAL '1 day')

ON CONFLICT (id) DO NOTHING;

-- Insert historical legal KPI data
INSERT INTO legal_kpi (contracts_this_week, high_risk, pending_ai, calculated_at, created_at) VALUES
(0, 2, 8, '2024-09-01 23:59:59+07', '2024-09-01 23:59:59+07'),
(1, 2, 7, '2024-09-08 23:59:59+07', '2024-09-08 23:59:59+07'),
(0, 3, 6, '2024-09-15 23:59:59+07', '2024-09-15 23:59:59+07'),
(2, 3, 4, '2024-09-22 23:59:59+07', '2024-09-22 23:59:59+07'),
(3, 3, 2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')

ON CONFLICT DO NOTHING;

COMMIT;

-- Verify data insertion with sample queries
SELECT 'Contracts Summary' as summary;
SELECT 
    risk,
    status,
    COUNT(*) as count
FROM contracts 
WHERE id::text LIKE '550e8400-e29b-41d4-a716-44665544%'
GROUP BY risk, status 
ORDER BY risk DESC, status;

SELECT 'Risk Findings Summary' as summary;
SELECT 
    level,
    status,
    COUNT(*) as count
FROM risk_findings rf
JOIN contracts c ON rf.contract_id = c.id
WHERE c.id::text LIKE '550e8400-e29b-41d4-a716-44665544%'
GROUP BY level, status
ORDER BY level DESC, status;

SELECT 'Legal KPI Current State' as summary;
SELECT * FROM legal_dashboard_kpi;

-- Insert AI Risk Analysis data (sesuai format JSON yang diberikan)
INSERT INTO ai_risk_analysis (contract_id, analysis_result, created_at) VALUES
('550e8400-e29b-41d4-a716-446655441001', '{
  "success": true,
  "risk_level": "High",
  "confidence": 0.89,
  "risk_factors": [
    {
      "type": "penalty_clause",
      "description": "Klausul denda yang sangat ketat dengan penalty 25% dari nilai kontrak",
      "severity": "High",
      "found_keywords": ["penalty", "termination", "breach"],
      "keyword_count": 3
    },
    {
      "type": "liability_limitation", 
      "description": "Keterbatasan liability yang tidak seimbang",
      "severity": "Medium",
      "found_keywords": ["liability", "limitation"],
      "keyword_count": 2
    }
  ],
  "risk_assessment": {
    "description": "Kontrak memiliki tingkat risiko tinggi dengan klausul penalty dan IP yang tidak menguntungkan",
    "confidence_interpretation": "Sangat yakin - hasil analisis sangat reliable",
    "recommendations": [
      "Negosiasi ulang klausul terminasi untuk mengurangi penalty",
      "Tambahkan klausul perlindungan IP yang lebih seimbang",
      "Review liability limitation cap minimal 2x nilai kontrak tahunan"
    ],
    "risk_factor_count": 2,
    "high_severity_factors": 1,
    "medium_severity_factors": 1,
    "low_severity_factors": 0
  },
  "processed_text_length": 15000,
  "model_used": "indo_finetuned_bert",
  "error_message": null,
  "analysis_timestamp": "2023-01-16T10:15:00.000000",
  "processing_time": 2.145
}', '2023-01-16 10:15:00+07'),

('550e8400-e29b-41d4-a716-446655441002', '{
  "success": true,
  "risk_level": "High",
  "confidence": 0.85,
  "risk_factors": [
    {
      "type": "force_majeure",
      "description": "Klausul force majeure terlalu terbatas dengan periode 90 hari",
      "severity": "High",
      "found_keywords": ["force majeure", "disaster", "90 days"],
      "keyword_count": 3
    },
    {
      "type": "data_security",
      "description": "Persyaratan keamanan data tidak memadai untuk kontrak nilai tinggi",
      "severity": "High", 
      "found_keywords": ["data security", "breach", "ISO 27001"],
      "keyword_count": 3
    }
  ],
  "risk_assessment": {
    "description": "Kontrak colocation data center dengan risiko tinggi pada keamanan data dan force majeure",
    "confidence_interpretation": "Yakin - hasil analisis reliable dengan sedikit ketidakpastian",
    "recommendations": [
      "Perluas definisi force majeure dan perpanjang periode notifikasi",
      "Wajibkan sertifikasi ISO 27001 dan audit keamanan berkala",
      "Tambahkan klausul data breach notification dalam 2 jam"
    ],
    "risk_factor_count": 2,
    "high_severity_factors": 2,
    "medium_severity_factors": 0,
    "low_severity_factors": 0
  },
  "processed_text_length": 18500,
  "model_used": "indo_finetuned_bert",
  "error_message": null,
  "analysis_timestamp": "2022-06-02T11:30:00.000000",
  "processing_time": 3.278
}', '2022-06-02 11:30:00+07'),

('550e8400-e29b-41d4-a716-446655441003', '{
  "success": true,
  "risk_level": "High",
  "confidence": 0.92,
  "risk_factors": [
    {
      "type": "data_processing",
      "description": "Ketentuan pemrosesan data tidak memenuhi standar GDPR",
      "severity": "High",
      "found_keywords": ["data processing", "GDPR", "privacy"],
      "keyword_count": 3
    },
    {
      "type": "service_credits",
      "description": "Kalkulasi service credit tidak jelas dan berpotensi merugikan",
      "severity": "Medium",
      "found_keywords": ["service credit", "downtime", "SLA"],
      "keyword_count": 3
    }
  ],
  "risk_assessment": {
    "description": "Kontrak cloud infrastructure dengan risiko tinggi pada compliance GDPR dan service credit",
    "confidence_interpretation": "Sangat yakin - analisis komprehensif dengan tingkat kepercayaan tinggi",
    "recommendations": [
      "Tambahkan klausul GDPR compliance yang komprehensif",
      "Definisikan formula kalkulasi service credit yang jelas",
      "Batasi penalty data breach maksimal $50,000 per incident"
    ],
    "risk_factor_count": 2,
    "high_severity_factors": 1,
    "medium_severity_factors": 1,
    "low_severity_factors": 0
  },
  "processed_text_length": 20000,
  "model_used": "indo_finetuned_bert",
  "error_message": null,
  "analysis_timestamp": "2023-03-02T14:45:00.000000",
  "processing_time": 1.89
}', '2023-03-02 14:45:00+07'),

('550e8400-e29b-41d4-a716-446655441004', '{
  "success": true,
  "risk_level": "Medium",
  "confidence": 0.78,
  "risk_factors": [
    {
      "type": "equipment_replacement",
      "description": "Timeline penggantian equipment terlalu longgar",
      "severity": "Medium",
      "found_keywords": ["equipment", "replacement", "48 hours"],
      "keyword_count": 3
    },
    {
      "type": "insurance_coverage",
      "description": "Batas minimum asuransi mungkin tidak mencukupi",
      "severity": "Medium",
      "found_keywords": ["insurance", "coverage", "liability"],
      "keyword_count": 3
    }
  ],
  "risk_assessment": {
    "description": "Kontrak rental equipment dengan risiko sedang pada timeline replacement dan coverage asuransi",
    "confidence_interpretation": "Cukup yakin - hasil analisis dapat diandalkan dengan tingkat kepercayaan moderat",
    "recommendations": [
      "Kurangi timeline replacement equipment kritis menjadi 24 jam",
      "Tingkatkan minimum coverage asuransi ke Rp 1 miliar",
      "Tambahkan klausul backup equipment untuk item kritis"
    ],
    "risk_factor_count": 2,
    "high_severity_factors": 0,
    "medium_severity_factors": 2,
    "low_severity_factors": 0
  },
  "processed_text_length": 8500,
  "model_used": "indo_finetuned_bert", 
  "error_message": null,
  "analysis_timestamp": "2023-09-16T15:20:00.000000",
  "processing_time": 1.334
}', '2023-09-16 15:20:00+07'),

('550e8400-e29b-41d4-a716-446655441007', '{
  "success": true,
  "risk_level": "Low", 
  "confidence": 0.939,
  "risk_factors": [
    {
      "type": "force_majeure",
      "description": "Risiko force majeure",
      "severity": "High",
      "found_keywords": ["bencana alam"],
      "keyword_count": 1
    },
    {
      "type": "penalty_clause",
      "description": "Klausul denda dan sanksi",
      "severity": "Medium", 
      "found_keywords": ["sanksi"],
      "keyword_count": 1
    }
  ],
  "risk_assessment": {
    "description": "Kontrak memiliki tingkat risiko rendah dengan potensi masalah minimal",
    "confidence_interpretation": "Sangat yakin - hasil analisis sangat reliable untuk kontrak standar",
    "recommendations": [
      "Review berkala terhadap pelaksanaan kontrak",
      "Monitoring standar sesuai jadwal", 
      "Dokumentasi yang baik untuk audit trail"
    ],
    "risk_factor_count": 2,
    "high_severity_factors": 1,
    "medium_severity_factors": 1,
    "low_severity_factors": 0
  },
  "processed_text_length": 1000,
  "model_used": "indo_finetuned_bert",
  "error_message": null,
  "analysis_timestamp": "2025-09-27T03:18:51.025141",
  "processing_time": 1.627060890197754
}', NOW() - INTERVAL '2 days'),

-- Tambahan AI analysis untuk kontrak lainnya  
('550e8400-e29b-41d4-a716-446655441005', '{
  "success": true,
  "risk_level": "Medium",
  "confidence": 0.82,
  "risk_factors": [
    {
      "type": "background_check", 
      "description": "Persyaratan background check personil keamanan tidak jelas",
      "severity": "Medium",
      "found_keywords": ["background check", "security personnel"],
      "keyword_count": 2
    },
    {
      "type": "incident_reporting",
      "description": "Timeline pelaporan insiden keamanan terlalu panjang", 
      "severity": "High",
      "found_keywords": ["incident", "reporting", "notification"],
      "keyword_count": 3
    }
  ],
  "risk_assessment": {
    "description": "Kontrak security services dengan risiko medium pada prosedur background check dan incident reporting",
    "confidence_interpretation": "Yakin - hasil analisis dapat diandalkan dengan tingkat kepercayaan baik",
    "recommendations": [
      "Spesifikasi persyaratan background check yang detail dan interval pembaruan",
      "Wajibkan notifikasi insiden keamanan dalam 2 jam", 
      "Tambahkan klausul audit berkala untuk personil keamanan"
    ],
    "risk_factor_count": 2,
    "high_severity_factors": 1,
    "medium_severity_factors": 1,
    "low_severity_factors": 0
  },
  "processed_text_length": 12000,
  "model_used": "indo_finetuned_bert",
  "error_message": null,
  "analysis_timestamp": "2023-05-02T17:15:00.000000",
  "processing_time": 1.945
}', '2023-05-02 17:15:00+07'),

('550e8400-e29b-41d4-a716-446655441008', '{
  "success": true,
  "risk_level": "Low",
  "confidence": 0.88,
  "risk_factors": [
    {
      "type": "performance_metrics",
      "description": "Metrik performa cleaning perlu klarifikasi lebih lanjut",
      "severity": "Low", 
      "found_keywords": ["performance", "cleanliness", "standards"],
      "keyword_count": 3
    },
    {
      "type": "environmental_compliance",
      "description": "Kepatuhan lingkungan untuk produk cleaning",
      "severity": "Low",
      "found_keywords": ["environment", "eco-friendly", "compliance"], 
      "keyword_count": 3
    }
  ],
  "risk_assessment": {
    "description": "Kontrak cleaning services dengan tingkat risiko rendah, fokus pada standar performa dan compliance lingkungan",
    "confidence_interpretation": "Yakin - analisis reliable untuk kontrak services standar",
    "recommendations": [
      "Definisikan metrik cleanliness yang spesifik dan metode pengukuran",
      "Tambahkan persyaratan eco-friendly cleaning products",
      "Implementasi jadwal inspection rutin dan feedback system"
    ],
    "risk_factor_count": 2,
    "high_severity_factors": 0,
    "medium_severity_factors": 0, 
    "low_severity_factors": 2
  },
  "processed_text_length": 7500,
  "model_used": "indo_finetuned_bert",
  "error_message": null,
  "analysis_timestamp": "2024-09-23T16:10:00.000000",
  "processing_time": 1.156
}', NOW() - INTERVAL '4 days')

ON CONFLICT (id) DO NOTHING;

-- End of legal dummy data script