import os
import sys
import django
from django.conf import settings

def verify_django_setup():
    print("🔍 Verifying Django WebSocket Setup...")
    print("=" * 50)
    
    # Set up Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    
    # Check INSTALLED_APPS
    print("📦 Checking INSTALLED_APPS:")
    required_apps = ['channels', 'api', 'api.apps.ApiConfig']
    installed_apps = settings.INSTALLED_APPS
    
    if 'channels' in installed_apps:
        print("✅ channels is installed")
    else:
        print("❌ channels is NOT installed")
    
    if 'api' in installed_apps or 'api.apps.ApiConfig' in installed_apps:
        print("✅ api app is installed")
    else:
        print("❌ api app is NOT installed")
    
    # Check ASGI application
    print("\n🚀 Checking ASGI Configuration:")
    if hasattr(settings, 'ASGI_APPLICATION'):
        print(f"✅ ASGI_APPLICATION: {settings.ASGI_APPLICATION}")
    else:
        print("❌ ASGI_APPLICATION not set")
    
    # Check Channel Layers
    print("\n📡 Checking Channel Layers:")
    if hasattr(settings, 'CHANNEL_LAYERS'):
        channel_config = settings.CHANNEL_LAYERS
        print(f"✅ CHANNEL_LAYERS configured: {channel_config['default']['BACKEND']}")
        
        # Test channel layer
        try:
            from channels.layers import get_channel_layer
            channel_layer = get_channel_layer()
            if channel_layer:
                print("✅ Channel layer instance created successfully")
            else:
                print("❌ Failed to create channel layer instance")
        except Exception as e:
            print(f"❌ Channel layer error: {e}")
    else:
        print("❌ CHANNEL_LAYERS not configured")
    
    # Check Redis connection
    print("\n🔴 Checking Redis Connection:")
    try:
        import redis
        r = redis.Redis(host='127.0.0.1', port=6379, db=0)
        r.ping()
        print("✅ Redis connection successful")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("   Make sure Redis is running: redis-server")
    
    # Check routing file
    print("\n🛣️  Checking Routing Configuration:")
    try:
        import api.routing
        if hasattr(api.routing, 'websocket_urlpatterns'):
            patterns = api.routing.websocket_urlpatterns
            print(f"✅ WebSocket URL patterns found: {len(patterns)} pattern(s)")
            for i, pattern in enumerate(patterns):
                try:
                    pattern_str = str(pattern.pattern)
                    print(f"   Pattern {i+1}: {pattern_str}")
                except AttributeError:
                    print(f"   Pattern {i+1}: {pattern}")
        else:
            print("❌ websocket_urlpatterns not found in api.routing")
    except ImportError as e:
        print(f"❌ Cannot import api.routing: {e}")
    
    # Check consumers
    print("\n🔌 Checking Consumers:")
    try:
        import api.consumers
        if hasattr(api.consumers, 'NotificationConsumer'):
            print("✅ NotificationConsumer found")
        else:
            print("❌ NotificationConsumer not found")
    except ImportError as e:
        print(f"❌ Cannot import api.consumers: {e}")
    
    # Check ASGI file
    print("\n⚙️  Checking ASGI Application:")
    try:
        import backend.asgi
        if hasattr(backend.asgi, 'application'):
            print("✅ ASGI application found")
        else:
            print("❌ ASGI application not found")
    except ImportError as e:
        print(f"❌ Cannot import backend.asgi: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Verification Complete!")

if __name__ == "__main__":
    verify_django_setup()