import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
  description?: string;
}

export interface DropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  containerClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  leftIcon,
  placeholder = 'Select an option',
  containerClassName = '',
  className = '',
  id,
  required,
  disabled,
  ...props
}) => {
  const dropdownId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={dropdownId} className="font-body text-xs sm:text-sm font-medium text-[#1A1A1A]">
          {label} {required && <span className="text-[#D9534F]">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#8E8E93] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <select
          id={dropdownId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`
            w-full h-[52px] rounded-[12px] bg-white border font-body text-sm text-[#1A1A1A] appearance-none
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer
            ${leftIcon ? 'pl-11' : 'pl-4'} pr-11
            ${error 
              ? 'border-[#D9534F] focus:border-[#D9534F] focus:ring-[#D9534F]/20' 
              : 'border-[#E7E4DF] hover:border-[#996E7D]/50 focus:border-[#996E7D] focus:ring-[#996E7D]/20'}
            ${disabled ? 'bg-[#FAF8F2] text-[#8E8E93] cursor-not-allowed' : ''}
            ${!value ? 'text-[#8E8E93]' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-[#1A1A1A] py-2">
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 text-[#8E8E93] pointer-events-none flex items-center justify-center">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {error ? (
        <p className="font-body text-xs text-[#D9534F] font-medium flex items-center gap-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="font-body text-xs text-[#666666]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Dropdown;
