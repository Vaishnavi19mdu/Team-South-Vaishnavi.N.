import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Shield,
  X,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Badge from '../common/Badge';

export interface ProfileStat {
  label: string;
  value: string;
  color?: string;
}

export interface TopBarProps {
  currentPageTitle: string;
  role: 'superadmin' | 'warden' | 'maintenance' | 'security' | 'resident';
  userName?: string;
  userRole?: string;
  avatarInitials?: string;
  avatarColor?: string;
  hostelBlock?: string;
  roomNumber?: string;
  unreadCount?: number;
  showBackButton?: boolean;
  onBack?: () => void;
  onOpenAiHelper?: () => void;
  onToggleSidebar: () => void;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  // Profile Overview modal — now prop-driven instead of hardcoded to Super Admin
  profileEmployeeId?: string;
  profileEmail?: string;
  profileAccessLevel?: string;
  profileOfficeLocation?: string;
  profilePrimaryCampus?: string;
  profileStats?: ProfileStat[];
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPageTitle,
  role,
  userName = 'Super Administrator',
  userRole = 'Super Administrator',
  avatarInitials = 'SA',
  avatarColor = '#2A5C8A',
  hostelBlock = 'Global Administration',
  roomNumber = 'Central Console',
  unreadCount = 5,
  showBackButton = false,
  onBack,
  onOpenAiHelper,
  onToggleSidebar,
  onNavigate,
  onLogout,
  profileEmployeeId = 'SA-9001',
  profileEmail = 'superadmin@vaigai.edu.in',
  profileAccessLevel = 'Root Administrator',
  profileOfficeLocation = 'Central Wing',
  profilePrimaryCampus = 'Main Campus',
  profileStats = [
    { label: 'Total Users Managed', value: '1,482' },
    { label: 'Hostels Managed', value: '5 Blocks', color: '#2A5C8A' },
    { label: 'Active Sessions', value: '12', color: '#059669' },
    { label: 'Pending Approvals', value: '3', color: '#D97706' },
  ],
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showProfileOverview, setShowProfileOverview] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editToast, setEditToast] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Bug fix #3: routing previously guessed the portal from the display label
  // (userRole.toLowerCase().includes('warden') etc). That's fragile — a display
  // label like "Assistant Warden" or a renamed title could silently misroute.
  // Routing now comes straight from the explicit `role` prop; `userRole` stays
  // purely cosmetic (the text shown next to the avatar).
  const isSuperAdmin = role === 'superadmin';

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search overlay on outside click or Escape
  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutsideSearch);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSearch);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(false);
    onNavigate(`/${role}/profile`);
  };

  const handleSettingsClick = () => {
    setDropdownOpen(false);
    onNavigate(`/${role}/settings`);
  };

  // Bug fix #2: notification bell only knew 'superadmin' vs a resident fallback,
  // then later guessed off the display label. Now it routes off the explicit
  // `role` prop directly, same pattern as handleProfileClick/handleSettingsClick.
  const getNotificationsRoute = () => {
    if (role === 'superadmin') return '/superadmin/alerts';
    return `/${role}/notifications`;
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white border-b border-[#E7E4DF] h-[72px] px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
        {/* Left: Back Button (if requested/available) + Sidebar Toggle + Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bug fix #1: (showBackButton || onBack) was always truthy since every
              dashboard passes an onBack function — showBackButton was ignored.
              Require both. */}
          {showBackButton && onBack && (
            <button
              type="button"
              onClick={() => onBack && onBack()}
              className="px-2.5 py-2 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-[#1A1A1A] font-bold text-xs sm:text-sm hover:bg-[#2A5C8A] hover:text-white hover:border-[#2A5C8A] transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs group active:scale-95"
              title="Go Back to Previous Page"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">Back</span>
            </button>
          )}

          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl border border-[#E7E4DF] text-[#1A1A1A] hover:bg-[#FAF8F2] hover:border-[#996E7D] transition-all cursor-pointer shrink-0"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 overflow-hidden">
            <h1 className="font-heading text-base sm:text-xl font-extrabold text-[#1A1A1A] tracking-tight truncate">
              {currentPageTitle}
            </h1>

            <div className="hidden lg:flex items-center gap-2 ml-3 pl-3 border-l border-[#E7E4DF]">
              <Badge variant="primary" size="sm">
                <Building className="w-3 h-3 mr-1" /> {hostelBlock} • {roomNumber}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Vaigai AI Helper Quick Trigger Button */}
          {onOpenAiHelper && (
            <button
              type="button"
              onClick={onOpenAiHelper}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#F7EDFC] via-[#F5EFF2] to-[#EBF3FA] border border-[#A73FD3]/40 text-[#A73FD3] font-black text-xs hover:from-[#A73FD3] hover:to-[#8025A8] hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 shrink-0 group"
              title="Click to Open Vaigai AI Helper"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A73FD3] group-hover:text-yellow-200 group-hover:rotate-12 transition-transform animate-pulse" />
              <span className="hidden sm:inline tracking-tight">Vaigai AI Helper</span>
            </button>
          )}

          {/* Search Input / Icon */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2.5 rounded-full border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] hover:border-[#2A5C8A] transition-all cursor-pointer ${
                searchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center bg-white border border-[#2A5C8A] rounded-full pl-3.5 pr-1.5 py-1.5 w-64 sm:w-80 shadow-lg animate-fadeIn">
                <Search className="w-4 h-4 text-[#8E8E93] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search logs, hostels, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-xs outline-none font-body text-[#1A1A1A]"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1.5 rounded-full text-[#8E8E93] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer shrink-0"
                  title="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate(getNotificationsRoute())}
            className="p-2.5 rounded-full border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] hover:border-[#2A5C8A] transition-all relative group cursor-pointer"
            title="Notifications & System Alerts"
          >
            <Bell className="w-4 h-4 group-hover:animate-bounce" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D9534F] ring-2 ring-white" />
            )}
          </button>

          {/* Settings Icon */}
          <button
            onClick={handleSettingsClick}
            className="p-2.5 rounded-full border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] hover:border-[#2A5C8A] transition-all hidden sm:flex cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Profile Avatar with Dropdown */}
          <div className="relative pl-1 sm:pl-2 border-l border-[#E7E4DF]" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-[#FAF8F2] transition-all group cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs transition-transform group-hover:scale-105"
                style={{ backgroundColor: avatarColor }}
              >
                {avatarInitials}
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="font-heading text-xs font-bold text-[#1A1A1A] leading-tight group-hover:text-[#2A5C8A] transition-colors">
                  {userName}
                </span>
                <span className="font-body text-[10px] text-[#8E8E93] font-medium">
                  {userRole}
                </span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-[#8E8E93] group-hover:text-[#1A1A1A] transition-transform hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E7E4DF] rounded-[20px] shadow-2xl p-2.5 z-50 animate-slideUp">
                
                {/* Header Section inside Dropdown */}
                <div className="p-3 bg-[#FAF8F2] rounded-[14px] border border-[#E7E4DF]/80 mb-2 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {avatarInitials}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-heading text-xs font-extrabold text-[#1A1A1A] truncate">{userName}</p>
                    <p className="font-body text-[10px] text-[#2A5C8A] font-bold truncate">{hostelBlock}</p>
                    <p className="font-body text-[9px] text-[#8E8E93] truncate">{userRole}</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  {/* Role Overview Item */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowProfileOverview(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2A5C8A]" />
                    <div className="flex flex-col">
                      <span>{userRole}</span>
                      <span className="text-[9px] text-[#8E8E93] font-normal">View System Credentials</span>
                    </div>
                  </button>

                  {/* My Profile */}
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-[#996E7D]" />
                    My Profile
                  </button>

                  {/* Settings */}
                  <button
                    type="button"
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer text-left"
                  >
                    <Settings className="w-4 h-4 text-[#059669]" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-[#E7E4DF] my-1.5" />

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-[#D9534F] hover:bg-[#FDF2F2] transition-all cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-[#D9534F]" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==================== PROFILE OVERVIEW MODAL ==================== */}
      {showProfileOverview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[28px] border border-[#E7E4DF] shadow-2xl max-w-md w-full p-6 relative animate-slideUp overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setShowProfileOverview(false)}
              className="absolute top-4 right-4 p-2 rounded-full border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-[#E7E4DF]">
              <div
                className="w-16 h-16 rounded-full text-white font-extrabold text-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white ring-4 ring-[#2A5C8A]/10"
                style={{ backgroundColor: avatarColor }}
              >
                {avatarInitials}
              </div>

              <h2 className="font-heading text-lg font-black text-[#1A1A1A]">
                {userName}
              </h2>
              <span className="px-3 py-0.5 rounded-full bg-[#EBF3FA] text-[#2A5C8A] border border-[#2A5C8A]/20 text-xs font-extrabold mt-1">
                {userRole}
              </span>
              <p className="font-body text-xs text-[#8E8E93] mt-1 font-medium">
                {hostelBlock}
              </p>
            </div>

            {/* Profile Info Details Grid — now prop-driven, no more hardcoded Super Admin data */}
            <div className="py-4 space-y-2.5 text-xs font-body">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF8F2] rounded-2xl border border-[#E7E4DF]/80">
                <div>
                  <span className="text-[10px] text-[#8E8E93] font-bold uppercase block">Employee ID</span>
                  <span className="font-mono font-extrabold text-[#1A1A1A] text-xs">{profileEmployeeId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] font-bold uppercase block">Access Level</span>
                  <span className="font-bold text-[#059669]">{profileAccessLevel}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-[#8E8E93] font-bold uppercase block">Email Address</span>
                  <span className="font-bold text-[#1A1A1A]">{profileEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] font-bold uppercase block">Office Location</span>
                  <span className="font-bold text-[#1A1A1A]">{profileOfficeLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] font-bold uppercase block">Primary Campus</span>
                  <span className="font-bold text-[#1A1A1A]">{profilePrimaryCampus}</span>
                </div>
              </div>

              {/* Quick Statistics — prop-driven */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block mb-2">
                  Quick Statistics
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {profileStats.map((stat) => (
                    <div key={stat.label} className="p-2.5 bg-white border border-[#E7E4DF] rounded-xl text-center">
                      <span
                        className="text-lg font-black font-heading block"
                        style={{ color: stat.color || '#1A1A1A' }}
                      >
                        {stat.value}
                      </span>
                      <span className="text-[10px] text-[#8E8E93] font-medium">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Toast Notification inside modal */}
            {editToast && (
              <div className="mb-3 p-2.5 bg-[#FEF9E7] border border-[#D97706]/30 rounded-xl text-[11px] text-[#D97706] font-bold text-center animate-fadeIn">
                Profile edits require System Security Authorization.
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E7E4DF] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowProfileOverview(false)}
                className="px-4 py-2 rounded-xl border border-[#E7E4DF] text-xs font-bold text-[#666666] hover:bg-[#FAF8F2] hover:text-[#1A1A1A] transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditToast(true);
                  setTimeout(() => setEditToast(false), 3000);
                }}
                className="px-4 py-2 rounded-xl border border-[#E7E4DF] text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileOverview(false);
                  handleProfileClick();
                }}
                className="px-4 py-2 rounded-xl bg-[#2A5C8A] text-white text-xs font-bold hover:bg-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                View Full Profile
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== LOGOUT CONFIRMATION MODAL ==================== */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[28px] border border-[#E7E4DF] shadow-2xl max-w-sm w-full p-6 text-center animate-slideUp relative">
            
            {/* Warning Shield Icon */}
            <div className="w-12 h-12 rounded-full bg-[#FDF2F2] text-[#D9534F] flex items-center justify-center mx-auto mb-4 border border-[#D9534F]/20">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-lg font-black text-[#1A1A1A] mb-1">
              Sign Out?
            </h3>
            <p className="font-body text-xs text-[#666666] mb-6">
              Are you sure you want to sign out of Project Vaigai? Your active administrative session will be closed safely.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-2.5 rounded-xl border border-[#E7E4DF] text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-[#D9534F] text-white text-xs font-bold hover:bg-[#C9302C] transition-all cursor-pointer shadow-md"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;