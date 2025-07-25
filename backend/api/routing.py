from django.urls import re_path
from . import consumers

# api/routing.py
from django.urls import path
from . import consumers


print("Loading WebSocket routing...")
print("Available consumers:", dir(consumers))


websocket_urlpatterns = [
    # For user notifications
     re_path(r'ws/notifications/(?P<user_id>[0-9a-f-]+)/$', consumers.NotificationConsumer.as_asgi()),
    
    # For real-time post updates (comments)
    re_path(r'ws/post/(?P<post_id>\d+)/$', consumers.PostConsumer.as_asgi()),

]

print(f"WebSocket URL patterns loaded: {len(websocket_urlpatterns)} patterns")