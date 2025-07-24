/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCreatePost.ts
import { useState, useRef, useEffect } from "react";
import { createPost } from "../../services/Posts/postsService";
import type { CreatePostData, Post } from "../../types/app";
import { useAxios } from "../../api/axios";

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const isMounted = useRef(true);
const axios = useAxios();
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const createNewPost = async (data: CreatePostData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPost(data,axios);
      console.log('resopnde',response)
      if (isMounted.current) {
        setPost(response.data);
      }
      return response.data;
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.response?.data?.message || err.message || "Error creating post");
      }
      throw err;
    } finally {
      
        setLoading(false);
      
    }
  };

  return { createNewPost, loading, error, post };
};
