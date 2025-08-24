import json
from pathlib import Path
import os

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - optional dependency
    genai = None

BASE = Path(__file__).resolve().parent
KB_DIR = BASE / "kb"


def _load_index():
    import faiss

    idx = faiss.read_index(str(KB_DIR / "faiss.index"))
    with open(KB_DIR / "corpus.jsonl", "r") as corpus_file:
        corpus = [json.loads(line) for line in corpus_file]
    return idx, corpus


_INDEX = None


def retrieve(query: str, top_k=6):
    global _INDEX
    if _INDEX is None:
        _INDEX = _load_index()
    index, corpus = _INDEX

    from sentence_transformers import SentenceTransformer
    enc = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    q = enc.encode([query], normalize_embeddings=True, convert_to_numpy=True)
    distances, indices = index.search(q, top_k)
    return [corpus[i] for i in indices[0]]


def ollama_chat(system: str, user: str, model: str = "gemini-pro", temperature: float = 0.2) -> str:
    if genai is None:
        return ""  # library not installed
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return ""  # API key required
    genai.configure(api_key=api_key)
    prompt = f"{system}\n\n{user}"
    response = genai.GenerativeModel(model).generate_content(
        prompt,
        generation_config=genai.GenerationConfig(temperature=temperature),
    )
    return getattr(response, "text", "")
