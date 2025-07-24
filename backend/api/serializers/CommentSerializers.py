from rest_framework import serializers
from ..models import  Comment
from django.contrib.auth import get_user_model

User = get_user_model()



class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'post' , 'created_at']
