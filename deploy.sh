#!/bin/bash

# Production Deployment Script for AI-Enhanced Portfolio
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting AI-Enhanced Portfolio Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=("SECRET_KEY" "GOOGLE_GEMINI_API_KEY")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Please set these variables in your .env file or environment."
        exit 1
    fi
    
    print_success "All required environment variables are set"
}

# Check if Docker is installed and running
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_status "Checking Docker Compose..."
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
    
    print_success "Docker Compose is available"
}

# Load environment variables
load_env() {
    print_status "Loading environment variables..."
    
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
        print_success "Environment variables loaded from .env"
    else
        print_warning ".env file not found. Using system environment variables."
    fi
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Stop existing services
    print_status "Stopping existing services..."
    docker-compose down --remove-orphans
    
    # Build images
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    print_success "Services started successfully"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for database
    print_status "Waiting for database..."
    timeout 60 bash -c 'until docker-compose exec -T db pg_isready -U portfolio_user -d portfolio_db; do sleep 2; done'
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    timeout 60 bash -c 'until docker-compose exec -T redis redis-cli ping; do sleep 2; done'
    
    # Wait for backend
    print_status "Waiting for backend..."
    timeout 120 bash -c 'until curl -f http://localhost:8000/api/health/; do sleep 5; done'
    
    print_success "All services are healthy"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    docker-compose exec backend uv run python manage.py migrate --noinput
    
    print_success "Database migrations completed"
}

# Collect static files
collect_static() {
    print_status "Collecting static files..."
    
    docker-compose exec backend uv run python manage.py collectstatic --noinput
    
    print_success "Static files collected"
}

# Create superuser (optional)
create_superuser() {
    if [ "$CREATE_SUPERUSER" = "true" ]; then
        print_status "Creating superuser..."
        
        docker-compose exec backend uv run python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"
        
        print_success "Superuser setup completed"
    fi
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    # Show running containers
    docker-compose ps
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Your AI-Enhanced Portfolio is now running:"
    echo "  📱 Frontend: http://localhost:3000"
    echo "  🔧 Backend API: http://localhost:8000"
    echo "  📊 Health Check: http://localhost:8000/api/health/"
    echo "  🤖 AI Features: http://localhost:3000#ai-tools"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
    echo ""
}

# Main deployment process
main() {
    echo "🚀 AI-Enhanced Portfolio Deployment Script"
    echo "=========================================="
    echo ""
    
    # Pre-deployment checks
    check_docker
    check_docker_compose
    load_env
    check_env_vars
    
    # Deployment process
    deploy_services
    wait_for_services
    run_migrations
    collect_static
    create_superuser
    
    # Post-deployment
    show_status
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        print_status "Stopping all services..."
        docker-compose down
        print_success "All services stopped"
        ;;
    "restart")
        print_status "Restarting all services..."
        docker-compose restart
        print_success "All services restarted"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    "health")
        curl -f http://localhost:8000/api/health/detailed/ | python -m json.tool
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|logs|status|health}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Full deployment (default)"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show service logs"
        echo "  status  - Show service status"
        echo "  health  - Show health check"
        exit 1
        ;;
esac
