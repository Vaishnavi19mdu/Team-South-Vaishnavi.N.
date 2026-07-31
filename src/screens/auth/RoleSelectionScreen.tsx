import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, Shield } from 'lucide-react';
import { UserRole } from '../../utils/constants/roles';
import RoleCard from '../../components/ui/RoleCard';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';

export interface RoleSelectionScreenProps {
  onNavigate: (route: string) => void;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onNavigate,
  selectedRole,
  onSelectRole,
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(selectedRole || 'resident');

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    onSelectRole(role);
  };

  const handleContinue = () => {
    onSelectRole(currentRole);
    onNavigate('signup-step-1');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FAF8F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        
        {/* Back Link & Brand */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm font-semibold text-[#666666] hover:text-[#996E7D] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>

          <Logo variant="navbar" size="sm" />
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F5EFF2] text-[#996E7D] mb-3">
            Step 1 of 3 • Choose Your Identity
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            Select Your Role in Project Vaigai
          </h1>
          <p className="font-body text-sm text-[#666666] mt-2 max-w-md mx-auto">
            Choose how you will participate in the hostel platform to get access to tailored dashboard tools.
          </p>
        </div>

        {/* 2x2 Grid of Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <RoleCard
            roleKey="resident"
            isSelected={currentRole === 'resident'}
            onSelect={handleRoleSelect}
          />

          <RoleCard
            roleKey="warden"
            isSelected={currentRole === 'warden'}
            onSelect={handleRoleSelect}
          />

          <RoleCard
            roleKey="maintenance"
            isSelected={currentRole === 'maintenance'}
            onSelect={handleRoleSelect}
          />

          <RoleCard
            roleKey="security"
            isSelected={currentRole === 'security'}
            onSelect={handleRoleSelect}
          />
        </div>

        {/* Continue Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7E4DF]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#666666]">
            <Shield className="w-4 h-4 text-[#4CAF50]" />
            <span>
              {currentRole === 'resident' 
                ? 'Instant account activation for students' 
                : 'Role verification required by Super Administrator'}
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={handleContinue}
            className="w-full sm:w-auto px-8"
          >
            Continue as {currentRole === 'resident' ? 'Resident' : currentRole === 'warden' ? 'Warden' : currentRole === 'maintenance' ? 'Maintenance' : 'Security'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default RoleSelectionScreen;
