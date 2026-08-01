"""
HTE Platform — College Specific RAG Document Intelligence Assistant Router
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.rag.rag_service import college_rag_service

router = APIRouter(prefix="/api")

class CollegeAssistantRequest(BaseModel):
    college_name: str
    query: str
    session_id: Optional[str] = "default"

@router.post("/college-assistant")
def college_assistant_query(req: CollegeAssistantRequest):
    college_name = req.college_name or "COEP"
    # Auto normalize college name abbreviation if needed (e.g. COEP Technological University -> COEP)
    folder_name = "COEP" if "coep" in college_name.lower() else college_name
    
    return college_rag_service.answer_college_query(folder_name, req.query)
