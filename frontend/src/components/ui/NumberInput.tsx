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



export default NumberInput;