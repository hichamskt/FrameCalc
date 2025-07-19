# views.py
from rest_framework import generics
from ..models import AccessoriesRequirementItem , SubtypeAccessoriesRequirement, Company
from ..serializers.AccessoriesRequirementItem import AccessoriesRequirementItemSerializer
from rest_framework.response import Response
from rest_framework import status


from rest_framework.views import APIView




class AccessoriesRequirementItemListCreateView(generics.ListCreateAPIView):
    queryset = AccessoriesRequirementItem.objects.select_related(
        'requirement__subtype',
        'material__company'
    ).all()
    serializer_class = AccessoriesRequirementItemSerializer
    filterset_fields = ['requirement', 'material']
    ordering_fields = ['created_at', 'quantity']
    ordering = ['-created_at']

class AccessoriesRequirementItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AccessoriesRequirementItem.objects.select_related(
        'requirement__subtype',
        'material__company'
    )
    serializer_class = AccessoriesRequirementItemSerializer
    lookup_field = 'req_item_id'

class RequirementAccessoriesItemsView(generics.ListCreateAPIView):
    serializer_class = AccessoriesRequirementItemSerializer
    permission_classes = []

    def get_queryset(self):
        requirement_id = self.kwargs['requirement_id']
        return AccessoriesRequirementItem.objects.filter(
            requirement=requirement_id
        ).select_related(
            'requirement__subtype',
            'material__company'
        )

    def perform_create(self, serializer):
        requirement_id = self.kwargs['requirement_id']
        serializer.save(requirement_id=requirement_id)

class BulkAccessoriesRequirementItemCreateView(generics.CreateAPIView):
    serializer_class = AccessoriesRequirementItemSerializer
    permission_classes = []
    def create(self, request, *args, **kwargs):
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of items"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
        
        if errors:
            return Response(
                {"detail": "Some items failed validation", "errors": errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
    





class CompanyAccessoriesRequirementItemsView(APIView):
    """
    Get accessories items for a specific requirement and company
    """
    permission_classes = []
    def get(self, request, requirement_id, company_id, format=None):
        try:
            # Verify requirement and company exist
            requirement = SubtypeAccessoriesRequirement.objects.get(pk=requirement_id)
            company = Company.objects.get(pk=company_id)
        except SubtypeAccessoriesRequirement.DoesNotExist:
            return Response(
                {"error": "Accessories requirement not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get items for this requirement from this company
        items = AccessoriesRequirementItem.objects.filter(
            requirement=requirement_id,
            material__company=company_id
        ).select_related(
            'material',
            'requirement__subtype',
            'requirement__companysupplier'
        )
        
        # Serialize results
        result = []
        for item in items:
            result.append({
                "req_item_id": item.req_item_id,
                "material": {
                    "id": item.material.material_id,
                    "name": item.material.name,
                    "unit_price": str(item.material.unit_price),
                    "unit_type": item.material.unit_type
                },
                "quantity": str(item.quantity),
                "requirement": {
                    "id": item.requirement.accessoriesrequirement_id,
                    "subtype": item.requirement.subtype.name
                },
                "created_at": item.created_at
            })
        
        return Response(result)