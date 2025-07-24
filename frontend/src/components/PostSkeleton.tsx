
export default function PostSkeleton() {
  return (
    <div className="h-[200px] bg-[#2c2c2c] animate-pulse rounded-md mb-2 p-4">
      <div className="h-6 w-3/4 bg-gray-600 mb-4 rounded"></div>
      <div className="h-4 w-full bg-gray-700 mb-2 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
    </div>
  );
}
