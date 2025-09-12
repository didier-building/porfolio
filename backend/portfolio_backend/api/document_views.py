from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Document, ExtractedData
from .serializers import DocumentSerializer, ExtractedDataSerializer
from .document_processor import DocumentProcessor

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process a specific document"""
        document = self.get_object()
        
        if document.processed:
            return Response(
                {'message': 'Document already processed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        processor = DocumentProcessor()
        success = processor.process_document(str(document.id))
        
        if success:
            return Response({'message': 'Document processed successfully'})
        else:
            return Response(
                {'message': 'Failed to process document'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def process_all(self, request):
        """Process all unprocessed documents"""
        unprocessed = Document.objects.filter(processed=False)
        processor = DocumentProcessor()
        
        results = []
        for document in unprocessed:
            success = processor.process_document(str(document.id))
            results.append({
                'document_id': str(document.id),
                'title': document.title,
                'success': success
            })
        
        return Response({
            'message': f'Processed {len(results)} documents',
            'results': results
        })

class ExtractedDataViewSet(viewsets.ModelViewSet):
    queryset = ExtractedData.objects.all()
    serializer_class = ExtractedDataSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve extracted data"""
        data = self.get_object()
        data.approved = True
        data.save()
        return Response({'message': 'Data approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject extracted data"""
        data = self.get_object()
        data.approved = False
        data.save()
        return Response({'message': 'Data rejected'})
    
    @action(detail=False, methods=['post'])
    def apply_approved(self, request):
        """Apply all approved data to portfolio models"""
        approved_data = ExtractedData.objects.filter(approved=True)
        
        # TODO: Implement logic to update portfolio models
        # This would update Project, Skill, Experience, etc. models
        # based on the approved extracted data
        
        return Response({
            'message': f'Applied {approved_data.count()} approved data entries'
        })