#!/bin/bash

# Deployment script for Django portfolio backend using UV
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting backend deployment..."

# Activate virtual environment
source .venv/bin/activate

# Install/update dependencies using UV
echo "Installing dependencies with UV..."
uv sync

# Navigate to project directory
cd portfolio_backend

# Collect static files
echo "Collecting static files..."
uv run manage.py collectstatic --noinput --settings=portfolio_backend.settings_prod

# Run migrations
echo "Running database migrations..."
uv run manage.py migrate --settings=portfolio_backend.settings_prod

# Restart Gunicorn (if using systemd)
echo "Restarting web server..."
sudo systemctl restart portfolio_backend

echo "Deployment completed successfully!"
