import { useEffect, useRef, useState, useCallback } from 'react';

// Types
interface Comment {
  id: number;
  content: string;
  user: {
    username: string;
    user_id: string;
  };
  created_at: string;
  post_id: number;
}

interface WebSocketMessage {
  type: string;
  data?: {
    type: string;
    comment?: Comment;
    comment_id?: number;
    message?: string;
  };
  comment?: Comment;
  comment_id?: number;
  message?: string;
}

interface PostSocketCallbacks {
  onNewComment?: (comment: Comment) => void;
  onCommentDeleted?: (commentId: number) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
}

export const usePostSocket = (
  postId: number,
  callbacks: PostSocketCallbacks = {}
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;

  const {
    onNewComment,
    onCommentDeleted,
    onConnected,
    onDisconnected,
    onError
  } = callbacks;

  // Handle WebSocket messages
  const handleMessage = useCallback((data: WebSocketMessage) => {
    switch (data.type) {
      case 'connection_established':
        onConnected?.();
        break;

      case 'send_post_update':
        if (data.data?.type === 'new_comment' && data.data.comment) {
          onNewComment?.(data.data.comment);
        } else if (data.data?.type === 'comment_deleted' && data.data.comment_id) {
          onCommentDeleted?.(data.data.comment_id);
        }
        break;

      case 'new_comment':
        if (data.comment) {
          onNewComment?.(data.comment);
        }
        break;

      case 'comment_deleted':
        if (data.comment_id) {
          onCommentDeleted?.(data.comment_id);
        }
        break;

      case 'error':
        onError?.(new Error(data.message || 'WebSocket error'));
        break;
    }
  }, [onNewComment, onCommentDeleted, onConnected, onError]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      const socket = new WebSocket(`ws://localhost:8000/ws/post/${postId}/`);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        setConnectionAttempts(0);
        
        socket.send(JSON.stringify({
          type: 'connection_test',
          message: 'React client connected',
          timestamp: new Date().toISOString()
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          onError?.(error);
        }
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        onDisconnected?.();

        if (event.code !== 1000 && connectionAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            connect();
          }, delay);
        }
      };

      socket.onerror = (error) => {
        onError?.(error);
      };

    } catch (error) {
      onError?.(error);
    }
  }, [postId, connectionAttempts, handleMessage, onDisconnected, onError]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionAttempts(0);
  }, []);

  // Send message to WebSocket
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      return false;
    }
  }, []);

  // Initialize connection
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [postId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionAttempts,
    sendMessage,
    disconnect,
    reconnect: connect
  };
};

