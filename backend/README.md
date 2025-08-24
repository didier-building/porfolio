# Backend

## Background tasks

Celery is configured with Redis as the message broker.  Background
jobs (for example, sending contact form emails) are dispatched via
`celery` and can be processed with:

```
celery -A portfolio_backend worker -l info
```

Set `CELERY_BROKER_URL` to point at your Redis instance if different
from the default `redis://localhost:6379/0`.

## Deprecated features

Previous releases included experimental knowledge‑base and local LLM
endpoints. These components have been removed along with their heavy
ML dependencies. The backend now focuses solely on core portfolio
functionality.

