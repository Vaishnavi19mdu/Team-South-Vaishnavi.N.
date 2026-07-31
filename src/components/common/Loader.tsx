import React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div
        className={`${sizeStyles} border-[#996E7D]/20 border-t-[#996E7D] rounded-full animate-spin`}
      />
      {text && <p className="font-body text-xs sm:text-sm font-medium text-[#666666]">{text}</p>}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#E7E4DF]/60 rounded-[12px] ${className}`} />
);

export default Loader;
