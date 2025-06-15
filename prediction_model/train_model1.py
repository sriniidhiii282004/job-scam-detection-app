import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import os

# --- 1. Load and Prepare Your Data ---
# In a real scenario, you'd load your actual job data from a CSV, database, etc.
# Make sure your data includes features and a 'is_fraud' column.

# Dummy Data for Demonstration:
# Replace this with your actual dataset!
# data = {
#     'job_title_length': [50, 20, 70, 30, 45, 60, 25, 80, 35, 55, 65, 40, 75, 50, 90, 15, 85, 30, 70, 40],
#     'description_word_count': [300, 100, 500, 150, 250, 400, 120, 600, 180, 350, 450, 200, 550, 280, 700, 80, 650, 160, 480, 220],
#     'salary_deviation_factor': [0.5, 0.1, 2.5, 0.2, 0.3, 1.8, 0.15, 3.0, 0.25, 0.7, 1.2, 0.4, 2.8, 0.6, 3.5, 0.05, 3.2, 0.22, 2.0, 0.33],
#     'contains_suspicious_keywords': [False, False, True, False, False, True, False, True, False, False, True, False, True, False, True, False, True, False, True, False],
#     'company_info_missing': [False, False, True, False, False, True, False, True, False, False, True, False, True, False, True, False, True, False, True, False],
#     'is_fraud': [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] # 1 for fraud, 0 for legitimate
# }
data = pd.read_csv("https://coding-platform.s3.amazonaws.com/dev/lms/tickets/4c8465f0-fce0-484f-8497-d25feaa8e995/NqndMEyZakuimmFI.csv")
df = pd.DataFrame(data)

# Convert boolean columns to integers if your model expects numerical input
# Many scikit-learn models prefer numerical features
df['contains_suspicious_keywords'] = df['contains_suspicious_keywords'].astype(int)
df['company_info_missing'] = df['company_info_missing'].astype(int)

# Define features (X) and target (y)
X = df.drop('is_fraud', axis=1)
y = df['is_fraud']

# Store the exact order of features that your model expects
# This is CRUCIAL for the FastAPI service to ensure correct predictions
feature_columns_for_model = X.columns.tolist()
print("Features used for training (and their order):", feature_columns_for_model)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)


# --- 2. Initialize and Train Your Model ---
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced') # 'balanced' helps with imbalanced data
model.fit(X_train, y_train)


# --- 3. Evaluate Your Model (Highly Recommended) ---
y_pred = model.predict(X_test)
print("\nModel Evaluation on Test Set:")
print(classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")


# --- 4. Save the Trained Model and Feature Columns ---
# Define the directory where models will be saved
MODEL_SAVE_DIR = "models" # Adjust this path if your training script is in a different location relative to 'prediction_service'

# Create the directory if it doesn't exist
os.makedirs(MODEL_SAVE_DIR, exist_ok=True)

# Define full paths for the model and feature columns
MODEL_FILE_PATH = os.path.join(MODEL_SAVE_DIR, "job_fraud_detection_model.pkl")
FEATURE_COLUMNS_FILE_PATH = os.path.join(MODEL_SAVE_DIR, "feature_columns.pkl")

# Save the model
joblib.dump(model, MODEL_FILE_PATH)
print(f"\nModel saved to: {MODEL_FILE_PATH}")

# Save the feature columns list
joblib.dump(feature_columns_for_model, FEATURE_COLUMNS_FILE_PATH)
print(f"Feature columns saved to: {FEATURE_COLUMNS_FILE_PATH}")

print("\nTraining and model saving process complete.")
print("Now you can use these saved files in your FastAPI prediction service.")