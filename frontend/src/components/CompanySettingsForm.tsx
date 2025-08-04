import { useEffect, useState } from "react";
import { useUserCompany } from "../hooks/company/useUserCompany"
import SettingsInput from "./ui/SettingsInput"
import { Building2 } from 'lucide-react';
import { useSupplieType } from "../hooks/useSupplieType";
import { X, ChevronDown } from 'lucide-react';

interface SupplyType {
  id: number;
  name: string;
}
function CompanySettingsForm() {
    const {data} = useUserCompany();
    const [name,setName]=useState<string>(data?.name || "");
    const {supplieType} =useSupplieType();
const [options, setOptions] = useState<SupplyType[]>([]);
const [selectedIds,setSelectedIds]= useState<number[]>([]);

useEffect(()=>{

   if (supplieType) {
          const formattedOptions = supplieType.map(
            (type: { id: number; name: string }) => ({
              id: type.id,
              name: type.name,
            })
          ); 
        setOptions(formattedOptions)
        }
},[supplieType])

    
console.log('finalle ids', selectedIds)
    
  return (
        <div className="bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F] flex flex-col gap-9 lg:w-[60%] w-full">
        <SettingsInput label={"Company Name"} placeholder="Enter a Company Name" icon={Building2}  value={name} onChange={()=>setName}  />
        <SupplyTypesSelector  SupplyType={options}  onSelectionChange={setSelectedIds} />
    </div>
  )
}

export default CompanySettingsForm







interface SupplyTypesSelectorProps {
  onSelectionChange?: (selectedIds: number[]) => void;
  SupplyType:SupplyType[];

}

const SupplyTypesSelector: React.FC<SupplyTypesSelectorProps> = ({ onSelectionChange, SupplyType }) => {
  const [selectedSupplies, setSelectedSupplies] = useState<SupplyType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const supplyTypes: SupplyType[] = SupplyType;


  const handleSelectSupply = (supply: SupplyType): void => {
    if (!selectedSupplies.some((s: SupplyType) => s.id === supply.id)) {
      const newSelection = [...selectedSupplies, supply];
      setSelectedSupplies(newSelection);
      
     
      const selectedIds = newSelection.map((s: SupplyType) => s.id);
      onSelectionChange?.(selectedIds);
      console.log('Selected Supply IDs:', selectedIds); 
    }
    setIsOpen(false);
  };

  const handleRemoveSupply = (supplyToRemove: SupplyType): void => {
    const newSelection = selectedSupplies.filter((supply: SupplyType) => supply.id !== supplyToRemove.id);
    setSelectedSupplies(newSelection);
    
   
    const selectedIds = newSelection.map((s: SupplyType) => s.id);
    onSelectionChange?.(selectedIds);
    console.log('Selected Supply IDs:', selectedIds); 
  };

  const availableSupplies: SupplyType[] = supplyTypes.filter((supply: SupplyType) => 
    !selectedSupplies.some((selected: SupplyType) => selected.id === supply.id)
  );

  return (
    <div className="w-full mx-auto p-6 bg-[#343B4F]  rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Select Supply Types</h2>
      
     
      <div className="relative mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <span className="text-gray-600">
            {availableSupplies.length > 0 ? 'Choose supply types...' : 'All types selected'}
          </span>
          <ChevronDown 
            className={`h-5 w-5 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
       
        {isOpen && availableSupplies.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {availableSupplies.map((supply: SupplyType) => (
              <button
                key={supply.id}
                onClick={() => handleSelectSupply(supply)}
                className="w-full p-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b text-black cursor-pointer border-gray-100 last:border-b-0"
              >
                {supply.name}
              </button>
            ))}
          </div>
        )}
      </div>

     
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Selected Supply Types ({selectedSupplies.length})
        </h3>
        
        {selectedSupplies.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No supply types selected</p>
        ) : (
          <div className="space-y-2">
            {selectedSupplies.map((supply: SupplyType) => (
              <div
                key={supply.id}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div>
                  <span className="text-blue-800 font-medium">{supply.name}</span>
                  <span className="text-blue-600 text-xs ml-2">(ID: {supply.id})</span>
                </div>
                <button
                  onClick={() => handleRemoveSupply(supply)}
                  className="text-blue-600 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-colors"
                  title="Remove supply type"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    
      {selectedSupplies.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Total selected:</strong> {selectedSupplies.length} supply type{selectedSupplies.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

