from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Technology",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100, unique=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("start_date", models.DateField(blank=True, null=True)),
                ("end_date", models.DateField(blank=True, null=True)),
                ("github_url", models.URLField(blank=True, null=True)),
                ("live_url", models.URLField(blank=True, null=True)),
                ("image", models.ImageField(blank=True, null=True, upload_to="projects/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-start_date", "title"]},
        ),
        migrations.CreateModel(
            name="Skill",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("proficiency", models.IntegerField(default=0)),
            ],
            options={"ordering": ["-proficiency", "name"]},
        ),
        migrations.CreateModel(
            name="Experience",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("company", models.CharField(max_length=200)),
                ("position", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("start_date", models.DateField()),
                ("end_date", models.DateField(blank=True, null=True)),
            ],
            options={"ordering": ["-start_date"]},
        ),
        migrations.CreateModel(
            name="Education",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("institution", models.CharField(max_length=200)),
                ("degree", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("start_date", models.DateField()),
                ("end_date", models.DateField(blank=True, null=True)),
            ],
            options={"ordering": ["-start_date"], "verbose_name_plural": "Education"},
        ),
        migrations.CreateModel(
            name="BlogPost",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(unique=True)),
                ("content", models.TextField()),
                ("summary", models.TextField(blank=True)),
                ("image", models.ImageField(blank=True, null=True, upload_to="blog/")),
                ("kind", models.CharField(choices=[("blog", "Blog"), ("journal", "Journal")], default="blog", max_length=20)),
                ("published", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="CommsDocument",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("file", models.FileField(upload_to="comms/")),
            ],
        ),
        migrations.CreateModel(
            name="SocialProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("platform", models.CharField(max_length=100)),
                ("url", models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name="SiteSetting",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(max_length=100, unique=True)),
                ("value", models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name="project",
            name="technologies",
            field=models.ManyToManyField(blank=True, related_name="projects", to="portfolio.technology"),
        ),
    ]
