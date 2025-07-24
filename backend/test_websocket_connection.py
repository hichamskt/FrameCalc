import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    user_id = "e04fdae3-5042-4491-8ddd-7c5e629ce36b"
    uri = f"ws://localhost:8000/ws/notifications/{user_id}/"
    
    print(f"🔗 Attempting to connect to: {uri}")
    
    try:
        # Add proper WebSocket headers
       
        async with websockets.connect(
            uri, 
           
            ping_interval=20,
            ping_timeout=10
        ) as websocket:
            print("✅ WebSocket connection established!")
            
            # Send a test message
            test_message = {
                "type": "ping",
                "message": "Hello WebSocket Server!",
                "user_id": user_id
            }
            
            await websocket.send(json.dumps(test_message))
            print(f"📤 Sent: {test_message}")
            
            # Wait for responses (with timeout)
            try:
                while True:
                    response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    data = json.loads(response)
                    print(f"📥 Received: {data}")
                    
                    # Break after receiving a few messages
                    if data.get('type') in ['connection_established', 'pong', 'echo']:
                        print("✅ WebSocket communication successful!")
                        break
                        
            except asyncio.TimeoutError:
                print("⏰ No response received within timeout")
            
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"❌ WebSocket connection failed with status: {e.status_code}")
        print("This usually means the server rejected the WebSocket upgrade")
        
    except ConnectionRefusedError:
        print("❌ Connection refused - make sure Django server is running")
        
    except Exception as e:
        print(f"❌ Unexpected error: {type(e).__name__}: {e}")

if __name__ == "__main__":
    print("🧪 Testing WebSocket Connection...")
    asyncio.run(test_websocket_connection())