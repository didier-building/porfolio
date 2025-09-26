"""
Input validation and sanitization utilities
"""
import re
import html
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class InputValidator:
    """Comprehensive input validation"""
    
    # Regex patterns for validation
    EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    NAME_PATTERN = re.compile(r'^[a-zA-Z\s\-\'\.]{2,50}$')
    
    # Suspicious patterns
    SQL_INJECTION_PATTERNS = [
        r'(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)',
        r'(--|#|/\*|\*/)',
        r'(\bOR\b.*=.*\bOR\b)',
        r'(\bAND\b.*=.*\bAND\b)',
    ]
    
    XSS_PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>.*?</iframe>',
    ]
    
    @classmethod
    def validate_email(cls, email):
        """Validate email format"""
        if not email or len(email) > 254:
            raise ValidationError(_('Invalid email address'))
        
        if not cls.EMAIL_PATTERN.match(email):
            raise ValidationError(_('Invalid email format'))
        
        # Check for suspicious patterns
        if cls._contains_suspicious_patterns(email):
            raise ValidationError(_('Invalid email content'))
        
        return email.lower().strip()
    
    @classmethod
    def validate_name(cls, name):
        """Validate name field"""
        if not name or len(name) < 2 or len(name) > 50:
            raise ValidationError(_('Name must be between 2 and 50 characters'))
        
        if not cls.NAME_PATTERN.match(name):
            raise ValidationError(_('Name contains invalid characters'))
        
        if cls._contains_suspicious_patterns(name):
            raise ValidationError(_('Invalid name content'))
        
        return html.escape(name.strip())
    
    @classmethod
    def validate_message(cls, message):
        """Validate message content"""
        if not message or len(message) < 10:
            raise ValidationError(_('Message must be at least 10 characters'))
        
        if len(message) > 2000:
            raise ValidationError(_('Message too long (max 2000 characters)'))
        
        if cls._contains_suspicious_patterns(message):
            raise ValidationError(_('Message contains invalid content'))
        
        # Remove potential XSS
        cleaned_message = cls._sanitize_html(message)
        
        return cleaned_message.strip()
    
    @classmethod
    def _contains_suspicious_patterns(cls, text):
        """Check for SQL injection and XSS patterns"""
        text_lower = text.lower()
        
        # Check SQL injection patterns
        for pattern in cls.SQL_INJECTION_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        
        # Check XSS patterns
        for pattern in cls.XSS_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        
        return False
    
    @classmethod
    def _sanitize_html(cls, text):
        """Sanitize HTML content"""
        # Escape HTML entities
        text = html.escape(text)
        
        # Remove potentially dangerous patterns
        dangerous_patterns = [
            r'javascript:',
            r'data:',
            r'vbscript:',
            r'on\w+\s*=',
        ]
        
        for pattern in dangerous_patterns:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
        
        return text

def validate_contact_form(data):
    """Validate entire contact form"""
    validator = InputValidator()
    
    cleaned_data = {}
    
    # Validate name
    cleaned_data['name'] = validator.validate_name(data.get('name', ''))
    
    # Validate email
    cleaned_data['email'] = validator.validate_email(data.get('email', ''))
    
    # Validate message
    cleaned_data['message'] = validator.validate_message(data.get('message', ''))
    
    # Check honeypot
    if data.get('website') or data.get('honeypot'):
        raise ValidationError(_('Spam detected'))
    
    return cleaned_data