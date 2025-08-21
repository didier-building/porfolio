import json, requests
from pathlib import Path

BASE = Path(__file__).resolve().parent
KB_DIR = BASE / "kb"


def _load_index():
    import faiss
    idx = faiss.read_index(str(KB_DIR / "faiss.index"))
    corpus = [json.loads(l) for l in open(KB_DIR / "corpus.jsonl", "r")]
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
    D, I = index.search(q, top_k)
    return [corpus[i] for i in I[0]]


def ollama_chat(system: str, user: str, model="llama3.1:8b", temperature=0.2) -> str:
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "options": {"temperature": temperature},
    }
    r = requests.post(url, json=payload, timeout=120)
    r.raise_for_status()
    data = r.json()
    if "message" in data:
        return data["message"]["content"]
    return ""

