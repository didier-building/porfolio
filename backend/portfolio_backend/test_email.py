#!/usr/bin/env python
"""
Test email configuration
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    """Test email sending"""
    print("=== Testing Email Configuration ===\n")
    
    print(f"Email Backend: {settings.EMAIL_BACKEND}")
    print(f"Email Host: {settings.EMAIL_HOST}")
    print(f"Email User: {settings.EMAIL_HOST_USER}")
    print(f"Admin Email: {settings.ADMIN_EMAIL}")
    print(f"From Email: {settings.DEFAULT_FROM_EMAIL}\n")
    
    if not settings.EMAIL_HOST_USER:
        print("❌ EMAIL_HOST_USER not configured")
        print("Run: python setup_email.py for setup instructions")
        return
    
    try:
        send_mail(
            subject="Portfolio Contact Form Test",
            message="This is a test email from your portfolio contact form setup.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        print("✅ Test email sent successfully!")
        print(f"Check your inbox: {settings.ADMIN_EMAIL}")
    except Exception as e:
        print(f"❌ Email sending failed: {e}")
        print("\nCommon issues:")
        print("- Wrong email/password")
        print("- App password not generated")
        print("- 2FA not enabled")
        print("- Gmail blocking less secure apps")

if __name__ == "__main__":
    test_email()