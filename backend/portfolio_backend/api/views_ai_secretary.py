"""
AI Secretary API views for backend integration
"""

import logging
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .ai_secretary import ai_secretary_service

logger = logging.getLogger(__name__)

class AISecretaryChatView(APIView):
    """Backend AI Secretary chat endpoint with conversation history"""
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(ratelimit(key="ip", rate="30/m", method="POST", block=True))
    def post(self, request):
        """Handle AI Secretary chat messages"""
        try:
            data = request.data
            message = data.get('message', '').strip()
            session_id = data.get('session_id', f"session_{datetime.now().timestamp()}")
            conversation_history = data.get('conversation_history', [])
            
            # Validate input
            if not message:
                return Response({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': 'Message is required.'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(message) > 1000:
                return Response({
                    'error': {
                        'code': 'MESSAGE_TOO_LONG',
                        'message': 'Message is too long. Please keep it under 1000 characters.'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get client IP
            ip_address = request.META.get('HTTP_X_FORWARDED_FOR', 
                                        request.META.get('REMOTE_ADDR', 'unknown'))
            
            # Log visitor inquiry for analytics
            ai_secretary_service.log_visitor_inquiry(message, session_id, ip_address)
            
            # Store user message
            ai_secretary_service.store_conversation(session_id, {
                'role': 'user',
                'content': message,
                'ip_address': ip_address
            })
            
            # Get portfolio context from database
            portfolio_context = ai_secretary_service.get_portfolio_context()
            
            # Get recent conversation history
            recent_history = ai_secretary_service.get_conversation_history(session_id, limit=10)
            
            # Build conversation context
            conversation_context = ''
            if recent_history:
                conversation_context = '\n\n=== RECENT CONVERSATION ===\n' + \
                    '\n'.join([
                        f"{'Visitor' if msg['role'] == 'user' else 'Secretary'}: {msg['content']}"
                        for msg in recent_history[-6:]  # Last 6 messages
                    ])
            
            # For now, return a structured response that the frontend can use
            # In production, this would integrate with Gemini API
            response_data = {
                'reply': self._generate_response(message, portfolio_context, conversation_context),
                'session_id': session_id,
                'timestamp': datetime.now().isoformat(),
                'conversation_length': len(recent_history) + 1,
                'source': 'backend'
            }
            
            # Store assistant response
            ai_secretary_service.store_conversation(session_id, {
                'role': 'assistant',
                'content': response_data['reply']
            })
            
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"AI Secretary chat error: {e}")
            return Response({
                'error': {
                    'code': 'INTERNAL_ERROR',
                    'message': 'An internal error occurred. Please contact Didier directly at didier53053@gmail.com.'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _generate_response(self, message: str, portfolio_context: str, conversation_context: str) -> str:
        """Generate response based on message content (placeholder for AI integration)"""
        message_lower = message.lower()
        
        # Simple keyword-based responses for demonstration
        if any(word in message_lower for word in ['hello', 'hi', 'hey']):
            return "Hello! I'm Didier's AI secretary. I can help you learn about his experience, projects, skills, and services. What would you like to know?"
        
        elif any(word in message_lower for word in ['projects', 'work', 'portfolio']):
            return "Didier has worked on several impressive projects including an Order & Inventory Backend with Django/DRF, an Ops & Customer Support Dashboard with React/TypeScript, and a Blockchain Agricultural Supply Chain system. He's also built an AI-Enhanced Portfolio Platform and various DevEx templates. Which type of project interests you most?"
        
        elif any(word in message_lower for word in ['skills', 'technologies', 'tech']):
            return "Didier's core skills include Python (95%), Django/DRF (90%), React/TypeScript (85-90%), PostgreSQL (85%), and Docker (85%). He also has experience with blockchain technologies, cloud platforms like AWS, and DevOps practices. He's particularly strong in backend development and full-stack solutions. What specific technology are you interested in?"
        
        elif any(word in message_lower for word in ['experience', 'background']):
            return "Didier is a Backend/Full-Stack Engineer with experience in building scalable APIs, dashboard applications, and blockchain solutions. He's worked on order management systems, customer support tools, and has led teams in hackathons. He's also completed his BSc in Computer & Software Engineering. Would you like to know more about any specific area?"
        
        elif any(word in message_lower for word in ['contact', 'hire', 'available', 'work with']):
            return "Didier is available for freelance and contract work! He specializes in backend development, full-stack applications, and blockchain solutions. You can reach him directly at didier53053@gmail.com to discuss your project requirements and availability."
        
        elif any(word in message_lower for word in ['blockchain', 'web3']):
            return "Didier has hands-on blockchain experience, including a capstone project on Agricultural Supply Chain using Django REST and Vyper smart contracts. He's worked with ownership tracking, status updates, and comprehensive testing for blockchain applications. He's also familiar with Web3 technologies and decentralized applications."
        
        else:
            return f"I'd be happy to help you learn more about Didier's work! You asked about '{message}' - could you be more specific? I can tell you about his projects, technical skills, experience, or how to contact him for work opportunities."


class AISecretaryAnalyticsView(APIView):
    """Analytics endpoint for AI Secretary conversations"""
    permission_classes = [permissions.AllowAny]  # In production, restrict this
    
    def get(self, request):
        """Get AI Secretary analytics"""
        try:
            analytics = ai_secretary_service.get_conversation_analytics()
            
            # Clean up old conversations
            cleaned_count = ai_secretary_service.cleanup_old_conversations(hours=48)
            
            return Response({
                'analytics': analytics,
                'cleaned_conversations': cleaned_count,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"AI Secretary analytics error: {e}")
            return Response({
                'error': 'Failed to retrieve analytics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)