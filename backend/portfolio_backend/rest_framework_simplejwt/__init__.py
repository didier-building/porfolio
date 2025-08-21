"""Minimal stub implementation of djangorestframework-simplejwt for tests.
This module provides just enough functionality for generating and
authenticating tokens in the test environment without pulling in the
external dependency."""

from .tokens import RefreshToken
from .authentication import JWTAuthentication

__all__ = ["RefreshToken", "JWTAuthentication"]
