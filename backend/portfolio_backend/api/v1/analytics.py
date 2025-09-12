"""
Analytics tracking for recruiter microsite
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.core.cache import cache
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class AnalyticsEvent:
    """Analytics event types"""
    JD_PASTED = 'JD_PASTED'
    MATCH_GENERATED = 'MATCH_GENERATED'
    CONTACT_CLICKED = 'CONTACT_CLICKED'
    RESUME_DOWNLOADED = 'RESUME_DOWNLOADED'
    CASE_STUDY_VIEWED = 'CASE_STUDY_VIEWED'
    DEMO_PLAYED = 'DEMO_PLAYED'
    CHAT_STARTED = 'CHAT_STARTED'
    BOOK_CALL_CLICKED = 'BOOK_CALL_CLICKED'


def track_event(event_type: str, metadata: Dict[str, Any] = None, request=None) -> None:
    """Track analytics event"""
    try:
        event_data = {
            'event': event_type,
            'timestamp': timezone.now().isoformat(),
            'metadata': metadata or {}
        }
        
        if request:
            # Add request metadata
            event_data['metadata'].update({
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'ip_hash': _hash_ip(request.META.get('REMOTE_ADDR', '')),
                'referer': request.META.get('HTTP_REFERER', ''),
            })
        
        # Log the event
        logger.info(f"Analytics: {event_type}", extra={'event_data': event_data})
        
        # Store in cache for real-time dashboard (optional)
        cache_key = f"analytics_event:{timezone.now().strftime('%Y%m%d%H')}"
        events = cache.get(cache_key, [])
        events.append(event_data)
        cache.set(cache_key, events, timeout=3600)  # 1 hour
        
    except Exception as e:
        logger.error(f"Failed to track analytics event: {e}")


def _hash_ip(ip_address: str) -> str:
    """Hash IP address for privacy"""
    import hashlib
    return hashlib.sha256(ip_address.encode()).hexdigest()[:8]


class AnalyticsView(APIView):
    """Analytics endpoint for frontend events"""
    
    def post(self, request):
        """Track analytics event from frontend"""
        try:
            event_type = request.data.get('event')
            metadata = request.data.get('metadata', {})
            
            if not event_type:
                return Response({
                    'error': 'Event type is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate event type
            valid_events = [
                AnalyticsEvent.JD_PASTED,
                AnalyticsEvent.MATCH_GENERATED,
                AnalyticsEvent.CONTACT_CLICKED,
                AnalyticsEvent.RESUME_DOWNLOADED,
                AnalyticsEvent.CASE_STUDY_VIEWED,
                AnalyticsEvent.DEMO_PLAYED,
                AnalyticsEvent.CHAT_STARTED,
                AnalyticsEvent.BOOK_CALL_CLICKED,
            ]
            
            if event_type not in valid_events:
                return Response({
                    'error': f'Invalid event type. Valid types: {valid_events}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Track the event
            track_event(event_type, metadata, request)
            
            return Response({'success': True})
            
        except Exception as e:
            logger.error(f"Analytics tracking failed: {e}")
            return Response({
                'error': 'Failed to track event'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_analytics_summary() -> Dict[str, Any]:
    """Get analytics summary for admin dashboard"""
    try:
        # Get events from the last 24 hours
        from datetime import timedelta
        
        now = timezone.now()
        hours = []
        total_events = 0
        
        for i in range(24):
            hour = now - timedelta(hours=i)
            cache_key = f"analytics_event:{hour.strftime('%Y%m%d%H')}"
            events = cache.get(cache_key, [])
            hours.append({
                'hour': hour.strftime('%H:00'),
                'events': len(events)
            })
            total_events += len(events)
        
        return {
            'total_events_24h': total_events,
            'hourly_breakdown': hours[::-1],  # Reverse to show chronologically
            'last_updated': now.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get analytics summary: {e}")
        return {
            'error': 'Failed to retrieve analytics',
            'total_events_24h': 0,
            'hourly_breakdown': [],
            'last_updated': timezone.now().isoformat()
        }
