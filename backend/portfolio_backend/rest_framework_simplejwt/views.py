"""Simple JWT views used for tests.
They implement minimal behaviour of `TokenObtainPairView` and `TokenRefreshView`
returning user ids as tokens."""

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class TokenObtainPairView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"detail": "No active account found"}, status=status.HTTP_401_UNAUTHORIZED)
        token = str(user.id)
        return Response({"access": token, "refresh": token})


class TokenRefreshView(APIView):
    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response({"detail": "Refresh token required"}, status=status.HTTP_401_UNAUTHORIZED)
        # In this simple implementation the refresh token is the user id
        return Response({"access": refresh})
