import logging
import os

import requests
import openai

logger = logging.getLogger(__name__)

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django_ratelimit.decorators import ratelimit
from django_ratelimit.core import is_ratelimited
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project, Skill, Experience, Education, Contact, Technology, Profile
from .serializers import (
    ProjectSerializer, SkillSerializer, ExperienceSerializer,
    EducationSerializer, ContactSerializer, TechnologySerializer,
    ProfileSerializer,
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


class IsAuthenticatedOrAPIKey(permissions.BasePermission):
    """Allow access to authenticated users or requests with a valid API key."""

    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return True
        api_key = request.headers.get('X-API-Key')
        expected = getattr(settings, 'AI_API_KEY', os.getenv('AI_API_KEY'))
        return bool(api_key and expected and api_key == expected)

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

# Profile ViewSet
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminUserOrReadOnly]

# Add rate limiting and email notifications to Contact ViewSet
class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def create(self, request, *args, **kwargs):
        # Honeypot field
        if request.data.get('website'):
            return Response({'message': 'Spam detected'}, status=400)

        # CAPTCHA verification (optional)
        token = request.data.get('captcha')
        secret = getattr(settings, 'RECAPTCHA_SECRET_KEY', None)
        if secret:
            resp = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data={'secret': secret, 'response': token},
                timeout=5,
            )
            if not resp.json().get('success'):
                return Response({'message': 'Invalid CAPTCHA'}, status=400)

        response = super().create(request, *args, **kwargs)

        contact = Contact.objects.get(pk=response.data['id'])
        send_mail(
            subject=f'New Contact Form Submission: {contact.name}',
            message=f'Name: {contact.name}\nEmail: {contact.email}\nMessage: {contact.message}',
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com'),
            recipient_list=[getattr(settings, 'ADMIN_EMAIL', settings.EMAIL_HOST_USER)],
            fail_silently=False,
        )

        return response

    def get_permissions(self):
        if self.action == 'create':
            return []
        return super().get_permissions()


class AIChatView(APIView):
    permission_classes = [IsAuthenticatedOrAPIKey]

    def post(self, request):
        def user_or_api_key(req):
            if req.user and req.user.is_authenticated:
                return str(req.user.pk)
            return req.headers.get('X-API-Key')

        api_key_header = request.headers.get('X-API-Key')
        expected_api_key = getattr(settings, 'AI_API_KEY', os.getenv('AI_API_KEY'))
        authenticated = request.user.is_authenticated or (
            api_key_header and expected_api_key and api_key_header == expected_api_key
        )

        if authenticated:
            limited = is_ratelimited(
                request,
                group='ai-chat-auth',
                key=user_or_api_key,
                rate='20/m',
                method='POST',
                increment=True,
            )
        else:
            limited = is_ratelimited(
                request,
                group='ai-chat-anon',
                key='ip',
                rate='5/m',
                method='POST',
                increment=True,
            )

        if limited:
            return Response({'detail': 'Too many requests'}, status=429)

        if not authenticated:
            return Response(
                {'detail': 'Authentication credentials were not provided.'},
                status=401,
            )

        prompt = request.data.get('prompt', '')
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            return Response({'response': f'Echo: {prompt}'})
        client = openai.OpenAI(api_key=openai_api_key)
        completion = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[{'role': 'user', 'content': prompt}],
        )
        text = completion.choices[0].message.content
        return Response({'response': text})
