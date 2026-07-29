"""
HTE Decision Intelligence Platform — Student Service
====================================================
Database service for querying student records from SQLite.
"""

from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import Student
from app.utils.helpers import clean_dict

class StudentService:
    @staticmethod
    def list_students(
        db: Session,
        limit: int = 50,
        page: int = 1,
        branch: Optional[str] = None
    ) -> Dict[str, Any]:
        query = db.query(Student)
        if branch:
            query = query.filter(Student.branch.ilike("%{}%".format(branch)))

        total = query.count()
        offset = (page - 1) * limit
        students = query.offset(offset).limit(limit).all()

        records = []
        for s in students:
            records.append(clean_dict({
                "student_id": str(s.student_id),
                "college_id": str(s.college_id),
                "roll_no": str(s.roll_no or ""),
                "gender": str(s.gender or "M"),
                "branch": str(s.branch or "CS"),
                "year": int(s.year or 4),
                "cgpa": float(s.cgpa or 7.5),
                "attendance": float(s.attendance or 80.0),
                "scholarship": str(s.scholarship or "No"),
                "placement_status": str(s.placement_status or "Not Placed"),
                "district": str(s.district or "")
            }))

        return {"total": total, "page": page, "limit": limit, "students": records}
