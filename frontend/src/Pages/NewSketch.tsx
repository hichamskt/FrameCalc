import { useState } from "react";
import MediaUpdate from "../components/MediaUpdate";
import type { SketchDetail } from "../types/app";
import SketchDetails from "../components/SketchDetails";
import StructerSubTypes from "../components/StructerSubTypes";
import SketchSuppliers from "../components/SketchSuppliers";
import FinalQuotation from "../components/FinalQuotation";


function NewSketch() {

  return (
    <div className=" text-white flex flex-col gap-6 p-4  w-full ">
    <TopSection />
    <MultiStep />
    </div>
  )
}

export default NewSketch

function TopSection(){
    return(
        <div className="flex flex-col gap-1">
            <p className="lg:text-3xl md:text-2xl sm:text-[16px] font-medium">Welcome back, John</p>
            <p className="lg:text-2xl md:text-[16px] sm:text-[12px] text-[12px] text-[#AEB9E1]">Turn Your Sketches Into Instant Aluminum & Glass Quotations</p>
        </div>
    )
}





const MultiStep = () => {

  const [step, setStep] = useState(1);
  const [sketchDetails, setSketchDetail] = useState<SketchDetail>();
 


  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  console.log(sketchDetails)

  switch (step) {
    case 1:
      return (
        <MediaUpdate nextStep={nextStep}  setSketchDetail={setSketchDetail}   />
      );
    case 2:
      return (
       <SketchDetails  prevStep={prevStep} setSketchDetail={setSketchDetail} sketchDetails={sketchDetails} nextStep={nextStep}  />
      );
    case 3:
      return (
        <StructerSubTypes prevStep={prevStep} setSketchDetail={setSketchDetail} sketchDetails={sketchDetails} nextStep={nextStep}  />
      );
    case 4:
      return (
        <SketchSuppliers  setSketchDetail={setSketchDetail} sketchDetails={sketchDetails} nextStep={nextStep} prevStep={prevStep}   />
      )
      ;
    case 5:
      return (
        <FinalQuotation  setSketchDetail={setSketchDetail} sketchDetails={sketchDetails} nextStep={nextStep}     />
      );
   
  }
};
