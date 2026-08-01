"""
Main RAG Service Orchestrator for HTE College AI Assistant.
Orchestrates document search, Groq LLM synthesis, citations, and zero-hallucination responses.
"""

from typing import Dict, Any
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
            # Fallback grounded synthesis directly from top chunk
            top_chunk = chunks_with_scores[0][0]
            raw_answer = f"### 📄 Document Intelligence Summary ({college_name})\n\n{top_chunk['text']}"

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

# Global Service Instance
college_rag_service = CollegeRAGService()
