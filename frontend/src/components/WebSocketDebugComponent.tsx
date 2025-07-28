import { useState, useEffect, useRef } from 'react';

// Define notification types to match your Django backend
interface Notification {
  id: number;
  sender: string;
  sender_id: string;
  type: 'comment' | 'like' | 'follow' | string;
  post_id?: number;
  comment_id?: number;
  message: string;
  timestamp: string;
  is_read: boolean;
}

const WebSocketNotificationComponent = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [rawMessages, setRawMessages] = useState<string[]>([]); // For debugging
  const [userId] = useState('e04fdae3-5042-4491-8ddd-7c5e629ce36b'); 
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  // Helper function to add debug logs
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  useEffect(() => {
    addDebugLog(`Attempting to connect to WebSocket for user: ${userId}`);
    
    // Create WebSocket connection
    const wsUrl = `ws://localhost:8000/ws/notifications/${userId}/`;
    addDebugLog(`WebSocket URL: ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      addDebugLog('✅ WebSocket connection opened successfully');
      setConnectionStatus('Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      addDebugLog(`📨 Message received: ${event.data}`);
      
      // Store raw message for debugging
      setRawMessages(prev => [...prev, event.data]);
      
      try {
        // Parse the WebSocket message
        const websocketData = JSON.parse(event.data);
        addDebugLog(`📋 Parsed JSON: ${JSON.stringify(websocketData, null, 2)}`);
        
        // Handle different message types
        if (websocketData.type === 'connection_established') {
          addDebugLog('🔗 Connection established message received');
          console.log('Connection established:', websocketData.message);
          return;
        }
        
        if (websocketData.type === 'echo') {
          addDebugLog('🔄 Echo message received');
          console.log('Echo received:', websocketData.message);
          return;
        }
        
        if (websocketData.type === 'error') {
          addDebugLog(`❌ Error message: ${websocketData.message}`);
          console.error('WebSocket error:', websocketData.message);
          return;
        }
        
        // Handle notification messages
        if (websocketData.type === 'notification' && websocketData.notification) {
          addDebugLog('🔔 Processing notification message');
          const notificationData = websocketData.notification;
          
          const notification: Notification = {
            id: notificationData.id,
            sender: notificationData.sender,
            sender_id: notificationData.sender_id,
            type: notificationData.type,
            post_id: notificationData.post_id,
            comment_id: notificationData.comment_id,
            message: notificationData.message,
            timestamp: notificationData.timestamp,
            is_read: notificationData.is_read || false
          };
          
          addDebugLog(`✅ Notification processed: ${notification.message}`);
          setNotifications(prev => [notification, ...prev]);
          
          // Optional: Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`New ${notification.type}`, {
              body: notification.message,
              icon: '/favicon.ico'
            });
          }
          
          return;
        }
        
        // Fallback for other message types
        addDebugLog(`⚠️ Unhandled message type: ${websocketData.type || 'unknown'}`);
        console.log('Unhandled message type:', websocketData);
        
      } catch (error) {
        addDebugLog(`❌ JSON parsing error: ${error}`);
        console.error('Error parsing notification:', error);
        // Fallback for non-JSON messages
        const notification: Notification = {
          id: Date.now(),
          sender: 'System',
          sender_id: 'system',
          type: 'message',
          message: event.data,
          timestamp: new Date().toISOString(),
          is_read: false
        };
        
        setNotifications(prev => [notification, ...prev]);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      addDebugLog(`🔌 Connection closed - Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
      setConnectionStatus('Disconnected');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      addDebugLog(`❌ WebSocket error occurred`);
      setConnectionStatus('Error');
    };

    return () => {
      addDebugLog('🧹 Cleaning up WebSocket connection');
      ws.close();
    };
  }, [userId]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        // Always send as JSON to match Django expectations
        const messageData = {
          message: message,
          timestamp: new Date().toISOString()
        };
        
        console.log('Sending message:', JSON.stringify(messageData));
        socket.send(JSON.stringify(messageData));
      } catch (error) {
        console.error('Error sending message:', error);
      }
      setMessage('');
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setRawMessages([]);
    setDebugLogs([]);
    addDebugLog('🧹 Cleared all notifications and logs');
  };

  const testNotification = () => {
    const testData = {
      type: 'test_notification',
      message: 'This is a test notification from the frontend'
    };
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(testData));
      addDebugLog(`📤 Sent test notification: ${JSON.stringify(testData)}`);
    } else {
      addDebugLog('❌ Cannot send test - WebSocket not connected');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment': return '💬';
      case 'like': return '❤️';
      case 'follow': return '👤';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📬';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">WebSocket Notifications</h2>
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Status: <span className={`font-semibold ${
              connectionStatus === 'Connected' ? 'text-green-600' : 
              connectionStatus === 'Error' ? 'text-red-600' : 'text-orange-500'
            }`}>{connectionStatus}</span>
          </p>
          <p className="text-sm text-gray-600">
            User ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{userId}</code>
          </p>
        </div>
      </div>

      {/* Send message section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Send Message</h3>
        <div className="flex gap-3 mb-3">
          <input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message (JSON or plain text)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={!socket || socket.readyState !== WebSocket.OPEN}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              !socket || socket.readyState !== WebSocket.OPEN
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            Send
          </button>
        </div>
        <button 
          onClick={testNotification}
          disabled={!socket || socket.readyState !== WebSocket.OPEN}
          className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
            !socket || socket.readyState !== WebSocket.OPEN
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
          }`}
        >
          🧪 Send Test Notification
        </button>
      </div>

      {/* Notifications section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Notifications ({notifications.length})
          </h3>
          <button 
            onClick={clearNotifications} 
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear All
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">📬</div>
              <p>No notifications yet. Waiting for messages...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 transition-colors hover:bg-gray-50 ${
                    notification.is_read 
                      ? 'bg-white' 
                      : 'bg-blue-50 border-l-4 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-blue-600 truncate">
                          {notification.sender}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full uppercase tracking-wide">
                          {notification.type}
                        </span>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.post_id && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                            </svg>
                            Post: {notification.post_id}
                          </span>
                        )}
                        {notification.comment_id && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Comment: {notification.comment_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Debug sections */}
      <div className="space-y-4">
        {/* Debug Logs */}
        <details className="bg-white rounded-lg shadow-sm border border-gray-200">
          <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            🔍 Debug Logs ({debugLogs.length})
          </summary>
          <div className="p-4 pt-0">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-48 overflow-y-auto font-mono text-sm">
              {debugLogs.length === 0 ? (
                <div className="text-gray-500">No debug logs yet...</div>
              ) : (
                debugLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </details>

        {/* Raw Messages */}
        <details className="bg-white rounded-lg shadow-sm border border-gray-200">
          <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            🐛 Raw Messages ({rawMessages.length})
          </summary>
          <div className="p-4 pt-0">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-48 overflow-y-auto font-mono text-sm">
              {rawMessages.length === 0 ? (
                <div className="text-gray-500">No messages received yet...</div>
              ) : (
                rawMessages.map((msg, index) => (
                  <div key={index} className="mb-2 pb-2 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-400 text-xs mb-1">Message {index + 1}:</div>
                    <div className="break-all">{msg}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default WebSocketNotificationComponent;