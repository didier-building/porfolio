"""
Simple Gemini AI service for portfolio chat
"""

import logging
from typing import Optional
from django.conf import settings

logger = logging.getLogger(__name__)

class GeminiService:
    """Simple Gemini AI service"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'GOOGLE_GEMINI_API_KEY', None)
        self.model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-1.5-flash')
        self.available = bool(self.api_key)
        
        if self.available:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(self.model_name)
                logger.info("Gemini AI service initialized successfully")
            except ImportError:
                logger.warning("google-generativeai not installed, AI features disabled")
                self.available = False
            except Exception as e:
                logger.error(f"Failed to initialize Gemini AI: {e}")
                self.available = False
        else:
            logger.warning("Gemini API key not configured, AI features disabled")
    
    def is_available(self) -> bool:
        """Check if Gemini AI is available"""
        return self.available
    
    def generate_response(self, prompt: str, context: str = "") -> Optional[str]:
        """Generate AI response using Gemini"""
        if not self.available:
            return None
        
        try:
            full_prompt = f"{context}\n\nUser: {prompt}\nAssistant:"
            response = self.model.generate_content(full_prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini AI generation error: {e}")
            return None

# Global service instance
gemini_service = GeminiService()