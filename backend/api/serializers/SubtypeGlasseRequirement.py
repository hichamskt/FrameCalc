from rest_framework import serializers
from ..models import (
    User, Company, Material, Profile, ProfileAluminum, StructureType,
    StructureSubType, SubtypeRequirement, MaterialRequirement,
    AluminumRequirement, Sketch, Quotation, QuotationMaterialItem, QuotationAluminumItem , SupplyType , Category, SubtypeGlasseRequirement
)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate


class SubtypeGlasseRequirementSerializer(serializers.ModelSerializer):
    subtype_name = serializers.CharField(source='subtype.name', read_only=True)
    company_name = serializers.CharField(source='companysupplier.name', read_only=True)
    
    class Meta:
        model = SubtypeGlasseRequirement
        fields = [
            'glassrequirement_id',
            'subtype', 'subtype_name',
            'width', 'height',
            'companysupplier', 'company_name',
            'created_at'
        ]
        read_only_fields = ['glassrequirement_id', 'created_at']