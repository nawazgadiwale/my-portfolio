from rest_framework import serializers

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(min_length=2, max_length=1000, trim_whitespace=True)
