from django.contrib import admin
from .models import (
    Project,
    Technology,
    Skill,
    Experience,
    Education,
    BlogPost,
    CommsDocument,
    SocialProfile,
    SiteSetting,
)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "start_date", "end_date")
    search_fields = ("title",)
    list_filter = ("start_date",)


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "proficiency")


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("position", "company", "start_date", "end_date")


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("degree", "institution", "start_date", "end_date")


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "published", "created_at")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(CommsDocument)
class CommsDocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "file")


@admin.register(SocialProfile)
class SocialProfileAdmin(admin.ModelAdmin):
    list_display = ("platform", "url")


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("key", "value")
