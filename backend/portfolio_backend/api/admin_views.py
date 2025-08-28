from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from .models import (
    PortfolioAnalytics, 
    JobMatchQuery, 
    AIConversation, 
    Contact, 
    Document,
    Project,
    Skill
)

@staff_member_required
def admin_dashboard(request):
    """Custom admin dashboard with portfolio analytics"""
    
    # Get date ranges
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Analytics summary
    analytics_today = PortfolioAnalytics.objects.filter(date=today).first()
    analytics_week = PortfolioAnalytics.objects.filter(date__gte=week_ago).aggregate(
        total_views=Sum('page_views'),
        total_visitors=Sum('unique_visitors'),
        total_contacts=Sum('contact_form_submissions')
    )
    
    # Recent activity
    recent_contacts = Contact.objects.order_by('-created_at')[:5]
    recent_job_matches = JobMatchQuery.objects.order_by('-created_at')[:5]
    recent_conversations = AIConversation.objects.order_by('-started_at')[:5]
    
    # Document processing status
    documents_stats = {
        'total': Document.objects.count(),
        'processed': Document.objects.filter(processed=True).count(),
        'pending': Document.objects.filter(processed=False).count(),
    }
    
    # Portfolio content stats
    content_stats = {
        'projects': Project.objects.count(),
        'skills': Skill.objects.count(),
        'documents': Document.objects.count(),
    }
    
    context = {
        'analytics_today': analytics_today,
        'analytics_week': analytics_week,
        'recent_contacts': recent_contacts,
        'recent_job_matches': recent_job_matches,
        'recent_conversations': recent_conversations,
        'documents_stats': documents_stats,
        'content_stats': content_stats,
    }
    
    return render(request, 'admin/dashboard.html', context)

@staff_member_required
def analytics_detail(request):
    """Detailed analytics view"""
    
    # Get analytics for the last 30 days
    thirty_days_ago = timezone.now().date() - timedelta(days=30)
    analytics_data = PortfolioAnalytics.objects.filter(
        date__gte=thirty_days_ago
    ).order_by('date')
    
    # Job match analytics
    job_match_stats = JobMatchQuery.objects.aggregate(
        total_queries=Count('id'),
        avg_match_score=Sum('match_score') / Count('id') if JobMatchQuery.objects.count() > 0 else 0
    )
    
    # AI conversation stats
    ai_stats = AIConversation.objects.aggregate(
        total_conversations=Count('id'),
        total_messages=Sum('messages')
    )
    
    context = {
        'analytics_data': analytics_data,
        'job_match_stats': job_match_stats,
        'ai_stats': ai_stats,
    }
    
    return render(request, 'admin/analytics_detail.html', context)