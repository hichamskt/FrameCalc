from rest_framework import generics
from django.shortcuts import get_object_or_404
from ..models import SubtypeRequirement , Profile , StructureSubType
from ..serializers.Subtyper_equirement_serializers import SubtypeRequirementSerializer

class SubtypeRequirementListCreateView(generics.ListCreateAPIView):
    serializer_class = SubtypeRequirementSerializer
    
    def get_queryset(self):
        queryset = SubtypeRequirement.objects.select_related('subtype', 'profile')
        
        # Filter by subtype if provided
        subtype_id = self.request.query_params.get('subtype_id')
        if subtype_id:
            queryset = queryset.filter(subtype_id=subtype_id)
            
        # Filter by profile if provided
        profile_id = self.request.query_params.get('profile_id')
        if profile_id:
            queryset = queryset.filter(profile_id=profile_id)
            
        return queryset.order_by('subtype', 'profile')

class SubtypeRequirementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubtypeRequirement.objects.select_related('subtype', 'profile')
    serializer_class = SubtypeRequirementSerializer
    lookup_field = 'requirement_id'

class SubtypeRequirementsView(generics.ListCreateAPIView):
    
    serializer_class = SubtypeRequirementSerializer
    permission_classes = []  # No authentication required
    
    def get_queryset(self):
        subtype_id = self.kwargs['subtype_id']
        get_object_or_404(StructureSubType, pk=subtype_id)
        return SubtypeRequirement.objects.filter(
            subtype_id=subtype_id
        ).select_related('profile').order_by('profile')

class ProfileSubtypeRequirementsView(generics.ListAPIView):
   
    serializer_class = SubtypeRequirementSerializer
    permission_classes = []  # No authentication required
    
    def get_queryset(self):
        profile_id = self.kwargs['profile_id']
        get_object_or_404(Profile, pk=profile_id)
        return SubtypeRequirement.objects.filter(
            profile_id=profile_id
        ).select_related('subtype').order_by('subtype')