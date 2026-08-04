"""
HTE Decision Intelligence Platform — Branch Data Registry
===========================================================
Official branch-level datasets and fallback metrics for supported institutions.
Extensible architecture supporting dynamic additions of new colleges.
"""

from typing import Dict, List, Any, Optional

BRANCH_REGISTRY: Dict[str, List[Dict[str, Any]]] = {
    "College of Engineering Pune (COEP Technological University)": [
        {"branch_name": "Computer Engineering", "sanctioned_seats": 150, "applications": 1450, "placement_rate": 98.5, "avg_package": 16.5, "cutoff_percentile": 99.8, "faculty_count": 28},
        {"branch_name": "Information Technology", "sanctioned_seats": 120, "applications": 1100, "placement_rate": 97.0, "avg_package": 15.2, "cutoff_percentile": 99.5, "faculty_count": 22},
        {"branch_name": "Electronics & Telecommunication", "sanctioned_seats": 120, "applications": 980, "placement_rate": 94.0, "avg_package": 13.8, "cutoff_percentile": 99.1, "faculty_count": 24},
        {"branch_name": "Mechanical Engineering", "sanctioned_seats": 120, "applications": 850, "placement_rate": 88.0, "avg_package": 10.5, "cutoff_percentile": 98.2, "faculty_count": 30},
        {"branch_name": "Electrical Engineering", "sanctioned_seats": 90, "applications": 720, "placement_rate": 87.5, "avg_package": 10.2, "cutoff_percentile": 98.0, "faculty_count": 20},
        {"branch_name": "Civil Engineering", "sanctioned_seats": 90, "applications": 580, "placement_rate": 82.0, "avg_package": 8.5, "cutoff_percentile": 96.5, "faculty_count": 22},
        {"branch_name": "Instrumentation & Control", "sanctioned_seats": 60, "applications": 420, "placement_rate": 85.0, "avg_package": 9.8, "cutoff_percentile": 97.2, "faculty_count": 14},
        {"branch_name": "Manufacturing Science", "sanctioned_seats": 60, "applications": 350, "placement_rate": 80.0, "avg_package": 8.2, "cutoff_percentile": 95.8, "faculty_count": 12},
    ],
    "Veermata Jijabai Technological Institute (VJTI), Mumbai": [
        {"branch_name": "Computer Engineering", "sanctioned_seats": 120, "applications": 1380, "placement_rate": 99.0, "avg_package": 18.2, "cutoff_percentile": 99.8, "faculty_count": 25},
        {"branch_name": "Information Technology", "sanctioned_seats": 120, "applications": 1150, "placement_rate": 98.2, "avg_package": 16.8, "cutoff_percentile": 99.6, "faculty_count": 22},
        {"branch_name": "Electronics & Telecommunication", "sanctioned_seats": 120, "applications": 950, "placement_rate": 95.0, "avg_package": 14.5, "cutoff_percentile": 99.2, "faculty_count": 24},
        {"branch_name": "Electrical Engineering", "sanctioned_seats": 90, "applications": 780, "placement_rate": 90.0, "avg_package": 11.2, "cutoff_percentile": 98.5, "faculty_count": 18},
        {"branch_name": "Mechanical Engineering", "sanctioned_seats": 90, "applications": 720, "placement_rate": 89.0, "avg_package": 10.8, "cutoff_percentile": 98.1, "faculty_count": 22},
        {"branch_name": "Civil Engineering", "sanctioned_seats": 90, "applications": 540, "placement_rate": 83.5, "avg_package": 8.8, "cutoff_percentile": 96.8, "faculty_count": 18},
        {"branch_name": "Production Engineering", "sanctioned_seats": 60, "applications": 390, "placement_rate": 84.0, "avg_package": 8.6, "cutoff_percentile": 96.2, "faculty_count": 14},
        {"branch_name": "Textile Technology", "sanctioned_seats": 60, "applications": 280, "placement_rate": 78.0, "avg_package": 7.2, "cutoff_percentile": 93.5, "faculty_count": 12},
    ],
    "Walchand College of Engineering, Sangli": [
        {"branch_name": "Computer Science & Engineering", "sanctioned_seats": 120, "applications": 980, "placement_rate": 94.5, "avg_package": 12.5, "cutoff_percentile": 98.8, "faculty_count": 22},
        {"branch_name": "Information Technology", "sanctioned_seats": 60, "applications": 580, "placement_rate": 93.0, "avg_package": 11.8, "cutoff_percentile": 98.2, "faculty_count": 14},
        {"branch_name": "Electronics Engineering", "sanctioned_seats": 90, "applications": 620, "placement_rate": 89.0, "avg_package": 9.8, "cutoff_percentile": 97.5, "faculty_count": 18},
        {"branch_name": "Electrical Engineering", "sanctioned_seats": 90, "applications": 550, "placement_rate": 86.0, "avg_package": 8.5, "cutoff_percentile": 96.8, "faculty_count": 18},
        {"branch_name": "Mechanical Engineering", "sanctioned_seats": 120, "applications": 680, "placement_rate": 85.0, "avg_package": 8.2, "cutoff_percentile": 96.2, "faculty_count": 24},
        {"branch_name": "Civil Engineering", "sanctioned_seats": 90, "applications": 450, "placement_rate": 80.0, "avg_package": 7.2, "cutoff_percentile": 94.5, "faculty_count": 18},
    ],
    "Institute of Chemical Technology (ICT), Mumbai": [
        {"branch_name": "Chemical Engineering", "sanctioned_seats": 150, "applications": 1250, "placement_rate": 96.0, "avg_package": 15.0, "cutoff_percentile": 99.2, "faculty_count": 35},
        {"branch_name": "Dyestuff Technology", "sanctioned_seats": 40, "applications": 280, "placement_rate": 91.0, "avg_package": 10.8, "cutoff_percentile": 96.5, "faculty_count": 10},
        {"branch_name": "Fibres & Textile Processing", "sanctioned_seats": 40, "applications": 260, "placement_rate": 89.0, "avg_package": 9.8, "cutoff_percentile": 95.8, "faculty_count": 10},
        {"branch_name": "Food Engineering & Technology", "sanctioned_seats": 40, "applications": 340, "placement_rate": 92.5, "avg_package": 11.2, "cutoff_percentile": 97.2, "faculty_count": 12},
        {"branch_name": "Oils, Oleochemicals & Surfactants", "sanctioned_seats": 40, "applications": 240, "placement_rate": 88.0, "avg_package": 9.5, "cutoff_percentile": 95.0, "faculty_count": 10},
        {"branch_name": "Pharmaceuticals Chemistry & Tech", "sanctioned_seats": 40, "applications": 380, "placement_rate": 94.0, "avg_package": 12.2, "cutoff_percentile": 97.8, "faculty_count": 12},
        {"branch_name": "Polymer & Surface Engineering", "sanctioned_seats": 40, "applications": 310, "placement_rate": 90.5, "avg_package": 10.5, "cutoff_percentile": 96.8, "faculty_count": 11},
    ],
    "Sardar Patel Institute of Technology (SPIT), Mumbai": [
        {"branch_name": "Computer Engineering", "sanctioned_seats": 120, "applications": 1180, "placement_rate": 97.5, "avg_package": 15.8, "cutoff_percentile": 99.5, "faculty_count": 24},
        {"branch_name": "Computer Science & Eng (Data Science)", "sanctioned_seats": 60, "applications": 650, "placement_rate": 96.8, "avg_package": 15.0, "cutoff_percentile": 99.3, "faculty_count": 12},
        {"branch_name": "Computer Science & Eng (AIML)", "sanctioned_seats": 60, "applications": 680, "placement_rate": 97.0, "avg_package": 15.2, "cutoff_percentile": 99.4, "faculty_count": 12},
        {"branch_name": "Electronics & Telecommunication", "sanctioned_seats": 120, "applications": 820, "placement_rate": 92.0, "avg_package": 12.0, "cutoff_percentile": 98.4, "faculty_count": 22},
    ],
    "Pune Institute of Computer Technology (PICT), Pune": [
        {"branch_name": "Computer Engineering", "sanctioned_seats": 240, "applications": 2100, "placement_rate": 97.8, "avg_package": 14.8, "cutoff_percentile": 99.6, "faculty_count": 42},
        {"branch_name": "Information Technology", "sanctioned_seats": 180, "applications": 1650, "placement_rate": 96.5, "avg_package": 13.9, "cutoff_percentile": 99.3, "faculty_count": 32},
        {"branch_name": "Electronics & Telecommunication", "sanctioned_seats": 240, "applications": 1780, "placement_rate": 92.8, "avg_package": 11.5, "cutoff_percentile": 98.6, "faculty_count": 38},
        {"branch_name": "Artificial Intelligence & Data Science", "sanctioned_seats": 60, "applications": 720, "placement_rate": 96.0, "avg_package": 13.8, "cutoff_percentile": 99.2, "faculty_count": 12},
    ]
}

# Alias map for college name resolution
COLLEGE_ALIASES = {
    "coep": "College of Engineering Pune (COEP Technological University)",
    "coep pune": "College of Engineering Pune (COEP Technological University)",
    "coep tech": "College of Engineering Pune (COEP Technological University)",
    "vjti": "Veermata Jijabai Technological Institute (VJTI), Mumbai",
    "vjti mumbai": "Veermata Jijabai Technological Institute (VJTI), Mumbai",
    "wce": "Walchand College of Engineering, Sangli",
    "walchand": "Walchand College of Engineering, Sangli",
    "ict": "Institute of Chemical Technology (ICT), Mumbai",
    "ict mumbai": "Institute of Chemical Technology (ICT), Mumbai",
    "spit": "Sardar Patel Institute of Technology (SPIT), Mumbai",
    "spit mumbai": "Sardar Patel Institute of Technology (SPIT), Mumbai",
    "pict": "Pune Institute of Computer Technology (PICT), Pune",
    "pict pune": "Pune Institute of Computer Technology (PICT), Pune",
}


def get_branches_for_college(college_name: str) -> List[Dict[str, Any]]:
    """Returns official branches for a college, searching alias mapping or default fallback."""
    c_lower = college_name.lower().strip()
    
    # Try exact match or alias match
    for alias, full_name in COLLEGE_ALIASES.items():
        if alias in c_lower or full_name.lower() in c_lower:
            return BRANCH_REGISTRY[full_name]
            
    for full_name, branches in BRANCH_REGISTRY.items():
        if full_name.lower() in c_lower or any(word in c_lower for word in full_name.lower().split()):
            return branches

    # Default fallback generic engineering branches for unlisted colleges
    return [
        {"branch_name": "Computer Engineering", "sanctioned_seats": 120, "applications": 600, "placement_rate": 85.0, "avg_package": 8.5, "cutoff_percentile": 90.0, "faculty_count": 15},
        {"branch_name": "Information Technology", "sanctioned_seats": 60, "applications": 350, "placement_rate": 82.0, "avg_package": 7.8, "cutoff_percentile": 88.0, "faculty_count": 10},
        {"branch_name": "Mechanical Engineering", "sanctioned_seats": 90, "applications": 400, "placement_rate": 70.0, "avg_package": 5.5, "cutoff_percentile": 78.0, "faculty_count": 12},
        {"branch_name": "Civil Engineering", "sanctioned_seats": 60, "applications": 250, "placement_rate": 65.0, "avg_package": 5.0, "cutoff_percentile": 72.0, "faculty_count": 10},
        {"branch_name": "Electrical Engineering", "sanctioned_seats": 60, "applications": 300, "placement_rate": 72.0, "avg_package": 6.0, "cutoff_percentile": 80.0, "faculty_count": 10},
    ]


def get_branch_details(college_name: str, branch_name: str) -> Optional[Dict[str, Any]]:
    """Finds specific branch metrics for a given college and branch name."""
    branches = get_branches_for_college(college_name)
    b_lower = branch_name.lower().strip()
    
    for b in branches:
        if b["branch_name"].lower() == b_lower or b_lower in b["branch_name"].lower():
            return b
            
    return branches[0] if branches else None
