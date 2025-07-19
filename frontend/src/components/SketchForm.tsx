import { useEffect, useState } from "react";
import { useAxios } from "../api/axios";
import type { NextStep, SketchDetail } from "../types/app";
import SimpleSelect from "./ui/SimpleSelect";
import DashboardButton from "./ui/DashboardButton";
import { validateSketchStep } from "../utils/validations/validateSketchDetails";

interface Company {
  value: string;
  label: string;
}

type NavigationSteps = {
  prevStep?: () => void;
  showbtns:boolean;
};

interface SketchFormProps extends NextStep , NavigationSteps {
  sketchDetails?: SketchDetail;
  setSketchDetail: React.Dispatch<React.SetStateAction<SketchDetail | undefined>>;
  

}

function SketchForm({ sketchDetails, setSketchDetail, nextStep , prevStep , showbtns}: SketchFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [glasseCompanies, setGlasseCompanies] = useState<Company[]>([]);
  const [accessoriesCompanies, setAccessoriesCompanies] = useState<Company[]>(
    []
  );
  const [profiles, setProfiles] = useState<Company[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string>("");
  const [selectedextraValue, setSelectedextraValue] = useState<string>("");
  const [selectedextraValues, setSelectedextraValues] = useState<string>("");

  const axios = useAxios();

  useEffect(() => {
    const fetchSketches = async () => {
      if (!sketchDetails?.subtype_id) return;

      try {
        const response = await axios.get(
          `subtypes/${sketchDetails.subtype_id}/companies/`
        );
        const result = response.data;

        const filteredCompanies = result.map(
          (company: { company_id: string; name: string }) => ({
            value: company.company_id,
            label: company.name,
          })
        );
        setCompanies(filteredCompanies);
      } catch (error) {
        console.error("Error fetching sketches:", error);
      }
    };

    fetchSketches();
  }, [sketchDetails?.subtype_id]);

  const [errors, setErrors] = useState<SketchDetail>({
    width: "",
    height: "",
    frame: "",
    subtype_id: "",
    company_id: "",
    profile_id: "",
    subtype_requirements: "",
    glassrequirement_id: "",
    accessoriesrequirement_id: "",
    sketch_id:"",
    quotation_id:"",
    refrech:false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!sketchDetails?.company_id || !sketchDetails?.subtype_id) return;

      try {
        const response = await axios.get(
          `/subtypes/${sketchDetails.subtype_id}/companies/${sketchDetails.company_id}/profiles/`
        );
        const result = response.data;
        const newprofiles = result.map(
          (profile: { name: string; profile_id: string; quality: string }) => ({
            value: profile.profile_id,
            label: `${profile.name} | Quality: ${profile.quality}`,
          })
        );
        setProfiles(newprofiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfile();
  }, [sketchDetails?.company_id]);

  useEffect(() => {
    const fetchrequiremntid = async () => {
      if (!sketchDetails?.profile_id) return;

      try {
        const response = await axios.get(
          `/profiles/${sketchDetails.profile_id}/subtype-requirements/`
        );
        const result = response.data;

        {
          setSketchDetail((prev) => ({
            ...prev!,
            ["subtype_requirements"]: result[0].requirement_id,
          }));
        }
      } catch (error) {
        console.error("Error fetching requirements:", error);
      }
    };

    fetchrequiremntid();
  }, [sketchDetails?.profile_id]);

  useEffect(() => {
    const glassRequirements = async () => {
      if (!sketchDetails?.subtype_id) return;

      try {
        const response = await axios.get(
          `structure-subtypes/${sketchDetails.subtype_id}/glass-requirements/`
        );
        const result = response.data;

        const newGlasseCompanies = result.map(
          (company: { glassrequirement_id: string; company_name: string }) => ({
            value: company.glassrequirement_id,
            label: company.company_name,
          })
        );
        setGlasseCompanies(newGlasseCompanies);
      } catch (error) {
        console.error("Error fetching sketches:", error);
      }
    };
    const accessoriesRequirements = async () => {
      if (!sketchDetails?.subtype_id) return;

      try {
        const response = await axios.get(
          `structure-subtypes/${sketchDetails.subtype_id}/accessories-requirements/`
        );
        const result = response.data;

        const newGlasseCompanies = result.map(
          (company: {
            accessoriesrequirement_id: string;
            company_name: string;
          }) => ({
            value: company.accessoriesrequirement_id,
            label: company.company_name,
          })
        );
        setAccessoriesCompanies(newGlasseCompanies);
      } catch (error) {
        console.error("Error fetching sketches:", error);
      }
    };

    glassRequirements();
    accessoriesRequirements();
  }, [sketchDetails?.subtype_id]);


  const createQuotation = async () => {
  try {
    const payload = {
        sketch_id: sketchDetails?.sketch_id,
        accessoriesrequirement_id: sketchDetails?.accessoriesrequirement_id,
        glassrequirement_id: sketchDetails?.glassrequirement_id,
        requirement_id: sketchDetails?.subtype_requirements
    };

    const response = await axios.post('/quotations/create/', payload);
    const result = response.data;

    setSketchDetail((prev) => ({
            ...prev!,
            ["quotation_id"]: result.quotation_id,
          }));

    console.log("Quotation created successfully:", result);
  } catch (error) {
    console.error("Error creating quotation:", error);
  }
};

const handleSubmit = () => {
  const currentFields: (keyof SketchDetail)[] = ["accessoriesrequirement_id","glassrequirement_id","company_id","profile_id"]; 
  if (!sketchDetails) return;
  const { errors: newErrors, isValid } = validateSketchStep(sketchDetails, currentFields);
  setErrors((prev) => ({ ...prev, ...newErrors }));

  if (isValid) {
     createQuotation();
    nextStep();
  }
};


const  updateQuotation = async () => {
  try {
    const payload = {
        sketch_id: sketchDetails?.sketch_id,
        accessoriesrequirement_id: sketchDetails?.accessoriesrequirement_id,
        glassrequirement_id: sketchDetails?.glassrequirement_id,
        requirement_id: sketchDetails?.subtype_requirements
    };

    const response = await axios.patch(`/quotations/${sketchDetails?.quotation_id}/`, payload);
    const result = response.data;
    const newrefresh = sketchDetails?.refrech;

    setSketchDetail((prev) => ({
            ...prev!,
            ["refrech"]: !newrefresh,
          }));
    
    console.log("Quotation update successfully:", result);
  } catch (error) {
    console.error("Error creating quotation:", error);
  }
};

const handleUpdate = () => {
  const currentFields: (keyof SketchDetail)[] = ["accessoriesrequirement_id","glassrequirement_id","company_id","profile_id"]; 
  if (!sketchDetails) return;
  const { errors: newErrors, isValid } = validateSketchStep(sketchDetails, currentFields);
  setErrors((prev) => ({ ...prev, ...newErrors }));

  if (isValid) {
     updateQuotation();
    
  }
};




  return (
    <div className="flex flex-col gap-2   w-full">
      <p>Alum suppliers</p>
      <SimpleSelect
        options={companies}
        value={selectedValue}
        setSketchDetails={setSketchDetail}
        onChange={setSelectedValue}
        errors={errors}
        name="company_id"
        placeholder="select a supplier"
      />
      {profiles && (
        <div className="flex flex-col gap-2">
          <p>Alum Profile</p>
          <SimpleSelect
            options={profiles}
            value={selectedValues}
            setSketchDetails={setSketchDetail}
            onChange={setSelectedValues}
            errors={errors}
            name="profile_id"
            placeholder="select a Profile"
          />
        </div>
      )}

      {glasseCompanies && (
        <div className="flex flex-col gap-2">
          <p>Glasse Suppliers</p>
          <SimpleSelect
            options={glasseCompanies}
            value={selectedextraValue}
            setSketchDetails={setSketchDetail}
            onChange={setSelectedextraValue}
            errors={errors}
            name="glassrequirement_id"
            placeholder="Select A Supplier"
          />
        </div>
      )}
      {accessoriesCompanies && (
        <div className="flex flex-col gap-2">
          <p>Accessories Suppliers</p>
          <SimpleSelect
            options={accessoriesCompanies}
            value={selectedextraValues}
            setSketchDetails={setSketchDetail}
            onChange={setSelectedextraValues}
            errors={errors}
            name="accessoriesrequirement_id"
            placeholder="Select A Supplier"
          />
        </div>
      )}
     { ! showbtns && <div className="">
        <DashboardButton text="Update" onclick={handleUpdate} />
      </div>}
     { showbtns && <div className="flex justify-between items-center">
        <DashboardButton text="Prev" onclick={prevStep} />
        <DashboardButton text="Next" onclick={handleSubmit} />
      </div>}
    </div>
  );
}

export default SketchForm;
