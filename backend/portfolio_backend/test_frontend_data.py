#!/usr/bin/env python
"""
Test script to verify frontend data endpoints
"""

import os
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
django.setup()

def test_api_endpoints():
    """Test the new professional profile API endpoints"""
    base_url = "http://localhost:8000/api"
    
    endpoints = [
        "/profile/skills/",
        "/profile/experience/", 
        "/profile/education/"
    ]
    
    print("🧪 Testing Professional Profile API Endpoints")
    print("=" * 50)
    
    for endpoint in endpoints:
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                print(f"✅ {endpoint}")
                print(f"   Status: {response.status_code}")
                print(f"   Count: {len(results)} items")
                
                if results:
                    # Show first item as example
                    first_item = results[0]
                    print(f"   Sample: {first_item}")
                print()
            else:
                print(f"❌ {endpoint}")
                print(f"   Status: {response.status_code}")
                print(f"   Error: {response.text}")
                print()
                
        except Exception as e:
            print(f"❌ {endpoint}")
            print(f"   Error: {e}")
            print()

if __name__ == '__main__':
    test_api_endpoints()
