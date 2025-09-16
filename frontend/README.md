# Terminal Portfolio - Didier Imanirahari

A modern, terminal-style portfolio built with Next.js 14 and TypeScript, featuring a clean CLI aesthetic and Google Gemini AI integration.

## 🚀 Features

### Terminal UI Design
- **Terminal Window Frame**: Complete with window chrome (● ● ●) and command line interface
- **Command-based Navigation**: Each section represents a terminal command
  - `$ whoami` - Personal introduction with typewriter animation
  - `$ help` - Services and capabilities
  - `$ skills --list` - Technical skills with filtering
  - `$ history` - Professional experience timeline
  - `$ ls projects/` - Project portfolio with modal details
  - `$ contact --open` - Contact form and information

### Interactive Features
- **Skill-based Project Filtering**: Click skills to filter projects dynamically
- **URL State Persistence**: Selected filters persist in URL query parameters
- **Typewriter Animation**: One-time hero animation for authentic terminal feel
- **Dark/Light Theme Toggle**: Persistent theme switching with localStorage
- **Responsive Design**: Mobile-first approach with terminal aesthetics

### Backend Integration
- **Contact Form API**: Rate-limited contact submission with spam protection
- **Google Gemini Secretary**: AI-powered assistant with portfolio knowledge
- **Environment Configuration**: Secure API key management

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom terminal theme
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (Gemini)
- **Deployment**: Static export compatible

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/didier-building/porfolio.git
   cd porfolio/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Required for AI secretary functionality
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional: Email configuration for contact form
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_email_password
   MAIL_FROM=your_email@gmail.com
   MAIL_TO=your_email@gmail.com
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Production Build**
   ```bash
   npm run build
   npm run start
   ```

## 🔧 API Endpoints

### POST `/api/contact`
Contact form submission with validation and rate limiting.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss a project."
}
```

**Response:**
```json
{
  "ok": true
}
```

**Rate Limiting:** 5 requests per minute per IP

### POST `/api/secretary`
AI-powered portfolio assistant using Google Gemini.

**Request:**
```json
{
  "prompt": "Tell me about Didier's experience with Django"
}
```

**Response:**
```json
{
  "reply": "Didier has extensive experience with Django..."
}
```

## 🧪 Example API Usage

### Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Interested in your backend services"
  }'
```

### AI Secretary
```bash
curl -X POST http://localhost:3000/api/secretary \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What technologies does Didier work with?"
  }'
```

## 🎨 Design System

### Color Palette
- **Terminal Background**: `#0c0c0c` (primary), `#1a1a1a` (secondary)
- **Terminal Text**: `#e0e0e0` (primary), `#a0a0a0` (dimmed)
- **Accent Color**: `#00D26A` (green) - used for prompts, links, and focus states
- **Borders**: `#333333`

### Typography
- **Sans Serif**: System fonts (Inter fallback)
- **Monospace**: SF Mono, Monaco, Consolas (terminal authentic)

### Component Architecture
- `<TerminalFrame />` - Main application wrapper
- `<SectionTitle />` - Command prompt headers
- `<TechChip />` - Interactive skill tags
- `<CaseCard />` - Project cards with modal details
- `<Typewriter />` - Terminal-style text animation

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Honeypot Protection**: Anti-spam measures
- **Input Validation**: Server-side validation for all endpoints
- **Environment Variables**: Secure API key management
- **Error Handling**: Structured error responses

## 📊 Performance

- **Lighthouse Score Target**: 90+ Performance, 95+ Accessibility, 95+ SEO
- **LCP Target**: <1.5s
- **Font Loading**: System fonts for instant rendering
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js built-in optimization

## 🚀 Deployment

### Netlify (Static)
1. Build the static export:
   ```bash
   npm run build
   ```
2. Deploy the `out` directory to Netlify

### Vercel (Full-Stack)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy with API routes enabled

### Manual Hosting
1. Build: `npm run build`
2. Start: `npm run start`
3. Configure reverse proxy (nginx/apache)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Contact

**Didier Imanirahari**
- Email: didier53053@gmail.com
- GitHub: [@didier-building](https://github.com/didier-building)
- Portfolio: [Terminal Portfolio](https://imanirahari.netlify.app)

---

<div align="center">
  <strong>Made with ❤️ using Next.js, TypeScript, and Tailwind CSS</strong>
</div>
