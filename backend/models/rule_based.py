# models/rule_based.py
def rule_based_risk(text: str) -> str:
    low_keywords = ["insurance", "asuransi", "audit"]
    high_keywords = ["uncapped liability", "eksklusif", "sepihak"]

    t = text.lower()
    if any(k in t for k in high_keywords):
        return "High"
    elif any(k in t for k in low_keywords):
        return "Low"
    return "Medium"
