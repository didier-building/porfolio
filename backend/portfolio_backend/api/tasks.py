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


@shared_task
def process_career_document(document_id: str) -> dict:
    """Process uploaded career document"""
    import logging
    from django.utils import timezone

    logger = logging.getLogger(__name__)

    try:
        from .career_document_processor import CareerDocumentProcessor
        from .models import CareerDocument

        document = CareerDocument.objects.get(id=document_id)
        processor = CareerDocumentProcessor()

        logger.info(f"Starting processing for document: {document_id}")
        structured_data = processor.process_document(document)

        logger.info(f"Successfully processed document: {document_id}")

        # Trigger profile rebuild if this is a high-priority document
        if document.priority <= 2 and document.document_type in ['master_cv', 'certificate', 'transcript']:
            rebuild_professional_profile.delay()

        return structured_data

    except Exception as e:
        logger.error(f"Failed to process career document {document_id}: {e}")
        raise


@shared_task
def rebuild_professional_profile(profile_id: int = None) -> dict:
    """Rebuild professional profile from processed documents"""
    import logging

    logger = logging.getLogger(__name__)

    try:
        from .profile_builder import ProfessionalProfileBuilder
        from .models import ProfessionalProfile

        if profile_id:
            profile = ProfessionalProfile.objects.get(id=profile_id)
        else:
            # Get or create the default profile
            profile, created = ProfessionalProfile.objects.get_or_create(
                full_name="Didier Imanirahami",
                defaults={'is_active': True}
            )

        builder = ProfessionalProfileBuilder()
        updated_profile = builder.rebuild_profile(profile)

        logger.info(f"Successfully rebuilt professional profile: {profile.id}")
        return updated_profile

    except Exception as e:
        logger.error(f"Failed to rebuild professional profile: {e}")
        raise


@shared_task
def batch_process_documents() -> int:
    """Process all pending career documents"""
    import logging

    logger = logging.getLogger(__name__)

    try:
        from .models import CareerDocument

        pending_documents = CareerDocument.objects.filter(
            processing_status='pending',
            is_active=True
        ).order_by('priority', 'uploaded_at')

        processed_count = 0
        for document in pending_documents[:10]:  # Process max 10 at a time
            try:
                process_career_document.delay(str(document.id))
                processed_count += 1
            except Exception as e:
                logger.error(f"Failed to queue processing for document {document.id}: {e}")

        logger.info(f"Queued processing for {processed_count} documents")
        return processed_count

    except Exception as e:
        logger.error(f"Failed to batch process documents: {e}")
        raise
