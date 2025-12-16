"""
AI Secretary service for portfolio backend
Simple Gemini AI integration for portfolio chat
"""

import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

class AISecretaryService:
    """Simple AI secretary service using Gemini AI"""
    
    def __init__(self):
        self.conversation_store = {}
        
    def get_portfolio_context(self) -> str:
        """Get basic portfolio context"""
        return """You are Didier Imanirahari's professional AI secretary.
        
DIDIER'S PROFILE:
- Python Engineer | Backend & Testing Specialist
- Specializes in Python, Django/DRF, and rigorous code testing
- Building scalable backend solutions with comprehensive testing
- Location: Kigali, Rwanda
- Contact: didier53053@gmail.com
- GitHub: https://github.com/didier-building

KEY SKILLS:
- Python & Django/DRF (90%+)
- PyTest & Unittest (90%+)
- SQL & Database Design
- Docker & Kubernetes
- CI/CD Pipelines
- Technical Documentation

MAJOR PROJECTS:
- Order & Inventory Management System (Django/DRF, PostgreSQL, Celery)
- Career Compass Platform (Django/DRF, JWT)
- Blockchain Agricultural Supply Chain
- DevOps Templates & Workflows
- NLPAY Academy (GDG Hackathon - Team Lead)

INSTRUCTIONS:
1. Be professional and helpful
2. Answer questions about Didier's backend development and testing expertise
3. For work inquiries, direct them to didier53053@gmail.com
4. Stay focused on professional topics
5. Be specific about technologies and experience"""
    
    def store_conversation(self, session_id: str, message: Dict[str, Any]) -> None:
        """Store conversation message"""
        if session_id not in self.conversation_store:
            self.conversation_store[session_id] = {
                'messages': [],
                'started_at': timezone.now(),
                'last_activity': timezone.now()
            }
        
        self.conversation_store[session_id]['messages'].append({
            **message,
            'timestamp': timezone.now().isoformat()
        })
        self.conversation_store[session_id]['last_activity'] = timezone.now()
        
        # Keep only last 10 messages per conversation
        if len(self.conversation_store[session_id]['messages']) > 10:
            self.conversation_store[session_id]['messages'] = \
                self.conversation_store[session_id]['messages'][-10:]
    
    def get_conversation_history(self, session_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get conversation history for a session"""
        if session_id not in self.conversation_store:
            return []
        
        messages = self.conversation_store[session_id]['messages']
        return messages[-limit:] if messages else []
    
    def cleanup_old_conversations(self, hours: int = 24) -> int:
        """Clean up conversations older than specified hours"""
        cutoff_time = timezone.now() - timedelta(hours=hours)
        cleaned_count = 0
        
        sessions_to_remove = []
        for session_id, data in self.conversation_store.items():
            if data['last_activity'] < cutoff_time:
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del self.conversation_store[session_id]
            cleaned_count += 1
        
        return cleaned_count
    
    def get_conversation_analytics(self) -> Dict[str, Any]:
        """Get basic analytics about conversations"""
        total_conversations = len(self.conversation_store)
        total_messages = sum(len(data['messages']) for data in self.conversation_store.values())
        
        return {
            'total_conversations': total_conversations,
            'total_messages': total_messages,
            'average_messages_per_conversation': total_messages / max(total_conversations, 1)
        }
    
    def log_visitor_inquiry(self, message: str, session_id: str, ip_address: str = None) -> None:
        """Log visitor inquiry for analytics"""
        try:
            contact_keywords = ['hire', 'work', 'project', 'contact', 'available', 'freelance']
            has_contact_intent = any(keyword in message.lower() for keyword in contact_keywords)
            
            logger.info(f"AI Secretary inquiry - Session: {session_id}, Contact Intent: {has_contact_intent}")
            
        except Exception as e:
            logger.error(f"Error logging visitor inquiry: {e}")

# Global service instance
ai_secretary_service = AISecretaryService()