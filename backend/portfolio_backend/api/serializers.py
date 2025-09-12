from rest_framework import serializers
from .models import (
    Project, Skill, Experience, Education, Contact, Technology,
    SocialProfile, CommsDocument, Document, ExtractedData,
    JobMatchQuery, CareerDocument, ProfessionalProfile
)

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'image', 'start_date', 'end_date', 
                 'technologies', 'github_url', 'live_url', 'created_at', 'updated_at']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'proficiency', 'category']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'company', 'position', 'description', 'start_date', 'end_date']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'description', 'start_date', 'end_date']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

class SocialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ['id', 'platform', 'handle', 'url']

class CommsDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommsDocument
        fields = ['id', 'title', 'doc_type', 'file']

# New serializers for document processing
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'document_type', 'file', 'processed', 
                 'uploaded_at', 'processed_at']
        read_only_fields = ['id', 'processed', 'uploaded_at', 'processed_at']

class ExtractedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtractedData
        fields = ['id', 'document', 'data_type', 'content', 'confidence_score', 
                 'approved', 'created_at']
        read_only_fields = ['id', 'created_at']

class JobMatchQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMatchQuery
        fields = ['id', 'job_description', 'match_score', 'strengths', 'gaps',
                 'recommendations', 'created_at']
        read_only_fields = ['id', 'match_score', 'strengths', 'gaps',
                           'recommendations', 'created_at']


class CareerDocumentSerializer(serializers.ModelSerializer):
    """Serializer for career document uploads and management"""
    file_size_display = serializers.SerializerMethodField()
    processing_status_display = serializers.CharField(source='get_processing_status_display', read_only=True)
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)

    class Meta:
        model = CareerDocument
        fields = [
            'id', 'title', 'document_type', 'document_type_display', 'file',
            'description', 'extracted_text', 'structured_data',
            'processing_status', 'processing_status_display', 'processing_notes',
            'file_size', 'file_size_display', 'file_type', 'is_active', 'priority',
            'uploaded_at', 'processed_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'extracted_text', 'structured_data', 'processing_status',
            'processing_notes', 'file_size', 'file_type', 'uploaded_at',
            'processed_at', 'updated_at'
        ]

    def get_file_size_display(self, obj):
        if obj.file_size:
            if obj.file_size < 1024:
                return f"{obj.file_size} B"
            elif obj.file_size < 1024 * 1024:
                return f"{obj.file_size / 1024:.1f} KB"
            else:
                return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return "Unknown"


class CareerDocumentUploadSerializer(serializers.ModelSerializer):
    """Simplified serializer for document uploads"""
    class Meta:
        model = CareerDocument
        fields = ['title', 'document_type', 'file', 'description', 'priority']


class ProfessionalProfileSerializer(serializers.ModelSerializer):
    """Serializer for professional profile data"""
    experience_summary = serializers.SerializerMethodField()
    technical_skills_summary = serializers.SerializerMethodField()

    class Meta:
        model = ProfessionalProfile
        fields = [
            'full_name', 'professional_title', 'location', 'email', 'phone',
            'linkedin_url', 'github_url', 'portfolio_url', 'professional_summary',
            'career_objective', 'years_of_experience', 'work_experience',
            'education_background', 'technical_skills', 'certifications',
            'achievements', 'projects_portfolio', 'ai_persona_description',
            'target_roles', 'key_strengths', 'is_active', 'experience_summary',
            'technical_skills_summary', 'last_updated_from_documents',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'experience_summary', 'technical_skills_summary',
            'last_updated_from_documents', 'created_at', 'updated_at'
        ]

    def get_experience_summary(self, obj):
        return obj.get_experience_summary()

    def get_technical_skills_summary(self, obj):
        return obj.get_technical_skills_summary()