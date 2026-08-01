"""
Chunking Engine for HTE RAG Intelligence Module.
Chunks structured document blocks into ~500 token windows with 100 token overlap.
Preserves metadata: document_name, page_number, section_heading, chunk_id.
"""

from typing import List, Dict, Any

class DocumentChunker:
    def __init__(self, chunk_size: int = 500, overlap: int = 100):
        # Approximate 1 token = 4 characters
        self.chunk_char_size = chunk_size * 4
        self.overlap_char_size = overlap * 4

    def chunk_blocks(self, blocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Chunks structural blocks while preserving all required metadata."""
        all_chunks = []
        chunk_counter = 1

        for block in blocks:
            text = block["content"]
            doc_name = block["document_name"]
            page_num = block["page_number"]
            heading = block["section_heading"]

            if len(text) <= self.chunk_char_size:
                all_chunks.append({
                    "chunk_id": f"{doc_name}_p{page_num}_{chunk_counter}",
                    "document_name": doc_name,
                    "page_number": page_num,
                    "section_heading": heading,
                    "text": text
                })
                chunk_counter += 1
            else:
                # Sliding window chunking with overlap
                start = 0
                while start < len(text):
                    end = start + self.chunk_char_size
                    chunk_text = text[start:end].strip()

                    if chunk_text:
                        all_chunks.append({
                            "chunk_id": f"{doc_name}_p{page_num}_{chunk_counter}",
                            "document_name": doc_name,
                            "page_number": page_num,
                            "section_heading": heading,
                            "text": chunk_text
                        })
                        chunk_counter += 1

                    start += (self.chunk_char_size - self.overlap_char_size)

        return all_chunks
