from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from .serializers import ChatRequestSerializer
from .services.chat_service import answer_question

class ChatThrottle(AnonRateThrottle):
    rate = "200/hour" if getattr(settings, "DEBUG", False) else "20/hour"

class ChatView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ChatThrottle]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            result = answer_question(serializer.validated_data["message"])
            return Response(result, status=status.HTTP_200_OK)
        except RuntimeError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception:
            # Do not return provider credentials or internal exception details to clients.
            return Response(
                {"error": "The assistant is temporarily unavailable. Please try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
