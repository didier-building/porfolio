import re
from .models import Project, Skill


def get_profile():
    projects = []
    for p in Project.objects.prefetch_related('technologies').all():
        projects.append({
            'id': p.id,
            'title': p.title,
            'description': p.description or '',
            'technologies': [t.name for t in p.technologies.all()],
        })
    skills = list(Skill.objects.values_list('name', flat=True))
    return {'projects': projects, 'skills': skills}


def extract_keywords(text: str):
    return list({w.lower() for w in re.findall(r'[A-Za-z0-9]+', text or '')})


def rank_projects_against_text(text: str, profile):
    kw = set(extract_keywords(text))
    scores = []
    for p in profile.get('projects', []):
        tokens = set(extract_keywords(p['title'] + ' ' + p['description'] + ' ' + ' '.join(p['technologies'])))
        scores.append((p, len(tokens & kw)))
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores

