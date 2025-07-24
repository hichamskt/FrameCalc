from rest_framework import serializers
from ..models import Post
from django.contrib.auth import get_user_model
from .CommentSerializers import CommentSerializer

User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    image_url = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    is_liked = serializers.SerializerMethodField()
    liked_users = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'text',
            'image',
            'image_url',
            'created_at',
            'likes_count',
            'comments_count',
            'is_liked',
            'liked_users',
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

    def get_is_liked(self, obj):
       request = self.context.get('request')
       user = request.user if request else None
       if user and user.is_authenticated:
            return obj.likes.filter(pk=user.pk).exists()
       return False
    def get_liked_users(self, obj):
        return [user.username for user in obj.likes.all()]