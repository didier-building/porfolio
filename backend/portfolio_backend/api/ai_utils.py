import re
from collections import Counter
from typing import List, Tuple
from portfolio.models import Project, Skill, SocialProfile


def tokenize(text: str) -> List[str]:
    return re.findall(r"\w+", text.lower())


def extract_keywords(text: str, top_n: int = 10) -> List[str]:
    tokens = tokenize(text)
    return [w for w, _ in Counter(tokens).most_common(top_n)]


def rank_projects_against_text(text: str, top_n: int = 3) -> List[Tuple[Project, int]]:
    tokens = set(tokenize(text))
    results: List[Tuple[Project, int]] = []
    for project in Project.objects.prefetch_related('technologies').all():
        body = f"{project.title} {project.description} " + " ".join(t.name for t in project.technologies.all())
        score = sum(1 for token in tokens if token in body.lower())
        results.append((project, score))
    results.sort(key=lambda x: x[1], reverse=True)
    return results[:top_n]


def get_profile() -> dict:
    return {
        'skills': list(Skill.objects.values_list('name', flat=True)),
        'profiles': {p.platform: p.url for p in SocialProfile.objects.all()},
    }
