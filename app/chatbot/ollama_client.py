"""
HTE Decision Intelligence Platform — Chatbot: Ollama LLM Client
=================================================================
Enterprise LLM Reasoning Engine connecting to local Ollama API (qwen2.5:7b).
Role: Pure reasoning & Markdown response synthesis from grounded facts.
Zero SQL generation. Zero hallucination.
"""

import os
import json
import logging
import urllib.request
from typing import Optional, List, Dict, Any

from app.chatbot.groq_client import GroqClient

logger = logging.getLogger("HTE_Ollama_Client")

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

class OllamaClient:
    @staticmethod
    def generate_response(
        user_query: str,
        grounded_facts: str,
        response_hint: str = "",
        system_override: Optional[str] = None
    ) -> Optional[str]:
        """
        Sends grounded context to Ollama (http://localhost:11434/api/chat).
        Falls back to Groq API if local Ollama service is unavailable.
        """
        system_prompt = system_override or (
            "You are the official Senior Technical & Decision Intelligence AI Advisor for the Government of Maharashtra Higher & Technical Education Department.\n\n"
            "SYSTEM EXECUTION PROTOCOL:\n"
            "1. FIRST: Understand the user question completely.\n"
            "2. SECOND: Analyze the provided PDF document chunks and SQLite database facts.\n"
            "3. THIRD: Strictly answer ONLY for the target college mentioned in the prompt. NEVER mention or substitute details from any other college.\n"
            "4. FOURTH: Present your response in clear, warm, executive, human-like markdown.\n"
            "5. FIFTH: If the provided facts do not contain the answer, state clearly: 'This information is not available in the current HTE knowledge base.'"
        )
        if response_hint:
            system_prompt += f"\nResponse format guidance: {response_hint}"

        user_prompt = f"Grounded Context & Facts:\n{grounded_facts}\n\nUser Question: {user_query}"

        # Attempt Ollama API call
        endpoint = f"{OLLAMA_BASE_URL.rstrip('/')}/api/chat"
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False,
            "options": {
                "temperature": 0.05,
                "top_p": 0.8
            }
        }

        try:
            req = urllib.request.Request(
                endpoint,
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                if resp.status == 200:
                    res_body = json.loads(resp.read().decode('utf-8'))
                    content = res_body.get('message', {}).get('content', '').strip()
                    if content:
                        logger.info("Successfully generated response using Ollama (%s)", OLLAMA_MODEL)
                        return content
        except Exception as e:
            logger.warning("Ollama API call error (%s): %s. Attempting Groq fallback...", endpoint, e)

        # Fallback to Groq API if configured
        groq_resp = GroqClient.generate_response(user_query, grounded_facts, response_hint)
        if groq_resp:
            logger.info("Successfully generated response using Groq fallback.")
            return groq_resp

        return None
