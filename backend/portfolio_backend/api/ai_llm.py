import os

try:
    import openai  # type: ignore
except Exception:  # pragma: no cover - openai optional
    openai = None


def chat(prompt: str) -> str | None:
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key or openai is None:
        return None
    try:
        openai.api_key = api_key
        resp = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[{'role': 'user', 'content': prompt}],
        )
        return resp['choices'][0]['message']['content'].strip()
    except Exception:
        return None
