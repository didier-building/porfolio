try:
    from celery import shared_task
except Exception:  # pragma: no cover - Celery optional
    def shared_task(func=None, *args, **kwargs):
        def decorator(f):
            def delay(*dargs, **dkwargs):
                return f(*dargs, **dkwargs)

            f.delay = delay
            return f

        if func:
            return decorator(func)
        return decorator

from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_contact_email(contact_id: int) -> None:
    from .models import Contact

    contact = Contact.objects.get(pk=contact_id)
    send_mail(
        subject=f"New Contact Form Submission: {contact.name}",
        message=(
            f"Name: {contact.name}\nEmail: {contact.email}\nMessage: {contact.message}"
        ),
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
        recipient_list=[getattr(settings, "ADMIN_EMAIL", "you@example.com")],
        fail_silently=True,
    )
