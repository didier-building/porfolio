"""
Google Gemini AI Service
Professional AI integration for portfolio features
"""

import logging
from typing import Dict, List, Any
from django.conf import settings

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

logger = logging.getLogger(__name__)


class GeminiService:
    """Google Gemini AI service for professional portfolio features"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'GOOGLE_GEMINI_API_KEY', None)
        self.model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-1.5-flash')
        self.model = None
        
        if GEMINI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(self.model_name)
                logger.info("Gemini AI service initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini AI: {e}")
        else:
            logger.warning("Gemini AI not available - missing dependencies or API key")
    
    def is_available(self) -> bool:
        """Check if Gemini AI service is available"""
        return GEMINI_AVAILABLE and self.model is not None
    
    def analyze_job_match(self, job_description: str, professional_profile: Dict) -> Dict[str, Any]:
        """Analyze job compatibility with professional profile"""
        if not self.is_available():
            return self._get_fallback_job_analysis(job_description, professional_profile)
        
        try:
            prompt = self._build_job_analysis_prompt(job_description, professional_profile)
            response = self.model.generate_content(prompt)
            
            # Parse the response into structured data
            return self._parse_job_analysis_response(response.text)
            
        except Exception as e:
            logger.error(f"Job analysis failed: {e}")
            return self._get_fallback_job_analysis(job_description, professional_profile)
    
    def chat_about_projects(self, message: str, professional_profile: Dict, conversation_history: List[Dict] = None) -> str:
        """Handle chat about projects and experience"""
        if not self.is_available():
            return self._get_fallback_chat_response(message, professional_profile)
        
        try:
            prompt = self._build_chat_prompt(message, professional_profile, conversation_history)
            response = self.model.generate_content(prompt)
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Chat response failed: {e}")
            return self._get_fallback_chat_response(message, professional_profile)
    
    def generate_career_insights(self, professional_profile: Dict) -> Dict[str, Any]:
        """Generate AI-powered career insights with improved error handling"""
        if not self.is_available():
            logger.info("Using fallback career insights - AI service not available")
            return self._get_fallback_career_insights(professional_profile)

        try:
            prompt = self._build_career_insights_prompt(professional_profile)

            # Add timeout and retry logic
            import time
            max_retries = 2
            for attempt in range(max_retries):
                try:
                    response = self.model.generate_content(prompt)
                    if response and response.text:
                        return self._parse_career_insights_response(response.text)
                except Exception as retry_error:
                    logger.warning(f"Career insights attempt {attempt + 1} failed: {retry_error}")
                    if attempt < max_retries - 1:
                        time.sleep(1)  # Brief delay before retry
                    continue

            # If all retries failed, use fallback
            logger.warning("All career insights generation attempts failed, using fallback")
            return self._get_fallback_career_insights(professional_profile)

        except Exception as e:
            logger.error(f"Career insights generation failed: {e}")
            return self._get_fallback_career_insights(professional_profile)
    
    def _build_job_analysis_prompt(self, job_description: str, profile: Dict) -> str:
        """Build prompt for job compatibility analysis"""
        skills = profile.get('technical_skills', {})
        experience = profile.get('work_experience', [])
        education = profile.get('education_background', [])
        
        skills_text = []
        for category, skill_list in skills.items():
            if skill_list:
                skills_text.append(f"{category.title()}: {', '.join(skill_list)}")
        
        experience_text = []
        for exp in experience[:3]:  # Top 3 experiences
            position = exp.get('position', '')
            company = exp.get('company', '')
            if position and company:
                experience_text.append(f"- {position} at {company}")
        
        prompt = f"""
You are a professional career analyst. Analyze the compatibility between this job posting and the candidate's profile.

JOB DESCRIPTION:
{job_description}

CANDIDATE PROFILE:
Name: {profile.get('full_name', 'Didier Imanirahami')}
Professional Title: {profile.get('professional_title', 'Senior Python Developer')}

Technical Skills:
{chr(10).join(skills_text) if skills_text else 'Python, Django, React, AWS, PostgreSQL'}

Recent Experience:
{chr(10).join(experience_text) if experience_text else '- Senior Python Developer at TechCorp'}

Education:
{education[0].get('degree', 'Master of Computer Science') if education else 'Master of Computer Science'}

Please provide a structured analysis in this exact format:

COMPATIBILITY_SCORE: [0-100]
MATCHING_SKILLS: [comma-separated list]
MISSING_SKILLS: [comma-separated list]
EXPERIENCE_MATCH: [High/Medium/Low]
EDUCATION_MATCH: [High/Medium/Low]
OVERALL_FIT: [Excellent/Good/Fair/Poor]
RECOMMENDATIONS: [3-5 specific recommendations]
SUMMARY: [2-3 sentence professional summary]
"""
        return prompt
    
    def _build_chat_prompt(self, message: str, profile: Dict, history: List[Dict] = None) -> str:
        """Build prompt for project chat"""
        ai_persona = profile.get('ai_persona_description', '')
        projects = profile.get('projects_portfolio', [])
        skills = profile.get('technical_skills', {})
        profile.get('work_experience', [])
        
        context = f"""
{ai_persona}

PROFESSIONAL CONTEXT:
- Full Name: {profile.get('full_name', 'Didier Imanirahami')}
- Title: {profile.get('professional_title', 'Senior Python Developer')}
- Years of Experience: {profile.get('years_of_experience', 5)}+

KEY PROJECTS:
"""
        
        for i, project in enumerate(projects[:3], 1):
            context += f"{i}. {project.get('name', 'Project')}: {project.get('description', 'Professional project')}\n"
        
        context += "\nTECHNICAL EXPERTISE:\n"
        for category, skill_list in skills.items():
            if skill_list:
                context += f"- {category.title()}: {', '.join(skill_list[:5])}\n"
        
        if history:
            context += "\nCONVERSATION HISTORY:\n"
            for msg in history[-3:]:  # Last 3 messages
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                context += f"{role.title()}: {content}\n"
        
        prompt = f"""
{context}

CURRENT QUESTION: {message}

Respond as Didier's professional AI representative. Be specific, professional, and provide concrete examples from the projects and experience above. Keep responses focused and under 200 words.
"""
        return prompt
    
    def _build_career_insights_prompt(self, profile: Dict) -> str:
        """Build prompt for career insights"""
        skills = profile.get('technical_skills', {})
        experience = profile.get('work_experience', [])
        
        prompt = f"""
You are a senior career advisor. Analyze this professional profile and provide career insights.

PROFILE:
Name: {profile.get('full_name', 'Didier Imanirahami')}
Experience: {profile.get('years_of_experience', 5)}+ years
Current Title: {profile.get('professional_title', 'Senior Python Developer')}

Skills: {', '.join([skill for skill_list in skills.values() for skill in skill_list[:20]])}

Recent Roles: {', '.join([exp.get('position', '') for exp in experience[:3]])}

Provide insights in this format:

CAREER_STAGE: [Junior/Mid-level/Senior/Expert]
STRENGTHS: [3-4 key strengths]
GROWTH_AREAS: [2-3 areas for development]
MARKET_POSITION: [Strong/Competitive/Developing]
NEXT_STEPS: [3-4 specific recommendations]
INDUSTRY_TRENDS: [2-3 relevant trends]
SALARY_RANGE: [Estimated range for current level]
"""
        return prompt
    
    def _parse_job_analysis_response(self, response_text: str) -> Dict[str, Any]:
        """Parse job analysis response into structured data"""
        try:
            lines = response_text.strip().split('\n')
            result = {
                'compatibility_score': 75,
                'matching_skills': [],
                'missing_skills': [],
                'experience_match': 'Medium',
                'education_match': 'High',
                'overall_fit': 'Good',
                'recommendations': [],
                'summary': 'Professional analysis completed.'
            }
            
            for line in lines:
                line = line.strip()
                if line.startswith('COMPATIBILITY_SCORE:'):
                    try:
                        score = int(line.split(':')[1].strip())
                        result['compatibility_score'] = max(0, min(100, score))
                    except (ValueError, IndexError):
                        pass
                elif line.startswith('MATCHING_SKILLS:'):
                    skills = line.split(':', 1)[1].strip()
                    result['matching_skills'] = [s.strip() for s in skills.split(',') if s.strip()]
                elif line.startswith('MISSING_SKILLS:'):
                    skills = line.split(':', 1)[1].strip()
                    result['missing_skills'] = [s.strip() for s in skills.split(',') if s.strip()]
                elif line.startswith('EXPERIENCE_MATCH:'):
                    result['experience_match'] = line.split(':', 1)[1].strip()
                elif line.startswith('EDUCATION_MATCH:'):
                    result['education_match'] = line.split(':', 1)[1].strip()
                elif line.startswith('OVERALL_FIT:'):
                    result['overall_fit'] = line.split(':', 1)[1].strip()
                elif line.startswith('RECOMMENDATIONS:'):
                    recs = line.split(':', 1)[1].strip()
                    result['recommendations'] = [r.strip() for r in recs.split(',') if r.strip()]
                elif line.startswith('SUMMARY:'):
                    result['summary'] = line.split(':', 1)[1].strip()
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to parse job analysis response: {e}")
            return self._get_fallback_job_analysis("", {})
    
    def _parse_career_insights_response(self, response_text: str) -> Dict[str, Any]:
        """Parse career insights response"""
        try:
            lines = response_text.strip().split('\n')
            result = {
                'career_stage': 'Senior',
                'strengths': [],
                'growth_areas': [],
                'market_position': 'Competitive',
                'next_steps': [],
                'industry_trends': [],
                'salary_range': 'Competitive market rate'
            }
            
            for line in lines:
                line = line.strip()
                if line.startswith('CAREER_STAGE:'):
                    result['career_stage'] = line.split(':', 1)[1].strip()
                elif line.startswith('STRENGTHS:'):
                    strengths = line.split(':', 1)[1].strip()
                    result['strengths'] = [s.strip() for s in strengths.split(',') if s.strip()]
                elif line.startswith('GROWTH_AREAS:'):
                    areas = line.split(':', 1)[1].strip()
                    result['growth_areas'] = [a.strip() for a in areas.split(',') if a.strip()]
                elif line.startswith('MARKET_POSITION:'):
                    result['market_position'] = line.split(':', 1)[1].strip()
                elif line.startswith('NEXT_STEPS:'):
                    steps = line.split(':', 1)[1].strip()
                    result['next_steps'] = [s.strip() for s in steps.split(',') if s.strip()]
                elif line.startswith('INDUSTRY_TRENDS:'):
                    trends = line.split(':', 1)[1].strip()
                    result['industry_trends'] = [t.strip() for t in trends.split(',') if t.strip()]
                elif line.startswith('SALARY_RANGE:'):
                    result['salary_range'] = line.split(':', 1)[1].strip()
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to parse career insights response: {e}")
            return self._get_fallback_career_insights({})
    
    # Fallback methods for when AI is not available
    def _get_fallback_job_analysis(self, job_description: str, profile: Dict) -> Dict[str, Any]:
        """Fallback job analysis when AI is not available"""
        return {
            'compatibility_score': 75,
            'matching_skills': ['Python', 'Django', 'React', 'PostgreSQL'],
            'missing_skills': ['Kubernetes', 'Machine Learning'],
            'experience_match': 'High',
            'education_match': 'High',
            'overall_fit': 'Good',
            'recommendations': [
                'Strong technical background aligns well with requirements',
                'Consider gaining experience with cloud technologies',
                'Highlight project management experience',
                'Emphasize problem-solving capabilities'
            ],
            'summary': 'Strong candidate with relevant technical skills and experience. Good fit for the role with minor skill gaps that can be addressed.'
        }
    
    def _get_fallback_chat_response(self, message: str, profile: Dict) -> str:
        """Fallback chat response when AI is not available"""
        name = profile.get('full_name', 'Didier Imanirahami')
        
        if 'project' in message.lower():
            return f"I'm {name}'s AI representative. I'd be happy to discuss the various projects in the portfolio, including the AI-powered portfolio system, blockchain applications, and cloud infrastructure work. What specific project interests you?"
        elif 'experience' in message.lower():
            return f"I can share details about {name}'s professional experience in Python development, Django frameworks, and full-stack applications. The experience spans backend development, API design, and system architecture."
        elif 'skill' in message.lower():
            return f"{name} has strong expertise in Python, Django, React, PostgreSQL, AWS, and blockchain technologies. I can provide specific examples of how these skills have been applied in real projects."
        else:
            return f"Hello! I'm {name}'s professional AI assistant. I can discuss technical projects, work experience, skills, and provide detailed information about capabilities and achievements. What would you like to know?"
    
    def _get_fallback_career_insights(self, profile: Dict) -> Dict[str, Any]:
        """Fallback career insights when AI is not available"""
        return {
            'career_stage': 'Senior',
            'strengths': [
                'Strong technical foundation in Python and Django',
                'Full-stack development capabilities',
                'Cloud and DevOps experience',
                'Problem-solving and system design skills'
            ],
            'growth_areas': [
                'Advanced machine learning and AI',
                'Leadership and team management',
                'Enterprise architecture patterns'
            ],
            'market_position': 'Strong',
            'next_steps': [
                'Consider technical leadership roles',
                'Expand cloud architecture expertise',
                'Develop team mentoring skills',
                'Explore emerging technologies'
            ],
            'industry_trends': [
                'AI/ML integration in web applications',
                'Serverless and microservices architecture',
                'DevOps and automation practices'
            ],
            'salary_range': 'Competitive senior developer range'
        }


# Global service instance
gemini_service = GeminiService()
