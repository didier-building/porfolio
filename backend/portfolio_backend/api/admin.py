from django.contrib import admin
from .models import (
    Project,
    Skill,
    Experience,
    Education,
    Contact,
    Technology,
    SocialProfile,
    PortfolioAnalytics,
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'start_date', 'end_date', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description')
    filter_horizontal = ('technologies',)
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'description', 'category')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date')
        }),
        ('Links & Media', {
            'fields': ('github_url', 'live_url', 'image_url')
        }),
        ('Details', {
            'fields': ('technologies', 'features'),
            'description': 'Features should be a JSON list: ["Feature 1", "Feature 2"]'
        }),
    )

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'proficiency', 'category')

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('position', 'company', 'start_date', 'end_date')

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_date', 'end_date')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at', 'ip_address', 'user_agent')
    fieldsets = (
        ('Contact Info', {
            'fields': ('name', 'email', 'message')
        }),
        ('Status & Management', {
            'fields': ('status', 'tags', 'admin_notes')
        }),
        ('Technical Info', {
            'fields': ('ip_address', 'user_agent', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).exclude(status='spam')

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(SocialProfile)
class SocialProfileAdmin(admin.ModelAdmin):
    list_display = ('platform', 'handle', 'url')


@admin.register(PortfolioAnalytics)
class PortfolioAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'page_views', 'contact_submissions', 'ai_chat_interactions', 'unique_visitors')
    list_filter = ('date',)
    readonly_fields = ('date',)
    ordering = ('-date',)
