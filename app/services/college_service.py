"""
HTE Decision Intelligence Platform — College Service
=====================================================
Database service for querying college profiles, filters, and records from SQLite.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.database.models import College, Admission
from app.utils.helpers import clean_dict

class CollegeService:
    @staticmethod
    def search(
        db: Session,
        search: Optional[str] = None,
        district: Optional[str] = None,
        naac: Optional[str] = None,
        limit: int = 50,
        page: int = 1
    ) -> Dict[str, Any]:
        query = db.query(College)

        if search:
            s = "%{}%".format(search)
            query = query.filter(
                or_(
                    College.college_name.ilike(s),
                    College.district.ilike(s),
                    College.city.ilike(s)
                )
            )
        if district:
            query = query.filter(func.lower(College.district) == district.lower())
        if naac:
            query = query.filter(func.upper(College.naac_grade) == naac.upper())

        total = query.count()
        offset = (page - 1) * limit
        colleges = query.offset(offset).limit(limit).all()

        records = []
        for col in colleges:
            # Query avg placement rate from admissions for this college
            adm_stats = db.query(
                func.avg(Admission.placement_rate).label("avg_placement"),
                func.avg(Admission.cutoff_percentile).label("avg_cutoff")
            ).filter(Admission.college_id == col.college_id).first()

            placement_rate = round(float(adm_stats.avg_placement), 1) if adm_stats and adm_stats.avg_placement else 75.0
            
            records.append(clean_dict({
                "id": str(col.college_id),
                "name": str(col.college_name),
                "district": str(col.district or "Maharashtra"),
                "naacGrade": str(col.naac_grade or "A"),
                "university": str(col.university or "State University"),
                "totalStudents": int(col.total_students or 1200),
                "facultyCount": int(col.total_faculty or 80),
                "placementRate": placement_rate,
                "averageCgpa": round(float(col.accreditation_score or 3.2), 2),
                "nirfRank": str(col.nirf_rank if col.nirf_rank else "Not Ranked"),
                "type": str(col.college_type or "Government Autonomous"),
            }))

        return {"total": total, "page": page, "limit": limit, "colleges": records}

    @staticmethod
    def get_by_name_or_id(db: Session, query_str: str) -> Optional[College]:
        if not query_str:
            return None
        q = query_str.strip()
        # Direct ID match
        col = db.query(College).filter(College.college_id == q).first()
        if col:
            return col
        # Name match
        col = db.query(College).filter(College.college_name.ilike("%{}%".format(q))).first()
        if col:
            return col
        return None
