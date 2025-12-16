"""
AI Secretary API views for portfolio chat
"""

import logging
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .ai_secretary import ai_secretary_service
from .gemini_service import gemini_service

logger = logging.getLogger(__name__)

class AISecretaryChatView(APIView):
    """Simple AI Secretary chat endpoint"""
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(ratelimit(key="ip", rate="30/m", method="POST", block=True))
    def post(self, request):
        """Handle AI Secretary chat messages"""
        try:
            data = request.data
            message = data.get('message', '').strip()
            session_id = data.get('session_id', f"session_{datetime.now().timestamp()}")
            
            # Validate input
            if not message:
                return Response({
                    'error': 'Message is required.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(message) > 1000:
                return Response({
                    'error': 'Message is too long. Please keep it under 1000 characters.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get client IP
            ip_address = request.META.get('HTTP_X_FORWARDED_FOR', 
                                        request.META.get('REMOTE_ADDR', 'unknown'))
            
            # Log visitor inquiry
            ai_secretary_service.log_visitor_inquiry(message, session_id, ip_address)
            
            # Store user message
            ai_secretary_service.store_conversation(session_id, {
                'role': 'user',
                'content': message,
                'ip_address': ip_address
            })
            
            # Get portfolio context
            portfolio_context = ai_secretary_service.get_portfolio_context()
            
            # Generate AI response
            if gemini_service.is_available():
                ai_response = gemini_service.generate_response(message, portfolio_context)
                if not ai_response:
                    ai_response = self._get_fallback_response(message)
            else:
                ai_response = self._get_fallback_response(message)
            
            # Store assistant response
            ai_secretary_service.store_conversation(session_id, {
                'role': 'assistant',
                'content': ai_response
            })
            
            response_data = {
                'reply': ai_response,
                'session_id': session_id,
                'timestamp': datetime.now().isoformat(),
                'ai_powered': gemini_service.is_available()
            }
            
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"AI Secretary chat error: {e}")
            return Response({
                'error': 'An internal error occurred. Please contact Didier directly at didier53053@gmail.com.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_fallback_response(self, message: str) -> str:
        """Generate fallback response when AI is not available"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['hello', 'hi', 'hey']):
            return "Hello! I'm Didier's AI secretary. I can help you learn about his backend development experience, testing expertise, and projects. What would you like to know?"
        
        elif any(word in message_lower for word in ['projects', 'work', 'portfolio']):
            return "Didier has worked on several projects including Order & Inventory Management System, Career Compass Platform, and Blockchain Agricultural Supply Chain. He specializes in Python/Django backend development with rigorous testing using PyTest and Unittest. Which type of project interests you?"
        
        elif any(word in message_lower for word in ['skills', 'technologies', 'tech']):
            return "Didier's core skills include Python/Django (90%+), PyTest/Unittest (90%+), PostgreSQL, Docker/Kubernetes, CI/CD Pipelines, and Technical Documentation. He's particularly strong in backend development and comprehensive testing strategies. What specific technology are you interested in?"
        
        elif any(word in message_lower for word in ['contact', 'hire', 'available', 'work with']):
            return "Didier is available for backend development and technical support work! He specializes in scalable APIs, comprehensive testing, and technical documentation. You can reach him directly at didier53053@gmail.com to discuss your project requirements."
        
        else:
            return f"I'd be happy to help you learn more about Didier's work! You asked about '{message}' - I can tell you about his projects, technical skills, experience, or how to contact him for work opportunities. What would you like to know?"


class AISecretaryAnalyticsView(APIView):
    """Analytics endpoint for AI Secretary conversations"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Get AI Secretary analytics"""
        try:
            analytics = ai_secretary_service.get_conversation_analytics()
            cleaned_count = ai_secretary_service.cleanup_old_conversations(hours=48)
            
            return Response({
                'analytics': analytics,
                'cleaned_conversations': cleaned_count,
                'ai_available': gemini_service.is_available(),
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"AI Secretary analytics error: {e}")
            return Response({
                'error': 'Failed to retrieve analytics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)