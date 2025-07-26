// src/components/Post.tsx
import type { Post as PostType } from "../types/app";
import fallback from "../assets/person.jpg";
import { useEffect, useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { togleLike } from "../services/Posts/postsService";
import { useAxios } from "../api/axios";
import { useUser } from "../hooks/useUser";
import Comments from "./Comments";

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const { user } = useUser();
  const [image, setImage] = useState<string>(
    post.user?.profile_image_url || fallback
  );

  useEffect(() => {
    setImage(post.user?.profile_image_url || fallback);
  }, [post]);

  const [liked, setLiked] = useState<boolean>(
    post.liked_users?.includes(user?.username ?? '') || false

  );
  const [likesCount, setLikesCount] = useState<number>(post.likes_count || 0);
  const [likedUsers, setLikedUsers] = useState([...(post.liked_users || [])]);

  useEffect(() => {
    setLiked(post.liked_users?.includes(user?.username ?? "") || false);
  }, [post, user]);

  // utils/timeAgo.ts

  function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    // More than 7 days → show the date (e.g., "Jul 10")
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const axios = useAxios();

  const toggleLike = async () => {
    try {
      await togleLike(axios, post.id);
      if (liked) {
        setLikesCount(likesCount - 1);
        setLiked(false);
        setLikedUsers((prev) =>
          prev.filter((username) => username !== user?.username)
        );
      } else {
        setLikesCount(likesCount + 1);
        setLiked(true);
        if(user?.username) setLikedUsers((prev) => [...prev, user?.username]);
      }

      setLiked(!liked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <div
      className="  mb-2 p-4   bg-white  rounded-2xl
 "
    >
      <div className="flex items-center gap-3 p-3">
        <img
          src={image}
          alt="profile"
          className="sm:w-16 sm:h-16 w-12 h-12 rounded-full object-cover"
          onError={() => setImage(fallback)}
        />
        <div className="flex justify-between flex-col gap-0.2">
          <p className="font-bold ">{post.user.username}</p>
          <p className="font-medium text-gray-500">
            {formatTimeAgo(post.created_at)}
          </p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2 p-2">{post.text}</h2>
      {post.image_url && (
        <div className="">
          <img
            src={post.image_url}
            alt="profile"
            className="h-[400px] w-full object-cover rounded"
          />
        </div>
      )}

      <div className="my-3">
        <div className="relative group flex gap-2 items-center">
          <div
            className={`text-[20px] cursor-pointer p-1 rounded transition-colors ${
              liked ? "bg-blue-400 text-white" : "text-black hover:bg-white/10"
            }`}
            onClick={() => toggleLike()}
          >
            {liked ? <AiFillLike /> : <AiOutlineLike />}
          </div>

          {likesCount > 0 && (
            <>
              <p className="text-sm cursor-pointer">
                {likesCount === 1
                  ? `${likesCount} like`
                  : `${likesCount} likes`}
              </p>

              <div className="absolute top-[-60px] left-0 bg-black text-white text-xs p-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 min-w-max">
                {likedUsers?.map((user, i) => (
                  <p key={i} className="whitespace-nowrap">
                    {user}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Comments postId={post.id} />
    </div>
  );
}
