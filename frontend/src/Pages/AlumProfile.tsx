import { useState } from "react";
import Profiles from "../components/Profiles"
import AlumsBars from "../components/AlumsBars";


function AlumProfile() {
const [step,setStep]=useState(1);


  return (

    
    <div className="container  mx-auto p-2 text-white flex flex-col gap-5 overflow-hidden">
        <p className="text-3xl">Alum Profiles</p>
        <div className="bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F] flex flex-col gap-9 w-full">
            <ul className="flex gap-3 items-center">
                <li className={`${step===1 && "border-b-2 border-white" } cursor-pointer`} onClick={()=>setStep(1)}>Profiles</li>
                <li className={`${step===2 && "border-b-2 border-white" } cursor-pointer`} onClick={()=>setStep(2)}>Alum bars</li>
            </ul>
           {step===1 ? <Profiles  /> : <AlumsBars />}

        </div>

    </div>
  )
}

export default AlumProfile