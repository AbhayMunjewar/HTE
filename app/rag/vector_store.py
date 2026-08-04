"""
Isolated Vector Store Engine for HTE RAG Intelligence Module.
Manages isolated FAISS-style vector index files per college under backend/indexes/{COLLEGE_NAME}/.
Supports incremental indexing so only new/modified documents are updated.
"""

import os
import pickle
from typing import List, Dict, Any, Tuple
import numpy as np

class VectorStore:
    def __init__(self, college_name: str, base_index_dir: str = None):
        self.college_name = college_name
        if base_index_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.index_dir = os.path.join(base_dir, "indexes", college_name)
        else:
            self.index_dir = os.path.join(base_index_dir, college_name)

        os.makedirs(self.index_dir, exist_ok=True)
        self.index_file = os.path.join(self.index_dir, "faiss.index")

        self.chunks: List[Dict[str, Any]] = []
        self.doc_mtimes: Dict[str, float] = {}
        self.vectorizer = None
        self.embedding_matrix: np.ndarray = None

        self.load_index()

    def load_index(self):
        """Loads index from local persistence file if exists."""
        if os.path.exists(self.index_file):
            try:
                with open(self.index_file, "rb") as f:
                    data = pickle.load(f)
                    self.chunks = data.get("chunks", [])
                    self.doc_mtimes = data.get("doc_mtimes", {})
                    self.vectorizer = data.get("vectorizer", None)
                    self.embedding_matrix = data.get("embedding_matrix", None)
            except Exception as e:
                print(f"[VectorStore] Error loading index for {self.college_name}: {e}")

    def save_index(self):
        """Persists vector store index to file."""
        data = {
            "chunks": self.chunks,
            "doc_mtimes": self.doc_mtimes,
            "vectorizer": self.vectorizer,
            "embedding_matrix": self.embedding_matrix
        }
        with open(self.index_file, "wb") as f:
            pickle.dump(data, f)

    def is_doc_indexed(self, doc_name: str, mtime: float) -> bool:
        """Checks if document is already indexed and unchanged."""
        return self.doc_mtimes.get(doc_name) == mtime

    def update_index(self, new_chunks: List[Dict[str, Any]], doc_mtimes: Dict[str, float], embedder):
        """Updates vector store index with new/modified chunks."""
        self.chunks = new_chunks
        self.doc_mtimes = doc_mtimes
        self.vectorizer = embedder.vectorizer

        texts = [chunk["text"] for chunk in new_chunks]
        if texts:
            self.embedding_matrix = embedder.fit_transform(texts)
        else:
            self.embedding_matrix = np.zeros((0, 5000))

        self.save_index()

    def similarity_search(self, query_vector, top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
        """Performs cosine similarity search against indexed vector embeddings."""
        if self.embedding_matrix is None or len(self.chunks) == 0:
            return []

        try:
            from scipy import sparse
            if sparse.issparse(self.embedding_matrix):
                if sparse.issparse(query_vector):
                    scores = self.embedding_matrix.dot(query_vector.T).toarray().flatten()
                else:
                    scores = self.embedding_matrix.dot(query_vector.T).flatten()
            else:
                scores = np.dot(self.embedding_matrix, query_vector.T).flatten()
        except Exception:
            return []

        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            score = float(scores[idx])
            if score > 0.01:
                results.append((self.chunks[idx], score))

        return results
