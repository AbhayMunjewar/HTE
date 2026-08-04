"""
Document Loader for HTE RAG Intelligence Module.
Dynamically scans and loads PDF, TXT, and DOCX files inside backend/documents/{COLLEGE_NAME}/.
Auto-detects documents without manual registration or hardcoding.
"""

import os
import glob
from typing import List, Dict, Any

class DocumentLoader:
    def __init__(self, base_docs_dir: str = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if base_docs_dir is None:
            self.search_dirs = [
                os.path.join(base_dir, "college_data"),
                os.path.join(base_dir, "documents")
            ]
            self.base_docs_dir = self.search_dirs[0]
        else:
            self.search_dirs = [base_docs_dir]
            self.base_docs_dir = base_docs_dir

    def discover_all_colleges(self) -> List[str]:
        """Dynamically discovers all college folders present in college_data/ and documents/."""
        colleges = set()
        for s_dir in self.search_dirs:
            if os.path.exists(s_dir):
                for entry in os.listdir(s_dir):
                    full_p = os.path.join(s_dir, entry)
                    if os.path.isdir(full_p) and not entry.startswith('.'):
                        colleges.add(entry)
        return sorted(list(colleges))

    def list_college_documents(self, college_folder: str) -> List[str]:
        """Returns list of all document file paths for a given college folder across all document directories."""
        doc_paths = []
        supported_exts = ['*.txt', '*.pdf', '*.docx', '*.md']

        for s_dir in self.search_dirs:
            # Check exact match, lowercase match, or uppercase match
            candidates = [
                os.path.join(s_dir, college_folder),
                os.path.join(s_dir, college_folder.upper()),
                os.path.join(s_dir, college_folder.lower())
            ]
            for college_dir in candidates:
                if os.path.exists(college_dir):
                    for ext in supported_exts:
                        doc_paths.extend(glob.glob(os.path.join(college_dir, ext)))
                        doc_paths.extend(glob.glob(os.path.join(college_dir, "**", ext), recursive=True))

        return list(set(doc_paths))

    def load_document(self, file_path: str) -> Dict[str, Any]:
        """Loads raw content and basic metadata from a single file."""
        file_name = os.path.basename(file_path)
        ext = os.path.splitext(file_name)[1].lower()
        
        content = ""
        page_contents = []

        if ext in ['.txt', '.md']:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            # Split by markdown headers or page breaks if available
            pages = content.split('\n\n--- ')
            if len(pages) > 1:
                for idx, p in enumerate(pages, 1):
                    page_contents.append({"page_number": idx, "text": p.strip()})
            else:
                page_contents.append({"page_number": 1, "text": content.strip()})

        elif ext == '.pdf':
            try:
                import pypdf
                reader = pypdf.PdfReader(file_path)
                for idx, page in enumerate(reader.pages, 1):
                    text = page.extract_text() or ""
                    page_contents.append({"page_number": idx, "text": text.strip()})
                    content += text + "\n"
            except Exception as e:
                # Fallback text reading
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                page_contents.append({"page_number": 1, "text": content})

        elif ext == '.docx':
            try:
                import docx
                doc = docx.Document(file_path)
                full_text = [p.text for p in doc.paragraphs if p.text.strip()]
                content = "\n".join(full_text)
                page_contents.append({"page_number": 1, "text": content})
            except Exception as e:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                page_contents.append({"page_number": 1, "text": content})

        return {
            "file_path": file_path,
            "document_name": file_name,
            "extension": ext,
            "full_content": content,
            "page_contents": page_contents,
            "mtime": os.path.getmtime(file_path)
        }
