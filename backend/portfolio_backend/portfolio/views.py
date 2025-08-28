from rest_framework import viewsets
from django.conf import settings
from rest_framework.throttling import AnonRateThrottle

from .models import BlogPost
from .serializers import BlogPostSerializer


# Custom throttle class for development
class DevelopmentFriendlyThrottle(AnonRateThrottle):
    """More permissive throttling for development"""
    def allow_request(self, request, view):
        if settings.DEBUG and request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True  # No throttling for read operations in development
        return super().allow_request(request, view)


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    throttle_classes = [DevelopmentFriendlyThrottle]
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostSerializer
    lookup_field = "slug"
