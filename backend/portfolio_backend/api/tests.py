from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Project, Technology, Skill, Experience, Education, Contact, Profile
from datetime import date
import json

class BaseAPITest(APITestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # Create regular user
        self.regular_user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpassword'
        )
        
        # Create client
        self.client = APIClient()
    
    def authenticate_as_admin(self):
        refresh = RefreshToken.for_user(self.admin_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def authenticate_as_user(self):
        refresh = RefreshToken.for_user(self.regular_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def clear_authentication(self):
        self.client.credentials()

class ProjectAPITest(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.tech1 = Technology.objects.create(name="Python")
        self.tech2 = Technology.objects.create(name="Django")
        
        self.project1 = Project.objects.create(
            title="Test Project 1",
            description="Test Description 1",
            start_date=date(2023, 1, 1)
        )
        self.project1.technologies.add(self.tech1)
        
        self.project2 = Project.objects.create(
            title="Test Project 2",
            description="Test Description 2",
            start_date=date(2023, 2, 1)
        )
        self.project2.technologies.add(self.tech1, self.tech2)
        
    def test_get_all_projects(self):
        response = self.client.get(reverse('project-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_get_single_project(self):
        response = self.client.get(reverse('project-detail', kwargs={'pk': self.project1.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Project 1')
    
    def test_filter_projects_by_technology(self):
        response = self.client.get(f"{reverse('project-list')}?technologies={self.tech2.pk}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Project 2')
    
    def test_search_projects(self):
        response = self.client.get(f"{reverse('project-list')}?search=Test Project 1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Project 1')
    
    def test_ordering_projects(self):
        response = self.client.get(f"{reverse('project-list')}?ordering=start_date")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['title'], 'Test Project 1')
        
        response = self.client.get(f"{reverse('project-list')}?ordering=-start_date")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['title'], 'Test Project 2')
    
    def test_create_project_unauthenticated(self):
        data = {
            'title': 'New Project',
            'description': 'New Description',
            'start_date': '2023-05-01'
        }
        response = self.client.post(
            reverse('project-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_project_as_admin(self):
        self.authenticate_as_admin()
        data = {
            'title': 'Admin Project',
            'description': 'Admin Description',
            'start_date': '2023-06-01'
        }
        response = self.client.post(
            reverse('project-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 3)
    
    def test_update_project_as_admin(self):
        self.authenticate_as_admin()
        data = {
            'title': 'Updated Project',
            'description': self.project1.description,
            'start_date': self.project1.start_date.isoformat()
        }
        response = self.client.put(
            reverse('project-detail', kwargs={'pk': self.project1.pk}),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project1.refresh_from_db()
        self.assertEqual(self.project1.title, 'Updated Project')
    
    def test_delete_project_as_admin(self):
        self.authenticate_as_admin()
        response = self.client.delete(
            reverse('project-detail', kwargs={'pk': self.project1.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 1)
    
    def test_get_nonexistent_project(self):
        response = self.client.get(reverse('project-detail', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class SkillAPITest(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.skill1 = Skill.objects.create(
            name="Python",
            proficiency=90,
            category="Programming"
        )
        self.skill2 = Skill.objects.create(
            name="Django",
            proficiency=85,
            category="Framework"
        )
    
    def test_get_all_skills(self):
        response = self.client.get(reverse('skill-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_filter_skills_by_category(self):
        response = self.client.get(f"{reverse('skill-list')}?category=Framework")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Django')
    
    def test_create_skill_as_admin(self):
        self.authenticate_as_admin()
        data = {
            'name': 'React',
            'proficiency': 80,
            'category': 'Frontend'
        }
        response = self.client.post(
            reverse('skill-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Skill.objects.count(), 3)

class ExperienceAPITest(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.experience1 = Experience.objects.create(
            position="Software Engineer",
            company="Tech Corp",
            description="Developed web applications",
            start_date=date(2020, 1, 1),
            end_date=date(2022, 1, 1)
        )
        self.experience2 = Experience.objects.create(
            position="Senior Developer",
            company="Dev Inc",
            description="Led development team",
            start_date=date(2022, 2, 1)
        )
    
    def test_get_all_experiences(self):
        response = self.client.get(reverse('experience-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_search_experiences(self):
        response = self.client.get(f"{reverse('experience-list')}?search=Senior")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['position'], 'Senior Developer')

class EducationAPITest(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.education1 = Education.objects.create(
            degree="Bachelor of Science",
            institution="Tech University",
            description="Studied Computer Science",  # Changed from field_of_study
            start_date=date(2016, 9, 1),
            end_date=date(2020, 6, 1)
        )
    
    def test_get_all_education(self):
        response = self.client.get(reverse('education-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_education_as_admin(self):
        self.authenticate_as_admin()
        data = {
            'degree': 'Master of Science',
            'institution': 'Advanced University',
            'description': 'Studied Data Science',  # Changed from field_of_study
            'start_date': '2020-09-01',
            'end_date': '2022-06-01'
        }
        response = self.client.post(
            reverse('education-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Education.objects.count(), 2)

class TechnologyAPITest(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.tech1 = Technology.objects.create(name="Python")
        self.tech2 = Technology.objects.create(name="Django")
    
    def test_get_all_technologies(self):
        response = self.client.get(reverse('technology-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

class ContactAPITest(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.contact1 = Contact.objects.create(
            name="John Doe",
            email="john@example.com",
            message="Hello, I'd like to connect"
        )
    
    def test_create_contact(self):
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'This is a test message'
        }
        response = self.client.post(
            reverse('contact-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.count(), 2)
        
        # Get the newest contact by created_at instead of using last()
        newest_contact = Contact.objects.order_by('-created_at').first()
        self.assertEqual(newest_contact.name, 'Test User')
    
    def test_get_contacts_unauthenticated(self):
        response = self.client.get(reverse('contact-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_contacts_as_admin(self):
        self.authenticate_as_admin()
        response = self.client.get(reverse('contact-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class ProfileAPITest(BaseAPITest):
    def setUp(self):
        super().setUp()
        Profile.objects.create(name="John Doe", title="Dev", bio="Bio")

    def test_get_profiles(self):
        response = self.client.get(reverse('profile-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'John Doe')

class AuthenticationTest(BaseAPITest):
    def test_obtain_token(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'username': 'admin', 'password': 'adminpassword'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)
    
    def test_refresh_token(self):
        # First obtain token
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'username': 'admin', 'password': 'adminpassword'},
            format='json'
        )
        refresh_token = response.data['refresh']
        
        # Then refresh it
        response = self.client.post(
            reverse('token_refresh'),
            {'refresh': refresh_token},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
    
    def test_invalid_credentials(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'username': 'admin', 'password': 'wrongpassword'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
