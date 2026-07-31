import React, { useState } from 'react';
import { Menu, ArrowRight } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import MobileDrawer from './MobileDrawer';

export interface NavbarProps {
  onNavigate: (route: string) => void;
  activeRoute?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeRoute }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScrollToSection = (id: string) => {
    if (activeRoute !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[72px] bg-white/60 backdrop-blur-md border-b border-[#E7E4DF] transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('landing')}
            className="cursor-pointer flex items-center"
          >
            <Logo variant="navbar" size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleScrollToSection('features')}
              className="font-body text-sm font-medium text-[#666666] hover:text-[#996E7D] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollToSection('how-it-works')}
              className="font-body text-sm font-medium text-[#666666] hover:text-[#996E7D] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollToSection('about')}
              className="font-body text-sm font-medium text-[#666666] hover:text-[#996E7D] transition-colors"
            >
              About
            </button>
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="text"
              size="sm"
              onClick={() => onNavigate('login')}
            >
              Sign In
            </Button>

            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('role-selection')}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('role-selection')}
              className="px-3 py-1 text-xs"
            >
              Get Started
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl border border-[#E7E4DF] bg-white text-[#1A1A1A] hover:bg-[#FAF8F2]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};

export default Navbar;
