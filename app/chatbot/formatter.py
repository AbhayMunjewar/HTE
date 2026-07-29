"""
HTE Decision Intelligence Platform — Chatbot Formatter
======================================================
Cleans and formats final responses for display in the frontend markdown viewer.
"""

class ChatbotFormatter:
    @staticmethod
    def format_fallback_response(grounded_facts: str) -> str:
        """Fallback response when LLM API is unavailable or returns error."""
        return grounded_facts.strip()
