from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def health(request):
    return Response({"status": "ok", "service": "portfolio-api"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/health/", health),
    path("api/v1/chat/", include("apps.chatbot.urls")),
    path("api/v1/contact/", include("apps.contact.urls")),
]
