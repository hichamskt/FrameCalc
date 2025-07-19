from rest_framework import generics
from django.shortcuts import get_object_or_404
from ..models import SubtypeGlasseRequirement, StructureSubType, Company
from ..serializers.SubtypeGlasseRequirement import SubtypeGlasseRequirementSerializer
from rest_framework.exceptions import ValidationError


class SubtypeGlasseRequirementListCreateView(generics.ListCreateAPIView):
    serializer_class = SubtypeGlasseRequirementSerializer
    permission_classes = []
    
    def get_queryset(self):
        queryset = SubtypeGlasseRequirement.objects.select_related(
            'subtype', 'companysupplier'
        )
        
        subtype_id = self.request.query_params.get('subtype_id')
        if subtype_id:
            queryset = queryset.filter(subtype_id=subtype_id)
            
        company_id = self.request.query_params.get('company_id')
        if company_id:
            company = get_object_or_404(Company, pk=company_id)
            if not company.supply_types.filter(name__icontains='glass').exists():
                raise ValidationError("Company doesn't supply glass")
            queryset = queryset.filter(companysupplier_id=company_id)
            
        return queryset.order_by('companysupplier')

    def perform_create(self, serializer):
        company = serializer.validated_data['companysupplier']
        subtype = serializer.validated_data['subtype']
        
        # Verify company supplies glass
        if not company.supply_types.filter(name__icontains='glass').exists():
            raise ValidationError({"companysupplier": "Must supply glass products"})
        
        # Check for existing entry (optional, based on your requirements)
        if SubtypeGlasseRequirement.objects.filter(
            subtype=subtype,
            companysupplier=company
        ).exists():
            raise ValidationError("This company already has requirements for this subtype")
            
        serializer.save()

class SubtypeGlasseRequirementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubtypeGlasseRequirement.objects.select_related('subtype', 'companysupplier')
    serializer_class = SubtypeGlasseRequirementSerializer
    permission_classes = []  
    lookup_field = 'glassrequirement_id'

# Specialized views
class SubtypeGlassRequirementsView(generics.ListAPIView):
    serializer_class = SubtypeGlasseRequirementSerializer
    permission_classes = []
    
    def get_queryset(self):
        subtype_id = self.kwargs['subtype_id']
        get_object_or_404(StructureSubType, pk=subtype_id)
        return SubtypeGlasseRequirement.objects.filter(
            subtype_id=subtype_id
        ).select_related('companysupplier').order_by('companysupplier')

class CompanyGlassSuppliesView(generics.ListAPIView):
    serializer_class = SubtypeGlasseRequirementSerializer
    permission_classes = []
    
    def get_queryset(self):
        company_id = self.kwargs['company_id']
        get_object_or_404(Company, pk=company_id)
        return SubtypeGlasseRequirement.objects.filter(
            companysupplier_id=company_id
        ).select_related('subtype').order_by('subtype')