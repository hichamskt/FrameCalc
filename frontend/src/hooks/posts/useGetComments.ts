import { useEffect, useState } from 'react';
import { getPostComments } from '../../services/Posts/postsService';
import type { Comment } from '../../types/app';
import { useAxios } from '../../api/axios';

export function useGetComments(postId:number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentsLoading] = useState(true);
  const [next, setNext] = useState<string | null>(
    `${import.meta.env.VITE_API_URL}/posts/${postId}/comments/?page=1`
  );
  const [refresh, setRefresh] = useState<boolean>(true); 
  const axios = useAxios();

  useEffect(() => {
   
    const fetchPosts = async () => {
      if (!next) return;

      setCommentsLoading(true);
      try {
        const data = await getPostComments(axios,next);
        setComments((prev) => [...prev, ...data.results]);
        setNext(data.next);
        
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setCommentsLoading(false);
        setRefresh(false); // prevent auto re-call
      }
    };

    if (refresh) fetchPosts();
  }, [refresh]);

  return { comments, setComments , commentLoading, next, setRefresh ,setCommentsLoading };
}
