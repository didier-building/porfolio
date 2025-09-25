#!/usr/bin/env python
"""
Test script to verify backend-frontend integration
"""
import requests
import json

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = "http://127.0.0.1:8000/api"
    
    endpoints = [
        "/projects/",
        "/skills/", 
        "/technologies/",
        "/experiences/",
        "/profiles/"
    ]
    
    print("=== API INTEGRATION TEST ===")
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                count = len(data.get('results', data))
                print(f"✅ {endpoint}: {count} items")
            else:
                print(f"❌ {endpoint}: HTTP {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"❌ {endpoint}: Connection failed (server not running?)")
        except Exception as e:
            print(f"❌ {endpoint}: {str(e)}")
    
    # Test specific project data structure
    try:
        response = requests.get(f"{base_url}/projects/")
        if response.status_code == 200:
            projects = response.json().get('results', [])
            if projects:
                project = projects[0]
                print(f"\n=== SAMPLE PROJECT DATA ===")
                print(f"Title: {project.get('title')}")
                print(f"Category: {project.get('category')}")
                print(f"Technologies: {project.get('technologies')}")
                print(f"Links: {project.get('links')}")
                print(f"Image: {project.get('image')}")
    except Exception as e:
        print(f"Error testing project structure: {e}")

if __name__ == "__main__":
    test_api_endpoints()