import { useEffect, useState } from "react";
import type { NextStep, prevStep, SketchDetail } from "../types/app";
import SimpleSelect from "./ui/SimpleSelect";
import SketchInput from "./ui/SketchInput";
import DashboardButton from "./ui/DashboardButton";
import { useAxios } from "../api/axios";
import { validateSketchStep } from "../utils/validations/validateSketchDetails";

interface Option {
  value: string;
  label: string;
  options: Option[];
}

interface SketchDetailsProps extends NextStep, prevStep {
  sketchDetails?: SketchDetail;
  
}

function SketchDetails({
  prevStep,
  nextStep,
  setSketchDetail,
  sketchDetails,
}: SketchDetailsProps) {
  
  const axios = useAxios();
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
    const [errors, setErrors] = useState<SketchDetail>({
      width:"",
      height:"",
      frame:"",
      subtype_id:"",
      company_id:"",
      profile_id:"",
      subtype_requirements:"",
      glassrequirement_id:"",
      accessoriesrequirement_id:"",
      quotation_id:"",
      sketch_id:"",
      refrech:false,
    });
  
    



  useEffect(() => {
    const fetchSketches = async () => {
      try {
        const response = await axios.get("/structure-types/");
        const result = response.data;
        console.log("result:", result);
        if (result) {
          const formattedOptions = result.map(
            (item: { type_id: number; name: string }) => ({
              value: item.type_id.toString(),
              label: item.name,
            })
          );

          setOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching sketches:", error);
      }
    };

    fetchSketches();
  }, []);

  if (!sketchDetails) {
    return <div>Loading...</div>; 
  }

const handleSubmit = () => {
  const currentFields: (keyof SketchDetail)[] = ["width","height","frame"]; 

  const { errors: newErrors, isValid } = validateSketchStep(sketchDetails, currentFields);
  setErrors((prev) => ({ ...prev, ...newErrors }));

  if (isValid) {
    nextStep();
   updateDimensions();
  }
};


const updateDimensions = async () => {
  try {
    await axios.patch(`/sketches/${sketchDetails.sketch_id}/`, {
      width: sketchDetails.width,
      height: sketchDetails.height,
    });
  } catch (error) {
    console.error("Error updating dimensions:", error);
  }
};





  return (
    <div className="bg-[#000842] text-white p-3 flex flex-col gap-2 min-h-[60%] ">
      <p>Sketch Details</p>
      <p className="text-[12px] text-[#FDB52A]">
        Please update the dimensions if they're not accurate.
      </p>
      <SketchInput
        label="width"
        placeholder="width"
        name="width"
        type="number"
        setValues={setSketchDetail}
        values={sketchDetails}
        errors={errors}
        />
      <SketchInput
        label="height"
        placeholder="height"
        name="height"
        type="number"
        setValues={setSketchDetail}
        values={sketchDetails}
        errors={errors}
      />
      <p>Frame</p>
<div className="lg:w-[50%]">

      <SimpleSelect
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Choose Frame"
        setSketchDetails={setSketchDetail}
        errors={errors}
        name="frame"
        />
        </div>
        
        

      <div className="lg:w-[50%] w-full flex items-center justify-between">
        <DashboardButton text="Prev" onclick={prevStep} />
        <DashboardButton text="Next" onclick={handleSubmit} />
      </div>
    </div>
  );
}

export default SketchDetails;
