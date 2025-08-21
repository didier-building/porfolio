"""Very small JWT authentication backend used for tests.
The "token" is simply the user's primary key encoded as a string.
This keeps the behaviour deterministic and avoids external dependencies."""

from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions


class JWTAuthentication(BaseAuthentication):
    """Authenticate requests using the simple token scheme."""

    keyword = "Bearer"

    def authenticate(self, request):
        auth = request.META.get("HTTP_AUTHORIZATION", "").split()
        if not auth or auth[0].lower() != self.keyword.lower():
            return None
        if len(auth) != 2:
            raise exceptions.AuthenticationFailed("Invalid token header")
        token = auth[1]
        User = get_user_model()
        try:
            user = User.objects.get(pk=int(token))
        except (ValueError, User.DoesNotExist):
            raise exceptions.AuthenticationFailed("Invalid token")
        return (user, None)
