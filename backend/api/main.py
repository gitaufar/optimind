from fastapi import FastAPI
import pandas as pd

app = FastAPI(title="ILCS Contract AI API")

df = pd.read_csv("master_clauses_translated.csv")

@app.post("/analyze")
def analyze_contract(file: UploadFile = File(...)):
    # TODO: OCR/Parser dokumen kontrak
    extracted = {
        "parties": ["PT A", "PT B"],
        "agreement_date": "2025-01-15",
        "effective_date": "2025-02-01",
        "expiration_date": "2026-01-31",
        "value": "Rp 2.000.000.000"
    }
    return {"status": "success", "extracted": extracted}

@app.post("/risk")
def assess_risk(data: dict):
    text = data.get("clause", "")
    # Dummy rule-based
    if "terminate" in text.lower():
        risk = "High"
    elif "penalty" in text.lower() or "denda" in text.lower():
        risk = "Medium"
    else:
        risk = "Low"
    
    return {"clause": text, "risk_level": risk}

from datetime import datetime

@app.post("/lifecycle")
def lifecycle_tracker(data: dict):
    effective_date = datetime.strptime(data.get("effective_date"), "%Y-%m-%d")
    expiration_date = datetime.strptime(data.get("expiration_date"), "%Y-%m-%d")
    today = datetime.today()

    if today > expiration_date:
        status = "Expired"
    elif (expiration_date - today).days < 30:
        status = "Expiring Soon"
    else:
        status = "Active"

    return {
        "effective_date": str(effective_date.date()),
        "expiration_date": str(expiration_date.date()),
        "status": status
    }

