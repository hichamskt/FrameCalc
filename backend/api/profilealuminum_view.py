from rest_framework import generics, permissions
from .models import ProfileAluminum , Profile
from .serializers import ProfileAluminumSerializer
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