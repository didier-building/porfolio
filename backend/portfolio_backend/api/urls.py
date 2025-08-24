from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'skills', views.SkillViewSet, basename='skill')
router.register(r'experiences', views.ExperienceViewSet, basename='experience')
router.register(r'educations', views.EducationViewSet, basename='education')
router.register(r'comms', views.CommsDocumentViewSet, basename='commsdocument')
router.register(r'technologies', views.TechnologyViewSet, basename='technology')
router.register(r'profiles', views.SocialProfileViewSet, basename='socialprofile')
router.register(r'contact', views.ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]
