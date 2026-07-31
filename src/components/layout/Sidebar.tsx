import React from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  AlertTriangle, 
  Megaphone, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Wrench,
  BarChart3,
  QrCode,
  ClipboardList,
  History,
  Package,
  Shield,
  Lock,
  Database,
  Activity,
  Building,
  Trophy,
  AlertCircle,
  HardDrive,
  FileCheck,
  Compass,
  MessageSquare
} from 'lucide-react';
import Logo from '../common/Logo';

export interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
  onOpenAiHelper?: () => void;
  role?: 'resident' | 'warden' | 'maintenance' | 'security' | 'superadmin';
  menuItems?: MenuItem[];
  pendingRequestsCount?: number;
}

interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  onLogout,
  onOpenAiHelper,
  role = 'resident',
  menuItems: customMenuItems,
  pendingRequestsCount = 0,
}) => {
  const defaultResidentMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/resident/dashboard',
      icon: <Home className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'complaints',
      label: 'Complaints',
      route: '/resident/complaints',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: 2,
    },
    {
      id: 'visitors',
      label: 'Visitors',
      route: '/resident/visitors',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: 1,
    },
    {
      id: 'sos',
      label: 'Emergency SOS',
      route: '/resident/sos',
      icon: <AlertTriangle className="w-5 h-5 shrink-0 text-[#D9534F]" />,
    },
    {
      id: 'inventory',
      label: 'Room Inventory',
      route: '/resident/inventory',
      icon: <Package className="w-5 h-5 shrink-0" />,
      badge: 'New',
    },
    {
      id: 'circle',
      label: 'Hostel Circle',
      route: '/resident/circle',
      icon: <Compass className="w-5 h-5 shrink-0 text-[#996E7D]" />,
      badge: 'Community',
    },
    {
      id: 'announcements',
      label: 'Announcements',
      route: '/resident/announcements',
      icon: <Megaphone className="w-5 h-5 shrink-0" />,
      badge: 3,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      route: '/resident/notifications',
      icon: <Bell className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      route: '/resident/profile',
      icon: <User className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/resident/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  const defaultWardenMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/warden/dashboard',
      icon: <Home className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'complaints',
      label: 'Complaints',
      route: '/warden/complaints',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: 14,
    },
    {
      id: 'visitors',
      label: 'Visitors',
      route: '/warden/visitors',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: 4,
    },
    {
      id: 'qr-scanner',
      label: 'QR Scanner',
      route: '/warden/qr-scanner',
      icon: <QrCode className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      route: '/warden/maintenance',
      icon: <Wrench className="w-5 h-5 shrink-0" />,
      badge: 6,
    },
    {
      id: 'pass-extensions',
      label: 'Pass Extensions',
      route: '/warden/pass-extensions',
      icon: <Shield className="w-5 h-5 shrink-0 text-[#996E7D]" />,
      badge: 1,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      route: '/warden/announcements',
      icon: <Megaphone className="w-5 h-5 shrink-0" />,
      badge: 3,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      route: '/warden/analytics',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'circle-moderation',
      label: 'Circle Moderation',
      route: '/warden/circle',
      icon: <Compass className="w-5 h-5 shrink-0 text-[#2A5C8A]" />,
      badge: 'Mod',
    },
    {
      id: 'sos',
      label: 'Emergency SOS',
      route: '/warden/sos',
      icon: <AlertTriangle className="w-5 h-5 shrink-0 text-[#D9534F]" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      route: '/warden/profile',
      icon: <User className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/warden/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  const defaultMaintenanceMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/maintenance/dashboard',
      icon: <Home className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'passes',
      label: 'Digital Work Passes',
      route: '/maintenance/passes',
      icon: <Shield className="w-5 h-5 shrink-0 text-[#996E7D]" />,
      badge: 2,
    },
    {
      id: 'tasks',
      label: 'Assigned Tasks',
      route: '/maintenance/tasks',
      icon: <ClipboardList className="w-5 h-5 shrink-0" />,
      badge: 3,
    },
    {
      id: 'history',
      label: 'Task History',
      route: '/maintenance/history',
      icon: <History className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      route: '/maintenance/inventory',
      icon: <Package className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      route: '/maintenance/notifications',
      icon: <Bell className="w-5 h-5 shrink-0" />,
      badge: 2,
    },
    {
      id: 'profile',
      label: 'Profile',
      route: '/maintenance/profile',
      icon: <User className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/maintenance/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  const defaultSecurityMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/security/dashboard',
      icon: <Home className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'qr-scanner',
      label: 'QR Scanner',
      route: '/security/qr-scanner',
      icon: <QrCode className="w-5 h-5 shrink-0 text-[#996E7D]" />,
    },
    {
      id: 'verification',
      label: 'Visitor Verification',
      route: '/security/verification',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: 3,
    },
    {
      id: 'logs',
      label: 'Entry & Exit Logs',
      route: '/security/logs',
      icon: <ClipboardList className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'sos',
      label: 'SOS Alerts',
      route: '/security/sos',
      icon: <AlertTriangle className="w-5 h-5 shrink-0 text-[#D9534F]" />,
      badge: 1,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      route: '/security/notifications',
      icon: <Bell className="w-5 h-5 shrink-0" />,
      badge: 2,
    },
    {
      id: 'profile',
      label: 'Profile',
      route: '/security/profile',
      icon: <User className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/security/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  const defaultSuperAdminMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Overview Dashboard',
      route: '/superadmin/dashboard',
      icon: <Home className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'requests',
      label: 'Pending Requests',
      route: '/superadmin/requests',
      icon: <Users className="w-5 h-5 shrink-0 text-[#D97706]" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    {
      id: 'access-control',
      label: 'Access Control Center',
      route: '/superadmin/access-control',
      icon: <Lock className="w-5 h-5 shrink-0 text-[#2A5C8A]" />,
      badge: 'Security',
    },
    {
      id: 'campus',
      label: 'Campus Overview',
      route: '/superadmin/campus',
      icon: <Building className="w-5 h-5 shrink-0 text-[#996E7D]" />,
      badge: 5,
    },
    {
      id: 'system-health',
      label: 'System Health Monitor',
      route: '/superadmin/system-health',
      icon: <Activity className="w-5 h-5 shrink-0 text-[#059669]" />,
      badge: 'Live',
    },
    {
      id: 'hostel-comparison',
      label: 'Hostel Comparison',
      route: '/superadmin/hostel-comparison',
      icon: <BarChart3 className="w-5 h-5 shrink-0 text-[#E65100]" />,
    },
    {
      id: 'leaderboard',
      label: 'Staff Leaderboard',
      route: '/superadmin/leaderboard',
      icon: <Trophy className="w-5 h-5 shrink-0 text-[#D97706]" />,
    },
    {
      id: 'alerts',
      label: 'System Alert Center',
      route: '/superadmin/alerts',
      icon: <AlertCircle className="w-5 h-5 shrink-0 text-[#D9534F]" />,
      badge: 3,
    },
    {
      id: 'analytics',
      label: 'Enterprise Analytics',
      route: '/superadmin/analytics',
      icon: <Sparkles className="w-5 h-5 shrink-0 text-[#2A5C8A]" />,
    },
    {
      id: 'backup',
      label: 'Backup & Recovery',
      route: '/superadmin/backup',
      icon: <HardDrive className="w-5 h-5 shrink-0 text-[#666666]" />,
    },
    {
      id: 'audit',
      label: 'Audit Insights',
      route: '/superadmin/audit',
      icon: <FileCheck className="w-5 h-5 shrink-0 text-[#2E7D32]" />,
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      route: '/superadmin/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  const menuItems = customMenuItems || (
    role === 'superadmin'
      ? defaultSuperAdminMenuItems
      : role === 'warden' 
      ? defaultWardenMenuItems 
      : role === 'maintenance'
      ? defaultMaintenanceMenuItems
      : role === 'security'
      ? defaultSecurityMenuItems
      : defaultResidentMenuItems
  );

  const handleItemClick = (route: string) => {
    onNavigate(route);
    onMobileClose();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E7E4DF] transition-all duration-300">
      {/* Sidebar Header */}
      <div className={`px-4 border-b border-[#E7E4DF] flex items-center h-[72px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <Logo variant="navbar" size="sm" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-[#F5EFF2] text-[#996E7D] font-extrabold text-sm flex items-center justify-center border border-[#996E7D]/20">
            PV
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-[#FAF8F2] text-[#666666] hover:text-[#1A1A1A] transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-[#FAF8F2] text-[#666666]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {!isCollapsed && (
          <span className="px-3 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block mb-2">
            Main Menu
          </span>
        )}

        {menuItems.map((item) => {
          const isActive = activeRoute === item.route;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.route)}
              className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-[12px] font-body text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#F5EFF2] text-[#996E7D] shadow-2xs font-bold border-l-4 border-[#996E7D]'
                  : 'text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2]'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                <span className={`transition-transform group-hover:scale-110 ${isActive ? 'text-[#996E7D]' : 'text-[#8E8E93] group-hover:text-[#1A1A1A]'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                  isActive ? 'bg-[#996E7D] text-white' : 'bg-[#E7E4DF] text-[#666666] group-hover:bg-[#996E7D]/10 group-hover:text-[#996E7D]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Assistant Banner / Button */}
      {!isCollapsed ? (
        <button
          type="button"
          onClick={onOpenAiHelper}
          className="p-3 mx-3 mb-3 bg-gradient-to-r from-[#F7EDFC] via-[#F5EFF2] to-[#EBF3FA] hover:from-[#F3E2FC] hover:to-[#E0EDFA] rounded-[14px] border border-[#A73FD3]/30 shadow-2xs hover:shadow-md transition-all cursor-pointer text-left group active:scale-98 block w-[calc(100%-24px)]"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A73FD3] group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black text-[#A73FD3] tracking-tight group-hover:text-[#8025A8]">
                Vaigai AI Helper
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#A73FD3] text-white shadow-2xs">
              Ask ✨
            </span>
          </div>
          <p className="text-[11px] text-[#666666] leading-tight group-hover:text-[#1A1A1A]">
            Click to auto-route complaints & ask campus AI rules.
          </p>
        </button>
      ) : (
        <div className="flex justify-center mb-3">
          <button
            type="button"
            onClick={onOpenAiHelper}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#F7EDFC] to-[#F5EFF2] border border-[#A73FD3]/30 text-[#A73FD3] hover:scale-110 transition-all cursor-pointer shadow-xs"
            title="Open Vaigai AI Helper"
          >
            <Sparkles className="w-5 h-5 text-[#A73FD3] animate-pulse" />
          </button>
        </div>
      )}

      {/* Footer / Logout Button */}
      <div className="p-3 border-t border-[#E7E4DF]">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-2.5 rounded-[12px] text-xs sm:text-sm font-semibold text-[#D9534F] hover:bg-[#FDF2F2] transition-colors group`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fadeIn"
            onClick={onMobileClose}
          />
          <div className="relative w-[280px] h-full z-10 animate-slideRight">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;