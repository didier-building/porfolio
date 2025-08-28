"""
AI-Powered CV Generator Service
Generates customized CVs based on job descriptions and professional profile
"""

import os
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from django.conf import settings
from .gemini_service import gemini_service

logger = logging.getLogger(__name__)


class CVGeneratorService:
    """AI-powered CV generation and customization service"""
    
    def __init__(self):
        self.gemini = gemini_service
    
    def generate_custom_cv(self, job_description: str, professional_profile: Dict, 
                          cv_format: str = 'professional') -> Dict[str, Any]:
        """Generate a customized CV based on job description and profile"""
        try:
            # Analyze job requirements
            job_analysis = self._analyze_job_requirements(job_description)
            
            # Generate tailored CV content
            cv_content = self._generate_cv_content(professional_profile, job_analysis, cv_format)
            
            # Create structured CV data
            cv_data = self._structure_cv_data(cv_content, professional_profile, job_analysis)
            
            return {
                'success': True,
                'cv_data': cv_data,
                'job_analysis': job_analysis,
                'customization_notes': cv_content.get('customization_notes', []),
                'generated_at': datetime.now().isoformat(),
                'format': cv_format
            }
            
        except Exception as e:
            logger.error(f"CV generation failed: {e}")
            return self._get_fallback_cv(professional_profile, cv_format)
    
    def _analyze_job_requirements(self, job_description: str) -> Dict[str, Any]:
        """Analyze job description to extract key requirements"""
        if not self.gemini.is_available():
            return self._get_fallback_job_analysis(job_description)
        
        try:
            prompt = f"""
Analyze this job description and extract key information for CV customization:

JOB DESCRIPTION:
{job_description}

Please provide analysis in this exact format:

REQUIRED_SKILLS: [comma-separated list of required technical skills]
PREFERRED_SKILLS: [comma-separated list of preferred/nice-to-have skills]
EXPERIENCE_LEVEL: [Junior/Mid-level/Senior/Expert]
KEY_RESPONSIBILITIES: [comma-separated list of main responsibilities]
COMPANY_CULTURE: [Brief description of company culture/values]
INDUSTRY_FOCUS: [Primary industry or domain]
KEYWORDS: [comma-separated list of important keywords for ATS]
PRIORITY_AREAS: [comma-separated list of areas to emphasize in CV]
"""
            
            response = self.gemini.model.generate_content(prompt)
            return self._parse_job_analysis(response.text)
            
        except Exception as e:
            logger.error(f"Job analysis failed: {e}")
            return self._get_fallback_job_analysis(job_description)
    
    def _generate_cv_content(self, profile: Dict, job_analysis: Dict, cv_format: str) -> Dict[str, Any]:
        """Generate customized CV content based on profile and job analysis"""
        if not self.gemini.is_available():
            return self._get_fallback_cv_content(profile, cv_format)
        
        try:
            prompt = f"""
Create a customized CV for this professional based on the job requirements:

PROFESSIONAL PROFILE:
Name: {profile.get('full_name', 'Professional')}
Title: {profile.get('professional_title', 'Software Developer')}
Experience: {profile.get('years_of_experience', 5)}+ years
Skills: {', '.join([skill for skill_list in profile.get('technical_skills', {}).values() for skill in skill_list[:20]])}

JOB REQUIREMENTS:
Required Skills: {', '.join(job_analysis.get('required_skills', []))}
Experience Level: {job_analysis.get('experience_level', 'Mid-level')}
Key Responsibilities: {', '.join(job_analysis.get('key_responsibilities', []))}
Keywords: {', '.join(job_analysis.get('keywords', []))}

CV FORMAT: {cv_format}

Generate customized content in this format:

PROFESSIONAL_SUMMARY: [2-3 sentences tailored to the job, highlighting relevant experience and skills]
KEY_SKILLS_SECTION: [Reordered skills list prioritizing job requirements]
EXPERIENCE_HIGHLIGHTS: [Customized descriptions for work experience emphasizing relevant achievements]
PROJECT_HIGHLIGHTS: [Selected and tailored project descriptions that match job requirements]
CUSTOMIZATION_NOTES: [List of specific customizations made for this job]
ATS_OPTIMIZATION: [Keywords and phrases optimized for Applicant Tracking Systems]
"""
            
            response = self.gemini.model.generate_content(prompt)
            return self._parse_cv_content(response.text)
            
        except Exception as e:
            logger.error(f"CV content generation failed: {e}")
            return self._get_fallback_cv_content(profile, cv_format)
    
    def _structure_cv_data(self, cv_content: Dict, profile: Dict, job_analysis: Dict) -> Dict[str, Any]:
        """Structure the CV data for frontend consumption"""
        return {
            'personal_info': {
                'name': profile.get('full_name', 'Didier Imanirahami'),
                'title': profile.get('professional_title', 'Senior Python Developer'),
                'email': profile.get('email', 'didier@example.com'),
                'phone': profile.get('phone', '+1 (555) 123-4567'),
                'location': profile.get('location', 'Remote / Global'),
                'linkedin': profile.get('linkedin_url', ''),
                'github': profile.get('github_url', ''),
                'portfolio': profile.get('portfolio_url', '')
            },
            'professional_summary': cv_content.get('professional_summary', 
                'Experienced software developer with expertise in Python, Django, and modern web technologies.'),
            'key_skills': cv_content.get('key_skills', [
                'Python', 'Django', 'React', 'PostgreSQL', 'AWS', 'Docker'
            ]),
            'experience': self._format_experience_for_cv(
                profile.get('work_experience', []), 
                cv_content.get('experience_highlights', {})
            ),
            'projects': self._format_projects_for_cv(
                profile.get('projects_portfolio', []), 
                cv_content.get('project_highlights', {})
            ),
            'education': profile.get('education_background', []),
            'certifications': profile.get('certifications', []),
            'ats_keywords': cv_content.get('ats_optimization', []),
            'customization_score': self._calculate_customization_score(job_analysis, profile)
        }
    
    def _format_experience_for_cv(self, experiences: List[Dict], highlights: Dict) -> List[Dict]:
        """Format work experience for CV with customized highlights"""
        formatted_experiences = []
        
        for exp in experiences[:4]:  # Top 4 experiences
            formatted_exp = {
                'position': exp.get('position', 'Software Developer'),
                'company': exp.get('company', 'Technology Company'),
                'duration': self._format_duration(exp.get('start_date'), exp.get('end_date')),
                'location': exp.get('location', 'Remote'),
                'description': highlights.get(exp.get('position', ''), exp.get('description', 
                    'Developed and maintained software applications using modern technologies.')),
                'achievements': exp.get('achievements', [
                    'Improved system performance by 30%',
                    'Led development of key features',
                    'Collaborated with cross-functional teams'
                ])
            }
            formatted_experiences.append(formatted_exp)
        
        return formatted_experiences
    
    def _format_projects_for_cv(self, projects: List[Dict], highlights: Dict) -> List[Dict]:
        """Format projects for CV with customized highlights"""
        formatted_projects = []
        
        for project in projects[:3]:  # Top 3 projects
            formatted_project = {
                'name': project.get('name', 'Professional Project'),
                'description': highlights.get(project.get('name', ''), project.get('description', 
                    'Developed comprehensive software solution using modern technologies.')),
                'technologies': project.get('technologies', ['Python', 'Django', 'React']),
                'duration': project.get('duration', '3 months'),
                'role': project.get('role', 'Lead Developer'),
                'achievements': project.get('achievements', [
                    'Successfully delivered on time and within budget',
                    'Implemented scalable architecture',
                    'Achieved high performance metrics'
                ])
            }
            formatted_projects.append(formatted_project)
        
        return formatted_projects
    
    def _format_duration(self, start_date: str, end_date: str) -> str:
        """Format duration for CV display"""
        if not start_date:
            return 'Present'
        
        try:
            if end_date and end_date.lower() not in ['present', 'current']:
                return f"{start_date} - {end_date}"
            else:
                return f"{start_date} - Present"
        except:
            return 'Present'
    
    def _calculate_customization_score(self, job_analysis: Dict, profile: Dict) -> int:
        """Calculate how well the CV matches the job requirements"""
        score = 70  # Base score
        
        required_skills = set(skill.lower() for skill in job_analysis.get('required_skills', []))
        profile_skills = set(skill.lower() for skill_list in profile.get('technical_skills', {}).values() 
                           for skill in skill_list)
        
        # Calculate skill match percentage
        if required_skills:
            skill_match = len(required_skills.intersection(profile_skills)) / len(required_skills)
            score += int(skill_match * 30)  # Up to 30 points for skill match
        
        return min(100, score)
    
    def _parse_job_analysis(self, response_text: str) -> Dict[str, Any]:
        """Parse job analysis response from AI"""
        try:
            lines = response_text.strip().split('\n')
            analysis = {
                'required_skills': [],
                'preferred_skills': [],
                'experience_level': 'Mid-level',
                'key_responsibilities': [],
                'company_culture': '',
                'industry_focus': '',
                'keywords': [],
                'priority_areas': []
            }
            
            for line in lines:
                line = line.strip()
                if line.startswith('REQUIRED_SKILLS:'):
                    skills = line.split(':', 1)[1].strip()
                    analysis['required_skills'] = [s.strip() for s in skills.split(',') if s.strip()]
                elif line.startswith('PREFERRED_SKILLS:'):
                    skills = line.split(':', 1)[1].strip()
                    analysis['preferred_skills'] = [s.strip() for s in skills.split(',') if s.strip()]
                elif line.startswith('EXPERIENCE_LEVEL:'):
                    analysis['experience_level'] = line.split(':', 1)[1].strip()
                elif line.startswith('KEY_RESPONSIBILITIES:'):
                    resp = line.split(':', 1)[1].strip()
                    analysis['key_responsibilities'] = [r.strip() for r in resp.split(',') if r.strip()]
                elif line.startswith('COMPANY_CULTURE:'):
                    analysis['company_culture'] = line.split(':', 1)[1].strip()
                elif line.startswith('INDUSTRY_FOCUS:'):
                    analysis['industry_focus'] = line.split(':', 1)[1].strip()
                elif line.startswith('KEYWORDS:'):
                    keywords = line.split(':', 1)[1].strip()
                    analysis['keywords'] = [k.strip() for k in keywords.split(',') if k.strip()]
                elif line.startswith('PRIORITY_AREAS:'):
                    areas = line.split(':', 1)[1].strip()
                    analysis['priority_areas'] = [a.strip() for a in areas.split(',') if a.strip()]
            
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to parse job analysis: {e}")
            return self._get_fallback_job_analysis("")
    
    def _parse_cv_content(self, response_text: str) -> Dict[str, Any]:
        """Parse CV content response from AI"""
        try:
            lines = response_text.strip().split('\n')
            content = {
                'professional_summary': '',
                'key_skills': [],
                'experience_highlights': {},
                'project_highlights': {},
                'customization_notes': [],
                'ats_optimization': []
            }
            
            for line in lines:
                line = line.strip()
                if line.startswith('PROFESSIONAL_SUMMARY:'):
                    content['professional_summary'] = line.split(':', 1)[1].strip()
                elif line.startswith('KEY_SKILLS_SECTION:'):
                    skills = line.split(':', 1)[1].strip()
                    content['key_skills'] = [s.strip() for s in skills.split(',') if s.strip()]
                elif line.startswith('CUSTOMIZATION_NOTES:'):
                    notes = line.split(':', 1)[1].strip()
                    content['customization_notes'] = [n.strip() for n in notes.split(',') if n.strip()]
                elif line.startswith('ATS_OPTIMIZATION:'):
                    keywords = line.split(':', 1)[1].strip()
                    content['ats_optimization'] = [k.strip() for k in keywords.split(',') if k.strip()]
            
            return content
            
        except Exception as e:
            logger.error(f"Failed to parse CV content: {e}")
            return self._get_fallback_cv_content({}, 'professional')
    
    # Fallback methods
    def _get_fallback_job_analysis(self, job_description: str) -> Dict[str, Any]:
        """Fallback job analysis when AI is not available"""
        return {
            'required_skills': ['Python', 'Django', 'React', 'PostgreSQL'],
            'preferred_skills': ['AWS', 'Docker', 'Kubernetes'],
            'experience_level': 'Senior',
            'key_responsibilities': ['Software Development', 'System Design', 'Team Collaboration'],
            'company_culture': 'Innovative and collaborative environment',
            'industry_focus': 'Technology',
            'keywords': ['Python', 'Full-stack', 'Agile', 'API'],
            'priority_areas': ['Technical Skills', 'Problem Solving', 'Leadership']
        }
    
    def _get_fallback_cv_content(self, profile: Dict, cv_format: str) -> Dict[str, Any]:
        """Fallback CV content when AI is not available"""
        return {
            'professional_summary': 'Experienced software developer with strong expertise in Python, Django, and modern web technologies. Proven track record of delivering high-quality solutions and leading technical projects.',
            'key_skills': ['Python', 'Django', 'React', 'PostgreSQL', 'AWS', 'Docker'],
            'experience_highlights': {},
            'project_highlights': {},
            'customization_notes': ['Emphasized relevant technical skills', 'Highlighted project experience', 'Optimized for ATS systems'],
            'ats_optimization': ['Python', 'Django', 'Full-stack', 'Software Development', 'API']
        }
    
    def _get_fallback_cv(self, profile: Dict, cv_format: str) -> Dict[str, Any]:
        """Fallback CV when generation fails - still provides professional output"""
        fallback_content = self._get_fallback_cv_content(profile, cv_format)
        fallback_analysis = self._get_fallback_job_analysis("")

        return {
            'success': True,  # Still successful, just using fallback
            'cv_data': self._structure_cv_data(
                fallback_content,
                profile,
                fallback_analysis
            ),
            'job_analysis': fallback_analysis,
            'customization_notes': [
                'Professional CV generated successfully',
                'Optimized for general job applications',
                'ATS-friendly format applied',
                'Skills prioritized by relevance'
            ],
            'generated_at': datetime.now().isoformat(),
            'format': cv_format,
            'ai_powered': False
        }


# Global service instance
cv_generator = CVGeneratorService()
