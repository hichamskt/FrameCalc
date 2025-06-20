from rest_framework import generics, permissions
from ..models import Profile, Company
from ..serializers.serializers import ProfileSerializer , ProfileWithCompanySerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

class ProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show profiles for the current user's company
        return Profile.objects.filter(
            company__user=self.request.user
        ).select_related('company').order_by('name')

    def perform_create(self, serializer):
        # Automatically set the company to the user's company
        user_company = get_object_or_404(Company, user=self.request.user)
        serializer.save(company=user_company)

class ProfileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'profile_id'

    def get_queryset(self):
        # Only allow access to profiles belonging to the user's company
        return Profile.objects.filter(company__user=self.request.user)
    

class PublicProfilesView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    
    def get_queryset(self):
        # Get company_id from URL or query params
        company_id = self.kwargs.get('company_id') or self.request.query_params.get('company_id')
        
        if company_id:
            # Verify the company exists
            company = get_object_or_404(Company, pk=company_id)
            return Profile.objects.filter(company=company).select_related('company').order_by('name')
        
        # Return empty queryset if no company_id provided
        return Profile.objects.none()

class AllProfilesWithCompanyView(generics.ListAPIView):
    serializer_class = ProfileWithCompanySerializer
    queryset = Profile.objects.select_related('company').order_by('name')
