"""
HTE Decision Intelligence Platform — Colleges Router
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.services.college_service import CollegeService

router = APIRouter(prefix="/api")

@router.get("/colleges")
def get_colleges(
    search: Optional[str] = None,
    district: Optional[str] = None,
    naac: Optional[str] = None,
    limit: int = 50,
    page: int = 1,
    db: Session = Depends(get_db)
):
    return CollegeService.search(db, search, district, naac, limit, page)
