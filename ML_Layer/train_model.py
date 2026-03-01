# ml/train_model.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeClassifier
import joblib
import os

print("🔄 Starting ETL Pipeline...")

# 1. EXTRACT: Load external data
print("📥 Extracting data from dataset.csv...")
df = pd.read_csv("dataset.csv")

# 2. TRANSFORM: Convert text to mathematical vectors (ignoring stop words)
print("⚙️ Transforming text data...")
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['query'])
y = df['intent']

# 3. LOAD / TRAIN: Feed data into the Decision Tree Model
print("🧠 Training Decision Tree Classifier...")
model = DecisionTreeClassifier(random_state=42)
model.fit(X, y)

# 4. PICKLE: Serialize the trained model and vocabulary for instant loading
print("📦 Pickling the model...")
joblib.dump(vectorizer, 'vectorizer.pkl')
joblib.dump(model, 'model.pkl')

print("✅ ETL Process Complete! 'vectorizer.pkl' and 'model.pkl' are ready for production.")