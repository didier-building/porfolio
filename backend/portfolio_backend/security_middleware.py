"""
Custom security middleware for production
"""
import logging
import time
from django.http import HttpResponseForbidden
from django.core.cache import cache
from django.conf import settings

logger = logging.getLogger('security')

class SecurityMiddleware:
    """Enhanced security middleware"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Security checks before processing request
        if not self._security_checks(request):
            return HttpResponseForbidden("Access denied")
            
        response = self.get_response(request)
        
        # Add security headers
        self._add_security_headers(response)
        
        return response
    
    def _security_checks(self, request):
        """Perform security checks"""
        # Block suspicious user agents
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        suspicious_agents = ['sqlmap', 'nikto', 'nmap', 'masscan']
        if any(agent in user_agent for agent in suspicious_agents):
            logger.warning(f"Blocked suspicious user agent: {user_agent}")
            return False
            
        # Block requests with suspicious headers
        if request.META.get('HTTP_X_FORWARDED_FOR') == '127.0.0.1':
            return False
            
        return True
    
    def _add_security_headers(self, response):
        """Add security headers to response"""
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        if not settings.DEBUG:
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'

class RateLimitMiddleware:
    """Rate limiting middleware"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        if not self._check_rate_limit(request):
            return HttpResponseForbidden("Rate limit exceeded")
            
        return self.get_response(request)
    
    def _check_rate_limit(self, request):
        """Check rate limits"""
        ip = self._get_client_ip(request)
        
        # Different limits for different endpoints
        if request.path.startswith('/api/contact/'):
            return self._check_limit(f"contact:{ip}", 5, 300)  # 5 per 5 minutes
        elif request.path.startswith('/api/ai'):
            return self._check_limit(f"ai:{ip}", 20, 3600)  # 20 per hour
        else:
            return self._check_limit(f"general:{ip}", 100, 3600)  # 100 per hour
    
    def _check_limit(self, key, limit, window):
        """Check if request is within rate limit"""
        current = cache.get(key, 0)
        if current >= limit:
            return False
        cache.set(key, current + 1, window)
        return True
    
    def _get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', 'unknown')