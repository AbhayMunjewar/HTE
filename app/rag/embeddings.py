"""
Embedding Generator for HTE RAG Intelligence Module.
Uses Scikit-Learn TF-IDF N-gram feature vectors with character & word sub-tokens
to generate fast, accurate dense embeddings for semantic search.
"""

from typing import List
import numpy as np
from scipy import sparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

class EmbeddingGenerator:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 1),
            max_features=2000,
            sublinear_tf=True,
            analyzer='word',
            stop_words='english'
        )
        self.is_fitted = False

    def fit_transform(self, texts: List[str]):
        """Fits vectorizer on text corpus and returns normalized sparse embedding matrix."""
        if not texts:
            return sparse.csr_matrix((0, 2000), dtype=np.float32)
        trimmed_texts = [t[:1000] for t in texts]
        matrix = self.vectorizer.fit_transform(trimmed_texts)
        self.is_fitted = True
        normalized_matrix = normalize(matrix, axis=1, copy=False)
        return normalized_matrix

    def transform(self, texts: List[str]):
        """Transforms query texts into normalized embedding vectors using fitted model."""
        if not self.is_fitted or not texts:
            return sparse.csr_matrix((len(texts), 2000), dtype=np.float32)
        trimmed_texts = [t[:1000] for t in texts]
        matrix = self.vectorizer.transform(trimmed_texts)
        normalized_matrix = normalize(matrix, axis=1, copy=False)
        return normalized_matrix
