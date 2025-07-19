from rest_framework import generics
from django.shortcuts import get_object_or_404
from ..models import SubtypeRequirement , Profile , StructureSubType
from ..serializers.Subtyper_equirement_serializers import SubtypeRequirementSerializer


from django.db.models import Q
from ..models import Company, StructureSubType, SubtypeRequirement
from ..serializers.serializers import CompanySerializer

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
    

class CompanyBySubtypeView(generics.ListAPIView):
    """
    Get all companies that have profiles associated with a specific subtype
    """
    serializer_class = CompanySerializer
    permission_classes = []  # No authentication required
    
    def get_queryset(self):
        subtype_id = self.kwargs['subtype_id']
        
        # Ensure subtype exists
        get_object_or_404(StructureSubType, pk=subtype_id)
        
        # Get companies that have profiles used in requirements for this subtype
        return Company.objects.filter(
            profile__subtype_requirements__subtype_id=subtype_id
        ).distinct().select_related('user').prefetch_related('supply_types')

class CompanyBySubtypeDetailView(generics.ListAPIView):
    """
    Get companies with their profiles and requirements for a specific subtype
    """
    serializer_class = CompanySerializer
    permission_classes = []
    
    def get_queryset(self):
        subtype_id = self.kwargs['subtype_id']
        
        # Ensure subtype exists
        get_object_or_404(StructureSubType, pk=subtype_id)
        
        # Get companies with their profiles that have requirements for this subtype
        return Company.objects.filter(
            profile__subtype_requirements__subtype_id=subtype_id
        ).distinct().select_related('user').prefetch_related(
            'supply_types',
            'profile_set__subtype_requirements'
        )

# Alternative: If you want to filter by query parameter instead of URL parameter
class CompanyListView(generics.ListAPIView):
    """
    List companies with optional subtype filtering via query parameter
    """
    serializer_class = CompanySerializer
    permission_classes = []
    
    def get_queryset(self):
        queryset = Company.objects.select_related('user').prefetch_related('supply_types')
        
        # Filter by subtype if provided
        subtype_id = self.request.query_params.get('subtype_id')
        if subtype_id:
            queryset = queryset.filter(
                profile__subtype_requirements__subtype_id=subtype_id
            ).distinct()
            
        return queryset.order_by('name')