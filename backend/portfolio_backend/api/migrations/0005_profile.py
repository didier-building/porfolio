from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_project_created_at_project_updated_at_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Profile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("title", models.CharField(max_length=200, blank=True)),
                ("bio", models.TextField(blank=True)),
            ],
        ),
    ]
