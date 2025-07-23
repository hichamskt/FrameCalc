from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.http import HttpResponse, FileResponse
from django.template.loader import render_to_string
from django.conf import settings
from ..serializers.Quotation import (
    QuotationDetailSerializer, QuotationCreateSerializer, QuotationListSerializer,
    Quotation, SubtypeRequirement, Sketch, SubtypeGlasseRequirement, 
    SubtypeAccessoriesRequirement, QuotationUpdateSerializer , QuotationMaterialItem , QuotationMaterialItemUpdateSerializer , QuotationAluminumItemUpdateSerializer , QuotationAluminumItem
)
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
import os
from datetime import datetime
import base64
from io import BytesIO
from rest_framework.views import APIView


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from datetime import datetime, date
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError


from django.db import models
# PDF generation imports
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

# Alternative: WeasyPrint (uncomment if you prefer HTML to PDF)
# try:
#     import weasyprint
#     WEASYPRINT_AVAILABLE = True
# except ImportError:
#     WEASYPRINT_AVAILABLE = False


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


def generate_quotation_pdf_reportlab(quotation):
    """
    Generate PDF using ReportLab
    """
    if not REPORTLAB_AVAILABLE:
        raise ImportError("ReportLab is not installed. Install it with: pip install reportlab")
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#2E86AB')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        textColor=colors.HexColor('#2E86AB')
    )
    
    # Title
    title = Paragraph("QUOTATION", title_style)
    elements.append(title)
    elements.append(Spacer(1, 12))
    
    # Quotation Info
    quotation_info = [
        ['Quotation ID:', f"#{quotation.quotation_id}"],
        ['Date:', datetime.now().strftime("%B %d, %Y")],
        ['Customer:', quotation.sketch.user.get_full_name() or quotation.sketch.user.username],
        ['Project:', f"Sketch #{quotation.sketch.sketch_id}"],
        ['Dimensions:', f"{quotation.sketch.width} x {quotation.sketch.height}"],
        ['Shape:', quotation.sketch.shape],
    ]
    
    if quotation.subtype:
        quotation_info.append(['Subtype:', quotation.subtype.name])
    if quotation.profile:
        quotation_info.append(['Profile:', quotation.profile.name])
    
    info_table = Table(quotation_info, colWidths=[2*inch, 3*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F0F8FF')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(info_table)
    elements.append(Spacer(1, 20))
    
    # Material Items
    material_items = quotation.quotationmaterialitem_set.all()
    if material_items.exists():
        elements.append(Paragraph("Material Items", heading_style))
        
        material_data = [['Material', 'Unit Price', 'Quantity', 'Total']]
        for item in material_items:
            total = item.unit_price * item.quantity
            material_data.append([
                item.material.name,
                f"${item.unit_price:.2f}",
                str(item.quantity),
                f"${total:.2f}"
            ])
        
        material_table = Table(material_data, colWidths=[3*inch, 1.5*inch, 1*inch, 1.5*inch])
        material_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E86AB')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F0F8FF')]),
        ]))
        
        elements.append(material_table)
        elements.append(Spacer(1, 15))
    
    # Aluminum Items
    aluminum_items = quotation.quotationaluminumitem_set.all()
    if aluminum_items.exists():
        elements.append(Paragraph("Aluminum Items", heading_style))
        
        aluminum_data = [['Profile Material', 'Unit Price', 'Quantity', 'Total']]
        for item in aluminum_items:
            total = item.unit_price * item.quantity
            aluminum_data.append([
                item.profile_material.name,
                f"${item.unit_price:.2f}",
                str(item.quantity),
                f"${total:.2f}"
            ])
        
        aluminum_table = Table(aluminum_data, colWidths=[3*inch, 1.5*inch, 1*inch, 1.5*inch])
        aluminum_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E86AB')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F0F8FF')]),
        ]))
        
        elements.append(aluminum_table)
        elements.append(Spacer(1, 20))
    
    # Total
    total_style = ParagraphStyle(
        'Total',
        parent=styles['Normal'],
        fontSize=18,
        alignment=TA_RIGHT,
        textColor=colors.HexColor('#2E86AB'),
        fontName='Helvetica-Bold'
    )
    
    total_paragraph = Paragraph(f"<b>Total: ${quotation.total_price:.2f}</b>", total_style)
    elements.append(total_paragraph)
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_quotation_pdf(request, quotation_id):
    """
    Generate and return a PDF for a specific quotation
    """
    try:
        quotation = Quotation.objects.get(
            quotation_id=quotation_id,
            sketch__user=request.user
        )
        
        # Generate PDF
        pdf_buffer = generate_quotation_pdf_reportlab(quotation)
        
        # Create filename
        filename = f"quotation_{quotation_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        # Return PDF as file response
        response = FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename=filename,
            content_type='application/pdf'
        )
        
        return response
        
    except Quotation.DoesNotExist:
        return Response(
            {'error': 'Quotation not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except ImportError as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': f'Error generating PDF: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quotation_pdf_base64(request, quotation_id):
    """
    Generate and return a PDF as base64 string for display in frontend
    """
    try:
        quotation = Quotation.objects.get(
            quotation_id=quotation_id,
            sketch__user=request.user
        )
        
        # Generate PDF
        pdf_buffer = generate_quotation_pdf_reportlab(quotation)
        
        # Convert to base64
        pdf_base64 = base64.b64encode(pdf_buffer.read()).decode('utf-8')
        
        return Response({
            'quotation_id': quotation_id,
            'pdf_base64': pdf_base64,
            'filename': f"quotation_{quotation_id}.pdf"
        })
        
    except Quotation.DoesNotExist:
        return Response(
            {'error': 'Quotation not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except ImportError as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': f'Error generating PDF: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Keep all your existing views below...

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
    

class GenerateQuotationPDFBySketchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, sketch_id):
        """
        Generate and return a PDF for quotations associated with a specific sketch
        """
        try:
            # Get the most recent quotation for this sketch
            quotation = Quotation.objects.filter(
                sketch__sketch_id=sketch_id,
                sketch__user=request.user
            ).select_related(
                'sketch', 'subtype', 'profile'
            ).prefetch_related(
                'quotationmaterialitem_set__material',
                'quotationaluminumitem_set__profile_material'
            ).order_by('-created_at').first()
            
            if not quotation:
                return Response(
                    {'error': 'No quotation found for this sketch'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Generate PDF
            pdf_buffer = generate_quotation_pdf_reportlab(quotation)
            
            # Create filename
            filename = f"quotation_sketch_{sketch_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            
            # Return PDF as file response
            response = FileResponse(
                pdf_buffer,
                as_attachment=True,
                filename=filename,
                content_type='application/pdf'
            )
            
            return response
            
        except Exception as e:
            return Response(
                {'error': f'Error generating PDF: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetQuotationPDFBase64BySketchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, sketch_id):
        """
        Generate and return a PDF as base64 string for quotations associated with a sketch
        """
        try:
            # Get the most recent quotation for this sketch
            quotation = Quotation.objects.filter(
                sketch__sketch_id=sketch_id,
                sketch__user=request.user
            ).select_related(
                'sketch', 'subtype', 'profile'
            ).prefetch_related(
                'quotationmaterialitem_set__material',
                'quotationaluminumitem_set__profile_material'
            ).order_by('-created_at').first()
            
            if not quotation:
                return Response(
                    {'error': 'No quotation found for this sketch'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Generate PDF
            pdf_buffer = generate_quotation_pdf_reportlab(quotation)
            
            # Convert to base64
            pdf_base64 = base64.b64encode(pdf_buffer.read()).decode('utf-8')
            
            return Response({
                'sketch_id': sketch_id,
                'quotation_id': quotation.quotation_id,
                'pdf_base64': pdf_base64,
                'filename': f"quotation_sketch_{sketch_id}.pdf"
            })
            
        except Exception as e:
            return Response(
                {'error': f'Error generating PDF: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_sketches_without_quotations(request):
    """
    Delete all sketches that don't have any quotations for the current user
    """
    try:
        # Find sketches without quotations for the current user
        sketches_without_quotations = Sketch.objects.filter(
            user=request.user
        ).annotate(
            quotation_count=models.Count('quotation')
        ).filter(quotation_count=0)
        
        # Get count and details before deletion
        count = sketches_without_quotations.count()
        sketch_details = list(sketches_without_quotations.values(
            'sketch_id', 'shape', 'width', 'height', 'created_at'
        ))
        
        # Delete the sketches
        deleted_count, _ = sketches_without_quotations.delete()
        
        return Response({
            'message': f'Successfully deleted {deleted_count} sketches without quotations',
            'deleted_sketches': sketch_details,
            'count': count
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Error deleting sketches: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



class QuotationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class QuotationFilterView(generics.ListAPIView):
    """
    Filter quotations with multiple parameters and pagination
    
    Query Parameters:
    - subtype: Filter by subtype ID or name
    - price_min: Minimum price filter (decimal)
    - price_max: Maximum price filter (decimal)
    - width_min: Minimum width filter (decimal)
    - width_max: Maximum width filter (decimal)
    - height_min: Minimum height filter (decimal)
    - height_max: Maximum height filter (decimal)
    - date_from: Start date filter (YYYY-MM-DD format)
    - date_to: End date filter (YYYY-MM-DD format)
    - page: Page number (default: 1)
    - page_size: Items per page (default: 20, max: 100)
    - ordering: Order by field (options: created_at, -created_at, total_price, -total_price)
    
    Example URL: 
    /api/quotations/filter/?subtype=1&price_min=100&price_max=1000&width_min=50&date_from=2024-01-01&page=1&page_size=10
    """
    serializer_class = QuotationListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = QuotationPagination

    def get_queryset(self):
        queryset = Quotation.objects.filter(
            sketch__user=self.request.user
        ).select_related(
            'sketch', 'subtype', 'profile'
        ).prefetch_related(
            'quotationmaterialitem_set__material',
            'quotationaluminumitem_set__profile_material'
        )

        # Get query parameters
        subtype = self.request.query_params.get('subtype', None)
        price_min = self.request.query_params.get('price_min', None)
        price_max = self.request.query_params.get('price_max', None)
        width_min = self.request.query_params.get('width_min', None)
        width_max = self.request.query_params.get('width_max', None)
        height_min = self.request.query_params.get('height_min', None)
        height_max = self.request.query_params.get('height_max', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        ordering = self.request.query_params.get('ordering', '-created_at')

        # Apply filters
        filters = Q()

        # Subtype filter (can be ID or name)
        if subtype:
            try:
                # Try to convert to int first (ID)
                subtype_id = int(subtype)
                filters &= Q(subtype__subtype_id=subtype_id)
            except ValueError:
                # If not an int, treat as name
                filters &= Q(subtype__name__icontains=subtype)

        # Price filters
        if price_min:
            try:
                price_min_decimal = Decimal(str(price_min))
                filters &= Q(total_price__gte=price_min_decimal)
            except (InvalidOperation, ValueError):
                pass  # Ignore invalid price_min

        if price_max:
            try:
                price_max_decimal = Decimal(str(price_max))
                filters &= Q(total_price__lte=price_max_decimal)
            except (InvalidOperation, ValueError):
                pass  # Ignore invalid price_max

        # Width filters (from sketch)
        if width_min:
            try:
                width_min_decimal = Decimal(str(width_min))
                filters &= Q(sketch__width__gte=width_min_decimal)
            except (InvalidOperation, ValueError):
                pass

        if width_max:
            try:
                width_max_decimal = Decimal(str(width_max))
                filters &= Q(sketch__width__lte=width_max_decimal)
            except (InvalidOperation, ValueError):
                pass

        # Height filters (from sketch)
        if height_min:
            try:
                height_min_decimal = Decimal(str(height_min))
                filters &= Q(sketch__height__gte=height_min_decimal)
            except (InvalidOperation, ValueError):
                pass

        if height_max:
            try:
                height_max_decimal = Decimal(str(height_max))
                filters &= Q(sketch__height__lte=height_max_decimal)
            except (InvalidOperation, ValueError):
                pass

        # Date filters
        if date_from:
            try:
                from_date = datetime.strptime(date_from, '%Y-%m-%d').date()
                filters &= Q(created_at__date__gte=from_date)
            except ValueError:
                pass  # Ignore invalid date format

        if date_to:
            try:
                to_date = datetime.strptime(date_to, '%Y-%m-%d').date()
                filters &= Q(created_at__date__lte=to_date)
            except ValueError:
                pass  # Ignore invalid date format

        # Apply all filters
        queryset = queryset.filter(filters)

        # Apply ordering
        valid_ordering_fields = [
            'created_at', '-created_at',
            'total_price', '-total_price',
            'updated_at', '-updated_at',
            'sketch__width', '-sketch__width',
            'sketch__height', '-sketch__height'
        ]
        
        if ordering in valid_ordering_fields:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')  # Default ordering

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Get filter parameters for response metadata
        filters_applied = {}
        for param in ['subtype', 'price_min', 'price_max', 'width_min', 'width_max', 
                     'height_min', 'height_max', 'date_from', 'date_to', 'ordering']:
            value = request.query_params.get(param)
            if value:
                filters_applied[param] = value

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data = self.get_paginated_response(serializer.data)
            
            # Add metadata to response
            response_data.data['filters_applied'] = filters_applied
            response_data.data['total_results'] = queryset.count()
            
            return response_data

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'filters_applied': filters_applied,
            'total_results': queryset.count()
        })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def bulk_delete_quotations(request):
    """
    Delete multiple quotations by their IDs
    
    Expected payload:
    {
        "quotation_ids": [1, 2, 3, 4, 5]
    }
    
    Returns:
    - Success: List of deleted quotations with their details
    - Error: List of IDs that couldn't be deleted and reasons
    """
    try:
        quotation_ids = request.data.get('quotation_ids', [])
        
        # Validate that quotation_ids is provided and is a list
        if not quotation_ids:
            return Response(
                {'error': 'quotation_ids array is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not isinstance(quotation_ids, list):
            return Response(
                {'error': 'quotation_ids must be an array'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate that all IDs are integers
        try:
            quotation_ids = [int(id) for id in quotation_ids]
        except (ValueError, TypeError):
            return Response(
                {'error': 'All quotation_ids must be valid integers'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find quotations that belong to the current user
        quotations_to_delete = Quotation.objects.filter(
            quotation_id__in=quotation_ids,
            sketch__user=request.user
        ).select_related('sketch', 'subtype', 'profile')
        
        # Get details of quotations before deletion
        deleted_quotations = []
        found_ids = []
        
        for quotation in quotations_to_delete:
            deleted_quotations.append({
                'quotation_id': quotation.quotation_id,
                'sketch_id': quotation.sketch.sketch_id if quotation.sketch else None,
                'sketch_dimensions': f"{quotation.sketch.width} x {quotation.sketch.height}" if quotation.sketch else None,
                'subtype': quotation.subtype.name if quotation.subtype else None,
                'profile': quotation.profile.name if quotation.profile else None,
                'total_price': float(quotation.total_price),
                'created_at': quotation.created_at
            })
            found_ids.append(quotation.quotation_id)
        
        # Identify quotations that were not found or don't belong to user
        not_found_ids = [id for id in quotation_ids if id not in found_ids]
        
        # Delete the quotations
        deleted_count, deletion_details = quotations_to_delete.delete()
        
        # Prepare response
        response_data = {
            'message': f'Successfully deleted {len(deleted_quotations)} quotations',
            'deleted_count': len(deleted_quotations),
            'deleted_quotations': deleted_quotations,
            'requested_count': len(quotation_ids)
        }
        
        # Add information about not found quotations if any
        if not_found_ids:
            response_data['not_found_ids'] = not_found_ids
            response_data['not_found_count'] = len(not_found_ids)
            response_data['message'] += f'. {len(not_found_ids)} quotations were not found or do not belong to you.'
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Error deleting quotations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Alternative class-based view implementation
class BulkDeleteQuotationsView(APIView):
    """
    Delete multiple quotations by their IDs (Class-based view alternative)
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        """
        Delete multiple quotations by their IDs
        
        Expected payload:
        {
            "quotation_ids": [1, 2, 3, 4, 5]
        }
        """
        try:
            quotation_ids = request.data.get('quotation_ids', [])
            
            # Validate input
            if not quotation_ids:
                return Response(
                    {'error': 'quotation_ids array is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not isinstance(quotation_ids, list):
                return Response(
                    {'error': 'quotation_ids must be an array'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Convert to integers and validate
            try:
                quotation_ids = [int(id) for id in quotation_ids]
            except (ValueError, TypeError):
                return Response(
                    {'error': 'All quotation_ids must be valid integers'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Remove duplicates while preserving order
            quotation_ids = list(dict.fromkeys(quotation_ids))
            
            # Find and delete quotations
            quotations_query = Quotation.objects.filter(
                quotation_id__in=quotation_ids,
                sketch__user=request.user
            ).select_related('sketch', 'subtype', 'profile')
            
            # Collect information before deletion
            deletion_info = []
            found_ids = []
            
            for quotation in quotations_query:
                deletion_info.append({
                    'quotation_id': quotation.quotation_id,
                    'sketch_id': quotation.sketch.sketch_id if quotation.sketch else None,
                    'total_price': float(quotation.total_price),
                    'subtype': quotation.subtype.name if quotation.subtype else None,
                    'created_at': quotation.created_at.isoformat()
                })
                found_ids.append(quotation.quotation_id)
            
            # Perform deletion
            deleted_count, _ = quotations_query.delete()
            
            # Identify not found quotations
            not_found_ids = [id for id in quotation_ids if id not in found_ids]
            
            return Response({
                'success': True,
                'message': f'Successfully deleted {deleted_count} quotations',
                'deleted_count': deleted_count,
                'deleted_quotations': deletion_info,
                'requested_count': len(quotation_ids),
                'not_found_ids': not_found_ids,
                'not_found_count': len(not_found_ids)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Unexpected error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )