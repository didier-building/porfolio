"""
AI-Enhanced Journal Models
Professional journal with AI insights and analytics
"""

from django.db import models
from django.utils import timezone
import json


class JournalEntry(models.Model):
    """Professional journal entries with AI enhancement"""
    
    MOOD_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('neutral', 'Neutral'),
        ('challenging', 'Challenging'),
        ('difficult', 'Difficult'),
    ]
    
    CATEGORY_CHOICES = [
        ('work', 'Work & Career'),
        ('learning', 'Learning & Development'),
        ('project', 'Project Progress'),
        ('achievement', 'Achievements'),
        ('reflection', 'Personal Reflection'),
        ('goal', 'Goals & Planning'),
        ('challenge', 'Challenges & Solutions'),
        ('networking', 'Networking & Relationships'),
        ('skill', 'Skill Development'),
        ('idea', 'Ideas & Innovation'),
    ]
    
    # Basic Entry Information
    title = models.CharField(max_length=200)
    content = models.TextField()
    date_created = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(auto_now=True)
    
    # Categorization
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='reflection')
    tags = models.JSONField(default=list, blank=True)  # List of custom tags
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, default='neutral')
    
    # Professional Context
    work_context = models.CharField(max_length=100, blank=True)  # Project, company, etc.
    skills_mentioned = models.JSONField(default=list, blank=True)  # Skills referenced
    achievements = models.JSONField(default=list, blank=True)  # Achievements noted
    challenges = models.JSONField(default=list, blank=True)  # Challenges faced
    
    # AI Enhancement
    ai_insights = models.JSONField(default=dict, blank=True)  # AI-generated insights
    ai_suggestions = models.JSONField(default=list, blank=True)  # AI suggestions
    sentiment_score = models.FloatField(null=True, blank=True)  # -1 to 1
    key_themes = models.JSONField(default=list, blank=True)  # AI-extracted themes
    
    # Privacy & Sharing
    is_private = models.BooleanField(default=True)
    is_portfolio_relevant = models.BooleanField(default=False)  # Can be shown to recruiters
    
    # Metadata
    word_count = models.IntegerField(default=0)
    reading_time = models.IntegerField(default=0)  # Minutes
    
    class Meta:
        app_label = 'api'
        ordering = ['-date_created']
        indexes = [
            models.Index(fields=['date_created']),
            models.Index(fields=['category']),
            models.Index(fields=['mood']),
            models.Index(fields=['is_portfolio_relevant']),
        ]
    
    def save(self, *args, **kwargs):
        # Calculate word count and reading time
        self.word_count = len(self.content.split())
        self.reading_time = max(1, self.word_count // 200)  # ~200 words per minute
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} ({self.date_created.strftime('%Y-%m-%d')})"


class JournalGoal(models.Model):
    """Professional goals and tracking"""
    
    GOAL_TYPE_CHOICES = [
        ('career', 'Career Development'),
        ('skill', 'Skill Acquisition'),
        ('project', 'Project Completion'),
        ('learning', 'Learning Objective'),
        ('networking', 'Networking Goal'),
        ('personal', 'Personal Development'),
    ]
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    
    # Timeline
    date_created = models.DateTimeField(default=timezone.now)
    target_date = models.DateField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    
    # Progress Tracking
    progress_percentage = models.IntegerField(default=0)  # 0-100
    milestones = models.JSONField(default=list, blank=True)  # List of milestone objects
    
    # AI Enhancement
    ai_recommendations = models.JSONField(default=list, blank=True)
    difficulty_assessment = models.CharField(max_length=20, blank=True)  # easy, medium, hard
    
    # Related Entries
    related_entries = models.ManyToManyField(JournalEntry, blank=True)
    
    class Meta:
        app_label = 'api'
        ordering = ['-date_created']
    
    def __str__(self):
        return f"{self.title} ({self.status})"


class JournalInsight(models.Model):
    """AI-generated insights and analytics"""
    
    INSIGHT_TYPE_CHOICES = [
        ('weekly_summary', 'Weekly Summary'),
        ('monthly_review', 'Monthly Review'),
        ('mood_analysis', 'Mood Analysis'),
        ('progress_tracking', 'Progress Tracking'),
        ('skill_development', 'Skill Development'),
        ('achievement_summary', 'Achievement Summary'),
        ('goal_assessment', 'Goal Assessment'),
        ('career_guidance', 'Career Guidance'),
    ]
    
    insight_type = models.CharField(max_length=30, choices=INSIGHT_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    # Time Period
    date_generated = models.DateTimeField(default=timezone.now)
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Data Analysis
    entries_analyzed = models.IntegerField(default=0)
    key_metrics = models.JSONField(default=dict, blank=True)
    recommendations = models.JSONField(default=list, blank=True)
    
    # AI Metadata
    ai_confidence = models.FloatField(default=0.0)  # 0-1
    data_sources = models.JSONField(default=list, blank=True)
    
    class Meta:
        app_label = 'api'
        ordering = ['-date_generated']
        unique_together = ['insight_type', 'period_start', 'period_end']
    
    def __str__(self):
        return f"{self.get_insight_type_display()} ({self.period_start} to {self.period_end})"


class JournalTemplate(models.Model):
    """Pre-defined journal templates for different purposes"""
    
    TEMPLATE_TYPE_CHOICES = [
        ('daily_standup', 'Daily Standup'),
        ('weekly_review', 'Weekly Review'),
        ('project_retrospective', 'Project Retrospective'),
        ('learning_log', 'Learning Log'),
        ('achievement_record', 'Achievement Record'),
        ('challenge_analysis', 'Challenge Analysis'),
        ('goal_setting', 'Goal Setting'),
        ('skill_assessment', 'Skill Assessment'),
        ('career_reflection', 'Career Reflection'),
        ('networking_notes', 'Networking Notes'),
    ]
    
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=30, choices=TEMPLATE_TYPE_CHOICES)
    description = models.TextField()
    
    # Template Structure
    prompts = models.JSONField(default=list)  # List of prompt objects
    suggested_tags = models.JSONField(default=list, blank=True)
    default_category = models.CharField(max_length=20, choices=JournalEntry.CATEGORY_CHOICES)
    
    # Usage
    is_active = models.BooleanField(default=True)
    usage_count = models.IntegerField(default=0)
    
    # AI Enhancement
    ai_prompts = models.JSONField(default=list, blank=True)  # AI-specific prompts
    
    class Meta:
        app_label = 'api'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"
