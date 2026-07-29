"""
HTE Decision Intelligence Platform — Stats Router
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.services.stats_service import StatsService

router = APIRouter(prefix="/api")

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return StatsService.get_state_stats(db)
