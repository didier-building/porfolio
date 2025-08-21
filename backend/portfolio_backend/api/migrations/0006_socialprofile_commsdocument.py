from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0005_profile"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Profile",
        ),
        migrations.CreateModel(
            name="SocialProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("platform", models.CharField(max_length=100)),
                ("handle", models.CharField(max_length=100)),
                ("url", models.URLField()),
            ],
            options={"ordering": ["platform"]},
        ),
        migrations.CreateModel(
            name="CommsDocument",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("doc_type", models.CharField(max_length=50)),
                ("file", models.FileField(upload_to="comms/")),
                ("published", models.BooleanField(default=False)),
            ],
            options={"ordering": ["title"]},
        ),
    ]
