import pandas as pd

# Load dataset
df = pd.read_csv("master_clauses.csv")

print("Jumlah kolom awal:", len(df.columns))

# 1. Drop kolom metadata yang tidak dibutuhkan
meta_cols = ["Filename", "Document Name", "Document Name-Answer"]
df_clean = df.drop(columns=[c for c in meta_cols if c in df.columns])

# 2. Hapus baris yang semua klausul kosong (NaN semua)
df_clean = df_clean.dropna(how="all")

# 3. Isi nilai kosong dengan string kosong biar rapi
df_clean = df_clean.fillna("")

# 4. Rapikan nama kolom (hapus spasi berlebih)
df_clean.columns = [c.strip() for c in df_clean.columns]

print("Jumlah kolom setelah clean:", len(df_clean.columns))
print("Contoh kolom:", df_clean.columns[:10])
print("Jumlah baris:", len(df_clean))

# Simpan hasil
df_clean.to_csv("master_clauses_clean.csv", index=False, encoding="utf-8")
print("✅ Dataset bersih disimpan ke master_clauses_clean.csv")
