"""
Prompt Builder for HTE RAG Intelligence Module.
Constructs strict zero-hallucination prompts with citations.
"""

from typing import List, Dict, Any, Tuple

class RAGPromptBuilder:
    @staticmethod
    def build_prompt(college_name: str, query: str, context_chunks: List[Tuple[Dict[str, Any], float]], extra_facts: str = "") -> str:
        """Builds strict grounded LLM prompt with step-by-step reasoning and target college lockdown."""
        context_str = ""
        for idx, (chunk, score) in enumerate(context_chunks, 1):
            doc = chunk.get("document_name", "Document")
            page = chunk.get("page_number", 1)
            heading = chunk.get("section_heading", "General")
            text = chunk.get("text", "")
            confidence = int(score * 100)
            context_str += f"\n--- [PDF CHUNK {idx}] File: {doc} | Page: {page} | Section: {heading} | Confidence: {confidence}% ---\n{text}\n"

        if extra_facts:
            context_str += f"\n{extra_facts}\n"

        prompt = f"""TARGET INSTITUTION LOCKDOWN: {college_name.upper()} ONLY

STRICT REASONING INSTRUCTIONS:
1. UNDERSTAND THE QUESTION: Read the user question carefully to determine what specific metric, placement statistic, faculty info, or report detail is requested for {college_name}.
2. PDF DOCUMENT ANALYSIS FIRST: Look through the [RETRIEVED KNOWLEDGE BASE FACTS] section below for {college_name}. Extract exact figures, salary packages, and placement percentages if present.
3. SQLITE DATASET ANALYSIS SECOND: Refer to the official SQLite dataset facts for {college_name}.
4. STRICT ISOLATION & ZERO HALLUCINATION: You are answering ONLY for {college_name}. Never mention or inject facts about any other college (such as VJTI, COEP, SPIT, WCE, ICT, etc.).
5. HUMAN-LIKE EXECUTIVE RESPONSE: Formulate the final answer in natural, professional, human conversational markdown with headings and bullet points.
6. BRANCH PLACEMENT DIAGNOSTIC RULE: If the user asks why placements are low or asks for branch placement rates, YOU MUST INCLUDE THE COMPLETE BRANCH-WISE PLACEMENT TABLE for ALL branches present in the document (CSE, E&TC, Civil, Planning, Manufacturing, Mechanical, Electrical, Instrumentation, Metallurgy), state the exact percentage for low branches (e.g. E&TC 54.65%, Civil 65.12%, Planning 66.67%), analyze root causes (core vs IT demand mismatch, selective core hiring, exam preparation), and provide strategic actionable recommendations. DO NOT omit branches or say data is unavailable if document facts are provided below!

RETRIEVED KNOWLEDGE BASE FACTS FOR {college_name.upper()}:
{context_str}

USER QUESTION:
{query}

ACCURATE HUMAN-LIKE RESPONSE FOR {college_name.upper()}:"""
        return prompt
