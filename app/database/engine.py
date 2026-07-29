"""
HTE Decision Intelligence Platform — Database Engine
=====================================================
SQLAlchemy engine, session factory, and Base declarative class.
Uses SQLite (file-based) for zero-infrastructure deployment.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import DB_URL

engine = create_engine(
    DB_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite + FastAPI
    echo=False,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session, auto-closes on exit."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
