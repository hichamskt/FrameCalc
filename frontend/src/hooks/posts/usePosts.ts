import { useEffect, useState } from 'react';
import { getPosts } from '../../services/Posts/postsService';
import type { Post } from '../../types/app';
import { useAxios } from '../../api/axios';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [PostsLoading, setPostsLoading] = useState(true);
  const [next, setNext] = useState<string | null>(
    `${import.meta.env.VITE_API_URL}/posts/?page=1`
  );
  const [refresh, setRefresh] = useState<boolean>(true); // Start with true to trigger first load
  const axios = useAxios();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!next) return;

      setPostsLoading(true);
      try {
        const data = await getPosts(axios, next);
        setPosts((prev) => [...prev, ...data.results]);
        setNext(data.next);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setPostsLoading(false);
        setRefresh(false); // prevent auto re-call
      }
    };

    if (refresh) fetchPosts();
  }, [refresh]);

  return { posts, PostsLoading, next, setRefresh };
}
