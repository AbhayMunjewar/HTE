export interface College {
  id: string;
  name: string;
  district: string;
  naacGrade: string;
  university: string;
  totalStudents: number;
  facultyCount: number;
  placementRate: number;
  averageCgpa: number;
  nirfRank: string | number;
  type: string;
}

export interface Student {
  id: string;
  collegeId: string;
  name: string;
  gender: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  attendance: number;
  hasScholarship: boolean;
  backlogs: number;
  internshipStatus: string;
  placementStatus: string;
}

export interface Faculty {
  id: string;
  collegeId: string;
  name: string;
  qualification: string;
  experienceYears: number;
  salary: number;
  researchProjects: number;
  patents: number;
  publications: number;
  department: string;
}

export interface PlacementInfo {
  id: string;
  collegeId: string;
  branch: string;
  companyVisited: string;
  jobRole: string;
  packageLpa: number;
  studentsPlaced: number;
}
