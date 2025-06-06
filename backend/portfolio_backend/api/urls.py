from django.urls import path
from .views import ProjectView, SkillView, ExperienceView, EducationView, ContactView, TechnologyView
from .authentication import CustomAuthenticationBackend
from .permissions import IsAuthenticated
from . import views

urlpatterns = [
    path('projects/', ProjectView.as_view(authentication_classes=[CustomAuthenticationBackend], permission_classes=[IsAuthenticated])),
    path('skills/', SkillView.as_view()),
    path('experiences/', ExperienceView.as_view()),
    path('educations/', EducationView.as_view()),
    path('contacts/', ContactView.as_view()),
    path('technologies/', TechnologyView.as_view()),
    path('projects/<int:pk>/', views.ProjectDetail.as_view(), name='project-detail'),
]