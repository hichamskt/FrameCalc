from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from django.contrib.auth import get_user_model
from .models import Company
from .serializers import CompanySerializer

User = get_user_model()

class CompanyListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own companies"""
        return Company.objects.filter(user=self.request.user).prefetch_related('supply_types')

    def perform_create(self, serializer):
        """Automatically associate the company with the current user"""
        serializer.save(user=self.request.user)

class CompanyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'company_id'

    def get_queryset(self):
        """Users can only access their own companies"""
        return Company.objects.filter(user=self.request.user).prefetch_related('supply_types')

class MyCompanyView(generics.RetrieveAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Get the company for the current user"""
        return Company.objects.get(user=self.request.user)