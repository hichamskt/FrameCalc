import { useEffect, useState } from "react";
import type { NextStep, prevStep, SketchDetail } from "../types/app";
import { useAxios } from "../api/axios";
import DashboardButton from "./ui/DashboardButton";



interface SketchDetailsProps extends NextStep, prevStep {
  sketchDetails?: SketchDetail;
  
}

interface Structers {
    subtype_id: string;
	type: number;
	type_name: string;
	name: string;
	image_url: string;
}

function StructerSubTypes({ 
    prevStep,
  nextStep,
  setSketchDetail,
  sketchDetails
}:SketchDetailsProps) {

const [structureSubType, setStructerSubtype] = useState<Structers[]>([]);

const axios = useAxios();

 useEffect(() => {
  const fetchSketches = async () => {
    if (!sketchDetails?.frame) return;

    try {
      const response = await axios.get(`structure-types/${sketchDetails.frame}/subtypes/`);
      const result = response.data;
      setStructerSubtype(result);
    } catch (error) {
      console.error("Error fetching sketches:", error);
    }
  };

  fetchSketches();
}, [sketchDetails?.frame]);



const handleClick = (id: string) => {
    
      setSketchDetail((prev) => ({
  ...prev!,
  subtype_id: id,
}));

  nextStep();
};






  return (
    <div className="bg-[#000842] text-white p-3 flex flex-col gap-2 min-h-[60%] rounded">
        <p className="text-[12px] text-[#FDB52A]">Select a Structer</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 p-4">
            {
                structureSubType.map((structer)=>(
                    <img src={structer.image_url} alt={structer.name} key={structer.subtype_id} onClick={()=>handleClick(structer.subtype_id)} className="w-full h-28 object-contain rounded-xl shadow-md border-2 cursor-pointer bg-gray-400" />
                ))
            }
        </div>
        <div>
        <DashboardButton text="prev" onclick={prevStep} />
        </div>
    </div>
  )
}

export default StructerSubTypes