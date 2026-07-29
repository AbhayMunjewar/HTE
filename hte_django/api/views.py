import os
import sys
import logging
import pandas as pd
import numpy as np

from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Add project root to sys.path to import ml_pipeline
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import ml_pipeline
from ml_pipeline import (
    DataCleaner, FeatureEngineer, EnrollmentPredictor
)

sys.modules['__main__'].DataCleaner = DataCleaner
sys.modules['__main__'].FeatureEngineer = FeatureEngineer

logger = logging.getLogger("HTE_Django_API")

DATASET_DIR = os.path.join(PROJECT_ROOT, "Dataset")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

predictor = None
try:
    if os.path.exists(os.path.join(MODELS_DIR, "best_model.pkl")):
        predictor = EnrollmentPredictor(models_dir=MODELS_DIR)
        logger.info("Django ML Predictor initialized successfully.")
except Exception as e:
    logger.error("Error loading ML predictor in Django: %s", e)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        "status": "healthy",
        "framework": "Django 3.2 + Django REST Framework",
        "model_loaded": predictor is not None and predictor.model is not None,
        "dataset_available": os.path.exists(DATASET_DIR)
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def predict_enrollment(request):
    global predictor
    if predictor is None:
        try:
            predictor = EnrollmentPredictor(models_dir=MODELS_DIR)
        except Exception as e:
            return Response({"error": "ML Predictor model not loaded"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    data = request.data
    college_name = data.get("college_name", "Veermata Jijabai Technological Institute (VJTI)")
    target_year = int(data.get("target_year", 2025))

    custom_data = {
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
        result = predictor.predict_enrollment(college_name, target_year, custom_data)
        return Response(result)
    except Exception as e:
        logger.error("Django Prediction error: %s", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_assistant_query(request):
    import decision_intelligence_llm
    query = request.data.get("query", "")
    context = request.data.get("context", {})
    result = decision_intelligence_llm.decision_llm_engine.process_query(query, context)
    return Response(result)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_state_stats(request):
    colleges_file = os.path.join(DATASET_DIR, "colleges.csv")
    students_file = os.path.join(DATASET_DIR, "students.csv")
    placements_file = os.path.join(DATASET_DIR, "placements.csv")

    stats = {
        "totalColleges": 2000,
        "totalStudents": 612450,
        "totalFaculty": 45210,
        "placementRate": 78.5,
        "averageCgpa": 7.9,
        "scholarshipStudents": 185000,
        "studentAdmissionTrend": [
            {"year": "2019", "students": 510000},
            {"year": "2020", "students": 525000},
            {"year": "2021", "students": 540000},
            {"year": "2022", "students": 565000},
            {"year": "2023", "students": 590000},
            {"year": "2024", "students": 612450},
        ],
        "studentsByBranch": [
            {"name": "Computer", "value": 185000},
            {"name": "IT", "value": 142000},
            {"name": "Mechanical", "value": 110000},
            {"name": "Civil", "value": 95000},
            {"name": "Electrical", "value": 80450},
        ],
        "districtEnrollment": [],
        "naacGradeDistribution": [],
    }

    if os.path.exists(colleges_file):
        cdf = pd.read_csv(colleges_file)
        stats["totalColleges"] = int(len(cdf))
        stats["totalStudents"] = int(cdf["total_students"].sum()) if "total_students" in cdf.columns else 612450
        stats["totalFaculty"] = int(cdf["total_faculty"].sum()) if "total_faculty" in cdf.columns else 45210

    return Response(stats)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_colleges(request):
    colleges_file = os.path.join(DATASET_DIR, "colleges.csv")
    if not os.path.exists(colleges_file):
        return Response({"error": "colleges.csv not found"}, status=404)

    search = request.GET.get("search")
    district = request.GET.get("district")
    naac = request.GET.get("naac")
    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))

    df = pd.read_csv(colleges_file)

    if search:
        df = df[df["college_name"].str.contains(search, case=False, na=False) |
                df["district"].str.contains(search, case=False, na=False)]
    if district:
        df = df[df["district"].str.lower() == district.lower()]
    if naac:
        df = df[df["naac_grade"].str.upper() == naac.upper()]

    total = len(df)
    start = (page - 1) * limit
    paged = df.iloc[start:start + limit].copy()

    records = []
    for _, row in paged.iterrows():
        records.append({
            "id": str(row.get("college_id", "")),
            "name": str(row.get("college_name", "")),
            "district": str(row.get("district", "Maharashtra")),
            "naacGrade": str(row.get("naac_grade", "A")),
            "university": str(row.get("university", "State University")),
            "totalStudents": int(row.get("total_students", 1200)),
            "facultyCount": int(row.get("total_faculty", 80)),
            "placementRate": 85.0,
            "graduationRate": 94.2,
            "nirfRank": str(row.get("nirf_rank", "Not Ranked")),
            "type": str(row.get("college_type", "Government Autonomous")),
        })

    return Response({"total": total, "page": page, "limit": limit, "colleges": records})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_students(request):
    students_file = os.path.join(DATASET_DIR, "students.csv")
    if not os.path.exists(students_file):
        return Response({"error": "students.csv not found"}, status=404)

    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))
    df = pd.read_csv(students_file)
    total = len(df)
    start = (page - 1) * limit
    paged = df.iloc[start:start + limit].fillna({
        "cgpa": 7.5,
        "attendance": 80.0,
        "scholarship": "No",
        "placement_status": "Not Placed"
    })

    return Response({"total": total, "page": page, "limit": limit, "students": paged.to_dict(orient="records")})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_faculty(request):
    faculty_file = os.path.join(DATASET_DIR, "faculty.csv")
    if not os.path.exists(faculty_file):
        return Response({"error": "faculty.csv not found"}, status=404)

    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))
    df = pd.read_csv(faculty_file)
    total = len(df)
    start = (page - 1) * limit
    paged = df.iloc[start:start + limit].fillna({
        "qualification": "Master",
        "experience_years": 8,
        "publications": 2
    })

    return Response({"total": total, "page": page, "limit": limit, "faculty": paged.to_dict(orient="records")})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_placements(request):
    placements_file = os.path.join(DATASET_DIR, "placements.csv")
    if not os.path.exists(placements_file):
        return Response({"error": "placements.csv not found"}, status=404)

    limit = int(request.GET.get("limit", 50))
    page = int(request.GET.get("page", 1))
    df = pd.read_csv(placements_file)
    total = len(df)
    start = (page - 1) * limit
    paged = df.iloc[start:start + limit].fillna({
        "company": "TCS",
        "package_lpa": 6.5,
        "placement_status": "Placed"
    })

    return Response({"total": total, "page": page, "limit": limit, "placements": paged.to_dict(orient="records")})
