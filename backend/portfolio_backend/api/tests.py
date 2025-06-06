from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Project
from .models import Technology

class ProjectViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.technology1 = Technology.objects.create(name='Django')
        self.technology2 = Technology.objects.create(name='Python')
        self.project = Project.objects.create(
        title='Test Project',
        description='Test project description',
        start_date='2022-01-01',
        end_date='2022-01-31'
    )
        self.project.technologies.add(self.technology1, self.technology2)
    def test_get_projects(self):
        response = self.client.get(reverse('api:project-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_project(self):
        response = self.client.get(reverse('api:project-detail', args=[self.project.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.project.title)
# Create your tests here.
