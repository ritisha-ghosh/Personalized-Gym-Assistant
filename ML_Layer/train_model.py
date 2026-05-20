import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("🔄 Starting Week 9 Adaptive ETL Pipeline...")

# 1. NLP Pipeline
print("📥 Extracting NLP data from dataset.csv...")
df_nlp = pd.read_csv("dataset.csv")
vectorizer = TfidfVectorizer(stop_words='english')
X_nlp = vectorizer.fit_transform(df_nlp['query'])
y_nlp = df_nlp['intent']

model_nlp = DecisionTreeClassifier(random_state=42)
model_nlp.fit(X_nlp, y_nlp)

joblib.dump(vectorizer, 'vectorizer.pkl')
joblib.dump(model_nlp, 'model.pkl')

# 2. KNN Smart Coach Pipeline
print("📥 Extracting User data from user_profiles_demo.csv...")
df_users = pd.read_csv("user_profiles_demo.csv", encoding="latin1")

print("⚙️ Transforming User metrics...")
# Notice the exact header mapping to your new CSV
X_users = df_users[['Age', 'Weight (kg)', 'Profile Level', 'Focus Goal']].copy()

le = LabelEncoder()
X_users['Profile Level'] = le.fit_transform(X_users['Profile Level'].astype(str))
X_users['Focus Goal'] = le.fit_transform(X_users['Focus Goal'].astype(str))

print("🧠 Training NearestNeighbors Recommender...")
knn_model = NearestNeighbors(n_neighbors=1, metric='euclidean')
knn_model.fit(X_users)

joblib.dump(knn_model, 'knn_model.pkl')
joblib.dump(df_users, 'df_users.pkl')

print("✅ Week 9 ETL Process Complete! Models are ready.")