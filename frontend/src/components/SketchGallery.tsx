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
  const DeletSketch = async (id:string) => {
    
    try {
      await axios.delete(`sketches/${id}/`);
       const filteredSketches = sketches.filter(sketch => sketch.sketch_id !== id);
        setSketches(filteredSketches);


     console.log('deleted successfully');
    } catch (err) {
      console.error("Error fetching sketches:", err);
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
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative">
      {sketches.map((sketch, index) => (
        <div key={index} className="flex flex-col items-center relative group">
            <DropList id={sketch.sketch_id} onDelete={DeletSketch} />
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





interface DropListProps {
  onDelete: (id: string) => void;
  id: string;
}

function DropList({ onDelete, id }: DropListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteConfirm = () => {
    onDelete(id);
    setShowConfirm(false);
    setIsOpen(false);
  };

  return (
    <div className="relative z-5 w-full  hidden group-hover:block" ref={menuRef}>
      <div
        className="text-black absolute text-[16px] top-1 right-1 cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        <HiOutlineDotsHorizontal />
      </div>

      {isOpen && (
        <ul className="flex flex-col bg-white border rounded shadow-md text-black text-sm absolute top-6 right-1">
          <li className="p-2 cursor-pointer hover:bg-gray-100">Quotation</li>
          <li
            className="p-2 border-t cursor-pointer hover:bg-gray-100 text-red-600"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </li>
        </ul>
      )}

      {/* Delete Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#370f45b3] bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-72 z-50">
            <p className="mb-4 text-center text-sm">Are you sure you want to delete this?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
