from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger('api')

from .models import (
    Project, Skill, Experience, Education, Contact,
    Technology, SocialProfile
)
from .serializers import (
    ProjectSerializer, SkillSerializer, ExperienceSerializer,
    EducationSerializer, ContactSerializer, TechnologySerializer,
    SocialProfileSerializer
)

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.prefetch_related('technologies').all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'end_date', 'title']

class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['proficiency', 'name']

    @method_decorator(cache_page(60 * 30))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['position', 'company', 'description']
    ordering_fields = ['start_date', 'end_date', 'company']

class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [permissions.AllowAny]

class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [permissions.AllowAny]

class SocialProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SocialProfile.objects.all()
    serializer_class = SocialProfileSerializer
    permission_classes = [permissions.AllowAny]

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    http_method_names = ['post']
    permission_classes = [permissions.AllowAny]

    @method_decorator(ratelimit(key="ip", rate="5/m", method="POST", block=True))
    def create(self, request, *args, **kwargs):
        # Basic validation
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not request.data.get(field, '').strip():
                return Response({"message": f"{field.title()} is required"}, status=400)

        # Honeypot check
        if request.data.get("website"):
            return Response({"message": "Spam detected"}, status=400)

        # Log contact attempt
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR', 
                                    request.META.get('REMOTE_ADDR', 'unknown'))
        logger.info(f"Contact form submission from {ip_address}: {request.data.get('email')}")
        
        # Create contact
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
                # Add tracking information
                contact = serializer.save(
                    ip_address=request.META.get('HTTP_X_FORWARDED_FOR', 
                                              request.META.get('REMOTE_ADDR')),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                # Send email notification
                try:
                    send_mail(
                        subject=f"Portfolio Contact: {contact.name}",
                        message=f"Name: {contact.name}\nEmail: {contact.email}\n\nMessage:\n{contact.message}",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[settings.ADMIN_EMAIL],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Email sending failed: {e}")
                
                # Update analytics
                from datetime import date
                analytics, created = self.get_analytics_model().objects.get_or_create(
                    date=date.today(),
                    defaults={'contact_submissions': 1}
                )
                if not created:
                    analytics.contact_submissions += 1
                    analytics.save()
                
                return Response({"message": "Message sent successfully"}, status=201)
            
        return Response(serializer.errors, status=400)
    
    def get_analytics_model(self):
        from .models import PortfolioAnalytics
        return PortfolioAnalytics

