import logging
from django.conf import settings
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from .models import Contact
from .serializers import ContactSerializer
from . import utils

try:
    from django_ratelimit.decorators import ratelimit
except Exception:  # fallback if ratelimit not installed
    def ratelimit(*args, **kwargs):
        def decorator(view_func):
            return view_func
        return decorator


logger = logging.getLogger(__name__)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def create(self, request, *args, **kwargs):
        if request.data.get('website'):
            # Honeypot triggered; pretend success
            return Response(status=status.HTTP_200_OK)
        token = request.data.get('token') or request.data.get('cf-turnstile-response')
        ip = request.META.get('REMOTE_ADDR')
        if not utils.verify_captcha(token, ip):
            return Response({'detail': 'Captcha failed'}, status=status.HTTP_400_BAD_REQUEST)
        response = super().create(request, *args, **kwargs)
        try:
            contact = Contact.objects.get(pk=response.data['id'])
            send_mail(
                subject=f'New Contact Form Submission: {contact.name}',
                message=f"Name: {contact.name}\nEmail: {contact.email}\nMessage: {contact.message}",
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
                recipient_list=[getattr(settings, 'ADMIN_EMAIL', '')],
                fail_silently=True,
            )
        except Exception as exc:
            logger.warning('Failed to send contact email: %s', exc)
        return response

    def get_permissions(self):
        if self.action == 'create':
            return []
        return [permissions.IsAdminUser()]
