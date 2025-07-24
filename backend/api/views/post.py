from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import Post, Comment, Notification
from ..serializers.PostSerializers import PostSerializer
from ..serializers.CommentSerializers import  CommentSerializer
from ..serializers.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



# 1. Create Post + List Posts
class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# 2. Get Single Post with Comments (optional)
class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]


# 3. Get Comments of a Post, Create Comment
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id']).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, post_id=self.kwargs['post_id'])


# 4. Delete Comment (only author or admin)
class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        comment = super().get_object()
        user = self.request.user
        if comment.user != user and not user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have permission to delete this comment")
        return comment





# 6. Get Likes Count for Post
class PostLikesCountView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        count = post.likes.count()
        return Response({'post_id': post_id, 'likes_count': count})



class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]  # or IsAuthenticated if needed

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user=user_id).order_by('-created_at')
  


    def get_serializer_context(self):
        # So image_url uses full path
        return {'request': self.request}
    

class PostLikesView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(pk=post_id)
        return post.likes.all()
    



class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=404)

        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'liked': False, 'message': 'Unliked'})
        else:
            post.likes.add(user)

            #
        
            if post.user != user:  
                notification = Notification.objects.create(
                sender=user,
                recipient=post.user,
                notification_type='like',
                post=post,
              )

             # ✅ Send WebSocket notification
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
            f'notifications_{post.user.id}',
              {
            'type': 'send_notification',
            'notification': {
                'sender': user.username,
                'type': 'like',
                'post_id': post.id,
                'message': f"{user.username} liked your post.",
            }
        }
    )
  
