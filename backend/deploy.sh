#!/bin/bash

# Deployment script for Django portfolio backend

# Activate virtual environment
source .venv/bin/activate

# Install/update dependencies
pip install -r requirements.txt

# Navigate to project directory
cd portfolio_backend

# Collect static files
python manage.py collectstatic --noinput --settings=portfolio_backend.settings_prod

# Run migrations
python manage.py migrate --settings=portfolio_backend.settings_prod

# Restart Gunicorn or Hypercorn (if using systemd)
sudo systemctl restart portfolio_backend

# Or if using Hypercorn directly:
# hypercorn portfolio_backend.asgi:application --bind 0.0.0.0:8000 --workers 4 --settings=portfolio_backend.settings_prod

echo "Deployment completed successfully!"