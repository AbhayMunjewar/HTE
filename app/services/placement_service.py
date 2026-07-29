"""
HTE Decision Intelligence Platform — Placement Service
======================================================
Database service for querying placement statistics and recruiter records from SQLite.
"""

from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import Placement
from app.utils.helpers import clean_dict

class PlacementService:
    @staticmethod
    def list_placements(
        db: Session,
        limit: int = 50,
        page: int = 1,
        company: Optional[str] = None
    ) -> Dict[str, Any]:
        query = db.query(Placement)
        if company:
            query = query.filter(Placement.company.ilike("%{}%".format(company)))

        total = query.count()
        offset = (page - 1) * limit
        placements = query.offset(offset).limit(limit).all()

        records = []
        for p in placements:
            records.append(clean_dict({
                "placement_id": str(p.placement_id),
                "college_id": str(p.college_id),
                "student_id": str(p.student_id),
                "branch": str(p.branch or ""),
                "company": str(p.company or "TCS"),
                "package_lpa": float(p.package_lpa or 6.5),
                "placement_status": str(p.placement_status or "Placed"),
                "job_role": str(p.job_role or "Software Engineer"),
                "location": str(p.location or "Mumbai")
            }))

        return {"total": total, "page": page, "limit": limit, "placements": records}
