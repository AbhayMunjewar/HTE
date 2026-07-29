"""
HTE Decision Intelligence Platform — Faculty Service
====================================================
Database service for querying faculty profiles and metrics from SQLite.
"""

from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import Faculty
from app.utils.helpers import clean_dict

class FacultyService:
    @staticmethod
    def list_faculty(
        db: Session,
        limit: int = 50,
        page: int = 1,
        dept: Optional[str] = None
    ) -> Dict[str, Any]:
        query = db.query(Faculty)
        if dept:
            query = query.filter(Faculty.department.ilike("%{}%".format(dept)))

        total = query.count()
        offset = (page - 1) * limit
        faculty_members = query.offset(offset).limit(limit).all()

        records = []
        for f in faculty_members:
            records.append(clean_dict({
                "faculty_id": str(f.faculty_id),
                "college_id": str(f.college_id),
                "name": str(f.name or ""),
                "gender": str(f.gender or "M"),
                "designation": str(f.designation or "Assistant Professor"),
                "qualification": str(f.qualification or "Ph.D"),
                "experience_years": int(f.experience_years or 8),
                "department": str(f.department or "Computer Engineering"),
                "publications": int(f.publications or 2),
                "patents": int(f.patents or 0),
                "employment_type": str(f.employment_type or "Regular")
            }))

        return {"total": total, "page": page, "limit": limit, "faculty": records}
