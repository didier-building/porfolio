import os

try:
    from celery import Celery
except Exception:  # pragma: no cover - Celery optional
    Celery = None

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')

if Celery:
    app = Celery('portfolio_backend')
    app.config_from_object('django.conf:settings', namespace='CELERY')
    app.autodiscover_tasks()

    @app.task(bind=True)
    def debug_task(self):
        print(f'Request: {self.request!r}')
else:  # pragma: no cover
    app = None
