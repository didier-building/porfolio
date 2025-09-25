from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .health import HealthCheckView
from .views_ai_secretary import AISecretaryChatView, AISecretaryAnalyticsView

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'skills', views.SkillViewSet, basename='skill')
router.register(r'experiences', views.ExperienceViewSet, basename='experience')
router.register(r'educations', views.EducationViewSet, basename='education')
router.register(r'technologies', views.TechnologyViewSet, basename='technology')
router.register(r'profiles', views.SocialProfileViewSet, basename='socialprofile')
router.register(r'contact', views.ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # AI Secretary endpoints
    path('ai-secretary/chat/', AISecretaryChatView.as_view(), name='ai-secretary-chat'),
    path('ai-secretary/analytics/', AISecretaryAnalyticsView.as_view(), name='ai-secretary-analytics'),
]
