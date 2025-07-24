from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from ..models import Comment, Post, Notification
from ..serializers.CommentSerializers import CommentSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id']).order_by('-created_at')

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user, post_id=self.kwargs['post_id'])

        post = comment.post
        user = self.request.user

        # Avoid notifying self
        if post.user != user:
            notification = Notification.objects.create(
                sender=user,
                recipient=post.user,
                notification_type='comment',
                post=post,
                comment=comment,
            )
            send_notification_to_user(notification)

# This should be defined outside the class
def send_notification_to_user(notification):
    group_name = f'notifications_{notification.recipient.id}'
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_notification',
            'notification': {
                'id': notification.id,
                'message': 'You have a new comment on your post.',
                'notification_type': notification.notification_type,
                'post_id': notification.post.id,
                'sender_username': notification.sender.username,
                'timestamp': str(notification.timestamp),
            }
        }
    )
