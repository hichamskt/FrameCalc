import type { NextStep, prevStep, SketchDetail } from "../types/app";
import SketchForm from "./SketchForm"

interface SketchDetailsProps extends NextStep, prevStep {
  sketchDetails?: SketchDetail;
  
 
  
}



function SketchSuppliers({ sketchDetails , setSketchDetail , nextStep , prevStep }:SketchDetailsProps) {
  return (
    <div className="bg-[#000842] text-white p-3 flex flex-col gap-2 min-h-[60%] rounded">
      <div className="lg:w-[50%]">
        <SketchForm sketchDetails={sketchDetails} setSketchDetail={setSketchDetail} nextStep={nextStep} prevStep={prevStep} showbtns={true} />
      </div>
        
        </div>
  )
}

export default SketchSuppliers