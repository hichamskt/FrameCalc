from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.core.validators import FileExtensionValidator
from django.core.validators import MinValueValidator

from decimal import Decimal
import math
import os
from django.utils.translation import gettext_lazy as _
from PIL import Image
from django.contrib.auth import get_user_model



def user_profile_image_path(instance, filename):
    """Generate file path for user profile images"""
    # Get file extension
    ext = filename.split('.')[-1]
    # Create new filename with user_id
    filename = f'{instance.user_id}.{ext}'
    # Return the full path
    return os.path.join('profile_images', filename)


class User(AbstractUser):
   
    id = None  
    user_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_('User ID')
    )
   
    email = models.EmailField(
        unique=True,
        blank=False,
        null=False,
        verbose_name=_('Email address')
    )
    
    profile_image = models.ImageField(
        upload_to=user_profile_image_path,
        blank=True,
        null=True,
        verbose_name=_('Profile Image'),
        help_text=_('Upload a profile image (recommended size: 300x300px)')
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  
    
    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        db_table = 'users' 
    
    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        super().save(*args, **kwargs)
        
        # Resize image after saving
        if self.profile_image:
            self.resize_profile_image()
    
    def resize_profile_image(self):
        """Resize profile image to optimize storage"""
        if self.profile_image:
            img = Image.open(self.profile_image.path)
            
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize image
            max_size = (300, 300)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save the resized image
            img.save(self.profile_image.path, optimize=True, quality=85)
    
    def get_profile_image_url(self):
        """Get profile image URL or return default"""
        if self.profile_image:
            return self.profile_image.url
        return None
    
    def delete_profile_image(self):
        """Delete profile image file"""
        if self.profile_image:
            # Delete the file from storage
            if os.path.isfile(self.profile_image.path):
                os.remove(self.profile_image.path)
            # Clear the field
            self.profile_image = None
            self.save()
    

class SupplyType(models.Model):
    """
    Categories of supplies (e.g., glass , alum , accesories)
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']



class Company(models.Model):
    company_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    supply_types = models.ManyToManyField(
        SupplyType, 
        related_name='companies',
        help_text="Types of supplies this company provides"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user'], name='unique_user_company')
        ]
        verbose_name_plural = "Companies"
    

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True,
        related_name='children'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name



class Material(models.Model):
    material_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='materials'
    )
    unit_type = models.CharField(max_length=20)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    supply_type = models.ForeignKey(SupplyType, on_delete=models.CASCADE, related_name='supplies')
    image = models.ImageField(
        upload_to='materials/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.company.name})"
    
    def delete(self, *args, **kwargs):
        if self.image:
            self.image.delete()
        super().delete(*args, **kwargs)



class Profile(models.Model):
    profile_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    quality = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ProfileAluminum(models.Model):
    profile_material_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    unit_type = models.CharField(max_length=20)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=20)
    length = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class StructureType(models.Model):
    type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

class StructureSubType(models.Model):
    subtype_id = models.AutoField(primary_key=True)
    type = models.ForeignKey('StructureType', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    typeimage = models.ImageField(
        upload_to='structuresubType/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['type', 'name'], 
                name='unique_subtype_name_per_type'
            )
        ]
        ordering = ['type', 'name']
    
    def __str__(self):
        return f"{self.type.name} - {self.name}"


class SubtypeRequirement(models.Model):
    requirement_id = models.AutoField(primary_key=True)
    subtype = models.ForeignKey(StructureSubType, on_delete=models.CASCADE, related_name='requirements')
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='subtype_requirements')
    width = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['subtype', 'profile'], 
                name='unique_requirement_per_subtype_profile'
            )
        ]
        ordering = ['subtype', 'profile']
    
    def __str__(self):
        return f"{self.subtype.name} - {self.profile.name} (W:{self.width}, H:{self.height})"


class SubtypeGlasseRequirement(models.Model):
    glassrequirement_id = models.AutoField(primary_key=True)
    subtype = models.ForeignKey(StructureSubType, on_delete=models.CASCADE, related_name='glassrequirements')
    width = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    companysupplier = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='glassesupplier')
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['subtype', 'companysupplier'], 
                name='unique_glass_requirement_per_subtype_supplier'
            )
        ]
        ordering = ['subtype', 'companysupplier']
    
    def __str__(self):
        return f"{self.subtype.name} - {self.companysupplier.name} (W:{self.width}, H:{self.height})"
    

class SubtypeAccessoriesRequirement(models.Model):
    accessoriesrequirement_id = models.AutoField(primary_key=True)
    subtype = models.ForeignKey(
        StructureSubType, 
        on_delete=models.CASCADE, 
        related_name='accessoriesrequirements'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    companysupplier = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='accessoriessupplier'
    )
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['subtype', 'companysupplier'], 
                name='unique_accessories_requirement'
            )
        ]
        ordering = ['subtype', 'companysupplier']
        verbose_name = "Subtype Accessories Requirement"
        verbose_name_plural = "Subtype Accessories Requirements"
    
    def __str__(self):
        return f"{self.subtype.name} - {self.companysupplier.name}"


   


class AluminumRequirementItem(models.Model):
    req_item_id = models.AutoField(primary_key=True)
    requirement = models.ForeignKey(
        SubtypeRequirement, 
        on_delete=models.CASCADE,
        related_name='aluminum_items'
    )
    profile_material = models.ForeignKey(
        ProfileAluminum,
        on_delete=models.CASCADE,
        related_name='requirement_items'
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['requirement', 'profile_material'],
                name='unique_material_per_requirement',
                violation_error_message="Each requirement can only have one of each profile material"
            )
        ]
        ordering = ['requirement', '-created_at']



class GlasseRequirementItem(models.Model):
    glasse_item_id = models.AutoField(primary_key=True)
    requirement = models.ForeignKey(
        SubtypeGlasseRequirement, 
        on_delete=models.CASCADE,
        related_name='glass_items'
    )
    material = models.ForeignKey(
        Material, 
        on_delete=models.CASCADE,
        related_name='glass_requirements'
    )
    width = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # REMOVED the unique constraint
        ordering = ['-created_at']
        verbose_name = "Glass Requirement Item"
        verbose_name_plural = "Glass Requirement Items"

    def __str__(self):
        return f"{self.material.name} ({self.width}x{self.height}mm)"



class AccessoriesRequirementItem(models.Model):
    req_item_id = models.AutoField(primary_key=True)
    requirement = models.ForeignKey(
        'SubtypeAccessoriesRequirement',
        on_delete=models.CASCADE,
        related_name='accessories_items'
    )
    material = models.ForeignKey(
        'Material',
        on_delete=models.CASCADE,
        related_name='accessories_requirements'
    )
    quantity = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=1.0,
        validators=[MinValueValidator(0.01)]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Accessories Requirement Item"
        verbose_name_plural = "Accessories Requirement Items"
        constraints = [
            models.UniqueConstraint(
                fields=['requirement', 'material'],
                name='unique_accessories_per_requirement'
            )
        ]

    def __str__(self):
        return f"{self.material.name} ({self.quantity})"



class Sketch(models.Model):
    sketch_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='sketches'
    )
    shape = models.CharField(max_length=50)
    width = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(
        upload_to='sketches/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Sketches"

    def __str__(self):
        return f"{self.shape} sketch ({self.width}x{self.height}) by {self.user.email}"

    def delete(self, *args, **kwargs):
        if self.image:
            self.image.delete()
        super().delete(*args, **kwargs)
    




class Quotation(models.Model):
    quotation_id = models.AutoField(primary_key=True)
    sketch = models.ForeignKey('Sketch', on_delete=models.SET_NULL, null=True)
    subtype = models.ForeignKey('StructureSubType', on_delete=models.SET_NULL, null=True)
    profile = models.ForeignKey('Profile', on_delete=models.SET_NULL, null=True)
    accessoriesrequirement = models.ForeignKey('SubtypeAccessoriesRequirement', on_delete=models.SET_NULL, null=True)
    glassrequirement = models.ForeignKey('SubtypeGlasseRequirement', on_delete=models.SET_NULL, null=True)
    requirement_id = models.ForeignKey('SubtypeRequirement', on_delete=models.SET_NULL, null=True)
    
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total(self):
        """Calculate total price from all items"""
        total = Decimal('0')
        
        # Sum material items
        for item in self.quotationmaterialitem_set.all():
            total += item.unit_price * item.quantity
            
        # Sum aluminum items (rounded to nearest 0.5)
        for item in self.quotationaluminumitem_set.all():
            total += item.unit_price * item.quantity
            
        self.total_price = total
        self.save()
        return total

class QuotationMaterialItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE)
    material = models.ForeignKey('Material', on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['quotation', 'material'],
                name='unique_material_per_quotation'
            )
        ]

class QuotationAluminumItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE)
    profile_material = models.ForeignKey('ProfileAluminum', on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Round quantity to nearest 0.5 (1, 1.5, 2, etc.)
        self.quantity = Decimal(math.floor(self.quantity * 2) / 2)
        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['quotation', 'profile_material'],
                name='unique_aluminum_per_quotation'
            )
        ]


        # communty

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")

    text = models.TextField(blank=True)
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)





User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('reply', 'Reply'),
    )

    recipient = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_notifications', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='notifications', on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    comment = models.ForeignKey(Comment, null=True, blank=True, on_delete=models.CASCADE)  # Add this

    def __str__(self):
        return f"{self.sender} {self.notification_type} {self.recipient}"

