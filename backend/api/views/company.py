from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from django.contrib.auth import get_user_model
from ..models import Company
from ..serializers.serializers import CompanySerializer
from django.db.models import Prefetch
from django.db.models import Q
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
    
class CompaniesBySupplyTypeView(generics.ListAPIView):
    serializer_class = CompanySerializer
    
    def get_queryset(self):
        supply_type_id = self.kwargs['supply_type_id']
        return Company.objects.filter(supply_types__id=supply_type_id).distinct()
    
class CompanyListView(generics.ListAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Adjust as needed
    
    def get_queryset(self):
        # Optimize query with prefetch_related to avoid N+1 problem
        return Company.objects.prefetch_related(
            Prefetch('supply_types')
        ).all().order_by('name')
class CompanySearchView(generics.ListAPIView):
    serializer_class = CompanySerializer
    
    def get_queryset(self):
        queryset = Company.objects.prefetch_related('supply_types')
        search = self.request.query_params.get('search', None)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(supply_types__name__icontains=search)
            ).distinct()
            
        return queryset.order_by('name')