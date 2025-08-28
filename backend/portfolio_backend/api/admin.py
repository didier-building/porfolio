from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib import messages
from .models import (
    Project,
    Skill,
    Experience,
    Education,
    Contact,
    Technology,
    SocialProfile,
    CommsDocument,
    Document,
    ExtractedData,
    PortfolioAnalytics,
    JobMatchQuery,
    AIConversation,
    CareerDocument,
    ProfessionalProfile,
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date')
    filter_horizontal = ('technologies',)

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
    list_display = ('name', 'email', 'created_at', 'message_preview')
    readonly_fields = ('created_at',)
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'message')
    
    def message_preview(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_preview.short_description = "Message Preview"

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(SocialProfile)
class SocialProfileAdmin(admin.ModelAdmin):
    list_display = ('platform', 'handle', 'url')


@admin.register(CommsDocument)
class CommsDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'doc_type', 'published')
    list_filter = ('doc_type', 'published')


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'document_type', 'processed', 'uploaded_at', 'file_link')
    list_filter = ('document_type', 'processed', 'uploaded_at')
    search_fields = ('title', 'extracted_text')
    readonly_fields = ('id', 'uploaded_at', 'processed_at', 'extracted_text')
    actions = ['process_documents']
    
    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Download</a>', obj.file.url)
        return "No file"
    file_link.short_description = "File"
    
    def process_documents(self, request, queryset):
        # TODO: Implement document processing
        self.message_user(request, f"Processing {queryset.count()} documents...")
    process_documents.short_description = "Process selected documents"


@admin.register(ExtractedData)
class ExtractedDataAdmin(admin.ModelAdmin):
    list_display = ('document', 'data_type', 'confidence_score', 'approved', 'created_at')
    list_filter = ('data_type', 'approved', 'created_at')
    search_fields = ('document__title', 'content')
    readonly_fields = ('created_at',)
    actions = ['approve_data', 'reject_data']
    
    def approve_data(self, request, queryset):
        queryset.update(approved=True)
        self.message_user(request, f"Approved {queryset.count()} data entries.")
    approve_data.short_description = "Approve selected data"
    
    def reject_data(self, request, queryset):
        queryset.update(approved=False)
        self.message_user(request, f"Rejected {queryset.count()} data entries.")
    reject_data.short_description = "Reject selected data"


@admin.register(PortfolioAnalytics)
class PortfolioAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'page_views', 'unique_visitors', 'contact_form_submissions', 'job_match_queries')
    list_filter = ('date',)
    date_hierarchy = 'date'
    readonly_fields = ('date',)
    
    def has_add_permission(self, request):
        return False  # Analytics are auto-generated


@admin.register(JobMatchQuery)
class JobMatchQueryAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'match_score', 'ip_address', 'job_description_preview')
    list_filter = ('created_at', 'match_score')
    readonly_fields = ('created_at', 'ip_address')
    
    def job_description_preview(self, obj):
        return obj.job_description[:100] + "..." if len(obj.job_description) > 100 else obj.job_description
    job_description_preview.short_description = "Job Description"
    
    def has_add_permission(self, request):
        return False


@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'started_at', 'last_message_at', 'message_count', 'ip_address')
    list_filter = ('started_at', 'last_message_at')
    readonly_fields = ('session_id', 'started_at', 'last_message_at', 'ip_address')
    
    def message_count(self, obj):
        return len(obj.messages)
    message_count.short_description = "Messages"
    
    def has_add_permission(self, request):
        return False


@admin.register(CareerDocument)
class CareerDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'document_type', 'processing_status', 'is_active', 'uploaded_at', 'file_size_display')
    list_filter = ('document_type', 'processing_status', 'is_active', 'uploaded_at')
    search_fields = ('title', 'description')
    readonly_fields = ('id', 'file_size', 'file_type', 'uploaded_at', 'processed_at', 'updated_at')
    ordering = ('priority', '-uploaded_at')
    actions = ['process_documents_manually', 'rebuild_profiles_from_documents']

    fieldsets = (
        ('Document Information', {
            'fields': ('title', 'document_type', 'file', 'description', 'priority', 'is_active')
        }),
        ('Processing', {
            'fields': ('processing_status', 'processing_notes', 'extracted_text'),
            'classes': ('collapse',)
        }),
        ('Structured Data', {
            'fields': ('structured_data',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'file_size', 'file_type', 'uploaded_at', 'processed_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def file_size_display(self, obj):
        if obj.file_size:
            if obj.file_size < 1024:
                return f"{obj.file_size} B"
            elif obj.file_size < 1024 * 1024:
                return f"{obj.file_size / 1024:.1f} KB"
            else:
                return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return "Unknown"
    file_size_display.short_description = "File Size"

    def process_documents_manually(self, request, queryset):
        """Manually process selected documents"""
        from .career_document_processor import CareerDocumentProcessor

        processor = CareerDocumentProcessor()
        processed_count = 0
        failed_count = 0

        for document in queryset:
            try:
                processor.process_document(document)
                processed_count += 1
            except Exception as e:
                failed_count += 1
                messages.error(request, f"Failed to process '{document.title}': {str(e)}")

        if processed_count > 0:
            messages.success(request, f"Successfully processed {processed_count} document(s)")
        if failed_count > 0:
            messages.warning(request, f"Failed to process {failed_count} document(s)")

    process_documents_manually.short_description = "Process selected documents manually"

    def rebuild_profiles_from_documents(self, request, queryset):
        """Rebuild professional profiles from processed documents"""
        from .profile_builder import ProfessionalProfileBuilder
        from .models import ProfessionalProfile

        builder = ProfessionalProfileBuilder()

        try:
            # Get or create default profile
            profile, created = ProfessionalProfile.objects.get_or_create(
                full_name="Didier Imanirahami",
                defaults={'is_active': True}
            )

            # Rebuild profile
            profile_summary = builder.rebuild_profile(profile)

            messages.success(request, f"Successfully rebuilt profile for {profile.full_name}")
            messages.info(request, f"Profile now has {profile_summary.get('skills_count', 0)} skills and {profile_summary.get('experience_count', 0)} work experiences")

        except Exception as e:
            messages.error(request, f"Failed to rebuild profile: {str(e)}")

    rebuild_profiles_from_documents.short_description = "Rebuild professional profiles from documents"


@admin.register(ProfessionalProfile)
class ProfessionalProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'professional_title', 'years_of_experience', 'is_active', 'updated_at')
    list_filter = ('is_active', 'years_of_experience', 'updated_at')
    search_fields = ('full_name', 'professional_title', 'professional_summary')
    readonly_fields = ('created_at', 'updated_at', 'last_updated_from_documents')

    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'professional_title', 'location', 'email', 'phone')
        }),
        ('Professional Links', {
            'fields': ('linkedin_url', 'github_url', 'portfolio_url')
        }),
        ('Professional Summary', {
            'fields': ('professional_summary', 'career_objective', 'years_of_experience')
        }),
        ('Structured Career Data', {
            'fields': ('work_experience', 'education_background', 'technical_skills', 'certifications', 'achievements', 'projects_portfolio'),
            'classes': ('collapse',)
        }),
        ('AI Configuration', {
            'fields': ('ai_persona_description', 'target_roles', 'key_strengths'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('is_active', 'last_updated_from_documents', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
