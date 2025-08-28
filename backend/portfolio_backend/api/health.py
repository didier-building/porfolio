"""
Health Check Views for Production Monitoring
"""

import logging
from django.http import JsonResponse
from django.views import View
from django.db import connection
from django.core.cache import cache
from django.conf import settings
import time

logger = logging.getLogger(__name__)


class HealthCheckView(View):
    """Basic health check endpoint"""
    
    def get(self, request):
        """Return basic health status"""
        return JsonResponse({
            'status': 'healthy',
            'timestamp': time.time(),
            'version': '1.0.0'
        })


class DetailedHealthCheckView(View):
    """Detailed health check with database and cache status"""
    
    def get(self, request):
        """Return detailed health status"""
        health_data = {
            'status': 'healthy',
            'timestamp': time.time(),
            'version': '1.0.0',
            'checks': {}
        }
        
        # Database check
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                health_data['checks']['database'] = 'healthy'
        except Exception as e:
            health_data['checks']['database'] = f'unhealthy: {str(e)}'
            health_data['status'] = 'unhealthy'
        
        # Cache check
        try:
            cache.set('health_check', 'test', 30)
            cache.get('health_check')
            health_data['checks']['cache'] = 'healthy'
        except Exception as e:
            health_data['checks']['cache'] = f'unhealthy: {str(e)}'
        
        # AI Service check
        try:
            from .gemini_service import gemini_service
            if gemini_service.is_available():
                health_data['checks']['ai_service'] = 'healthy'
            else:
                health_data['checks']['ai_service'] = 'unavailable'
        except Exception as e:
            health_data['checks']['ai_service'] = f'error: {str(e)}'
        
        # Environment check
        health_data['checks']['environment'] = settings.ENVIRONMENT if hasattr(settings, 'ENVIRONMENT') else 'unknown'
        health_data['checks']['debug'] = settings.DEBUG
        
        return JsonResponse(health_data)


class ReadinessCheckView(View):
    """Readiness check for Kubernetes/container orchestration"""
    
    def get(self, request):
        """Check if application is ready to serve traffic"""
        try:
            # Check database connectivity
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            
            return JsonResponse({
                'status': 'ready',
                'timestamp': time.time()
            })
        except Exception as e:
            return JsonResponse({
                'status': 'not_ready',
                'error': str(e),
                'timestamp': time.time()
            }, status=503)


class LivenessCheckView(View):
    """Liveness check for Kubernetes/container orchestration"""
    
    def get(self, request):
        """Check if application is alive"""
        return JsonResponse({
            'status': 'alive',
            'timestamp': time.time()
        })
