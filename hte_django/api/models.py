from django.db import models

class College(models.Model):
    college_id = models.CharField(max_length=20, primary_key=True)
    college_name = models.CharField(max_length=255)
    college_type = models.CharField(max_length=100, default="Government Autonomous")
    ownership = models.CharField(max_length=100, default="Government")
    district = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    university = models.CharField(max_length=255)
    established_year = models.IntegerField(default=1980)
    naac_grade = models.CharField(max_length=10, default="A")
    nirf_rank = models.CharField(max_length=20, default="Not Ranked")
    autonomous = models.CharField(max_length=10, default="Yes")
    total_students = models.IntegerField(default=1200)
    total_faculty = models.IntegerField(default=80)
    placement_rate = models.FloatField(default=75.0)

    def __str__(self):
        return self.college_name


class Student(models.Model):
    student_id = models.CharField(max_length=20, primary_key=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, null=True, blank=True)
    roll_no = models.CharField(max_length=50)
    branch = models.CharField(max_length=100)
    cgpa = models.FloatField(default=7.5)
    attendance = models.FloatField(default=80.0)
    scholarship = models.CharField(max_length=10, default="No")
    placement_status = models.CharField(max_length=20, default="Not Placed")

    def __str__(self):
        return f"{self.student_id} - {self.branch}"


class Faculty(models.Model):
    faculty_id = models.CharField(max_length=20, primary_key=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    qualification = models.CharField(max_length=100)
    experience_years = models.IntegerField(default=5)
    publications = models.IntegerField(default=0)
    patents = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Placement(models.Model):
    placement_id = models.CharField(max_length=20, primary_key=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, null=True, blank=True)
    branch = models.CharField(max_length=100)
    company = models.CharField(max_length=200)
    package_lpa = models.FloatField(default=6.5)
    job_role = models.CharField(max_length=150)
    location = models.CharField(max_length=100)
    placement_status = models.CharField(max_length=20, default="Placed")

    def __str__(self):
        return f"{self.company} - {self.package_lpa} LPA"
