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

        prompt = f"""You are the official College AI Assistant for {college_name}.
Answer the user's question strictly using ONLY the provided document context below.

STRICT RULES:
1. Do NOT hallucinate, invent numbers, or fabricate company names or policies.
2. If the exact answer is NOT present in the provided context, state EXACTLY:
   "This information is not available in the uploaded documents for {college_name}."
3. Format your response cleanly using Markdown headings, bullet points, and tables where helpful.
4. Include source citations for facts presented.

RETRIEVED DOCUMENT CONTEXT FOR {college_name.upper()}:
{context_str}

USER QUESTION:
{query}

GROUNDED ANSWER:"""
        return prompt
