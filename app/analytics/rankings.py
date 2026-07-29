"""
HTE Decision Intelligence Platform — Analytics: Rankings
=========================================================
SQL-powered analytics for state-wide college rankings:
- Colleges requiring faculty (Faculty Shortage)
- Placement rankings
- Research rankings
- NAAC & NIRF rankings
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import College, Placement, Research, Admission
from app.utils.helpers import clean_dict

class AnalyticsRankings:
    @staticmethod
    def get_faculty_shortage_ranking(db: Session, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Calculates student-to-faculty ratio (ideal ratio is 15:1).
        Ranks colleges needing additional faculty.
        """
        colleges = db.query(College).filter(College.total_faculty > 0).all()
        shortage_list = []
        for col in colleges:
            ratio = round(col.total_students / max(1, col.total_faculty), 1)
            # Standard ratio is 15:1. Required faculty = total_students / 15
            ideal_faculty = max(1, int(col.total_students / 15))
            deficit = max(0, ideal_faculty - col.total_faculty)
            shortage_list.append({
                "college_id": col.college_id,
                "college_name": col.college_name,
                "district": col.district,
                "total_students": col.total_students,
                "current_faculty": col.total_faculty,
                "ideal_faculty": ideal_faculty,
                "faculty_deficit": deficit,
                "student_faculty_ratio": ratio,
                "naac_grade": col.naac_grade,
            })
        
        # Sort by highest faculty deficit then student_faculty_ratio
        shortage_list.sort(key=lambda x: (x["faculty_deficit"], x["student_faculty_ratio"]), reverse=True)
        return clean_dict(shortage_list[:limit])

    @staticmethod
    def get_placement_ranking(db: Session, limit: int = 10) -> List[Dict[str, Any]]:
        """Ranks top colleges by average placement package and placement rate."""
        results = db.query(
            Placement.college_id,
            func.avg(Placement.package_lpa).label("avg_package"),
            func.max(Placement.package_lpa).label("max_package"),
            func.count(Placement.placement_id).label("total_placed")
        ).filter(Placement.placement_status == "Placed")\
         .group_by(Placement.college_id)\
         .order_by(func.avg(Placement.package_lpa).desc())\
         .limit(limit).all()

        ranking = []
        for r in results:
            col = db.query(College).filter(College.college_id == r.college_id).first()
            if col:
                ranking.append({
                    "college_id": col.college_id,
                    "college_name": col.college_name,
                    "district": col.district,
                    "avg_package_lpa": round(float(r.avg_package or 0), 2),
                    "max_package_lpa": round(float(r.max_package or 0), 2),
                    "students_placed": int(r.total_placed or 0),
                    "naac_grade": col.naac_grade
                })
        return clean_dict(ranking)

    @staticmethod
    def get_research_ranking(db: Session, limit: int = 10) -> List[Dict[str, Any]]:
        """Ranks top colleges by research output (publications & patents)."""
        results = db.query(
            Research.college_id,
            func.sum(Research.publications).label("total_publications"),
            func.sum(Research.patents).label("total_patents"),
            func.sum(Research.funded_projects).label("total_projects")
        ).group_by(Research.college_id)\
         .order_by(func.sum(Research.publications).desc())\
         .limit(limit).all()

        ranking = []
        for r in results:
            col = db.query(College).filter(College.college_id == r.college_id).first()
            if col:
                ranking.append({
                    "college_id": col.college_id,
                    "college_name": col.college_name,
                    "district": col.district,
                    "publications": int(r.total_publications or 0),
                    "patents": int(r.total_patents or 0),
                    "funded_projects": int(r.total_projects or 0),
                    "naac_grade": col.naac_grade
                })
        return clean_dict(ranking)
