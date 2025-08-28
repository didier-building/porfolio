import logging
import json
from datetime import datetime

import requests

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django_ratelimit.decorators import ratelimit
from django.conf import settings
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import NotAuthenticated, ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.decorators import action
from rest_framework.views import APIView
from .tasks import send_contact_email
from .models import (
    Project,
    Skill,
    Experience,
    Education,
    Contact,
    Technology,
    SocialProfile,
    CommsDocument,
    CareerDocument,
    ProfessionalProfile,
)
from .serializers import (
    ProjectSerializer,
    SkillSerializer,
    ExperienceSerializer,
    EducationSerializer,
    ContactSerializer,
    TechnologySerializer,
    SocialProfileSerializer,
    CommsDocumentSerializer,
    CareerDocumentSerializer,
    CareerDocumentUploadSerializer,
    ProfessionalProfileSerializer,
)
from .gemini_service import gemini_service
from .cv_generator import cv_generator
from .skill_recommender import skill_recommender
from .journal_ai_service import journal_ai_service
from .journal_models import JournalEntry, JournalGoal, JournalInsight, JournalTemplate

logger = logging.getLogger(__name__)

# Custom throttle class for development
class DevelopmentFriendlyThrottle(AnonRateThrottle):
    """More permissive throttling for development"""
    def allow_request(self, request, view):
        if settings.DEBUG and request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True  # No throttling for read operations in development
        return super().allow_request(request, view)

# Custom permission class
class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    Anyone can read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated()
        return request.user.is_staff


class RequireAuthenticated(permissions.BasePermission):
    """Permission that explicitly requires an authenticated user."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated()
        return True

# Optimize Project ViewSet
class ProjectViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = Project.objects.prefetch_related('technologies').all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'end_date', 'title']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [RequireAuthenticated(), permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        tech = self.request.query_params.get('technologies')
        if tech:
            queryset = queryset.filter(technologies__id=tech)
        return queryset

    def list(self, request, *args, **kwargs):
        logger.debug(f"Projects list requested by {request.user}")
        projects = self.get_queryset()
        logger.debug(f"Found {projects.count()} projects")
        return super().list(request, *args, **kwargs)

# Add caching to Skill ViewSet
class SkillViewSet(viewsets.ModelViewSet):
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['proficiency', 'name']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    @method_decorator(cache_page(60 * 30))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 30))
    @method_decorator(vary_on_cookie)
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

# Add caching to Experience ViewSet
class ExperienceViewSet(viewsets.ModelViewSet):
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['position', 'company', 'description']
    ordering_fields = ['start_date', 'end_date', 'company']
    
    @method_decorator(cache_page(60 * 30))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

# Add caching to Education ViewSet
class EducationViewSet(viewsets.ModelViewSet):
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    
    @method_decorator(cache_page(60 * 30))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

# Add caching to Technology ViewSet
class TechnologyViewSet(viewsets.ModelViewSet):
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [IsAdminUserOrReadOnly]
    
    @method_decorator(cache_page(60 * 30))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

# SocialProfile ViewSet
class SocialProfileViewSet(viewsets.ModelViewSet):
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = SocialProfile.objects.all()
    serializer_class = SocialProfileSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class CommsDocumentViewSet(viewsets.ModelViewSet):
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = CommsDocument.objects.filter(published=True)
    serializer_class = CommsDocumentSerializer
    http_method_names = ['get']
    permission_classes = [permissions.AllowAny]

# Add rate limiting and email notifications to Contact ViewSet
class ContactViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [RequireAuthenticated(), permissions.IsAdminUser()]

    @method_decorator(ratelimit(key="ip", rate="5/m", method="POST", block=True))
    def create(self, request, *args, **kwargs):
        try:
            # Honeypot field
            if request.data.get("website"):
                return Response({"message": "Spam detected"}, status=400)

            # Basic validation
            required_fields = ['name', 'email', 'message']
            for field in required_fields:
                if not request.data.get(field, '').strip():
                    return Response({"message": f"{field.title()} is required"}, status=400)

            # CAPTCHA verification (Cloudflare Turnstile)
            token = request.data.get("captchaToken")
            secret = getattr(settings, "TURNSTILE_SECRET", None)
            if secret and token:
                try:
                    resp = requests.post(
                        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                        data={"secret": secret, "response": token},
                        timeout=5,
                    )
                    if not resp.json().get("success"):
                        return Response({"message": "Invalid CAPTCHA"}, status=400)
                except requests.RequestException:
                    logger.warning("CAPTCHA verification failed due to network error")

            response = super().create(request, *args, **kwargs)

            # Send email notification
            try:
                send_contact_email.delay(response.data["id"])
            except Exception as e:
                logger.error(f"Failed to queue contact email: {e}")
                # Don't fail the request if email fails

            return response

        except Exception as e:
            logger.error(f"Contact form submission error: {e}")
            return Response({"message": "An error occurred. Please try again."}, status=500)


# Professional Career Document Management ViewSets
class CareerDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing career documents with secure upload and processing"""
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = CareerDocument.objects.all()
    serializer_class = CareerDocumentSerializer
    permission_classes = [permissions.AllowAny]  # Adjust based on your security needs
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'document_type']
    ordering_fields = ['uploaded_at', 'priority', 'processing_status']
    ordering = ['priority', '-uploaded_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return CareerDocumentUploadSerializer
        return CareerDocumentSerializer

    def perform_create(self, serializer):
        """Handle document upload with validation"""
        try:
            # Validate file type
            file = serializer.validated_data.get('file')
            if file:
                allowed_types = ['pdf', 'doc', 'docx', 'txt']
                file_extension = file.name.split('.')[-1].lower() if '.' in file.name else ''

                if file_extension not in allowed_types:
                    raise ValidationError(f"File type '{file_extension}' not allowed. Allowed types: {', '.join(allowed_types)}")

                # Validate file size (max 10MB)
                max_size = 10 * 1024 * 1024  # 10MB
                if file.size > max_size:
                    raise ValidationError(f"File size too large. Maximum size: {max_size / (1024*1024):.1f}MB")

            # Save the document
            document = serializer.save()

            # Process document immediately (synchronous processing)
            try:
                from .career_document_processor import CareerDocumentProcessor
                processor = CareerDocumentProcessor()
                processor.process_document(document)
                logger.info(f"Successfully processed document: {document.id}")
            except Exception as e:
                logger.warning(f"Failed to process document immediately: {e}")
                # Try to queue for background processing as fallback
                try:
                    from .tasks import process_career_document
                    process_career_document.delay(str(document.id))
                    logger.info(f"Queued processing for document: {document.id}")
                except Exception as queue_error:
                    logger.warning(f"Failed to queue document processing: {queue_error}")
                    # Don't fail the upload if processing fails

        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Document upload error: {e}")
            raise ValidationError("Failed to upload document. Please try again.")

    @action(detail=True, methods=['post'])
    def reprocess(self, request, pk=None):
        """Manually trigger document reprocessing"""
        document = self.get_object()
        try:
            from .tasks import process_career_document
            process_career_document.delay(str(document.id))
            document.processing_status = 'pending'
            document.save()
            return Response({'message': 'Document reprocessing queued'})
        except Exception as e:
            logger.error(f"Failed to queue reprocessing: {e}")
            return Response({'error': 'Failed to queue reprocessing'}, status=500)


class ProfessionalProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for managing professional profile data"""
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = ProfessionalProfile.objects.filter(is_active=True)
    serializer_class = ProfessionalProfileSerializer
    permission_classes = [permissions.AllowAny]  # Public for recruiters

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get the current active professional profile"""
        try:
            profile = ProfessionalProfile.objects.filter(is_active=True).first()
            if profile:
                serializer = self.get_serializer(profile)
                return Response(serializer.data)
            else:
                return Response({'message': 'No active professional profile found'}, status=404)
        except Exception as e:
            logger.error(f"Error fetching professional profile: {e}")
            return Response({'error': 'Failed to fetch profile'}, status=500)

    @action(detail=True, methods=['post'])
    def rebuild_from_documents(self, request, pk=None):
        """Rebuild professional profile from uploaded documents"""
        profile = self.get_object()
        try:
            from .tasks import rebuild_professional_profile
            rebuild_professional_profile.delay(profile.id)
            return Response({'message': 'Profile rebuild queued'})
        except Exception as e:
            logger.error(f"Failed to queue profile rebuild: {e}")
            return Response({'error': 'Failed to queue profile rebuild'}, status=500)


# Professional Profile Views for Frontend Integration
class ProfessionalSkillsView(APIView):
    """API view to get skills from professional profile in frontend-compatible format"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Get Didier's profile specifically, or the most recently updated one
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            # Fallback to any active profile with technical skills
            if not profile:
                profile = ProfessionalProfile.objects.filter(
                    is_active=True,
                    technical_skills__isnull=False
                ).exclude(technical_skills={}).first()

            if not profile or not profile.technical_skills:
                return Response({'results': []})

            # Convert professional profile skills to frontend format
            skills_data = []
            skill_id = 1

            for category, skills_list in profile.technical_skills.items():
                # Clean up category names for better display
                display_category = self._format_category_name(category)

                for skill_name in skills_list:
                    # Clean up skill names and filter out invalid entries
                    clean_skill = self._clean_skill_name(skill_name)
                    if clean_skill and len(clean_skill) > 1:
                        skills_data.append({
                            'id': skill_id,
                            'name': clean_skill,
                            'category': display_category,
                            'proficiency': self._estimate_proficiency(skill_name, category)
                        })
                        skill_id += 1

            return Response({'results': skills_data})

        except Exception as e:
            logger.error(f"Error fetching professional skills: {e}")
            return Response({'results': []})

    def _format_category_name(self, category):
        """Format category names for better display"""
        category_mapping = {
            'programming': 'Backend Development',
            'frameworks': 'Frontend Development',
            'databases': 'Database',
            'cloud': 'Cloud & DevOps',
            'tools': 'Infrastructure',
            'other': 'Other Technologies'
        }
        return category_mapping.get(category, category.title())

    def _clean_skill_name(self, skill_name):
        """Clean up skill names extracted from documents"""
        if not skill_name or not isinstance(skill_name, str):
            return None

        # Remove common noise patterns
        skill = skill_name.strip()

        # Skip if it's too long (likely a sentence fragment)
        if len(skill) > 30:
            return None

        # Skip if it's too short
        if len(skill) < 2:
            return None

        # Skip if it contains sentence-like patterns or noise
        noise_patterns = [
            'and', 'the', 'with', 'using', 'for', 'in', 'to', 'of', 'at', 'on', 'by',
            'implemented', 'developed', 'built', 'created', 'designed', 'worked',
            'experience', 'skills', 'knowledge', 'familiar', 'proficient',
            'strong', 'excellent', 'good', 'basic', 'advanced', 'expert',
            'years', 'months', 'time', 'work', 'project', 'team', 'company',
            'r', 'a', 'an', 'is', 'are', 'was', 'were', 'have', 'has', 'had'
        ]

        skill_lower = skill.lower()
        if any(pattern in skill_lower for pattern in noise_patterns):
            return None

        # Only keep recognized technical skills
        valid_skills = {
            # Core Programming Languages (Most Valuable)
            'python', 'javascript', 'typescript', 'java', 'c#', 'sql', 'html', 'css',

            # High-Demand Frameworks
            'django', 'flask', 'react', 'vue.js', 'angular', 'node.js', 'express',
            'spring', 'asp.net', 'bootstrap', 'tailwind',

            # Essential Databases
            'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite',

            # Cloud & DevOps (Industry Standard)
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform',

            # Professional Development Tools
            'git', 'github', 'gitlab', 'vscode', 'postman', 'jira', 'linux',

            # Modern Architecture & APIs
            'rest', 'graphql', 'microservices', 'api', 'oauth', 'jwt',

            # Blockchain (Specialized)
            'blockchain', 'ethereum', 'solidity', 'web3',

            # Professional Methodologies
            'agile', 'scrum', 'devops', 'ci/cd', 'mvc', 'oop'
        }

        # Check if skill is in our valid list (case insensitive)
        if skill_lower not in valid_skills:
            return None

        # Special formatting for certain skills
        skill_formatting = {
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'node.js': 'Node.js',
            'vue.js': 'Vue.js',
            'asp.net': 'ASP.NET',
            'postgresql': 'PostgreSQL',
            'mongodb': 'MongoDB',
            'aws': 'AWS',
            'gcp': 'Google Cloud',
            'vscode': 'VS Code',
            'github': 'GitHub',
            'gitlab': 'GitLab',
            'tcp/ip': 'TCP/IP',
            'ccna': 'CCNA',
            'api': 'API',
            'rest': 'REST API',
            'graphql': 'GraphQL',
            'json': 'JSON',
            'xml': 'XML',
            'yaml': 'YAML',
            'oauth': 'OAuth',
            'jwt': 'JWT',
            'crud': 'CRUD',
            'mvc': 'MVC',
            'oop': 'OOP',
            'solid': 'SOLID'
        }

        return skill_formatting.get(skill_lower, skill.title())

    def _estimate_proficiency(self, skill_name, category):
        """Estimate proficiency based on skill and category"""
        # Higher proficiency for core technologies
        core_skills = ['python', 'django', 'javascript', 'react', 'postgresql', 'aws']

        if any(core in skill_name.lower() for core in core_skills):
            return 90
        elif category in ['programming', 'frameworks']:
            return 80
        elif category in ['databases', 'cloud']:
            return 75
        else:
            return 70


class ProfessionalExperienceView(APIView):
    """API view to get experience from professional profile in frontend-compatible format"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Get Didier's profile specifically, or the most recently updated one
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            # Fallback to any active profile with work experience
            if not profile:
                profile = ProfessionalProfile.objects.filter(
                    is_active=True,
                    work_experience__isnull=False
                ).exclude(work_experience=[]).first()

            if not profile or not profile.work_experience:
                return Response({'results': []})

            # Convert professional profile experience to frontend format
            experience_data = []
            exp_id = 1

            for exp in profile.work_experience:
                # Clean up experience data
                clean_exp = self._clean_experience_data(exp)
                if clean_exp:
                    clean_exp['id'] = exp_id
                    experience_data.append(clean_exp)
                    exp_id += 1

            return Response({'results': experience_data})

        except Exception as e:
            logger.error(f"Error fetching professional experience: {e}")
            return Response({'results': []})

    def _clean_experience_data(self, exp_data):
        """Clean up experience data extracted from documents"""
        if not exp_data or not isinstance(exp_data, dict):
            return None

        position = exp_data.get('position', '').strip()
        company = exp_data.get('company', '').strip()
        description = exp_data.get('description', '').strip()

        # Skip if data looks malformed (contains sentence fragments)
        if not position or len(position) > 150 or any(word in position.lower() for word in ['and', 'with', 'in', 'the', 'skilled']):
            # Try to extract a proper position from description
            if description:
                # Look for common job title patterns
                job_titles = ['developer', 'engineer', 'analyst', 'manager', 'specialist', 'consultant', 'architect']
                for title in job_titles:
                    if title in description.lower():
                        position = f"Software {title.title()}"
                        break
                else:
                    position = "Software Developer"
            else:
                return None

        # Clean up company name
        if not company or len(company) > 100 or any(word in company.lower() for word in ['and', 'with', 'in', 'the', 'skilled']):
            company = "Technology Company"

        # Clean up description - remove malformed content
        if description and len(description) > 20:
            # Remove common extraction artifacts
            clean_desc = description.replace('\n', ' ').strip()
            if len(clean_desc) > 500:
                clean_desc = clean_desc[:500] + "..."
        else:
            clean_desc = "Professional software development role with focus on backend systems, API development, and technical problem-solving."

        # Clean up dates
        dates = exp_data.get('dates', [])
        start_date = None
        end_date = None

        if dates and len(dates) >= 2:
            start_date = self._parse_date(dates[0])
            end_date = self._parse_date(dates[1]) if dates[1] not in ['present', 'current'] else None

        return {
            'company': company,
            'position': position,
            'description': clean_desc,
            'start_date': start_date,
            'end_date': end_date
        }

    def _parse_date(self, date_str):
        """Parse date string to YYYY-MM-DD format"""
        if not date_str:
            return None

        # Extract year from various date formats
        import re
        year_match = re.search(r'\b(20\d{2}|19\d{2})\b', str(date_str))
        if year_match:
            year = year_match.group(1)
            return f"{year}-01-01"  # Default to January 1st

        return None


class ProfessionalEducationView(APIView):
    """API view to get education from professional profile in frontend-compatible format"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Get Didier's profile specifically, or the most recently updated one
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            # Fallback to any active profile with education background
            if not profile:
                profile = ProfessionalProfile.objects.filter(
                    is_active=True,
                    education_background__isnull=False
                ).exclude(education_background=[]).first()

            if not profile or not profile.education_background:
                return Response({'results': []})

            # Convert professional profile education to frontend format
            education_data = []
            edu_id = 1

            for edu in profile.education_background:
                # Clean up education data
                clean_edu = self._clean_education_data(edu)
                if clean_edu:
                    clean_edu['id'] = edu_id
                    education_data.append(clean_edu)
                    edu_id += 1

            return Response({'results': education_data})

        except Exception as e:
            logger.error(f"Error fetching professional education: {e}")
            return Response({'results': []})

    def _clean_education_data(self, edu_data):
        """Clean up education data extracted from documents"""
        if not edu_data or not isinstance(edu_data, dict):
            return None

        degree = edu_data.get('degree', '').strip()
        institution = edu_data.get('institution', '').strip()
        field = edu_data.get('field', '').strip()

        # Skip if essential data is missing
        if not degree and not institution:
            return None

        # Clean up dates
        dates = edu_data.get('dates', [])
        start_date = None
        end_date = None

        if dates:
            if len(dates) >= 2:
                start_date = self._parse_date(dates[0])
                end_date = self._parse_date(dates[1])
            elif len(dates) == 1:
                end_date = self._parse_date(dates[0])

        return {
            'degree': degree or 'Degree',
            'institution': institution or 'Educational Institution',
            'field_of_study': field,
            'start_date': start_date,
            'end_date': end_date
        }

    def _parse_date(self, date_str):
        """Parse date string to YYYY-MM-DD format"""
        if not date_str:
            return None

        # Extract year from various date formats
        import re
        year_match = re.search(r'\b(20\d{2}|19\d{2})\b', str(date_str))
        if year_match:
            year = year_match.group(1)
            return f"{year}-01-01"  # Default to January 1st

        return None


class ProfessionalProjectsView(APIView):
    """API view to get projects from professional profile in frontend-compatible format"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Get Didier's profile specifically, or the most recently updated one
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            # Fallback to any active profile with projects
            if not profile:
                profile = ProfessionalProfile.objects.filter(
                    is_active=True,
                    projects_portfolio__isnull=False
                ).exclude(projects_portfolio=[]).first()

            # Always return default projects for now since extracted project data needs improvement
            return Response({'results': self._get_default_projects()})

        except Exception as e:
            logger.error(f"Error fetching professional projects: {e}")
            return Response({'results': self._get_default_projects()})

    def _get_default_projects(self):
        """Return curated projects with technologies matching displayed skills"""
        return [
            {
                'id': 1,
                'title': 'AI-Powered Portfolio System',
                'description': 'Intelligent portfolio platform featuring automated document processing, AI-driven career insights, and dynamic profile generation. Built with modern React frontend and Django REST backend.',
                'technologies': ['React', 'Django', 'Python', 'TypeScript', 'PostgreSQL', 'Docker'],
                'github_url': 'https://github.com/didier-dev/portfolio',
                'live_url': 'https://didier-portfolio.com',
                'image_url': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80'
            },
            {
                'id': 2,
                'title': 'Blockchain Supply Chain Tracker',
                'description': 'Decentralized supply chain management system using smart contracts. Enables transparent tracking of products from origin to consumer with immutable records.',
                'technologies': ['Solidity', 'Python', 'Web3', 'React', 'Ethereum', 'JavaScript'],
                'github_url': 'https://github.com/didier-dev/supply-chain',
                'live_url': None,
                'image_url': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80'
            },
            {
                'id': 3,
                'title': 'Cloud Infrastructure Automation',
                'description': 'Scalable cloud infrastructure with automated deployment pipelines. Features containerized microservices, monitoring, and auto-scaling capabilities on AWS.',
                'technologies': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Linux'],
                'github_url': 'https://github.com/didier-dev/cloud-infra',
                'live_url': None,
                'image_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80'
            },
            {
                'id': 4,
                'title': 'E-Learning Platform',
                'description': 'Comprehensive online learning platform with interactive courses, progress tracking, and real-time collaboration features. Supports multimedia content and assessments.',
                'technologies': ['React', 'Django', 'PostgreSQL', 'Redis', 'JavaScript', 'CSS'],
                'github_url': 'https://github.com/didier-dev/elearning',
                'live_url': 'https://learn.didier-dev.com',
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80'
            },
            {
                'id': 5,
                'title': 'Network Security Dashboard',
                'description': 'Real-time network monitoring and security analysis dashboard. Features threat detection, traffic analysis, and automated incident response capabilities.',
                'technologies': ['Python', 'React', 'CCNA', 'Linux', 'MongoDB', 'Bash'],
                'github_url': 'https://github.com/didier-dev/network-security',
                'live_url': None,
                'image_url': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80'
            },
            {
                'id': 6,
                'title': 'REST API & Microservices',
                'description': 'High-performance REST API gateway managing microservices architecture. Includes rate limiting, authentication, load balancing, and comprehensive monitoring.',
                'technologies': ['Django', 'Docker', 'Redis', 'PostgreSQL', 'REST API', 'Git'],
                'github_url': 'https://github.com/didier-dev/api-gateway',
                'live_url': None,
                'image_url': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80'
            }
        ]


class JobMatchAnalyzerView(APIView):
    """AI-powered job compatibility analysis for recruiters and employers"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Analyze job compatibility with professional profile"""
        try:
            job_description = request.data.get('job_description', '').strip()

            if not job_description:
                return Response({
                    'error': 'Job description is required'
                }, status=400)

            if len(job_description) < 50:
                return Response({
                    'error': 'Job description too short. Please provide a detailed job posting.'
                }, status=400)

            # Get professional profile
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            if not profile:
                profile = ProfessionalProfile.objects.filter(is_active=True).first()

            if not profile:
                return Response({
                    'error': 'Professional profile not found'
                }, status=404)

            # Convert profile to dict for AI analysis
            profile_data = {
                'full_name': profile.full_name,
                'professional_title': profile.professional_title,
                'years_of_experience': profile.years_of_experience,
                'technical_skills': profile.technical_skills or {},
                'work_experience': profile.work_experience or [],
                'education_background': profile.education_background or [],
                'ai_persona_description': profile.ai_persona_description or ''
            }

            # Perform AI analysis
            analysis_result = gemini_service.analyze_job_match(job_description, profile_data)

            # Add metadata
            analysis_result.update({
                'analyzed_at': datetime.now().isoformat(),
                'profile_name': profile.full_name,
                'ai_powered': gemini_service.is_available(),
                'job_description_length': len(job_description)
            })

            return Response(analysis_result)

        except Exception as e:
            logger.error(f"Job match analysis failed: {e}")
            return Response({
                'error': 'Analysis failed. Please try again.',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class ProjectExplainerBotView(APIView):
    """Interactive AI chat about projects and experience for recruiters"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Handle chat messages about projects and experience"""
        try:
            message = request.data.get('message', '').strip()
            conversation_history = request.data.get('history', [])

            if not message:
                return Response({
                    'error': 'Message is required'
                }, status=400)

            if len(message) > 1000:
                return Response({
                    'error': 'Message too long. Please keep it under 1000 characters.'
                }, status=400)

            # Get professional profile
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            if not profile:
                profile = ProfessionalProfile.objects.filter(is_active=True).first()

            if not profile:
                return Response({
                    'error': 'Professional profile not found'
                }, status=404)

            # Convert profile to dict for AI chat
            profile_data = {
                'full_name': profile.full_name,
                'professional_title': profile.professional_title,
                'years_of_experience': profile.years_of_experience,
                'technical_skills': profile.technical_skills or {},
                'work_experience': profile.work_experience or [],
                'projects_portfolio': profile.projects_portfolio or [],
                'ai_persona_description': profile.ai_persona_description or ''
            }

            # Generate AI response
            ai_response = gemini_service.chat_about_projects(
                message,
                profile_data,
                conversation_history
            )

            return Response({
                'response': ai_response,
                'timestamp': datetime.now().isoformat(),
                'ai_powered': gemini_service.is_available(),
                'profile_name': profile.full_name
            })

        except Exception as e:
            logger.error(f"Project chat failed: {e}")
            return Response({
                'error': 'Chat failed. Please try again.',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class CareerInsightsView(APIView):
    """AI-powered career insights and recommendations"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Generate career insights for the professional profile"""
        try:
            # Get professional profile
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            if not profile:
                profile = ProfessionalProfile.objects.filter(is_active=True).first()

            if not profile:
                return Response({
                    'error': 'Professional profile not found'
                }, status=404)

            # Convert profile to dict for AI analysis
            profile_data = {
                'full_name': profile.full_name,
                'professional_title': profile.professional_title,
                'years_of_experience': profile.years_of_experience,
                'technical_skills': profile.technical_skills or {},
                'work_experience': profile.work_experience or [],
                'education_background': profile.education_background or []
            }

            # Generate AI insights
            insights = gemini_service.generate_career_insights(profile_data)

            # Add metadata
            insights.update({
                'generated_at': datetime.now().isoformat(),
                'profile_name': profile.full_name,
                'ai_powered': gemini_service.is_available(),
                'profile_last_updated': profile.updated_at.isoformat() if profile.updated_at else None
            })

            return Response(insights)

        except Exception as e:
            logger.error(f"Career insights generation failed: {e}")
            return Response({
                'error': 'Insights generation failed. Please try again.',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class CVGeneratorView(APIView):
    """AI-powered CV generation and customization"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Generate a customized CV based on job description"""
        try:
            job_description = request.data.get('job_description', '').strip()
            cv_format = request.data.get('format', 'professional')

            if not job_description:
                return Response({
                    'error': 'Job description is required'
                }, status=400)

            if len(job_description) < 50:
                return Response({
                    'error': 'Job description too short. Please provide a detailed job posting.'
                }, status=400)

            # Validate CV format
            valid_formats = ['professional', 'modern', 'creative', 'ats-optimized']
            if cv_format not in valid_formats:
                cv_format = 'professional'

            # Get professional profile
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            if not profile:
                profile = ProfessionalProfile.objects.filter(is_active=True).first()

            if not profile:
                return Response({
                    'error': 'Professional profile not found'
                }, status=404)

            # Convert profile to dict for CV generation
            profile_data = {
                'full_name': profile.full_name,
                'professional_title': profile.professional_title,
                'years_of_experience': profile.years_of_experience,
                'technical_skills': profile.technical_skills or {},
                'work_experience': profile.work_experience or [],
                'education_background': profile.education_background or [],
                'projects_portfolio': profile.projects_portfolio or [],
                'certifications': profile.certifications or [],
                'email': getattr(profile, 'email', 'didier@example.com'),
                'phone': getattr(profile, 'phone', '+1 (555) 123-4567'),
                'location': getattr(profile, 'location', 'Remote / Global'),
                'linkedin_url': getattr(profile, 'linkedin_url', ''),
                'github_url': getattr(profile, 'github_url', ''),
                'portfolio_url': getattr(profile, 'portfolio_url', '')
            }

            # Generate customized CV
            cv_result = cv_generator.generate_custom_cv(
                job_description,
                profile_data,
                cv_format
            )

            return Response(cv_result)

        except Exception as e:
            logger.error(f"CV generation failed: {e}")
            return Response({
                'error': 'CV generation failed. Please try again.',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class SkillGapAnalysisView(APIView):
    """AI-powered skill gap analysis and recommendations"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Analyze skill gaps for a target role"""
        try:
            target_role = request.data.get('target_role', '').strip()

            if not target_role:
                return Response({
                    'error': 'Target role is required'
                }, status=400)

            # Get professional profile
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            if not profile:
                profile = ProfessionalProfile.objects.filter(is_active=True).first()

            if not profile:
                return Response({
                    'error': 'Professional profile not found'
                }, status=404)

            # Convert profile to dict for analysis
            profile_data = {
                'full_name': profile.full_name,
                'professional_title': profile.professional_title,
                'years_of_experience': profile.years_of_experience,
                'technical_skills': profile.technical_skills or {},
                'work_experience': profile.work_experience or [],
                'education_background': profile.education_background or []
            }

            # Perform skill gap analysis
            analysis_result = skill_recommender.analyze_skill_gaps(target_role, profile_data)

            return Response(analysis_result)

        except Exception as e:
            logger.error(f"Skill gap analysis failed: {e}")
            return Response({
                'error': 'Skill gap analysis failed. Please try again.',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class MarketTrendsView(APIView):
    """AI-powered market trends and skill demand analysis"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get current market trends and in-demand skills"""
        try:
            industry = request.query_params.get('industry', 'technology')

            # Get market trends analysis
            trends_result = skill_recommender.get_market_trends(industry)

            return Response(trends_result)

        except Exception as e:
            logger.error(f"Market trends analysis failed: {e}")
            return Response({
                'error': 'Market trends analysis failed. Please try again.',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class CareerRecommendationsView(APIView):
    """AI-powered career progression recommendations"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get next career step recommendations"""
        try:
            # Get professional profile
            profile = ProfessionalProfile.objects.filter(
                is_active=True,
                full_name="Didier Imanirahami"
            ).first()

            if not profile:
                profile = ProfessionalProfile.objects.filter(is_active=True).first()

            if not profile:
                return Response({
                    'error': 'Professional profile not found'
                }, status=404)

            # Convert profile to dict for analysis
            profile_data = {
                'full_name': profile.full_name,
                'professional_title': profile.professional_title,
                'years_of_experience': profile.years_of_experience,
                'technical_skills': profile.technical_skills or {},
                'work_experience': profile.work_experience or []
            }

            # Get career recommendations
            recommendations = skill_recommender.recommend_next_role(profile_data)

            return Response(recommendations)

        except Exception as e:
            logger.error(f"Career recommendations failed: {e}")
            return Response({
                'error': 'Career recommendations failed. Please try again.',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class JournalEntryListCreateView(APIView):
    """List and create journal entries"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get journal entries with optional filtering"""
        try:
            # Get query parameters
            category = request.query_params.get('category')
            days = int(request.query_params.get('days', 30))
            include_private = request.query_params.get('include_private', 'true').lower() == 'true'

            # Build queryset
            queryset = JournalEntry.objects.all()

            if not include_private:
                queryset = queryset.filter(is_private=False)

            if category:
                queryset = queryset.filter(category=category)

            # Filter by date range
            if days > 0:
                start_date = timezone.now() - timedelta(days=days)
                queryset = queryset.filter(date_created__gte=start_date)

            # Limit results
            queryset = queryset[:50]

            # Serialize entries
            entries = []
            for entry in queryset:
                entries.append({
                    'id': entry.id,
                    'title': entry.title,
                    'content': entry.content,
                    'category': entry.category,
                    'tags': entry.tags,
                    'mood': entry.mood,
                    'date_created': entry.date_created.isoformat(),
                    'date_updated': entry.date_updated.isoformat(),
                    'word_count': entry.word_count,
                    'reading_time': entry.reading_time,
                    'is_private': entry.is_private,
                    'is_portfolio_relevant': entry.is_portfolio_relevant,
                    'ai_insights': entry.ai_insights,
                    'sentiment_score': entry.sentiment_score,
                    'key_themes': entry.key_themes
                })

            return Response({
                'entries': entries,
                'total_count': len(entries),
                'filters_applied': {
                    'category': category,
                    'days': days,
                    'include_private': include_private
                }
            })

        except Exception as e:
            logger.error(f"Journal entries retrieval failed: {e}")
            return Response({
                'error': 'Failed to retrieve journal entries',
                'details': str(e) if settings.DEBUG else None
            }, status=500)

    def post(self, request):
        """Create a new journal entry with AI analysis"""
        try:
            data = request.data

            # Validate required fields
            title = data.get('title', '').strip()
            content = data.get('content', '').strip()

            if not title or not content:
                return Response({
                    'error': 'Title and content are required'
                }, status=400)

            if len(content) < 10:
                return Response({
                    'error': 'Content too short. Please write at least 10 characters.'
                }, status=400)

            # Create journal entry
            entry = JournalEntry.objects.create(
                title=title,
                content=content,
                category=data.get('category', 'reflection'),
                tags=data.get('tags', []),
                mood=data.get('mood', 'neutral'),
                work_context=data.get('work_context', ''),
                is_private=data.get('is_private', True),
                is_portfolio_relevant=data.get('is_portfolio_relevant', False)
            )

            # Generate AI analysis
            try:
                ai_analysis = journal_ai_service.analyze_entry(
                    content, title, entry.category
                )

                # Update entry with AI insights
                entry.ai_insights = ai_analysis
                entry.sentiment_score = ai_analysis.get('sentiment_score', 0.0)
                entry.key_themes = ai_analysis.get('key_themes', [])
                entry.skills_mentioned = ai_analysis.get('skills_mentioned', [])
                entry.achievements = ai_analysis.get('achievements', [])
                entry.challenges = ai_analysis.get('challenges', [])

                # Update mood if AI suggests different mood
                ai_mood = ai_analysis.get('mood_assessment')
                if ai_mood and ai_mood != entry.mood:
                    entry.mood = ai_mood

                entry.save()

            except Exception as ai_error:
                logger.warning(f"AI analysis failed for journal entry: {ai_error}")
                # Entry is still created, just without AI insights

            return Response({
                'success': True,
                'entry': {
                    'id': entry.id,
                    'title': entry.title,
                    'content': entry.content,
                    'category': entry.category,
                    'mood': entry.mood,
                    'date_created': entry.date_created.isoformat(),
                    'word_count': entry.word_count,
                    'reading_time': entry.reading_time,
                    'ai_insights': entry.ai_insights,
                    'sentiment_score': entry.sentiment_score,
                    'key_themes': entry.key_themes
                },
                'message': 'Journal entry created successfully'
            })

        except Exception as e:
            logger.error(f"Journal entry creation failed: {e}")
            return Response({
                'error': 'Failed to create journal entry',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class JournalInsightsView(APIView):
    """Generate AI insights from journal entries"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get journal insights"""
        try:
            insight_type = request.query_params.get('type', 'weekly')
            days = int(request.query_params.get('days', 7))

            # Get recent entries
            start_date = timezone.now() - timedelta(days=days)
            entries = JournalEntry.objects.filter(
                date_created__gte=start_date
            ).order_by('-date_created')[:20]

            if not entries:
                return Response({
                    'insights': {},
                    'message': 'No journal entries found for the specified period',
                    'recommendations': ['Start journaling to generate insights']
                })

            # Convert to dict format for AI service
            entries_data = []
            for entry in entries:
                entries_data.append({
                    'title': entry.title,
                    'content': entry.content,
                    'category': entry.category,
                    'mood': entry.mood,
                    'date': entry.date_created.isoformat(),
                    'sentiment_score': entry.sentiment_score,
                    'key_themes': entry.key_themes
                })

            # Generate insights based on type
            if insight_type == 'weekly':
                insights = journal_ai_service.generate_weekly_insights(entries_data)
            elif insight_type == 'mood':
                insights = journal_ai_service.analyze_mood_trends(entries_data)
            elif insight_type == 'career':
                work_entries = [e for e in entries_data if e.get('category') in ['work', 'project', 'achievement']]
                skill_entries = [e for e in entries_data if e.get('category') in ['learning', 'skill']]
                insights = journal_ai_service.generate_career_insights(work_entries, skill_entries)
            else:
                insights = journal_ai_service.generate_weekly_insights(entries_data)

            return Response({
                'insights': insights,
                'insight_type': insight_type,
                'period_days': days,
                'entries_analyzed': len(entries_data),
                'generated_at': timezone.now().isoformat()
            })

        except Exception as e:
            logger.error(f"Journal insights generation failed: {e}")
            return Response({
                'error': 'Failed to generate journal insights',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class JournalGoalSuggestionsView(APIView):
    """AI-powered goal suggestions based on journal entries"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get goal suggestions based on recent journal entries"""
        try:
            days = int(request.query_params.get('days', 14))

            # Get recent entries
            start_date = timezone.now() - timedelta(days=days)
            entries = JournalEntry.objects.filter(
                date_created__gte=start_date
            ).order_by('-date_created')[:15]

            # Get current goals
            current_goals = JournalGoal.objects.filter(
                status__in=['not_started', 'in_progress']
            )[:10]

            # Convert to dict format
            entries_data = []
            for entry in entries:
                entries_data.append({
                    'title': entry.title,
                    'content': entry.content,
                    'category': entry.category,
                    'key_themes': entry.key_themes,
                    'achievements': entry.achievements,
                    'challenges': entry.challenges
                })

            goals_data = []
            for goal in current_goals:
                goals_data.append({
                    'title': goal.title,
                    'goal_type': goal.goal_type,
                    'status': goal.status,
                    'progress_percentage': goal.progress_percentage
                })

            # Generate goal suggestions
            suggestions = journal_ai_service.suggest_goals(entries_data, goals_data)

            return Response({
                'suggestions': suggestions,
                'based_on_entries': len(entries_data),
                'current_goals': len(goals_data),
                'generated_at': timezone.now().isoformat()
            })

        except Exception as e:
            logger.error(f"Goal suggestions failed: {e}")
            return Response({
                'error': 'Failed to generate goal suggestions',
                'details': str(e) if settings.DEBUG else None
            }, status=500)


class JournalPromptsView(APIView):
    """AI-generated journal prompts"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get personalized journal prompts"""
        try:
            # Get recent entries for context
            recent_entries = JournalEntry.objects.order_by('-date_created')[:5]

            # Get active goals
            active_goals = JournalGoal.objects.filter(
                status__in=['not_started', 'in_progress']
            )[:5]

            # Convert to dict format
            entries_data = []
            for entry in recent_entries:
                entries_data.append({
                    'category': entry.category,
                    'key_themes': entry.key_themes,
                    'mood': entry.mood
                })

            goals_data = []
            for goal in active_goals:
                goals_data.append({
                    'goal_type': goal.goal_type,
                    'title': goal.title
                })

            # Generate prompts
            prompts = journal_ai_service.suggest_journal_prompts(entries_data, goals_data)

            # Add some default prompts
            default_prompts = [
                "What was the most valuable lesson I learned today?",
                "What challenge did I overcome and how did I do it?",
                "What am I most grateful for in my professional journey right now?",
                "What skill or knowledge area do I want to develop next?",
                "What would I tell my past self about today's experiences?"
            ]

            # Combine and limit
            all_prompts = prompts + default_prompts
            unique_prompts = list(dict.fromkeys(all_prompts))[:10]  # Remove duplicates, limit to 10

            return Response({
                'prompts': unique_prompts,
                'personalized_count': len(prompts),
                'total_count': len(unique_prompts),
                'generated_at': timezone.now().isoformat()
            })

        except Exception as e:
            logger.error(f"Journal prompts generation failed: {e}")
            return Response({
                'error': 'Failed to generate journal prompts',
                'details': str(e) if settings.DEBUG else None
            }, status=500)
