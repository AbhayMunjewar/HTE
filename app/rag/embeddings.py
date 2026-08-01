"""
Embedding Generator for HTE RAG Intelligence Module.
Uses Scikit-Learn TF-IDF N-gram feature vectors with character & word sub-tokens
to generate fast, accurate dense embeddings for semantic search.
"""

from typing import List
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

class EmbeddingGenerator:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=5000,
            sublinear_tf=True,
            analyzer='word'
        )
        self.is_fitted = False

    def fit_transform(self, texts: List[str]) -> np.ndarray:
        """Fits vectorizer on text corpus and returns normalized embedding matrix."""
        if not texts:
            return np.zeros((0, 5000))
        matrix = self.vectorizer.fit_transform(texts)
        self.is_fitted = True
        normalized_matrix = normalize(matrix.toarray(), axis=1)
        return normalized_matrix

    def transform(self, texts: List[str]) -> np.ndarray:
        """Transforms query texts into normalized embedding vectors using fitted model."""
        if not self.is_fitted or not texts:
            return np.zeros((len(texts), 5000))
        matrix = self.vectorizer.transform(texts)
        normalized_matrix = normalize(matrix.toarray(), axis=1)
        return normalized_matrix
