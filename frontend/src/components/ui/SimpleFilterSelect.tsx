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

const SimpleFilterSelect: React.FC<SimpleSelectProps> = ({
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

export default SimpleFilterSelect;