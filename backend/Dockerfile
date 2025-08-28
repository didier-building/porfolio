FROM python:3.12-slim

# Set environment variables for production
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV ENVIRONMENT=production

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install UV
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy application code
COPY . .

# Collect static files
RUN cd portfolio_backend && uv run manage.py collectstatic --noinput

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Run application with production settings
CMD ["uv", "run", "gunicorn", "--chdir", "portfolio_backend", "portfolio_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]