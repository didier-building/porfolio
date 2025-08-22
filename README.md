# Professional Portfolio Website

A modern, full-stack portfolio application built with React (frontend) and Django (backend) designed for software engineers and developers to showcase their skills, projects, and professional experience.

![Portfolio Preview]("https://imanirahari.netlify.app/")

## Features

### Frontend
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 🎯 Interactive project filtering
- 📊 Visual skill progress indicators
- 📝 Contact form with validation
- 🔄 Dynamic content from backend API

### Backend
- 🔐 JWT authentication for admin access
- 📊 RESTful API with Django REST Framework
- 📁 Media file handling for project images
- 📧 Email notifications for contact form submissions
- 📚 API documentation with Swagger/ReDoc
- 🔍 Filtering, searching, and pagination
- 🛡️ Rate limiting and security features

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for fast development
- Lucide React for icons
- Axios for API requests
- React Router for navigation

### Backend
- Django 5.2 with Python 3.12
- Django REST Framework
- PostgreSQL (production) / SQLite (development)
- JWT authentication
- Django CORS headers
- Pillow for image processing
- UV for dependency and environment management

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.12+
- PostgreSQL (for production)
- UV package manager

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file and update variables:
   ```bash
     cp .env.example .env
     # set VITE_API_URL and VITE_TURNSTILE_SITE_KEY
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The frontend will be available at `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment using UV:
   ```bash
   pip install uv  # If not already installed
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Run migrations:
   ```bash
   cd portfolio_backend
   uv run manage.py migrate
   ```

5. Seed initial data and create a superuser:
   ```bash
   uv run manage.py seed
   uv run manage.py createsuperuser
   ```

6. Copy environment file and update variables:
   ```bash
     cp .env.example .env
     # set SECRET_KEY, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS, CSRF_TRUSTED_ORIGINS,
     # ADMIN_EMAIL, DEFAULT_FROM_EMAIL, TURNSTILE_SECRET
   ```

7. Start the development server:
   ```bash
   uv run manage.py runserver
   ```

8. The backend will be available at `http://localhost:8000`

## Local AI (no OpenAI)

- Install Ollama → `ollama pull llama3.1:8b`
- Install KB dependencies (CPU wheel):
  ```bash
  pip install --extra-index-url https://download.pytorch.org/whl/cpu -r backend/requirements-kb.txt
  ```
- Prepare DB/media/seed:
  ```
  cd backend/portfolio_backend
  python manage.py migrate
  python manage.py loaddata ../portfolio/fixtures/portfolio_seed.json
  mkdir -p ../media/comms
  # place your CV at backend/portfolio_backend/media/comms/master-cv.pdf
  ```
- Build KB:
  `uv run python backend/portfolio_backend/api/build_kb.py`
- Run:
  - Start Ollama daemon (default 11434); test: `ollama run llama3.1:8b` then exit
  - `uv run manage.py runserver`
- Test endpoints (curl):
  ```
  curl -s -X POST http://localhost:8000/api/ai/jobmatch/analyze/ \
    -H 'Content-Type: application/json' \
    -d '{"job_description":"Django/DRF with Docker and some Vyper"}'
  curl -s -X POST http://localhost:8000/api/ai/project-explainer/chat/ \
    -H 'Content-Type: application/json' \
    -d '{"question":"Explain the supply-chain tracker tech stack."}'
  ```
- Swagger: http://localhost:8000/api/docs
- Note: responses include "engine":"ollama"; no OpenAI key required.

## Project Structure

### Frontend
```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── data/            # Data files
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
└── vite.config.ts       # Vite configuration
```

### Backend
```
backend/
├── portfolio_backend/
│   ├── api/             # API app
│   │   ├── models.py    # Database models
│   │   ├── serializers.py # API serializers
│   │   ├── views.py     # API views
│   │   └── urls.py      # API routes
│   ├── portfolio_backend/ # Project settings
│   │   ├── settings.py  # Development settings
│   │   ├── settings_prod.py # Production settings
│   │   ├── urls.py      # Main URL routing
│   │   └── wsgi.py      # WSGI configuration
│   └── manage.py        # Django management script
├── pyproject.toml       # Python dependencies
└── deploy.sh            # Deployment script
```

## Deployment

### Frontend
The frontend is deployed on Netlify:

1. Connect your GitHub repository to Netlify
2. Set the base directory to `frontend`
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`

### Backend
The backend can be deployed on a VPS using:

1. Set up a server with PostgreSQL, Nginx, and Gunicorn
2. Configure the `portfolio_backend.service` file for systemd
3. Use the provided `deploy.sh` script for updates:
   ```bash
   # The deploy script uses UV for dependency management and running Django commands
   ./deploy.sh
   ```

## Django Management Commands

All Django management commands should be run using UV:

```bash
# Format for running Django commands
uv run manage.py [command]

# Examples:
uv run manage.py makemigrations
uv run manage.py migrate
uv run manage.py createsuperuser
uv run manage.py collectstatic
```

## API Documentation

API documentation is available at:
- Swagger UI: `/api/docs/`
- ReDoc: `/api/redoc/`

### AI Endpoints
POST `/api/ai/jobmatch/analyze/`

POST `/api/ai/project-explainer/chat/`

Responses contain `engine: "ollama"` and require no OpenAI key.

### Contact Form Protections
The contact endpoint `/api/contact/` implements:
- Honeypot field `website`
- Turnstile validation when `TURNSTILE_SECRET` is set
- Rate limit of **5 requests per minute per IP**

## Customization

1. Update personal information in the Django admin panel
2. Modify frontend components to match your design preferences
3. Add new sections by creating new models and components

## Troubleshooting

- **CORS 403**: ensure the frontend origin is listed in `CORS_ALLOWED_ORIGINS`.
- **CSRF 403/404**: verify the site URL in `CSRF_TRUSTED_ORIGINS` and send the `X-CSRFToken` header.

## Acceptance Checklist

- [ ] `/api/docs/` reachable
- [ ] `/api/comms/` and `/api/profiles/` return seeded data
- [ ] Contact form rejects spam and rate limits after 5 posts/min/IP
- [ ] AI endpoints return JSON with `engine: ollama`
- [ ] Netlify build succeeds (`npm run build`)
- [ ] `backend/didier-portfolio.service` works on Ubuntu

## License

MIT License

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- [UV](https://github.com/astral-sh/uv) - Modern Python package manager
