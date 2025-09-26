import pandas as pd
from transformers import MarianMTModel, MarianTokenizer
from tqdm import tqdm

# Load dataset
df = pd.read_csv("master_clauses_clean.csv")

# Load translator EN → ID
model_name = "Helsinki-NLP/opus-mt-en-id"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

def translate(text):
    if not isinstance(text, str) or text.strip() == "":
        return ""
    inputs = tokenizer([text], return_tensors="pt", truncation=True, padding=True)
    translated = model.generate(**inputs, max_length=256)
    return tokenizer.decode(translated[0], skip_special_tokens=True)

# Pilih kolom yang relevan untuk kontrak ILCS
target_clauses = [
    "Termination For Convenience",
    "Audit Rights",
    "Cap On Liability",
    "Liquidated Damages",
    "Price Restrictions",
    "Minimum Commitment",
    "Revenue/Profit Sharing"
]

# Loop tiap klausul dan buat kolom baru hasil translate
tqdm.pandas()
for clause in target_clauses:
    if clause in df.columns:
        df[f"{clause}_id"] = df[clause].progress_apply(translate)

# Simpan hasil
df.to_csv("master_clauses_translated.csv", index=False, encoding="utf-8")

print("✅ Translasi selesai → disimpan ke master_clauses_translated.csv")
