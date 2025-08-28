# 🚀 AI-Enhanced Portfolio Deployment Guide

This guide covers multiple deployment options for your AI-enhanced portfolio platform.

## 📋 Prerequisites

### Required Software
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git**

### Required Environment Variables
Create a `.env` file in the root directory with these variables:

```bash
# Required Variables
SECRET_KEY=your-super-secret-django-key-here-make-it-long-and-random
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio

# Optional Variables
POSTGRES_PASSWORD=your-secure-database-password
DOMAIN_NAME=yourdomain.com
CREATE_SUPERUSER=true
```

## 🎯 Quick Start (Local Development)

1. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd portfolio
   cp backend/.env.production .env
   # Edit .env with your values
   ```

2. **Deploy with One Command**
   ```bash
   ./deploy.sh
   ```

3. **Access Your Portfolio**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Health Check: http://localhost:8000/api/health/

## 🏭 Production Deployment Options

### Option 1: Docker Compose (Recommended)

**Best for:** VPS, dedicated servers, or local production setups

```bash
# 1. Prepare environment
cp backend/.env.production .env
nano .env  # Edit with production values

# 2. Deploy
./deploy.sh

# 3. Monitor
./deploy.sh logs
./deploy.sh health
```

**Features:**
- ✅ PostgreSQL database
- ✅ Redis caching
- ✅ Health checks
- ✅ Auto-restart policies
- ✅ Volume persistence

### Option 2: Cloud Platforms

#### Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod
```

**Backend on Railway:**
```bash
# 1. Connect to Railway
railway login
railway link

# 2. Set environment variables
railway variables set SECRET_KEY=your-secret-key
railway variables set GOOGLE_GEMINI_API_KEY=your-api-key

# 3. Deploy
railway up
```

#### AWS ECS (Container Service)

**Prerequisites:**
- AWS CLI configured
- ECS cluster created

```bash
# 1. Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# 2. Build and tag images
docker build -t portfolio-backend ./backend
docker tag portfolio-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/portfolio-backend:latest

# 3. Push to ECR
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/portfolio-backend:latest

# 4. Update ECS service
aws ecs update-service --cluster portfolio-cluster --service portfolio-service --force-new-deployment
```

#### DigitalOcean App Platform

```yaml
# app.yaml
name: ai-portfolio
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/portfolio
    branch: main
  run_command: gunicorn --chdir portfolio_backend portfolio_backend.wsgi:application --bind 0.0.0.0:8000
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: SECRET_KEY
    value: your-secret-key
  - key: GOOGLE_GEMINI_API_KEY
    value: your-api-key

- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/portfolio
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: portfolio-db
  engine: PG
  version: "13"
```

## 🔧 Configuration

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SECRET_KEY` | ✅ | Django secret key | `your-50-char-random-string` |
| `GOOGLE_GEMINI_API_KEY` | ✅ | Google AI API key | `AIzaSy...` |
| `ENVIRONMENT` | ❌ | Environment type | `production` |
| `DATABASE_URL` | ❌ | Database connection | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | ❌ | Redis connection | `redis://localhost:6379/0` |
| `ALLOWED_HOSTS` | ❌ | Allowed hostnames | `yourdomain.com,www.yourdomain.com` |
| `DOMAIN_NAME` | ❌ | Your domain | `yourdomain.com` |

### Database Options

**Development:** SQLite (default)
**Production:** PostgreSQL (recommended)

```bash
# PostgreSQL setup
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

### SSL/HTTPS Setup

For production with custom domain:

```bash
# 1. Get SSL certificate (Let's Encrypt)
certbot --nginx -d yourdomain.com

# 2. Update nginx config for HTTPS
# 3. Set environment variables
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
```

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Basic health
curl http://localhost:8000/api/health/

# Detailed health with database/cache status
curl http://localhost:8000/api/health/detailed/

# Kubernetes-style checks
curl http://localhost:8000/api/health/ready/
curl http://localhost:8000/api/health/live/
```

### Logs

```bash
# View all logs
./deploy.sh logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f backend
```

### Backup

```bash
# Database backup
docker-compose exec db pg_dump -U portfolio_user portfolio_db > backup.sql

# Restore database
docker-compose exec -T db psql -U portfolio_user portfolio_db < backup.sql

# Media files backup
docker-compose exec backend tar -czf /tmp/media.tar.gz media/
docker cp $(docker-compose ps -q backend):/tmp/media.tar.gz ./media-backup.tar.gz
```

### Updates

```bash
# Update application
git pull origin main
./deploy.sh restart

# Update dependencies
docker-compose build --no-cache
docker-compose up -d
```

## 🛠️ Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 <PID>
```

**2. Database Connection Issues**
```bash
# Check database status
docker-compose exec db pg_isready -U portfolio_user -d portfolio_db

# Reset database
docker-compose down -v
docker-compose up -d db
```

**3. AI Service Issues**
```bash
# Check API key
curl -H "Authorization: Bearer $GOOGLE_GEMINI_API_KEY" https://generativelanguage.googleapis.com/v1/models

# Test fallback mode
# AI features will work with fallback responses if API is unavailable
```

**4. Frontend Build Issues**
```bash
# Clear node modules and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Performance Optimization

**1. Database Optimization**
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create database indexes
docker-compose exec backend python manage.py dbshell
```

**2. Static Files**
```bash
# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Enable compression in nginx
# (Already configured in nginx.conf)
```

**3. Caching**
```bash
# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL

# Monitor cache usage
docker-compose exec redis redis-cli INFO memory
```

## 🔐 Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup data regularly

## 📞 Support

If you encounter issues:

1. Check the logs: `./deploy.sh logs`
2. Verify health status: `./deploy.sh health`
3. Review environment variables
4. Check Docker/Docker Compose versions
5. Ensure all required ports are available

## 🎉 Success!

Your AI-Enhanced Portfolio is now deployed with:

- ✅ **5 AI-powered features**
- ✅ **Professional analytics**
- ✅ **Production-ready infrastructure**
- ✅ **Health monitoring**
- ✅ **Scalable architecture**

**Access your portfolio at your configured domain and start showcasing your professional AI-enhanced platform!**
