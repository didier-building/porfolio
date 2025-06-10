# Professional Portfolio Website

A modern, full-stack portfolio application built with React (frontend) and Django (backend) designed for software engineers and developers to showcase their skills, projects, and professional experience.

![Portfolio Preview](https://via.placeholder.com/800x400?text=Portfolio+Preview)

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

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The frontend will be available at `http://localhost:5173`

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

5. Create a superuser:
   ```bash
   uv run manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   uv run manage.py runserver
   ```

7. The backend will be available at `http://localhost:8000`

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

## Customization

1. Update personal information in the Django admin panel
2. Modify frontend components to match your design preferences
3. Add new sections by creating new models and components

## License

MIT License

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- [UV](https://github.com/astral-sh/uv) - Modern Python package manager