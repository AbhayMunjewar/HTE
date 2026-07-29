"""
HTE Decision Intelligence Platform — Analytics: District
=========================================================
Aggregates performance metrics at the district level across Maharashtra.
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import College, Placement
from app.utils.helpers import clean_dict

class AnalyticsDistrict:
    @staticmethod
    def get_district_summary(db: Session, district_name: str) -> Dict[str, Any]:
        d = district_name.strip()
        colleges = db.query(College).filter(College.district.ilike(d)).all()

        if not colleges:
            return {"error": "District '{}' not found".format(district_name)}

        total_colleges = len(colleges)
        total_students = sum(c.total_students for c in colleges)
        total_faculty = sum(c.total_faculty for c in colleges)
        avg_ratio = round(total_students / max(1, total_faculty), 1)

        cids = [c.college_id for c in colleges]
        placed_count = db.query(func.count(Placement.placement_id))\
            .filter(Placement.college_id.in_(cids), Placement.placement_status == "Placed").scalar() or 0
        total_placements = db.query(func.count(Placement.placement_id))\
            .filter(Placement.college_id.in_(cids)).scalar() or 1

        placement_rate = round((placed_count / max(1, total_placements)) * 100, 1)

        naac_counts = {}
        for c in colleges:
            grade = c.naac_grade or "Unaccredited"
            naac_counts[grade] = naac_counts.get(grade, 0) + 1

        top_colleges = sorted(colleges, key=lambda x: x.total_students, reverse=True)[:5]
        top_list = [{"id": c.college_id, "name": c.college_name, "students": c.total_students, "naac": c.naac_grade} for c in top_colleges]

        return clean_dict({
            "district": district_name.title(),
            "total_colleges": total_colleges,
            "total_students": total_students,
            "total_faculty": total_faculty,
            "avg_student_faculty_ratio": avg_ratio,
            "district_placement_rate": placement_rate,
            "naac_breakdown": naac_counts,
            "top_colleges": top_list
        })
