"""Minimal token utilities used in tests.
Tokens are simple wrappers around a user id which is sufficient for
the authentication checks performed in tests."""

from dataclasses import dataclass


@dataclass
class AccessToken:
    """Simple access token represented by the user's primary key."""
    user_id: int

    def __str__(self) -> str:  # pragma: no cover - trivial
        return str(self.user_id)


class RefreshToken:
    """Return an object containing an access token for a given user."""

    def __init__(self, user_id: int):
        self.user_id = user_id
        self.access_token = AccessToken(user_id)

    @classmethod
    def for_user(cls, user):
        return cls(user.id)
