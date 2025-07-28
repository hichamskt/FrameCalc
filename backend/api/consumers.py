# api/consumers.py
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import StopConsumer

# Set up logging
logger = logging.getLogger(__name__)



class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Get user_id from URL
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            self.room_group_name = f'notifications_{self.user_id}'
            
            print("=" * 60)
            print("🔌 WEBSOCKET CONNECTION DEBUG")
            print("=" * 60)
            print(f"👤 User ID: {self.user_id}")
            print(f"🏠 Group name: {self.room_group_name}")
            print(f"📡 Channel name: {self.channel_name}")
            print(f"🔌 Channel layer: {self.channel_layer}")
            print(f"🔌 Channel layer available: {self.channel_layer is not None}")
            
            logger.info(f"WebSocket connect attempt for user_id: {self.user_id}")
            
            # Join room group (only if channel_layer is available)
            if self.channel_layer:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                print(f"✅ Added to group: {self.room_group_name}")
                logger.info(f"Added to group: {self.room_group_name}")
            else:
                print("⚠️ No channel layer configured - group messaging won't work")
                logger.warning("No channel layer configured - group messaging won't work")
            
            await self.accept()
            print("✅ WebSocket connection accepted")
            logger.info(f"WebSocket connection accepted for user: {self.user_id}")
            
            # Send connection confirmation
            connection_message = {
                'type': 'connection_established',
                'message': f'Connected to notifications for user {self.user_id}',
                'user_id': self.user_id,
                'group_name': self.room_group_name,
                'timestamp': json.dumps(None, default=str)  # Will be replaced by actual timestamp
            }
            
            print(f"📤 Sending connection confirmation: {connection_message}")
            await self.send(text_data=json.dumps(connection_message))
            
            print("=" * 60)
            
        except Exception as e:
            print(f"💥 Error during WebSocket connection: {str(e)}")
            logger.error(f"Error during WebSocket connection: {str(e)}")
            import traceback
            traceback.print_exc()
            await self.close(code=4000)

    async def disconnect(self, close_code):
        try:
            print("=" * 60)
            print("🔌 WEBSOCKET DISCONNECTION DEBUG")
            print("=" * 60)
            print(f"👤 User ID: {getattr(self, 'user_id', 'Unknown')}")
            print(f"🔢 Close code: {close_code}")
            
            logger.info(f"WebSocket disconnect for user: {getattr(self, 'user_id', 'Unknown')}, code: {close_code}")
            
            # Leave room group
            if hasattr(self, 'room_group_name') and self.channel_layer:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                print(f"✅ Removed from group: {self.room_group_name}")
                logger.info(f"Removed from group: {self.room_group_name}")
            
            print("=" * 60)
                
        except Exception as e:
            print(f"💥 Error during WebSocket disconnect: {str(e)}")
            logger.error(f"Error during WebSocket disconnect: {str(e)}")

    async def receive(self, text_data):
        """Handle messages received from WebSocket"""
        try:
            print("=" * 60)
            print("📨 WEBSOCKET RECEIVE DEBUG")
            print("=" * 60)
            print(f"👤 User ID: {self.user_id}")
            print(f"📄 Raw data: {text_data}")
            
            text_data_json = json.loads(text_data)
            print(f"📊 Parsed JSON: {text_data_json}")
            
            logger.info(f"Received message from user {self.user_id}: {text_data_json}")
            
            # Echo back the message (for testing)
            echo_response = {
                'type': 'echo',
                'message': f"Received: {text_data_json.get('message', 'No message')}",
                'timestamp': text_data_json.get('timestamp'),
                'original_data': text_data_json
            }
            
            print(f"📤 Sending echo response: {echo_response}")
            await self.send(text_data=json.dumps(echo_response))
            
            print("=" * 60)
            
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON received: {str(e)}")
            logger.error(f"Invalid JSON received: {str(e)}")
            
            error_response = {
                'type': 'error',
                'message': f'Invalid JSON format: {str(e)}',
                'received_data': text_data
            }
            
            await self.send(text_data=json.dumps(error_response))
            
        except Exception as e:
            print(f"💥 Error processing received message: {str(e)}")
            logger.error(f"Error processing received message: {str(e)}")

    async def send_notification(self, event):
        """Handle notification messages sent to the group"""
        try:
            print("=" * 60)
            print("🔔 NOTIFICATION SEND DEBUG")
            print("=" * 60)
            print(f"👤 User ID: {self.user_id}")
            print(f"📦 Event received: {event}")
            print(f"📊 Event type: {event.get('type', 'Unknown')}")
            print(f"📄 Notification data: {event.get('notification', 'No notification data')}")
            
            logger.info(f"Sending notification to user {self.user_id}: {event}")
            
            # Prepare the notification message
            notification_message = {
                'type': 'notification',
                'notification': event['notification']
            }
            
            print(f"📤 Sending notification message: {notification_message}")
            
            await self.send(text_data=json.dumps(notification_message))
            
            print("✅ Notification sent successfully!")
            print("=" * 60)
            
        except KeyError as e:
            print(f"❌ Missing key in event: {str(e)}")
            print(f"📦 Available keys: {list(event.keys())}")
            logger.error(f"Missing key in notification event: {str(e)}")
            
            error_message = {
                'type': 'error',
                'message': f'Missing key in notification: {str(e)}',
                'event_keys': list(event.keys())
            }
            
            await self.send(text_data=json.dumps(error_message))
            
        except Exception as e:
            print(f"💥 Error sending notification: {str(e)}")
            logger.error(f"Error sending notification: {str(e)}")
            import traceback
            traceback.print_exc()
            
            error_message = {
                'type': 'error',
                'message': f'Error sending notification: {str(e)}'
            }
            
            await self.send(text_data=json.dumps(error_message))

    # Additional handler for different notification types
    async def notification_message(self, event):
        """Alternative handler name for group messages"""
        print("📨 notification_message handler called")
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': event['message']
        }))

class PostConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Get post_id from URL
            self.post_id = self.scope['url_route']['kwargs']['post_id']
            self.room_group_name = f'post_{self.post_id}'
            
            logger.info(f"WebSocket connect attempt for post_id: {self.post_id}")
            print(f"WebSocket connect attempt for post_id: {self.post_id}")
            
            # Join room group (only if channel_layer is available)
            if self.channel_layer:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                logger.info(f"Added to group: {self.room_group_name}")
            else:
                logger.warning("No channel layer configured - group messaging won't work")
            
            await self.accept()
            logger.info(f"WebSocket connection accepted for post: {self.post_id}")
            
            # Send connection confirmation
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': f'Connected to post {self.post_id} for real-time updates',
                'post_id': self.post_id
            }))
            
        except Exception as e:
            logger.error(f"Error during WebSocket connection: {str(e)}")
            await self.close(code=4000)

    async def disconnect(self, close_code):
        try:
            logger.info(f"WebSocket disconnect for post: {self.post_id}, code: {close_code}")
            
            # Leave room group
            if hasattr(self, 'room_group_name') and self.channel_layer:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                logger.info(f"Removed from group: {self.room_group_name}")
                
        except Exception as e:
            logger.error(f"Error during WebSocket disconnect: {str(e)}")

    async def receive(self, text_data):
        """Handle messages received from WebSocket"""
        try:
            text_data_json = json.loads(text_data)
            logger.info(f"Received message for post {self.post_id}: {text_data_json}")
            
            # You can add custom message handling here if needed
            # For now, just echo back
            await self.send(text_data=json.dumps({
                'type': 'echo',
                'message': f"Received: {text_data_json.get('message', 'No message')}",
                'post_id': self.post_id
            }))
            
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON received: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
        except Exception as e:
            logger.error(f"Error processing received message: {str(e)}")

    # Receive message from room group - this handles the real-time comment updates
    async def send_post_update(self, event):
        """Handle post update messages sent to the group"""
        print('clieck')
        try:
            logger.info(f"Sending post update for post {self.post_id}: {event}")
            await self.send(text_data=json.dumps(event['data']))
        except Exception as e:
            logger.error(f"Error sending post update: {str(e)}")

    # Additional handler for different update types
    async def post_comment_update(self, event):
        """Alternative handler name for comment updates"""
        await self.send(text_data=json.dumps({
            'type': 'new_comment',
            'data': event['comment_data']
        }))