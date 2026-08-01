"""
Query Router for HTE College AI Assistant.
Intelligently classifies user query intent into SQL, ML Prediction, Document RAG, or General LLM.
"""

import re

class RAGQueryRouter:
    @staticmethod
    def route_query(query: str) -> str:
        q = query.lower().strip()

        # 1. ML Enrollment Prediction Intent
        ml_keywords = ['predict', 'future admission', 'capacity forecast', 'seat utilization', 'expected growth', 'predict enrollment', 'forecast']
        if any(k in q for k in ml_keywords):
            return "ML_PREDICTION"

        # 2. RAG Document Intelligence Intent (Highest priority for college documents)
        rag_keywords = [
            'package', 'salary', 'highest package', 'average package', 'ctc', 'companies', 'company',
            'visited', 'lpa', 'placement statistics', 'placement report', 'mandatory disclosure',
            'aicte', 'nba', 'accredited', 'coordinator', 'coordinators', 'tpo', 'faculty advisor',
            'scholarship', 'scholarships', 'tatasamarth', 'cybage', 'pragati', 'fee waiver',
            'annual report', 'facilities', 'infrastructure report', 'policy', 'disclosure'
        ]
        if any(k in q for k in rag_keywords):
            return "RAG"

        # 3. Structured SQLite Database Query Intent
        sql_keywords = ['how many students', 'total students', 'nirf rank', 'naac grade', 'cutoff', 'seat count', 'district']
        if any(k in q for k in sql_keywords):
            return "SQL"

        # Default to RAG for college-specific assistant
        return "RAG"
