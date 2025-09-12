"""
Portfolio-only RAG chat system
Enforces portfolio-only discussions with source attribution
"""

import logging
from typing import List, Dict, Any, Tuple
import re

logger = logging.getLogger(__name__)


class PortfolioRAGChat:
    """Portfolio-focused RAG chat system"""
    
    def __init__(self):
        self.portfolio_context = self._load_portfolio_context()
        self.similarity_threshold = 0.3  # Minimum similarity for portfolio relevance
    
    def _load_portfolio_context(self) -> Dict[str, Any]:
        """Load portfolio context data"""
        return {
            'projects': [
                {
                    'title': 'AI-Enhanced Portfolio Platform',
                    'description': 'Full-stack platform with 6 AI-powered tools for recruiters and career development',
                    'technologies': ['React', 'TypeScript', 'Django', 'PostgreSQL', 'Google Gemini AI', 'Docker'],
                    'features': ['Job matching', 'Portfolio chat', 'Career insights', 'CV generation', 'Skill analysis', 'AI journaling'],
                    'metrics': ['99.9% uptime', '60% faster response times', '6 AI tools integrated'],
                    'type': 'project'
                },
                {
                    'title': 'Microservices E-commerce Platform',
                    'description': 'Scalable e-commerce platform with microservices architecture',
                    'technologies': ['Python', 'Django', 'Redis', 'PostgreSQL', 'Docker', 'Nginx'],
                    'features': ['User management', 'Product catalog', 'Order processing', 'Payment integration'],
                    'metrics': ['1000+ concurrent users', '40% performance improvement'],
                    'type': 'project'
                },
                {
                    'title': 'Real-time Analytics Dashboard',
                    'description': 'Real-time data visualization dashboard for business metrics',
                    'technologies': ['React', 'D3.js', 'WebSocket', 'Django Channels', 'Redis'],
                    'features': ['Live data updates', 'Interactive charts', 'Custom dashboards'],
                    'metrics': ['Real-time updates', 'Sub-second latency'],
                    'type': 'project'
                }
            ],
            'skills': {
                'backend': ['Python', 'Django', 'REST APIs', 'PostgreSQL', 'Redis', 'Celery'],
                'frontend': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
                'ai_ml': ['Google Gemini AI', 'RAG Systems', 'Vector Databases', 'NLP', 'Machine Learning'],
                'devops': ['Docker', 'CI/CD', 'GitHub Actions', 'Nginx', 'Cloud Deployment'],
                'tools': ['Git', 'VS Code', 'Postman', 'Linux', 'Agile/Scrum']
            },
            'experience': [
                {
                    'role': 'Full-Stack Developer',
                    'period': '2022 - Present',
                    'achievements': [
                        'Developed AI-enhanced portfolio with 6 intelligent features',
                        'Built scalable REST APIs serving 1000+ requests/hour',
                        'Integrated Google Gemini AI for advanced functionality',
                        'Implemented caching strategies reducing response times by 60%'
                    ],
                    'type': 'experience'
                },
                {
                    'role': 'Software Developer',
                    'period': '2021 - 2022',
                    'achievements': [
                        'Developed responsive web applications using React and Django',
                        'Collaborated with cross-functional teams on agile development',
                        'Optimized database queries improving performance by 40%'
                    ],
                    'type': 'experience'
                }
            ],
            'education': {
                'degree': 'Bachelor\'s in Computer Science',
                'university': 'University',
                'year': '2021',
                'certifications': [
                    'Google AI/ML Certification (2024)',
                    'AWS Cloud Practitioner (2023)'
                ],
                'type': 'education'
            }
        }
    
    def is_portfolio_relevant(self, query: str) -> Tuple[bool, float]:
        """Check if query is portfolio-relevant with confidence score"""
        query_lower = query.lower()
        
        # Portfolio keywords with weights
        portfolio_keywords = {
            # Projects
            'project': 2.0, 'portfolio': 2.0, 'ai': 1.5, 'platform': 1.5,
            'microservices': 2.0, 'ecommerce': 1.5, 'dashboard': 1.5,
            
            # Technologies
            'python': 1.5, 'django': 1.5, 'react': 1.5, 'typescript': 1.5,
            'postgresql': 1.0, 'redis': 1.0, 'docker': 1.0, 'nginx': 1.0,
            'gemini': 1.5, 'api': 1.0, 'database': 1.0,
            
            # Skills & Concepts
            'development': 1.0, 'backend': 1.0, 'frontend': 1.0, 'fullstack': 1.5,
            'experience': 1.0, 'skill': 1.0, 'work': 1.0, 'job': 1.0,
            'career': 1.0, 'education': 1.0, 'certification': 1.0,
            
            # Actions
            'built': 1.0, 'developed': 1.0, 'created': 1.0, 'implemented': 1.0,
            'designed': 1.0, 'optimized': 1.0, 'integrated': 1.0
        }
        
        # Calculate relevance score
        total_score = 0
        max_possible_score = 0
        
        words = re.findall(r'\b\w+\b', query_lower)
        
        for word in words:
            max_possible_score += 2.0  # Maximum weight
            if word in portfolio_keywords:
                total_score += portfolio_keywords[word]
        
        # Normalize score
        relevance_score = total_score / max_possible_score if max_possible_score > 0 else 0
        
        # Check for off-topic indicators
        off_topic_keywords = [
            'weather', 'news', 'politics', 'sports', 'cooking', 'travel',
            'personal life', 'family', 'hobbies', 'movies', 'music',
            'unrelated', 'random', 'joke', 'funny'
        ]
        
        for keyword in off_topic_keywords:
            if keyword in query_lower:
                relevance_score *= 0.1  # Heavily penalize off-topic
        
        is_relevant = relevance_score >= self.similarity_threshold
        
        logger.info(f"Query relevance: {relevance_score:.3f} ({'relevant' if is_relevant else 'off-topic'})")
        
        return is_relevant, relevance_score
    
    def generate_response(self, query: str) -> Dict[str, Any]:
        """Generate portfolio-focused response with sources"""
        try:
            # Check relevance first
            is_relevant, confidence = self.is_portfolio_relevant(query)
            
            if not is_relevant:
                return {
                    'response': 'I only discuss this portfolio—try asking about projects, case studies, or skills.',
                    'sources': [],
                    'portfolio_only': True,
                    'confidence': confidence
                }
            
            # Find relevant sources
            sources = self._find_relevant_sources(query)
            
            # Generate contextual response
            response = self._generate_contextual_response(query, sources)
            
            return {
                'response': response,
                'sources': sources[:3],  # Limit to 3 sources
                'portfolio_only': True,
                'confidence': confidence
            }
            
        except Exception as e:
            logger.error(f"RAG chat failed: {e}")
            return {
                'response': 'I encountered an issue. Please ask about my projects, skills, or experience.',
                'sources': [],
                'portfolio_only': True,
                'error': True
            }
    
    def _find_relevant_sources(self, query: str) -> List[Dict[str, str]]:
        """Find relevant portfolio sources for the query"""
        sources = []
        query_lower = query.lower()
        
        # Check projects
        for project in self.portfolio_context['projects']:
            if self._matches_content(query_lower, project):
                sources.append({
                    'title': project['title'],
                    'type': 'project',
                    'relevance': 'high'
                })
        
        # Check skills
        for category, skills in self.portfolio_context['skills'].items():
            for skill in skills:
                if skill.lower() in query_lower:
                    sources.append({
                        'title': f'{skill} ({category.title()})',
                        'type': 'skill',
                        'relevance': 'medium'
                    })
        
        # Check experience
        for exp in self.portfolio_context['experience']:
            if self._matches_content(query_lower, exp):
                sources.append({
                    'title': f'{exp["role"]} Experience',
                    'type': 'experience',
                    'relevance': 'high'
                })
        
        # Sort by relevance and return top sources
        sources.sort(key=lambda x: {'high': 3, 'medium': 2, 'low': 1}[x['relevance']], reverse=True)
        return sources
    
    def _matches_content(self, query: str, content: Dict) -> bool:
        """Check if query matches content"""
        searchable_text = ""
        
        if 'title' in content:
            searchable_text += content['title'].lower() + " "
        if 'description' in content:
            searchable_text += content['description'].lower() + " "
        if 'technologies' in content:
            searchable_text += " ".join(content['technologies']).lower() + " "
        if 'features' in content:
            searchable_text += " ".join(content['features']).lower() + " "
        if 'achievements' in content:
            searchable_text += " ".join(content['achievements']).lower() + " "
        
        # Simple keyword matching
        query_words = query.split()
        matches = sum(1 for word in query_words if word in searchable_text)
        
        return matches >= len(query_words) * 0.3  # At least 30% of words match
    
    def _generate_contextual_response(self, query: str, sources: List[Dict]) -> str:
        """Generate contextual response based on query and sources"""
        query_lower = query.lower()
        
        # Project-specific responses
        if 'ai' in query_lower and 'portfolio' in query_lower:
            return """The AI-Enhanced Portfolio Platform is my flagship project showcasing advanced full-stack development with AI integration. It features 6 intelligent tools including job matching, portfolio chat, career insights, CV generation, skill analysis, and AI journaling. Built with React/TypeScript frontend and Django backend, it demonstrates modern development practices with production-ready deployment."""
        
        if 'project' in query_lower:
            return """I've developed several key projects including an AI-Enhanced Portfolio Platform with 6 AI-powered tools, a Microservices E-commerce Platform handling 1000+ concurrent users, and a Real-time Analytics Dashboard with sub-second latency. Each project demonstrates different aspects of full-stack development, from AI integration to scalable architecture."""
        
        # Technology-specific responses
        if any(tech in query_lower for tech in ['python', 'django', 'backend']):
            return """I have extensive experience with Python and Django for backend development. I've built scalable REST APIs serving 1000+ requests/hour, implemented caching strategies that reduced response times by 60%, and integrated AI services like Google Gemini. My backend work includes database optimization, API design, and production deployment."""
        
        if any(tech in query_lower for tech in ['react', 'typescript', 'frontend']):
            return """My frontend expertise centers on React and TypeScript for building modern, responsive web applications. I've developed component-based architectures, implemented state management, and created interactive user interfaces. The AI portfolio platform showcases advanced frontend techniques including lazy loading, error boundaries, and real-time updates."""
        
        if 'ai' in query_lower or 'machine learning' in query_lower:
            return """I specialize in AI integration, particularly with Google Gemini AI for natural language processing. I've built RAG systems, implemented vector databases, and created intelligent features like job matching and career insights. My AI work focuses on practical applications that solve real business problems."""
        
        # Experience-specific responses
        if 'experience' in query_lower or 'work' in query_lower:
            return """I'm a Full-Stack Developer with 3+ years of experience building scalable web applications. My recent work includes developing an AI-enhanced portfolio platform, optimizing database performance by 40%, and implementing modern deployment practices. I excel at combining technical expertise with practical problem-solving."""
        
        # Skills-specific responses
        if 'skill' in query_lower:
            return """My core skills span the full development stack: Python/Django for backend, React/TypeScript for frontend, PostgreSQL/Redis for data, and Docker for deployment. I'm particularly strong in AI integration, performance optimization, and modern development practices. I continuously learn new technologies to stay current with industry trends."""
        
        # Default contextual response
        if sources:
            source_titles = [s['title'] for s in sources[:2]]
            return f"""Based on my portfolio, I can share insights about {', '.join(source_titles)}. My experience demonstrates strong technical capabilities across full-stack development, AI integration, and production deployment. I focus on building scalable, maintainable solutions that solve real business problems."""
        
        return """I'd be happy to discuss my portfolio in more detail. You can ask about specific projects like the AI-Enhanced Portfolio Platform, my technical skills in Python/Django and React/TypeScript, or my experience with AI integration and full-stack development."""


# Global instance
portfolio_rag_chat = PortfolioRAGChat()
