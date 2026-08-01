"""
Document Parser for HTE RAG Intelligence Module.
Extracts sections, headings, tables, and structural blocks from raw document text.
"""

import re
from typing import List, Dict, Any

class DocumentParser:
    def parse_document(self, doc_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parses loaded document data into structured sections with headings and page numbers."""
        structured_blocks = []
        doc_name = doc_data["document_name"]
        
        for page_info in doc_data["page_contents"]:
            page_num = page_info["page_number"]
            text = page_info["text"]
            
            # Split text by headings or structural dividers
            lines = text.split('\n')
            current_section = "General Information"
            current_lines = []

            for line in lines:
                line_str = line.strip()
                if not line_str:
                    continue

                # Detect Section Headings (Markdown ###, --- SECTION ---, UPPERCASE HEADINGS)
                if line_str.startswith('### ') or line_str.startswith('--- ') or re.match(r'^[0-9]+\.\s+[A-Z\s]{3,}', line_str):
                    if current_lines:
                        structured_blocks.append({
                            "document_name": doc_name,
                            "page_number": page_num,
                            "section_heading": current_section,
                            "content": "\n".join(current_lines).strip()
                        })
                        current_lines = []
                    current_section = line_str.replace('### ', '').replace('--- ', '').strip(' -=')
                else:
                    current_lines.append(line_str)

            if current_lines:
                structured_blocks.append({
                    "document_name": doc_name,
                    "page_number": page_num,
                    "section_heading": current_section,
                    "content": "\n".join(current_lines).strip()
                })

        return structured_blocks
