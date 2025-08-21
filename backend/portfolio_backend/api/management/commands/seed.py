from django.core.management.base import BaseCommand
from api.models import Technology, Project, Skill, Profile, Contact
from datetime import date

class Command(BaseCommand):
    help = "Seed database with initial data"

    def handle(self, *args, **options):
        tech, _ = Technology.objects.get_or_create(name="Django")
        project, _ = Project.objects.get_or_create(
            title="Sample Project",
            defaults={"description": "Demo project", "start_date": date.today()}
        )
        project.technologies.add(tech)
        Skill.objects.get_or_create(name="Python", proficiency=90)
        Profile.objects.get_or_create(name="John Doe", title="Developer", bio="Demo profile")
        Contact.objects.get_or_create(name="Jane", email="jane@example.com", message="Hello")
        self.stdout.write(self.style.SUCCESS("Seed data created"))
