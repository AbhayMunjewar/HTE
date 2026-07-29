"""
HTE Decision Intelligence Platform — Faculty Router
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.services.faculty_service import FacultyService

router = APIRouter(prefix="/api")

@router.get("/faculty")
def get_faculty(
    limit: int = 50,
    page: int = 1,
    dept: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return FacultyService.list_faculty(db, limit, page, dept)
