from django.core.management.base import BaseCommand
from api.models import Document
from api.document_processor import DocumentProcessor

class Command(BaseCommand):
    help = 'Process uploaded documents and extract data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--document-id',
            type=str,
            help='Process specific document by ID',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Process all unprocessed documents',
        )

    def handle(self, *args, **options):
        processor = DocumentProcessor()
        
        if options['document_id']:
            # Process specific document
            success = processor.process_document(options['document_id'])
            if success:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully processed document {options["document_id"]}')
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'Failed to process document {options["document_id"]}')
                )
        
        elif options['all']:
            # Process all unprocessed documents
            unprocessed = Document.objects.filter(processed=False)
            self.stdout.write(f'Found {unprocessed.count()} unprocessed documents')
            
            for document in unprocessed:
                self.stdout.write(f'Processing {document.title}...')
                success = processor.process_document(str(document.id))
                if success:
                    self.stdout.write(
                        self.style.SUCCESS(f'✓ Processed {document.title}')
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(f'✗ Failed to process {document.title}')
                    )
        
        else:
            self.stdout.write(
                self.style.ERROR('Please specify --document-id or --all')
            )