"""
HTE Decision Intelligence Platform — Pydantic Schemas
=====================================================
Request and response models matching all existing frontend API contracts.
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    college_name: str = Field("Veermata Jijabai Technological Institute (VJTI)", example="VJTI Mumbai")
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

class AssistantRequest(BaseModel):
    query: str = Field(..., example="Highest placement in Pune?")
    context: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None
