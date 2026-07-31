import React from 'react';

export interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  return (
    <div className={`flex flex-col max-w-2xl ${alignStyles} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F5EFF2] text-[#996E7D] border border-[#996E7D]/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />
          {badge}
        </span>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-sm sm:text-base text-[#666666] mt-3 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
