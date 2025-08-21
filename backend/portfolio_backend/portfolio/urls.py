from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'skills', views.SkillViewSet)
router.register(r'experiences', views.ExperienceViewSet)
router.register(r'education', views.EducationViewSet)
router.register(r'technologies', views.TechnologyViewSet)
router.register(r'blog', views.BlogPostViewSet)
router.register(r'comms', views.CommsDocumentViewSet)
router.register(r'profiles', views.SocialProfileViewSet)
router.register(r'settings', views.SiteSettingViewSet)

urlpatterns = router.urls
