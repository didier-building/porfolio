import logging

import requests

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django_ratelimit.decorators import ratelimit
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import NotAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from .models import (
    Project,
    Skill,
    Experience,
    Education,
    Contact,
    Technology,
    SocialProfile,
    CommsDocument,
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
)

logger = logging.getLogger(__name__)

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
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    
    @method_decorator(cache_page(60 * 30))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

# Add caching to Technology ViewSet
class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [IsAdminUserOrReadOnly]
    
    @method_decorator(cache_page(60 * 30))
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

# SocialProfile ViewSet
class SocialProfileViewSet(viewsets.ModelViewSet):
    queryset = SocialProfile.objects.all()
    serializer_class = SocialProfileSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class CommsDocumentViewSet(viewsets.ModelViewSet):
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
        # Honeypot field
        if request.data.get("website"):
            return Response({"message": "Spam detected"}, status=400)

        # CAPTCHA verification (Cloudflare Turnstile)
        token = request.data.get("captchaToken")
        secret = getattr(settings, "TURNSTILE_SECRET", None)
        if secret:
            resp = requests.post(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data={"secret": secret, "response": token},
                timeout=5,
            )
            if not resp.json().get("success"):
                return Response({"message": "Invalid CAPTCHA"}, status=400)

        response = super().create(request, *args, **kwargs)

        contact = Contact.objects.get(pk=response.data["id"])
        send_mail(
            subject=f"New Contact Form Submission: {contact.name}",
            message=(
                f"Name: {contact.name}\nEmail: {contact.email}\nMessage: {contact.message}"
            ),
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
            recipient_list=[
                getattr(settings, "ADMIN_EMAIL", settings.EMAIL_HOST_USER)
            ],
            fail_silently=False,
        )

        return response
