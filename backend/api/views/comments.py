from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import Comment, Post, Notification
from ..serializers.CommentSerializers import CommentSerializer
from ..serializers.PostSerializers import PostSerializer
from ..serializers.serializers import UserSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
import logging

# Set up logging
logger = logging.getLogger(__name__)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id']).order_by('-created_at')

    def perform_create(self, serializer):
        try:
            # Save the comment
            post_id = self.kwargs['post_id']
            comment = serializer.save(user=self.request.user, post_id=post_id)
            
            # Get the post
            post = get_object_or_404(Post, id=post_id)
            
            # Check if commenting on own post
            is_own_post = (post.user == self.request.user)
            
            # Prepare comment data for WebSocket
            comment_data = {
                'id': comment.id,
                'text': comment.text,
                'user': comment.user.email,  
                'created_at': comment.created_at.isoformat(),
                'post_id': post.id
            }
            
            # Get channel layer for WebSocket updates
            channel_layer = get_channel_layer()
            
            if channel_layer:
                # Send to post room for real-time comment display
                post_group_name = f'post_{post.id}'
                
                try:
                    async_to_sync(channel_layer.group_send)(
                        post_group_name,
                        {
                            'type': 'send_post_update',
                            'data': {
                                'type': 'new_comment',
                                'comment': comment_data,
                                'message': 'New comment added'
                            }
                        }
                    )
                except Exception as e:
                    logger.error(f"Error sending post update: {str(e)}")
                
                # Send notification to post owner (if not commenting on own post)
                if not is_own_post:
                    try:
                        # Create notification in database
                        notification = Notification.objects.create(
                            sender=self.request.user,
                            recipient=post.user,
                            notification_type='comment',
                            post=post,
                            message=f"{self.request.user.username} commented on your post: '{comment.text[:50]}{'...' if len(comment.text) > 50 else ''}'"
                        )
                        
                        # Prepare notification data
                        notification_data = {
                            'id': notification.id,
                            'sender': self.request.user.username,
                            'sender_id': str(getattr(self.request.user, 'user_id', self.request.user.id)),
                            'type': 'comment',
                            'post_id': post.id,
                            'comment_id': comment.id,
                            'message': f"{self.request.user.username} commented on your post: '{comment.text[:50]}{'...' if len(comment.text) > 50 else ''}'",
                            'timestamp': notification.created_at.isoformat() if hasattr(notification, 'created_at') else comment.created_at.isoformat(),
                            'is_read': False
                        }
                        
                        # Use user_id as primary key for WebSocket group
                        user_identifier = post.user.user_id
                        
                        if user_identifier:
                            # Send WebSocket notification to post owner
                            notification_group_name = f'notifications_{user_identifier}'
                            
                            async_to_sync(channel_layer.group_send)(
                                notification_group_name,
                                {
                                    'type': 'send_notification',
                                    'notification': notification_data
                                }
                            )
                        else:
                            logger.error("User identifier is None - cannot send notification")
                            
                    except Exception as e:
                        logger.error(f"Error creating/sending notification: {str(e)}")
                        
        except Exception as e:
            logger.error(f"Critical error in perform_create: {str(e)}")
            raise

    def get_serializer_context(self):
        # Pass request context to serializer (for things like full URLs)
        return {'request': self.request}