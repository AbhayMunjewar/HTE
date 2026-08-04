"""
Auto-Indexing Pipeline for HTE RAG Intelligence Module.
Detects files inside backend/documents/{COLLEGE_NAME}/, parses, chunks, embeds,
and updates isolated FAISS vector indices automatically.
Zero hardcoding. Zero manual registration.
"""

from typing import Dict, Any, List
from app.rag.document_loader import DocumentLoader
from app.rag.doc_parser import DocumentParser
from app.rag.chunking import DocumentChunker
from app.rag.embeddings import EmbeddingGenerator
from app.rag.vector_store import VectorStore

class DocumentIndexer:
    def __init__(self, base_docs_dir: str = None, base_index_dir: str = None):
        self.loader = DocumentLoader(base_docs_dir)
        self.parser = DocumentParser()
        # RAG Settings: Chunk Size 800 chars, Chunk Overlap 150 chars (~200 tokens / ~37 tokens)
        self.chunker = DocumentChunker(chunk_size=200, overlap=37)
        self.base_index_dir = base_index_dir

    def auto_index_all_colleges(self) -> List[str]:
        """Discovers and auto-indexes all college folders present in the system."""
        colleges = self.loader.discover_all_colleges()
        indexed = []
        for col in colleges:
            try:
                self.index_college(col)
                indexed.append(col)
            except Exception as e:
                print(f"[DocumentIndexer] Warning auto-indexing {col}: {e}")
        return indexed

    def index_college(self, college_name: str, force_reindex: bool = False) -> VectorStore:
        """Indexes or incrementally updates document vector store for a target college."""
        vector_store = VectorStore(college_name, self.base_index_dir)
        doc_paths = self.loader.list_college_documents(college_name)

        if not doc_paths:
            return vector_store

        # Check if incremental re-indexing is needed
        needs_reindex = force_reindex
        current_mtimes = {}

        for path in doc_paths:
            doc_name = self.loader.load_document(path)["document_name"]
            mtime = self.loader.load_document(path)["mtime"]
            current_mtimes[doc_name] = mtime

            if not vector_store.is_doc_indexed(doc_name, mtime):
                needs_reindex = True

        if not needs_reindex and len(vector_store.chunks) > 0:
            return vector_store

        # Perform parsing, chunking, and embedding
        all_chunks = []
        for path in doc_paths:
            doc_data = self.loader.load_document(path)
            blocks = self.parser.parse_document(doc_data)
            chunks = self.chunker.chunk_blocks(blocks)
            all_chunks.extend(chunks)

        embedder = EmbeddingGenerator()
        vector_store.update_index(all_chunks, current_mtimes, embedder)
        print(f"[DocumentIndexer] Successfully indexed {len(all_chunks)} chunks for {college_name}.")
        return vector_store
