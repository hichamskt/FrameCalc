from rest_framework import serializers
from .models import (
    User, Company, Material, Profile, ProfileAluminum, StructureType,
    StructureSubType, SubtypeRequirement, MaterialRequirement,
    AluminumRequirement, Sketch, Quotation, QuotationMaterialItem, QuotationAluminumItem
)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'user_id': {'read_only': True}  # Typically auto-generated
        }

    def validate_email(self, value):
        value = value.lower().strip()
        # Handle both create and update scenarios
        if self.instance is None or self.instance.email != value:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                {"password2": "Passwords don't match"}
            )
        
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': e.messages})
            
        return data

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove confirmation field
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        validated_data.pop('password2', None)  # Safely remove if exists
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance

# Company Serializer
class CompanySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Company
        fields = ['company_id', 'user', 'name', 'created_at']

# Material Serializer
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

# ProfileAluminum Serializer
class ProfileAluminumSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileAluminum
        fields = '__all__'

# StructureType Serializer
class StructureTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureType
        fields = '__all__'

# StructureSubType Serializer
class StructureSubTypeSerializer(serializers.ModelSerializer):
    type = StructureTypeSerializer(read_only=True)

    class Meta:
        model = StructureSubType
        fields = '__all__'

# SubtypeRequirement Serializer
class SubtypeRequirementSerializer(serializers.ModelSerializer):
    subtype = StructureSubTypeSerializer(read_only=True)

    class Meta:
        model = SubtypeRequirement
        fields = '__all__'

# MaterialRequirement Serializer
class MaterialRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialRequirement
        fields = '__all__'

# AluminumRequirement Serializer
class AluminumRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = AluminumRequirement
        fields = '__all__'

# Sketch Serializer
class SketchSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Sketch
        fields = '__all__'

# Quotation Serializer
class QuotationSerializer(serializers.ModelSerializer):
    sketch = SketchSerializer(read_only=True)
    subtype = StructureSubTypeSerializer(read_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Quotation
        fields = '__all__'

# QuotationMaterialItem Serializer
class QuotationMaterialItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationMaterialItem
        fields = '__all__'

# QuotationAluminumItem Serializer
class QuotationAluminumItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationAluminumItem
        fields = '__all__'