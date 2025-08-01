# Generated by Django 5.2.3 on 2025-07-16 01:40

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_quotation_status_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(blank=True, help_text='Upload a profile image (recommended size: 300x300px)', null=True, upload_to=api.models.user_profile_image_path, verbose_name='Profile Image'),
        ),
    ]
