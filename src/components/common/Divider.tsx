import React from 'react';

export interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ text, className = '' }) => {
  if (!text) {
    return <hr className={`border-t border-[#E7E4DF] my-4 w-full ${className}`} />;
  }

  return (
    <div className={`relative flex items-center justify-center my-6 w-full ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#E7E4DF]" />
      </div>
      <div className="relative bg-white px-3 text-xs font-medium uppercase tracking-wider text-[#8E8E93]">
        {text}
      </div>
    </div>
  );
};

export default Divider;
