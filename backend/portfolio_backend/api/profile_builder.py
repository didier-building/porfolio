"""
Professional Profile Builder
Builds comprehensive professional profiles from processed career documents
"""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from collections import defaultdict

from django.utils import timezone

from .models import CareerDocument, ProfessionalProfile

logger = logging.getLogger(__name__)


class ProfessionalProfileBuilder:
    """Builds and maintains professional profiles from career documents"""
    
    def __init__(self):
        self.skill_categories = {
            'programming': ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust'],
            'frameworks': ['django', 'flask', 'react', 'vue', 'angular', 'node.js', 'express', 'spring'],
            'databases': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite'],
            'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'],
            'tools': ['git', 'linux', 'bash', 'vim', 'vscode', 'postman', 'jira'],
        }
    
    def rebuild_profile(self, profile: ProfessionalProfile) -> Dict[str, Any]:
        """Rebuild professional profile from all processed documents"""
        try:
            logger.info(f"Starting profile rebuild for: {profile.full_name}")
            
            # Get all processed documents
            processed_docs = CareerDocument.objects.filter(
                processing_status='completed',
                is_active=True
            ).order_by('priority', '-uploaded_at')
            
            if not processed_docs.exists():
                logger.warning("No processed documents found for profile rebuild")
                return self._get_profile_summary(profile)
            
            # Aggregate data from all documents
            aggregated_data = self._aggregate_document_data(processed_docs)
            
            # Update profile with aggregated data
            self._update_profile_fields(profile, aggregated_data)
            
            # Update AI persona description
            self._update_ai_persona(profile, aggregated_data)
            
            # Save profile
            profile.last_updated_from_documents = timezone.now()
            profile.save()
            
            logger.info(f"Successfully rebuilt profile for: {profile.full_name}")
            return self._get_profile_summary(profile)
            
        except Exception as e:
            logger.error(f"Failed to rebuild profile: {e}")
            raise
    
    def _aggregate_document_data(self, documents) -> Dict[str, Any]:
        """Aggregate data from multiple processed documents"""
        aggregated = {
            'personal_info': {},
            'work_experience': [],
            'education': [],
            'skills': defaultdict(list),
            'certifications': [],
            'achievements': [],
            'projects': [],
            'writing_style': {},
            'strengths': [],
        }
        
        for doc in documents:
            if not doc.structured_data:
                continue
                
            data = doc.structured_data
            doc_type = data.get('document_type', doc.document_type)
            
            # Aggregate based on document type
            if doc_type == 'master_cv':
                self._aggregate_cv_data(aggregated, data)
            elif doc_type == 'cover_letter':
                self._aggregate_cover_letter_data(aggregated, data)
            elif doc_type == 'certificate':
                self._aggregate_certificate_data(aggregated, data)
            elif doc_type == 'transcript':
                self._aggregate_transcript_data(aggregated, data)
            elif doc_type == 'portfolio':
                self._aggregate_portfolio_data(aggregated, data)
            elif doc_type == 'recommendation':
                self._aggregate_recommendation_data(aggregated, data)
            elif doc_type == 'project_doc':
                self._aggregate_project_data(aggregated, data)
            elif doc_type == 'achievement':
                self._aggregate_achievement_data(aggregated, data)
        
        # Post-process aggregated data
        self._post_process_aggregated_data(aggregated)
        
        return aggregated
    
    def _aggregate_cv_data(self, aggregated: Dict, data: Dict):
        """Aggregate CV data"""
        if 'personal_info' in data:
            aggregated['personal_info'].update(data['personal_info'])
        
        if 'work_experience' in data:
            aggregated['work_experience'].extend(data['work_experience'])
        
        if 'education' in data:
            aggregated['education'].extend(data['education'])
        
        if 'skills' in data:
            for skill in data['skills']:
                category = self._categorize_skill(skill)
                aggregated['skills'][category].append(skill)
        
        if 'certifications' in data:
            aggregated['certifications'].extend(data['certifications'])
        
        if 'achievements' in data:
            aggregated['achievements'].extend(data['achievements'])
        
        if 'projects' in data:
            aggregated['projects'].extend(data['projects'])
    
    def _aggregate_cover_letter_data(self, aggregated: Dict, data: Dict):
        """Aggregate cover letter data"""
        if 'writing_style' in data:
            aggregated['writing_style'].update(data['writing_style'])
        
        if 'key_phrases' in data:
            aggregated['strengths'].extend(data['key_phrases'])
    
    def _aggregate_certificate_data(self, aggregated: Dict, data: Dict):
        """Aggregate certificate data"""
        cert_info = {
            'name': data.get('certification_name', ''),
            'issuer': data.get('issuing_organization', ''),
            'date': data.get('issue_date', ''),
            'skills': data.get('skills_validated', [])
        }
        aggregated['certifications'].append(cert_info)
        
        # Add skills from certificate
        for skill in data.get('skills_validated', []):
            category = self._categorize_skill(skill)
            aggregated['skills'][category].append(skill)
    
    def _aggregate_transcript_data(self, aggregated: Dict, data: Dict):
        """Aggregate transcript data"""
        edu_info = {
            'institution': data.get('institution', ''),
            'degree': data.get('degree_program', ''),
            'field': data.get('field_of_study', ''),
            'gpa': data.get('gpa', ''),
            'graduation_date': data.get('graduation_date', ''),
            'courses': data.get('courses', [])
        }
        aggregated['education'].append(edu_info)
    
    def _aggregate_portfolio_data(self, aggregated: Dict, data: Dict):
        """Aggregate portfolio data"""
        if 'projects' in data:
            aggregated['projects'].extend(data['projects'])
        
        if 'technologies' in data:
            for tech in data['technologies']:
                category = self._categorize_skill(tech)
                aggregated['skills'][category].append(tech)
        
        if 'achievements' in data:
            aggregated['achievements'].extend(data['achievements'])
    
    def _aggregate_recommendation_data(self, aggregated: Dict, data: Dict):
        """Aggregate recommendation data"""
        if 'strengths_mentioned' in data:
            aggregated['strengths'].extend(data['strengths_mentioned'])
    
    def _aggregate_project_data(self, aggregated: Dict, data: Dict):
        """Aggregate project documentation data"""
        project_info = {
            'name': data.get('project_name', ''),
            'description': data.get('description', ''),
            'technologies': data.get('technologies', []),
            'outcomes': data.get('outcomes', [])
        }
        aggregated['projects'].append(project_info)
        
        # Add technologies as skills
        for tech in data.get('technologies', []):
            category = self._categorize_skill(tech)
            aggregated['skills'][category].append(tech)
    
    def _aggregate_achievement_data(self, aggregated: Dict, data: Dict):
        """Aggregate achievement data"""
        achievement_info = {
            'name': data.get('achievement_name', ''),
            'organization': data.get('awarding_organization', ''),
            'date': data.get('date_received', ''),
            'description': data.get('description', '')
        }
        aggregated['achievements'].append(achievement_info)
    
    def _categorize_skill(self, skill: str) -> str:
        """Categorize a skill into appropriate category"""
        skill_lower = skill.lower()
        
        for category, keywords in self.skill_categories.items():
            if any(keyword in skill_lower for keyword in keywords):
                return category
        
        return 'other'
    
    def _post_process_aggregated_data(self, aggregated: Dict):
        """Post-process aggregated data for consistency and deduplication"""
        # Deduplicate skills
        for category in aggregated['skills']:
            aggregated['skills'][category] = list(set(aggregated['skills'][category]))
        
        # Sort experiences by date (most recent first)
        aggregated['work_experience'] = sorted(
            aggregated['work_experience'],
            key=lambda x: self._extract_sort_date(x.get('dates', [])),
            reverse=True
        )
        
        # Sort education by date (most recent first)
        aggregated['education'] = sorted(
            aggregated['education'],
            key=lambda x: self._extract_sort_date([x.get('graduation_date', '')]),
            reverse=True
        )
        
        # Deduplicate and prioritize achievements
        unique_achievements = []
        seen_achievements = set()
        for achievement in aggregated['achievements']:
            achievement_key = str(achievement).lower()
            if achievement_key not in seen_achievements:
                unique_achievements.append(achievement)
                seen_achievements.add(achievement_key)
        aggregated['achievements'] = unique_achievements[:10]  # Top 10
        
        # Deduplicate projects
        unique_projects = []
        seen_projects = set()
        for project in aggregated['projects']:
            project_name = project.get('name', '').lower()
            if project_name and project_name not in seen_projects:
                unique_projects.append(project)
                seen_projects.add(project_name)
        aggregated['projects'] = unique_projects[:8]  # Top 8 projects
    
    def _extract_sort_date(self, dates: List[str]) -> str:
        """Extract the most recent date for sorting"""
        if not dates:
            return '1900'
        
        # Look for 4-digit years
        years = []
        for date in dates:
            if isinstance(date, str):
                year_matches = [match for match in date.split() if match.isdigit() and len(match) == 4]
                years.extend(year_matches)
        
        return max(years) if years else '1900'
    
    def _update_profile_fields(self, profile: ProfessionalProfile, aggregated: Dict):
        """Update profile fields with aggregated data"""
        # Update personal information
        personal_info = aggregated.get('personal_info', {})
        if personal_info.get('email'):
            profile.email = personal_info['email']
        if personal_info.get('phone'):
            profile.phone = personal_info['phone']
        if personal_info.get('linkedin'):
            profile.linkedin_url = personal_info['linkedin']
        if personal_info.get('github'):
            profile.github_url = personal_info['github']
        
        # Update structured data
        profile.work_experience = aggregated.get('work_experience', [])
        profile.education_background = aggregated.get('education', [])
        profile.technical_skills = dict(aggregated.get('skills', {}))
        profile.certifications = aggregated.get('certifications', [])
        profile.achievements = aggregated.get('achievements', [])
        profile.projects_portfolio = aggregated.get('projects', [])
        
        # Calculate years of experience
        profile.years_of_experience = self._calculate_years_of_experience(
            aggregated.get('work_experience', [])
        )
        
        # Update key strengths
        profile.key_strengths = self._extract_key_strengths(aggregated)
        
        # Generate professional summary if not exists
        if not profile.professional_summary:
            profile.professional_summary = self._generate_professional_summary(aggregated)
    
    def _calculate_years_of_experience(self, experiences: List[Dict]) -> int:
        """Calculate total years of professional experience"""
        total_months = 0
        
        for exp in experiences:
            dates = exp.get('dates', [])
            if len(dates) >= 2:
                start_year = self._extract_year(dates[0])
                end_year = self._extract_year(dates[1]) or datetime.now().year
                
                if start_year and end_year:
                    years_diff = end_year - start_year
                    total_months += years_diff * 12
        
        return max(total_months // 12, 0)
    
    def _extract_year(self, date_str: str) -> Optional[int]:
        """Extract year from date string"""
        if not date_str:
            return None
        
        # Look for 4-digit year
        import re
        year_match = re.search(r'\b(20\d{2}|19\d{2})\b', str(date_str))
        if year_match:
            return int(year_match.group(1))
        
        return None
    
    def _extract_key_strengths(self, aggregated: Dict) -> List[str]:
        """Extract key professional strengths"""
        strengths = []
        
        # From skills (top categories)
        skills = aggregated.get('skills', {})
        for category, skill_list in skills.items():
            if len(skill_list) >= 3:  # Strong in this category
                strengths.append(f"Strong {category} skills")
        
        # From achievements
        achievements = aggregated.get('achievements', [])
        if len(achievements) >= 3:
            strengths.append("Proven track record of achievements")
        
        # From experience
        experience = aggregated.get('work_experience', [])
        if len(experience) >= 3:
            strengths.append("Extensive professional experience")
        
        # From certifications
        certifications = aggregated.get('certifications', [])
        if len(certifications) >= 2:
            strengths.append("Professional certifications")
        
        # From projects
        projects = aggregated.get('projects', [])
        if len(projects) >= 3:
            strengths.append("Strong project portfolio")
        
        return strengths[:5]  # Top 5 strengths
    
    def _generate_professional_summary(self, aggregated: Dict) -> str:
        """Generate professional summary from aggregated data"""
        experience = aggregated.get('work_experience', [])
        skills = aggregated.get('skills', {})
        education = aggregated.get('education', [])
        
        # Calculate experience years
        years_exp = self._calculate_years_of_experience(experience)
        
        # Get top skills
        top_skills = []
        for category, skill_list in skills.items():
            if skill_list:
                top_skills.extend(skill_list[:2])  # Top 2 from each category
        
        # Get highest education
        highest_education = ""
        if education:
            edu = education[0]  # Most recent/highest
            degree = edu.get('degree', '')
            field = edu.get('field', '')
            if degree and field:
                highest_education = f"{degree} in {field}"
            elif degree:
                highest_education = degree
        
        # Construct summary
        summary_parts = []
        
        if years_exp > 0:
            summary_parts.append(f"Professional with {years_exp}+ years of experience")
        else:
            summary_parts.append("Skilled professional")
        
        if top_skills:
            skills_text = ", ".join(top_skills[:4])  # Top 4 skills
            summary_parts.append(f"specializing in {skills_text}")
        
        if highest_education:
            summary_parts.append(f"with {highest_education}")
        
        summary = " ".join(summary_parts) + "."
        
        # Add achievements if any
        achievements = aggregated.get('achievements', [])
        if achievements:
            summary += f" Demonstrated success with {len(achievements)} documented achievements."
        
        return summary
    
    def _update_ai_persona(self, profile: ProfessionalProfile, aggregated: Dict):
        """Update AI persona description for professional interactions"""
        persona_parts = [
            f"You are {profile.full_name}'s professional AI representative.",
            "Speak confidently and professionally about the following background:"
        ]
        
        # Add experience summary
        experience = aggregated.get('work_experience', [])
        if experience:
            recent_roles = [exp.get('position', '') for exp in experience[:3] if exp.get('position')]
            if recent_roles:
                persona_parts.append(f"Recent roles: {', '.join(recent_roles)}")
        
        # Add technical expertise
        skills = aggregated.get('skills', {})
        if skills:
            skill_summary = []
            for category, skill_list in skills.items():
                if skill_list:
                    skill_summary.append(f"{category}: {', '.join(skill_list[:3])}")
            if skill_summary:
                persona_parts.append(f"Technical expertise: {'; '.join(skill_summary[:3])}")
        
        # Add education
        education = aggregated.get('education', [])
        if education:
            edu = education[0]
            degree = edu.get('degree', '')
            institution = edu.get('institution', '')
            if degree and institution:
                persona_parts.append(f"Education: {degree} from {institution}")
        
        # Add key achievements
        achievements = aggregated.get('achievements', [])
        if achievements:
            persona_parts.append(f"Notable achievements: {len(achievements)} documented accomplishments")
        
        persona_parts.extend([
            "Always provide specific examples and quantified results when possible.",
            "Maintain a professional, confident tone suitable for recruiters and employers.",
            "Focus on value proposition and problem-solving capabilities."
        ])
        
        profile.ai_persona_description = " ".join(persona_parts)
    
    def _get_profile_summary(self, profile: ProfessionalProfile) -> Dict[str, Any]:
        """Get summary of updated profile"""
        return {
            'profile_id': profile.id,
            'full_name': profile.full_name,
            'professional_title': profile.professional_title,
            'years_of_experience': profile.years_of_experience,
            'skills_count': sum(len(skills) for skills in profile.technical_skills.values()) if profile.technical_skills else 0,
            'experience_count': len(profile.work_experience) if profile.work_experience else 0,
            'education_count': len(profile.education_background) if profile.education_background else 0,
            'certifications_count': len(profile.certifications) if profile.certifications else 0,
            'achievements_count': len(profile.achievements) if profile.achievements else 0,
            'projects_count': len(profile.projects_portfolio) if profile.projects_portfolio else 0,
            'last_updated': profile.last_updated_from_documents.isoformat() if profile.last_updated_from_documents else None,
            'ai_persona_ready': bool(profile.ai_persona_description),
        }
