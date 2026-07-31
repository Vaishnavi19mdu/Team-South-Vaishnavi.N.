import React from 'react';
import { X, ArrowRight, Shield, Sparkles, HelpCircle, Info } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[#E7E4DF]">
            <Logo variant="navbar" size="sm" />
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#666666] hover:bg-[#FAF8F2] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F5EFF2] hover:text-[#996E7D] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#996E7D]" />
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F5EFF2] hover:text-[#996E7D] transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#9EB8D2]" />
              How It Works
            </a>

            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const el = document.getElementById('about');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F5EFF2] hover:text-[#996E7D] transition-colors"
            >
              <Info className="w-4 h-4 text-[#F4B400]" />
              About
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-[#E7E4DF]">
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              onClose();
              onNavigate('login');
            }}
          >
            Sign In
          </Button>

          <Button
            variant="primary"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onNavigate('role-selection');
            }}
          >
            Sign Up
          </Button>

          <div className="text-center mt-2">
            <span className="text-[11px] text-[#8E8E93] font-medium flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-[#4CAF50]" /> Verified Campus Ecosystem
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
