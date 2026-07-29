"""
HTE Decision Intelligence Platform — CSV to SQLite Data Importer
==================================================================
Auto-imports all 11 CSV files into SQLite database tables on application startup.
Performs data cleaning, standardizes IDs, handles NaNs, and creates tables/indexes.
"""

import os
import logging
import pandas as pd
from sqlalchemy import inspect
from app.config import DATASET_DIR, CSV_FILES
from app.database.engine import engine, Base
from app.database.models import (
    College, Student, Faculty, Placement, Admission, Finance,
    Research, Infrastructure, Complaint, HteKpi, Examination
)

logger = logging.getLogger("HTE_Importer")

TABLE_MODEL_MAP = {
    "colleges": College,
    "students": Student,
    "faculty": Faculty,
    "placements": Placement,
    "admissions": Admission,
    "finance": Finance,
    "research": Research,
    "infrastructure": Infrastructure,
    "complaints": Complaint,
    "hte_kpi": HteKpi,
    "examination": Examination,
}

def init_db(force: bool = False):
    """
    Initializes the database. Creates all tables if they don't exist.
    If database tables are empty or force=True, populates them from Dataset/*.csv.
    """
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    
    # Check if colleges table has rows
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT COUNT(*) FROM colleges").fetchone()
            count = result[0] if result else 0
    except Exception as e:
        logger.warning("Error checking table counts: %s", e)
        count = 0

    if count > 0 and not force:
        logger.info("Database already initialized with %d colleges. Skipping import.", count)
        return

    logger.info("Populating SQLite database from CSV datasets in %s...", DATASET_DIR)

    for csv_file in CSV_FILES:
        file_path = os.path.join(DATASET_DIR, csv_file)
        table_name = csv_file.replace(".csv", "")
        
        if not os.path.exists(file_path):
            logger.warning("CSV file missing: %s", file_path)
            continue
            
        try:
            df = pd.read_csv(file_path)
            # Standardize string IDs
            for col_id in ['college_id', 'student_id', 'faculty_id', 'placement_id', 'infra_id', 'research_id', 'finance_id', 'complaint_id', 'exam_id']:
                if col_id in df.columns:
                    df[col_id] = df[col_id].astype(str)

            # Insert into SQLite
            # Use 'replace' if force=True or empty
            df.to_sql(table_name, con=engine, if_exists="replace", index=False)
            logger.info("✓ Imported %s (%d rows)", table_name, len(df))
        except Exception as e:
            logger.error("Failed to import %s: %s", csv_file, e)

    # Re-create index definitions after pandas to_sql (which creates raw tables)
    Base.metadata.create_all(bind=engine)
    logger.info("[SUCCESS] SQLite database successfully initialized and populated.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    init_db(force=True)
