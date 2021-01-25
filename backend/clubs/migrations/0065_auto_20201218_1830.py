# Generated by Django 3.1.4 on 2020-12-18 23:30

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0064_auto_20201215_1904"),
    ]

    operations = [
        migrations.AddField(
            model_name="club",
            name="ics_import_url",
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="event",
            name="ics_uuid",
            field=models.UUIDField(default=uuid.uuid4),
        ),
        migrations.AddField(
            model_name="event",
            name="is_ics_event",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="historicalclub",
            name="ics_import_url",
            field=models.URLField(blank=True, null=True),
        ),
    ]
