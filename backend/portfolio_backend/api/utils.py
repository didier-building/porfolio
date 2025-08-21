import os
import requests


def verify_captcha(token: str, ip: str | None = None) -> bool:
    secret = os.getenv('TURNSTILE_SECRET')
    if not secret:
        return True  # allow in development
    if not token:
        return False
    try:
        response = requests.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            data={'secret': secret, 'response': token, 'remoteip': ip or ''},
            timeout=5,
        )
        data = response.json()
        return data.get('success', False)
    except Exception:
        return False
