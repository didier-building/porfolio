"""
Professional Career Document Processing Pipeline
Handles text extraction and structured data processing from career documents
"""

import os
import re
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path

import PyPDF2
import docx
from django.conf import settings
from django.utils import timezone

from .models import CareerDocument, ProfessionalProfile

logger = logging.getLogger(__name__)


class CareerDocumentProcessor:
    """Enhanced document processor for career documents"""
    
    def __init__(self):
        self.skill_keywords = self._load_skill_keywords()
        self.experience_patterns = self._load_experience_patterns()
        self.education_patterns = self._load_education_patterns()
    
    def process_document(self, document: CareerDocument) -> Dict[str, Any]:
        """Main processing method for career documents"""
        try:
            # Update processing status
            document.processing_status = 'processing'
            document.save()
            
            # Extract text based on file type
            extracted_text = self._extract_text(document)
            if not extracted_text:
                raise ValueError("No text could be extracted from document")
            
            # Store extracted text
            document.extracted_text = extracted_text
            
            # Process based on document type
            structured_data = self._process_by_type(document.document_type, extracted_text)
            
            # Store structured data
            document.structured_data = structured_data
            document.processing_status = 'completed'
            document.processed_at = timezone.now()
            document.processing_notes = f"Successfully processed {len(extracted_text)} characters"
            
            document.save()
            
            logger.info(f"Successfully processed document: {document.id}")
            return structured_data
            
        except Exception as e:
            logger.error(f"Error processing document {document.id}: {e}")
            document.processing_status = 'failed'
            document.processing_notes = f"Processing failed: {str(e)}"
            document.save()
            raise
    
    def _extract_text(self, document: CareerDocument) -> str:
        """Extract text from various file formats"""
        try:
            file_path = document.file.path
            file_extension = document.file_type.lower()
            
            if file_extension == 'pdf':
                return self._extract_pdf_text(file_path)
            elif file_extension in ['doc', 'docx']:
                return self._extract_docx_text(file_path)
            elif file_extension == 'txt':
                return self._extract_txt_text(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
                
        except Exception as e:
            logger.error(f"Text extraction failed for {document.id}: {e}")
            return ""
    
    def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF files"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"PDF text extraction error: {e}")
            return ""
    
    def _extract_docx_text(self, file_path: str) -> str:
        """Extract text from Word documents"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"DOCX text extraction error: {e}")
            return ""
    
    def _extract_txt_text(self, file_path: str) -> str:
        """Extract text from plain text files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read().strip()
        except Exception as e:
            logger.error(f"TXT text extraction error: {e}")
            return ""
    
    def _process_by_type(self, doc_type: str, text: str) -> Dict[str, Any]:
        """Process document based on its type"""
        processors = {
            'master_cv': self._process_cv,
            'cover_letter': self._process_cover_letter,
            'certificate': self._process_certificate,
            'transcript': self._process_transcript,
            'portfolio': self._process_portfolio,
            'recommendation': self._process_recommendation,
            'project_doc': self._process_project_doc,
            'achievement': self._process_achievement,
            'other': self._process_generic,
        }
        
        processor = processors.get(doc_type, self._process_generic)
        return processor(text)
    
    def _process_cv(self, text: str) -> Dict[str, Any]:
        """Process CV/Resume documents"""
        return {
            'document_type': 'master_cv',
            'personal_info': self._extract_personal_info(text),
            'work_experience': self._extract_work_experience(text),
            'education': self._extract_education(text),
            'skills': self._extract_skills(text),
            'achievements': self._extract_achievements(text),
            'certifications': self._extract_certifications(text),
            'projects': self._extract_projects(text),
            'summary': self._extract_professional_summary(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_cover_letter(self, text: str) -> Dict[str, Any]:
        """Process cover letter templates"""
        return {
            'document_type': 'cover_letter',
            'writing_style': self._analyze_writing_style(text),
            'key_phrases': self._extract_key_phrases(text),
            'professional_tone': self._analyze_professional_tone(text),
            'structure': self._analyze_document_structure(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_certificate(self, text: str) -> Dict[str, Any]:
        """Process professional certificates"""
        return {
            'document_type': 'certificate',
            'certification_name': self._extract_certification_name(text),
            'issuing_organization': self._extract_issuing_org(text),
            'issue_date': self._extract_dates(text),
            'skills_validated': self._extract_skills(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_transcript(self, text: str) -> Dict[str, Any]:
        """Process academic transcripts"""
        return {
            'document_type': 'transcript',
            'institution': self._extract_institution(text),
            'degree_program': self._extract_degree_program(text),
            'courses': self._extract_courses(text),
            'gpa': self._extract_gpa(text),
            'graduation_date': self._extract_dates(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_portfolio(self, text: str) -> Dict[str, Any]:
        """Process portfolio documents"""
        return {
            'document_type': 'portfolio',
            'projects': self._extract_projects(text),
            'technologies': self._extract_technologies(text),
            'achievements': self._extract_achievements(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_recommendation(self, text: str) -> Dict[str, Any]:
        """Process recommendation letters"""
        return {
            'document_type': 'recommendation',
            'recommender_info': self._extract_recommender_info(text),
            'strengths_mentioned': self._extract_strengths(text),
            'specific_examples': self._extract_examples(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_project_doc(self, text: str) -> Dict[str, Any]:
        """Process project documentation"""
        return {
            'document_type': 'project_doc',
            'project_name': self._extract_project_name(text),
            'technologies': self._extract_technologies(text),
            'description': self._extract_project_description(text),
            'outcomes': self._extract_project_outcomes(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_achievement(self, text: str) -> Dict[str, Any]:
        """Process achievement/award documents"""
        return {
            'document_type': 'achievement',
            'achievement_name': self._extract_achievement_name(text),
            'awarding_organization': self._extract_awarding_org(text),
            'date_received': self._extract_dates(text),
            'description': self._extract_achievement_description(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    def _process_generic(self, text: str) -> Dict[str, Any]:
        """Generic processing for other document types"""
        return {
            'document_type': 'other',
            'key_information': self._extract_key_information(text),
            'skills_mentioned': self._extract_skills(text),
            'dates_found': self._extract_dates(text),
            'processed_at': timezone.now().isoformat(),
        }
    
    # Helper methods for data extraction
    def _load_skill_keywords(self) -> List[str]:
        """Load technical skill keywords for recognition"""
        return [
            # Programming Languages
            'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
            'kotlin', 'typescript', 'scala', 'r', 'matlab', 'sql', 'html', 'css',
            
            # Frameworks & Libraries
            'django', 'flask', 'fastapi', 'react', 'vue', 'angular', 'node.js', 'express',
            'spring', 'laravel', 'rails', 'asp.net', 'bootstrap', 'tailwind',
            
            # Databases
            'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
            'oracle', 'cassandra', 'dynamodb',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab',
            'terraform', 'ansible', 'nginx', 'apache',
            
            # Tools & Technologies
            'git', 'linux', 'bash', 'vim', 'vscode', 'intellij', 'postman',
            'jira', 'confluence', 'slack', 'figma',
        ]
    
    def _load_experience_patterns(self) -> List[str]:
        """Load regex patterns for experience extraction"""
        return [
            r'(\d{1,2}\/\d{4})\s*[-–]\s*(\d{1,2}\/\d{4}|present|current)',
            r'(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|present|current)',
            r'(\d{4})\s*[-–]\s*(\d{4}|present|current)',
        ]
    
    def _load_education_patterns(self) -> List[str]:
        """Load regex patterns for education extraction"""
        return [
            r'(bachelor|master|phd|doctorate|associate|diploma|certificate)',
            r'(university|college|institute|school)',
            r'(computer science|engineering|business|mathematics|physics)',
        ]

    def _categorize_skill(self, skill: str) -> str:
        """Categorize a skill into appropriate category"""
        skill_lower = skill.lower()

        skill_categories = {
            'programming': ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust'],
            'frameworks': ['django', 'flask', 'react', 'vue', 'angular', 'node.js', 'express', 'spring'],
            'databases': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite'],
            'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'],
            'tools': ['git', 'linux', 'bash', 'vim', 'vscode', 'postman', 'jira'],
        }

        for category, keywords in skill_categories.items():
            if any(keyword in skill_lower for keyword in keywords):
                return category

        return 'other'

    # Data extraction helper methods
    def _extract_personal_info(self, text: str) -> Dict[str, Any]:
        """Extract personal information from text"""
        info = {}

        # Email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            info['email'] = emails[0]

        # Phone extraction
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        if phones:
            info['phone'] = ''.join(phones[0]) if isinstance(phones[0], tuple) else phones[0]

        # LinkedIn extraction
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            info['linkedin'] = f"https://{linkedin.group()}"

        # GitHub extraction
        github_pattern = r'github\.com/[\w-]+'
        github = re.search(github_pattern, text, re.IGNORECASE)
        if github:
            info['github'] = f"https://{github.group()}"

        return info

    def _extract_work_experience(self, text: str) -> List[Dict[str, Any]]:
        """Extract work experience from text"""
        experiences = []

        # Look for common experience section headers
        experience_sections = re.split(
            r'(?i)(experience|employment|work history|professional experience|career)',
            text
        )

        if len(experience_sections) > 1:
            experience_text = experience_sections[2] if len(experience_sections) > 2 else experience_sections[1]

            # Split by potential job entries (look for dates or company patterns)
            job_entries = re.split(r'\n(?=\d{4}|\w+\s+\d{4})', experience_text)

            for entry in job_entries[:5]:  # Limit to 5 most recent
                if len(entry.strip()) > 50:  # Filter out short entries
                    exp = self._parse_experience_entry(entry.strip())
                    if exp:
                        experiences.append(exp)

        return experiences

    def _parse_experience_entry(self, entry: str) -> Optional[Dict[str, Any]]:
        """Parse individual experience entry"""
        lines = [line.strip() for line in entry.split('\n') if line.strip()]
        if len(lines) < 2:
            return None

        # Try to extract dates
        dates = self._extract_dates(entry)

        # Try to identify company and position
        company = ""
        position = ""
        description = ""

        # Heuristic: first line often contains position/company
        if lines:
            first_line = lines[0]
            # Look for common separators
            if ' at ' in first_line:
                parts = first_line.split(' at ')
                position = parts[0].strip()
                company = parts[1].strip()
            elif ' - ' in first_line:
                parts = first_line.split(' - ')
                position = parts[0].strip()
                company = parts[1].strip() if len(parts) > 1 else ""
            else:
                position = first_line

        # Description is usually the remaining lines
        if len(lines) > 1:
            description = '\n'.join(lines[1:])

        return {
            'position': position,
            'company': company,
            'description': description,
            'dates': dates,
            'skills_used': self._extract_skills(entry)
        }

    def _extract_education(self, text: str) -> List[Dict[str, Any]]:
        """Extract education information from text"""
        education = []

        # Look for education section
        education_sections = re.split(
            r'(?i)(education|academic|qualifications|degrees)',
            text
        )

        if len(education_sections) > 1:
            education_text = education_sections[2] if len(education_sections) > 2 else education_sections[1]

            # Look for degree patterns
            degree_patterns = [
                r'(bachelor|master|phd|doctorate|associate|diploma|certificate).*?(?=\n\n|\n[A-Z]|$)',
                r'(university|college|institute).*?(?=\n\n|\n[A-Z]|$)',
            ]

            for pattern in degree_patterns:
                matches = re.finditer(pattern, education_text, re.IGNORECASE | re.DOTALL)
                for match in matches:
                    edu_entry = self._parse_education_entry(match.group())
                    if edu_entry:
                        education.append(edu_entry)

        return education[:3]  # Limit to 3 entries

    def _parse_education_entry(self, entry: str) -> Optional[Dict[str, Any]]:
        """Parse individual education entry"""
        # Extract degree type
        degree_pattern = r'(bachelor|master|phd|doctorate|associate|diploma|certificate)'
        degree_match = re.search(degree_pattern, entry, re.IGNORECASE)
        degree = degree_match.group(1) if degree_match else ""

        # Extract institution
        institution_pattern = r'(university|college|institute|school)[\w\s]*'
        institution_match = re.search(institution_pattern, entry, re.IGNORECASE)
        institution = institution_match.group() if institution_match else ""

        # Extract field of study
        field_pattern = r'(computer science|engineering|business|mathematics|physics|science|arts|literature)'
        field_match = re.search(field_pattern, entry, re.IGNORECASE)
        field = field_match.group() if field_match else ""

        # Extract dates
        dates = self._extract_dates(entry)

        return {
            'degree': degree,
            'institution': institution,
            'field_of_study': field,
            'dates': dates
        }

    def _extract_skills(self, text: str) -> List[str]:
        """Extract technical skills from text"""
        found_skills = []
        text_lower = text.lower()

        for skill in self.skill_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)

        # Also look for skills in common sections
        skills_sections = re.split(r'(?i)(skills|technologies|technical|tools)', text)
        if len(skills_sections) > 1:
            skills_text = skills_sections[2] if len(skills_sections) > 2 else skills_sections[1]

            # Extract comma-separated or bullet-pointed skills
            skill_items = re.findall(r'[•\-\*]?\s*([A-Za-z0-9+#\.]+(?:\s+[A-Za-z0-9+#\.]+)*)', skills_text)
            for item in skill_items:
                if item.strip() and len(item.strip()) > 1:
                    found_skills.append(item.strip())

        return list(set(found_skills))  # Remove duplicates

    def _extract_dates(self, text: str) -> List[str]:
        """Extract dates from text"""
        date_patterns = [
            r'\b\d{1,2}\/\d{4}\b',  # MM/YYYY
            r'\b\d{4}\b',           # YYYY
            r'\b\w+\s+\d{4}\b',     # Month YYYY
            r'\b\d{1,2}\/\d{1,2}\/\d{4}\b',  # MM/DD/YYYY
        ]

        dates = []
        for pattern in date_patterns:
            matches = re.findall(pattern, text)
            dates.extend(matches)

        return list(set(dates))  # Remove duplicates

    def _extract_achievements(self, text: str) -> List[str]:
        """Extract achievements and accomplishments"""
        achievements = []

        # Look for quantified achievements
        achievement_patterns = [
            r'increased?\s+\w+\s+by\s+\d+%',
            r'reduced?\s+\w+\s+by\s+\d+%',
            r'improved?\s+\w+\s+by\s+\d+%',
            r'managed?\s+\$[\d,]+',
            r'led\s+team\s+of\s+\d+',
            r'delivered?\s+\d+\s+\w+',
        ]

        for pattern in achievement_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            achievements.extend(matches)

        return achievements

    def _extract_certifications(self, text: str) -> List[str]:
        """Extract certifications from text"""
        cert_patterns = [
            r'certified?\s+[\w\s]+',
            r'certification\s+in\s+[\w\s]+',
            r'aws\s+[\w\s]+',
            r'microsoft\s+[\w\s]+',
            r'google\s+[\w\s]+',
        ]

        certifications = []
        for pattern in cert_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            certifications.extend(matches)

        return certifications

    def _extract_projects(self, text: str) -> List[Dict[str, Any]]:
        """Extract project information"""
        projects = []

        # Look for project sections
        project_sections = re.split(r'(?i)(projects|portfolio|work samples)', text)
        if len(project_sections) > 1:
            project_text = project_sections[2] if len(project_sections) > 2 else project_sections[1]

            # Split by project entries
            project_entries = re.split(r'\n(?=[A-Z][\w\s]+:|\d+\.)', project_text)

            for entry in project_entries[:5]:  # Limit to 5 projects
                if len(entry.strip()) > 30:
                    project = self._parse_project_entry(entry.strip())
                    if project:
                        projects.append(project)

        return projects

    def _parse_project_entry(self, entry: str) -> Optional[Dict[str, Any]]:
        """Parse individual project entry"""
        lines = [line.strip() for line in entry.split('\n') if line.strip()]
        if not lines:
            return None

        name = lines[0].replace(':', '').strip()
        description = '\n'.join(lines[1:]) if len(lines) > 1 else ""
        technologies = self._extract_skills(entry)

        return {
            'name': name,
            'description': description,
            'technologies': technologies
        }

    # Additional extraction methods for specific document types
    def _extract_professional_summary(self, text: str) -> str:
        """Extract professional summary/objective"""
        summary_patterns = [
            r'(?i)summary[:\s]+(.*?)(?=\n\n|\nexperience|\neducation|$)',
            r'(?i)objective[:\s]+(.*?)(?=\n\n|\nexperience|\neducation|$)',
            r'(?i)profile[:\s]+(.*?)(?=\n\n|\nexperience|\neducation|$)',
        ]

        for pattern in summary_patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""

    def _analyze_writing_style(self, text: str) -> Dict[str, Any]:
        """Analyze writing style of cover letters"""
        return {
            'word_count': len(text.split()),
            'sentence_count': len(re.findall(r'[.!?]+', text)),
            'avg_sentence_length': len(text.split()) / max(len(re.findall(r'[.!?]+', text)), 1),
            'professional_keywords': len(re.findall(r'\b(experience|skills|qualified|professional|expertise)\b', text, re.IGNORECASE))
        }

    def _extract_key_phrases(self, text: str) -> List[str]:
        """Extract key phrases from text"""
        # Simple extraction of phrases between 2-5 words
        phrases = re.findall(r'\b(?:[A-Z][a-z]+\s+){1,4}[A-Z][a-z]+\b', text)
        return phrases[:10]  # Return top 10

    def _analyze_professional_tone(self, text: str) -> Dict[str, Any]:
        """Analyze professional tone of document"""
        professional_indicators = [
            'experience', 'expertise', 'qualified', 'professional', 'accomplished',
            'demonstrated', 'proven', 'successful', 'leadership', 'management'
        ]

        tone_score = sum(1 for word in professional_indicators if word in text.lower())

        return {
            'professional_score': tone_score,
            'formality_level': 'high' if tone_score > 5 else 'medium' if tone_score > 2 else 'low'
        }

    def _analyze_document_structure(self, text: str) -> Dict[str, Any]:
        """Analyze document structure"""
        paragraphs = text.split('\n\n')
        return {
            'paragraph_count': len(paragraphs),
            'has_introduction': bool(re.search(r'(?i)(dear|hello|greetings)', text)),
            'has_conclusion': bool(re.search(r'(?i)(sincerely|regards|thank you)', text)),
        }

    # Placeholder methods for specific document types
    def _extract_certification_name(self, text: str) -> str:
        """Extract certification name"""
        # Look for certificate/certification title
        cert_patterns = [
            r'certificate\s+of\s+(.*?)(?=\n|$)',
            r'certification\s+in\s+(.*?)(?=\n|$)',
            r'certified\s+(.*?)(?=\n|$)',
        ]

        for pattern in cert_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_issuing_org(self, text: str) -> str:
        """Extract issuing organization"""
        # Look for organization names
        org_patterns = [
            r'issued\s+by\s+(.*?)(?=\n|$)',
            r'from\s+(.*?)(?=\n|$)',
            r'by\s+(.*?)(?=\n|$)',
        ]

        for pattern in org_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_institution(self, text: str) -> str:
        """Extract educational institution"""
        institution_pattern = r'(university|college|institute|school)[\w\s]*'
        match = re.search(institution_pattern, text, re.IGNORECASE)
        return match.group().strip() if match else ""

    def _extract_degree_program(self, text: str) -> str:
        """Extract degree program"""
        degree_pattern = r'(bachelor|master|phd|doctorate).*?(?=\n|$)'
        match = re.search(degree_pattern, text, re.IGNORECASE)
        return match.group().strip() if match else ""

    def _extract_courses(self, text: str) -> List[str]:
        """Extract course names"""
        # Look for course listings
        course_patterns = [
            r'course[s]?[:\s]+(.*?)(?=\n\n|$)',
            r'subjects?[:\s]+(.*?)(?=\n\n|$)',
        ]

        courses = []
        for pattern in course_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                course_text = match.group(1)
                # Split by common separators
                course_list = re.split(r'[,\n•\-]', course_text)
                courses.extend([course.strip() for course in course_list if course.strip()])

        return courses[:10]  # Limit to 10 courses

    def _extract_gpa(self, text: str) -> str:
        """Extract GPA information"""
        gpa_pattern = r'gpa[:\s]*(\d+\.\d+|\d+\.\d+/\d+\.\d+)'
        match = re.search(gpa_pattern, text, re.IGNORECASE)
        return match.group(1) if match else ""

    def _extract_technologies(self, text: str) -> List[str]:
        """Extract technologies mentioned"""
        return self._extract_skills(text)  # Reuse skills extraction

    def _extract_recommender_info(self, text: str) -> Dict[str, str]:
        """Extract recommender information"""
        # Look for signature or contact info
        lines = text.split('\n')
        signature_lines = lines[-5:]  # Last 5 lines often contain signature

        info = {}
        for line in signature_lines:
            if '@' in line:
                info['email'] = line.strip()
            elif any(title in line.lower() for title in ['manager', 'director', 'ceo', 'supervisor']):
                info['title'] = line.strip()

        return info

    def _extract_strengths(self, text: str) -> List[str]:
        """Extract mentioned strengths"""
        strength_keywords = [
            'excellent', 'outstanding', 'exceptional', 'strong', 'skilled',
            'proficient', 'expert', 'talented', 'capable', 'reliable'
        ]

        strengths = []
        for keyword in strength_keywords:
            if keyword in text.lower():
                # Find context around the keyword
                pattern = rf'.{{0,50}}{keyword}.{{0,50}}'
                matches = re.findall(pattern, text, re.IGNORECASE)
                strengths.extend(matches)

        return strengths[:5]  # Top 5 strengths

    def _extract_examples(self, text: str) -> List[str]:
        """Extract specific examples mentioned"""
        # Look for specific examples or achievements
        example_patterns = [
            r'for example[,:]?\s+(.*?)(?=\.|$)',
            r'specifically[,:]?\s+(.*?)(?=\.|$)',
            r'such as[,:]?\s+(.*?)(?=\.|$)',
        ]

        examples = []
        for pattern in example_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            examples.extend(matches)

        return examples[:3]  # Top 3 examples

    def _extract_project_name(self, text: str) -> str:
        """Extract project name"""
        lines = text.split('\n')
        # First non-empty line is often the project name
        for line in lines:
            if line.strip():
                return line.strip()
        return ""

    def _extract_project_description(self, text: str) -> str:
        """Extract project description"""
        lines = text.split('\n')
        # Skip first line (project name) and get description
        description_lines = [line.strip() for line in lines[1:] if line.strip()]
        return '\n'.join(description_lines[:5])  # First 5 lines of description

    def _extract_project_outcomes(self, text: str) -> List[str]:
        """Extract project outcomes"""
        outcome_patterns = [
            r'result[s]?[:\s]+(.*?)(?=\n\n|$)',
            r'outcome[s]?[:\s]+(.*?)(?=\n\n|$)',
            r'achieved[:\s]+(.*?)(?=\n\n|$)',
        ]

        outcomes = []
        for pattern in outcome_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                outcomes.append(match.group(1).strip())

        return outcomes

    def _extract_achievement_name(self, text: str) -> str:
        """Extract achievement name"""
        lines = text.split('\n')
        for line in lines:
            if line.strip():
                return line.strip()
        return ""

    def _extract_awarding_org(self, text: str) -> str:
        """Extract awarding organization"""
        return self._extract_issuing_org(text)  # Reuse issuing org logic

    def _extract_achievement_description(self, text: str) -> str:
        """Extract achievement description"""
        lines = text.split('\n')
        description_lines = [line.strip() for line in lines[1:] if line.strip()]
        return '\n'.join(description_lines[:3])  # First 3 lines

    def _extract_key_information(self, text: str) -> Dict[str, Any]:
        """Extract key information from generic documents"""
        return {
            'word_count': len(text.split()),
            'key_phrases': self._extract_key_phrases(text),
            'dates': self._extract_dates(text),
            'skills': self._extract_skills(text),
            'achievements': self._extract_achievements(text),
        }
