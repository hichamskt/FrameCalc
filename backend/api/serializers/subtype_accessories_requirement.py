
from rest_framework import serializers
from ..models import (
    SubtypeAccessoriesRequirement
)


class SubtypeAccessoriesRequirementSerializer(serializers.ModelSerializer):
    subtype_name = serializers.CharField(source='subtype.name', read_only=True)
    company_name = serializers.CharField(source='companysupplier.name', read_only=True)
    
    class Meta:
        model = SubtypeAccessoriesRequirement
        fields = [
            'accessoriesrequirement_id',
            'subtype', 'subtype_name',
            'companysupplier', 'company_name',
            'created_at'
        ]
        read_only_fields = ['accessoriesrequirement_id', 'created_at']