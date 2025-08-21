import os, sys, json, re, pdfplumber
from pathlib import Path
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from unidecode import unidecode

BASE = Path(__file__).resolve().parent
MEDIA = BASE.parent / "media"

DOCS = [
    MEDIA / "comms" / "master-cv.pdf",
]


def clean(t: str) -> str:
    t = unidecode(t or "")
    t = re.sub(r"\s+", " ", t).strip()
    return t


def load_pdf(path: Path):
    out = []
    if not path.exists():
        return out
    with pdfplumber.open(str(path)) as pdf:
        for page in pdf.pages:
            out.append(clean(page.extract_text() or ""))
    return [t for t in out if t]


def chunk(text: str, size=700, overlap=100):
    words = text.split()
    res, i = [], 0
    while i < len(words):
        res.append(" ".join(words[i:i + size]))
        i += size - overlap
    return res


def main():
    corpus = []

    # 1) CV
    for p in DOCS:
        for page in load_pdf(p):
            for c in chunk(page, 250, 40):
                corpus.append({"text": c, "source": str(p)})

    # 2) DB (Projects, Skills, Blog)
    try:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "portfolio_backend.settings")
        sys.path.append(str(BASE.parent))
        import django
        django.setup()
        from portfolio.models import Project, Skill, BlogPost
        for pr in Project.objects.all():
            techs = ", ".join(t.name for t in pr.technologies.all())
            block = f"PROJECT: {pr.title}\nTech: {techs}\nDesc: {pr.description or ''}"
            for c in chunk(block, 250, 40):
                corpus.append({"text": c, "source": f"Project:{pr.id}"})
        for sk in Skill.objects.all():
            corpus.append({"text": f"SKILL: {sk.name} ({getattr(sk,'category','')})", "source": "Skill"})
        for bp in BlogPost.objects.all():
            block = f"{bp.kind.upper()} POST: {bp.title}\n{bp.summary}\n{(bp.body or '')[:1200]}"
            for c in chunk(block, 250, 40):
                corpus.append({"text": c, "source": f"Blog:{bp.slug}"})
    except Exception as e:
        print("DB not loaded; continuing with docs only:", e)

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    X = model.encode([c["text"] for c in corpus], normalize_embeddings=True, convert_to_numpy=True)
    dim = X.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(X)

    (BASE / "kb").mkdir(exist_ok=True)
    faiss.write_index(index, str(BASE / "kb" / "faiss.index"))
    with open(BASE / "kb" / "corpus.jsonl", "w") as f:
        for c in corpus:
            f.write(json.dumps(c) + "\n")
    print(f"Saved {len(corpus)} chunks to {BASE/'kb'}.")


if __name__ == "__main__":
    main()

