from rest_framework import generics, permissions
from ..models import Material , Company
from ..serializers.serializers import MaterialSerializer
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

class MaterialListCreateView(generics.ListCreateAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Only show materials from the user's company if authenticated
        if self.request.user.is_authenticated:
            return Material.objects.filter(
                company__user=self.request.user
            ).select_related('company', 'category', 'supply_type')
        return Material.objects.none()

    def perform_create(self, serializer):
        try:
            user_company = Company.objects.get(user=self.request.user)
            serializer.save(company=user_company)
        except Company.DoesNotExist:
            raise PermissionDenied("You don't have an associated company")

class MaterialRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'material_id'

class PublicCompanyMaterialsView(generics.ListAPIView):
   
    serializer_class = MaterialSerializer
    permission_classes = []  

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        # Verify company exists (will return 404 if not)
        company = get_object_or_404(Company, pk=company_id)
        
        # Return all materials for this company
        return Material.objects.filter(company=company)\
                             .select_related('category', 'supply_type')\
                             .order_by('name')


class CompanyMaterialsView(generics.ListAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        company = get_object_or_404(Company, pk=company_id)
        
        # Optional: Verify the requesting user has access to this company
        if self.request.user.is_authenticated and company.user != self.request.user:
            raise permissions.PermissionDenied("You don't have access to this company's materials")
        
        return Material.objects.filter(company=company).select_related(
            'category', 'supply_type'
        ).order_by('name')
    


class CompanyMaterialsFilterView(generics.ListAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        company = get_object_or_404(Company, pk=company_id)
        
        # Get filter parameters from URL
        category_id = self.request.query_params.get('category_id')
        supply_type_id = self.request.query_params.get('supply_type_id')
        
        # Start with base queryset
        queryset = Material.objects.filter(company=company)\
                                  .select_related('category', 'supply_type')
        
        # Apply filters if provided
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if supply_type_id:
            queryset = queryset.filter(supply_type_id=supply_type_id)
        
        return queryset.order_by('name')
    
from rest_framework import generics
from django.shortcuts import get_object_or_404
from ..models import Material, Company
from ..serializers.serializers import MaterialSerializer

class PublicCompanyMaterialsFilterView(generics.ListAPIView):
   

    serializer_class = MaterialSerializer
    permission_classes = []  

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        company = get_object_or_404(Company, pk=company_id)
        
        # Get filter parameters
        category_id = self.request.query_params.get('category_id')
        supply_type_id = self.request.query_params.get('supply_type_id')
        
        # Base queryset
        queryset = Material.objects.filter(company=company)\
                                 .select_related('category', 'supply_type')
        
        # Apply filters
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if supply_type_id:
            queryset = queryset.filter(supply_type_id=supply_type_id)
        
        return queryset.order_by('name')

