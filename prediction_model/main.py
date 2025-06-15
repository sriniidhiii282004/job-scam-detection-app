# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os
import logging # For better logging than just print()
import plotly.express as px
import json

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

TRAINING_DATA_PATH = "https://coding-platform.s3.amazonaws.com/dev/lms/tickets/4c8465f0-fce0-484f-8497-d25feaa8e995/NqndMEyZakuimmFI.csv"



class JobFeatures(BaseModel):
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

class VisualFeatures(BaseModel):

    id: str = Field(... , description = "Identifier for visual")
    name: str = Field(... , description = "Name for visual like bar chart, histogram etc")
    description: str = Field(... , description = "Description of the Visual")


model = None
feature_columns = None
vectorizer = None
dashboard_data_df = None


@app.on_event("startup")
async def load_ml_model():
    # ... (your existing model loading code) ...
    global model
    global feature_columns
    global vectorizer
    global dashboard_data_df

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
    
    # # --- Load Training Data for Dashboard ---
    # if not os.path.exists(TRAINING_DATA_PATH):
    #     logger.error(f"Training data file not found at {TRAINING_DATA_PATH}. Dashboard will be empty.")
    #     dashboard_data_df = pd.DataFrame() # Initialize empty DataFrame
    
    try:
        # Load your training data. Ensure it has 'fraudulent', 'industry'
        # Adjust read_csv parameters as needed for your specific file.
        dashboard_data_df = pd.read_csv(TRAINING_DATA_PATH)
        logger.info(f"Loaded {len(dashboard_data_df)} records from training data for dashboard.")

        # Ensure necessary columns are present and correctly typed
        if 'fraudulent' not in dashboard_data_df.columns:
            logger.warning("'fraudulent' column not found in training data. Dashboard features might be limited.")
            # You might need to add a dummy 'fraudulent' if it's truly missing and essential
            # For this example, we assume it exists from your training process.
        else:
            dashboard_data_df['fraudulent'] = dashboard_data_df['fraudulent'].astype(bool)

        if 'industry' not in dashboard_data_df.columns:
            logger.warning("'industry' column not found in training data. Defaulting to 'Unknown'.")
            dashboard_data_df['industry'] = 'Unknown'
        
        logger.info("Training data loaded and preprocessed for dashboard visuals.")

    except Exception as e:
        logger.critical(f"Failed to load or process training data for dashboard: {e}", exc_info=True)
        dashboard_data_df = pd.DataFrame() # Ensure it's an empty DataFrame on failure



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
    

@app.get("/visuals/{id}")
async def visual_of_jobs(id: str):
    try:
        # logger.info('request=====', {id})
        # logger.info('visual api call at prediction model')
        global dashboard_data_df

        if dashboard_data_df is None or dashboard_data_df.empty:
            logger.warning("No dashboard data loaded. Returning empty visuals.")
            raise HTTPException(status_code=200, detail={
                "message": "No data available to generate visuals. Please check TRAINING_DATA_PATH.",
                "total_fraud_jobs": 0,
                "percentage_fraud": 0.0,
                "industry_chart": {},
                "trend_chart": {}
            })

        try:
            # --- Dashboard Metrics and Charts ---
            total_jobs = len(dashboard_data_df)
            fraudulent_jobs = dashboard_data_df[dashboard_data_df['fraudulent']].shape[0]
            percentage_fraud = (fraudulent_jobs / total_jobs) * 100 if total_jobs > 0 else 0

            # Chart 1: Fraudulent Jobs by Industry (Bar Chart)
            # Ensure 'industry' column exists and handle NaNs if necessary
            # We already handled 'industry' column during startup load, but good to be safe
            dashboard_data_df['industry'] = dashboard_data_df['industry'].fillna('Unknown')
            fraud_by_industry = dashboard_data_df[dashboard_data_df['fraudulent']].groupby('industry').size().reset_index(name='count')
            fig_industry = px.bar(
                fraud_by_industry,
                x='industry',
                y='count',
                title='Fraudulent Jobs by Industry (from Training Data)',
                labels={'count': 'Number of Fraudulent Jobs', 'industry': 'Industry'}
            )
            # plot_industry_json = fig_industry.to_dict()
             # --- CHANGE IS HERE: Use fig_industry.to_json() ---
            plot_industry_json_string = fig_industry.to_json()
            # If you need it as a Python dictionary, you can load it back
            plot_industry_json = json.loads(plot_industry_json_string)

            # Chart 2: Trend of Fraudulent Jobs Over Time (Line Chart)
            # Aggregate daily fraud counts
            # We already ensured 'timestamp' is datetime during startup load
            # #fraud_trend = dashboard_data_df[dashboard_data_df['fraudulent']].groupby(dashboard_data_df['timestamp'].dt.date).size().reset_index(name='count')
            # fraud_trend = dashboard_data_df[dashboard_data_df['fraudulent']].size().reset_index(name='count')
            # fraud_trend['date'] = pd.to_datetime(fraud_trend['date']) # Convert back to datetime for plotting for Plotly
            # fig_trend = px.line(
            #     fraud_trend,
            #     x='date',
            #     y='count',
            #     title='Daily Fraudulent Job Count (from Training Data)',
            #     labels={'count': 'Number of Fraudulent Jobs', 'date': 'Date'}
            # )
            # plot_trend_json = fig_trend.to_dict()

            # return {
                # "total_fraud_jobs": fraudulent_jobs,
                # "percentage_fraud": round(percentage_fraud, 2),
                # "industry_chart": plot_industry_json,
                # "trend_chart": plot_trend_json
                # Add more charts here as needed
            # }
            return plot_industry_json
        except Exception as e:
            logger.error(f"Error in get_job_visuals: {e}", exc_info=True)
            
            raise HTTPException(status_code=500, detail=f"Error retrieving or processing visual data: {e}")  
    except:
        print("Error in visual_of_jobs")


# cleanes the text provided in the input:
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