# serializers.py
from rest_framework import serializers
from ..models import AccessoriesRequirementItem

class AccessoriesRequirementItemSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source='material.name', read_only=True)
    material_unit_type = serializers.CharField(source='material.unit_type', read_only=True)
    material_unit_price = serializers.DecimalField(
        source='material.unit_price', 
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    requirement_name = serializers.CharField(source='requirement.subtype.name', read_only=True)
    company_name = serializers.CharField(source='requirement.companysupplier.name', read_only=True)

    class Meta:
        model = AccessoriesRequirementItem
        fields = [
            'req_item_id',
            'requirement',
            'material',
            'quantity',
            'created_at',
            'material_name',
            'material_unit_type',
            'material_unit_price',
            'requirement_name',
            'company_name'
        ]
        extra_kwargs = {
            'requirement': {'write_only': True},
            'material': {'write_only': True}
        }
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero")
        return value