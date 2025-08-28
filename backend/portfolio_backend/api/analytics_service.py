"""
Professional Analytics & Tracking Service
Comprehensive visitor analytics, engagement tracking, and performance metrics
"""

import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from django.utils import timezone
from django.db import models
from django.contrib.gis.geoip2 import GeoIP2
from django.contrib.gis.geoip2.base import GeoIP2Exception
import user_agents

logger = logging.getLogger(__name__)


class VisitorSession(models.Model):
    """Track visitor sessions and interactions"""
    session_id = models.CharField(max_length=100, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(max_length=50, blank=True)  # mobile, desktop, tablet
    browser = models.CharField(max_length=100, blank=True)
    operating_system = models.CharField(max_length=100, blank=True)
    referrer = models.URLField(blank=True)
    landing_page = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    total_time_spent = models.IntegerField(default=0)  # seconds
    page_views = models.IntegerField(default=0)
    is_recruiter = models.BooleanField(default=False)
    is_bot = models.BooleanField(default=False)

    class Meta:
        app_label = 'api'
        ordering = ['-created_at']


class PageView(models.Model):
    """Track individual page views and interactions"""
    session = models.ForeignKey(VisitorSession, on_delete=models.CASCADE, related_name='views')
    page_path = models.CharField(max_length=200)
    page_title = models.CharField(max_length=200, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    time_on_page = models.IntegerField(default=0)  # seconds
    scroll_depth = models.FloatField(default=0.0)  # percentage
    interactions = models.JSONField(default=dict)  # clicks, hovers, etc.

    class Meta:
        app_label = 'api'
        ordering = ['-timestamp']


class AIInteraction(models.Model):
    """Track AI feature usage and effectiveness"""
    session = models.ForeignKey(VisitorSession, on_delete=models.CASCADE, related_name='ai_interactions')
    feature_type = models.CharField(max_length=50)  # job-match, cv-generator, etc.
    input_data = models.JSONField(default=dict)
    output_data = models.JSONField(default=dict)
    success = models.BooleanField(default=True)
    response_time = models.FloatField(default=0.0)  # seconds
    user_rating = models.IntegerField(null=True, blank=True)  # 1-5 stars
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'api'
        ordering = ['-timestamp']


class ContactSubmission(models.Model):
    """Track contact form submissions and follow-ups"""
    session = models.ForeignKey(VisitorSession, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    submission_type = models.CharField(max_length=50, default='general')  # general, job_inquiry, etc.
    status = models.CharField(max_length=50, default='new')  # new, responded, closed
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'api'
        ordering = ['-timestamp']


class AnalyticsService:
    """Professional analytics and tracking service"""
    
    def __init__(self):
        self.geo_ip = self._init_geoip()
    
    def _init_geoip(self):
        """Initialize GeoIP2 service"""
        try:
            return GeoIP2()
        except Exception as e:
            logger.warning(f"GeoIP2 not available: {e}")
            return None
    
    def track_visitor(self, request, session_id: str = None) -> VisitorSession:
        """Track visitor session and extract analytics data"""
        try:
            # Get or create session
            if session_id:
                session, created = VisitorSession.objects.get_or_create(
                    session_id=session_id,
                    defaults=self._extract_session_data(request)
                )
            else:
                session = VisitorSession.objects.create(
                    session_id=self._generate_session_id(),
                    **self._extract_session_data(request)
                )
                created = True
            
            # Update last activity
            if not created:
                session.last_activity = timezone.now()
                session.save()
            
            return session
            
        except Exception as e:
            logger.error(f"Visitor tracking failed: {e}")
            return None
    
    def track_page_view(self, session: VisitorSession, page_path: str, 
                       page_title: str = '', time_on_page: int = 0,
                       scroll_depth: float = 0.0, interactions: Dict = None) -> PageView:
        """Track individual page view"""
        try:
            page_view = PageView.objects.create(
                session=session,
                page_path=page_path,
                page_title=page_title,
                time_on_page=time_on_page,
                scroll_depth=scroll_depth,
                interactions=interactions or {}
            )
            
            # Update session stats
            session.page_views += 1
            session.total_time_spent += time_on_page
            session.save()
            
            return page_view
            
        except Exception as e:
            logger.error(f"Page view tracking failed: {e}")
            return None
    
    def track_ai_interaction(self, session: VisitorSession, feature_type: str,
                           input_data: Dict, output_data: Dict, success: bool = True,
                           response_time: float = 0.0) -> AIInteraction:
        """Track AI feature usage"""
        try:
            return AIInteraction.objects.create(
                session=session,
                feature_type=feature_type,
                input_data=input_data,
                output_data=output_data,
                success=success,
                response_time=response_time
            )
            
        except Exception as e:
            logger.error(f"AI interaction tracking failed: {e}")
            return None
    
    def track_contact_submission(self, session: VisitorSession, contact_data: Dict) -> ContactSubmission:
        """Track contact form submissions"""
        try:
            return ContactSubmission.objects.create(
                session=session,
                name=contact_data.get('name', ''),
                email=contact_data.get('email', ''),
                company=contact_data.get('company', ''),
                message=contact_data.get('message', ''),
                submission_type=contact_data.get('type', 'general')
            )
            
        except Exception as e:
            logger.error(f"Contact submission tracking failed: {e}")
            return None
    
    def get_analytics_dashboard(self, days: int = 30) -> Dict[str, Any]:
        """Generate comprehensive analytics dashboard"""
        try:
            end_date = timezone.now()
            start_date = end_date - timedelta(days=days)
            
            # Basic metrics
            total_visitors = VisitorSession.objects.filter(
                created_at__gte=start_date
            ).count()
            
            total_page_views = PageView.objects.filter(
                timestamp__gte=start_date
            ).count()
            
            total_ai_interactions = AIInteraction.objects.filter(
                timestamp__gte=start_date
            ).count()
            
            # Visitor analytics
            visitor_analytics = self._get_visitor_analytics(start_date, end_date)
            
            # Page analytics
            page_analytics = self._get_page_analytics(start_date, end_date)
            
            # AI feature analytics
            ai_analytics = self._get_ai_analytics(start_date, end_date)
            
            # Geographic analytics
            geo_analytics = self._get_geographic_analytics(start_date, end_date)
            
            # Device analytics
            device_analytics = self._get_device_analytics(start_date, end_date)
            
            return {
                'period': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat(),
                    'days': days
                },
                'overview': {
                    'total_visitors': total_visitors,
                    'total_page_views': total_page_views,
                    'total_ai_interactions': total_ai_interactions,
                    'avg_session_duration': self._calculate_avg_session_duration(start_date, end_date),
                    'bounce_rate': self._calculate_bounce_rate(start_date, end_date)
                },
                'visitors': visitor_analytics,
                'pages': page_analytics,
                'ai_features': ai_analytics,
                'geography': geo_analytics,
                'devices': device_analytics,
                'generated_at': timezone.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Analytics dashboard generation failed: {e}")
            return self._get_fallback_analytics()
    
    def get_real_time_stats(self) -> Dict[str, Any]:
        """Get real-time visitor statistics"""
        try:
            now = timezone.now()
            last_hour = now - timedelta(hours=1)
            last_24h = now - timedelta(hours=24)
            
            return {
                'active_visitors': VisitorSession.objects.filter(
                    last_activity__gte=last_hour
                ).count(),
                'visitors_24h': VisitorSession.objects.filter(
                    created_at__gte=last_24h
                ).count(),
                'page_views_24h': PageView.objects.filter(
                    timestamp__gte=last_24h
                ).count(),
                'ai_interactions_24h': AIInteraction.objects.filter(
                    timestamp__gte=last_24h
                ).count(),
                'top_pages_24h': self._get_top_pages(last_24h),
                'recent_visitors': self._get_recent_visitors(),
                'timestamp': now.isoformat()
            }
            
        except Exception as e:
            logger.error(f"Real-time stats failed: {e}")
            return {'error': 'Real-time stats unavailable'}
    
    def _extract_session_data(self, request) -> Dict[str, Any]:
        """Extract session data from request"""
        user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        user_agent = user_agents.parse(user_agent_string)
        ip_address = self._get_client_ip(request)
        
        # Geographic data
        country, city = self._get_location(ip_address)
        
        # Device detection
        device_type = 'mobile' if user_agent.is_mobile else 'tablet' if user_agent.is_tablet else 'desktop'
        
        # Bot detection
        is_bot = user_agent.is_bot
        
        # Recruiter detection (basic heuristics)
        is_recruiter = self._detect_recruiter(request)
        
        return {
            'session_id': self._generate_session_id(),
            'ip_address': ip_address,
            'user_agent': user_agent_string,
            'country': country,
            'city': city,
            'device_type': device_type,
            'browser': f"{user_agent.browser.family} {user_agent.browser.version_string}",
            'operating_system': f"{user_agent.os.family} {user_agent.os.version_string}",
            'referrer': request.META.get('HTTP_REFERER', ''),
            'landing_page': request.path,
            'is_recruiter': is_recruiter,
            'is_bot': is_bot
        }
    
    def _get_client_ip(self, request) -> str:
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def _get_location(self, ip_address: str) -> tuple:
        """Get geographic location from IP"""
        if not self.geo_ip:
            return '', ''
        
        try:
            location = self.geo_ip.city(ip_address)
            return location.country_name or '', location.city or ''
        except (GeoIP2Exception, Exception):
            return '', ''
    
    def _detect_recruiter(self, request) -> bool:
        """Detect if visitor is likely a recruiter"""
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        referrer = request.META.get('HTTP_REFERER', '').lower()
        
        recruiter_indicators = [
            'linkedin', 'indeed', 'glassdoor', 'monster', 'careerbuilder',
            'ziprecruiter', 'dice', 'stackoverflow', 'github'
        ]
        
        return any(indicator in referrer or indicator in user_agent 
                  for indicator in recruiter_indicators)
    
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        import uuid
        return str(uuid.uuid4())
    
    def _get_visitor_analytics(self, start_date, end_date) -> Dict[str, Any]:
        """Get visitor analytics for period"""
        sessions = VisitorSession.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
        
        return {
            'new_visitors': sessions.count(),
            'returning_visitors': 0,  # Would need session tracking across visits
            'recruiter_visitors': sessions.filter(is_recruiter=True).count(),
            'mobile_visitors': sessions.filter(device_type='mobile').count(),
            'desktop_visitors': sessions.filter(device_type='desktop').count(),
            'tablet_visitors': sessions.filter(device_type='tablet').count(),
            'bot_visitors': sessions.filter(is_bot=True).count()
        }
    
    def _get_page_analytics(self, start_date, end_date) -> Dict[str, Any]:
        """Get page analytics for period"""
        page_views = PageView.objects.filter(timestamp__gte=start_date, timestamp__lte=end_date)
        
        # Top pages
        top_pages = page_views.values('page_path').annotate(
            views=models.Count('id'),
            avg_time=models.Avg('time_on_page')
        ).order_by('-views')[:10]
        
        return {
            'total_page_views': page_views.count(),
            'unique_pages': page_views.values('page_path').distinct().count(),
            'top_pages': list(top_pages),
            'avg_time_on_page': page_views.aggregate(models.Avg('time_on_page'))['time_on_page__avg'] or 0,
            'avg_scroll_depth': page_views.aggregate(models.Avg('scroll_depth'))['scroll_depth__avg'] or 0
        }
    
    def _get_ai_analytics(self, start_date, end_date) -> Dict[str, Any]:
        """Get AI feature analytics for period"""
        ai_interactions = AIInteraction.objects.filter(timestamp__gte=start_date, timestamp__lte=end_date)
        
        # Feature usage
        feature_usage = ai_interactions.values('feature_type').annotate(
            usage_count=models.Count('id'),
            success_rate=models.Avg(models.Case(
                models.When(success=True, then=1),
                default=0,
                output_field=models.FloatField()
            )),
            avg_response_time=models.Avg('response_time')
        ).order_by('-usage_count')
        
        return {
            'total_interactions': ai_interactions.count(),
            'success_rate': ai_interactions.filter(success=True).count() / max(ai_interactions.count(), 1),
            'avg_response_time': ai_interactions.aggregate(models.Avg('response_time'))['response_time__avg'] or 0,
            'feature_usage': list(feature_usage),
            'user_ratings': ai_interactions.exclude(user_rating__isnull=True).aggregate(
                models.Avg('user_rating')
            )['user_rating__avg'] or 0
        }
    
    def _get_geographic_analytics(self, start_date, end_date) -> Dict[str, Any]:
        """Get geographic analytics for period"""
        sessions = VisitorSession.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
        
        countries = sessions.exclude(country='').values('country').annotate(
            visitor_count=models.Count('id')
        ).order_by('-visitor_count')[:10]
        
        cities = sessions.exclude(city='').values('city', 'country').annotate(
            visitor_count=models.Count('id')
        ).order_by('-visitor_count')[:10]
        
        return {
            'top_countries': list(countries),
            'top_cities': list(cities)
        }
    
    def _get_device_analytics(self, start_date, end_date) -> Dict[str, Any]:
        """Get device analytics for period"""
        sessions = VisitorSession.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
        
        browsers = sessions.exclude(browser='').values('browser').annotate(
            visitor_count=models.Count('id')
        ).order_by('-visitor_count')[:10]
        
        os_stats = sessions.exclude(operating_system='').values('operating_system').annotate(
            visitor_count=models.Count('id')
        ).order_by('-visitor_count')[:10]
        
        return {
            'browsers': list(browsers),
            'operating_systems': list(os_stats)
        }
    
    def _calculate_avg_session_duration(self, start_date, end_date) -> float:
        """Calculate average session duration"""
        sessions = VisitorSession.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
        avg_duration = sessions.aggregate(models.Avg('total_time_spent'))['total_time_spent__avg']
        return avg_duration or 0
    
    def _calculate_bounce_rate(self, start_date, end_date) -> float:
        """Calculate bounce rate (single page sessions)"""
        sessions = VisitorSession.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
        total_sessions = sessions.count()
        if total_sessions == 0:
            return 0
        
        bounce_sessions = sessions.filter(page_views=1).count()
        return bounce_sessions / total_sessions
    
    def _get_top_pages(self, since_date) -> List[Dict]:
        """Get top pages since date"""
        return list(PageView.objects.filter(timestamp__gte=since_date)
                   .values('page_path')
                   .annotate(views=models.Count('id'))
                   .order_by('-views')[:5])
    
    def _get_recent_visitors(self) -> List[Dict]:
        """Get recent visitor information"""
        recent_sessions = VisitorSession.objects.order_by('-created_at')[:10]
        return [{
            'country': session.country,
            'city': session.city,
            'device_type': session.device_type,
            'is_recruiter': session.is_recruiter,
            'created_at': session.created_at.isoformat(),
            'page_views': session.page_views
        } for session in recent_sessions]
    
    def _get_fallback_analytics(self) -> Dict[str, Any]:
        """Fallback analytics when database is unavailable"""
        return {
            'error': 'Analytics service unavailable',
            'overview': {
                'total_visitors': 0,
                'total_page_views': 0,
                'total_ai_interactions': 0
            }
        }


# Global service instance
analytics_service = AnalyticsService()
