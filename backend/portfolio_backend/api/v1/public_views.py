"""
Public API views for recruiter microsite
Fast JD → Fit → Contact flow
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils import timezone
import logging

from .throttles import FitAnalysisThrottle, ChatThrottle
from .cache import (
    cache_fit_analysis, get_cached_fit_analysis, 
    redact_jd_for_logs
)
from .analytics import track_event, AnalyticsEvent
from ..gemini_service import gemini_service
from ..utils.pdf_generator import generate_cv_pdf
from ..utils.rag_chat import portfolio_rag_chat
from django.http import HttpResponse

logger = logging.getLogger(__name__)


class FitAnalysisView(APIView):
    """
    POST /api/v1/fit/analyze
    Analyze job description fit with portfolio
    """
    permission_classes = [AllowAny]
    throttle_classes = [FitAnalysisThrottle]
    
    def post(self, request):
        try:
            job_description = request.data.get('job_description', '').strip()
            
            if not job_description:
                return Response({
                    'error': 'Job description is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(job_description) < 50:
                return Response({
                    'error': 'Job description too short (minimum 50 characters)'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(job_description) > 10000:
                return Response({
                    'error': 'Job description too long (maximum 10,000 characters)'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Track analytics
            track_event(AnalyticsEvent.JD_PASTED, {
                'jd_length': len(job_description)
            }, request)
            
            # Check cache first
            cached_result = get_cached_fit_analysis(job_description)
            if cached_result:
                response = Response(cached_result)
                response['X-Cache'] = 'HIT'
                
                # Track cache hit
                track_event(AnalyticsEvent.MATCH_GENERATED, {
                    'cache_hit': True,
                    'score': cached_result.get('score', 0)
                }, request)
                
                return response
            
            # Generate new analysis
            analysis = self._analyze_fit(job_description)
            
            # Cache the result
            jd_hash = cache_fit_analysis(job_description, analysis)
            
            # Track analytics
            track_event(AnalyticsEvent.MATCH_GENERATED, {
                'cache_hit': False,
                'score': analysis.get('score', 0),
                'jd_hash': jd_hash[:8]
            }, request)
            
            # Log redacted JD
            logger.info(f"Fit analysis generated: {redact_jd_for_logs(job_description)}")
            
            response = Response(analysis)
            response['X-Cache'] = 'MISS'
            return response
            
        except Exception as e:
            logger.error(f"Fit analysis failed: {e}")
            return Response({
                'error': 'Analysis failed. Please try again.',
                'details': str(e) if request.user.is_staff else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _analyze_fit(self, job_description: str) -> dict:
        """Generate fit analysis using AI"""
        try:
            if not gemini_service.is_available():
                return self._get_fallback_analysis(job_description)
            
            # Build analysis prompt
            prompt = self._build_fit_analysis_prompt(job_description)
            response = gemini_service.model.generate_content(prompt)
            
            return self._parse_fit_analysis(response.text)
            
        except Exception as e:
            logger.warning(f"AI analysis failed, using fallback: {e}")
            return self._get_fallback_analysis(job_description)
    
    def _build_fit_analysis_prompt(self, job_description: str) -> str:
        """Build prompt for fit analysis"""
        return f"""
Analyze this job description against my professional profile and provide a recruiter-focused assessment:

JOB DESCRIPTION:
{job_description}

MY PROFILE:
- Full-Stack Developer with 3+ years experience
- Expert in: Python, Django, React, TypeScript, PostgreSQL, Redis
- AI/ML: Google Gemini integration, RAG systems, vector databases
- DevOps: Docker, CI/CD, cloud deployment
- Recent projects: AI-enhanced portfolio, microservices, real-time systems

Provide analysis in this exact format:

SCORE: [0-100 compatibility score]
SUMMARY: [Exactly 120 words explaining the fit and key strengths]
MATCHES: [Top 6 matching skills/experiences, comma-separated]
GAPS: [Missing requirements with mitigation strategies, format: "Gap: Mitigation"]
QUESTIONS: [3-5 specific interview questions based on the role]
AVAILABILITY: [Professional availability statement]

Be specific, professional, and focus on demonstrable skills.
"""
    
    def _parse_fit_analysis(self, response_text: str) -> dict:
        """Parse AI response into structured format"""
        try:
            lines = response_text.strip().split('\n')
            analysis = {
                'score': 0,
                'summary': '',
                'matches': [],
                'gaps': [],
                'questions': [],
                'availability': 'Available for immediate start',
                'generated_at': timezone.now().isoformat()
            }
            
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('SCORE:'):
                    try:
                        score_text = line.split(':', 1)[1].strip()
                        analysis['score'] = int(''.join(filter(str.isdigit, score_text)))
                    except (ValueError, IndexError):
                        analysis['score'] = 75  # Default
                
                elif line.startswith('SUMMARY:'):
                    analysis['summary'] = line.split(':', 1)[1].strip()
                
                elif line.startswith('MATCHES:'):
                    matches_text = line.split(':', 1)[1].strip()
                    analysis['matches'] = [m.strip() for m in matches_text.split(',') if m.strip()][:6]
                
                elif line.startswith('GAPS:'):
                    gaps_text = line.split(':', 1)[1].strip()
                    analysis['gaps'] = [g.strip() for g in gaps_text.split(',') if g.strip()]
                
                elif line.startswith('QUESTIONS:'):
                    questions_text = line.split(':', 1)[1].strip()
                    analysis['questions'] = [q.strip() for q in questions_text.split(',') if q.strip()]
                
                elif line.startswith('AVAILABILITY:'):
                    analysis['availability'] = line.split(':', 1)[1].strip()
            
            # Ensure summary is around 120 words
            if analysis['summary']:
                words = analysis['summary'].split()
                if len(words) > 130:
                    analysis['summary'] = ' '.join(words[:120]) + '...'
            
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to parse fit analysis: {e}")
            return self._get_fallback_analysis("")
    
    def _get_fallback_analysis(self, job_description: str) -> dict:
        """Fallback analysis when AI is unavailable"""
        return {
            'score': 85,
            'summary': 'Strong technical match with demonstrated expertise in modern web development, AI integration, and full-stack architecture. Proven experience with Python/Django backend development, React/TypeScript frontend, and production deployment. Recent AI portfolio project showcases ability to integrate cutting-edge technologies. Strong problem-solving skills and continuous learning mindset align well with role requirements. Experience with microservices, caching strategies, and performance optimization demonstrates scalability awareness.',
            'matches': [
                'Python & Django expertise',
                'React & TypeScript proficiency', 
                'AI/ML integration experience',
                'Full-stack development',
                'Production deployment',
                'Modern development practices'
            ],
            'gaps': [
                'Specific domain knowledge: Can be acquired through onboarding',
                'Team size experience: Adaptable to any team structure',
                'Industry-specific tools: Quick learner with strong technical foundation'
            ],
            'questions': [
                'Can you walk me through your AI integration approach in the portfolio project?',
                'How do you handle performance optimization in full-stack applications?',
                'Describe your experience with production deployment and monitoring',
                'What\'s your approach to learning new technologies quickly?'
            ],
            'availability': 'Available for immediate start with 2-week notice period',
            'generated_at': timezone.now().isoformat(),
            'fallback': True
        }


class TailoredCVView(APIView):
    """
    POST /api/v1/fit/cv
    Generate tailored CV PDF
    """
    permission_classes = [AllowAny]
    throttle_classes = [FitAnalysisThrottle]
    
    def post(self, request):
        try:
            job_description = request.data.get('job_description', '')
            email = request.data.get('email', '')
            consent = request.data.get('consent', False)

            # Email gate (optional)
            if email and not consent:
                return Response({
                    'error': 'Consent required for email collection'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Track analytics
            track_event(AnalyticsEvent.RESUME_DOWNLOADED, {
                'has_email': bool(email),
                'has_jd': bool(job_description)
            }, request)

            # Generate PDF
            pdf_buffer, metadata = generate_cv_pdf(job_description, email)

            # Return PDF as download
            response = HttpResponse(
                pdf_buffer.getvalue(),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = 'attachment; filename="CV_Tailored.pdf"'
            response['Content-Length'] = len(pdf_buffer.getvalue())

            # Log generation
            logger.info(f"CV PDF generated: {metadata['file_size_bytes']} bytes")

            return response

        except Exception as e:
            logger.error(f"CV generation failed: {e}")
            return Response({
                'error': 'CV generation failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PortfolioChatView(APIView):
    """
    POST /api/v1/chat
    Portfolio-only RAG chat
    """
    permission_classes = [AllowAny]
    throttle_classes = [ChatThrottle]
    
    def post(self, request):
        try:
            message = request.data.get('message', '').strip()
            
            if not message:
                return Response({
                    'error': 'Message is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(message) > 500:
                return Response({
                    'error': 'Message too long (maximum 500 characters)'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Track analytics
            track_event(AnalyticsEvent.CHAT_STARTED, {
                'message_length': len(message)
            }, request)
            
            # Generate portfolio-focused response using RAG
            response_data = portfolio_rag_chat.generate_response(message)

            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Portfolio chat failed: {e}")
            return Response({
                'error': 'Chat failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

