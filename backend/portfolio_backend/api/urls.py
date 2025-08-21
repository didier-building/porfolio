from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'skills', views.SkillViewSet, basename='skill')
router.register(r'experiences', views.ExperienceViewSet, basename='experience')
router.register(r'educations', views.EducationViewSet, basename='education')
router.register(r'comms', views.ContactViewSet, basename='contact')
router.register(r'technologies', views.TechnologyViewSet, basename='technology')
router.register(r'profiles', views.ProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('ai/chat/', views.AIChatView.as_view(), name='ai-chat'),
]
