from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from ..models import Comment, Post, Notification
from ..serializers.CommentSerializers import CommentSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()

from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from ..serializers.PostSerializers import PostSerializer
from ..serializers.CommentSerializers import CommentSerializer
from ..serializers.serializers import UserSerializer
from django.shortcuts import get_object_or_404

# 3. Get Comments of a Post, Create Comment
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id']).order_by('-created_at')

    def perform_create(self, serializer):
        # Save the comment
        comment = serializer.save(user=self.request.user, post_id=self.kwargs['post_id'])
        
        # Get the post
        post = get_object_or_404(Post, id=self.kwargs['post_id'])
        
        # Prepare comment data for WebSocket
        comment_data = {
            'id': comment.id,
            'text': comment.text,
            'user': comment.user.email,  
            'created_at': comment.created_at.isoformat(),
            'post_id': post.id
        }
        
        # Send WebSocket notification for real-time comment updates
        channel_layer = get_channel_layer()
        
        if channel_layer:
            # Send to post room for real-time comment display
            async_to_sync(channel_layer.group_send)(
                f'post_{post.id}',
                {
                    'type': 'send_post_update',
                    'data': {
                        'type': 'new_comment',
                        'comment': comment_data,
                        'message': 'New comment added'
                    }
                }
            )
            
            # Send notification to post owner (if not commenting on own post)
            if post.user != self.request.user:
                try:
                    # Create notification in database
                    notification = Notification.objects.create(
                        sender=self.request.user,
                        recipient=post.user,
                        notification_type='comment',
                        post=post,
                        # comment=comment  # Add this if your Notification model has a comment field
                    )
                    
                    # Send WebSocket notification to post owner
                    async_to_sync(channel_layer.group_send)(
                        f'notifications_{post.user.id}',
                        {
                            'type': 'send_notification',
                            'notification': {
                                'id': notification.id,
                                'sender': self.request.user.username,
                                'sender_id': str(self.request.user.user_id),
                                'type': 'comment',
                                'post_id': post.id,
                                'comment_id': comment.id,
                                'message': f"{self.request.user.username} commented on your post: '{comment.content[:50]}{'...' if len(comment.content) > 50 else ''}'",
                                'timestamp': notification.created_at.isoformat() if hasattr(notification, 'created_at') else comment.created_at.isoformat(),
                                'is_read': False
                            }
                        }
                    )
                except Exception as e:
                    # Log the error but don't fail the comment creation
                    print(f"Error creating notification: {str(e)}")
        else:
            print("Warning: No channel layer configured - WebSocket updates won't work")

    def get_serializer_context(self):
        # Pass request context to serializer (for things like full URLs)
        return {'request': self.request}

# Outside the view class:

