
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePostSocket } from "../sockets/usePostSocket";
import { useGetComments } from "../hooks/posts/useGetComments";
import { Send } from 'lucide-react';

import { addNewComment } from "../services/Posts/postsService";
import { useAxios } from "../api/axios";
import type { Comment } from "../types/app";




interface Props {
  postId: number;
}




const Comments: React.FC<Props> = ({ postId }) => {
  const {
    comments,
    setComments,
    next,
    setRefresh,
    commentLoading,
    setCommentsLoading,
  } = useGetComments(postId);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const url = `posts/${postId}/comments/`
  
  const handleNewComment = (comment: Comment) => {
    setComments((prev) => {
      const exists = prev.some((c) => c.id === comment.id);
      if (exists) return prev;

      return [comment, ...prev];
    });
  };

const axios = useAxios();

  const handleSubmitComment = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
        await addNewComment(axios, url,newComment);
      setNewComment('');
    
      
    } catch (error) {
      console.error('❌ Error submitting comment:', error);

    } finally {
      setIsSubmitting(false);
    }
  };



  
  const handleCommentDeleted = (commentId: number) => {
    console.log("Comment deleted:", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };


  const handleConnected = () => {
    console.log("✅ Connected to post WebSocket");
  };

  const handleDisconnected = () => {
    console.log("❌ Disconnected from post WebSocket");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    [next, commentLoading]
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
    if (!commentLoading) {
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
                      {comment.user}
                    </strong>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    { comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div
            ref={observerRef}
            className="col-span-full text-center text-gray-500 py-4"
          >
            {commentLoading ? (
              <div className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                </div>
              </div>
            ) : next ? (
              "Scroll to load more..."
            ) : (
              "No more comments"
            )}
          </div>
        </div>
      )}

      <div className="p-4 border-b bg-gray-50 rounded-2xl">
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent"
            rows={1}
            maxLength={500}
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment(e);
              }
            }}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {newComment.length}/500 characters • Press Enter to post, Shift+Enter for new line
        </div>
      </div>

    </div>
  );
};

export default Comments;
