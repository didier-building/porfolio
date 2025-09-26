#!/bin/bash
# Production deployment script with security checks

set -e

echo "🔒 Starting secure production deployment..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Do not run this script as root for security reasons"
    exit 1
fi

# Check required environment variables
required_vars=("SECRET_KEY" "DB_PASSWORD" "EMAIL_HOST_PASSWORD" "GOOGLE_GEMINI_API_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

# Create logs directory with proper permissions
mkdir -p backend/portfolio_backend/logs
chmod 750 backend/portfolio_backend/logs

# Backend deployment
echo "🔧 Deploying backend..."
cd backend/portfolio_backend

# Install dependencies
uv sync --frozen

# Run security checks
echo "🔍 Running security checks..."
uv run python manage.py check --deploy

# Run migrations
uv run python manage.py migrate --no-input

# Collect static files
uv run python manage.py collectstatic --no-input --clear

# Create superuser if it doesn't exist
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'secure-admin-password')" | uv run python manage.py shell

cd ../..

# Frontend deployment
echo "🎨 Deploying frontend..."
cd frontend

# Install dependencies
npm ci --only=production

# Build for production
npm run build

cd ..

# Set proper file permissions
echo "🔐 Setting secure file permissions..."
find . -type f -name "*.py" -exec chmod 644 {} \;
find . -type f -name "*.js" -exec chmod 644 {} \;
find . -type f -name "*.json" -exec chmod 644 {} \;
find . -type f -name "*.env*" -exec chmod 600 {} \;
find . -type d -exec chmod 755 {} \;

# Remove development files
echo "🧹 Cleaning up development files..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

echo "✅ Secure deployment completed!"
echo "📋 Post-deployment checklist:"
echo "  - Update DNS records"
echo "  - Configure SSL certificate"
echo "  - Set up monitoring"
echo "  - Configure backups"
echo "  - Test all endpoints"
echo "  - Review security headers"