import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ai'
    | 'success'
    | 'warning'
    | 'error'
    | 'danger'
    | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 rounded-[6px]',
    md: 'text-xs px-2.5 py-1 gap-1.5 rounded-[8px]',
    lg: 'text-sm px-4 py-2 gap-2 rounded-[10px]',
  }[size];

  const variantStyles = {
    primary: 'bg-[#F5EFF2] text-[#996E7D] font-semibold border border-[#996E7D]/20',
    secondary: 'bg-[#F0F4F8] text-[#2A5C8A] font-semibold border border-[#9EB8D2]/30',
    accent: 'bg-[#FFF8E1] text-[#B78100] font-semibold border border-[#F4B400]/30',
    ai: 'bg-[#F7EDFC] text-[#A73FD3] font-semibold border border-[#A73FD3]/30',
    success: 'bg-[#E8F5E9] text-[#2E7D32] font-semibold border border-[#4CAF50]/30',
    warning: 'bg-[#FFF8E1] text-[#B78100] font-semibold border border-[#F4B400]/30',
    error: 'bg-[#FDF2F2] text-[#C62828] font-semibold border border-[#D9534F]/30',
    danger: 'bg-[#FFEBEE] text-[#C62828] font-semibold border border-[#D9534F]/30',
    outline: 'bg-transparent text-[#666666] font-medium border border-[#E7E4DF]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-body ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;