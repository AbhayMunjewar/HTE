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
            from app.services.report_service import ReportService
            doc_data = ReportService._get_college_document_data(col.college_name)

            if doc_data:
                placement_rate = doc_data.get("placement_rate_pct", 85.0)
                total_students = doc_data.get("total_students", col.total_students or 1200)
                faculty_count = doc_data.get("total_faculty", col.total_faculty or 80)
                avg_pkg = doc_data.get("average_package_lpa", 12.55)
                max_pkg = doc_data.get("highest_package_lpa", 60.3)
                graduation_rate = doc_data.get("graduation_rate_pct", 96.2)
                scholarships = doc_data.get("total_scholarship_count", 1024)
                publications = doc_data.get("publications", 480)
                patents = doc_data.get("patents", 24)
                infra_score = doc_data.get("infrastructure_score", 9.4)
                nirf = doc_data.get("nirf_rank", str(col.nirf_rank if col.nirf_rank else "Not Ranked"))
                naac = doc_data.get("naac_grade", col.naac_grade or "A++")
                univ = doc_data.get("university", col.university or "State University")
                c_type = doc_data.get("type", col.college_type or "Government Autonomous")
            else:
                adm_stats = db.query(
                    func.avg(Admission.placement_rate).label("avg_placement"),
                    func.avg(Admission.cutoff_percentile).label("avg_cutoff")
                ).filter(Admission.college_id == col.college_id).first()

                placement_rate = round(float(adm_stats.avg_placement), 1) if adm_stats and adm_stats.avg_placement else 75.0
                total_students = int(col.total_students or 1200)
                faculty_count = int(col.total_faculty or 80)
                avg_pkg = 9.2
                max_pkg = 25.0
                graduation_rate = 94.2
                scholarships = int(total_students * 0.32)
                publications = 180
                patents = 10
                infra_score = 8.5
                nirf = str(col.nirf_rank if col.nirf_rank else "Not Ranked")
                naac = str(col.naac_grade or "A")
                univ = str(col.university or "State University")
                c_type = str(col.college_type or "Government Autonomous")

            records.append(clean_dict({
                "id": str(col.college_id),
                "name": str(col.college_name),
                "district": str(col.district or "Maharashtra"),
                "naacGrade": naac,
                "university": univ,
                "totalStudents": total_students,
                "facultyCount": faculty_count,
                "placementRate": placement_rate,
                "averagePackage": avg_pkg,
                "highestPackage": max_pkg,
                "graduationRate": graduation_rate,
                "scholarshipStudents": scholarships,
                "researchPublications": publications,
                "patents": patents,
                "infraScore": infra_score,
                "averageCgpa": round(float(col.accreditation_score or 3.2), 2),
                "nirfRank": nirf,
                "type": c_type,
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
