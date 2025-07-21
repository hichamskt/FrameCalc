import SketchGallery from "../components/SketchGallery"
import { useAuth } from "../context/AuthContext"

function Sketches() {
    const {user} = useAuth();
  return (
    <div className="w-full container">
        {
         user?.id &&    <SketchGallery  userId={user?.id} />
        }
    </div>
  )
}

export default Sketches