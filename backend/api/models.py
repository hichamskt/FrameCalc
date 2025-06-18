from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
   
    id = None  
    user_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=('User ID')
    )
   
    email = models.EmailField(
        unique=True,
        blank=False,
        null=False,
        verbose_name=('Email address')
    )
    
   
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  
    
    class Meta:
        verbose_name = ('User')
        verbose_name_plural = ('Users')
        db_table = 'users' 
    
    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        super().save(*args, **kwargs)


class Company(models.Model):
    company_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class Material(models.Model):
    material_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, blank=True, null=True)
    unit_type = models.CharField(max_length=20)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

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
    length = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class StructureType(models.Model):
    type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

class StructureSubType(models.Model):
    subtype_id = models.AutoField(primary_key=True)
    type = models.ForeignKey(StructureType, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['type', 'name'], name='unique_subtype_name_per_type')
        ]

class SubtypeRequirement(models.Model):
    requirement_id = models.AutoField(primary_key=True)
    subtype = models.ForeignKey(StructureSubType, on_delete=models.CASCADE)
    width = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.DecimalField(max_digits=10, decimal_places=2)

class MaterialRequirement(models.Model):
    req_item_id = models.AutoField(primary_key=True)
    requirement = models.ForeignKey(SubtypeRequirement, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

class AluminumRequirement(models.Model):
    req_item_id = models.AutoField(primary_key=True)
    requirement = models.ForeignKey(SubtypeRequirement, on_delete=models.CASCADE)
    profile_material = models.ForeignKey(ProfileAluminum, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

class Sketch(models.Model):
    sketch_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shape = models.CharField(max_length=50)
    width = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class Quotation(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    quotation_id = models.AutoField(primary_key=True)
    sketch = models.ForeignKey(Sketch, on_delete=models.SET_NULL, null=True)
    subtype = models.ForeignKey(StructureSubType, on_delete=models.SET_NULL, null=True)
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

class QuotationMaterialItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

class QuotationAluminumItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE)
    profile_material = models.ForeignKey(ProfileAluminum, on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)