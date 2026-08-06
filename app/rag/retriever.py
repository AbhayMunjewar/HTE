"""
Retriever Module for HTE RAG Intelligence.
Queries the isolated vector store of the selected college and returns top-k chunks with confidence scores.
"""

from typing import List, Dict, Any, Tuple
from app.rag.indexer import DocumentIndexer
from app.rag.embeddings import EmbeddingGenerator

class RAGRetriever:
    def __init__(self, base_docs_dir: str = None, base_index_dir: str = None):
        self.indexer = DocumentIndexer(base_docs_dir, base_index_dir)

    def retrieve(self, college_name: str, query: str, top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
        """Retrieves top-k relevant document chunks with confidence scores for the specified college."""
        from app.rag.document_loader import DocumentLoader
        norm_name = DocumentLoader.normalize_college_name(college_name)
        vector_store = self.indexer.index_college(norm_name)

        if not vector_store.chunks or vector_store.vectorizer is None:
            return []

        # Vectorize query using college vectorizer
        try:
            query_matrix = vector_store.vectorizer.transform([query]).toarray()
            # Normalize vector
            norm = float((query_matrix ** 2).sum() ** 0.5)
            if norm > 0:
                query_vector = query_matrix / norm
            else:
                query_vector = query_matrix

            results = vector_store.similarity_search(query_vector, top_k=top_k)
            return results
        except Exception as e:
            print(f"[RAGRetriever] Retrieval error for {college_name}: {e}")
            return []
