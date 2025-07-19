from rest_framework import generics, permissions
from ..models import ProfileAluminum , Profile
from ..serializers.serializers import ProfileAluminumSerializer , ProfileWithRequirementsSerializer , ProfileSerializer , StructureSubType , Company 
from django.shortcuts import get_object_or_404

class ProfileAluminumListCreateView(generics.ListCreateAPIView):
    serializer_class = ProfileAluminumSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ProfileAluminum.objects.select_related('profile').order_by('name')

    def perform_create(self, serializer):
        # Add any additional creation logic here
        serializer.save()

class ProfileAluminumRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileAluminumSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'profile_material_id'

    def get_queryset(self):
        return ProfileAluminum.objects.select_related('profile')
class ProfileAluminumByProfileView(generics.ListAPIView):
    serializer_class = ProfileAluminumSerializer
    permission_classes = []  

    def get_queryset(self):
        profile_id = self.kwargs['profile_id']
       
        get_object_or_404(Profile, pk=profile_id)
       
        return ProfileAluminum.objects.filter(
            profile_id=profile_id
        ).select_related('profile').order_by('name')
    
class PublicProfileAluminumByProfileView(generics.ListAPIView):
    serializer_class = ProfileAluminumSerializer
    permission_classes = []  # Empty list means no permissions required

    def get_queryset(self):
        profile_id = self.kwargs['profile_id']
        # Verify profile exists (will return 404 if not)
        get_object_or_404(Profile, pk=profile_id)
        # Return filtered queryset
        return ProfileAluminum.objects.filter(
            profile_id=profile_id
        ).select_related('profile').order_by('name')
    


class ProfileBySubtypeAndCompanyView(generics.ListAPIView):
    """
    Get profiles filtered by subtype ID and company ID
    """
    serializer_class = ProfileSerializer
    permission_classes = []
    
    def get_queryset(self):
        subtype_id = self.kwargs['subtype_id']
        company_id = self.kwargs['company_id']
        
        # Ensure subtype and company exist
        get_object_or_404(StructureSubType, pk=subtype_id)
        get_object_or_404(Company, pk=company_id)
        
        # Get profiles from the specified company that have requirements for the subtype
        return Profile.objects.filter(
            company_id=company_id,
            subtype_requirements__subtype_id=subtype_id
        ).distinct().order_by('name')

class ProfileBySubtypeAndCompanyDetailView(generics.ListAPIView):
    """
    Get profiles with their requirements for a specific subtype and company
    """
    serializer_class = ProfileWithRequirementsSerializer
    permission_classes = []
    
    def get_queryset(self):
        subtype_id = self.kwargs['subtype_id']
        company_id = self.kwargs['company_id']
        
        # Ensure subtype and company exist
        get_object_or_404(StructureSubType, pk=subtype_id)
        get_object_or_404(Company, pk=company_id)
        
        # Get profiles with their requirements
        return Profile.objects.filter(
            company_id=company_id,
            subtype_requirements__subtype_id=subtype_id
        ).distinct().prefetch_related(
            'subtype_requirements__subtype',
            'subtype_requirements__aluminum_items'
        ).order_by('name')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['subtype_id'] = self.kwargs['subtype_id']
        return context