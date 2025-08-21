from rest_framework import serializers
from .models import (
    Project,
    Technology,
    Skill,
    Experience,
    Education,
    BlogPost,
    CommsDocument,
    SocialProfile,
    SiteSetting,
)


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    technologies = serializers.PrimaryKeyRelatedField(queryset=Technology.objects.all(), many=True)

    class Meta:
        model = Project
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'


class CommsDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommsDocument
        fields = '__all__'


class SocialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = '__all__'


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'
