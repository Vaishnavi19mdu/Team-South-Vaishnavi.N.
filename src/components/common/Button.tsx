import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ai' | 'google' | 'danger';  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-body font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const sizeStyles = {
    sm: "h-[40px] px-4 text-xs rounded-[10px] gap-1.5",
    md: "h-[52px] px-6 text-sm sm:text-base rounded-[12px] gap-2", // 52px height from design system spec
    lg: "h-[58px] px-8 text-base rounded-[12px] gap-2.5",
  }[size];

  const variantStyles = {
    primary: "bg-[#996E7D] hover:bg-[#855B6A] text-white shadow-sm hover:shadow focus:ring-[#996E7D]",
danger: "bg-[#D9534F] hover:bg-[#C9302C] text-white shadow-sm hover:shadow focus:ring-[#D9534F]",
secondary: "bg-[#9EB8D2] hover:bg-[#89A4C0] text-[#1A1A1A] focus:ring-[#9EB8D2]",
    outline: "bg-transparent border border-[#E7E4DF] hover:border-[#996E7D] text-[#1A1A1A] hover:bg-[#FAF8F2] focus:ring-[#996E7D]",
    text: "bg-transparent text-[#666666] hover:text-[#1A1A1A] hover:bg-black/5 focus:ring-gray-400",
    ai: "bg-[#A73FD3] hover:bg-[#9233BC] text-white shadow-sm focus:ring-[#A73FD3]",
    google: "bg-white border border-[#E7E4DF] text-[#1A1A1A] hover:bg-[#FAF8F2] hover:border-gray-300 shadow-xs focus:ring-gray-300",
  }[variant];

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
