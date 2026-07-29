"""
HTE Decision Intelligence Platform — Analytics: Trends
======================================================
Historical trends for enrollment, admissions, and branch popularities.
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import Admission, Student
from app.utils.helpers import clean_dict

class AnalyticsTrends:
    @staticmethod
    def get_college_admission_trend(db: Session, college_id: str) -> List[Dict[str, Any]]:
        admissions = db.query(Admission).filter(Admission.college_id == college_id)\
            .order_by(Admission.year.asc()).all()

        trend = []
        for a in admissions:
            trend.append({
                "year": a.year,
                "branch": a.branch,
                "applications": a.applications,
                "filled_seats": a.filled_seats,
                "cutoff_percentile": a.cutoff_percentile,
                "placement_rate": a.placement_rate
            })
        return clean_dict(trend)
