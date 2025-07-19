# serializers.py
from rest_framework import serializers
from ..models import GlasseRequirementItem


class GlasseRequirementItemSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source='material.name', read_only=True)
    subtype_name = serializers.CharField(source='requirement.subtype.name', read_only=True)
    company_name = serializers.CharField(source='requirement.companysupplier.name', read_only=True)
    unit_type = serializers.CharField(source='material.unit_type', read_only=True)
    
    class Meta:
        model = GlasseRequirementItem
        fields = [
            'glasse_item_id',
            'requirement',
            'material',
            'width',
            'height',
            'material_name',
            'subtype_name',
            'company_name',
            'unit_type',
            'created_at'
        ]
        extra_kwargs = {
            'requirement': {'write_only': True},
            'material': {'write_only': True}
        }
    
    def validate(self, data):
        # Validate dimensions
        if data.get('width') <= 0:
            raise serializers.ValidationError("Width must be a positive number")
        if data.get('height') <= 0:
            raise serializers.ValidationError("Height must be a positive number")
        return data