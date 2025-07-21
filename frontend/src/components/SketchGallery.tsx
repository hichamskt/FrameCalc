import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAxios } from "../api/axios";
import LazyImage from "./LazyImage";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface Sketch {
  sketch_id: string;
  image: string;
}

interface PaginatedResponse {
  results: Sketch[];
  next: string | null;
}

const SketchGallery: React.FC<{ userId: string ;}> = ({ userId}) => {
    
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(`${API_BASE_URL}/sketches/user/${userId}/thumbnails/?page=1`);
  const [loading, setLoading] = useState<boolean>(false);
  
  const observerRef = useRef<HTMLDivElement | null>(null);
const axios =useAxios();
  const fetchSketches = async () => {
    if (!nextPageUrl || loading) return;

    setLoading(true);
    try {
      const res = await axios.get<PaginatedResponse>(nextPageUrl);

      setSketches(prev => [...prev, ...res.data.results]);
      setNextPageUrl(res.data.next);
    } catch (err) {
      console.error("Error fetching sketches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && nextPageUrl && !loading) {
        fetchSketches();
      }
    },
    [nextPageUrl, loading]
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
    fetchSketches();
  }, []);


  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {sketches.map((sketch, index) => (
        <div key={index} className="flex flex-col items-center relative">
            <DropList />
          <LazyImage
            src={sketch.image}
            alt={`Sketch ${index}`}
            className="w-full h-40 md:h-60 object-cover rounded shadow"
          />
          <span className="text-xs mt-2 text-gray-600">{sketch.sketch_id}</span>
        </div>
      ))}

      <div ref={observerRef} className="col-span-full text-center text-gray-500 py-4">
        {loading ? "Loading..." : nextPageUrl ? "Scroll to load more..." : "No more sketches"}
      </div>
    </div>
  );
};

export default SketchGallery;



function DropList(){
    const [dropList, setDropList] = useState<boolean>(false);
    return(
        <>

        <div className="text-black absolute text-[16px] top-1 right-1 cursor-pointer z-10" onClick={()=>setDropList(!dropList)}>
            <HiOutlineDotsHorizontal/>
            </div>
{dropList && <ul className="flex flex-col text-black bg-white absolute  top-6 right-1 z-10 border-2 text-[12px]  ">
                <li className="p-2 cursor-pointer hover:bg-gray-50 " >Quotation</li>
                <li className="p-2 border-t cursor-pointer hover:bg-gray-50 ">Delet</li>
            </ul>}
        </>
    )
}