"""
Prompt Builder for HTE RAG Intelligence Module.
Constructs strict zero-hallucination prompts with citations.
"""

from typing import List, Dict, Any, Tuple

class RAGPromptBuilder:
    @staticmethod
    def build_prompt(college_name: str, query: str, context_chunks: List[Tuple[Dict[str, Any], float]]) -> str:
        """Builds strict grounded LLM prompt using retrieved chunks."""
        context_str = ""
        for idx, (chunk, score) in enumerate(context_chunks, 1):
            doc = chunk.get("document_name", "Document")
            page = chunk.get("page_number", 1)
            heading = chunk.get("section_heading", "General")
            text = chunk.get("text", "")
            confidence = int(score * 100)
            context_str += f"\n--- [CHUNK {idx}] Document: {doc} | Page: {page} | Section: {heading} | Confidence: {confidence}% ---\n{text}\n"

        prompt = f"""You are the official Senior Strategic AI Advisor for {college_name} under the Government of Maharashtra Higher & Technical Education Department.

INSTRUCTIONS & GUIDELINES:
1. For Specific Fact Queries (e.g. salary, coordinators, courses, numbers): Answer directly using the provided facts and document context. Never hallucinate fake metrics.
2. For Diagnostic & Strategy Queries (e.g. "why is placement/enrollment/ranking low", "how to increase/improve performance", "tips to boost rank"):
   - Provide a clear Diagnostic Root-Cause Analysis based on institutional facts & metrics.
   - Provide 4 to 5 Actionable Strategic Recommendations & Tips to improve the performance (e.g. NEP 2020 curriculum updates, TPO skill bootcamps, RUSA infrastructure grants, NBA accreditation drives).
3. Use clean Markdown headings, bold text, and bullet points.

RETRIEVED CONTEXT & DATASET FACTS FOR {college_name.upper()}:
{context_str}

USER QUESTION:
{query}

GROUNDED STRATEGIC RESPONSE:"""
        return prompt
