"""
Metadata Extractor for HTE RAG Intelligence Module.
Manages metadata schemas and extraction helpers for chunks.
"""

from typing import Dict, Any

class MetadataManager:
    @staticmethod
    def create_metadata(doc_name: str, page_number: int, section_heading: str, chunk_id: str) -> Dict[str, Any]:
        return {
            "document_name": doc_name,
            "page_number": page_number,
            "section_heading": section_heading,
            "chunk_id": chunk_id
        }
