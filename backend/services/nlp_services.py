# services/nlp_service.py
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# contoh load Indo-LegalBERT untuk risk classification
model_name = "archi-ai/Indo-LegalBERT"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained("./models/indo_bert")  # fine-tuned kamu

risk_classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

def analyze_contract(text: str):
    # Risk classification
    risk = risk_classifier(text[:512])  # potong kalau terlalu panjang
    return risk
