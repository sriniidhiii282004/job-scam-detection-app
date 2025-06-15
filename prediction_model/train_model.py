import pandas as pd
import os
import re
import nltk
import joblib
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

nltk.download('stopwords')

# Text cleaning function
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    text = ' '.join([word for word in text.split() if word not in stopwords.words('english')])
    return text

# --- 1. Load and Prepare Your Data ---
# In a real scenario, you'd load your actual job data from a CSV, database, etc.
# Make sure your data includes features and a 'fraudulent' column.

# Load train data
train_df = pd.read_csv("https://coding-platform.s3.amazonaws.com/dev/lms/tickets/4c8465f0-fce0-484f-8497-d25feaa8e995/NqndMEyZakuimmFI.csv")
columns = ['title', 'company_profile', 'description', 'requirements', 'fraudulent']
train_df = train_df[columns]

# Combine fields
train_df['combined_text'] = train_df['title'].fillna('') + ' ' + train_df['company_profile'].fillna('') + ' ' + train_df['description'].fillna('') + ' ' + train_df['requirements'].fillna('')
train_df['cleaned_text'] = train_df['combined_text'].apply(clean_text)

# TF-IDF vectorization
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(train_df['cleaned_text'])
y = train_df['fraudulent']

# Train-test split (optional for internal evaluation)
X_train, X_val, y_train, y_val = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)


# --- 3. Evaluate Your Model (Highly Recommended) ---
y_pred = model.predict(X_train)
print("\nModel Evaluation on Test Set:")
print(classification_report(y_train, y_pred))
print(f"Accuracy: {accuracy_score(y_train, y_pred):.4f}")


# --- 4. Save the Trained Model and Feature Columns ---
# Define the directory where models will be saved
MODEL_SAVE_DIR = "models" # Adjust this path if your training script is in a different location relative to 'prediction_service'

# Create the directory if it doesn't exist
os.makedirs(MODEL_SAVE_DIR, exist_ok=True)

# Define full paths for the model and feature columns
MODEL_FILE_PATH = os.path.join(MODEL_SAVE_DIR, "job_fraud_detection_model.pkl")
VECTORIZER_FILE_PATH = os.path.join(MODEL_SAVE_DIR, "tfidf_vectorizer.pkl")

# Save model & vectorizer
joblib.dump(model, MODEL_FILE_PATH)
print(f"\nModel saved to: {MODEL_FILE_PATH}")

joblib.dump(vectorizer, VECTORIZER_FILE_PATH)
print(f"\Vectoriser saved to: {VECTORIZER_FILE_PATH}")

print("\nTraining and model saving process complete.")
print("Now you can use these saved files in your FastAPI prediction service.")