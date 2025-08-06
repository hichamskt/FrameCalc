import Profiles from "../components/Profiles"


function AlumProfile() {


  return (

    
    <div className="container  mx-auto p-2 text-white flex flex-col gap-5 overflow-hidden">
        <p className="text-3xl">Alum Profiles</p>
        <div className="bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F] flex flex-col gap-9 w-full">
            <ul className="flex gap-3 items-center">
                <li>Profiles</li>
                <li>Alum bars</li>
            </ul>
            <Profiles  />

        </div>

    </div>
  )
}

export default AlumProfile