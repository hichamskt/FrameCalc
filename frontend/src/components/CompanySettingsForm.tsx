import { useState } from "react";
import { useUserCompany } from "../hooks/company/useUserCompany"
import SettingsInput from "./ui/SettingsInput"
import { Building2 } from 'lucide-react';
import { useSupplieType } from "../hooks/useSupplieType";


function CompanySettingsForm() {
    const {data} = useUserCompany();
    const [name,setName]=useState<string>(data?.name || "");
    const {supplieType} =useSupplieType();


    console.log("suppliertyp",supplieType)
  return (
        <div className="bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F] flex flex-col gap-9 lg:w-[60%] w-full">
        <SettingsInput label={"Company Name"} placeholder="Enter a Company Name" icon={Building2}  value={name} onChange={()=>setName}  />
        
    </div>
  )
}

export default CompanySettingsForm