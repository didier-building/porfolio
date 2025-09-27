# Portfolio Backend

Clean, minimal Django backend for the portfolio website with essential features only.

## Features

- **Portfolio API**: Projects, skills, experience, education endpoints
- **Contact Form**: Rate-limited contact form with spam protection
- **AI Secretary**: Gemini AI-powered chat about portfolio
- **Health Monitoring**: Health check endpoints
- **Admin Interface**: Django admin for content management

## Quick Start

1. **Setup Environment**:
   ```bash
   cd backend
   pip install uv
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv sync
   ```

2. **Configure Environment**:
   ```bash
   cd portfolio_backend
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Setup Database**:
   ```bash
   uv run manage.py migrate
   uv run manage.py seed  # Load sample data
   uv run manage.py createsuperuser
   ```

4. **Run Server**:
   ```bash
   uv run manage.py runserver
   ```

## API Endpoints

- `GET /api/projects/` - Portfolio projects
- `GET /api/skills/` - Technical skills
- `GET /api/experiences/` - Work experience
- `GET /api/educations/` - Education history
- `GET /api/profiles/` - Social profiles
- `POST /api/contact/` - Contact form submission
- `POST /api/ai-secretary/chat/` - AI chat
- `GET /api/health/` - Health check
- `GET /api/docs/` - API documentation

## Environment Variables

```bash
# Required
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,yourdomain.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
CSRF_TRUSTED_ORIGINS=http://localhost:3000,https://yourdomain.com

# AI Features (Optional)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Email (Optional)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
ADMIN_EMAIL=your-admin@email.com

# Production Database (Optional)
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Caching (Optional)
REDIS_URL=redis://localhost:6379/1
```

## Deployment

The backend is ready for deployment on any platform supporting Django:

- **VPS**: Use the included systemd service file
- **Docker**: Dockerfile included
- **Cloud Platforms**: Railway, Heroku, DigitalOcean, etc.

## Security Features

- Rate limiting on contact form and AI endpoints
- CSRF protection
- Input validation and sanitization
- Honeypot spam protection
- Security headers in production
- Environment-based configuration

## AI Integration

The AI secretary uses Google Gemini AI to answer questions about the portfolio. It includes:

- Conversation history management
- Fallback responses when AI is unavailable
- Rate limiting and input validation
- Professional context about skills and projects

## Admin Interface

Access the Django admin at `/admin/` to manage:

- Projects and technologies
- Skills and proficiency levels
- Work experience and education
- Contact form submissions
- Social media profiles

## Health Monitoring

Health check endpoint at `/api/health/` provides:

- Database connectivity status
- AI service availability
- Cache system status
- Overall application health