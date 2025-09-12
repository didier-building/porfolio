import os
import json
import logging
import PyPDF2
import docx
from typing import Dict, Any
from django.utils import timezone
from .models import Document, ExtractedData
import requests

logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Process documents and extract structured data using AI"""
    
    def __init__(self):
        self.ollama_url = "http://localhost:11434/api/generate"
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text.strip()
        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            return ""
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from Word document"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting DOCX text: {e}")
            return ""
    
    def extract_text_from_file(self, file_path: str) -> str:
        """Extract text based on file extension"""
        _, ext = os.path.splitext(file_path.lower())
        
        if ext == '.pdf':
            return self.extract_text_from_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            return self.extract_text_from_docx(file_path)
        elif ext == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            return ""
    
    def analyze_with_ollama(self, text: str, document_type: str) -> Dict[str, Any]:
        """Use Ollama to extract structured data from text"""
        
        prompts = {
            'cv': """
            Extract the following information from this CV/Resume text and return as JSON:
            {
                "personal_info": {"name": "", "email": "", "phone": "", "location": "", "title": ""},
                "experience": [{"company": "", "position": "", "start_date": "", "end_date": "", "description": "", "achievements": []}],
                "education": [{"institution": "", "degree": "", "field": "", "start_date": "", "end_date": "", "grade": ""}],
                "skills": [{"name": "", "category": "", "proficiency": 0}],
                "projects": [{"title": "", "description": "", "technologies": [], "start_date": "", "end_date": ""}],
                "certificates": [{"name": "", "issuer": "", "date": "", "credential_id": ""}]
            }
            
            Text to analyze:
            """,
            'cover_letter': """
            Extract key information from this cover letter and return as JSON:
            {
                "target_position": "",
                "target_company": "",
                "key_skills_mentioned": [],
                "achievements_highlighted": [],
                "motivation": ""
            }
            
            Text to analyze:
            """,
            'certificate': """
            Extract certificate information and return as JSON:
            {
                "certificate_name": "",
                "issuer": "",
                "issue_date": "",
                "expiry_date": "",
                "credential_id": "",
                "skills_covered": []
            }
            
            Text to analyze:
            """
        }
        
        prompt = prompts.get(document_type, prompts['cv']) + text
        
        try:
            response = requests.post(
                self.ollama_url,
                json={
                    "model": "llama3.1:8b",
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                return json.loads(result.get('response', '{}'))
            else:
                return {}
                
        except Exception as e:
            logger.error(f"Error with Ollama analysis: {e}")
            return {}
    
    def process_document(self, document_id: str) -> bool:
        """Process a document and extract structured data"""
        try:
            document = Document.objects.get(id=document_id)
            
            # Extract text from file
            file_path = document.file.path
            extracted_text = self.extract_text_from_file(file_path)
            
            if not extracted_text:
                return False
            
            # Save extracted text
            document.extracted_text = extracted_text
            document.save()
            
            # Analyze with AI
            structured_data = self.analyze_with_ollama(extracted_text, document.document_type)
            
            if structured_data:
                # Save extracted data based on type
                self.save_extracted_data(document, structured_data)
                
                # Mark as processed
                document.processed = True
                document.processed_at = timezone.now()
                document.save()
                
                return True
            
            return False
            
        except Exception as e:
            print(f"Error processing document {document_id}: {e}")
            return False
    
    def save_extracted_data(self, document: Document, data: Dict[str, Any]):
        """Save extracted data to database"""
        
        # Personal info
        if 'personal_info' in data and data['personal_info']:
            ExtractedData.objects.create(
                document=document,
                data_type='personal_info',
                content=data['personal_info'],
                confidence_score=0.8
            )
        
        # Experience
        if 'experience' in data:
            for exp in data['experience']:
                if exp and any(exp.values()):
                    ExtractedData.objects.create(
                        document=document,
                        data_type='experience',
                        content=exp,
                        confidence_score=0.7
                    )
        
        # Education
        if 'education' in data:
            for edu in data['education']:
                if edu and any(edu.values()):
                    ExtractedData.objects.create(
                        document=document,
                        data_type='education',
                        content=edu,
                        confidence_score=0.8
                    )
        
        # Skills
        if 'skills' in data:
            for skill in data['skills']:
                if skill and skill.get('name'):
                    ExtractedData.objects.create(
                        document=document,
                        data_type='skill',
                        content=skill,
                        confidence_score=0.6
                    )
        
        # Projects
        if 'projects' in data:
            for project in data['projects']:
                if project and project.get('title'):
                    ExtractedData.objects.create(
                        document=document,
                        data_type='project',
                        content=project,
                        confidence_score=0.7
                    )
        
        # Certificates
        if 'certificates' in data:
            for cert in data['certificates']:
                if cert and cert.get('name'):
                    ExtractedData.objects.create(
                        document=document,
                        data_type='certificate',
                        content=cert,
                        confidence_score=0.9
                    )

def process_document_async(document_id: str):
    """Async function to process document"""
    processor = DocumentProcessor()
    return processor.process_document(document_id)