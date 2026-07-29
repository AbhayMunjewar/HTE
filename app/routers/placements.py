"""
HTE Decision Intelligence Platform — Placements Router
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.services.placement_service import PlacementService

router = APIRouter(prefix="/api")

@router.get("/placements")
def get_placements(
    limit: int = 50,
    page: int = 1,
    company: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return PlacementService.list_placements(db, limit, page, company)
