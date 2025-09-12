from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Project, Skill, Contact, Technology

class ProjectAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.tech = Technology.objects.create(name='Python')
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            start_date='2023-01-01'
        )
        self.project.technologies.add(self.tech)

    def test_project_list(self):
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_project_detail(self):
        response = self.client.get(f'/api/projects/{self.project.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Project')

class ContactAPITestCase(APITestCase):
    def test_contact_create(self):
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'Test message'
        }
        response = self.client.post('/api/contact/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.count(), 1)

    def test_contact_honeypot(self):
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'Test message',
            'website': 'spam'
        }
        response = self.client.post('/api/contact/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class SkillAPITestCase(APITestCase):
    def setUp(self):
        self.skill = Skill.objects.create(name='Python', proficiency=90, category='Backend')

    def test_skill_list(self):
        response = self.client.get('/api/skills/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)