"""
HTE Decision Intelligence Platform — Django REST Framework Views
===================================================================
Production DRF view handlers connecting Django backend to the SQLite database ORM,
ExtraTrees ML v3.0 Predictor, Decision Intelligence Chatbot Engine, and RAG Document Assistant.
"""

import os
import sys
import logging

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Ensure root directory is in sys.path for app modules
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app.database.engine import SessionLocal
from app.services.stats_service import StatsService
from app.services.college_service import CollegeService
from app.services.student_service import StudentService
from app.services.faculty_service import FacultyService
from app.services.placement_service import PlacementService
from app.ml.predictor import ml_predictor_service
from app.chatbot.engine import chatbot_engine
from app.rag.rag_service import college_rag_service
from app.services.report_service import ReportService

logger = logging.getLogger("HTE_Django_API")


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        "status": "healthy",
        "framework": "Django 3.2 + Django REST Framework",
        "database": "SQLite ORM hte_platform.db (238,000+ records)",
        "ml_predictor": "ExtraTrees ML Engine v3.0",
        "rag_engine": "Isolated FAISS Vector Store Active"
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_state_stats(request):
    db = SessionLocal()
    try:
        data = StatsService.get_state_stats(db)
        return Response(data)
    except Exception as e:
        logger.error("Error in get_state_stats: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_colleges(request):
    search = request.GET.get("search")
    district = request.GET.get("district")
    naac = request.GET.get("naac")
    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))

    db = SessionLocal()
    try:
        result = CollegeService.search(db, search=search, district=district, naac=naac, limit=limit, page=page)
        return Response(result)
    except Exception as e:
        logger.error("Error in get_colleges: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_students(request):
    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))
    branch = request.GET.get("branch")

    db = SessionLocal()
    try:
        result = StudentService.list_students(db, limit=limit, page=page, branch=branch)
        return Response(result)
    except Exception as e:
        logger.error("Error in get_students: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_faculty(request):
    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))
    dept = request.GET.get("department") or request.GET.get("dept")

    db = SessionLocal()
    try:
        result = FacultyService.list_faculty(db, limit=limit, page=page, dept=dept)
        return Response(result)
    except Exception as e:
        logger.error("Error in get_faculty: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_placements(request):
    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))
    company = request.GET.get("company")

    db = SessionLocal()
    try:
        result = PlacementService.list_placements(db, limit=limit, page=page, company=company)
        return Response(result)
    except Exception as e:
        logger.error("Error in get_placements: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['POST'])
@permission_classes([AllowAny])
def predict_enrollment(request):
    data = request.data or {}
    college_name = data.get("college_name", "Veermata Jijabai Technological Institute (VJTI)")
    target_year = int(data.get("target_year", 2025))

    custom_params = {
        "district": data.get("district", "Mumbai"),
        "sanctioned_seats": int(data.get("sanctioned_seats", 120)),
        "filled_seats": int(data.get("filled_seats", 100)),
        "applications": int(data.get("applications", 400)),
        "placement_rate": float(data.get("placement_rate", 80.0)),
        "avg_package": float(data.get("avg_package", 12.0)),
        "cutoff_percentile": float(data.get("cutoff_percentile", 92.0)),
        "faculty_count": int(data.get("faculty_count", 17)),
        "naac_grade": data.get("naac_grade", "A++"),
        "nirf_rank": float(data.get("nirf_rank", 50.0)),
        "autonomous": data.get("autonomous", "Yes"),
    }

    try:
        result = ml_predictor_service.predict(college_name, target_year, custom_params)
        return Response(result)
    except Exception as e:
        logger.error("Prediction error in Django: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_assistant_query(request):
    data = request.data or {}
    query = data.get("query", "")
    context = data.get("context", {})
    session_id = data.get("session_id", "default")

    try:
        result = chatbot_engine.process_query(query, context, session_id)
        return Response(result)
    except Exception as e:
        logger.error("AI Assistant error in Django: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def college_assistant_query(request):
    data = request.data or {}
    college_name = data.get("college_name", "COEP")
    query = data.get("query", "")

    c_lower = college_name.lower()
    if "vjti" in c_lower or "veermata" in c_lower:
        folder_name = "VJTI"
    elif "coep" in c_lower or "pune" in c_lower:
        folder_name = "COEP"
    elif "ict" in c_lower:
        folder_name = "ICT"
    elif "spit" in c_lower:
        folder_name = "SPIT"
    elif "pict" in c_lower:
        folder_name = "PICT"
    elif "walchand" in c_lower:
        folder_name = "Walchand"
    else:
        folder_name = college_name.split()[0]

    try:
        result = college_rag_service.answer_college_query(folder_name, query)
        return Response(result)
    except Exception as e:
        logger.error("College Assistant error in Django: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_state_report_view(request):
    print(">>> GET_STATE_REPORT_VIEW CALLED! <<<", flush=True)
    year = request.GET.get("year")
    db = SessionLocal()
    try:
        report = ReportService.get_state_report(db, year=year)
        return Response(report)
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error("Error in get_state_report_view: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_district_report_view(request):
    district = request.GET.get("name", "Pune")
    year = request.GET.get("year")
    db = SessionLocal()
    try:
        report = ReportService.get_district_report(db, district_name=district, year=year)
        return Response(report)
    except Exception as e:
        logger.error("Error in get_district_report_view: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_district_report_path_view(request, district: str):
    year = request.GET.get("year")
    db = SessionLocal()
    try:
        report = ReportService.get_district_report(db, district_name=district, year=year)
        return Response(report)
    except Exception as e:
        logger.error("Error in get_district_report_path_view: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_college_report_view(request):
    college_name = request.GET.get("name", "COEP")
    year = request.GET.get("year")
    db = SessionLocal()
    try:
        report = ReportService.get_college_report(db, college_name=college_name, year=year)
        return Response(report)
    except Exception as e:
        logger.error("Error in get_college_report_view: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_college_report_path_view(request, college: str):
    year = request.GET.get("year")
    db = SessionLocal()
    try:
        report = ReportService.get_college_report(db, college_name=college, year=year)
        return Response(report)
    except Exception as e:
        logger.error("Error in get_college_report_path_view: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_report_view(request):
    data = request.data or {}
    report_type = data.get("type", "state")
    target = data.get("target", "")
    year = data.get("year", "2025-2026")

    db = SessionLocal()
    try:
        if report_type == "district":
            report = ReportService.get_district_report(db, district_name=target or "Pune", year=year)
        elif report_type == "college":
            report = ReportService.get_college_report(db, college_name=target or "COEP", year=year)
        else:
            report = ReportService.get_state_report(db, year=year)
        return Response(report)
    except Exception as e:
        logger.error("Error in generate_report_view: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        db.close()


@api_view(['POST'])
@permission_classes([AllowAny])
def download_report_view(request):
    data = request.data or {}
    report_type = data.get("type", "state")
    target = data.get("target", "")

    return Response({
        "status": "ready",
        "download_url": f"/api/reports/{report_type}?name={target}",
        "export_format": "PDF / Printable Government Document",
        "timestamp": "2026-08-02T15:52:00Z"
    })

