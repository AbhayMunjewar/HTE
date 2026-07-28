"""
===============================================================================
MAHARASHTRA HTE DECISION INTELLIGENCE PLATFORM
Backend API Server (FastAPI + ML Model Integration v3.0)
===============================================================================
Exposes REST Endpoints:
  - POST /api/predict   : Real-time enrollment prediction with confidence & SHAP drivers
  - GET  /api/colleges  : List of colleges from dataset
  - GET  /api/stats     : State-level HTE analytics & KPI metrics
  - GET  /api/health    : Health check status
===============================================================================
"""

import os
import sys
import logging
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Bind pipeline components to __main__ for joblib unpickling safety
import ml_pipeline
from ml_pipeline import (
    DataCleaner, FeatureEngineer, DataLoader, FeatureSelector,
    ModelTrainer, EnrollmentPredictor, ExplainablePredictor,
    HistoricalDataSynthesizer
)

sys.modules['__main__'].DataCleaner = DataCleaner
sys.modules['__main__'].FeatureEngineer = FeatureEngineer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HTE_Backend_Server")

app = FastAPI(
    title="Maharashtra HTE Decision Intelligence API",
    description="Backend API for Predictive Enrollment Modeling & Institutional Analytics",
    version="3.0"
)

# Enable CORS for Frontend (React Vite + Vanilla JS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Predictor Engine
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
predictor = None


@app.on_event("startup")
def load_ml_model():
    global predictor
    try:
        if not os.path.exists(os.path.join(MODELS_DIR, "best_model.pkl")):
            logger.info("Saved model not found. Executing pipeline training...")
            ml_pipeline.run_pipeline(data_dir="Dataset", output_dir="models")
        predictor = EnrollmentPredictor(models_dir=MODELS_DIR)
        logger.info("ML Predictor initialized successfully.")
    except Exception as e:
        logger.error("Error initializing ML predictor: %s", e)


# Pydantic Schema for Prediction Request
class PredictionRequest(BaseModel):
    college_name: str = Field("VJTI Mumbai", example="Veermata Jijabai Technological Institute (VJTI)")
    target_year: int = Field(2025, example=2025)
    district: str = Field("Mumbai", example="Mumbai")
    sanctioned_seats: int = Field(120, example=120)
    filled_seats: int = Field(100, example=100)
    applications: int = Field(400, example=400)
    placement_rate: float = Field(80.0, example=80.0)
    avg_package: float = Field(12.0, example=12.0)
    cutoff_percentile: float = Field(92.0, example=92.0)
    faculty_count: int = Field(17, example=17)
    naac_grade: str = Field("A++", example="A++")
    nirf_rank: Optional[float] = Field(50.0, example=50.0)
    autonomous: str = Field("Yes", example="Yes")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Maharashtra HTE Decision Intelligence API v3.0",
        "documentation": "/docs"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": predictor is not None and predictor.model is not None,
        "models_dir": MODELS_DIR
    }


@app.post("/api/predict")
def predict_enrollment(req: PredictionRequest):
    if predictor is None:
        raise HTTPException(status_code=503, detail="ML Predictor model not loaded")

    custom_data = {
        "district": req.district,
        "sanctioned_seats": req.sanctioned_seats,
        "filled_seats": req.filled_seats,
        "applications": req.applications,
        "placement_rate": req.placement_rate,
        "avg_package": req.avg_package,
        "cutoff_percentile": req.cutoff_percentile,
        "faculty_count": req.faculty_count,
        "naac_grade": req.naac_grade,
        "nirf_rank": req.nirf_rank if req.nirf_rank else 100.0,
        "autonomous": req.autonomous,
    }

    try:
        result = predictor.predict_enrollment(req.college_name, req.target_year, custom_data)
        return result
    except Exception as e:
        logger.error("Prediction error: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/colleges")
def get_colleges(limit: int = 50):
    colleges_file = os.path.join(os.path.dirname(__file__), "Dataset", "colleges.csv")
    if not os.path.exists(colleges_file):
        raise HTTPException(status_code=404, detail="Colleges dataset not found")

    df = pd.read_csv(colleges_file).head(limit)
    records = df.fillna({
        "naac_grade": "B",
        "nirf_rank": "Not Ranked",
        "accreditation_score": 2.5,
    }).to_dict(orient="records")
    return {"total": len(records), "colleges": records}


@app.get("/api/stats")
def get_state_stats():
    colleges_file = os.path.join(os.path.dirname(__file__), "Dataset", "colleges.csv")
    admissions_file = os.path.join(os.path.dirname(__file__), "Dataset", "admissions.csv")

    stats = {
        "total_colleges": 2000,
        "total_students": 612450,
        "total_faculty": 45210,
        "avg_placement_rate": 78.5,
        "avg_seat_utilization": 82.4,
        "top_districts": ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad", "Sangli", "Latur"]
    }

    if os.path.exists(colleges_file):
        cdf = pd.read_csv(colleges_file)
        stats["total_colleges"] = len(cdf)
        stats["total_students"] = int(cdf["total_students"].sum())
        stats["total_faculty"] = int(cdf["total_faculty"].sum())

    if os.path.exists(admissions_file):
        adf = pd.read_csv(admissions_file)
        stats["avg_placement_rate"] = round(float(adf["placement_rate"].mean()), 1)
        util = (adf["filled_seats"] / adf["sanctioned_seats"].replace(0, 1)).mean() * 100
        stats["avg_seat_utilization"] = round(float(util), 1)

    return stats


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
