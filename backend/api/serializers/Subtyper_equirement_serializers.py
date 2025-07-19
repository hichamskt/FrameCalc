from rest_framework import serializers
from ..models import (
    SubtypeRequirement, 
)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate


class SubtypeRequirementSerializer(serializers.ModelSerializer):
    subtype_name = serializers.CharField(source='subtype.name', read_only=True)
    profile_name = serializers.CharField(source='profile.name', read_only=True)
    
    class Meta:
        model = SubtypeRequirement
        fields = [
            'requirement_id',
            'subtype', 'subtype_name',
            'profile', 'profile_name',
            'width', 'height',
            'created_at'
        ]
        read_only_fields = ['requirement_id', 'created_at']