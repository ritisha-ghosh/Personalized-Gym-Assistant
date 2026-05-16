# ml/train_model.py
import pandas as pd # type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
from sklearn.tree import DecisionTreeClassifier # type: ignore
from sklearn.neighbors import NearestNeighbors # type: ignore
from sklearn.preprocessing import LabelEncoder # type: ignore
import joblib # type: ignore
import os

print("🔄 Starting Dual ETL Pipeline...")

# ==========================================
# PIPELINE 1: NLP INTENT CLASSIFICATION
# ==========================================
print("📥 Extracting NLP data from dataset.csv...")
df_nlp = pd.read_csv("dataset.csv")

print("⚙️ Transforming NLP text data...")
vectorizer = TfidfVectorizer(stop_words='english')
X_nlp = vectorizer.fit_transform(df_nlp['query'])
y_nlp = df_nlp['intent']

print("🧠 Training Decision Tree Classifier...")
model_nlp = DecisionTreeClassifier(random_state=42)
model_nlp.fit(X_nlp, y_nlp)

print("📦 Pickling NLP models...")
joblib.dump(vectorizer, 'vectorizer.pkl')
joblib.dump(model_nlp, 'model.pkl')

# ==========================================
# PIPELINE 2: COLLABORATIVE FILTERING 
# ==========================================
print("📥 Extracting User data from user_profiles_demo.csv...")
df_users = pd.read_csv("user_profiles_demo.csv", encoding="latin1")

print("⚙️ Transforming User metrics...")
# 1. Grab the columns and make a safe copy to avoid pandas warnings
X_users = df_users[['Age', 'Weight (kg)', 'Profile Level', 'Focus Goal']].copy()

# 2. Translate the text words into numbers so the AI can do its math
le = LabelEncoder()
X_users['Profile Level'] = le.fit_transform(X_users['Profile Level'].astype(str))
X_users['Focus Goal'] = le.fit_transform(X_users['Focus Goal'].astype(str))

print("🧠 Training NearestNeighbors Recommender...")
# n_neighbors=1 because we want the single closest matching profile
knn_model = NearestNeighbors(n_neighbors=1, metric='euclidean')
knn_model.fit(X_users)

print("📦 Pickling KNN models...")
joblib.dump(knn_model, 'knn_model.pkl')

# Pickle the dataframe so Flask can look up the plan details later
joblib.dump(df_users, 'df_users.pkl')

print("✅ Dual ETL Process Complete! All 4 .pkl files are ready for production.")