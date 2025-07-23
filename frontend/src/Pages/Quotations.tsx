// pages/Quotations.tsx
import { IoFilter } from "react-icons/io5";
import { useEffect, useState } from "react";
import QuotationFilter from "../components/QuotationFilter";
import { useQuotations } from "../hooks/useQuotations";
import CustomTable from "../components/ui/CustomTable";
import Pagination from "../components/ui/Pagination";

import { useAxios } from "../api/axios";

interface TableColumn {
  key: string;
  header: string;
  render?: (value: any, row: TableData) => React.ReactNode;
}

interface TableData {
  id: number;
  width: number;
  height: number;
  date: string;
  subtype_name: string;
  total_price: number;
}

function Quotations() {
  const [showFilter, setShowFilter] = useState<boolean>(true); // Fixed typo
  const axios = useAxios();
  const [transformedData, setTransformedData] = useState<TableData[]>([]);


  const { 
    quotations, 
    loading, 
    pagination, 
    currentFilters, 
    filter, 
    changePage, 
    changePageSize 
  } = useQuotations();

  // Initialize with default filters
  useEffect(() => {
    filter({
      page: 1,
      pageSize: 20,
      ordering: "-date"
    });
  }, [filter]);

  const columns: TableColumn[] = [
    { key: 'id', header: 'Id' },
    { key: 'width', header: 'Width' },
    { key: 'height', header: 'Height' },
    { key: 'total_price', header: 'Total Price' }, // Fixed casing
    { key: "subtype_name", header: "Type" },
    { key: "date", header: "Date" }
  ];

  useEffect(() => {
  const data = quotations?.map((q) => {
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
  }) || [];

  setTransformedData(data);
}, [quotations]);


  console.log('Quotations data:', quotations);
  console.log('Pagination info:', pagination);

  const handleSelectionChange = (selectedIds: (string | number)[]) => {
    console.log('Selected IDs:', selectedIds);
  };

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    changePageSize(pageSize);
  };

  // Calculate pagination values
  const currentPage = currentFilters.page || 1;
  const pageSize = currentFilters.pageSize || 20;
  const totalResults = pagination?.totalResults || 0;
  const totalPages = Math.ceil(totalResults / pageSize);

   
 
  const DeleteSketchesWithoutQuotation = async (
  quotationIds: (string | number)[]
) => {
  try {
    await axios.delete(`/quotations/bulk-delete/`, {
      data: { quotation_ids: quotationIds },
    });

    console.log("Deleted successfully");

    const updatedData = transformedData.filter(
      (item) => !quotationIds.includes(item.id)
    );

    setTransformedData(updatedData); 
  } catch (error) {
    console.error("Error deleting:", error);
  }
};


      

  return (
    <div className="p-4 w-full flex flex-col gap-4">
      <p className="text-white text-3xl font-medium">My Quotations</p>
      
      <div className="text-white flex items-center justify-between w-full text-2xl">
        <p>Filter</p> {/* Fixed typo */}
        <button 
          onClick={() => setShowFilter(!showFilter)}
          className="hover:text-[#CB3CFF] transition-colors"
          aria-label="Toggle filters"
        >
          <IoFilter />
        </button>
      </div>
      
      <QuotationFilter showFilter={showFilter} filter={filter} />
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-white text-lg">Loading...</div>
        </div>
      ) : (
        <>
          <CustomTable 
            data={transformedData} 
            columns={columns} 
            onSelectionChange={handleSelectionChange}
            selectable={true}
            deleteFunction={DeleteSketchesWithoutQuotation}
          />
          
          {/* Pagination Component */}
          {pagination && totalResults > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
              showPageSizeSelector={true}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          )}
          
          {/* Empty state */}
          {!loading && totalResults === 0 && (
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-400 text-lg">No quotations found</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Quotations;