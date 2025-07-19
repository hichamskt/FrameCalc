from rest_framework import generics
from django.shortcuts import get_object_or_404 
from rest_framework import status

from ..models import (
    SubtypeAccessoriesRequirement,
    StructureSubType,
    Company,
    SupplyType
)
from ..serializers.subtype_accessories_requirement import SubtypeAccessoriesRequirementSerializer
from rest_framework.exceptions import ValidationError


class SubtypeAccessoriesRequirementListCreateView(generics.ListCreateAPIView):
    serializer_class = SubtypeAccessoriesRequirementSerializer
    permission_classes = []
    
    def get_accessories_supply_type(self):
        """Helper method to get or validate the Accessories supply type"""
        try:
            return SupplyType.objects.get(name__iexact="Accessories")
        except SupplyType.DoesNotExist:
            raise ValidationError(
                {"detail": "The 'Accessories' supply type doesn't exist in the system"},
                code=status.HTTP_400_BAD_REQUEST
            )

    def get_queryset(self):
        queryset = SubtypeAccessoriesRequirement.objects.select_related('subtype', 'companysupplier')
        
        subtype_id = self.request.query_params.get('subtype_id')
        if subtype_id:
            queryset = queryset.filter(subtype_id=subtype_id)
            
        company_id = self.request.query_params.get('company_id')
        if company_id:
            accessories_type = self.get_accessories_supply_type()
            queryset = queryset.filter(
                companysupplier__supply_types=accessories_type,
                companysupplier_id=company_id
            )
            
        return queryset.order_by('subtype', 'companysupplier')

    def perform_create(self, serializer):
        company = serializer.validated_data['companysupplier']
        accessories_type = self.get_accessories_supply_type()
        
        if not company.supply_types.filter(pk=accessories_type.pk).exists():
            raise ValidationError(
                {"companysupplier": "Company must have 'Accessories' supply type"},
                code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()



class SubtypeAccessoriesRequirementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubtypeAccessoriesRequirement.objects.select_related(
        'subtype', 'companysupplier'
    )
    serializer_class = SubtypeAccessoriesRequirementSerializer
    permission_classes = []  # Public access
    lookup_field = 'accessoriesrequirement_id'

# Specialized views with SupplyType verification
class SubtypeAccessoriesRequirementsView(generics.ListAPIView):
    serializer_class = SubtypeAccessoriesRequirementSerializer
    permission_classes = []
    
    def get_accessories_supply_type(self):
        try:
            return SupplyType.objects.get(name__iexact="Accessories")
        except SupplyType.DoesNotExist:
            return None
    
    def list(self, request, *args, **kwargs):
        accessories_type = self.get_accessories_supply_type()
        if not accessories_type:
            return Response(
                {"detail": "The 'Accessories' supply type doesn't exist in the system"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        subtype_id = self.kwargs['subtype_id']
        get_object_or_404(StructureSubType, pk=subtype_id)
        accessories_type = self.get_accessories_supply_type()
        
        if not accessories_type:
            return SubtypeAccessoriesRequirement.objects.none()
            
        return SubtypeAccessoriesRequirement.objects.filter(
            subtype_id=subtype_id,
            companysupplier__supply_types=accessories_type
        ).select_related('companysupplier')





class CompanyAccessoriesSuppliesView(generics.ListAPIView):
    serializer_class = SubtypeAccessoriesRequirementSerializer
    permission_classes = []
    
    def get_queryset(self):
        company_id = self.kwargs['company_id']
        company = get_object_or_404(Company, pk=company_id)
        
        # Verify company has Accessories supply type
        accessories_supply_type = get_object_or_404(
            SupplyType, 
            name__iexact="Accessories"
        )
        if not company.supply_types.filter(pk=accessories_supply_type.pk).exists():
            raise ValidationError(
                "This company doesn't supply accessories"
            )
            
        return SubtypeAccessoriesRequirement.objects.filter(
            companysupplier_id=company_id
        ).select_related('subtype').order_by('subtype')
    


    