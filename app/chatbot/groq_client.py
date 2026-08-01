"""
HTE Decision Intelligence Platform — Chatbot: Groq LLM Client
================================================================
Handles API calls to Groq (Llama-3.3-70B) for zero-hallucination grounded responses.
"""

import json
import logging
import urllib.request
from typing import Optional
from app.config import GROQ_API_KEY

logger = logging.getLogger("HTE_Groq_Client")

class GroqClient:
    @staticmethod
    def generate_response(user_query: str, grounded_facts: str, response_hint: str = "") -> Optional[str]:
        if not GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not configured.")
            return None

        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            system_prompt = (
                "You are the Government of Maharashtra Higher & Technical Education Decision Intelligence Assistant. "
                "You MUST answer strictly based on the provided grounded dataset facts. Never hallucinate or invent data.\n"
                "CRITICAL RULES for your response format:\n"
                "1. Your response format MUST match what the user asked. Do NOT use a fixed template.\n"
                "2. If the user asks a specific question (e.g. 'How many students?'), answer it directly with the number and brief context. Do NOT generate an executive report.\n"
                "3. If the user asks for a list or ranking, return a clean ranked list or table. Do NOT add executive summaries.\n"
                "4. If the user asks for a comparison, return a side-by-side comparison. Do NOT generate a single-college summary.\n"
                "5. Only include 'Recommendations' or 'Insights' if the user explicitly asks for them or if the query is analytical in nature.\n"
                "6. Only include 'Executive Summary' if the user asks 'tell me about', 'overview', or 'summary'.\n"
                "7. Use markdown formatting, tables, and bullet points as appropriate.\n"
                "8. Keep responses concise and focused on what was asked."
            )
            if response_hint:
                system_prompt += f"\nResponse format guidance: {response_hint}"

            user_prompt = f"Grounded Dataset Facts:\n{grounded_facts}\n\nUser Question: {user_query}"
            
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2,
                "max_tokens": 1024
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
            with urllib.request.urlopen(req, timeout=12) as response:
                if response.status == 200:
                    res_body = json.loads(response.read().decode('utf-8'))
                    return res_body['choices'][0]['message']['content']
        except Exception as e:
            logger.warning("Groq API call error: %s", e)
        return None
