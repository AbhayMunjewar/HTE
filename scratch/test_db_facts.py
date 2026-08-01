import sqlite3
import os
from app.config import DB_PATH

def fetch_db_facts_for_college(college_name: str) -> str:
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM colleges WHERE college_name LIKE ? OR college_name LIKE ? LIMIT 1", (f"%{college_name}%", f"%{college_name.split()[0]}%"))
        col = c.fetchone()
        if col:
            d = dict(col)
            return (
                f"Structured Dataset Record ({d.get('college_name')}):\n"
                f"- Total Enrolled Students: {d.get('total_students')}\n"
                f"- Total Faculty Count: {d.get('total_faculty')}\n"
                f"- NAAC Accreditation Grade: {d.get('naac_grade')} (Score: {d.get('accreditation_score')})\n"
                f"- Established Year: {d.get('established_year')}\n"
                f"- District/City: {d.get('district')}, {d.get('city')}\n"
                f"- Autonomous Status: {d.get('autonomous')}\n"
                f"- Hostel Facility: {d.get('hostel_available')}\n"
                f"- Courses Offered: {d.get('courses_offered')}\n"
            )
    except Exception as e:
        return f"Error: {e}"
    return "No DB match"

print("--- COEP DB FACTS ---")
print(fetch_db_facts_for_college("COEP"))

print("\n--- VJTI DB FACTS ---")
print(fetch_db_facts_for_college("VJTI"))
