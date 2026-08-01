"""
Main RAG Service Orchestrator for HTE College AI Assistant.
Orchestrates document search, Groq LLM synthesis, citations, and zero-hallucination responses.
"""

from typing import Dict, Any, List, Tuple
from app.rag.retriever import RAGRetriever
from app.rag.prompt import RAGPromptBuilder
from app.rag.citation import CitationManager
from app.rag.college_memory import college_memory
from app.chatbot.groq_client import GroqClient

class CollegeRAGService:
    def __init__(self, base_docs_dir: str = None, base_index_dir: str = None):
        self.retriever = RAGRetriever(base_docs_dir, base_index_dir)

    def answer_college_query(self, college_name: str, query: str) -> Dict[str, Any]:
        """Answers a college-specific query using ONLY that college's document RAG index."""
        # 1. Update college memory
        college_memory.set_college(college_name)

        # 2. Retrieve relevant document chunks from target college vector store
        chunks_with_scores = self.retriever.retrieve(college_name, query, top_k=5)

        # 3. If no relevant chunks found in documents, return strict no-info response
        if not chunks_with_scores:
            no_info_text = f"This information is not available in the uploaded documents for {college_name}."
            return {
                "answer": no_info_text,
                "citations": [],
                "college_name": college_name,
                "confidence_score": 0
            }

        # 4. Format citations
        citations = CitationManager.format_citations(chunks_with_scores)

        # 5. Build RAG Prompt
        prompt = RAGPromptBuilder.build_prompt(college_name, query, chunks_with_scores)

        # 6. Call Groq LLM for grounded answer synthesis
        raw_answer = GroqClient.generate_response(user_query=query, grounded_facts=prompt)

        if not raw_answer:
            # Smart grounded fallback extraction directly answering the user query
            raw_answer = self._smart_grounded_fallback(query, college_name, chunks_with_scores)

        # 7. Append citations to answer markdown
        final_answer = CitationManager.append_citations_markdown(raw_answer, citations)

        # 8. Record in memory
        college_memory.add_turn(query, final_answer)

        top_confidence = citations[0]["confidence_pct"] if citations else 85

        return {
            "answer": final_answer,
            "citations": citations,
            "college_name": college_name,
            "confidence_score": top_confidence
        }

    def _smart_grounded_fallback(self, query: str, college_name: str, chunks_with_scores: List[Tuple[Dict[str, Any], float]]) -> str:
        """Synthesizes structured grounded answers directly matching the query if LLM is offline."""
        q = query.lower()
        combined_text = "\n".join([chunk[0]["text"] for chunk in chunks_with_scores])
        lines = [l.strip() for l in combined_text.split('\n') if l.strip()]

        # 1. Salary / Packages / Companies > 40 LPA
        if any(k in q for k in ['40', 'package', 'salary', 'lpa', 'ctc', 'company', 'companies', 'recruiter']):
            matched_items = []

            # If user asked for > 40 LPA or 40+ LPA
            if '40' in q or 'forty' in q or 'highest' in q:
                for line in lines:
                    if line.startswith('--- RANGE OF SALARY') and not any(t in line for t in ['85+', '50+', '40+']):
                        continue
                    if any(k in line.lower() for k in ['85+', '60.', '52.', '50+', '42.', '40.', '40+', '57.', '44.']) or any(c in line.lower() for c in ['deshaw', 'nutanix', 'cohesity', 'arcesium', 'texas instruments', 'phone pe', 'arista', 'microsoft', 'blue star', 'palo alto', 'ncsi', 'transguard']):
                        if line not in matched_items and not line.startswith('===') and not line.startswith('--- RANGE OF SALARY PACKAGE OFFERED: 4+'):
                            matched_items.append(line)

            # General package fallback if specific list empty
            if not matched_items:
                for line in lines:
                    if not line.startswith('--- RANGE OF SALARY') and any(k in line.lower() for k in ['lpa', 'ctc', 'highest', 'company', 'salary', 'placed']):
                        if line not in matched_items and not line.startswith('==='):
                            matched_items.append(line)

            if matched_items:
                ans = f"### Salary Packages & Top Companies (> 40 LPA) ({college_name})\n\n"
                ans += f"Based on official uploaded records for **{college_name}**:\n\n"
                for item in matched_items[:15]:
                    if not item.startswith('--- RANGE'):
                        ans += f"- {item}\n"
                return ans

        # 2. Placement Coordinators / Faculty
        if any(k in q for k in ['coordinator', 'coordinators', 'faculty', 'tpo', 'officer', 'contact']):
            matched_items = [l for l in lines if any(k in l.lower() for k in ['dr.', 'tpo', 'coordinator', 'officer', 'email', 'mobile', '@coeptech', '@vjti'])]
            if matched_items:
                ans = f"### Training & Placement Coordinators ({college_name})\n\n"
                for item in matched_items[:12]:
                    ans += f"- {item}\n"
                return ans

        # Default fallback: Clean bullet points
        clean_lines = [l for l in lines if not l.startswith('===') and not l.startswith('---')]
        ans = f"### Document Intelligence Summary ({college_name})\n\n"
        for l in clean_lines[:10]:
            ans += f"- {l}\n"
        return ans

# Global Service Instance
college_rag_service = CollegeRAGService()
