"""
HTE Decision Intelligence Platform — AI Assistant Router
"""

from fastapi import APIRouter
from app.schemas.schemas import AssistantRequest
from app.chatbot.engine import chatbot_engine

router = APIRouter(prefix="/api")

@router.post("/assistant")
def ai_assistant_query(req: AssistantRequest):
    session_id = req.session_id or "default"
    return chatbot_engine.process_query(req.query, req.context, session_id)
