from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health_check, name='health_check'),
    path('stats', views.get_state_stats, name='get_state_stats'),
    path('colleges', views.get_colleges, name='get_colleges'),
    path('students', views.get_students, name='get_students'),
    path('faculty', views.get_faculty, name='get_faculty'),
    path('placements', views.get_placements, name='get_placements'),
    path('predict', views.predict_enrollment, name='predict_enrollment'),
    path('assistant', views.ai_assistant_query, name='ai_assistant_query'),
    path('college-assistant', views.college_assistant_query, name='college_assistant_query'),

    path('reports/state', views.get_state_report_view, name='get_state_report'),
    path('reports/district/<str:district>', views.get_district_report_path_view, name='get_district_report_path'),
    path('reports/district', views.get_district_report_view, name='get_district_report'),
    path('reports/college/<str:college>', views.get_college_report_path_view, name='get_college_report_path'),
    path('reports/college', views.get_college_report_view, name='get_college_report'),
    path('reports/generate', views.generate_report_view, name='generate_report'),
    path('reports/download', views.download_report_view, name='download_report'),
]
