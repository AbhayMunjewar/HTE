const mockColleges = [
  { id: "c1", name: "Government College of Engineering, Pune (COEP)", district: "Pune", naacGrade: "A++", university: "Savitribai Phule Pune University", totalStudents: 4500, facultyCount: 350, placementRate: 92, averageCgpa: 8.5 },
  { id: "c2", name: "Veermata Jijabai Technological Institute (VJTI)", district: "Mumbai", naacGrade: "A++", university: "Mumbai University", totalStudents: 3800, facultyCount: 300, placementRate: 95, averageCgpa: 8.7 },
  { id: "c3", name: "Walchand College of Engineering", district: "Sangli", naacGrade: "A+", university: "Shivaji University", totalStudents: 3000, facultyCount: 220, placementRate: 85, averageCgpa: 8.1 },
  { id: "c4", name: "Government College of Engineering, Aurangabad", district: "Aurangabad", naacGrade: "A", university: "Dr. BAMU", totalStudents: 2500, facultyCount: 180, placementRate: 75, averageCgpa: 7.8 },
  { id: "c5", name: "Visvesvaraya National Institute of Technology (VNIT)", district: "Nagpur", naacGrade: "A++", university: "Autonomous (NIT)", totalStudents: 5000, facultyCount: 400, placementRate: 96, averageCgpa: 8.8 }
];

const dashboardMetrics = {
  totalStudents: 612450,
  totalColleges: 384,
  totalFaculty: 45210,
  placementRate: 78.5,
  averageCgpa: 7.9,
  scholarshipStudents: 185000,
  studentAdmissionTrend: [
    { year: '2019', students: 510000 },
    { year: '2020', students: 525000 },
    { year: '2021', students: 540000 },
    { year: '2022', students: 565000 },
    { year: '2023', students: 590000 },
    { year: '2024', students: 612450 },
  ],
  studentsByBranch: [
    { name: 'Computer Eng', value: 180000 },
    { name: 'IT', value: 120000 },
    { name: 'Mechanical', value: 110000 },
    { name: 'Civil', value: 95000 },
    { name: 'Electrical', value: 70000 },
    { name: 'Others', value: 37450 },
  ]
};
