import pandas as pd
import joblib
import re

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

# ===============================
# 🔹 Load Dataset
# ===============================
data = pd.read_csv("improved_training_data.csv")

# Basic cleaning
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text

data["message"] = data["message"].apply(clean_text)

# ===============================
# 🔹 Check Class Distribution
# ===============================
print("Class Distribution:\n")
print(data["department"].value_counts())

# ===============================
# 🔹 Split Dataset
# ===============================
X = data["message"]
y = data["department"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ===============================
# 🔹 Build Pipeline
# ===============================
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1,2),
        stop_words="english",
        max_features=8000
    )),
    ("classifier", LogisticRegression(
        max_iter=3000,
        class_weight="balanced"
    ))
])

# ===============================
# 🔹 Train Model
# ===============================
model.fit(X_train, y_train)

# ===============================
# 🔹 Evaluate Model
# ===============================
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:\n")
print(confusion_matrix(y_test, y_pred))

# ===============================
# 🔹 Save Model
# ===============================
joblib.dump(model, "department_model.pkl")

print("\n✅ Model saved successfully!")

# ===============================
# 🔹 Manual Test Samples
# ===============================
print("\nManual Test Predictions:\n")

test_samples = [
    "Doctor took too long for consultation",
    "Billing amount incorrect",
    "Nurse was rude",
    "Washroom not clean",
    "Pharmacy gave wrong medicine"
]

for text in test_samples:
    prediction = model.predict([text])[0]
    confidence = max(model.predict_proba([text])[0])
    print(f"Text: {text}")
    print(f"Predicted: {prediction} | Confidence: {confidence:.2f}")
    print("-" * 40)