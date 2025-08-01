# Generated by Django 5.2.3 on 2025-06-24 16:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_sketch_options_sketch_image_alter_sketch_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quotation',
            name='status',
        ),
        migrations.AddField(
            model_name='quotation',
            name='accessoriesrequirement',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.subtypeaccessoriesrequirement'),
        ),
        migrations.AddField(
            model_name='quotation',
            name='glassrequirement',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.subtypeglasserequirement'),
        ),
        migrations.AddField(
            model_name='quotation',
            name='requirement_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.subtyperequirement'),
        ),
        migrations.AlterField(
            model_name='quotation',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddConstraint(
            model_name='quotationaluminumitem',
            constraint=models.UniqueConstraint(fields=('quotation', 'profile_material'), name='unique_aluminum_per_quotation'),
        ),
        migrations.AddConstraint(
            model_name='quotationmaterialitem',
            constraint=models.UniqueConstraint(fields=('quotation', 'material'), name='unique_material_per_quotation'),
        ),
    ]
