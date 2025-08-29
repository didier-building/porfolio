"""
API v1 URLs - Recruiter microsite focused
"""

from django.urls import path
from .public_views import FitAnalysisView, TailoredCVView, PortfolioChatView
from .admin_views import (
    AdminCareerInsightsView, AdminSkillGapAnalysisView, AdminCVGeneratorView,
    AdminJournalEntryView, AdminJournalInsightsView, AdminJournalGoalSuggestionsView,
    AdminJournalPromptsView, AdminAnalyticsView, AdminHealthView, AdminFileUploadView
)
from .analytics import AnalyticsView

app_name = 'v1'

# Public recruiter-focused endpoints
public_patterns = [
    # Core recruiter flow: JD → Fit → Contact
    path('fit/analyze/', FitAnalysisView.as_view(), name='fit-analyze'),
    path('fit/cv/', TailoredCVView.as_view(), name='tailored-cv'),
    path('chat/', PortfolioChatView.as_view(), name='portfolio-chat'),
    
    # Analytics tracking
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]

# Admin-only endpoints (moved from public API)
admin_patterns = [
    path('admin/career-insights/', AdminCareerInsightsView.as_view(), name='admin-career-insights'),
    path('admin/skill-gaps/', AdminSkillGapAnalysisView.as_view(), name='admin-skill-gaps'),
    path('admin/cv-generator/', AdminCVGeneratorView.as_view(), name='admin-cv-generator'),
    
    # Journal management
    path('admin/journal/entries/', AdminJournalEntryView.as_view(), name='admin-journal-entries'),
    path('admin/journal/insights/', AdminJournalInsightsView.as_view(), name='admin-journal-insights'),
    path('admin/journal/goals/', AdminJournalGoalSuggestionsView.as_view(), name='admin-journal-goals'),
    path('admin/journal/prompts/', AdminJournalPromptsView.as_view(), name='admin-journal-prompts'),
    
    # Admin tools
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('admin/health/', AdminHealthView.as_view(), name='admin-health'),
    path('admin/upload/', AdminFileUploadView.as_view(), name='admin-upload'),
]

urlpatterns = public_patterns + admin_patterns
