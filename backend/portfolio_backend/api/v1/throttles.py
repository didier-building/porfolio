"""
Custom throttling for recruiter microsite
"""

from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse


class FitAnalysisThrottle(AnonRateThrottle):
    """10 requests per hour for job fit analysis"""
    scope = 'fit'
    rate = '10/hour'
    
    def throttle_failure(self):
        """Custom throttle failure response"""
        return True


class ChatThrottle(AnonRateThrottle):
    """20 requests per hour for portfolio chat"""
    scope = 'chat'
    rate = '20/hour'


class AdminThrottle(UserRateThrottle):
    """100 requests per hour for admin users"""
    scope = 'admin'
    rate = '100/hour'


def get_throttle_response():
    """Standard throttle response with book call CTA"""
    return JsonResponse({
        'error': 'Rate limit exceeded',
        'message': 'You\'ve reached the hourly limit for this feature.',
        'retry_after': 3600,
        'cta': {
            'text': 'Book a call instead',
            'url': 'https://calendly.com/your-calendar',
            'action': 'BOOK_CALL'
        }
    }, status=429)
