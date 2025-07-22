import { IoFilter } from "react-icons/io5";

import { useEffect, useState } from "react";

import QuotationFilter from "../components/QuotationFilter";
import { useQuotations } from "../hooks/useQuotations";
import CustomTable from "../components/ui/CustomTable";
import { Quotation } from "../types/app";


interface TableColumn {
  key: string;
  header: string;
  render?: (value: any, row: TableData) => React.ReactNode;
}

function Quotations() {
  const [showFillter, setShowFillters ] = useState<boolean>(true);
const [data,setData]= useState<Quotation[]>([]);

useEffect(() => {
  filter({}); // pass empty or default filters
}, []);
  const {quotations , loading , filter} = useQuotations();

   const columns: TableColumn[] = [
    { key: 'id', header: 'Id' },
    { key: 'width', header: 'Width' },
    { key: 'height', header: 'Height' },
    { key: 'total_price', header: 'total_price' },
    {key:"subtype_name", header:"type"},
    {key:"date", header:"date"}
  
  ]
 



const transformedData = quotations?.map((q) => {
  const [width, height] = q.sketch_dimensions
    .split('x')
    .map((dim) => parseFloat(dim.trim()));

  const formattedDate = new Date(q.created_at).toLocaleDateString('fr-FR');

  return {
    id: q.quotation_id,
    width,
    height,
    date: formattedDate,
    subtype_name: q.subtype_name,
    total_price: q.total_price,
  };
});






  // console.log('qot',transformedData)
  console.log('qot2',quotations)
  const handleSelectionChange = (selectedIds: (string | number)[]) => {
    console.log('Selected IDs:', selectedIds);
  };






 

  return (
    <div className="p-4 w-full">
      <p className="text-white text-3xl font-medium">My Quotation</p>
      <div className="text-white flex items-center justify-between w-full text-2xl">
        <p>fillter</p>
        <span onClick={() => setShowFillters(!showFillter)}>
          {" "}
          <IoFilter />
        </span>
      </div>
      <QuotationFilter showFillter={showFillter} filter={filter} />
     { loading ? "loading" :  <CustomTable data={transformedData} columns={columns} onSelectionChange={handleSelectionChange}
         selectable={true}  />} 
    </div>
  );
}

export default Quotations;



