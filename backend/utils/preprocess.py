import re
import nltk

# Pastikan sudah download punkt untuk tokenizer bahasa Indonesia
# nltk.download("punkt")

def preprocess_text(text: str):
    """
    Preprocessing teks kontrak bahasa Indonesia:
    - Bersihkan karakter aneh (tetap simpan tanda kontrak penting)
    - Hapus spasi/line kosong berlebih
    - Split menjadi klausa/paragraph
    """
    # Replace karakter aneh hasil OCR tapi tetap simpan tanda kontrak penting
    text = re.sub(r"[^a-zA-Z0-9.,;:/\-()%\n ]", " ", text)

    # Hapus spasi ganda
    text = re.sub(r"[ \t]+", " ", text)

    # Hapus newline berlebih
    text = re.sub(r"\n{2,}", "\n", text)

    # Pisah menjadi paragraph/klausa berdasarkan newline
    raw_clauses = text.split("\n")

    # Bersihkan whitespace tiap klausa dan buang yang terlalu pendek
    clauses = [c.strip() for c in raw_clauses if len(c.strip()) > 3]

    return clauses
