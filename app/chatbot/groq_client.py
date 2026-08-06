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
                "You are the Senior Technical & Decision Intelligence AI Advisor for the Government of Maharashtra HTE Department.\n"
                "You MUST answer strictly based on the provided grounded dataset facts and official document contents. Never hallucinate or invent data.\n"
                "CRITICAL INSTRUCTIONS:\n"
                "1. If official document text, salary packages, or branch statistics are present in Grounded Dataset Facts, YOU MUST EXTRACT AND DISPLAY THE FULL DETAILS.\n"
                "2. When asked for Highest Package, extract the exact Highest CTC Salary (e.g., 36.00 LPA by Google/Amazon/Nutanix for Walchand WCE). Do NOT confuse Highest CTC with Average CTC.\n"
                "3. When asked for Recruiting Companies, list all top companies (Google, Microsoft, Nutanix, Texas Instruments, Siemens, Tata Motors, L&T, etc.) along with salary tiers.\n"
                "4. When asked for college overview, placements, or branch performance, display the full branch-wise table with registered, placed, placement percentage, average salary, and maximum salary.\n"
                "5. Use structured markdown formatting with bold headers, tables, bullet points, and actionable recommendations.\n"
                "6. If no facts exist for the target college, state clearly that the information is not available."
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
                "max_tokens": 3072
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
            with urllib.request.urlopen(req, timeout=12) as response:
                if response.status == 200:
                    res_body = json.loads(response.read().decode('utf-8'))
                    return res_body['choices'][0]['message']['content']
        except Exception as e:
            logger.warning("Groq API call error: %s", e)
        return None
