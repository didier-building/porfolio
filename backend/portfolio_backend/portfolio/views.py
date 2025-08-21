from rest_framework import viewsets, permissions
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
from .serializers import (
    ProjectSerializer,
    TechnologySerializer,
    SkillSerializer,
    ExperienceSerializer,
    EducationSerializer,
    BlogPostSerializer,
    CommsDocumentSerializer,
    SocialProfileSerializer,
    SiteSettingSerializer,
)


class AdminWriteReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.prefetch_related('technologies').all()
    serializer_class = ProjectSerializer
    permission_classes = [AdminWriteReadOnly]


class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [AdminWriteReadOnly]


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AdminWriteReadOnly]


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AdminWriteReadOnly]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [AdminWriteReadOnly]


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [AdminWriteReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_staff:
            qs = qs.filter(published=True)
        return qs


class CommsDocumentViewSet(viewsets.ModelViewSet):
    queryset = CommsDocument.objects.all()
    serializer_class = CommsDocumentSerializer
    permission_classes = [AdminWriteReadOnly]


class SocialProfileViewSet(viewsets.ModelViewSet):
    queryset = SocialProfile.objects.all()
    serializer_class = SocialProfileSerializer
    permission_classes = [AdminWriteReadOnly]


class SiteSettingViewSet(viewsets.ModelViewSet):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer
    permission_classes = [AdminWriteReadOnly]
