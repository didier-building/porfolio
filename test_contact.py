#!/usr/bin/env python
"""
Test contact form API
"""
import requests
import json

def test_contact_api():
    """Test the contact API endpoint"""
    url = "http://127.0.0.1:8000/api/contact/"
    
    test_data = {
        "name": "Test User",
        "email": "test@example.com", 
        "message": "This is a test message from the contact form."
    }
    
    print("=== Testing Contact API ===")
    print(f"URL: {url}")
    print(f"Data: {json.dumps(test_data, indent=2)}\n")
    
    try:
        response = requests.post(url, json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Contact form working!")
        else:
            print("❌ Contact form failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - is the server running?")
        print("Start server: uv run manage.py runserver")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_contact_api()