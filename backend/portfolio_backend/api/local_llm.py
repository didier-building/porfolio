import json
import logging
from pathlib import Path
import requests
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

BASE = Path(__file__).resolve().parent
KB_DIR = BASE / "kb"

# Global index cache
_INDEX = None


def _load_index():
    """Load FAISS index and corpus data"""
    try:
        import faiss

        index_path = KB_DIR / "faiss.index"
        corpus_path = KB_DIR / "corpus.jsonl"

        if not index_path.exists() or not corpus_path.exists():
            logger.warning("Knowledge base files not found. Run build_kb.py first.")
            return None, []

        idx = faiss.read_index(str(index_path))
        with open(corpus_path, "r", encoding="utf-8") as corpus_file:
            corpus = [json.loads(line) for line in corpus_file]
        return idx, corpus
    except Exception as e:
        logger.error(f"Failed to load knowledge base: {e}")
        return None, []


def retrieve(query: str, top_k: int = 6) -> List[Dict[str, Any]]:
    """Retrieve relevant documents from knowledge base"""
    global _INDEX

    if _INDEX is None:
        _INDEX = _load_index()

    index, corpus = _INDEX
    if index is None or not corpus:
        return []

    try:
        from sentence_transformers import SentenceTransformer
        enc = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        q = enc.encode([query], normalize_embeddings=True, convert_to_numpy=True)
        distances, indices = index.search(q, top_k)
        return [corpus[i] for i in indices[0] if i < len(corpus)]
    except Exception as e:
        logger.error(f"Failed to retrieve documents: {e}")
        return []


def ollama_chat(system: str, user: str, model: str = "llama3.1:8b", temperature: float = 0.2) -> Optional[str]:
    """Chat with Ollama local LLM"""
    try:
        ollama_url = "http://localhost:11434/api/generate"
        prompt = f"{system}\n\n{user}"

        response = requests.post(
            ollama_url,
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature
                }
            },
            timeout=60
        )

        if response.status_code == 200:
            result = response.json()
            return result.get('response', '')
        else:
            logger.error(f"Ollama API error: {response.status_code}")
            return None

    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to connect to Ollama: {e}")
        return None
    except Exception as e:
        logger.error(f"Ollama chat error: {e}")
        return None
