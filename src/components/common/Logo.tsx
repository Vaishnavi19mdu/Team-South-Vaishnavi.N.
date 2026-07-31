import React from 'react';

interface LogoProps {
  variant?: 'app-icon' | 'navbar' | 'splash' | 'horizontal';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'navbar',
  theme = 'light',
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  // Size mapping
  const dimensions = {
    sm: { mark: 32, box: 'w-8 h-8 rounded-lg', text: 'text-base', sub: 'text-[10px]' },
    md: { mark: 40, box: 'w-10 h-10 rounded-xl', text: 'text-xl', sub: 'text-xs' },
    lg: { mark: 52, box: 'w-13 h-13 rounded-2xl', text: 'text-2xl', sub: 'text-sm' },
    xl: { mark: 64, box: 'w-16 h-16 rounded-2xl', text: 'text-3xl', sub: 'text-base' },
  }[size];

  const primaryColor = '#996E7D'; // Paprika
  const textColor = theme === 'dark' ? '#FFFFFF' : '#1A1A1A';
  const mutedTextColor = theme === 'dark' ? '#9CA3AF' : '#666666';

  // Clean, sharp, bold geometric uppercase "V" logo icon
  const LogoMark = (
    <div
      className={`inline-flex items-center justify-center bg-[#996E7D] text-white font-heading font-black transition-transform duration-300 hover:scale-105 shadow-md shadow-[#996E7D]/20 ${dimensions.box}`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5"
      >
        <path
          d="M 3 4 L 12 20 L 21 4"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  if (variant === 'app-icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoMark}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoMark}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-heading font-extrabold tracking-tight uppercase ${dimensions.text}`} style={{ color: textColor }}>
            PROJECT <span style={{ color: primaryColor }}>VAIGAI</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" title="System Active" />
        </div>
        {(showSubtitle || variant === 'splash') && (
          <span className={`font-body font-medium tracking-wide ${dimensions.sub}`} style={{ color: mutedTextColor }}>
            Smart Hostel Management
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
