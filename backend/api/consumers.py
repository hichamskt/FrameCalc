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
            
            logger.info(f"WebSocket connect attempt for user_id: {self.user_id}")
            print(f"WebSocket connect attempt for user_id: {self.user_id}")
            
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
            logger.info(f"WebSocket connection accepted for user: {self.user_id}")
            
            # Send connection confirmation
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': f'Connected to notifications for user {self.user_id}',
                'user_id': self.user_id
            }))
            
        except Exception as e:
            logger.error(f"Error during WebSocket connection: {str(e)}")
            await self.close(code=4000)

    async def disconnect(self, close_code):
        try:
            logger.info(f"WebSocket disconnect for user: {self.user_id}, code: {close_code}")
            
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
            logger.info(f"Received message from user {self.user_id}: {text_data_json}")
            
            # Echo back the message (for testing)
            await self.send(text_data=json.dumps({
                'type': 'echo',
                'message': f"Received: {text_data_json.get('message', 'No message')}",
                'timestamp': text_data_json.get('timestamp')
            }))
            
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON received: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
        except Exception as e:
            logger.error(f"Error processing received message: {str(e)}")

    # Receive message from room group
    async def send_notification(self, event):
        """Handle notification messages sent to the group"""
        try:
            logger.info(f"Sending notification to user {self.user_id}: {event}")
            await self.send(text_data=json.dumps(event['notification']))
        except Exception as e:
            logger.error(f"Error sending notification: {str(e)}")

    # Additional handler for different notification types
    async def notification_message(self, event):
        """Alternative handler name for group messages"""
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