# Generated by Django 3.0.3 on 2020-03-01 16:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("clubs", "0019_merge_20200228_1615"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="club",
            options={
                "ordering": ["name"],
                "permissions": [
                    ("approve_club", "Can approve pending clubs"),
                    ("see_pending_clubs", "View pending clubs that are not one's own"),
                ],
            },
        ),
        migrations.AddField(
            model_name="club",
            name="approved_by",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="approved_clubs",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="club", name="approved_on", field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name="membershiprequest",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name="club", name="approved", field=models.BooleanField(default=None, null=True),
        ),
    ]
