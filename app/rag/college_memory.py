"""
College Conversation Memory for HTE College AI Assistant.
Maintains multi-turn context per college and resets memory automatically when switching colleges.
"""

from typing import List, Dict, Any

class CollegeMemoryManager:
    def __init__(self):
        self.current_college: str = ""
        self.history: List[Dict[str, str]] = []

    def set_college(self, college_name: str):
        """Sets target college and resets history if user switched colleges."""
        if self.current_college != college_name:
            self.current_college = college_name
            self.history = []

    def add_turn(self, user_query: str, ai_response: str):
        self.history.append({"user": user_query, "ai": ai_response})
        # Keep last 5 turns
        if len(self.history) > 5:
            self.history.pop(0)

    def get_history(self) -> List[Dict[str, str]]:
        return self.history

# Global Memory Instance
college_memory = CollegeMemoryManager()
