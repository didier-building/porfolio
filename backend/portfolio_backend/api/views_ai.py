from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .ai_utils import extract_keywords, rank_projects_against_text, get_profile
from .ai_llm import chat

try:
    from django_ratelimit.decorators import ratelimit
except Exception:
    def ratelimit(*args, **kwargs):
        def decorator(view_func):
            return view_func
        return decorator

CANDIDATE_SUMMARY = (
    "Candidate: Didier Imanirahami — Python/Django backend developer with blockchain "
    "fundamentals and web automation experience. Projects include an agricultural "
    "supply chain tracker (Django REST + Vyper/Boa), NLPAY Academy, and E-commerce APIs. "
    "Comfortable with Docker/Podman and Kubernetes labs (LFS250)."
)


@method_decorator(csrf_exempt, name='dispatch')
class JobMatchAnalyzeView(APIView):
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request):
        text = request.data.get('text', '')
        keywords = extract_keywords(text)
        ranked = rank_projects_against_text(text)
        top_projects = [p.title for p, _ in ranked]
        prompt = (
            f"{CANDIDATE_SUMMARY}\nJob description: {text}\n"
            "Provide match score, rationale, strengths, gaps, pitch, and keywords."
        )
        ai_text = chat(prompt)
        result = {
            'match_score': 0.0,
            'rationale': ai_text or 'Heuristic result',
            'strengths': keywords[:3],
            'gaps': keywords[3:5],
            'pitch': 'Leverage strong Django background.' if not ai_text else '',
            'keywords': keywords,
            'top_projects': top_projects,
        }
        if ai_text:
            result['pitch'] = ai_text
        else:
            result['match_score'] = min(len(keywords) / 10.0, 1.0)
        return Response(result)


@method_decorator(csrf_exempt, name='dispatch')
class ProjectExplainerChatView(APIView):
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request):
        text = request.data.get('text', '')
        ranked = rank_projects_against_text(text)
        used_projects = [p.title for p, _ in ranked]
        prompt = (
            f"{CANDIDATE_SUMMARY}\nQuestion: {text}\n"
            f"Discuss these projects if relevant: {', '.join(used_projects)}."
        )
        answer = chat(prompt)
        if not answer:
            answer = 'No AI available.'
        return Response({'answer': answer, 'used_projects': used_projects})
