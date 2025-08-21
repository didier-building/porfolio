from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ContactViewSet
from . import views_ai

router = DefaultRouter()
router.register(r'contact', ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('', include('portfolio.urls')),
    path('ai/jobmatch/analyze/', views_ai.JobMatchAnalyzeView.as_view()),
    path('ai/project-explainer/chat/', views_ai.ProjectExplainerChatView.as_view()),
]
