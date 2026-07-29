"""
HTE Decision Intelligence Platform — Prediction Router
"""

from fastapi import APIRouter
from app.schemas.schemas import PredictionRequest
from app.ml.predictor import ml_predictor_service

router = APIRouter(prefix="/api")

@router.post("/predict")
def predict_enrollment(req: PredictionRequest):
    custom_params = {
        "district": req.district,
        "sanctioned_seats": req.sanctioned_seats,
        "filled_seats": req.filled_seats,
        "applications": req.applications,
        "placement_rate": req.placement_rate,
        "avg_package": req.avg_package,
        "cutoff_percentile": req.cutoff_percentile,
        "faculty_count": req.faculty_count,
        "naac_grade": req.naac_grade,
        "nirf_rank": req.nirf_rank,
        "autonomous": req.autonomous,
    }
    return ml_predictor_service.predict(req.college_name, req.target_year, custom_params)
