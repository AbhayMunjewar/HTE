from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health_check, name='health_check'),
    path('predict', views.predict_enrollment, name='predict_enrollment'),
    path('assistant', views.ai_assistant_query, name='ai_assistant_query'),
    path('stats', views.get_state_stats, name='get_state_stats'),
    path('colleges', views.get_colleges, name='get_colleges'),
    path('students', views.get_students, name='get_students'),
    path('faculty', views.get_faculty, name='get_faculty'),
    path('placements', views.get_placements, name='get_placements'),
]
