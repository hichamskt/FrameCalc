from rest_framework import generics
from django.shortcuts import get_object_or_404
from ..models import StructureSubType, StructureType
from ..serializers.serializers import StructureSubTypeSerializer

class StructureSubTypeListCreateView(generics.ListCreateAPIView):
    serializer_class = StructureSubTypeSerializer
    permission_classes = []  # Public access
    
    def get_queryset(self):
        queryset = StructureSubType.objects.select_related('type').order_by('type', 'name')
        type_id = self.request.query_params.get('type_id')
        if type_id:
            queryset = queryset.filter(type_id=type_id)
        return queryset

class StructureSubTypeDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = StructureSubTypeSerializer
    permission_classes = []
    lookup_field = 'subtype_id'  # This is the default, but explicit is better
    
    def get_object(self):
        # First get the subtype
        subtype = get_object_or_404(
            StructureSubType, 
            pk=self.kwargs['subtype_id']
        )
        
        # If type_id is in URL, verify it matches
        type_id = self.kwargs.get('type_id')
        if type_id is not None:
            if subtype.type_id != int(type_id):
                raise Http404("No StructureSubType matches the given query")
        
        return subtype
    

class StructureSubTypeByTypeView(generics.ListAPIView):
    """
    Get all StructureSubType instances for a specific StructureType
    URL: /structure-types/<type_id>/subtypes/
    """
    serializer_class = StructureSubTypeSerializer
    permission_classes = []  # Public access
    
    def get_queryset(self):
        type_id = self.kwargs['type_id']
        # Verify the StructureType exists first
        structure_type = get_object_or_404(StructureType, pk=type_id)
        # Return filtered queryset
        return StructureSubType.objects.filter(
            type=structure_type
        ).select_related('type').order_by('name')