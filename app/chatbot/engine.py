"""
HTE Decision Intelligence Platform — Chatbot Engine
===================================================
Main Orchestrator for AI Assistant queries:
1. Anti-hallucination check for out-of-scope queries
2. Multi-turn memory resolution
3. Intent Classification & Scope Detection
4. SQL Analytics Query Routing
5. Groq LLM API synthesis or direct grounded fallback
"""

import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.chatbot.intents import IntentClassifier
from app.chatbot.memory import ConversationMemory
from app.chatbot.router import ChatbotRouter
from app.chatbot.ollama_client import OllamaClient
from app.chatbot.groq_client import GroqClient
from app.chatbot.formatter import ChatbotFormatter
from app.database.engine import SessionLocal

logger = logging.getLogger("HTE_Chatbot_Engine")

OUT_OF_SCOPE_TERMS = [
    "weather", "paris", "movie", "actor", "sports", "cricket",
    "football", "recipe", "stock", "bitcoin", "president", "currency",
    "song", "flight", "game", "restaurant", "hotel room"
]

DATASET_KEYWORDS = [
    "vjti", "coep", "ict", "spit", "pict", "walchand", "vnit", "college", "student", "faculty", "placement",
    "predict", "admission", "research", "finance", "budget", "complaint",
    "infrastructure", "scholarship", "report", "district", "top", "highest",
    "lowest", "compare", "comparison", "vs", "versus", "difference", "alert", "salary", "package", "hostel", "lab",
    "classroom", "grant", "publication", "patent", "enrolled", "seat", "capacity",
    "require more", "shortage", "need more"
]

class ChatbotEngine:
    def process_query(self, query: str, context: Optional[Dict[str, Any]] = None, session_id: str = "default") -> Dict[str, Any]:
        ctx = context or {}
        active_college = ctx.get("college_name") or ctx.get("name") or "VJTI Mumbai"
        active_district = ctx.get("district", "Mumbai")
        q_lower = query.lower().strip()

        # 1. Anti-hallucination out-of-scope check
        import re
        is_general_edu = any(w in q_lower for w in ["engineering", "naac", "nirf", "degree", "diploma", "python", "c++", "ai", "machine learning"])
        is_out_of_scope = any(re.search(r'\b' + re.escape(term) + r'\b', q_lower) for term in OUT_OF_SCOPE_TERMS)
        if is_out_of_scope or (not is_general_edu and not any(kw in q_lower for kw in DATASET_KEYWORDS)):
            return {"answer": "This information is not available in the current HTE knowledge base."}

        # 2. Intent classification & entity extraction
        intent = IntentClassifier.classify(query, ctx)

        # 3. Contextual memory resolution
        last_college = ConversationMemory.get_last_college(session_id)
        if intent["scope"] == "COLLEGE" and not intent["colleges"] and last_college:
            intent["colleges"].append(last_college)
            intent["use_dashboard_context"] = False

        # Store turn in memory
        ConversationMemory.add_message(session_id, "user", query, intent)

        # Resolve target college
        if intent["scope"] == "COLLEGE" and intent["colleges"]:
            target_college = intent["colleges"][0]
        else:
            target_college = active_college

        # If query is about a college, delegate to college_rag_service (handles Document RAG if docs exist, or Dataset Facts if no docs exist)
        if target_college and (intent["scope"] == "COLLEGE" or any(kw in q_lower for kw in ["college", "institute", "university", "vjti", "coep", "ict", "spit", "pict", "walchand", "wce", "vnit"])):
            try:
                from app.rag.rag_service import college_rag_service
                rag_res = college_rag_service.answer_college_query(target_college, query)
                if rag_res and rag_res.get("answer"):
                    return {"answer": rag_res["answer"]}
            except Exception as e:
                logger.warning(f"College RAG service failed in engine: {e}")

        # 4. Route query to SQL database / analytics engine
        db: Session = SessionLocal()
        try:
            route_result = ChatbotRouter.route_query(db, query, intent, target_college, active_district)
        finally:
            db.close()

        grounded_facts = route_result.get("grounded_facts", "")
        hint = route_result.get("hint", "")

        # 5. Call Ollama/Groq LLM API or fallback to grounded facts
        llm_response = OllamaClient.generate_response(query, grounded_facts, hint)
        final_answer = llm_response if llm_response else ChatbotFormatter.format_fallback_response(grounded_facts)

        return {"answer": final_answer}

chatbot_engine = ChatbotEngine()
