"""
AI Secretary service for portfolio backend
Handles conversation history, analytics, and advanced AI features
"""

import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from django.conf import settings
from django.utils import timezone
from .models import Contact

logger = logging.getLogger(__name__)

class AISecretaryService:
    """Service for managing AI secretary conversations and analytics"""
    
    def __init__(self):
        self.conversation_store = {}  # In-memory store for development
        
    def get_portfolio_context(self) -> str:
        """Get comprehensive portfolio context from database"""
        from .models import Project, Skill, Experience, Education, SocialProfile
        
        try:
            # Get data from database
            projects = Project.objects.prefetch_related('technologies').all()[:10]
            skills = Skill.objects.all()[:20]
            experiences = Experience.objects.all()[:5]
            educations = Education.objects.all()[:3]
            profiles = SocialProfile.objects.all()
            
            # Build context
            context = """You are Didier Imanirahari's professional AI secretary. You represent him professionally and help visitors learn about his work, skills, and availability.

=== PERSONAL INFORMATION ===
Name: Didier Imanirahari
Role: Backend/Full-Stack Engineer
Summary: Building Intelligent Software & Web3 Solutions
Location: Kigali/Remote
Email: didier53053@gmail.com
GitHub: https://github.com/didier-building
LinkedIn: https://linkedin.com/in/didier-imanirahari

=== SOCIAL PROFILES ==="""
            
            for profile in profiles:
                context += f"\n{profile.platform}: {profile.url}"
            
            context += "\n\n=== TECHNICAL SKILLS ==="
            skills_by_category = {}
            for skill in skills:
                if skill.category not in skills_by_category:
                    skills_by_category[skill.category] = []
                skills_by_category[skill.category].append(f"{skill.name} ({skill.proficiency}% proficiency)")
            
            for category, skill_list in skills_by_category.items():
                context += f"\n\n{category}:"
                for skill in skill_list:
                    context += f"\n  • {skill}"
            
            context += "\n\n=== PROFESSIONAL EXPERIENCE ==="
            for exp in experiences:
                context += f"\n\n{exp.start_date} - {exp.end_date or 'Present'} - {exp.position}"
                context += f"\n{exp.company}"
                context += f"\n{exp.description}"
            
            context += "\n\n=== EDUCATION ==="
            for edu in educations:
                context += f"\n\n{edu.start_date} - {edu.end_date or 'Present'} - {edu.degree}"
                context += f"\n{edu.institution}"
                context += f"\n{edu.description}"
            
            context += "\n\n=== PORTFOLIO PROJECTS ==="
            for project in projects:
                context += f"\n\n{project.title}"
                context += f"\nDescription: {project.description}"
                context += f"\nTechnologies: {', '.join([tech.name for tech in project.technologies.all()])}"
                if project.github_url:
                    context += f"\nGitHub: {project.github_url}"
                if project.live_url:
                    context += f"\nLive Demo: {project.live_url}"
                context += f"\nPeriod: {project.start_date} - {project.end_date or 'Ongoing'}"
            
            context += """

=== INSTRUCTIONS ===
1. Be professional, helpful, and enthusiastic about Didier's work
2. Answer questions about his experience, skills, projects, and services
3. For work inquiries, direct them to contact him at didier53053@gmail.com
4. Stay focused on professional topics related to his portfolio
5. If asked about personal matters, politely redirect to professional topics
6. Be specific when discussing projects - mention technologies, features, and outcomes
7. Highlight relevant experience based on the visitor's interests
8. Suggest specific projects or skills that match their needs
9. Always maintain a professional, confident tone representing Didier
10. If you don't have specific information, be honest but offer to connect them directly

=== CONVERSATION STYLE ===
- Professional but approachable
- Confident in Didier's abilities
- Specific and detailed when discussing technical topics
- Helpful in matching visitor needs with Didier's expertise
- Proactive in suggesting relevant projects or skills"""
            
            return context
            
        except Exception as e:
            logger.error(f"Error building portfolio context: {e}")
            # Fallback to basic context
            return """You are Didier Imanirahari's professional AI secretary. 
            Contact him at didier53053@gmail.com for detailed information about his work."""
    
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
        
        # Keep only last 20 messages per conversation
        if len(self.conversation_store[session_id]['messages']) > 20:
            self.conversation_store[session_id]['messages'] = \
                self.conversation_store[session_id]['messages'][-20:]
    
    def get_conversation_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
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
        """Get analytics about conversations"""
        total_conversations = len(self.conversation_store)
        total_messages = sum(len(data['messages']) for data in self.conversation_store.values())
        
        # Active conversations (last 24 hours)
        cutoff_time = timezone.now() - timedelta(hours=24)
        active_conversations = sum(
            1 for data in self.conversation_store.values() 
            if data['last_activity'] > cutoff_time
        )
        
        return {
            'total_conversations': total_conversations,
            'total_messages': total_messages,
            'active_conversations_24h': active_conversations,
            'average_messages_per_conversation': total_messages / max(total_conversations, 1)
        }
    
    def log_visitor_inquiry(self, message: str, session_id: str, ip_address: str = None) -> None:
        """Log visitor inquiry for analytics"""
        try:
            # Extract potential contact intent
            contact_keywords = ['hire', 'work', 'project', 'contact', 'available', 'freelance', 'job']
            has_contact_intent = any(keyword in message.lower() for keyword in contact_keywords)
            
            # Log to database or analytics service
            logger.info(f"AI Secretary inquiry - Session: {session_id}, Contact Intent: {has_contact_intent}, Message: {message[:100]}")
            
        except Exception as e:
            logger.error(f"Error logging visitor inquiry: {e}")

# Global service instance
ai_secretary_service = AISecretaryService()