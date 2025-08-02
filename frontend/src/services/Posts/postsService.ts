/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Post, CreatePostData,  PaginatedCommentResponse } from '../../types/app';


export const createPost = (
  postData: CreatePostData,

  axios: any
): Promise<{ data: Post }> => {
  const formData = new FormData();

  formData.append('text', postData.text); // your text field
  if (postData.image) {
    formData.append('image', postData.image); // your image File
  }

  return axios.post('/posts/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};





// services/Posts/postsService.ts

export const getPosts = async (axios: any, url: string): Promise<{ results: Post[]; next: string | null }> => {
  const response = await axios.get(url);
  return response.data;
};


interface ToggleLikeResponse {
  liked: boolean;
  message: string;
}

export const togleLike = async (
  axios: any,
  id: number
): Promise<ToggleLikeResponse> => {
  const response = await axios.post(`/posts/${id}/like/`);
  return response.data;
};


export const getPostComments = async (axios:any  , url:string): Promise<PaginatedCommentResponse> =>{
  const response = await axios.get(url);
  return response.data;
}


export const addNewComment = async (axios:any  , url:string , newComment:string): Promise<PaginatedCommentResponse> =>{
  const response = await axios.post(url,{text:newComment});
  return response.data;
}
