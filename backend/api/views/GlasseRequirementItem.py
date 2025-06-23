from rest_framework import generics, status
from rest_framework.response import Response
from ..models import GlasseRequirementItem , SubtypeGlasseRequirement, Company
from ..serializers.GlasseRequirementItem import GlasseRequirementItemSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView


class GlassRequirementItemListCreateView(generics.ListCreateAPIView):
    """List all glass requirement items or create a new one"""
    queryset = GlasseRequirementItem.objects.select_related(
        'requirement__subtype',
        'material',
        'requirement__companysupplier'
    ).all()
    serializer_class = GlasseRequirementItemSerializer
    filterset_fields = ['requirement', 'material', 'width', 'height']
    ordering_fields = ['created_at', 'width', 'height']
    ordering = ['-created_at']

class GlassRequirementItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a glass requirement item"""
    queryset = GlasseRequirementItem.objects.select_related(
        'requirement__subtype',
        'material',
        'requirement__companysupplier'
    )
    serializer_class = GlasseRequirementItemSerializer
    lookup_field = 'glasse_item_id'

class RequirementGlassItemsView(generics.ListCreateAPIView):
    """View to list and create glass items for a specific requirement"""
    serializer_class = GlasseRequirementItemSerializer
    permission_classes = [AllowAny]  # Allow access to anyone (no authentication required)

    def get_queryset(self):
        requirement_id = self.kwargs['requirement_id']
        return GlasseRequirementItem.objects.filter(
            requirement=requirement_id
        ).select_related(
            'requirement__subtype',
            'material',
            'requirement__companysupplier'
        )

    def perform_create(self, serializer):
        requirement_id = self.kwargs['requirement_id']
        serializer.save(requirement_id=requirement_id)

class BulkGlassRequirementItemCreateView(generics.CreateAPIView):
    """View for bulk creation of glass requirement items"""
    serializer_class = GlasseRequirementItemSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        # Validate we're getting a list of items
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of items"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process each item in the list
        items = []
        errors = []
        
        for idx, item_data in enumerate(request.data):
            serializer = self.get_serializer(data=item_data)
            if serializer.is_valid():
                items.append(serializer)
            else:
                errors.append({
                    "index": idx,
                    "errors": serializer.errors
                })
        
        # Return errors if any items are invalid
        if errors:
            return Response(
                {"detail": "Some items failed validation", "errors": errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save all valid items
        created_items = []
        for serializer in items:
            self.perform_create(serializer)
            created_items.append(serializer.data)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            created_items,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def perform_create(self, serializer):
        serializer.save()

    
class GlassRequirementCompaniesView(APIView):
    """
    Get all companies that have created glass items for a specific requirement
    """
    permission_classes = [AllowAny]
    def get(self, request, requirement_id, format=None):
        try:
            # Verify the requirement exists
            requirement = SubtypeGlasseRequirement.objects.get(pk=requirement_id)
        except SubtypeGlasseRequirement.DoesNotExist:
            return Response(
                {"error": "Glass requirement not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get distinct companies associated with glass items for this requirement
        company_ids = GlasseRequirementItem.objects.filter(
            requirement=requirement_id
        ).values_list('material__company', flat=True).distinct()
        
        companies = Company.objects.filter(company_id__in=company_ids)
        
        # Serialize the results
        result = [
            {
                "company_id": c.company_id,
                "name": c.name,
                "created_at": c.created_at
            }
            for c in companies
        ]
        
        return Response(result)
    

class CompanyGlassRequirementsView(APIView):
    """
    Get glass requirements associated with a specific company
    """
    def get(self, request, company_id, format=None):
        try:
            # Verify the company exists
            company = Company.objects.get(pk=company_id)
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get glass requirements where the company is the supplier
        requirements = SubtypeGlasseRequirement.objects.filter(
            companysupplier=company_id
        ).select_related('subtype__type')
        
        # Serialize the results
        result = []
        for req in requirements:
            result.append({
                "glassrequirement_id": req.glassrequirement_id,
                "subtype": {
                    "id": req.subtype.subtype_id,
                    "name": req.subtype.name,
                    "type": req.subtype.type.name
                },
                "width": str(req.width),
                "height": str(req.height),
                "created_at": req.created_at
            })
        
        return Response(result)
    


class CompanyGlassRequirementItemsView(APIView):
    """
    Get glass items for a specific company and requirement
    """
    permission_classes = [AllowAny]
    def get(self, request, company_id, requirement_id, format=None):
        try:
            # Verify both company and requirement exist
            company = Company.objects.get(pk=company_id)
            requirement = SubtypeGlasseRequirement.objects.get(
                pk=requirement_id,
                companysupplier=company_id  # Ensure requirement belongs to company
            )
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except SubtypeGlasseRequirement.DoesNotExist:
            return Response(
                {"error": "Glass requirement not found for this company"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get glass items for this requirement from this company
        items = GlasseRequirementItem.objects.filter(
            requirement=requirement_id,
            material__company=company_id
        ).select_related(
            'material',
            'requirement__subtype__type'
        )
        
        # Serialize results
        result = []
        for item in items:
            result.append({
                "item_id": item.glasse_item_id,
                "material": {
                    "id": item.material.material_id,
                    "name": item.material.name,
                    "unit_price": str(item.material.unit_price)
                },
                "width": str(item.width),
                "height": str(item.height),
                "subtype": item.requirement.subtype.name,
                "type": item.requirement.subtype.type.name,
                "created_at": item.created_at
            })
        
        return Response(result)