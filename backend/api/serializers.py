from rest_framework import serializers
from .models import (
    User, Company, Material, Profile, ProfileAluminum, StructureType,
    StructureSubType, SubtypeRequirement, MaterialRequirement,
    AluminumRequirement, Sketch, Quotation, QuotationMaterialItem, QuotationAluminumItem
)



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'username', 'password']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


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
