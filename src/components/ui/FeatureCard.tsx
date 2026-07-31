import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
  isAi?: boolean;
  accentColor?: string;
  onLearnDetails?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  tag,
  isAi = false,
  accentColor = '#996E7D',
  onLearnDetails,
}) => {
  return (
    <Card 
      variant={isAi ? 'ai' : 'interactive'}
      onClick={onLearnDetails}
      className="group flex flex-col justify-between h-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#996E7D]/10 hover:border-[#996E7D]/40"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div 
            className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
            style={{ 
              backgroundColor: isAi ? '#F7EDFC' : '#FAF8F2',
              color: isAi ? '#A73FD3' : accentColor,
              border: `1px solid ${isAi ? '#A73FD330' : '#E7E4DF'}`
            }}
          >
            {icon}
          </div>

          {tag && (
            <Badge variant={isAi ? 'ai' : 'primary'} size="sm">
              {tag}
            </Badge>
          )}
        </div>

        <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#996E7D] transition-colors">
          {title}
        </h3>

        <p className="font-body text-sm text-[#666666] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E7E4DF]/60 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#8E8E93] group-hover:text-[#996E7D] transition-colors">
          Learn Details
        </span>
        <span className="text-xs text-[#8E8E93] group-hover:translate-x-1.5 group-hover:text-[#996E7D] transition-all font-bold">
          →
        </span>
      </div>
    </Card>
  );
};

export default FeatureCard;
