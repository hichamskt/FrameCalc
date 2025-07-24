
import { FaArrowRightLong } from "react-icons/fa6";
import AddPost from "../components/AddPost";
import { useUser } from "../hooks/useUser";
import { useState } from "react";

function  Community() {

  const {user , userLoading} = useUser();
  const [showAddPost,setShowAddpost]=useState<boolean>(false);

  return (

    <div className="container p-2">
      <div className="text-white flex items-center justify-between w-full">
      <p className="text-3xl">Community</p>
      <button className="flex items-center px-2 py-2 gap-2   rounded cursor-pointer"   style={{
            background: "linear-gradient(90deg, #CB3CFF 20%, #7F25FB 68%)",
          }}
          onClick={()=>setShowAddpost(true)}
          >Post 
        <FaArrowRightLong />
      </button>
      </div>
      
     {showAddPost && <AddPost user={user} userLoading={userLoading} setShowAddpost={setShowAddpost} />}

    </div>
  )
}

export default Community