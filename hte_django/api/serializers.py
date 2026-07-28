from rest_framework import serializers
from .models import College, Student, Faculty, Placement

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'

class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placement
        fields = '__all__'
