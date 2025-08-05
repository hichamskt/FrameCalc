from rest_framework import serializers
from ..models import (
    User, Company, Material, Profile, ProfileAluminum, StructureType,
    StructureSubType
    , SupplyType , Category,AluminumRequirementItem , SubtypeRequirement
)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate ,  get_user_model



User = get_user_model()


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
    profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'username', 'password', 'password2', 
                 'profile_image', 'profile_image_url']
        extra_kwargs = {
            'password': {'write_only': True},
            'user_id': {'read_only': True},
            'email': {'required': True}
        }

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

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


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile operations (no password fields)"""
    profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'username', 'profile_image', 'profile_image_url']
        extra_kwargs = {
            'user_id': {'read_only': True},
        }

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

    def validate_email(self, value):
        value = value.lower().strip()
        if self.instance:
            if User.objects.filter(email=value).exclude(user_id=self.instance.user_id).exists():
                raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        value = value.strip()
        if self.instance:
            if User.objects.filter(username=value).exclude(user_id=self.instance.user_id).exists():
                raise serializers.ValidationError("Username already exists")
        return value


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer specifically for profile updates (lighter version)"""
    profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['profile_image', 'profile_image_url']

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change operations"""
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({
                "new_password2": "New passwords don't match"
            })
        
        try:
            validate_password(data['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': e.messages})
        
        return data

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user



# supply Serializer
class SupplyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplyType
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


# Company Serializer
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_id', 'name', 'quality', 'created_at']


class CompanyBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['company_id', 'name']

class AluminumRequirementItemSerializer(serializers.ModelSerializer):
    profile_material_name = serializers.CharField(source='profile_material.name', read_only=True)
    profile_material_reference = serializers.CharField(source='profile_material.reference', read_only=True)
    unit_price = serializers.CharField(source='profile_material.unit_price', read_only=True)
    unit_type = serializers.CharField(source='profile_material.unit_type', read_only=True)
    
    class Meta:
        model = AluminumRequirementItem
        fields = [
            'req_item_id',
            'profile_material',
            'profile_material_name',
            'profile_material_reference',
            'unit_price',
            'unit_type',
            'quantity',
            'created_at'
        ]

class SubtypeRequirementDetailSerializer(serializers.ModelSerializer):
    subtype_name = serializers.CharField(source='subtype.name', read_only=True)
    profile_name = serializers.CharField(source='profile.name', read_only=True)
    aluminum_items = AluminumRequirementItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = SubtypeRequirement
        fields = [
            'requirement_id',
            'subtype',
            'subtype_name',
            'profile',
            'profile_name',
            'width',
            'height',
            'aluminum_items',
            'created_at'
        ]
        read_only_fields = ['requirement_id', 'created_at']

class ProfileWithRequirementsSerializer(serializers.ModelSerializer):
    company = CompanyBasicSerializer(read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    requirements = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = [
            'profile_id',
            'name',
            'quality',
            'company',
            'company_name',
            'requirements',
            'created_at'
        ]
        read_only_fields = ['profile_id', 'created_at']
    
    def get_requirements(self, obj):
        """Get requirements for this profile filtered by subtype if provided"""
        subtype_id = self.context.get('subtype_id')
        if subtype_id:
            requirements = obj.subtype_requirements.filter(subtype_id=subtype_id)
        else:
            requirements = obj.subtype_requirements.all()
        
        return SubtypeRequirementDetailSerializer(requirements, many=True).data






class CompanySerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    supply_types = SupplyTypeSerializer(many=True, read_only=True)  # For reading
    supply_type_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )  # For writing
    profiles = ProfileSerializer(source='profile_set', many=True, read_only=True)
    
    class Meta:
        model = Company
        fields = [
            'company_id',
            'name',
            'user',
            'user_email',
            'supply_types',
            'supply_type_ids',  # Add this field
            'profiles',
            'created_at'
        ]
        read_only_fields = ['company_id', 'created_at']

    def update(self, instance, validated_data):
        supply_type_ids = validated_data.pop('supply_type_ids', None)
        
        # Update other fields
        instance = super().update(instance, validated_data)
        
        # Update supply_types if provided
        if supply_type_ids is not None:
            instance.supply_types.set(supply_type_ids)
        
        return instance

class CompanyDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer with profile requirements for a specific subtype
    """
    user_email = serializers.CharField(source='user.email', read_only=True)
    supply_types = SupplyTypeSerializer(many=True, read_only=True)
    profiles = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'company_id',
            'name',
            'user',
            'user_email',
            'supply_types',
            'profiles',
            'created_at'
        ]
        read_only_fields = ['company_id', 'created_at']
    
    def get_profiles(self, obj):
        """Get profiles with their requirements for the current subtype"""
        subtype_id = self.context.get('subtype_id')
        if subtype_id:
            profiles = obj.profile_set.filter(
                subtype_requirements__subtype_id=subtype_id
            ).distinct()
        else:
            profiles = obj.profile_set.all()
        
        return ProfileWithRequirementsSerializer(profiles, many=True).data

class ProfileWithRequirementsSerializer(serializers.ModelSerializer):
    requirements = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['profile_id', 'name', 'quality', 'requirements', 'created_at']
    
    def get_requirements(self, obj):
        """Get requirements for this profile"""
        from ..serializers.Subtyper_equirement_serializers import SubtypeRequirementSerializer
        requirements = obj.subtype_requirements.all()
        return SubtypeRequirementSerializer(requirements, many=True).data




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
    type_name = serializers.CharField(source='type.name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = StructureSubType
        fields = [
            'subtype_id', 
            'type', 
            'type_name',
            'name', 
            'typeimage',
            'image_url'
        ]
        read_only_fields = ['subtype_id', 'type_name', 'image_url']
    
    def get_image_url(self, obj):
        if obj.typeimage:
            return self.context['request'].build_absolute_uri(obj.typeimage.url)
        return None
'''
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
        model = AluminumRequirementItem
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

        
'''