# Generated by Django 2.2.6 on 2019-11-24 18:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('clubs', '0008_auto_20191111_1835'),
    ]

    operations = [
        migrations.CreateModel(
            name='NoteTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='Note', max_length=255)),
                ('content', models.TextField(blank=True)),
                ('creating_club_permission', models.IntegerField(choices=[(10, 'Creating Club Owner'), (20, 'Creating Club Officers'), (30, 'Creating Club Members')], default=30)),
                ('outside_club_permission', models.IntegerField(choices=[(0, 'None'), (10, 'Subject Club Owner'), (20, 'Subject Club Officers'), (30, 'Subject Club Members'), (100, 'Public')], default=30)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('creating_club', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='note_by_club', to='clubs.Club')),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('note_tags', models.ManyToManyField(to='clubs.NoteTag')),
                ('subject_club', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='note_of_club', to='clubs.Club')),
            ],
        ),
    ]
