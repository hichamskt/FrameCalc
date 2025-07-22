import { IoFilter } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { FaMinusCircle } from "react-icons/fa";


function Quotations() {
    const [showFillter,setShowFillters]=useState<boolean>(true);



  return (
    <div className="p-4 w-full">
      <p className="text-white text-3xl font-medium">My Quotation</p>
      <div className="text-white flex items-center justify-between w-full text-2xl">
        <p>fillter</p>
       <span onClick={()=>setShowFillters(!showFillter)}> <IoFilter /></span>
      </div>
      <Filter showFillter={showFillter} />
    </div>
  );
}

export default Quotations;

type FilterProps = {
    showFillter:boolean;
}

function Filter({showFillter}:FilterProps) {
  const [showAddFilters, setshowAddFilter] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

    const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({
  Subtype: false,
  Price: false,
  Width: false,
  Height: false,
  Date: false,
});
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
  



  const [dateFiltter, setDateFiltter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });

  const options = [
    { label: "Price", value: "price" },
    { label: "Width", value: "width" },
    { label: "Height", value: "height" },
    { label: "Date", value: "date" },
  ];

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


  return (
    <>
   {showFillter &&  <div className="flex sm:items-center sm:gap-1 gap-6 mt-6 flex-wrap flex-col sm:flex-row ">
      {visibleFilters.Width && (
        <NumberInput
        value={width}
        onChange={() => setWidth}
        placeholder="Enter width"
        min={0}
          label="Width"
          />
      )}
      {visibleFilters.Height && (
        <NumberInput
        value={height}
          onChange={() => setHeight}
          placeholder="Enter height"
          min={0}
          label="Height"
          />
      )}
      {visibleFilters.Price && <div className="flex items-center gap-1 ">
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
      </div>}
      {visibleFilters.Subtype && (
          <SimpleSelect
          options={options}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Subtype Fillter"
          />
        )}
     { visibleFilters.Date && <SimpleSelect
        options={filterOptions}
        value={dateFiltter}
        onChange={setDateFiltter}
        placeholder="Date Fillter"
        />}
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
                onClick={() =>toggleFilter(label)}
              >
                {visibleFilters[label] ? <FaMinusCircle /> : <FaCirclePlus />}
              </span>
            
            </li>
          ))}
        </ul>
      </div>
    </div>}
</>
  );
}

interface Option {
  label: string;
  value: string;
}

interface SimpleSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  return (
    <div className={` ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#343B4F] text-white px-3 py-2 rounded border border-gray-500 focus:outline-none  focus:ring-[#CB3CFF] transition-all"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-black "
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  label?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder = "Width",
  min,
  max,
  className = "",
  label,
}) => {
  return (
    <div className={`flex items-center gap-1 relative ${className}`}>
      {label && (
        <label className="text-sm text-white absolute top-[-20px] left-0">
          {label}
        </label>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        className="bg-[#343B4F] text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#CB3CFF] transition-all w-[100px]"
      />
    </div>
  );
};
