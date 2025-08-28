from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

def project_image_path(instance, filename):
    """Generate file path for project images"""
    return f'projects/{filename}'

class Technology(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Technologies"
        ordering = ['name']  # Add default ordering

class Project(models.Model):
    """
    Represents a portfolio project with details about technologies used,
    timeline, and links to live demo and source code.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.FileField(upload_to=project_image_path, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    technologies = models.ManyToManyField('Technology', related_name='projects')
    github_url = models.URLField(null=True, blank=True)
    live_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title

class Skill(models.Model):
    name = models.CharField(max_length=100)
    proficiency = models.IntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )  # 0-100
    category = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-proficiency', 'name']  # Order by proficiency (high to low), then name
    
    def __str__(self):
        return self.name

class Experience(models.Model):
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['-start_date']  # Order by start date, newest first
    
    def __str__(self):
        return f"{self.position} at {self.company}"

class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Education"
        ordering = ['-start_date']  # Order by start date, newest first
    
    def __str__(self):
        return f"{self.degree} at {self.institution}"

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.name}"
    
    class Meta:
        ordering = ['-created_at']  # Add default ordering


class SocialProfile(models.Model):
    platform = models.CharField(max_length=100)
    handle = models.CharField(max_length=100)
    url = models.URLField()

    class Meta:
        ordering = ['platform']

    def __str__(self):
        return f"{self.platform}: {self.handle}"


def comms_document_path(instance, filename):
    return f"comms/{filename}"


class CommsDocument(models.Model):
    DOC_TYPES = [
        ('cv', 'CV'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    doc_type = models.CharField(max_length=50, choices=DOC_TYPES)
    file = models.FileField(upload_to=comms_document_path)
    published = models.BooleanField(default=False)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


# New models for document processing and analytics
class Document(models.Model):
    DOCUMENT_TYPES = [
        ('cv', 'CV/Resume'),
        ('cover_letter', 'Cover Letter'),
        ('certificate', 'Certificate'),
        ('project_doc', 'Project Documentation'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    extracted_text = models.TextField(blank=True)
    processed = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_document_type_display()})"


class ExtractedData(models.Model):
    DATA_TYPES = [
        ('personal_info', 'Personal Information'),
        ('experience', 'Work Experience'),
        ('education', 'Education'),
        ('skill', 'Skill'),
        ('project', 'Project'),
        ('certificate', 'Certificate'),
        ('achievement', 'Achievement'),
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='extracted_data')
    data_type = models.CharField(max_length=20, choices=DATA_TYPES)
    content = models.JSONField()
    confidence_score = models.FloatField(default=0.0)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-confidence_score']


class PortfolioAnalytics(models.Model):
    date = models.DateField(default=timezone.now)
    page_views = models.IntegerField(default=0)
    unique_visitors = models.IntegerField(default=0)
    contact_form_submissions = models.IntegerField(default=0)
    project_views = models.IntegerField(default=0)
    resume_downloads = models.IntegerField(default=0)
    job_match_queries = models.IntegerField(default=0)
    ai_chat_sessions = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ['date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Analytics for {self.date}"


class JobMatchQuery(models.Model):
    job_description = models.TextField()
    match_score = models.FloatField()
    strengths = models.JSONField(default=list)
    gaps = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Job Match Query - {self.match_score}% match"


class AIConversation(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4)
    messages = models.JSONField(default=list)
    ip_address = models.GenericIPAddressField()
    started_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"AI Conversation {self.session_id}"


# Professional Career Document Models
def career_document_path(instance, filename):
    """Generate file path for career documents"""
    return f'career_documents/{instance.document_type}/{filename}'


class CareerDocument(models.Model):
    """Enhanced model for professional career documents"""
    DOCUMENT_TYPES = [
        ('master_cv', 'Master CV/Resume'),
        ('cover_letter', 'Cover Letter Template'),
        ('certificate', 'Professional Certificate'),
        ('transcript', 'Academic Transcript'),
        ('portfolio', 'Portfolio Document'),
        ('recommendation', 'Letter of Recommendation'),
        ('project_doc', 'Project Documentation'),
        ('achievement', 'Achievement/Award Document'),
        ('other', 'Other Career Document'),
    ]

    PROCESSING_STATUS = [
        ('pending', 'Pending Processing'),
        ('processing', 'Currently Processing'),
        ('completed', 'Processing Completed'),
        ('failed', 'Processing Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to=career_document_path)
    description = models.TextField(blank=True, help_text="Brief description of the document")

    # Processing fields
    extracted_text = models.TextField(blank=True)
    structured_data = models.JSONField(default=dict, help_text="Processed structured data from document")
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')
    processing_notes = models.TextField(blank=True)

    # Metadata
    file_size = models.PositiveIntegerField(null=True, blank=True)
    file_type = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True, help_text="Include in AI profile generation")
    priority = models.PositiveIntegerField(default=1, help_text="Priority for AI processing (1=highest)")

    # Timestamps
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['priority', '-uploaded_at']
        verbose_name = "Career Document"
        verbose_name_plural = "Career Documents"

    def __str__(self):
        return f"{self.title} ({self.get_document_type_display()})"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
            self.file_type = self.file.name.split('.')[-1].lower() if '.' in self.file.name else ''
        super().save(*args, **kwargs)


class ProfessionalProfile(models.Model):
    """Structured professional profile data for AI processing"""

    # Personal Information
    full_name = models.CharField(max_length=200, default="Didier Imanirahami")
    professional_title = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)

    # Professional Summary
    professional_summary = models.TextField(blank=True, help_text="Executive summary for recruiters")
    career_objective = models.TextField(blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)

    # Structured Career Data (JSON fields for flexibility)
    work_experience = models.JSONField(default=list, help_text="Structured work experience data")
    education_background = models.JSONField(default=list, help_text="Educational qualifications")
    technical_skills = models.JSONField(default=dict, help_text="Technical skills with proficiency levels")
    certifications = models.JSONField(default=list, help_text="Professional certifications")
    achievements = models.JSONField(default=list, help_text="Quantified professional achievements")
    projects_portfolio = models.JSONField(default=list, help_text="Detailed project information")

    # AI Configuration
    ai_persona_description = models.TextField(
        blank=True,
        help_text="How the AI should represent this professional profile"
    )
    target_roles = models.JSONField(default=list, help_text="Target job roles for AI optimization")
    key_strengths = models.JSONField(default=list, help_text="Top professional strengths to highlight")

    # Metadata
    is_active = models.BooleanField(default=True)
    last_updated_from_documents = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Professional Profile"
        verbose_name_plural = "Professional Profiles"

    def __str__(self):
        return f"Professional Profile: {self.full_name}"

    def get_experience_summary(self):
        """Get formatted experience summary"""
        if not self.work_experience:
            return "No experience data available"

        total_roles = len(self.work_experience)
        companies = [exp.get('company', '') for exp in self.work_experience if exp.get('company')]
        unique_companies = len(set(companies))

        return f"{total_roles} roles across {unique_companies} companies, {self.years_of_experience} years total experience"

    def get_technical_skills_summary(self):
        """Get formatted technical skills summary"""
        if not self.technical_skills:
            return "No technical skills data available"

        skills_by_category = {}
        for category, skills in self.technical_skills.items():
            if isinstance(skills, list):
                skills_by_category[category] = len(skills)
            elif isinstance(skills, dict):
                skills_by_category[category] = len(skills.keys())

        return skills_by_category
