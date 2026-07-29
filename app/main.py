"""
HTE Decision Intelligence Platform — Application Factory
=========================================================
FastAPI application initialization with CORS middleware, DB auto-import, and all API routers.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.importer import init_db
from app.routers import health, stats, colleges, students, faculty, placements, predict, assistant

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HTE_Application")

def create_app() -> FastAPI:
    app = FastAPI(
        title="Maharashtra HTE Decision Intelligence API",
        description="Production Backend Engine powered by SQLite ORM & ExtraTrees ML v3.0",
        version="3.0"
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Initialize SQLite Database on startup
    @app.on_event("startup")
    def startup_event():
        logger.info("Initializing HTE Database Engine...")
        init_db(force=False)

    # Register Routers
    app.include_router(health.router)
    app.include_router(stats.router)
    app.include_router(colleges.router)
    app.include_router(students.router)
    app.include_router(faculty.router)
    app.include_router(placements.router)
    app.include_router(predict.router)
    app.include_router(assistant.router)

    return app

app = create_app()
