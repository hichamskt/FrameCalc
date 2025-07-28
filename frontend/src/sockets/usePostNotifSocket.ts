import { useEffect, useRef, useState } from 'react';

export interface Notification {
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

interface WebSocketState {
  notifications: Notification[];
  connectionStatus: 'Connected' | 'Disconnected' | 'Error';
  clearNotifications: () => void;
}

export const usePostNotifSocket = (
  userId: string,
  wsBaseUrl = 'ws://localhost:8000'
): WebSocketState => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'Connected' | 'Disconnected' | 'Error'>('Disconnected');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${wsBaseUrl}/ws/notifications/${userId}/`);
    socketRef.current = ws;

    ws.onopen = () => setConnectionStatus('Connected');
    ws.onerror = () => setConnectionStatus('Error');
    ws.onclose = () => setConnectionStatus('Disconnected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification' && data.notification) {
          const n = data.notification;
          const newNotification: Notification = {
            id: n.id,
            sender: n.sender,
            sender_id: n.sender_id,
            type: n.type,
            post_id: n.post_id,
            comment_id: n.comment_id,
            message: n.message,
            timestamp: n.timestamp,
            is_read: n.is_read ?? false,
          };
          setNotifications((prev) => [newNotification, ...prev]);

          if ('Notification' in window && Notification.permission === 'granted') {
           new Notification(`New ${newNotification.type}`, {
              body: newNotification.message,
              icon: '/favicon.ico'
            });
          }



        }
      } catch {
        // Ignore non-JSON or invalid messages
      }
    };

    return () => {
      ws.close();
    };
  }, [userId, wsBaseUrl]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    connectionStatus,
    clearNotifications,
  };
};
