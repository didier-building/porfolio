from django.db import models

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
    image = models.ImageField(upload_to=project_image_path, null=True, blank=True)
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
    proficiency = models.IntegerField(default=0)  # 0-100
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
