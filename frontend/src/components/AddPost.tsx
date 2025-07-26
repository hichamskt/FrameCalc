import { RxCross2 } from "react-icons/rx";
import type { UserProfile } from "../types/app";
import { useEffect, useRef, useState } from "react";
import person from "../assets/person.jpg";
import ProfileLoader from "./ui/ProfileLoader";
import vector from "../assets/Vector.png";
import { useCreatePost } from "../hooks/posts/useCreatePost";

import Loading from "./ui/Loading";
import toast from "react-hot-toast";
interface AddPostType {
  userLoading: boolean;
  user?: UserProfile | null;
  setShowAddpost:   React.Dispatch<React.SetStateAction<boolean>>;
}

function AddPost({ user, userLoading,setShowAddpost }: AddPostType) {
  const [imgSrc, setImgSrc] = useState(user?.profile_image || person);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const postRef = useRef<HTMLInputElement | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
const [file, setFile] = useState<File | undefined>(undefined);

  const [text,setText]=useState<string>("");
const { createNewPost, loading, error } = useCreatePost();
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

 

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (postRef.current && !postRef.current.contains(event.target as Node)) {
          setShowAddpost(false)
          
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setImageURL(url);
    }
  };

  useEffect(() => {
    setImgSrc(user?.profile_image || person);
  }, [user]);


  

  const handlePost = async () => {
    if(!text) return
    try {
      await createNewPost({ text, image:file });
      
      setText("");
      setImageURL("");
      if(!loading && !error){
        toast.success("post  created successfully!");
        setShowAddpost(false);

      }
      if(error){
        toast.error(error)
      }
    } catch {
      console.log(error)
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#370f45b0] bg-opacity-30 z-50">
      {loading? <Loading /> : <div className="bg-white p-6 rounded-lg shadow-md w-200 z-50 relative"  ref={postRef}>
        <div className="absolute right-2 top-2 cursor-pointer text-gray-600 hover:text-black transition-colors" onClick={()=>setShowAddpost(false)}>
          <RxCross2 />
        </div>
        <div className="bg-[#077ab81b] w-full min-h-[300px] rounded-lg  p-6">
          <div className="flex gap-6 items-center">
            <div>
              {userLoading ? (
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-400">
                  <ProfileLoader />
                </div>
              ) : (
                <img
                  src={imgSrc}
                  alt="profile"
                  className="sm:w-16 sm:h-16 w-12 h-12 rounded-full object-cover"
                  onError={() => setImgSrc(person)}
                />
              )}
            </div>
            <div className="grow-1 min-h-20">
              <input
                type="text"
                placeholder="What is on you mind "
                className="w-full min-h-20 outline-none sm:text-2xl text-[16px]"
                value={text}
                onChange={(e)=>setText(e.target.value)}
              />
            </div>
          </div>
         {imageURL && <div className=" flex justify-center  ">
            <div className=" relative w-fit">
             <span className="absolute top-0 right-0 cursor-pointer " onClick={()=>setImageURL("")}><RxCross2 /></span>
            <img src={imageURL} alt="post" className="max-h-[300px]" />
            </div>
          </div>}
        </div>
        <div className="flex gap-3 items-center justify-end mt-3">
          <div
            className="flex items-center gap-0.5 cursor-pointer"
            onClick={handleButtonClick}
          >
            <img src={vector} alt="image" />
            <p className="font-medium ">Image</p>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button className="px-4 py-2 hover:bg-green-600 rounded cursor-pointer bg-green-500 transition-colors" onClick={()=>handlePost()}>
            Post
          </button>
        </div>
      </div>}
    </div>
  );
}

export default AddPost;
