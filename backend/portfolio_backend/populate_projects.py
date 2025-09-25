from portfolio_backend.api.models import Project

# Static data from frontend
fallback_projects = [
    {
        "title": "Order & Inventory Backend",
        "description": "Django/DRF API with PostgreSQL modeling orders, stock, reservations, and status transitions. Features idempotent endpoints, Celery workers for pick/pack/dispatch, caching and batched queries, OpenAPI & Postman collection, Dockerized env with seed data.",
        "image_url": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
        "technologies": ["Django", "DRF", "PostgreSQL", "Celery", "Docker", "OpenAPI", "Redis"],
        "category": "web",
        "github_link": "https://github.com/didier-building/order-inventory-api",
        "live_demo": None
    },
    {
        "title": "Ops & Customer Support Dashboard",
        "description": "React/TypeScript dashboard with Tailwind for order tracking, exception workflows, and customer messaging. Features server-side filtering/sorting/pagination, JWT auth, role-based access, audit logs, and error boundaries.",
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        "technologies": ["React", "TypeScript", "Tailwind", "JWT", "REST API"],
        "category": "web",
        "github_link": "https://github.com/didier-building/ops-dashboard",
        "live_demo": None
    },
    {
        "title": "AI-Enhanced Portfolio Platform",
        "description": "React/TypeScript frontend with Django/DRF backend featuring 6 AI-powered tools: job matching, chat bot, career insights, CV generation. Production deployment with Docker, health monitoring, and analytics.",
        "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        "technologies": ["React", "TypeScript", "Django", "DRF", "AI/ML", "Docker"],
        "category": "web",
        "github_link": "https://github.com/didier-building/porfolio",
        "live_demo": "https://imanirahari.netlify.app"
    }
]

# Insert data into the database
for project in fallback_projects:
    Project.objects.create(
        title=project["title"],
        description=project["description"],
        image_url=project["image_url"],
        technologies=", ".join(project["technologies"]),
        category=project["category"],
        github_link=project["github_link"],
        live_demo=project["live_demo"]
    )

print("Projects added successfully!")
