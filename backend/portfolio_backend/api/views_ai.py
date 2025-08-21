from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# --- ratelimit import shim ---
try:
    from ratelimit.decorators import ratelimit as _ratelimit
except Exception:
    try:
        from django_ratelimit.decorators import ratelimit as _ratelimit
    except Exception:
        def _ratelimit(*args, **kwargs):
            def _decorator(fn):
                return fn
            return _decorator
# ----------------------------

from .ai_utils import get_profile, rank_projects_against_text, extract_keywords
from .local_llm import ollama_chat, retrieve

JOB_SYSTEM_PROMPT = "You evaluate a candidate vs a job using ONLY provided context. Return short, clear JSON where requested."
EXPLAINER_SYSTEM_PROMPT = "You explain projects using ONLY provided context. If info is missing, say so briefly."
CANDIDATE_SUMMARY = (
    "Candidate: Didier Imanirahami — Python/Django backend developer with blockchain fundamentals "
    "and web automation experience. Projects include an agricultural supply chain tracker (Django REST + Vyper/Boa), "
    "NLPAY Academy, and E-commerce APIs. Comfortable with Docker/Podman and Kubernetes labs (LFS250)."
)


@method_decorator(csrf_exempt, name='dispatch')
class JobMatchAnalyzeView(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(_ratelimit(key='ip', rate='10/m', block=True))
    def post(self, request):
        jd = request.data.get("job_description", "")
        if not jd:
            return Response({"detail": "Provide job_description"}, status=status.HTTP_400_BAD_REQUEST)

        ctx_docs = retrieve(jd, top_k=8)
        ctx = "\n\n".join(f"[{d['source']}] {d['text']}" for d in ctx_docs)

        profile = get_profile()
        ranked = rank_projects_against_text(jd, profile)[:5]
        top_projects = [p for p, _ in ranked]
        proj_str = "\n".join([f"- {p['title']} | Tech: {', '.join(p['technologies'])}\nDesc: {p['description'][:400]}" for p in top_projects])
        kw = extract_keywords(jd)

        user_prompt = f"""CANDIDATE SUMMARY:
{CANDIDATE_SUMMARY}

JOB DESCRIPTION (truncated):
{jd[:1500]}

TOP MATCHED PROJECTS:
{proj_str}

RETRIEVED CONTEXT:
{ctx}

TASKS:
1) Match score (0-100) + 1-2 sentence rationale.
2) 3-6 strengths mapped to the JD with evidence.
3) 3-6 gaps/risks with actionable mitigation.
4) A short tailored pitch (4-6 sentences).
5) 8-15 comma-separated keywords.

Return strict JSON with keys: match_score, rationale, strengths, gaps, pitch, keywords.
"""
        text = ollama_chat(JOB_SYSTEM_PROMPT, user_prompt) or ""
        import json as _json
        try:
            data = _json.loads(text)
        except Exception:
            data = {
                "match_score": None, "rationale": "LLM non-JSON; see pitch.",
                "strengths": [], "gaps": [], "pitch": text, "keywords": kw[:12]
            }
        data["top_projects"] = top_projects
        data["engine"] = "ollama"
        return Response(data)


@method_decorator(csrf_exempt, name='dispatch')
class ProjectExplainerChatView(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(_ratelimit(key='ip', rate='20/m', block=True))
    def post(self, request):
        q = request.data.get("question", "")
        ids = request.data.get("project_ids", [])
        profile = get_profile()
        selected = [p for p in profile["projects"] if not ids or p["id"] in ids]
        if not selected:
            selected = [p for p, _ in rank_projects_against_text(q, profile)[:5]]
        proj_ctx = "\n".join([f"- {p['title']} | Tech: {', '.join(p['technologies'])}\nDesc: {p['description'][:500]}" for p in selected])

        ctx_docs = retrieve(q, top_k=6)
        ctx = "\n\n".join(f"[{d['source']}] {d['text']}" for d in ctx_docs)

        user_prompt = f"""Answer ONLY using the provided projects/context. If unknown, say so plainly.

PROJECT CONTEXT:
{proj_ctx}

RETRIEVED CONTEXT:
{ctx}

QUESTION:
{q}
"""
        answer = ollama_chat(EXPLAINER_SYSTEM_PROMPT, user_prompt, temperature=0.3) or \
                 "I don't have enough info based on the current context."
        return Response({"answer": answer, "used_projects": selected, "engine": "ollama"})

