import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-white rounded-[16px] border border-[#E7E4DF] ${className}`}>
      {icon && (
        <div className="w-14 h-14 rounded-full bg-[#FAF8F2] border border-[#E7E4DF] flex items-center justify-center text-[#996E7D] mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-1">{title}</h3>
      {description && (
        <p className="font-body text-sm text-[#666666] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
