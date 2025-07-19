from rest_framework import serializers
from decimal import Decimal, ROUND_UP
import math
from ..models import (
    Quotation, QuotationMaterialItem, QuotationAluminumItem,
    Sketch, StructureSubType, Profile, SubtypeRequirement,
    SubtypeGlasseRequirement, SubtypeAccessoriesRequirement,
    AluminumRequirementItem, GlasseRequirementItem, AccessoriesRequirementItem
)


class QuotationMaterialItemSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source='material.name', read_only=True)
    
    class Meta:
        model = QuotationMaterialItem
        fields = ['item_id', 'material', 'material_name', 'unit_price', 'quantity']


class QuotationAluminumItemSerializer(serializers.ModelSerializer):
    profile_name = serializers.CharField(source='profile_material.name', read_only=True)
    
    class Meta:
        model = QuotationAluminumItem
        fields = ['item_id', 'profile_material', 'profile_name', 'unit_price', 'quantity']


class QuotationCreateSerializer(serializers.ModelSerializer):
    sketch_id = serializers.IntegerField(write_only=True)
    accessoriesrequirement_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    glassrequirement_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    requirement_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Quotation
        fields = [
            'quotation_id', 'sketch_id', 'accessoriesrequirement_id', 
            'glassrequirement_id', 'requirement_id', 'total_price', 'created_at'
        ]
        read_only_fields = ['quotation_id', 'total_price', 'created_at']

    def create(self, validated_data):
        sketch_id = validated_data.pop('sketch_id')
        accessoriesrequirement_id = validated_data.pop('accessoriesrequirement_id', None)
        glassrequirement_id = validated_data.pop('glassrequirement_id', None)
        requirement_id = validated_data.pop('requirement_id', None)
        
        try:
            sketch = Sketch.objects.get(sketch_id=sketch_id)
        except Sketch.DoesNotExist:
            raise serializers.ValidationError("Sketch not found")
        
        accessoriesrequirement = None
        glassrequirement = None
        requirement = None
        
        if accessoriesrequirement_id:
            try:
                accessoriesrequirement = SubtypeAccessoriesRequirement.objects.get(
                    accessoriesrequirement_id=accessoriesrequirement_id
                )
                print(f"DEBUG: Accessories requirement found: {accessoriesrequirement}")
                print(f"DEBUG: Accessories items count: {accessoriesrequirement.accessories_items.count()}")
            except SubtypeAccessoriesRequirement.DoesNotExist:
                raise serializers.ValidationError("Accessories requirement not found")
        
        if glassrequirement_id:
            try:
                glassrequirement = SubtypeGlasseRequirement.objects.get(
                    glassrequirement_id=glassrequirement_id
                )
                print(f"DEBUG: Glass requirement found: {glassrequirement}")
                print(f"DEBUG: Glass items count: {glassrequirement.glass_items.count()}")
            except SubtypeGlasseRequirement.DoesNotExist:
                raise serializers.ValidationError("Glass requirement not found")
        
        if requirement_id:
            try:
                requirement = SubtypeRequirement.objects.get(requirement_id=requirement_id)
                print(f"DEBUG: Aluminum requirement found: {requirement}")
            except SubtypeRequirement.DoesNotExist:
                raise serializers.ValidationError("Aluminum requirement not found")
        
        quotation = Quotation.objects.create(
            sketch=sketch,
            subtype=requirement.subtype if requirement else (
                glassrequirement.subtype if glassrequirement else 
                accessoriesrequirement.subtype if accessoriesrequirement else None
            ),
            profile=requirement.profile if requirement else None,
            accessoriesrequirement=accessoriesrequirement,
            glassrequirement=glassrequirement,
            requirement_id=requirement
        )
        
        print(f"DEBUG: Quotation created with ID: {quotation.quotation_id}")
        
        try:
            self._calculate_accessories_items(quotation, sketch)
            self._calculate_glass_items(quotation, sketch)
            self._calculate_aluminum_items(quotation, sketch)
        except Exception as e:
            print(f"DEBUG: Error in calculation methods: {e}")
            raise serializers.ValidationError(f"Error calculating items: {str(e)}")
        
        quotation.calculate_total()
        return quotation

    def _calculate_accessories_items(self, quotation, sketch):
        print(f"DEBUG: Starting accessories calculation")
        if not quotation.accessoriesrequirement:
            print("DEBUG: No accessories requirement, skipping")
            return
        
        accessories_items = quotation.accessoriesrequirement.accessories_items.all()
        print(f"DEBUG: Found {accessories_items.count()} accessories items")
        
        for item in accessories_items:
            try:
                material_item, created = QuotationMaterialItem.objects.get_or_create(
                    quotation=quotation,
                    material=item.material,
                    defaults={
                        'unit_price': item.material.unit_price,
                        'quantity': item.quantity
                    }
                )
                if not created:
                    material_item.quantity += item.quantity
                    material_item.save()
                print(f"DEBUG: Accessories item {'created' if created else 'updated'}: {item.material.name} - Qty: {item.quantity}")
            except Exception as e:
                print(f"DEBUG: Error creating accessories item: {e}")
                raise
    def _calculate_glass_items(self, quotation, sketch):
        """Calculate glass based on sketch dimensions and glass requirements"""
        if not quotation.glassrequirement:
            return
        
        # Get glass items for this requirement
        glass_items = quotation.glassrequirement.glass_items.all()
        
        # Calculate scaling factors
        width_scale = sketch.width / quotation.glassrequirement.width
        height_scale = sketch.height / quotation.glassrequirement.height
        
        for item in glass_items:
            # Scale the glass dimensions
            scaled_width = item.width * width_scale
            scaled_height = item.height * height_scale
            
            # Calculate area in square meters
            area_m2 = (scaled_width * scaled_height) / Decimal('1000000')  # Convert mm² to m²
            
            # Use get_or_create to handle potential duplicates
            material_item, created = QuotationMaterialItem.objects.get_or_create(
                quotation=quotation,
                material=item.material,
                defaults={
                    'unit_price': item.material.unit_price,
                    'quantity': area_m2
                }
            )
            
            # If item already exists, add to the quantity
            if not created:
                material_item.quantity += area_m2
                material_item.save()
    
    def _calculate_aluminum_items(self, quotation, sketch):
        """Calculate aluminum based on sketch dimensions and aluminum requirements"""
        if not quotation.requirement_id:
            return
        
        # Get aluminum items for this requirement
        aluminum_items = quotation.requirement_id.aluminum_items.all()
        
        # Calculate scaling factors
        width_scale = sketch.width / quotation.requirement_id.width
        height_scale = sketch.height / quotation.requirement_id.height
        
        for item in aluminum_items:
            # Scale the quantity (length in meters)
            scaled_quantity = item.quantity * max(width_scale, height_scale)
            
            # Round to nearest 0.5 meter (only sell 0.5m, 1m, 1.5m, 2m, etc.)
            rounded_quantity = Decimal(math.ceil(scaled_quantity * 2) / 2)
            
            # Use get_or_create to handle potential duplicates
            aluminum_item, created = QuotationAluminumItem.objects.get_or_create(
                quotation=quotation,
                profile_material=item.profile_material,
                defaults={
                    'unit_price': item.profile_material.unit_price,
                    'quantity': rounded_quantity
                }
            )
            
            # If item already exists, add to the quantity (then round again)
            if not created:
                new_total_quantity = aluminum_item.quantity + rounded_quantity
                aluminum_item.quantity = Decimal(math.ceil(new_total_quantity * 2) / 2)
                aluminum_item.save()
    





class QuotationDetailSerializer(serializers.ModelSerializer):
    sketch_shape = serializers.CharField(source='sketch.shape', read_only=True)
    sketch_width = serializers.DecimalField(source='sketch.width', max_digits=10, decimal_places=2, read_only=True)
    sketch_height = serializers.DecimalField(source='sketch.height', max_digits=10, decimal_places=2, read_only=True)
    subtype_name = serializers.CharField(source='subtype.name', read_only=True)
    profile_name = serializers.CharField(source='profile.name', read_only=True)

    glass_supplier = serializers.CharField(source='glassrequirement.companysupplier.name', read_only=True)
    accessories_supplier = serializers.CharField(source='accessoriesrequirement.companysupplier.name', read_only=True)

    material_items = QuotationMaterialItemSerializer(source='quotationmaterialitem_set', many=True, read_only=True)
    aluminum_items = QuotationAluminumItemSerializer(source='quotationaluminumitem_set', many=True, read_only=True)

    class Meta:
        model = Quotation
        fields = [
            'quotation_id', 'sketch_shape', 'sketch_width', 'sketch_height',
            'subtype_name', 'profile_name',
            'glass_supplier', 'accessories_supplier',  # 👈 added fields
            'total_price', 'created_at',
            'material_items', 'aluminum_items'
        ]


class QuotationListSerializer(serializers.ModelSerializer):
    sketch_shape = serializers.CharField(source='sketch.shape', read_only=True)
    sketch_dimensions = serializers.SerializerMethodField()
    subtype_name = serializers.CharField(source='subtype.name', read_only=True)
    
    class Meta:
        model = Quotation
        fields = [
            'quotation_id', 'sketch_shape', 'sketch_dimensions', 
            'subtype_name', 'total_price', 'created_at'
        ]
    
    def get_sketch_dimensions(self, obj):
        if obj.sketch:
            return f"{obj.sketch.width} x {obj.sketch.height}"
        return None

class QuotationUpdateSerializer(serializers.ModelSerializer):
    sketch_id = serializers.IntegerField(write_only=True, required=False)
    accessoriesrequirement_id = serializers.IntegerField(write_only=True, required=False)
    glassrequirement_id = serializers.IntegerField(write_only=True, required=False)
    requirement_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Quotation
        fields = ['sketch_id', 'accessoriesrequirement_id', 'glassrequirement_id', 'requirement_id']

    def update(self, instance, validated_data):
        from django.db import transaction

        try:
            with transaction.atomic():
                if 'sketch_id' in validated_data:
                    sketch = Sketch.objects.get(sketch_id=validated_data['sketch_id'])
                    instance.sketch = sketch

                if 'accessoriesrequirement_id' in validated_data:
                    acc_req = SubtypeAccessoriesRequirement.objects.get(
                        accessoriesrequirement_id=validated_data['accessoriesrequirement_id']
                    )
                    instance.accessoriesrequirement = acc_req

                if 'glassrequirement_id' in validated_data:
                    glass_req = SubtypeGlasseRequirement.objects.get(
                        glassrequirement_id=validated_data['glassrequirement_id']
                    )
                    instance.glassrequirement = glass_req

                if 'requirement_id' in validated_data:
                    alu_req = SubtypeRequirement.objects.get(
                        requirement_id=validated_data['requirement_id']
                    )
                    instance.requirement_id = alu_req
                    instance.subtype = alu_req.subtype
                    instance.profile = alu_req.profile

                instance.save()

                # Clear old items
                instance.quotationmaterialitem_set.all().delete()
                instance.quotationaluminumitem_set.all().delete()

                # Recalculate items
                creation_serializer = QuotationCreateSerializer()
                creation_serializer._calculate_accessories_items(instance, instance.sketch)
                creation_serializer._calculate_glass_items(instance, instance.sketch)
                creation_serializer._calculate_aluminum_items(instance, instance.sketch)
                instance.calculate_total()

                return instance
        except Exception as e:
            raise serializers.ValidationError(f"Update failed: {str(e)}")
        


class QuotationMaterialItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationMaterialItem
        fields = ['quantity', 'unit_price']


class QuotationAluminumItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationAluminumItem
        fields = ['quantity', 'unit_price']