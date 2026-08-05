"""
Prompt Builder for HTE RAG Intelligence Module.
Constructs strict zero-hallucination prompts with citations.
"""

from typing import List, Dict, Any, Tuple

class RAGPromptBuilder:
    @staticmethod
    def build_prompt(college_name: str, query: str, context_chunks: List[Tuple[Dict[str, Any], float]]) -> str:
        """Builds strict grounded LLM prompt with step-by-step reasoning and target college lockdown."""
        context_str = ""
        for idx, (chunk, score) in enumerate(context_chunks, 1):
            doc = chunk.get("document_name", "Document")
            page = chunk.get("page_number", 1)
            heading = chunk.get("section_heading", "General")
            text = chunk.get("text", "")
            confidence = int(score * 100)
            context_str += f"\n--- [PDF CHUNK {idx}] File: {doc} | Page: {page} | Section: {heading} | Confidence: {confidence}% ---\n{text}\n"

        prompt = f"""TARGET INSTITUTION LOCKDOWN: {college_name.upper()} ONLY

STRICT REASONING INSTRUCTIONS:
1. UNDERSTAND THE QUESTION: Read the user question carefully to determine what specific metric, placement statistic, faculty info, or report detail is requested for {college_name}.
2. PDF DOCUMENT ANALYSIS FIRST: Look through the [PDF CHUNK] section below for {college_name}. Extract exact figures, salary packages, and placement percentages if present.
3. SQLITE DATASET ANALYSIS SECOND: If the details are not found in the PDF chunks, refer to the official SQLite dataset facts for {college_name}.
4. STRICT ISOLATION & ZERO HALLUCINATION: You are answering ONLY for {college_name}. Never mention or inject facts about any other college (such as VJTI, COEP, SPIT, WCE, ICT, etc.).
5. HUMAN-LIKE EXECUTIVE RESPONSE: Formulate the final answer in natural, professional, human conversational markdown with headings and bullet points.

RETRIEVED KNOWLEDGE BASE FACTS FOR {college_name.upper()}:
{context_str}

USER QUESTION:
{query}

ACCURATE HUMAN-LIKE RESPONSE FOR {college_name.upper()}:"""
        return prompt
