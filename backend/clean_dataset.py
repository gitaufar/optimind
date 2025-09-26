import pandas as pd
import re

# Load
df = pd.read_csv("master_clauses_translated.csv")

# Ambil hanya kolom _id (hasil terjemahan)
id_cols = [col for col in df.columns if col.endswith("_id")]
df_id = df[id_cols]

# Hilangkan baris kosong (semua [] / NaN)
df_id = df_id.replace(r'^\s*\[\s*\]$', '', regex=True)  # hapus []
df_id = df_id.dropna(how="all")

# Bersihkan artefak teks
def clean_text(text):
    if pd.isna(text):
        return ""
    text = re.sub(r'\[|\]|"|Font color.*?#.*?\)', '', text)  # buang [] dan font color
    text = re.sub(r'\s+', ' ', text).strip()  # normalisasi spasi
    return text

for col in df_id.columns:
    df_id[col] = df_id[col].apply(clean_text)

# Contoh: gabungkan semua klausul per baris jadi satu teks
df_id["clause_text"] = df_id.apply(lambda row: " ".join([str(val) for val in row if val]), axis=1)

# Tambahkan kolom label risiko (sementara kosong, isi manual/heuristik)
df_id["risk_level"] = ""

print(df_id[["clause_text", "risk_level"]].head())
