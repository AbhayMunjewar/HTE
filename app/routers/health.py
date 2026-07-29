"""
HTE Decision Intelligence Platform — Health Router
"""

from fastapi import APIRouter
from app.config import DATASET_DIR
from app.ml.predictor import ml_predictor_service

router = APIRouter()

@router.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Maharashtra HTE Decision Intelligence Platform v3.0",
        "documentation": "/docs"
    }

@router.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": ml_predictor_service.predictor is not None,
        "database_available": True
    }
