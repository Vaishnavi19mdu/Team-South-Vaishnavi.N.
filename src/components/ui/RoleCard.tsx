import React from 'react';
import { UserRole, ROLES } from '../../utils/constants/roles';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Check, User, ShieldCheck, Wrench, ShieldAlert } from 'lucide-react';

export interface RoleCardProps {
  roleKey: UserRole;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  roleKey,
  isSelected,
  onSelect,
}) => {
  const role = ROLES[roleKey];

  const getIcon = () => {
    switch (roleKey) {
      case 'resident':
        return <User className="w-6 h-6" />;
      case 'warden':
        return <ShieldCheck className="w-6 h-6" />;
      case 'maintenance':
        return <Wrench className="w-6 h-6" />;
      case 'security':
        return <ShieldAlert className="w-6 h-6" />;
    }
  };

  return (
    <div 
      onClick={() => onSelect(roleKey)}
      className="cursor-pointer transition-all duration-200"
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 border-2 ${
          isSelected 
            ? 'border-[#996E7D] bg-white shadow-[0_8px_30px_-6px_rgba(153,110,125,0.18)] scale-[1.01]' 
            : 'border-[#E7E4DF] bg-white hover:border-[#996E7D]/40 hover:bg-[#FAF8F2]/50'
        }`}
      >
        {/* Selection Check Badge */}
        <div className="flex items-start justify-between mb-3">
          <div 
            className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-colors ${
              isSelected 
                ? 'bg-[#996E7D] text-white shadow-xs' 
                : 'bg-[#FAF8F2] text-[#1A1A1A] border border-[#E7E4DF]'
            }`}
          >
            {getIcon()}
          </div>

          <div className="flex items-center gap-2">
            {role.requiresApproval ? (
              <Badge variant="warning" size="sm">Verification Required</Badge>
            ) : (
              <Badge variant="success" size="sm">Instant Access</Badge>
            )}

            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                isSelected 
                  ? 'bg-[#996E7D] border-[#996E7D] text-white' 
                  : 'border-[#E7E4DF] bg-transparent text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-extrabold text-[#1A1A1A]">
            {role.title}
          </h3>
          <p className="font-body text-xs font-semibold text-[#996E7D] mt-0.5 mb-2">
            {role.subtitle}
          </p>
          <p className="font-body text-xs text-[#666666] leading-relaxed">
            {role.description}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RoleCard;
