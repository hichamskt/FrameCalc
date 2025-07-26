/* eslint-disable @typescript-eslint/no-explicit-any */

import { FaArrowRightLong } from "react-icons/fa6";
import AddPost from "../components/AddPost";
import { useUser } from "../hooks/useUser";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePosts } from "../hooks/posts/usePosts";
import PostSkeleton from "../components/PostSkeleton";
const Post = lazy(() => import("../components/Post"));

function Community() {
  const { user, userLoading } = useUser();
  const [showAddPost, setShowAddpost] = useState<boolean>(false);

  const { posts, PostsLoading, next, setRefresh } = usePosts();

  const [loading, setLoading] = useState<boolean>(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && next && !loading && !PostsLoading) {
        setLoading(true);
        setRefresh(true);
      }
    },
    [next, loading, PostsLoading]
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
    if (!PostsLoading && loading) {
      setLoading(false);
    }
  }, [PostsLoading]);

  return (
    <div className="container  mx-auto p-2">
      <div className="text-white flex items-center justify-between w-full">
        <p className="text-3xl">Community</p>
        <button
          className="flex items-center px-2 py-2 gap-2   rounded cursor-pointer"
          style={{
            background: "linear-gradient(90deg, #CB3CFF 20%, #7F25FB 68%)",
          }}
          onClick={() => setShowAddpost(true)}
        >
          Post
          <FaArrowRightLong />
        </button>
      </div>

      {showAddPost && (
        <AddPost
          user={user}
          userLoading={userLoading}
          setShowAddpost={setShowAddpost}
        />
      )}

      <div className="mt-7">

      <ul  className="flex flex-col gap-15 " >
        {posts.map((post, id) => (
          <li key={id} className="w-full">
            <Suspense fallback={<PostSkeleton />}>
              <Post post={post} />
            </Suspense>
          </li>
        ))}
      </ul>

        </div>
      <div
        ref={observerRef}
        className="col-span-full text-center text-gray-500 py-4"
      >
        {loading
          ? "Loading..."
          : next
          ? "Scroll to load more..."
          : "No more sketches"}
      </div>
    </div>
  );
}

export default Community;
