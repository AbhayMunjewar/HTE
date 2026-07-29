"""
HTE Decision Intelligence Platform — Students Router
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.services.student_service import StudentService

router = APIRouter(prefix="/api")

@router.get("/students")
def get_students(
    limit: int = 50,
    page: int = 1,
    branch: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return StudentService.list_students(db, limit, page, branch)
