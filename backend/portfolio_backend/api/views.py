import logging

logger = logging.getLogger(__name__)

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django_ratelimit.decorators import ratelimit
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions
from .models import Project, Skill, Experience, Education, Contact, Technology
from .serializers import (
    ProjectSerializer, SkillSerializer, ExperienceSerializer,
    EducationSerializer, ContactSerializer, TechnologySerializer
)

# Custom permission class
class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    Anyone can read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

# Optimize Project ViewSet
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.prefetch_related('technologies').all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUserOrReadOnly]  # This should allow GET requests
    filterset_fields = ['technologies']
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'end_date', 'title']
    
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

# Add rate limiting and email notifications to Contact ViewSet
class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    
    @method_decorator(ratelimit(key='ip', rate='5/h', method='POST', block=True))
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        
        # Send email notification
        contact = Contact.objects.get(pk=response.data['id'])
        send_mail(
            subject=f'New Contact Form Submission: {contact.name}',
            message=f'Name: {contact.name}\nEmail: {contact.email}\nMessage: {contact.message}',
            from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@example.com',
            recipient_list=[settings.ADMIN_EMAIL if hasattr(settings, 'ADMIN_EMAIL') else settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
        
        return response
    
    def get_permissions(self):
        if self.action == 'create':
            return []
        return [permissions.IsAdminUser()]
