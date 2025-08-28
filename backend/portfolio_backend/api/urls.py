from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    JobMatchAnalyzerView, ProjectExplainerBotView, CareerInsightsView,
    CVGeneratorView, SkillGapAnalysisView, MarketTrendsView, CareerRecommendationsView,
    JournalEntryListCreateView, JournalInsightsView, JournalGoalSuggestionsView, JournalPromptsView
)
from .health import HealthCheckView, DetailedHealthCheckView, ReadinessCheckView, LivenessCheckView
from .health import HealthCheckView, DetailedHealthCheckView, ReadinessCheckView, LivenessCheckView
from .document_views import DocumentViewSet, ExtractedDataViewSet

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'skills', views.SkillViewSet, basename='skill')
router.register(r'experiences', views.ExperienceViewSet, basename='experience')
router.register(r'educations', views.EducationViewSet, basename='education')
router.register(r'comms', views.CommsDocumentViewSet, basename='commsdocument')
router.register(r'technologies', views.TechnologyViewSet, basename='technology')
router.register(r'profiles', views.SocialProfileViewSet, basename='socialprofile')
router.register(r'contact', views.ContactViewSet, basename='contact')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'extracted-data', ExtractedDataViewSet, basename='extracteddata')
router.register(r'career-documents', views.CareerDocumentViewSet, basename='careerdocument')
router.register(r'professional-profile', views.ProfessionalProfileViewSet, basename='professionalprofile')

urlpatterns = [
    path('', include(router.urls)),
    path('ai/job-match/', JobMatchAnalyzerView.as_view(), name='job-match-analyzer'),
    path('ai/project-chat/', ProjectExplainerBotView.as_view(), name='project-explainer-bot'),
    path('ai/career-insights/', CareerInsightsView.as_view(), name='career-insights'),
    path('ai/cv-generator/', CVGeneratorView.as_view(), name='cv-generator'),
    path('ai/skill-gaps/', SkillGapAnalysisView.as_view(), name='skill-gap-analysis'),
    path('ai/market-trends/', MarketTrendsView.as_view(), name='market-trends'),
    path('ai/career-recommendations/', CareerRecommendationsView.as_view(), name='career-recommendations'),

    # Journal Endpoints
    path('journal/entries/', JournalEntryListCreateView.as_view(), name='journal-entries'),
    path('journal/insights/', JournalInsightsView.as_view(), name='journal-insights'),
    path('journal/goal-suggestions/', JournalGoalSuggestionsView.as_view(), name='journal-goal-suggestions'),
    path('journal/prompts/', JournalPromptsView.as_view(), name='journal-prompts'),

    # Health Check Endpoints
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('health/detailed/', DetailedHealthCheckView.as_view(), name='detailed-health-check'),
    path('health/ready/', ReadinessCheckView.as_view(), name='readiness-check'),
    path('health/live/', LivenessCheckView.as_view(), name='liveness-check'),
    # Professional profile endpoints for frontend
    path('profile/skills/', views.ProfessionalSkillsView.as_view(), name='professional-skills'),
    path('profile/experience/', views.ProfessionalExperienceView.as_view(), name='professional-experience'),
    path('profile/education/', views.ProfessionalEducationView.as_view(), name='professional-education'),
    path('profile/projects/', views.ProfessionalProjectsView.as_view(), name='professional-projects'),
]
