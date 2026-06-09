import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("🔄 Starting Final Adaptive ETL Pipeline...")

# 1. NLP Pipeline (Kept as is for your Chatbot)
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
# 🔹 UPDATED: Loading the new 5,000-row dataset
print("📥 Extracting User data from indian_fitness_dataset_5000.csv...")
df_users = pd.read_csv("indian_fitness_dataset_5000.csv")

print("⚙️ Transforming User metrics...")
# 🔹 UPDATED: Mapped to the new column 'Focus Goals' (plural)
X_users = df_users[['Age', 'Weight (kg)', 'Profile Level', 'Focus Goals']].copy()

le_level = LabelEncoder()
le_goal = LabelEncoder()

# Fit both encoders to ensure the mappings are consistent
X_users['Profile Level'] = le_level.fit_transform(X_users['Profile Level'].astype(str))
X_users['Focus Goals'] = le_goal.fit_transform(X_users['Focus Goals'].astype(str))

# 🔹 Save encoders so your app can translate strings to numbers later
joblib.dump(le_level, 'le_level.pkl')
joblib.dump(le_goal, 'le_goal.pkl')

print("🧠 Training NearestNeighbors Recommender...")
knn_model = NearestNeighbors(n_neighbors=1, metric='euclidean')
knn_model.fit(X_users)

# 🔹 Save the new brain!
joblib.dump(knn_model, 'knn_model.pkl')
joblib.dump(df_users, 'df_users.pkl')

print("✅ Final ETL Process Complete! The AI has learned the new dataset.")