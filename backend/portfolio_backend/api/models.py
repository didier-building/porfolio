from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Technology(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Technologies"
        ordering = ['name']

class Project(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('cloud', 'Cloud/DevOps'),
        ('blockchain', 'Blockchain'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    technologies = models.ManyToManyField('Technology', related_name='projects')
    github_url = models.URLField(null=True, blank=True)
    live_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # New fields to match frontend data structure
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='web')
    image_url = models.URLField(blank=True, help_text="External image URL (e.g., Unsplash)")
    features = models.JSONField(default=list, help_text="List of project features")
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title

class Skill(models.Model):
    name = models.CharField(max_length=100)
    proficiency = models.IntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    category = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-proficiency', 'name']
    
    def __str__(self):
        return self.name

class Experience(models.Model):
    TYPE_CHOICES = [
        ('work', 'Work Experience'),
        ('education', 'Education'),
    ]
    
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    description = models.TextField(help_text="Use JSON array format for multiple bullet points")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    # New fields to match frontend structure
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='work')
    organization = models.CharField(max_length=200, blank=True, help_text="Alternative to company name")
    
    class Meta:
        ordering = ['-start_date']
    
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
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.degree} at {self.institution}"

class Contact(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('spam', 'Spam'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Enhanced contact tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    tags = models.JSONField(default=list, help_text="Tags for categorization")
    admin_notes = models.TextField(blank=True, help_text="Internal notes for admin")
    
    def __str__(self):
        return f"Message from {self.name}"
    
    class Meta:
        ordering = ['-created_at']

class SocialProfile(models.Model):
    platform = models.CharField(max_length=100)
    handle = models.CharField(max_length=100)
    url = models.URLField()

    class Meta:
        ordering = ['platform']

    def __str__(self):
        return f"{self.platform}: {self.handle}"


class PortfolioAnalytics(models.Model):
    """Simple analytics tracking for portfolio insights"""
    date = models.DateField(auto_now_add=True)
    page_views = models.IntegerField(default=0)
    contact_submissions = models.IntegerField(default=0)
    ai_chat_interactions = models.IntegerField(default=0)
    top_projects_viewed = models.JSONField(default=list, help_text="List of most viewed project IDs")
    unique_visitors = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = "Portfolio Analytics"
        verbose_name_plural = "Portfolio Analytics"
        ordering = ['-date']
        
    def __str__(self):
        return f"Analytics for {self.date}"

