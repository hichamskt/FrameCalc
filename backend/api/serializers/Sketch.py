# serializers.py
from rest_framework import serializers
from ..models import Sketch

class SketchSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Sketch
        fields = [
            'sketch_id',
            'user',
            'user_email',
            'shape',
            'width',
            'height',
            'image',
            'image_url',
            'created_at'
        ]
        extra_kwargs = {
            'user': {'write_only': True},
            'image': {'write_only': True}
        }

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

    def validate_width(self, value):
        if value <= 0:
            raise serializers.ValidationError("Width must be greater than zero")
        return value

    def validate_height(self, value):
        if value <= 0:
            raise serializers.ValidationError("Height must be greater than zero")
        return value