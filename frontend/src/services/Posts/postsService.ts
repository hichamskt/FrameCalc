
import type { Post, CreatePostData } from '../../types/app';


export const createPost = (
  postData: CreatePostData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPosts = async (axios: any, url: string): Promise<{ results: Post[]; next: string | null }> => {
  const response = await axios.get(url);
  return response.data;
};
