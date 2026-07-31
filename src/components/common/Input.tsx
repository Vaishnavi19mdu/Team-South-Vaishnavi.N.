import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  id,
  required,
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="font-body text-xs sm:text-sm font-medium text-[#1A1A1A]">
          {label} {required && <span className="text-[#D9534F]">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#8E8E93] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full h-[52px] rounded-[12px] bg-white border font-body text-sm text-[#1A1A1A] 
            placeholder:text-[#8E8E93] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon ? 'pr-11' : 'pr-4'}
            ${error 
              ? 'border-[#D9534F] focus:border-[#D9534F] focus:ring-[#D9534F]/20' 
              : 'border-[#E7E4DF] hover:border-[#996E7D]/50 focus:border-[#996E7D] focus:ring-[#996E7D]/20'}
            ${disabled ? 'bg-[#FAF8F2] text-[#8E8E93] cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-[#8E8E93] flex items-center justify-center">
            {rightIcon}
          </div>
        )}
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
});

Input.displayName = 'Input';

export default Input;
