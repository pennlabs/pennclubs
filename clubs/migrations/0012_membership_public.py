# Generated by Django 2.2.4 on 2019-08-22 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0011_auto_20190822_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='public',
            field=models.BooleanField(default=True),
        ),
    ]
