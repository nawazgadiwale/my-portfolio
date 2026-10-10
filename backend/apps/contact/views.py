import logging

from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import ContactMessage
from .serializers import ContactMessageSerializer
from .services import notify_telegram_contact

logger = logging.getLogger(__name__)


class ContactThrottle(AnonRateThrottle):
    rate = "100/hour" if settings.DEBUG else "5/hour"


class ContactCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ContactThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()

        try:
            notify_telegram_contact(instance)
        except Exception:
            logger.exception("Telegram contact notification failed")

        return Response(
            {"message": "Your message was submitted successfully."},
            status=status.HTTP_201_CREATED,
        )