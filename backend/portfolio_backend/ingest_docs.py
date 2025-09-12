#!/usr/bin/env python
"""
Quick Document Ingestion Script
Run this to process documents from the ingestion folder
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
django.setup()

from django.core.management import call_command  # noqa: E402

if __name__ == '__main__':
    print("🚀 Starting document ingestion...")
    
    # Process documents once
    call_command('ingest_documents')
    
    print("✅ Document ingestion complete!")
