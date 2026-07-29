"""
HTE Decision Intelligence Platform — ORM Models
=================================================
SQLAlchemy ORM models for all 11 CSV-sourced tables.
Column names match the CSV headers exactly for seamless import.
"""

from sqlalchemy import (
    Column, Integer, Float, String, Text, Index
)
from app.database.engine import Base


class College(Base):
    __tablename__ = "colleges"

    college_id = Column(String(20), primary_key=True, index=True)
    college_name = Column(String(200), nullable=False, index=True)
    college_type = Column(String(100))
    ownership = Column(String(50))
    district = Column(String(100), index=True)
    city = Column(String(100))
    state = Column(String(50))
    university = Column(String(200))
    established_year = Column(Integer)
    naac_grade = Column(String(10), index=True)
    nirf_rank = Column(Float)
    autonomous = Column(String(10))
    accreditation_score = Column(Float)
    total_students = Column(Integer)
    total_faculty = Column(Integer)
    campus_area_acres = Column(Float)
    courses_offered = Column(Integer)
    hostel_available = Column(String(10))
    website = Column(String(300))
    status = Column(String(20))


class Student(Base):
    __tablename__ = "students"

    student_id = Column(String(20), primary_key=True, index=True)
    college_id = Column(String(20), index=True)
    roll_no = Column(String(30))
    gender = Column(String(10))
    age = Column(Integer)
    category = Column(String(30))
    annual_income = Column(Float)
    branch = Column(String(100), index=True)
    year = Column(Integer, index=True)
    semester = Column(Integer)
    cgpa = Column(Float)
    attendance = Column(Float)
    hosteller = Column(String(10))
    scholarship = Column(String(10))
    placement_status = Column(String(20), index=True)
    backlogs = Column(Integer)
    admission_year = Column(Integer)
    graduation_year = Column(Integer)
    district = Column(String(100))
    state = Column(String(50))
    email = Column(String(200))
    phone = Column(String(20))
    dropout = Column(String(10))
    internship_completed = Column(String(10))
    research_projects = Column(Integer)


class Faculty(Base):
    __tablename__ = "faculty"

    faculty_id = Column(String(20), primary_key=True, index=True)
    college_id = Column(String(20), index=True)
    name = Column(String(100))
    gender = Column(String(10))
    designation = Column(String(50))
    qualification = Column(String(50))
    experience_years = Column(Integer)
    department = Column(String(100), index=True)
    salary = Column(Float)
    publications = Column(Integer)
    patents = Column(Integer)
    research_projects = Column(Integer)
    joining_year = Column(Integer)
    employment_type = Column(String(30))


class Placement(Base):
    __tablename__ = "placements"

    placement_id = Column(String(20), primary_key=True, index=True)
    college_id = Column(String(20), index=True)
    student_id = Column(String(20), index=True)
    branch = Column(String(100))
    graduation_year = Column(Integer, index=True)
    company = Column(String(200))
    package_lpa = Column(Float)
    internship_company = Column(String(200))
    internship_stipend = Column(Float)
    placement_status = Column(String(20), index=True)
    job_role = Column(String(100))
    location = Column(String(100))


class Admission(Base):
    __tablename__ = "admissions"
    __table_args__ = (
        Index("ix_admissions_college_year", "college_id", "year"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    college_id = Column(String(20), index=True)
    branch = Column(String(100))
    district = Column(String(100))
    year = Column(Integer, index=True)
    applications = Column(Integer)
    sanctioned_seats = Column(Integer)
    filled_seats = Column(Integer)
    vacant_seats = Column(Integer)
    cutoff_percentile = Column(Float)
    placement_rate = Column(Float)
    graduation_rate = Column(Float)
    filled_seats_next_year = Column(Integer)


class Finance(Base):
    __tablename__ = "finance"

    finance_id = Column(String(20), primary_key=True, index=True)
    college_id = Column(String(20), index=True)
    financial_year = Column(String(20))
    annual_budget = Column(Float)
    government_grant = Column(Float)
    research_grant = Column(Float)
    tuition_revenue = Column(Float)
    expenses = Column(Float)
    capital_expenditure = Column(Float)
    operating_expenditure = Column(Float)


class Research(Base):
    __tablename__ = "research"

    research_id = Column(String(20), primary_key=True, index=True)
    college_id = Column(String(20), index=True)
    department = Column(String(100))
    publications = Column(Integer)
    citations = Column(Integer)
    patents = Column(Integer)
    funded_projects = Column(Integer)
    research_funding = Column(Float)
    international_collaborations = Column(Integer)


class Infrastructure(Base):
    __tablename__ = "infrastructure"

    infra_id = Column(String(20), primary_key=True, index=True)
    college_id = Column(String(20), index=True)
    classrooms = Column(Integer)
    labs = Column(Integer)
    smart_classrooms = Column(Integer)
    library_books = Column(Integer)
    hostel_capacity = Column(Integer)
    internet_speed_mbps = Column(Integer)
    sports_complex = Column(String(10))
    canteen = Column(String(10))
    medical_center = Column(String(10))
    solar_power = Column(String(10))


class Complaint(Base):
    __tablename__ = "complaints"

    complaint_id = Column(String(20), primary_key=True, index=True)
    college_id = Column(String(20), index=True)
    category = Column(String(100))
    priority = Column(String(20))
    status = Column(String(20))
    days_to_resolve = Column(Float)
    reported_date = Column(String(20))
    resolved_date = Column(String(20))


class HteKpi(Base):
    __tablename__ = "hte_kpi"
    __table_args__ = (
        Index("ix_hte_kpi_college_year", "college_id", "year"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    college_id = Column(String(20), index=True)
    year = Column(Integer, index=True)
    student_satisfaction = Column(Float)
    placement_rate = Column(Float)
    graduation_rate = Column(Float)
    dropout_rate = Column(Float)
    faculty_student_ratio = Column(Float)
    research_score = Column(Float)
    infrastructure_score = Column(Float)
    financial_health_score = Column(Float)
    overall_state_rank = Column(Integer)


class Examination(Base):
    __tablename__ = "examination"

    exam_id = Column(String(20), primary_key=True, index=True)
    student_id = Column(String(20), index=True)
    semester = Column(Integer)
    subject = Column(String(200))
    marks = Column(Float)
    grade = Column(String(5))
    result = Column(String(10))
    exam_year = Column(Integer)
    attempt = Column(Integer)
