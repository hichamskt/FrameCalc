import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import type { SketchDetail } from '../../types/app';

interface Option {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
 name: keyof SketchDetail;
  setSketchDetails: React.Dispatch<React.SetStateAction<SketchDetail | undefined>>;
  errors:SketchDetail
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  setSketchDetails,
  name,
  errors
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    console.log("onchange:",optionValue)
    onChange(optionValue);
    { 
    
      setSketchDetails((prev) => ({
  ...prev!,
  [name]: optionValue,
}));


    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full " ref={selectRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:w-[100%] w-full px-3 py-2  bg-[#1976D2] border-none rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer "
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-white' : 'text-shadow-amber-100'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <IoChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 lg:w-[100%] w-full mt-1 bg-[#1976D2] border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="w-full px-3 py-2 text-left hover:bg-[#343B4F] focus:outline-none first:rounded-t-md last:rounded-b-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
       {errors[name] && (
          <p className="text-red-500 text-[10px] pt-1 font-medium">{errors[name]}</p>
        )}
    </div>
  );
};

export default SimpleSelect;