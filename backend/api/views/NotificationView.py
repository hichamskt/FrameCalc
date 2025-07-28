
from rest_framework import generics, permissions , status
from ..models import Notification
from ..serializers.NotificationSerializer import NotificationSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')
    

    
class MarkNotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def perform_update(self, serializer):
        serializer.save(is_read=True)

class DeleteAllNotificationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        """Delete all notifications for the authenticated user"""
        deleted_count, _ = Notification.objects.filter(recipient=request.user).delete()
        
        return Response({
            'message': f'Successfully deleted {deleted_count} notifications',
            'deleted_count': deleted_count
        }, status=status.HTTP_200_OK)