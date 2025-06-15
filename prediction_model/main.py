# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os
import logging # For better logging than just print()

# Set up basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Define the path to your model files.
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "job_fraud_detection_model.pkl") # Assuming you fixed the filename in train_model.py
VECTORIZER_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")


app = FastAPI(
    title="Job Fraud Detection API",
    description="API for classifying job postings as fraudulent or legitimate.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


class JobFeatures(BaseModel):
    # # IMPORTANT: Ensure these field names and types EXACTLY match
    # # what your Node.js frontend sends and what your model was trained on.
    # job_title_length: int = Field(..., description="Length of the job title string.")
    # description_word_count: int = Field(..., description="Total number of words in the job description.")
    # salary_deviation_factor: float = Field(..., description="Factor by which salary deviates from typical for the role (e.g., >1 for higher).")
    # # You had 'contains_keywords_flag' in your original JobFeatures, but you are sending
    # # 'contains_suspicious_keywords' from Node.js. Choose one and stick to it,
    # # and make sure the type (int vs bool) matches as well.
    # contains_suspicious_keywords: int = Field(..., description="1 if suspicious keywords found, 0 otherwise.")
    # company_info_missing: int = Field(..., description="1 if critical company info is missing, 0 otherwise.")
    # # Add ALL other features your model uses.

    job_id: str = Field(... , description = "Identifier for job")
    title: str = Field(... , description = "Title of the job"),
    location: str = Field(... , description = "Location of the job")
    department: str = Field(... , description = "Department of the job")
    salary_range: str = Field(... , description = "Salary range of the job")
    company_profile: str = Field(... , description = "Company profile")
    description:str = Field(... , description = "Description of the job")
    requirements: str = Field(... , description = "Requirements of the job")
    benefits:str = Field(... , description = "Benefits given by the company for the job")
    telecommuting: str = Field(... , description = "Tele communication done for job")
    has_company_logo: str = Field(... , description = "Job contains company logo or not")
    has_questions: str = Field(... , description ="has_questions")
    employment_type: str = Field(... , description = "Employment type for the job")
    required_experience: str = Field(... , description = "Experience required for the job")
    required_education: str = Field(... , description = "Eductaion required for the job")
    industry: str = Field(... , description = "Industry of the job" )
    function: str = Field(... , description = "Role of the job" )
    fraudulent: str = Field(... , description = "Whether the job is fraud or genuine")


model = None
feature_columns = None
vectorizer = None


@app.on_event("startup")
async def load_ml_model():
    # ... (your existing model loading code) ...
    global model
    global feature_columns
    global vectorizer

    logger.info("Attempting to load ML model and vectorizer...")

    if not os.path.exists(MODEL_PATH):
        logger.error(f"Model file not found at {MODEL_PATH}. Please ensure your model is saved correctly.")
        raise RuntimeError(f"Model file '{MODEL_PATH}' not found.")
    if not os.path.exists(VECTORIZER_PATH):
         logger.error(f"Vectorizer file not found at {VECTORIZER_PATH}. Please ensure you saved the Vectorizer list.")
         raise RuntimeError(f"Vectorizer file '{VECTORIZER_PATH}' not found.")

    try:
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        logger.info("ML model and Vectorizer loaded successfully!")
        logger.info(f"Expected Features Order: {feature_columns}")
    except Exception as e:
        logger.critical(f"Failed to load ML model or Vectorizer: {e}", exc_info=True)
        raise RuntimeError(f"Failed to load ML model or Vectorizer: {e}")


# @app.post("/predict", summary="Predict if a job posting is fraudulent")
# async def predict_fraud(job_features: JobFeatures): # FastAPI expects job_features to be the incoming data

#     if model is None:
#         raise HTTPException(status_code=503, detail="Prediction model is not loaded yet.")

#     try:
#         # Convert the Pydantic model to a dictionary, then to a pandas DataFrame
#         # This input_data_dict will now contain the data from your Node.js request!
#         input_data_dict = job_features.dict()
#         input_df = pd.DataFrame([input_data_dict])

#         # ... (rest of your prediction logic, which looks correct now) ...

#         if feature_columns is not None:
#              if not all(col in input_df.columns for col in feature_columns):
#                 missing_cols = [col for col in feature_columns if col not in input_df.columns]
#                 raise HTTPException(status_code=400, detail=f"Missing required features: {missing_cols}")
#              input_df = input_df[feature_columns]
#         else:
#             logger.warning("Warning: feature_columns not loaded, relying on input data order.") # Changed from print

#         prediction_proba = model.predict_proba(input_df)[:, 1][0]
#         prediction_class = int(model.predict(input_df)[0])

#         return {
#             "is_fraudulent": bool(prediction_class),
#             "fraud_probability": float(prediction_proba),
#             "confidence": "high" if prediction_proba > 0.8 else ("medium" if prediction_proba > 0.6 else "low")
#         }

#     except KeyError as e:
#         logger.error(f"Schema mismatch: Missing expected feature in input: {e}. Input: {job_features.dict()}", exc_info=True) # Changed from print
#         raise HTTPException(status_code=400, detail=f"Missing expected feature in input: {e}. Please check your input JSON against the JobFeatures schema.")
#     except Exception as e:
#         logger.critical(f"An unexpected error occurred during prediction: {e}", exc_info=True) # Changed from print
#         raise HTTPException(status_code=500, detail=f"Internal server error during prediction: {e}")


@app.post("/predict")
async def predict_fraud(request: JobFeatures):
    print('request is=====', request)
    if model is None or vectorizer is None:
        return {"error": "Model not loaded. Please restart the application."}

    # 1. Clean the incoming text which is a combination of title, 
    #    company profile, description and requirements

    combined_text_for_prediction = (
        request.title + ' ' +
        request.company_profile + ' ' +
        request.description + ' ' +
        request.requirements
    )

    cleaned_text = clean_text(combined_text_for_prediction)

    try:
        # 2. Transform the cleaned text using the loaded vectorizer
        transformed_vect = vectorizer.transform([cleaned_text])

        # 3. Make prediction using the loaded model
        prediction = model.predict(transformed_vect)
        prediction_proba = model.predict_proba(transformed_vect)[:, 1] # Probability of being fraudulent

        is_fraudulent = bool(prediction[0])
        probability = float(prediction_proba[0])

        return {
            "is_fraudulent": is_fraudulent,
            "probability": probability
        }
    except Exception as e:
        print(f"Error during prediction: {e}")
        return {"error": f"Prediction failed: {e}"}, 500

# Remember to also include your clean_text function in main.py:
def clean_text(text):
    import re
    import nltk
    from nltk.corpus import stopwords
    try:
        nltk.data.find('corpora/stopwords')
    except nltk.downloader.DownloadError:
        nltk.download('stopwords')

    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    text = ' '.join([word for word in text.split() if word not in stopwords.words('english')])
    return text