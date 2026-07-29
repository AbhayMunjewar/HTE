"""
HTE Decision Intelligence Platform — Chatbot: Intent Classifier & Entity Extractor
===================================================================================
Classifies incoming user queries into scopes, topics, and intent types.
Extracts named entities (colleges, districts, years, departments).
"""

import re
from typing import Dict, Any, List, Optional

COLLEGE_ALIASES = {
    "vjti": "Veermata Jijabai Technological Institute (VJTI)",
    "coep": "College of Engineering Pune (COEP)",
    "ict": "Institute of Chemical Technology (ICT)",
    "vnit": "Visvesvaraya National Institute of Technology (VNIT)",
    "walchand": "Walchand College of Engineering",
    "pict": "Pune Institute of Computer Technology (PICT)",
    "spit": "Sardar Patel Institute of Technology (SPIT)",
}

KNOWN_DISTRICTS = [
    "mumbai", "pune", "nagpur", "nashik", "aurangabad", "thane",
    "kolhapur", "solapur", "amravati", "sangli", "ratnagiri",
    "satara", "nanded", "jalgaon", "ahmednagar", "latur",
    "osmanabad", "beed", "parbhani", "hingoli", "washim",
    "yavatmal", "wardha", "chandrapur", "gadchiroli", "gondia",
    "bhandara", "buldhana", "akola", "sindhudurg", "raigad",
    "palghar", "dhule", "nandurbar", "mumbai city", "mumbai suburban",
]

TOPIC_MAP = {
    "students":       ["student", "enrollment", "enrolled", "scholarship", "attendance", "cgpa", "branch"],
    "faculty":        ["faculty", "teacher", "professor", "phd", "designation", "experience"],
    "placements":     ["placement", "package", "recruit", "salary", "company", "recruiter", "placed", "offer"],
    "research":       ["research", "publication", "patent", "funded project", "journal"],
    "infrastructure": ["infrastructure", "hostel", "lab", "classroom", "smart classroom", "internet", "solar", "library"],
    "finance":        ["finance", "budget", "grant", "expense", "funding", "revenue"],
    "complaints":     ["complaint", "grievance", "resolved", "pending"],
    "admissions":     ["admission", "seat", "capacity", "intake", "demand ratio"],
}

class IntentClassifier:
    @staticmethod
    def classify(query: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        q = query.lower().strip()
        result = {
            "scope": "COLLEGE",
            "colleges": [],
            "districts": [],
            "topic": "general",
            "response_type": "OVERVIEW",
            "use_dashboard_context": False,
        }

        # 1. Extract college aliases
        for alias, full_name in COLLEGE_ALIASES.items():
            if re.search(r'\b' + re.escape(alias) + r'\b', q):
                result["colleges"].append(full_name)

        # 2. Extract districts
        for dist in KNOWN_DISTRICTS:
            if re.search(r'\b' + re.escape(dist) + r'\b', q):
                result["districts"].append(dist.title())

        # 3. Topic detection
        for topic_name, keywords in TOPIC_MAP.items():
            if any(kw in q for kw in keywords):
                result["topic"] = topic_name
                break

        # 4. Response type classification
        focused_signals = [
            "how many", "what is", "what are", "how much", "show me the",
            "tell me the", "what's the", "give me the", "number of",
            "count of", "total number", "average", "mean",
            "is there", "does", "do they", "are there",
        ]
        analytical_signals = [
            "analyze", "analysis", "insight", "recommend", "suggest",
            "why", "reason", "explain why", "trend",
        ]

        if any(s in q for s in focused_signals):
            result["response_type"] = "FOCUSED"
        elif any(s in q for s in analytical_signals):
            result["response_type"] = "ANALYTICAL"
        else:
            word_count = len(q.split())
            if word_count <= 6 and result["topic"] != "general":
                result["response_type"] = "FOCUSED"
            else:
                result["response_type"] = "OVERVIEW"

        # 5. Scope detection hierarchy: PREDICTION > REPORT > COMPARISON > GLOBAL > DISTRICT > COLLEGE
        prediction_terms = ["predict", "forecast", "future admission", "enrollment forecast", "admission forecast"]
        if any(t in q for t in prediction_terms):
            result["scope"] = "PREDICTION"
            result["use_dashboard_context"] = len(result["colleges"]) == 0
            return result

        report_terms = ["generate report", "executive report", "monthly report", "government report"]
        if any(t in q for t in report_terms) or q.strip() == "report":
            result["scope"] = "REPORT"
            result["use_dashboard_context"] = len(result["colleges"]) == 0
            return result

        comparison_signals = ["compare", "vs", "versus", "difference between", "side by side", "comparison"]
        if any(t in q for t in comparison_signals):
            result["scope"] = "COMPARISON"
            result["use_dashboard_context"] = False
            return result

        global_signals = [
            "which college", "all college", "top college", "best college", "worst college",
            "top 5", "top 10", "top 15", "top 20",
            "highest placement", "lowest placement", "highest enrollment", "lowest enrollment",
            "highest admission", "lowest admission", "highest faculty", "lowest faculty",
            "most student", "least student", "most faculty", "least faculty",
            "most research", "most publication", "most patent", "most complaint",
            "state wide", "statewide", "state-wide", "state level", "across college",
            "across all", "which district", "best district", "all district",
            "ranking", "rank all", "overall performance",
            "require more", "need more", "shortage", "deficit",
            "best research", "best infrastructure", "best placement",
        ]
        if any(signal in q for signal in global_signals):
            result["scope"] = "GLOBAL"
            result["use_dashboard_context"] = False
            return result

        if result["districts"] and not result["colleges"]:
            result["scope"] = "DISTRICT"
            result["use_dashboard_context"] = False
            return result

        if result["colleges"]:
            result["scope"] = "COLLEGE"
            result["use_dashboard_context"] = False
            return result

        # Default fallback
        result["scope"] = "COLLEGE"
        result["use_dashboard_context"] = True
        return result
