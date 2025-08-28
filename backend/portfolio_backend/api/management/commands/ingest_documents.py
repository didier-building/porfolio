"""
Document Ingestion Management Command
Automatically processes documents from the ingestion folder
"""

import os
import shutil
import logging
from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from django.utils import timezone

from api.models import CareerDocument, ProfessionalProfile
from api.career_document_processor import CareerDocumentProcessor
from api.profile_builder import ProfessionalProfileBuilder

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Ingest and process documents from the ingestion folder'

    def add_arguments(self, parser):
        parser.add_argument(
            '--watch',
            action='store_true',
            help='Watch folder continuously for new files',
        )
        parser.add_argument(
            '--interval',
            type=int,
            default=10,
            help='Watch interval in seconds (default: 10)',
        )
        parser.add_argument(
            '--folder',
            type=str,
            default='media/document_ingestion',
            help='Folder to watch for documents (default: media/document_ingestion)',
        )

    def handle(self, *args, **options):
        ingestion_folder = Path(settings.BASE_DIR) / options['folder']
        
        # Create folder if it doesn't exist
        ingestion_folder.mkdir(parents=True, exist_ok=True)
        
        self.stdout.write(
            self.style.SUCCESS(f'📁 Document ingestion folder: {ingestion_folder}')
        )
        
        if options['watch']:
            self.watch_folder(ingestion_folder, options['interval'])
        else:
            self.process_folder_once(ingestion_folder)

    def watch_folder(self, folder_path, interval):
        """Continuously watch folder for new documents"""
        import time
        
        self.stdout.write(
            self.style.SUCCESS(f'👀 Watching folder: {folder_path} (interval: {interval}s)')
        )
        self.stdout.write('Press Ctrl+C to stop watching...\n')
        
        try:
            while True:
                processed_count = self.process_folder_once(folder_path)
                if processed_count > 0:
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Processed {processed_count} documents')
                    )
                time.sleep(interval)
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('\n🛑 Stopped watching folder'))

    def process_folder_once(self, folder_path):
        """Process all documents in folder once"""
        supported_extensions = ['.pdf', '.doc', '.docx', '.txt']
        processed_count = 0
        
        # Get all supported files
        files_to_process = []
        for ext in supported_extensions:
            files_to_process.extend(folder_path.glob(f'*{ext}'))
            files_to_process.extend(folder_path.glob(f'*{ext.upper()}'))
        
        if not files_to_process:
            return 0
        
        self.stdout.write(f'📄 Found {len(files_to_process)} document(s) to process')
        
        for file_path in files_to_process:
            try:
                success = self.ingest_document(file_path)
                if success:
                    processed_count += 1
                    # Move processed file to processed folder
                    self.move_to_processed(file_path)
                else:
                    # Move failed file to failed folder
                    self.move_to_failed(file_path)
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error processing {file_path.name}: {e}')
                )
                self.move_to_failed(file_path)
        
        # Rebuild profile if any documents were processed
        if processed_count > 0:
            self.rebuild_profile()
        
        return processed_count

    def ingest_document(self, file_path):
        """Ingest a single document"""
        try:
            # Determine document type from filename
            doc_type = self.determine_document_type(file_path.name)
            
            # Create document record
            with open(file_path, 'rb') as file:
                document = CareerDocument.objects.create(
                    title=self.generate_title(file_path.name),
                    document_type=doc_type,
                    description=f"Auto-ingested from {file_path.name}",
                    priority=self.determine_priority(doc_type),
                    is_active=True
                )
                
                # Save file
                document.file.save(
                    file_path.name,
                    ContentFile(file.read()),
                    save=True
                )
            
            self.stdout.write(f'📄 Created document: {document.title}')
            
            # Process document immediately
            processor = CareerDocumentProcessor()
            structured_data = processor.process_document(document)
            
            self.stdout.write(
                self.style.SUCCESS(f'✅ Processed: {document.title}')
            )
            self.stdout.write(f'   📊 Extracted {len(structured_data.get("skills", []))} skills')
            self.stdout.write(f'   💼 Found {len(structured_data.get("work_experience", []))} work experiences')
            
            return True
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Failed to ingest {file_path.name}: {e}')
            )
            return False

    def determine_document_type(self, filename):
        """Determine document type from filename"""
        filename_lower = filename.lower()
        
        if any(keyword in filename_lower for keyword in ['cv', 'resume', 'curriculum']):
            return 'master_cv'
        elif any(keyword in filename_lower for keyword in ['cover', 'letter']):
            return 'cover_letter'
        elif any(keyword in filename_lower for keyword in ['certificate', 'cert', 'certification']):
            return 'certificate'
        elif any(keyword in filename_lower for keyword in ['transcript', 'academic', 'grades']):
            return 'transcript'
        elif any(keyword in filename_lower for keyword in ['portfolio', 'project']):
            return 'portfolio'
        elif any(keyword in filename_lower for keyword in ['recommendation', 'reference']):
            return 'recommendation'
        elif any(keyword in filename_lower for keyword in ['achievement', 'award']):
            return 'achievement'
        else:
            return 'other'

    def generate_title(self, filename):
        """Generate a clean title from filename"""
        # Remove extension
        title = Path(filename).stem
        
        # Replace underscores and hyphens with spaces
        title = title.replace('_', ' ').replace('-', ' ')
        
        # Capitalize words
        title = ' '.join(word.capitalize() for word in title.split())
        
        return title

    def determine_priority(self, doc_type):
        """Determine processing priority based on document type"""
        priority_map = {
            'master_cv': 1,
            'certificate': 2,
            'transcript': 2,
            'portfolio': 3,
            'cover_letter': 4,
            'recommendation': 4,
            'achievement': 5,
            'other': 6,
        }
        return priority_map.get(doc_type, 6)

    def move_to_processed(self, file_path):
        """Move processed file to processed folder"""
        processed_folder = file_path.parent / 'processed'
        processed_folder.mkdir(exist_ok=True)
        
        destination = processed_folder / f"{timezone.now().strftime('%Y%m%d_%H%M%S')}_{file_path.name}"
        shutil.move(str(file_path), str(destination))
        
        self.stdout.write(f'📁 Moved to processed: {destination.name}')

    def move_to_failed(self, file_path):
        """Move failed file to failed folder"""
        failed_folder = file_path.parent / 'failed'
        failed_folder.mkdir(exist_ok=True)
        
        destination = failed_folder / f"{timezone.now().strftime('%Y%m%d_%H%M%S')}_{file_path.name}"
        shutil.move(str(file_path), str(destination))
        
        self.stdout.write(f'❌ Moved to failed: {destination.name}')

    def rebuild_profile(self):
        """Rebuild professional profile from processed documents"""
        try:
            # Get or create Didier's profile
            profile, created = ProfessionalProfile.objects.get_or_create(
                full_name="Didier Imanirahami",
                defaults={
                    'professional_title': 'Senior Python Developer',
                    'is_active': True
                }
            )
            
            # Rebuild profile
            builder = ProfessionalProfileBuilder()
            profile_summary = builder.rebuild_profile(profile)
            
            self.stdout.write(
                self.style.SUCCESS(f'🔄 Rebuilt profile for {profile.full_name}')
            )
            self.stdout.write(f'   📊 Skills: {profile_summary.get("skills_count", 0)}')
            self.stdout.write(f'   💼 Experience: {profile_summary.get("experience_count", 0)}')
            self.stdout.write(f'   🎓 Education: {profile_summary.get("education_count", 0)}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Failed to rebuild profile: {e}')
            )
