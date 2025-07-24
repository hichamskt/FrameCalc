// src/components/Post.tsx
import type { Post as PostType } from "../types/app";

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {


  return (
    <div className="h-[200px] bg-white mb-2 p-4 rounded-2xl">
      <h2 className="text-xl font-bold mb-2">{post.text}</h2>
      
    </div>
  );
}
