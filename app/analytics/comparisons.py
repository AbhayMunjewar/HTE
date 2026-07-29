"""
HTE Decision Intelligence Platform — Analytics: Comparisons
============================================================
Side-by-side metric comparisons between two or more colleges.
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import College, Placement, Faculty, Research, Infrastructure, Admission
from app.utils.helpers import clean_dict

class AnalyticsComparisons:
    @staticmethod
    def compare_colleges(db: Session, college_ids_or_names: List[str]) -> List[Dict[str, Any]]:
        comparison_results = []
        
        for item in college_ids_or_names:
            q = item.strip()
            col = db.query(College).filter(
                (College.college_id == q) | (College.college_name.ilike("%{}%".format(q)))
            ).first()

            if not col:
                continue

            cid = col.college_id

            # Placement stats
            pl_stats = db.query(
                func.avg(Placement.package_lpa).label("avg_pkg"),
                func.max(Placement.package_lpa).label("max_pkg"),
                func.count(Placement.placement_id).label("total_placed")
            ).filter(Placement.college_id == cid, Placement.placement_status == "Placed").first()

            # Research stats
            res_stats = db.query(
                func.sum(Research.publications).label("pub_count"),
                func.sum(Research.patents).label("patent_count")
            ).filter(Research.college_id == cid).first()

            # Infrastructure stats
            infra = db.query(Infrastructure).filter(Infrastructure.college_id == cid).first()

            # Admission stats
            adm_stats = db.query(
                func.avg(Admission.placement_rate).label("placement_rate")
            ).filter(Admission.college_id == cid).first()

            ratio = round(col.total_students / max(1, col.total_faculty), 1)
            prate = round(float(adm_stats.placement_rate), 1) if adm_stats and adm_stats.placement_rate else 80.0

            comparison_results.append(clean_dict({
                "college_id": col.college_id,
                "college_name": col.college_name,
                "district": col.district,
                "naac_grade": col.naac_grade,
                "nirf_rank": col.nirf_rank or "Not Ranked",
                "total_students": col.total_students,
                "total_faculty": col.total_faculty,
                "student_faculty_ratio": ratio,
                "placement_rate": prate,
                "avg_package_lpa": round(float(pl_stats.avg_pkg or 6.5), 2),
                "max_package_lpa": round(float(pl_stats.max_pkg or 12.0), 2),
                "publications": int(res_stats.pub_count or 0) if res_stats else 0,
                "patents": int(res_stats.patent_count or 0) if res_stats else 0,
                "labs": infra.labs if infra else 15,
                "smart_classrooms": infra.smart_classrooms if infra else 10,
            }))

        return comparison_results
