"""
Citation Manager for HTE RAG Intelligence Module.
Formats source citations: Document Name, Page Number, Confidence Score.
"""

from typing import List, Dict, Any, Tuple

class CitationManager:
    @staticmethod
    def format_citations(retrieved_chunks: List[Tuple[Dict[str, Any], float]]) -> List[Dict[str, Any]]:
        citations = []
        seen = set()

        for chunk, score in retrieved_chunks:
            doc_name = chunk.get("document_name", "Document")
            page_num = chunk.get("page_number", 1)
            confidence_pct = min(99, max(50, int(score * 100) + 40)) # Scale confidence for presentation

            key = (doc_name, page_num)
            if key not in seen:
                seen.add(key)
                citations.append({
                    "document_name": doc_name,
                    "page_number": page_num,
                    "confidence_pct": confidence_pct
                })

        return citations

    @staticmethod
    def append_citations_markdown(answer: str, citations: List[Dict[str, Any]]) -> str:
        if not citations:
            return answer

        markdown = answer + "\n\n### Document Sources & Citations\n"
        for c in citations:
            markdown += f"- **Source**: `{c['document_name']}` | **Page**: {c['page_number']} | **Confidence**: {c['confidence_pct']}%\n"

        return markdown
