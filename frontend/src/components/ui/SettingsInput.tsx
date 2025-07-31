import { User, type LucideIcon } from 'lucide-react';
import React from 'react';

interface SettingsInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  icon?: LucideIcon;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  type?: string;
}

const SettingsInput: React.FC<SettingsInputProps> = ({ 
  icon: Icon = User, 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  type = "text",
  ...props 
}) => {

 
  return (
    <div className="w-full">
      <div className="relative">
       
        <div className="grid grid-cols-[20%_75%] gap-4">
          
          <div className="flex items-center text-sm font-medium text-gray-300 min-w-0 ">
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </div>
        
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`
              flex-1 px-4 py-3 
              bg-slate-800 
              border rounded-lg 
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors duration-200
              ${error 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-600 hover:border-slate-500'
              }
            `}
            {...props}
          />
        </div>
        
       
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(SettingsInput);
