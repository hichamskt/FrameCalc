from rest_framework import serializers
from .models import (
    User, Company, Material, Profile, ProfileAluminum, StructureType,
    StructureSubType, SubtypeRequirement, MaterialRequirement,
    AluminumRequirement, Sketch, Quotation, QuotationMaterialItem, QuotationAluminumItem , SupplyType , Category,
)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    
    def validate_email(self, value):
        return value.lower()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'user_id': {'read_only': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        value = value.lower().strip()
        if self.instance:  # Update case
            if User.objects.filter(email=value).exclude(user_id=self.instance.user_id).exists():
                raise serializers.ValidationError("Email already exists")
        else:  # Create case
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        value = value.strip()
        if self.instance:  # Update case
            if User.objects.filter(username=value).exclude(user_id=self.instance.user_id).exists():
                raise serializers.ValidationError("Username already exists")
        else:  # Create case
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Username already exists")
        return value

    def validate(self, data):
        # Only validate passwords if they're being set/changed
        if 'password' in data:
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
        validated_data.pop('password2')
        return User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )

    def update(self, instance, validated_data):
        # Remove password2 if present
        validated_data.pop('password2', None)
        
        # Handle password update if provided
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
# supply Serializer
class SupplyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplyType
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


# Company Serializer
class CompanySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    supply_types = SupplyTypeSerializer(many=True, read_only=True)
    supply_type_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=SupplyType.objects.all(),
        write_only=True,
        required=False,
        default=[]
    )

    class Meta:
        model = Company
        fields = [
            'company_id', 
            'user', 
            'name', 
            'supply_types',  # Read-only serialized data
            'supply_type_ids',  # Write-only ID list
            'created_at'
        ]

    def create(self, validated_data):
        # Remove supply_type_ids from validated_data
        supply_type_ids = validated_data.pop('supply_type_ids', [])
        
      
        company = Company.objects.create(**validated_data)
        
       
        company.supply_types.set(supply_type_ids)
        
        return company

    def update(self, instance, validated_data):
      
        supply_type_ids = validated_data.pop('supply_type_ids', None)
        
     
        instance = super().update(instance, validated_data)
        
        
        if supply_type_ids is not None:
            instance.supply_types.set(supply_type_ids)
        
        return instance


# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name', 'description', 'parent', 'created_at']
        read_only_fields = ['category_id', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.parent:
            representation['parent'] = {
                'category_id': instance.parent.category_id,
                'name': instance.parent.name
            }
        return representation


# Material Serializer
class MaterialSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    supply_type_name = serializers.CharField(source='supply_type.name', read_only=True)
    class Meta:
        model = Material
        fields = [
            'material_id', 'company', 'name', 'category','category_name',
            'unit_type', 'unit_price', 'supply_type','supply_type_name',
            'image', 'image_url', 'created_at',
        ]
        read_only_fields = ['material_id', 'created_at', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    
    def get_supply_type_name(self, obj):
        return obj.supply_type.name if obj.supply_type else None

# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['profile_id', 'company', 'company_name', 'name', 'quality', 'created_at']
        read_only_fields = ['profile_id', 'created_at', 'company_name', 'company']

class ProfileWithCompanySerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['profile_id', 'company', 'company_name', 'name', 'quality', 'created_at']
        read_only_fields = ['profile_id', 'created_at']

# ProfileAluminum Serializer
class ProfileAluminumSerializer(serializers.ModelSerializer):
    profile_name = serializers.CharField(source='profile.name', read_only=True)
    
    class Meta:
        model = ProfileAluminum
        fields = [
            'profile_material_id', 'profile', 'profile_name',
            'name', 'unit_type', 'unit_price', 'reference',
            'length', 'created_at'
        ]
        read_only_fields = ['profile_material_id', 'created_at']


# StructureType Serializer
class StructureTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureType
        fields = ['type_id', 'name']



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