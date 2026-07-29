"""
===============================================================================
MAHARASHTRA HTE DECISION INTELLIGENCE PLATFORM
Backend Server Entry Point
===============================================================================
Imports refactored FastAPI app factory from app.main and launches uvicorn server.
Fully backward compatible with all API contracts and frontend requirements.
===============================================================================
"""

import uvicorn
from app.main import app
from app.config import API_HOST, API_PORT

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=API_HOST, port=API_PORT, reload=False)
