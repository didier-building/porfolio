try:
    from .celery import app as celery_app  # type: ignore
except Exception:  # pragma: no cover - Celery optional
    celery_app = None

__all__ = ('celery_app',)
