"""
Admin-only views for portfolio management
Moved from public API to admin-only access
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
import logging

from .throttles import AdminThrottle
from .analytics import get_analytics_summary, track_event
from ..views import (
    CareerInsightsView as BaseCareerInsightsView,
    SkillGapAnalysisView as BaseSkillGapAnalysisView,
    CVGeneratorView as BaseCVGeneratorView,
    JournalEntryListCreateView as BaseJournalEntryListCreateView,
    JournalInsightsView as BaseJournalInsightsView,
    JournalGoalSuggestionsView as BaseJournalGoalSuggestionsView,
    JournalPromptsView as BaseJournalPromptsView
)

logger = logging.getLogger(__name__)


class AdminCareerInsightsView(BaseCareerInsightsView):
    """Admin-only career insights"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]


class AdminSkillGapAnalysisView(BaseSkillGapAnalysisView):
    """Admin-only skill gap analysis"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]


class AdminCVGeneratorView(BaseCVGeneratorView):
    """Admin-only generic CV generator"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]


class AdminJournalEntryView(BaseJournalEntryListCreateView):
    """Admin-only journal entries"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]


class AdminJournalInsightsView(BaseJournalInsightsView):
    """Admin-only journal insights"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]


class AdminJournalGoalSuggestionsView(BaseJournalGoalSuggestionsView):
    """Admin-only journal goal suggestions"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]


class AdminJournalPromptsView(BaseJournalPromptsView):
    """Admin-only journal prompts"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]


class AdminAnalyticsView(APIView):
    """Admin analytics dashboard"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]
    
    def get(self, request):
        """Get analytics summary"""
        try:
            summary = get_analytics_summary()
            return Response(summary)
        except Exception as e:
            logger.error(f"Failed to get analytics: {e}")
            return Response({
                'error': 'Failed to retrieve analytics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminHealthView(APIView):
    """Detailed health check for admin"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]
    
    def get(self, request):
        """Detailed health check"""
        try:
            from django.db import connection
            from django.core.cache import cache
            from ..gemini_service import gemini_service
            
            health_data = {
                'status': 'healthy',
                'timestamp': timezone.now().isoformat(),
                'checks': {}
            }
            
            # Database check
            try:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 1")
                health_data['checks']['database'] = 'healthy'
            except Exception as e:
                health_data['checks']['database'] = f'error: {str(e)}'
                health_data['status'] = 'unhealthy'
            
            # Cache check
            try:
                cache.set('health_check', 'ok', 30)
                if cache.get('health_check') == 'ok':
                    health_data['checks']['cache'] = 'healthy'
                else:
                    health_data['checks']['cache'] = 'error'
            except Exception as e:
                health_data['checks']['cache'] = f'error: {str(e)}'
            
            # AI service check
            try:
                if gemini_service.is_available():
                    health_data['checks']['ai_service'] = 'healthy'
                else:
                    health_data['checks']['ai_service'] = 'unavailable'
            except Exception as e:
                health_data['checks']['ai_service'] = f'error: {str(e)}'
            
            # Analytics check
            try:
                analytics = get_analytics_summary()
                health_data['checks']['analytics'] = 'healthy'
                health_data['analytics'] = analytics
            except Exception as e:
                health_data['checks']['analytics'] = f'error: {str(e)}'
            
            return Response(health_data)
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return Response({
                'status': 'error',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminFileUploadView(APIView):
    """Admin-only file upload"""
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminThrottle]
    
    def post(self, request):
        """Handle file uploads for admin"""
        try:
            if 'file' not in request.FILES:
                return Response({
                    'error': 'No file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            uploaded_file = request.FILES['file']
            
            # Validate file size (max 10MB for admin)
            if uploaded_file.size > 10 * 1024 * 1024:
                return Response({
                    'error': 'File too large (max 10MB)'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # TODO: Implement actual file handling
            # For now, just return success
            
            track_event('ADMIN_FILE_UPLOADED', {
                'filename': uploaded_file.name,
                'size': uploaded_file.size,
                'content_type': uploaded_file.content_type
            }, request)
            
            return Response({
                'success': True,
                'filename': uploaded_file.name,
                'size': uploaded_file.size
            })
            
        except Exception as e:
            logger.error(f"Admin file upload failed: {e}")
            return Response({
                'error': 'File upload failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
