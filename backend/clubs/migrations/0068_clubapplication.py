# Generated by Django 3.1.2 on 2021-01-02 22:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0067_profile_show_profile"),
    ]

    operations = [
        migrations.CreateModel(
            name="ClubApplication",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("application_start_time", models.DateTimeField()),
                ("application_end_time", models.DateTimeField()),
                ("result_release_time", models.DateTimeField()),
                ("application_url", models.URLField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "club",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="clubs.club"),
                ),
            ],
        ),
    ]
