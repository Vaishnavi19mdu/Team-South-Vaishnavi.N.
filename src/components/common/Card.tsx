import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'interactive' | 'accent' | 'ai';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6', // 20px padding from spec
    lg: 'p-6 sm:p-8',
  }[padding];

  const variantStyles = {
    default: 'bg-white border border-[#E7E4DF] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]',
    flat: 'bg-[#FAF8F2] border border-[#E7E4DF]',
    interactive: 'bg-white border border-[#E7E4DF] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-[#996E7D] hover:shadow-[0_8px_30px_-6px_rgba(153,110,125,0.12)] cursor-pointer transition-all duration-200',
    accent: 'bg-white border-l-4 border-l-[#996E7D] border-y border-r border-[#E7E4DF] shadow-xs',
    ai: 'bg-gradient-to-b from-white to-[#F7EDFC]/30 border border-[#A73FD3]/30 shadow-[0_4px_20px_-4px_rgba(167,63,211,0.08)]',
  }[variant];

  return (
    <div
      className={`rounded-[16px] ${paddingStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
