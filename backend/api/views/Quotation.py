from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..serializers.Quotation import (
    QuotationDetailSerializer, QuotationCreateSerializer, QuotationListSerializer,
    Quotation, SubtypeRequirement, Sketch, SubtypeGlasseRequirement, 
    SubtypeAccessoriesRequirement, QuotationUpdateSerializer , QuotationMaterialItem , QuotationMaterialItemUpdateSerializer , QuotationAluminumItemUpdateSerializer , QuotationAluminumItem
)
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404


class QuotationListCreateView(generics.ListCreateAPIView):
    """
    List all quotations or create a new quotation
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter quotations by user's sketches
        return Quotation.objects.filter(
            sketch__user=self.request.user
        ).select_related(
            'sketch', 'subtype', 'profile'
        ).prefetch_related(
            'quotationmaterialitem_set__material',
            'quotationaluminumitem_set__profile_material'
        )
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuotationCreateSerializer
        return QuotationListSerializer
    
    def perform_create(self, serializer):
        # Validate that sketch belongs to current user
        sketch_id = serializer.validated_data.get('sketch_id')
        sketch = get_object_or_404(Sketch, sketch_id=sketch_id, user=self.request.user)
        serializer.save()



class QuotationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuotationDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'quotation_id'

    def get_queryset(self):
        return Quotation.objects.filter(
            sketch__user=self.request.user
        ).select_related(
            'sketch', 'subtype', 'profile'
        ).prefetch_related(
            'quotationmaterialitem_set__material',
            'quotationaluminumitem_set__profile_material'
        )

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return QuotationUpdateSerializer
        return QuotationDetailSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recalculate_quotation(request, quotation_id):
    """
    Recalculate a quotation's total price
    """
    try:
        quotation = Quotation.objects.get(
            quotation_id=quotation_id,
            sketch__user=request.user
        )
        total = quotation.calculate_total()
        
        return Response({
            'quotation_id': quotation_id,
            'total_price': total,
            'message': 'Quotation recalculated successfully'
        })
        
    except Quotation.DoesNotExist:
        return Response(
            {'error': 'Quotation not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_requirements_for_subtype(request, subtype_id):
    """
    Get all requirements (aluminum, glass, accessories) for a specific subtype
    """
    try:
        from ..models import StructureSubType
        subtype = StructureSubType.objects.get(subtype_id=subtype_id)
        
        # Get aluminum requirements
        aluminum_requirements = SubtypeRequirement.objects.filter(
            subtype=subtype
        ).select_related('profile')
        
        # Get glass requirements
        glass_requirements = SubtypeGlasseRequirement.objects.filter(
            subtype=subtype
        ).select_related('companysupplier')
        
        # Get accessories requirements
        accessories_requirements = SubtypeAccessoriesRequirement.objects.filter(
            subtype=subtype
        ).select_related('companysupplier')
        
        data = {
            'subtype_id': subtype_id,
            'subtype_name': subtype.name,
            'aluminum_requirements': [
                {
                    'requirement_id': req.requirement_id,
                    'profile_name': req.profile.name,
                    'width': req.width,
                    'height': req.height
                } for req in aluminum_requirements
            ],
            'glass_requirements': [
                {
                    'glassrequirement_id': req.glassrequirement_id,
                    'supplier_name': req.companysupplier.name,
                    'width': req.width,
                    'height': req.height
                } for req in glass_requirements
            ],
            'accessories_requirements': [
                {
                    'accessoriesrequirement_id': req.accessoriesrequirement_id,
                    'supplier_name': req.companysupplier.name
                } for req in accessories_requirements
            ]
        }
        
        return Response(data)
        
    except StructureSubType.DoesNotExist:
        return Response(
            {'error': 'Subtype not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_quotation_with_calculation(request):
    """
    Create a quotation with automatic calculation
    Expected payload:
    {
        "sketch_id": 1,
        "accessoriesrequirement_id": 1,  // optional
        "glassrequirement_id": 1,        // optional
        "requirement_id": 1              // optional (aluminum requirement)
    }
    """
    print(f"DEBUG: Received quotation creation request with data: {request.data}")
    
    serializer = QuotationCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        # Validate sketch belongs to user
        sketch_id = serializer.validated_data.get('sketch_id')
        try:
            sketch = Sketch.objects.get(sketch_id=sketch_id, user=request.user)
            print(f"DEBUG: Sketch found: {sketch}")
        except Sketch.DoesNotExist:
            return Response(
                {'error': 'Sketch not found or does not belong to you'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            quotation = serializer.save()
            print(f"DEBUG: Quotation created successfully: {quotation.quotation_id}")
            
            # Return detailed quotation
            detail_serializer = QuotationDetailSerializer(quotation)
            return Response(detail_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"DEBUG: Error creating quotation: {e}")
            return Response(
                {'error': f'Error creating quotation: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    print(f"DEBUG: Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_sketches(request):
    """
    Get all sketches for the current user to use in quotations
    """
    sketches = Sketch.objects.filter(user=request.user)
    data = [
        {
            'sketch_id': sketch.sketch_id,
            'shape': sketch.shape,
            'width': sketch.width,
            'height': sketch.height,
            'created_at': sketch.created_at
        } for sketch in sketches
    ]
    
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_glass_requirement(request, glassrequirement_id):
    """
    Debug endpoint to check glass requirement and its items
    """
    try:
        glass_req = SubtypeGlasseRequirement.objects.get(
            glassrequirement_id=glassrequirement_id
        )
        
        glass_items = glass_req.glass_items.all()
        
        data = {
            'glassrequirement_id': glass_req.glassrequirement_id,
            'subtype': glass_req.subtype.name,
            'supplier': glass_req.companysupplier.name,
            'width': glass_req.width,
            'height': glass_req.height,
            'glass_items_count': glass_items.count(),
            'glass_items': [
                {
                    'glasse_item_id': item.glasse_item_id,
                    'material_name': item.material.name,
                    'material_id': item.material.material_id,
                    'width': item.width,
                    'height': item.height,
                    'unit_price': item.material.unit_price,
                    'supply_type': item.material.supply_type.name
                } for item in glass_items
            ]
        }
        
        return Response(data)
        
    except SubtypeGlasseRequirement.DoesNotExist:
        return Response(
            {'error': 'Glass requirement not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_accessories_requirement(request, accessoriesrequirement_id):
    """
    Debug endpoint to check accessories requirement and its items
    """
    try:
        accessories_req = SubtypeAccessoriesRequirement.objects.get(
            accessoriesrequirement_id=accessoriesrequirement_id
        )
        
        accessories_items = accessories_req.accessories_items.all()
        
        data = {
            'accessoriesrequirement_id': accessories_req.accessoriesrequirement_id,
            'subtype': accessories_req.subtype.name,
            'supplier': accessories_req.companysupplier.name,
            'accessories_items_count': accessories_items.count(),
            'accessories_items': [
                {
                    'req_item_id': item.req_item_id,
                    'material_name': item.material.name,
                    'material_id': item.material.material_id,
                    'quantity': item.quantity,
                    'unit_price': item.material.unit_price,
                    'supply_type': item.material.supply_type.name
                } for item in accessories_items
            ]
        }
        
        return Response(data)
        
    except SubtypeAccessoriesRequirement.DoesNotExist:
        return Response(
            {'error': 'Accessories requirement not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_aluminum_requirement(request, requirement_id):
    """
    Debug endpoint to check aluminum requirement and its items
    """
    try:
        aluminum_req = SubtypeRequirement.objects.get(
            requirement_id=requirement_id
        )
        
        aluminum_items = aluminum_req.aluminum_items.all()
        
        data = {
            'requirement_id': aluminum_req.requirement_id,
            'subtype': aluminum_req.subtype.name,
            'profile': aluminum_req.profile.name,
            'width': aluminum_req.width,
            'height': aluminum_req.height,
            'aluminum_items_count': aluminum_items.count(),
            'aluminum_items': [
                {
                    'req_item_id': item.req_item_id,
                    'profile_material_name': item.profile_material.name,
                    'profile_material_id': item.profile_material.profile_material_id,
                    'quantity': item.quantity,
                    'unit_price': item.profile_material.unit_price,
                    'reference': item.profile_material.reference
                } for item in aluminum_items
            ]
        }
        
        return Response(data)
        
    except SubtypeRequirement.DoesNotExist:
        return Response(
            {'error': 'Aluminum requirement not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_quotation_items(request, quotation_id):
    """
    Debug endpoint to check what items were created for a quotation
    """
    try:
        quotation = Quotation.objects.get(
            quotation_id=quotation_id,
            sketch__user=request.user
        )
        
        material_items = quotation.quotationmaterialitem_set.all()
        aluminum_items = quotation.quotationaluminumitem_set.all()
        
        data = {
            'quotation_id': quotation.quotation_id,
            'sketch_id': quotation.sketch.sketch_id if quotation.sketch else None,
            'sketch_dimensions': f"{quotation.sketch.width} x {quotation.sketch.height}" if quotation.sketch else None,
            'subtype': quotation.subtype.name if quotation.subtype else None,
            'profile': quotation.profile.name if quotation.profile else None,
            'total_price': quotation.total_price,
            'has_glass_requirement': quotation.glassrequirement is not None,
            'has_accessories_requirement': quotation.accessoriesrequirement is not None,
            'has_aluminum_requirement': quotation.requirement_id is not None,
            'material_items_count': material_items.count(),
            'aluminum_items_count': aluminum_items.count(),
            'material_items': [
                {
                    'item_id': item.item_id,
                    'material_name': item.material.name,
                    'unit_price': item.unit_price,
                    'quantity': item.quantity,
                    'total': item.unit_price * item.quantity
                } for item in material_items
            ],
            'aluminum_items': [
                {
                    'item_id': item.item_id,
                    'profile_name': item.profile_material.name,
                    'unit_price': item.unit_price,
                    'quantity': item.quantity,
                    'total': item.unit_price * item.quantity
                } for item in aluminum_items
            ]
        }
        
        return Response(data)
        
    except Quotation.DoesNotExist:
        return Response(
            {'error': 'Quotation not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    

class QuotationMaterialItemUpdateView(generics.UpdateAPIView):
    queryset = QuotationMaterialItem.objects.all()
    serializer_class = QuotationMaterialItemUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'item_id'

    def get_queryset(self):
        return self.queryset.filter(quotation__sketch__user=self.request.user)


class QuotationAluminumItemUpdateView(generics.UpdateAPIView):
    queryset = QuotationAluminumItem.objects.all()
    serializer_class = QuotationAluminumItemUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'item_id'

    def get_queryset(self):
        return self.queryset.filter(quotation__sketch__user=self.request.user)
    
