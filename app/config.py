"""
HTE Decision Intelligence Platform — Configuration
====================================================
Centralized settings, environment loading, and path resolution.
"""

import os

# ─── Project Paths ────────────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(PROJECT_ROOT, "Dataset")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
DB_PATH = os.path.join(PROJECT_ROOT, "hte_platform.db")
DB_URL = "sqlite:///{}".format(DB_PATH.replace("\\", "/"))

# ─── Environment Variables ────────────────────────────────────
def _load_dotenv():
    """Load .env file from project root (no dependency on python-dotenv)."""
    env_file = os.path.join(PROJECT_ROOT, ".env")
    if os.path.exists(env_file):
        try:
            with open(env_file, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip().strip('"').strip("'")
        except Exception:
            pass

_load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY", "")

# ─── App Settings ─────────────────────────────────────────────
API_HOST = os.environ.get("API_HOST", "0.0.0.0")
API_PORT = int(os.environ.get("API_PORT", "8000"))
DEBUG = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")

# ─── CSV File List (for import) ───────────────────────────────
CSV_FILES = [
    "colleges.csv",
    "students.csv",
    "faculty.csv",
    "placements.csv",
    "admissions.csv",
    "research.csv",
    "finance.csv",
    "infrastructure.csv",
    "complaints.csv",
    "hte_kpi.csv",
    "examination.csv",
]
