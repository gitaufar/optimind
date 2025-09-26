import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from datasets import Dataset
import evaluate

# 1. Load data
df = pd.read_csv("cleaned_clauses_labeled.csv")
# Hapus baris kosong
df = df[df["clause_text"].notna()].reset_index(drop=True)

# Encode label ke integer
label2id = {"Low": 0, "Medium": 1, "High": 2}
id2label = {v: k for k, v in label2id.items()}
df["label"] = df["risk_level"].map(label2id)

# Split train / test
df_train, df_test = train_test_split(
    df, test_size=0.2, stratify=df["label"], random_state=42
)

# Convert ke Hugging Face Dataset
ds_train = Dataset.from_pandas(df_train[["clause_text", "label"]])
ds_test = Dataset.from_pandas(df_test[["clause_text", "label"]])

# 2. Tokenisasi
model_name = "archi-ai/Indo-LegalBERT"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize_fn(examples):
    return tokenizer(
        examples["clause_text"],
        truncation=True,
        padding="max_length",
        max_length=128
    )

ds_train = ds_train.map(tokenize_fn, batched=True)
ds_test = ds_test.map(tokenize_fn, batched=True)

# 3. Siapkan model
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=len(label2id),
    id2label=id2label,
    label2id=label2id
)

# 4. Metrics pakai evaluate
metric_acc = evaluate.load("accuracy")
metric_f1 = evaluate.load("f1")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    acc = metric_acc.compute(predictions=preds, references=labels)
    f1 = metric_f1.compute(predictions=preds, references=labels, average="macro")
    return {"accuracy": acc["accuracy"], "f1_macro": f1["f1"]}

# 5. TrainingArguments & Trainer
training_args = TrainingArguments(
    output_dir="models/indo_finetuned",
    eval_strategy="epoch",  # Ganti dari evaluation_strategy
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    load_best_model_at_end=True,
    metric_for_best_model="f1_macro",
    greater_is_better=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=ds_train,
    eval_dataset=ds_test,
    compute_metrics=compute_metrics,
    tokenizer=tokenizer
)

# 6. Mulai training
trainer.train()

# 7. Simpan model akhir
trainer.save_model("models/indo_bert")
tokenizer.save_pretrained("models/indo_bert")