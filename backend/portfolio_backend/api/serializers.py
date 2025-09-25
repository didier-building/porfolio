from rest_framework import serializers
from .models import (
    Project, Skill, Experience, Education, Contact,
    Technology, SocialProfile
)

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    technologies = serializers.StringRelatedField(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'category', 'technologies', 
            'image', 'links', 'features', 'created_at', 'updated_at'
        ]
    
    def get_image(self, obj):
        """Return image URL or default placeholder"""
        return obj.image_url if obj.image_url else "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0"
    
    def get_links(self, obj):
        """Format links to match frontend structure"""
        return {
            'github': obj.github_url,
            'live': obj.live_url
        }

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