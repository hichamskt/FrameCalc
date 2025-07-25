import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePostSocket } from "../sockets/usePostSocket";
import { useGetComments } from "../hooks/posts/useGetComments";



interface Comment {
  id: number; // Changed from string | null to number to match backend
  user: {
    username: string;
    user_id: string;
  };
  content: string; // Changed from 'text' to 'content' to match backend
  created_at: string;
  post_id: number;
}

interface Props {
  postId: number;
}

const Comment: React.FC<Props> = ({ postId }) => {
  const {comments , setComments , next , setRefresh , commentLoading , setCommentsLoading } = useGetComments(postId)
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const handleNewComment = (comment: Comment) => {
    console.log("New comment received:", comment);
    setComments((prev) => {
      
      const exists = prev.some((c) => c.id === comment.id);
      if (exists) return prev;

      console.log('passed')
      return [comment, ...prev];
    });
  };

  // Handle comment deletion from WebSocket
  const handleCommentDeleted = (commentId: number) => {
    console.log("Comment deleted:", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Handle WebSocket connection events
  const handleConnected = () => {
    console.log("✅ Connected to post WebSocket");
  };

  const handleDisconnected = () => {
    console.log("❌ Disconnected from post WebSocket");
  };

  const handleError = (error: any) => {
    console.error("WebSocket error:", error);
  };

  // Initialize WebSocket connection
  const { isConnected } = usePostSocket(postId, {
    onNewComment: handleNewComment,
    onCommentDeleted: handleCommentDeleted,
    onConnected: handleConnected,
    onDisconnected: handleDisconnected,
    onError: handleError,
  });

  


    const handleObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && next && !commentLoading) {
          setCommentsLoading(true);
          setRefresh(true);
        }
      },
      [next,commentLoading]
    );
  
    useEffect(() => {
      const observer = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      });
  
      if (observerRef.current) observer.observe(observerRef.current);
  
      return () => observer.disconnect();
    }, [handleObserver]);
  
    useEffect(() => {
      if (!commentLoading ) {
        setCommentsLoading(false);
      }
    }, [commentLoading]);
 

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    return date.toLocaleDateString();
  };

 

  

  return (
    <div className="space-y-4">
      {/* Connection status indicator */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Comments ({comments.length})
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
            isConnected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          {isConnected ? "Live" : "Offline"}
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px]  overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth ">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <strong className="text-blue-600 font-semibold">
                      {comment.user?.username || comment.user}
                    </strong>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    {comment.content || comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
         
          
          <div
        ref={observerRef}
        className="col-span-full text-center text-gray-500 py-4"
      >
        {commentLoading
          ? 
           <div className="p-4">
       <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
         <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
         <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
         </div>
       </div>
          : next
          ? "Scroll to load more..."
          : "No more comments"}
      </div>
        </div>
      )}

      
      
    </div>
  );
};

export default Comment;
