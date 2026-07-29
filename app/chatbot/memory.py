"""
HTE Decision Intelligence Platform — Chatbot: Conversation Memory
==================================================================
Stores session history to support contextual follow-up questions.
(e.g., User: "Tell me about COEP" -> User: "What about placements?")
"""

from typing import Dict, Any, List, Optional

class ConversationMemory:
    _sessions: Dict[str, List[Dict[str, Any]]] = {}

    @classmethod
    def add_message(cls, session_id: str, role: str, text: str, intent: Optional[Dict[str, Any]] = None):
        if not session_id:
            session_id = "default"
        if session_id not in cls._sessions:
            cls._sessions[session_id] = []
        
        cls._sessions[session_id].append({
            "role": role,
            "text": text,
            "intent": intent or {}
        })
        # Keep last 10 turns
        if len(cls._sessions[session_id]) > 10:
            cls._sessions[session_id] = cls._sessions[session_id][-10:]

    @classmethod
    def get_last_college(cls, session_id: str) -> Optional[str]:
        if not session_id or session_id not in cls._sessions:
            return None
        # Search backwards for last mentioned college
        for turn in reversed(cls._sessions[session_id]):
            intent = turn.get("intent", {})
            colleges = intent.get("colleges", [])
            if colleges:
                return colleges[0]
        return None

    @classmethod
    def clear(cls, session_id: str):
        if session_id in cls._sessions:
            del cls._sessions[session_id]
