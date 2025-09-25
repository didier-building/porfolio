#!/usr/bin/env python
"""
Email setup helper for portfolio contact form
"""
import os
from pathlib import Path

def setup_email():
    """Setup email configuration"""
    print("=== Portfolio Contact Form Email Setup ===\n")
    
    print("To receive contact form emails, you need to configure Gmail SMTP.")
    print("Follow these steps:\n")
    
    print("1. Enable 2-Factor Authentication on your Gmail account")
    print("2. Generate an App Password:")
    print("   - Go to: https://myaccount.google.com/apppasswords")
    print("   - Select 'Mail' and generate a password")
    print("   - Copy the 16-character password\n")
    
    print("3. Create/update your .env file with:")
    print("   EMAIL_HOST_USER=your-email@gmail.com")
    print("   EMAIL_HOST_PASSWORD=your-16-char-app-password")
    print("   DEFAULT_FROM_EMAIL=your-email@gmail.com")
    print("   ADMIN_EMAIL=didier53053@gmail.com")
    
    # Check if .env exists
    env_path = Path('.env')
    if not env_path.exists():
        print(f"\n4. Copy .env.example to .env:")
        print(f"   cp .env.example .env")
        print(f"   Then edit .env with your email credentials")
    else:
        print(f"\n4. Update your existing .env file with email settings")
    
    print(f"\n5. Test the setup:")
    print(f"   uv run python test_email.py")
    
    print(f"\nNote: Without email configuration, messages will only be saved to database")
    print(f"and displayed in console (development mode).")

if __name__ == "__main__":
    setup_email()