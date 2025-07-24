import { useCallback, useEffect, useRef, useState } from "react";
import { useSubtypes } from "../hooks/useSubtypes";
import type { QuotationFilters } from "../types/app";
import SimpleFilterSelect from "./ui/SimpleFilterSelect";
import NumberInput from "./ui/NumberInput";
import { FaMinusCircle } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { RiResetLeftFill } from "react-icons/ri";

type FilterProps = {
  showFilter: boolean; // Fixed typo: showFillter -> showFilter
};

type FilterFunction = (filters: QuotationFilters) => void;

interface QuotationFilterProps extends FilterProps {
  filter: FilterFunction;
}

// Define filter types for better type safety
type FilterKey = 'Subtype' | 'Price' | 'Width' | 'Height' | 'Date';

interface PriceFilter {
  min: number;
  max: number;
}

function QuotationFilter({ showFilter, filter }: QuotationFilterProps) {
  const [showAddFilters, setShowAddFilter] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [widthMin, setWidthMin] = useState<number>(0);
  const [widthMax, setWidthMax] = useState<number>(0);
  const [heightMax, setHeightMax] = useState<number>(0);
  const [heightMin, setHeightMin] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState<string>(""); // Fixed typo: dateFiltter -> dateFilter
  const [priceFilter, setPriceFilter] = useState<PriceFilter>({
    min: 0,
    max: 0,
  });
  const [visibleFilters, setVisibleFilters] = useState<Record<FilterKey, boolean>>({
    Subtype: false,
    Price: false,
    Width: false,
    Height: false,
    Date: false,
  });

  const menuRef = useRef<HTMLUListElement | null>(null);
  const { subtypes } = useSubtypes();
  const [filters, setFilters] = useState<QuotationFilters>({});
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAddFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set up subtype options
  useEffect(() => {
    console.log("subtyoes ;",subtypes)
    const newOptions = subtypes?.map((subtype: { name: string }) => ({
      label: subtype.name,
      value: subtype.name,
    }));
    setOptions(newOptions);
  }, [subtypes]);
  // Initialize filters on mount
  useEffect(() => {
    const initialFilters: QuotationFilters = {
      page: 1,
      pageSize: 20,
      ordering: "-date",
    };
    filter(initialFilters);
  }, [filter]);

  // Apply filters when they change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      filter(filters);
    }
  }, [filters, filter]);

  // Memoized filter change handler
  const handleFilterChange = useCallback(
    (newFilters: Partial<QuotationFilters>) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
        page: 1,
      }));
    },
    []
  );

  // Update filters when individual filter values change
  useEffect(() => {
    const updates: Partial<QuotationFilters> = {};

    // Price filters
    if (priceFilter.min > 0) {
      updates.priceMin = priceFilter.min;
    }
    if (priceFilter.max > 0) {
      updates.priceMax = priceFilter.max;
    }

    // Dimension filters
    if (widthMax > 0) {
      updates.widthMax = widthMax;
    }
    if (widthMin > 0) {
      updates.widthMin = widthMin;
    }
    if (heightMin > 0) {
      updates.heightMin = heightMin;
    }
    if (heightMax > 0) {
      updates.heightMax = heightMax;
    }

    // Date filter
    if (dateFilter) {
      const { dateFrom, dateTo } = getDateRange(dateFilter);
      updates.dateFrom = dateFrom;
      updates.dateTo = dateTo;
    }

    // Subtype filter
    if (selectedOption) {
      updates.subtype = selectedOption;
    }

    // Only update if there are actual changes
    if (Object.keys(updates).length > 0) {
      handleFilterChange(updates);
    }
  }, [
    handleFilterChange,
    priceFilter,
    widthMax,
    widthMin,
    dateFilter, // Fixed typo
    heightMin,
    heightMax,
    selectedOption,
  ]);

  // Date range calculator
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

  // Date filter options
  const filterOptions = [
    { label: "Last Day", value: "1d" },
    { label: "Last Week", value: "1w" },
    { label: "Last Month", value: "1m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "1y" },
  ];

  // Available filter types
  const availableFilters: FilterKey[] = ["Subtype", "Price", "Width", "Height", "Date"];

  // Toggle filter visibility
  const toggleFilter = useCallback((filterKey: FilterKey) => {
    setVisibleFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  }, []);

  // Reset all filters
  const handleReset = useCallback(() => {
    // Reset all state
    setFilters({});
    setWidthMax(0);
    setWidthMin(0);
    setDateFilter("");
    setHeightMin(0);
    setHeightMax(0);
    setPriceFilter({ min: 0, max: 0 });
    setSelectedOption("");
    
    // Reset visible filters
    setVisibleFilters({
      Subtype: false,
      Price: false,
      Width: false,
      Height: false,
      Date: false,
    });
    
    // Apply empty filters
    filter({});
  }, [filter]);

  // Don't render if not shown
  if (!showFilter) {
    return null;
  }

  return (
    <div className="flex sm:items-center sm:gap-1 gap-6 mt-6 flex-wrap flex-col sm:flex-row">
      {/* Width Filter */}
      {visibleFilters.Width && (
        <div className="flex items-center gap-2">
          <NumberInput
            value={widthMin}
            onChange={setWidthMin}
            placeholder="Enter width"
            min={0}
            label="Min Width"
          />
          <NumberInput
            value={widthMax}
            onChange={setWidthMax}
            placeholder="Enter width"
            min={widthMin} // Ensure max is at least min
            label="Max Width"
          />
        </div>
      )}

      {/* Height Filter */}
      {visibleFilters.Height && (
        <div className="flex items-center gap-2">
          <NumberInput
            value={heightMin}
            onChange={setHeightMin}
            placeholder="Enter height"
            min={0}
            label="Min Height"
          />
          <NumberInput
            value={heightMax}
            onChange={setHeightMax}
            placeholder="Enter height"
            min={heightMin} // Ensure max is at least min
            label="Max Height"
          />
        </div>
      )}

      {/* Price Filter */}
      {visibleFilters.Price && (
        <div className="flex items-center gap-1">
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
            label="Min Price"
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
            label="Max Price"
          />
        </div>
      )}

      {/* Subtype Filter */}
      {visibleFilters.Subtype && (
        <SimpleFilterSelect
          options={options}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Subtype Filter" // Fixed typo: Fillter -> Filter
        />
      )}

      {/* Date Filter */}
      {visibleFilters.Date && (
        <SimpleFilterSelect
          options={filterOptions}
          value={dateFilter}
          onChange={setDateFilter}
          placeholder="Date Filter" // Fixed typo: Fillter -> Filter
        />
      )}

      {/* Add Filter Dropdown */}
      <div className="relative w-fit">
        <button
          onClick={() => setShowAddFilter(!showAddFilters)}
          className="bg-[#CB3CFF] text-white cursor-pointer px-3 py-2 rounded hover:bg-[#cb3cffe5] transition-colors"
          aria-label="Add Filter"
          aria-expanded={showAddFilters}
        >
          Add Filter
        </button>

        {/* Dropdown Menu */}
        <ul
          ref={menuRef}
          className={`text-white text-[16px] flex flex-col gap-1 absolute top-[50px] right-[-100px] bg-[#343B4F] w-[200px] rounded transition-all duration-300 ease-in-out transform z-10 ${
            showAddFilters
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
          role="menu"
        >
          <p className="p-2 font-medium border-b border-gray-600">Filters</p>
          {availableFilters.map((label) => (
            <li
              key={label}
              className="flex p-3 items-center justify-between hover:bg-[#444b61] transition-colors"
              role="menuitem"
            >
              <span>{label}</span>
              <button
                className="hover:text-[#cb3cffe5] cursor-pointer transition-colors"
                onClick={() => toggleFilter(label)}
                aria-label={`${visibleFilters[label] ? 'Remove' : 'Add'} ${label} filter`}
              >
                {visibleFilters[label] ? <FaMinusCircle /> : <FaCirclePlus />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset Button */}
      <button
        className="text-white text-3xl cursor-pointer hover:text-gray-300 transition-colors"
        onClick={handleReset}
        aria-label="Reset all filters"
        title="Reset all filters"
      >
        <RiResetLeftFill />
      </button>
    </div>
  );
}

export default QuotationFilter;