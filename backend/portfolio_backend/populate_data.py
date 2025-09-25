#!/usr/bin/env python
"""
Populate backend database with static data from frontend
"""
import os
import sys
import django
from datetime import date

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
django.setup()

from api.models import Project, Technology, Skill

def populate_technologies():
    """Create all unique technologies from projects and skills"""
    tech_names = {
        # From projects
        "Django", "DRF", "PostgreSQL", "Celery", "Docker", "OpenAPI", "Redis",
        "React", "TypeScript", "Tailwind", "JWT", "REST API", "AI/ML",
        "Vyper", "Blockchain", "Smart Contracts", "Testing",
        "GitHub Actions", "Makefile", "CI/CD", "DevOps", "MySQL",
        # From skills
        "Python", "Django REST Framework", "FastAPI", "REST/Webhooks", "PyTest/UnitTest",
        "React Query", "JavaScript", "Schema Design", "Indexing", "Migrations",
        "Kubernetes", "GitHub Actions CI/CD", "Linux", "Nginx", "Railway/Heroku/Netlify",
        "Idempotency Patterns", "Retries/Backoff", "Pagination", "RBAC", "Audit Logging",
        "Background Jobs", "Caching", "Git/GitHub", "Agile/Scrum", "ADRs/Runbooks",
        "Technical Documentation"
    }
    
    for tech_name in tech_names:
        Technology.objects.get_or_create(name=tech_name)
    
    print(f"Created {len(tech_names)} technologies")

def populate_projects():
    """Populate projects with exact frontend data"""
    projects_data = [
        {
            "title": "Order & Inventory Backend",
            "description": "Django/DRF API with PostgreSQL modeling orders, stock, reservations, and status transitions. Features idempotent endpoints, Celery workers for pick/pack/dispatch, caching and batched queries, OpenAPI & Postman collection, Dockerized env with seed data.",
            "image_url": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
            "technologies": ["Django", "DRF", "PostgreSQL", "Celery", "Docker", "OpenAPI", "Redis"],
            "category": "web",
            "github_url": None,  # "https://github.com/didier-building/order-inventory-api",
            "live_url": None,
            "start_date": date(2024, 1, 1)
        },
        {
            "title": "Ops & Customer Support Dashboard",
            "description": "React/TypeScript dashboard with Tailwind for order tracking, exception workflows, and customer messaging. Features server-side filtering/sorting/pagination, JWT auth, role-based access, audit logs, and error boundaries.",
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            "technologies": ["React", "TypeScript", "Tailwind", "JWT", "REST API"],
            "category": "web",
            "github_url": None,  # "https://github.com/didier-building/ops-dashboard",
            "live_url": None,
            "start_date": date(2024, 2, 1)
        },
        {
            "title": "AI-Enhanced Portfolio Platform",
            "description": "React/TypeScript frontend with Django/DRF backend featuring 6 AI-powered tools: job matching, chat bot, career insights, CV generation. Production deployment with Docker, health monitoring, and analytics.",
            "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
            "technologies": ["React", "TypeScript", "Django", "DRF", "AI/ML", "Docker"],
            "category": "web",
            "github_url": None,  # "https://github.com/didier-building/porfolio",
            "live_url": "https://imanirahari.netlify.app",
            "start_date": date(2024, 3, 1)
        },
        {
            "title": "Blockchain Agricultural Supply Chain",
            "description": "Capstone project designed with Django REST + Vyper smart contracts for produce tracking with ownership transfers and status updates. Features comprehensive unit tests for contract interactions and documented API/contract boundaries.",
            "image_url": "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80",
            "technologies": ["Django", "REST API", "Vyper", "Blockchain", "Smart Contracts", "Testing"],
            "category": "blockchain",
            "github_url": None,  # "https://github.com/didier-building/agri-supply-chain",
            "live_url": None,
            "start_date": date(2024, 4, 1)
        },
        {
            "title": "DevEx Templates & Workflows",
            "description": "Reusable GitHub Actions pipelines, Docker configurations, Makefile targets, pre-commit hooks, and PR templates. Consistent CI pipelines and tooling adopted across repos with coding standards, resulting in reduced onboarding time from ~1 day to <30 minutes.",
            "image_url": "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80",
            "technologies": ["GitHub Actions", "Docker", "Makefile", "CI/CD", "DevOps"],
            "category": "cloud",
            "github_url": None,  # "https://github.com/didier-building/devex-templates",
            "live_url": None,
            "start_date": date(2024, 5, 1)
        },
        {
            "title": "Career Compass Platform",
            "description": "Student application workflows platform with Django/DRF and JWT. Features registration, profiles, program catalogs, preference ranking, tracking, and rule-based eligibility/matching module with PostgreSQL/MySQL.",
            "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
            "technologies": ["Django", "DRF", "JWT", "PostgreSQL", "MySQL", "Docker"],
            "category": "web",
            "github_url": None,  # "https://github.com/didier-building/career-compass",
            "live_url": None,
            "start_date": date(2024, 6, 1)
        }
    ]
    
    for project_data in projects_data:
        # Create project
        project = Project.objects.create(
            title=project_data["title"],
            description=project_data["description"],
            image_url=project_data["image_url"],
            category=project_data["category"],
            github_url=project_data["github_url"],
            live_url=project_data["live_url"],
            start_date=project_data["start_date"]
        )
        
        # Add technologies
        for tech_name in project_data["technologies"]:
            tech = Technology.objects.get(name=tech_name)
            project.technologies.add(tech)
    
    print(f"Created {len(projects_data)} projects")

def populate_skills():
    """Populate skills with exact frontend data"""
    skills_data = [
        # Backend Development
        {"name": "Python", "category": "Backend Development", "proficiency": 95},
        {"name": "Django", "category": "Backend Development", "proficiency": 90},
        {"name": "Django REST Framework", "category": "Backend Development", "proficiency": 90},
        {"name": "FastAPI", "category": "Backend Development", "proficiency": 70},
        {"name": "REST/Webhooks", "category": "Backend Development", "proficiency": 85},
        {"name": "Celery", "category": "Backend Development", "proficiency": 80},
        {"name": "PyTest/UnitTest", "category": "Backend Development", "proficiency": 85},
        
        # Frontend Development
        {"name": "React", "category": "Frontend Development", "proficiency": 85},
        {"name": "TypeScript", "category": "Frontend Development", "proficiency": 75},
        {"name": "Tailwind CSS", "category": "Frontend Development", "proficiency": 90},
        {"name": "React Query", "category": "Frontend Development", "proficiency": 70},
        {"name": "JavaScript", "category": "Frontend Development", "proficiency": 85},
        
        # Data & Databases
        {"name": "PostgreSQL", "category": "Database", "proficiency": 85},
        {"name": "MySQL", "category": "Database", "proficiency": 80},
        {"name": "Schema Design", "category": "Database", "proficiency": 85},
        {"name": "Indexing", "category": "Database", "proficiency": 80},
        {"name": "Migrations", "category": "Database", "proficiency": 85},
        
        # DevOps & Infrastructure
        {"name": "Docker", "category": "Cloud & DevOps", "proficiency": 85},
        {"name": "Kubernetes", "category": "Cloud & DevOps", "proficiency": 75},
        {"name": "GitHub Actions CI/CD", "category": "Cloud & DevOps", "proficiency": 80},
        {"name": "Linux", "category": "Cloud & DevOps", "proficiency": 85},
        {"name": "Nginx", "category": "Cloud & DevOps", "proficiency": 75},
        {"name": "Railway/Heroku/Netlify", "category": "Cloud & DevOps", "proficiency": 80},
        
        # Patterns & Architecture
        {"name": "Idempotency Patterns", "category": "Infrastructure", "proficiency": 85},
        {"name": "Retries/Backoff", "category": "Infrastructure", "proficiency": 80},
        {"name": "Pagination", "category": "Infrastructure", "proficiency": 85},
        {"name": "RBAC", "category": "Infrastructure", "proficiency": 80},
        {"name": "Audit Logging", "category": "Infrastructure", "proficiency": 80},
        {"name": "Background Jobs", "category": "Infrastructure", "proficiency": 85},
        {"name": "Caching", "category": "Infrastructure", "proficiency": 80},
        
        # Collaboration & Tools
        {"name": "Git/GitHub", "category": "Collaboration", "proficiency": 90},
        {"name": "Agile/Scrum", "category": "Collaboration", "proficiency": 80},
        {"name": "ADRs/Runbooks", "category": "Collaboration", "proficiency": 85},
        {"name": "Technical Documentation", "category": "Collaboration", "proficiency": 90}
    ]
    
    for skill_data in skills_data:
        Skill.objects.create(**skill_data)
    
    print(f"Created {len(skills_data)} skills")

def main():
    print("Populating database with frontend data...")
    
    # Clear existing data
    Project.objects.all().delete()
    Technology.objects.all().delete()
    Skill.objects.all().delete()
    
    # Populate data
    populate_technologies()
    populate_projects()
    populate_skills()
    
    print("Database population completed!")

if __name__ == "__main__":
    main()