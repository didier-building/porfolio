# Backend

## Additional Dependencies

The backend uses several packages for knowledge base features:

- **faiss-cpu** – efficient vector similarity search.
- **sentence-transformers** – generates text embeddings for search and NLP tasks.
- **pdfplumber** – extracts text and metadata from PDF files.
- **Unidecode** – normalizes Unicode text to ASCII.

## Background tasks

Celery is configured with Redis as the message broker.  Background
jobs (for example, sending contact form emails) are dispatched via
`celery` and can be processed with:

```
celery -A portfolio_backend worker -l info
```

Set `CELERY_BROKER_URL` to point at your Redis instance if different
from the default `redis://localhost:6379/0`.

## AI features

Interactive AI endpoints now rely on Google's Gemini models via the
`google-generativeai` SDK.  Provide a `GOOGLE_API_KEY` environment
variable to enable these features.

