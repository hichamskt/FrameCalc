import { useCallback, useEffect, useRef, useState } from "react";
import { useSubtypes } from "../hooks/useSubtypes";
import { useQuotations } from "../hooks/useQuotations";
import type { QuotationFilters } from "../types/app";
import SimpleFilterSelect from "./ui/SimpleFilterSelect";
import NumberInput from "./ui/NumberInput";
import { FaMinusCircle } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { RiResetLeftFill } from "react-icons/ri";


type FilterProps = {
  showFillter: boolean;
};


function QuotationFilter({ showFillter }: FilterProps) {


 const [showAddFilters, setshowAddFilter] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [widthMin, setWidthMin] = useState<number>(0);
  const [widthMax, setWidthMax] = useState<number>(0);
  const [heightMax, setHeightMax] = useState<number>(0);
  const [heightMin, setHeightMin] = useState<number>(0);
const [dateFiltter, setDateFiltter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>(
    {
      Subtype: false,
      Price: false,
      Width: false,
      Height: false,
      Date: false,
    }
  );
  
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setshowAddFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




 
  const { quotations, loading, error, filter } = useQuotations(); 
  const {subtypes} = useSubtypes();
  const [filters, setFilters] = useState<QuotationFilters>({});
const [options, setOptions] = useState<{ label: string; value: string }[]>([]);




useEffect(() => {
  const newOptions = subtypes.map((subtype: {  name: string }) => ({
    label: subtype.name,
    value: subtype.name,
  }));

  setOptions(newOptions); 
}, [subtypes]);



  useEffect(() => {
    const initialFilters: QuotationFilters = {
      page: 1,
      pageSize: 20,
      ordering: '-date'
    };
    filter(initialFilters);
  }, []); 


  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      filter(filters);
    }
  }, [filters, filter]);


   const handleFilterChange = useCallback((newFilters: Partial<QuotationFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      page: 1 
    }));
  }, []);


 useEffect(() => {
  const updates: Partial<QuotationFilters> = {};

  if (priceFilter.min && priceFilter.min > 0) {
    updates.priceMin = priceFilter.min;
  }

  if (priceFilter.max && priceFilter.max > 0) {
    updates.priceMax = priceFilter.max;
  }
  if (widthMax && widthMax > 0) {
    updates.widthMax = widthMax;
  }
  if (widthMin && widthMin > 0) {
    updates.widthMin = widthMin;
  }
  if (heightMin && heightMin > 0) {
    updates.heightMin = heightMin;
  }
  if (heightMax && heightMax > 0) {
    updates.heightMax = heightMax;
  }
  if (dateFiltter) {
   const { dateFrom, dateTo } =   getDateRange(dateFiltter);

    updates.dateFrom = dateFrom;
    updates.dateTo=dateTo;
  }
  if (selectedOption) {
  
    updates.subtype =selectedOption ;
  }


  if (Object.keys(updates).length > 0) {
    handleFilterChange(updates);
  }
}, [handleFilterChange, priceFilter , widthMax , widthMin , dateFiltter , heightMin , heightMax , selectedOption ]);
  

 

  const getDateRange = (filterValue: string): { dateFrom: string; dateTo: string } => {
  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now); 

  switch (filterValue) {
    case "1d":
      startDate.setDate(now.getDate() - 1);
      break;
    case "1w":
      startDate.setDate(now.getDate() - 7);
      break;
    case "1m":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "6m":
      startDate.setMonth(now.getMonth() - 6);
      break;
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      break;
  }

  const toISOStringDate = (date: Date) => date.toISOString().split("T")[0];

  return {
    dateFrom: toISOStringDate(startDate),
    dateTo: toISOStringDate(endDate),
  };
};


  const filterOptions = [
    { label: "Last Day", value: "1d" },
    { label: "Last Week", value: "1w" },
    { label: "Last Month", value: "1m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "1y" },
  ];

  const toggleFilter = (filter: string) => {
    setVisibleFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleReste =  () =>{
    setFilters({});
    filter({}); 
    setWidthMax(0);
    setWidthMin(0);
    setDateFiltter('');
    setHeightMin(0);
    setHeightMax(0);
    setPriceFilter({min:0,max:0});
    setSelectedOption("");

  }

  return (
    <>
      {showFillter && (
        <div className="flex sm:items-center sm:gap-1 gap-6 mt-6 flex-wrap flex-col sm:flex-row ">
          {visibleFilters.Width && (
            <div className="flex items-center gap-2">

            <NumberInput
              value={widthMin}
              onChange={(N) => setWidthMin(N)}
              placeholder="Enter width"
              min={0}
              label="Min Width"
              />
            <NumberInput
              value={widthMax}
              onChange={(N) => setWidthMax(N)}
              placeholder="Enter width"
              min={0}
              label="Max Width"
              />
              </div>
          )}

          {visibleFilters.Height && (
            <div className="flex items-center gap-2">

            <NumberInput
              value={heightMin}
              onChange={(N) => setHeightMin(N)}
              placeholder="Enter height"
              min={0}
              label="Min Height"
              />
            <NumberInput
              value={heightMax}
              onChange={(N) => setHeightMax(N)}
              placeholder="Enter height"
              min={0}
              label="Max Height"
              />
              </div>
          )}
          {visibleFilters.Price && (
            <div className="flex items-center gap-1 ">
              <NumberInput
                value={priceFilter.min}
                onChange={(number) =>
                  setPriceFilter((prev) => ({
                    ...prev,
                    min: Number(number),
                  }))
                }

                


                placeholder="Enter min"
                min={0}
                label="min"
              />
              <NumberInput
                value={priceFilter.max}
                onChange={(number) =>
                  setPriceFilter((prev) => ({
                    ...prev,
                    max: Number(number),
                  }))
                }
                placeholder="Enter max"
                min={priceFilter.min}
                label="max"
              />
            </div>
          )}
          {visibleFilters.Subtype && (
            <SimpleFilterSelect
              options={options}
              value={selectedOption}
              onChange={setSelectedOption}
              placeholder="Subtype Fillter"
            />
          )}
          {visibleFilters.Date && (
            <SimpleFilterSelect
              options={filterOptions}
              value={dateFiltter}
              onChange={setDateFiltter}
              placeholder="Date Fillter"
            />
          )}
          <div className="relative w-fit">
            <button
              onClick={() => setshowAddFilter(!showAddFilters)}
              className="bg-[#CB3CFF] text-white cursor-pointer px-3 py-2 rounded hover:bg-[#cb3cffe5] transition-colors"
            >
              Add Filter
            </button>

            {/* Dropdown */}
            <ul
              ref={menuRef}
              className={`text-white text-[16px] flex flex-col gap-1 absolute top-[50px] right-[-100px] bg-[#343B4F] w-[200px] rounded transition-all duration-300 ease-in-out transform ${
                showAddFilters
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <p className="p-2">Filters</p>
              {["Subtype", "Price", "Width", "Height", "Date"].map((label) => (
                <li
                  key={label}
                  className="flex p-3 items-center justify-between hover:bg-[#444b61] transition-colors"
                >
                  {label}
                  <span
                    className="hover:text-[#cb3cffe5] cursor-pointer transition-colors"
                    onClick={() => toggleFilter(label)}
                  >
                    {visibleFilters[label] ? (
                      <FaMinusCircle />
                    ) : (
                      <FaCirclePlus />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-white text-3xl cursor-pointer" onClick={() =>  handleReste() }>

          <RiResetLeftFill/>
          </div>
        </div>
      )}
    </>
  );
}

export default QuotationFilter



