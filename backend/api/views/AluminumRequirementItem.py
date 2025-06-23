from rest_framework import generics
from django.shortcuts import get_object_or_404
from ..models import AluminumRequirementItem, SubtypeRequirement , ProfileAluminum
from ..serializers.AluminumRequirementItem import AluminumRequirementItemSerializer
from rest_framework.exceptions import ValidationError
from rest_framework import status

from rest_framework.response import Response

 

class AluminumRequirementItemListCreateView(generics.ListCreateAPIView):
    serializer_class = AluminumRequirementItemSerializer
    
    def get_queryset(self):
        queryset = AluminumRequirementItem.objects.select_related(
            'requirement', 'profile_material'
        )
        
        # Filter by requirement if provided
        requirement_id = self.request.query_params.get('requirement_id')
        if requirement_id:
            queryset = queryset.filter(requirement_id=requirement_id)
            
        # Filter by profile material if provided
        profile_id = self.request.query_params.get('profile_material_id')
        if profile_id:
            queryset = queryset.filter(profile_material_id=profile_id)
            
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        
       
            
        serializer.save()

class AluminumRequirementItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AluminumRequirementItem.objects.select_related(
        'requirement', 'profile_material'
    )
    serializer_class = AluminumRequirementItemSerializer
    lookup_field = 'req_item_id'

class RequirementAluminumItemsView(generics.ListAPIView):
   
    serializer_class = AluminumRequirementItemSerializer
    permission_classes = []  # Empty list means no permissions required
    
    def get_queryset(self):
        requirement_id = self.kwargs['requirement_id']
        get_object_or_404(SubtypeRequirement, pk=requirement_id)
        return AluminumRequirementItem.objects.filter(
            requirement_id=requirement_id
        ).select_related('profile_material').order_by('-created_at')
    


class BulkAluminumRequirementItemCreateView(generics.CreateAPIView):
    serializer_class = AluminumRequirementItemSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        
        requirement = serializer.validated_data[0]['requirement']
        existing_materials = set(requirement.aluminum_items.values_list(
            'profile_material_id', flat=True  # Changed to profile_material_id
        ))
        
        new_materials = set()
        duplicates = set()
        
        for item in serializer.validated_data:
            material_id = item['profile_material'].pk  # Changed to .pk
            if material_id in existing_materials:
                duplicates.add(str(material_id))
            if material_id in new_materials:
                duplicates.add(str(material_id))
            new_materials.add(material_id)
            
            
        
        if duplicates:
            raise ValidationError({
                "profile_material": f"Duplicate materials found: {', '.join(duplicates)}"
            })
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)