import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  QrCode,
  Users,
  ClipboardList,
  AlertTriangle,
  Bell,
  User,
  Settings,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
  Zap,
  RotateCcw,
  Search,
  Filter,
  Check,
  X,
  Phone,
  Shield,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  LogOut,
  Maximize2,
  Sparkles,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  FileText,
  ChevronRight,
  Flame,
  Volume2,
  Wrench,
  BarChart3,
  TrendingUp,
  Activity,
  SlidersHorizontal,
  Layers,
  Radio,
  Save,
  ShieldAlert,
  HelpCircle,
  Lock,
  Globe
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import VaigaiAiHelperModal from '../../components/ai/VaigaiAiHelperModal';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { useWorkPass, WorkPass } from '../../context/WorkPassContext';
import { useSos } from '../../context/SosContext';
import { useVisitorPass, VisitorPassRecord } from '../../context/VisitorPassContext';
import { playSosSiren } from '../../utils/sosSiren';
import SosSirenBanner from '../../components/common/SosSirenBanner';
import GateQrScanner, { GateQrScannerHandle } from '../../components/security/GateQrScanner';

export interface SecurityDashboardProps {
  userName?: string;
  onLogout?: () => void;
}

/**
 * @deprecated No longer used internally — visitor passes are now sourced live from
 * Firestore via VisitorPassContext (see VisitorPassRecord). Kept only in case other
 * files still import this type.
 */
export interface VisitorPass {
  id: string;
  visitorName: string;
  visitorPhone: string;
  residentName: string;
  room: string;
  block: string;
  purpose: string;
  visitDate: string;
  timeSlot: string;
  govtId: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Checked In' | 'Checked Out';
  photoUrl?: string;
}

export interface EntryLog {
  id: string;
  personName: string;
  role: string;
  passType: 'Visitor' | 'Maintenance';
  passId: string;
  room: string;
  entryTime: string;
  exitTime?: string;
  gate: string;
  status: 'Inside' | 'Completed' | 'Rejected';
  verifiedBy: string;
}

export type FilterOption =
  | 'Today'
  | 'Yesterday'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Morning Shift'
  | 'Evening Shift'
  | 'Night Shift';

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  userName = 'Suresh Kumar',
  onLogout = () => {},
}) => {
  const { showToast } = useToast();
  const { passes } = useWorkPass();
  // ==================== Live SOS alerts (replaces old local mock state) ====================
  const { activeAlerts: sosAlerts, markResolved } = useSos();
  // ==================== Live visitor gate passes (Firestore-backed, replaces old local mock state) ====================
  const {
    passes: visitorPasses,
    lookupByScan,
    approveVisitorPass,
    rejectVisitorPass,
    checkInVisitorPass,
    checkOutVisitorPass,
  } = useVisitorPass();

  // Real camera scanner ref (torch / camera-switch controls call into this)
  const scannerRef = useRef<GateQrScannerHandle>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const lastDecodedRef = useRef<{ text: string; time: number } | null>(null);

  // Navigation state
  const [activeRoute, setActiveRoute] = useState<string>('/security/dashboard');
  const [showAiModal, setShowAiModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // QR Scanner Controls
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'rear' | 'front'>('rear');
  const [manualPassInput, setManualPassInput] = useState<string>('');
  const [scannedResultModal, setScannedResultModal] = useState<{
    type: 'visitor' | 'maintenance';
    visitorData?: VisitorPassRecord;
    passData?: WorkPass;
  } | null>(null);

  // Analytics filter state
  const [analyticsFilter, setAnalyticsFilter] = useState<FilterOption>('Today');

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    audioSiren: true,
    autoLogEntry: true,
    cameraFlashDefault: false,
    displayLanguage: 'English',
    assignedGate: 'Main Hostel Gate (#1)',
    autoLogoutMinutes: '30',
    notifyWardenOnSOS: true,
  });

  // Mock Logs
  const [logs, setLogs] = useState<EntryLog[]>([
    {
      id: 'LOG-8801',
      personName: 'Ramesh K',
      role: 'Parent / Visitor',
      passType: 'Visitor',
      passId: 'VP-1089',
      room: 'A-204',
      entryTime: '02:15 PM',
      exitTime: undefined,
      gate: 'Main Hostel Gate',
      status: 'Inside',
      verifiedBy: 'Suresh Kumar (SEC-014)',
    },
    {
      id: 'LOG-8802',
      personName: 'Manoj Kumar',
      role: 'Electrician (Maintenance)',
      passType: 'Maintenance',
      passId: passes[0]?.id || 'WP-9081',
      room: 'B-108',
      entryTime: '01:30 PM',
      exitTime: '02:45 PM',
      gate: 'Main Hostel Gate',
      status: 'Completed',
      verifiedBy: 'Suresh Kumar (SEC-014)',
    },
    {
      id: 'LOG-8803',
      personName: 'Karthik Raja',
      role: 'Plumber (Maintenance)',
      passType: 'Maintenance',
      passId: 'WP-9082',
      room: 'A-302',
      entryTime: '11:00 AM',
      exitTime: '12:15 PM',
      gate: 'Main Hostel Gate',
      status: 'Completed',
      verifiedBy: 'Suresh Kumar (SEC-014)',
    },
    {
      id: 'LOG-8804',
      personName: 'Senthil Nathan',
      role: 'HVAC Technician',
      passType: 'Maintenance',
      passId: 'WP-9085',
      room: 'C-G04',
      entryTime: '09:45 AM',
      exitTime: '11:30 AM',
      gate: 'Service Gate',
      status: 'Completed',
      verifiedBy: 'Suresh Kumar (SEC-014)',
    },
    {
      id: 'LOG-8805',
      personName: 'Lakshmi Ammal',
      role: 'Guest / Parent',
      passType: 'Visitor',
      passId: 'VP-1085',
      room: 'B-210',
      entryTime: '08:30 AM',
      exitTime: '10:15 AM',
      gate: 'North Gate',
      status: 'Completed',
      verifiedBy: 'Suresh Kumar (SEC-014)',
    }
  ]);

  // Log filter states
  const [logSearch, setLogSearch] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<'All' | 'Visitor' | 'Maintenance'>('All');
  const [logStatusFilter, setLogStatusFilter] = useState<'All' | 'Inside' | 'Completed'>('All');

  // Scanner Search/Filter
  const [scanHistorySearch, setScanHistorySearch] = useState('');

  // -------------------------------------------------------------
  // ANALYTICS MOCK DATA BY FILTER
  // -------------------------------------------------------------
  const visitorTrendsData = [
    { time: '6:00 AM', Entries: 2, Exits: 1 },
    { time: '8:00 AM', Entries: 8, Exits: 3 },
    { time: '10:00 AM', Entries: 14, Exits: 7 },
    { time: '12:00 PM', Entries: 22, Exits: 15 },
    { time: '2:00 PM', Entries: 28, Exits: 18 },
    { time: '4:00 PM', Entries: 20, Exits: 22 },
    { time: '6:00 PM', Entries: 12, Exits: 26 },
    { time: '8:00 PM', Entries: 5, Exits: 16 },
  ];

  const passDistributionData = [
    { name: 'Visitor Passes', value: 45, color: '#2A5C8A' },
    { name: 'Maintenance Work Passes', value: 30, color: '#996E7D' },
    { name: 'Temporary Staff Passes', value: 15, color: '#E65100' },
    { name: 'Contractor Passes', value: 10, color: '#2E7D32' },
  ];

  const emergencyTimelineItems = [
    {
      id: 'SOS-101',
      type: 'Medical Emergency',
      student: 'Priya R',
      hostel: 'Vaigai Hostel',
      time: '10:24 AM',
      status: 'Resolved',
      badgeColor: 'success',
      icon: <Activity className="w-4 h-4 text-[#2E7D32]" />,
    },
    {
      id: 'SOS-102',
      type: 'Fire Alarm',
      student: 'System Sensor Block B',
      hostel: 'Kaveri Hostel',
      time: '2:18 PM',
      status: 'Responding',
      badgeColor: 'warning',
      icon: <Flame className="w-4 h-4 text-[#F57F17]" />,
    },
    {
      id: 'SOS-103',
      type: 'Power Failure',
      student: 'Substation Line 2',
      hostel: 'Tamirabarani Hostel',
      time: '5:42 PM',
      status: 'Closed',
      badgeColor: 'neutral',
      icon: <Zap className="w-4 h-4 text-[#8E8E93]" />,
    },
  ];

  const gateHeatmapData = [
    {
      name: 'Main Gate',
      entries: 42,
      exits: 38,
      activityLevel: 'Very High',
      badgeBg: 'bg-red-100 text-red-800 border-red-200',
      dotColor: 'bg-red-500',
    },
    {
      name: 'North Gate',
      entries: 24,
      exits: 19,
      activityLevel: 'High',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
      dotColor: 'bg-orange-500',
    },
    {
      name: 'South Gate',
      entries: 16,
      exits: 12,
      activityLevel: 'Medium',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
    },
    {
      name: 'Service Gate',
      entries: 8,
      exits: 7,
      activityLevel: 'Low',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
  ];

  const liveActivityFeed = [
    {
      id: 'ACT-1',
      event: 'Visitor entered through Main Gate',
      time: '2 mins ago',
      type: 'entry',
      icon: <ArrowDownLeft className="w-4 h-4 text-[#2E7D32]" />,
      bgColor: 'bg-[#E8F5E9]',
    },
    {
      id: 'ACT-2',
      event: 'Maintenance pass verified (Manoj Kumar - Electrician)',
      time: '5 mins ago',
      type: 'pass',
      icon: <Wrench className="w-4 h-4 text-[#996E7D]" />,
      bgColor: 'bg-[#FAF0F3]',
    },
    {
      id: 'ACT-3',
      event: 'SOS Alert triggered in Block C Room 312',
      time: '12 mins ago',
      type: 'sos',
      icon: <AlertTriangle className="w-4 h-4 text-[#D9534F]" />,
      bgColor: 'bg-[#FFEBEE]',
    },
    {
      id: 'ACT-4',
      event: 'Resident Ramesh K exited campus via North Gate',
      time: '18 mins ago',
      type: 'exit',
      icon: <ArrowUpRight className="w-4 h-4 text-[#1976D2]" />,
      bgColor: 'bg-[#E3F2FD]',
    },
    {
      id: 'ACT-5',
      event: 'Curfew announcement acknowledged by Gate Staff',
      time: '24 mins ago',
      type: 'info',
      icon: <Bell className="w-4 h-4 text-[#E65100]" />,
      bgColor: 'bg-[#FFF3E0]',
    },
  ];

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleScanPass = async (code: string) => {
    const raw = code.trim();
    if (!raw) {
      showToast({
        title: 'Input Empty',
        message: 'Please enter or scan a valid Pass ID (e.g., PV-1089 or WP-1082)',
        type: 'info',
      });
      return;
    }

    // Check Visitor Pass first — Firestore-backed. Handles both a scanned QR payload
    // (JSON containing passId + token, verified server-side) and a plain manually-typed pass code.
    try {
      const foundVisitor = await lookupByScan(raw);
      if (foundVisitor) {
        setScannedResultModal({ type: 'visitor', visitorData: foundVisitor });
        showToast({
          title: 'Visitor Pass Verified 🎟️',
          message: `Pass ${foundVisitor.passId} loaded successfully for ${foundVisitor.guestName}`,
          type: 'success',
        });
        return;
      }
    } catch (err) {
      console.error('lookupByScan failed', err);
    }

    // Check if Work Pass
    const query = raw.toUpperCase();
    const foundPass = passes.find((p) => p.id.toUpperCase() === query);
    if (foundPass) {
      setScannedResultModal({ type: 'maintenance', passData: foundPass });
      showToast({
        title: 'Maintenance Pass Verified 🛠️',
        message: `Pass ${foundPass.id} loaded for Tech ${foundPass.employeeName}`,
        type: 'success',
      });
      return;
    }

    showToast({
      title: 'Pass Not Found',
      message: `No active pass found matching code "${raw}". Verify ID or ask the visitor to regenerate it.`,
      type: 'error',
    });
  };

  // Debounced wrapper fed by the live camera scanner — avoids re-triggering handleScanPass
  // dozens of times per second while the same QR sits in frame.
  const handleCameraDecode = (decodedText: string) => {
    const now = Date.now();
    if (
      lastDecodedRef.current &&
      lastDecodedRef.current.text === decodedText &&
      now - lastDecodedRef.current.time < 4000
    ) {
      return;
    }
    lastDecodedRef.current = { text: decodedText, time: now };
    handleScanPass(decodedText);
  };

  const handleCameraError = (message: string) => {
    showToast({ title: 'Camera Issue', message, type: 'error' });
  };

  const handleToggleTorch = async () => {
    try {
      await scannerRef.current?.toggleTorch();
      setFlashOn((prev) => !prev);
    } catch (err) {
      showToast({
        title: 'Torch Unavailable',
        message: 'This camera/browser does not support flashlight control.',
        type: 'error',
      });
    }
  };

  const handleSwitchCamera = async () => {
    try {
      await scannerRef.current?.switchCamera();
      setCameraMode((prev) => (prev === 'rear' ? 'front' : 'rear'));
      setFlashOn(false);
    } catch (err) {
      showToast({ title: 'Camera Switch Failed', message: 'Only one camera was detected on this device.', type: 'info' });
    }
  };

  const handleAllowVisitorEntry = async (visitor: VisitorPassRecord) => {
    try {
      await checkInVisitorPass(visitor.passId, `${userName} (SEC-014)`, settingsForm.assignedGate);
    } catch (err) {
      console.error('checkInVisitorPass failed', err);
      showToast({ title: 'Check-in Failed', message: 'Could not save the check-in. Please try again.', type: 'error' });
      return;
    }

    const newLog: EntryLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      personName: visitor.guestName,
      role: 'Visitor',
      passType: 'Visitor',
      passId: visitor.passId,
      room: `${visitor.block} - ${visitor.room}`,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gate: settingsForm.assignedGate,
      status: 'Inside',
      verifiedBy: `${userName} (SEC-014)`,
    };
    setLogs((prev) => [newLog, ...prev]);

    setScannedResultModal(null);
    showToast({
      title: 'Entry Permitted ✅',
      message: `Visitor ${visitor.guestName} allowed entry at ${settingsForm.assignedGate}. Log saved.`,
      type: 'success',
    });
  };

  const handleRejectVisitorEntry = async (visitor: VisitorPassRecord) => {
    try {
      await rejectVisitorPass(visitor.passId, `${userName} (SEC-014)`);
      setScannedResultModal(null);
      showToast({
        title: 'Entry Denied',
        message: `Visitor pass ${visitor.passId} was rejected at the gate.`,
        type: 'info',
      });
    } catch (err) {
      console.error('rejectVisitorPass failed', err);
      showToast({ title: 'Action Failed', message: 'Could not reject the pass. Please try again.', type: 'error' });
    }
  };

  const handleRecordVisitorExit = async (visitor: VisitorPassRecord) => {
    try {
      await checkOutVisitorPass(visitor.passId, `${userName} (SEC-014)`);
      showToast({
        title: 'Exit Recorded 👋',
        message: `${visitor.guestName} (${visitor.passId}) checked out.`,
        type: 'success',
      });
    } catch (err) {
      console.error('checkOutVisitorPass failed', err);
      showToast({ title: 'Action Failed', message: 'Could not record exit. Please try again.', type: 'error' });
    }
  };

  const handleAllowMaintenanceEntry = (pass: WorkPass) => {
    const newLog: EntryLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      personName: pass.employeeName,
      role: `${pass.role} Technician`,
      passType: 'Maintenance',
      passId: pass.id,
      room: `${pass.block} - ${pass.room}`,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gate: 'Main Hostel Gate',
      status: 'Inside',
      verifiedBy: `${userName} (SEC-014)`,
    };
    setLogs((prev) => [newLog, ...prev]);

    setScannedResultModal(null);
    showToast({
      title: 'Maintenance Entry Permitted 🛠️',
      message: `Technician ${pass.employeeName} cleared at Gate. Entry logged.`,
      type: 'success',
    });
  };

  const handleRecordExit = (logId: string) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: 'Completed',
              exitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : l
      )
    );
    showToast({
      title: 'Exit Recorded 👋',
      message: `Exit timestamp recorded successfully for log ${logId}.`,
      type: 'info',
    });
  };

  // ==================== SOS resolve now writes to Firestore via SosContext ====================
  const handleResolveSOS = (id: string) => {
    markResolved(id, `${userName} (SEC-014)`);
    showToast({
      title: 'SOS Emergency Resolved ✅',
      message: `Emergency alert ${id} marked resolved. Warden & Medical logs updated.`,
      type: 'success',
    });
  };

  // Auto-play the SOS siren the instant a brand-new "Active" alert comes in
  // live from a resident. Tracks already-seen alert IDs so it only fires once
  // per real alert, not on every re-render. Gated by the existing
  // "SOS Audio Siren Alert" setting below. Anyone here can stop it early via
  // the floating <SosSirenBanner /> (rendered near the bottom of this file).
  const seenSosAlertIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    sosAlerts.forEach((sos) => {
      if (sos.status === 'Active' && !seenSosAlertIds.current.has(sos.id)) {
        seenSosAlertIds.current.add(sos.id);
        if (settingsForm.audioSiren) {
          playSosSiren(8000);
        }
      }
    });
  }, [sosAlerts, settingsForm.audioSiren]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'Settings Saved ✅',
      message: 'Gate security parameters & notification preferences updated successfully.',
      type: 'success',
    });
  };

  // Title lookup
  const getPageTitle = () => {
    switch (activeRoute) {
      case '/security/dashboard':
        return 'Security Personnel Dashboard';
      case '/security/qr-scanner':
        return 'QR Pass Gate Scanner';
      case '/security/verification':
        return 'Visitor Verification Center';
      case '/security/logs':
        return 'Gate Entry & Exit Logs';
      case '/security/sos':
        return 'Emergency SOS Dashboard';
      case '/security/notifications':
        return 'Security Notifications';
      case '/security/profile':
        return 'Security Officer Profile';
      case '/security/settings':
        return 'Gate Control Settings';
      default:
        return 'Security Personnel Dashboard';
    }
  };

  const renderBreadcrumbs = (title: string) => (
    <div className="flex items-center gap-2 text-xs text-[#8E8E93] mb-2 font-body">
      <span>Security Portal</span>
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-[#1A1A1A] font-bold">{title}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] font-body">
      {/* SIDEBAR — now a top-level sibling, fixed-positioned by the component itself */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={(r) => setActiveRoute(r)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onLogout={onLogout}
        onOpenAiHelper={() => setShowAiModal(true)}
        role="security"
      />

      {/* PAGE WRAPPER — reserves space for the fixed sidebar via padding-left,
          so TopBar and content shift right instead of being covered by it */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          sidebarCollapsed ? 'md:pl-[80px]' : 'md:pl-[280px]'
        }`}
      >
        {/* TOP BAR */}
        <TopBar
          currentPageTitle={getPageTitle()}
          userName={userName}
          userRole="Security Personnel"
          avatarInitials="SK"
          avatarColor="#2A5C8A"
          hostelBlock="Main Gate"
          roomNumber="SEC-014"
          unreadCount={3}
          showBackButton={activeRoute !== '/security/dashboard'}
          onBack={() => setActiveRoute('/security/dashboard')}
          onOpenAiHelper={() => setShowAiModal(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigate={(r) => setActiveRoute(r)}
          onLogout={onLogout}
          role="security"
          profileEmployeeId="SEC-014"
          profileEmail="suresh.kumar@vaigai.edu"
          profileAccessLevel="Gate Security Clearance"
          profileOfficeLocation="Main Hostel Gate (#1)"
          profilePrimaryCampus="Main Campus"
          profileStats={[
            { label: 'Visitors Cleared Today', value: '24', color: '#2E7D32' },
            { label: 'Active Tech Passes', value: String(passes.length), color: '#2A5C8A' },
            { label: 'Pending Visitors', value: String(visitorPasses.filter((v) => v.status === 'pending').length), color: '#D97706' },
            { label: 'Active SOS', value: String(sosAlerts.filter((s) => s.status === 'Active').length), color: '#D9534F' },
          ]}
        />

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* ==================== 1. DASHBOARD OVERVIEW ==================== */}
          {activeRoute === '/security/dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Overview')}

              {/* GREETING BANNER */}
              <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2A5C8A] to-[#1A1A1A] rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <ShieldCheck className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" /> Gate Status: ACTIVE • Shift: Morning
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Good Evening 👋 {userName}
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-white/80 max-w-xl">
                    Main Hostel Security Gate (#1) • Officer ID: <strong className="font-mono text-amber-300">SEC-014</strong>. All systems, QR cameras and emergency alerts operating normally.
                  </p>
                </div>
              </div>

              {/* TODAY'S SUMMARY STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-4 space-y-2 border-[#E7E4DF] hover:border-[#2A5C8A] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Visitors In</span>
                    <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
                      <ArrowDownLeft className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-[#1A1A1A]">24</div>
                  <p className="text-[11px] text-[#2E7D32] font-semibold">↑ 12% vs yesterday</p>
                </Card>

                <Card className="p-4 space-y-2 border-[#E7E4DF] hover:border-[#2A5C8A] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Visitors Out</span>
                    <span className="p-2 rounded-xl bg-[#E3F2FD] text-[#1976D2]">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-[#1A1A1A]">18</div>
                  <p className="text-[11px] text-[#1976D2] font-semibold">6 Currently inside</p>
                </Card>

                <Card className="p-4 space-y-2 border-[#E7E4DF] hover:border-[#2A5C8A] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Active Tech Passes</span>
                    <span className="p-2 rounded-xl bg-[#FFF3E0] text-[#E65100]">
                      <Wrench className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-[#1A1A1A]">
                    {passes.length}
                  </div>
                  <p className="text-[11px] text-[#E65100] font-semibold">Maintenance Active</p>
                </Card>

                <Card className="p-4 space-y-2 border-[#E7E4DF] hover:border-[#2A5C8A] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Pending Visitors</span>
                    <span className="p-2 rounded-xl bg-[#FFF8E1] text-[#F57F17]">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-[#1A1A1A]">
                    {visitorPasses.filter((v) => v.status === 'pending').length}
                  </div>
                  <p className="text-[11px] text-[#F57F17] font-semibold">Requires Clearance</p>
                </Card>

                <Card className="p-4 space-y-2 border-[#D9534F] bg-[#FFF8F8]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D9534F] uppercase tracking-wider">Active SOS</span>
                    <span className="p-2 rounded-xl bg-[#FFEBEE] text-[#D9534F] animate-pulse">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-[#D9534F]">
                    {sosAlerts.filter((s) => s.status === 'Active').length}
                  </div>
                  <p className="text-[11px] text-[#D9534F] font-bold">Urgent Dispatch</p>
                </Card>
              </div>

              {/* QUICK ACTIONS */}
              <div className="space-y-3">
                <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A] uppercase tracking-wider">
                  Gate Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Card
                    onClick={() => setActiveRoute('/security/qr-scanner')}
                    className="p-5 border-[#E7E4DF] hover:border-[#996E7D] hover:shadow-md cursor-pointer transition-all group bg-gradient-to-br from-white to-[#FAF8F2]"
                  >
                    <div className="p-3 rounded-2xl bg-[#996E7D]/10 text-[#996E7D] w-fit mb-3 group-hover:bg-[#996E7D] group-hover:text-white transition-colors">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">Open QR Scanner</h4>
                    <p className="font-body text-xs text-[#8E8E93] mt-1">
                      Scan Visitor & Maintenance Passes at Gate
                    </p>
                  </Card>

                  <Card
                    onClick={() => setActiveRoute('/security/verification')}
                    className="p-5 border-[#E7E4DF] hover:border-[#2A5C8A] hover:shadow-md cursor-pointer transition-all group bg-gradient-to-br from-white to-[#FAF8F2]"
                  >
                    <div className="p-3 rounded-2xl bg-[#2A5C8A]/10 text-[#2A5C8A] w-fit mb-3 group-hover:bg-[#2A5C8A] group-hover:text-white transition-colors">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">Verify Visitor</h4>
                    <p className="font-body text-xs text-[#8E8E93] mt-1">
                      Review parent & guest pre-approvals
                    </p>
                  </Card>

                  <Card
                    onClick={() => setActiveRoute('/security/logs')}
                    className="p-5 border-[#E7E4DF] hover:border-[#1976D2] hover:shadow-md cursor-pointer transition-all group bg-gradient-to-br from-white to-[#FAF8F2]"
                  >
                    <div className="p-3 rounded-2xl bg-[#1976D2]/10 text-[#1976D2] w-fit mb-3 group-hover:bg-[#1976D2] group-hover:text-white transition-colors">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">View Entry Logs</h4>
                    <p className="font-body text-xs text-[#8E8E93] mt-1">
                      Search historical gate entries & exits
                    </p>
                  </Card>

                  <Card
                    onClick={() => setActiveRoute('/security/sos')}
                    className="p-5 border-[#D9534F]/30 bg-[#FFF8F8] hover:border-[#D9534F] hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className="p-3 rounded-2xl bg-[#D9534F]/10 text-[#D9534F] w-fit mb-3 group-hover:bg-[#D9534F] group-hover:text-white transition-colors">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading text-sm font-bold text-[#D9534F]">Emergency Panel</h4>
                    <p className="font-body text-xs text-[#D9534F]/80 mt-1">
                      Active SOS alerts & Warden dispatch
                    </p>
                  </Card>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECURITY ANALYTICS ENHANCEMENT: SECURITY INSIGHTS SECTION */}
              {/* ========================================================= */}
              <div className="space-y-6 pt-4 border-t border-[#E7E4DF]">
                {/* SECTION HEADER & QUICK FILTERS */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-[#2A5C8A]" />
                      Security Insights
                    </h2>
                    <p className="font-body text-xs text-[#666666]">
                      Real-time analytics, visitor trends, gate heatmap and pass distribution
                    </p>
                  </div>

                  {/* QUICK FILTER CHIPS */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-[#EAE7E1] p-1.5 rounded-2xl border border-[#E7E4DF]">
                    {(
                      [
                        'Today',
                        'Yesterday',
                        'Last 7 Days',
                        'Last 30 Days',
                        'Morning Shift',
                        'Evening Shift',
                        'Night Shift',
                      ] as FilterOption[]
                    ).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setAnalyticsFilter(filter);
                          showToast({
                            title: `Filter Applied: ${filter}`,
                            message: `Security analytics updated for ${filter}.`,
                            type: 'info',
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          analyticsFilter === filter
                            ? 'bg-[#2A5C8A] text-white shadow-sm'
                            : 'text-[#666666] hover:text-[#1A1A1A] hover:bg-white/50'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. SHIFT SUMMARY (Compact Statistic Cards Row) */}
                <div className="space-y-3">
                  <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#996E7D]" />
                    Current Shift Summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Card className="p-3.5 space-y-1.5 border-[#E7E4DF] hover:border-[#2A5C8A] transition-all bg-white hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Visitors In</span>
                        <ArrowDownLeft className="w-4 h-4 text-[#2E7D32]" />
                      </div>
                      <div className="font-heading text-xl font-black text-[#1A1A1A]">24</div>
                      <p className="text-[10px] text-[#666666]">Main Gate & North Gate</p>
                    </Card>

                    <Card className="p-3.5 space-y-1.5 border-[#E7E4DF] hover:border-[#2A5C8A] transition-all bg-white hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Visitors Out</span>
                        <ArrowUpRight className="w-4 h-4 text-[#1976D2]" />
                      </div>
                      <div className="font-heading text-xl font-black text-[#1A1A1A]">18</div>
                      <p className="text-[10px] text-[#666666]">Cleared Exits</p>
                    </Card>

                    <Card className="p-3.5 space-y-1.5 border-[#E7E4DF] hover:border-[#2A5C8A] transition-all bg-white hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Maintenance</span>
                        <Wrench className="w-4 h-4 text-[#E65100]" />
                      </div>
                      <div className="font-heading text-xl font-black text-[#1A1A1A]">8</div>
                      <p className="text-[10px] text-[#666666]">Tech Entries Today</p>
                    </Card>

                    <Card className="p-3.5 space-y-1.5 border-[#E7E4DF] hover:border-[#2A5C8A] transition-all bg-white hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Pending Exits</span>
                        <Clock className="w-4 h-4 text-[#F57F17]" />
                      </div>
                      <div className="font-heading text-xl font-black text-[#1A1A1A]">6</div>
                      <p className="text-[10px] text-[#F57F17] font-semibold">Inside Campus</p>
                    </Card>

                    <Card className="p-3.5 space-y-1.5 border-[#E7E4DF] hover:border-[#2A5C8A] transition-all bg-white hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Active Passes</span>
                        <ShieldCheck className="w-4 h-4 text-[#2A5C8A]" />
                      </div>
                      <div className="font-heading text-xl font-black text-[#1A1A1A]">12</div>
                      <p className="text-[10px] text-[#666666]">Valid Work Passes</p>
                    </Card>

                    <Card className="p-3.5 space-y-1.5 border-[#D9534F]/30 bg-[#FFF8F8] hover:scale-[1.02] transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#D9534F] uppercase">SOS Handled</span>
                        <AlertTriangle className="w-4 h-4 text-[#D9534F]" />
                      </div>
                      <div className="font-heading text-xl font-black text-[#D9534F]">3</div>
                      <p className="text-[10px] text-[#D9534F]">All Resolved</p>
                    </Card>
                  </div>
                </div>

                {/* CHARTS GRID: VISITOR TRENDS & PASS BREAKDOWN */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 1. VISITOR TRENDS LINE CHART */}
                  <Card className="lg:col-span-2 p-5 space-y-4 border-[#E7E4DF] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
                      <div>
                        <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                          Visitor Trends
                        </h3>
                        <p className="font-body text-xs text-[#8E8E93]">
                          Hourly visitor entries and exits throughout the day ({analyticsFilter})
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-[#2E7D32] font-semibold">
                          <span className="w-3 h-3 rounded-full bg-[#2E7D32]" /> Entries
                        </span>
                        <span className="flex items-center gap-1 text-[#1976D2] font-semibold">
                          <span className="w-3 h-3 rounded-full bg-[#1976D2]" /> Exits
                        </span>
                      </div>
                    </div>

                    <div className="h-64 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={visitorTrendsData}>
                          <XAxis dataKey="time" stroke="#8E8E93" fontSize={11} tickLine={false} />
                          <YAxis stroke="#8E8E93" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1A1A1A',
                              borderColor: '#333',
                              borderRadius: '12px',
                              color: '#FFF',
                              fontSize: '12px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Entries"
                            stroke="#2E7D32"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#2E7D32' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Exits"
                            stroke="#1976D2"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#1976D2' }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* 2. PASS BREAKDOWN DOUGHNUT CHART */}
                  <Card className="p-5 space-y-4 border-[#E7E4DF] bg-white flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                        Pass Distribution
                      </h3>
                      <p className="font-body text-xs text-[#8E8E93]">
                        Active pass types currently issued
                      </p>
                    </div>

                    <div className="relative h-52 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={passDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {passDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1A1A1A',
                              borderRadius: '12px',
                              color: '#FFF',
                              fontSize: '12px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Doughnut Center Display */}
                      <div className="absolute text-center pointer-events-none">
                        <span className="font-heading text-2xl font-black text-[#1A1A1A]">120</span>
                        <span className="block text-[10px] text-[#8E8E93] font-bold uppercase">
                          Total Passes
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#E7E4DF]">
                      {passDistributionData.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[#666666] truncate">{item.name}:</span>
                          <strong className="text-[#1A1A1A]">{item.value}%</strong>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* HEATMAP & SOS TIMELINE ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 4. GATE ACTIVITY HEATMAP */}
                  <Card className="p-5 space-y-4 border-[#E7E4DF] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
                      <div>
                        <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                          Gate Activity Heatmap
                        </h3>
                        <p className="font-body text-xs text-[#8E8E93]">
                          Live traffic load across campus access points
                        </p>
                      </div>
                      <Badge variant="primary" size="sm">
                        4 Gates Online
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {gateHeatmapData.map((gate) => (
                        <div
                          key={gate.name}
                          className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] hover:border-[#2A5C8A] hover:shadow-md transition-all group space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-heading text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#2A5C8A]" />
                              {gate.name}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${gate.badgeBg} flex items-center gap-1`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${gate.dotColor} animate-ping`} />
                              {gate.activityLevel}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            <div className="bg-white p-2 rounded-xl border border-[#E7E4DF]">
                              <span className="text-[10px] text-[#8E8E93] block">Today's Entries</span>
                              <strong className="text-[#2E7D32] font-black text-base">
                                {gate.entries}
                              </strong>
                            </div>
                            <div className="bg-white p-2 rounded-xl border border-[#E7E4DF]">
                              <span className="text-[10px] text-[#8E8E93] block">Today's Exits</span>
                              <strong className="text-[#1976D2] font-black text-base">
                                {gate.exits}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* 3. SOS ACTIVITY TIMELINE */}
                  <Card className="p-5 space-y-4 border-[#E7E4DF] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
                      <div>
                        <h3 className="font-heading text-base font-extrabold text-[#D9534F] flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-[#D9534F]" />
                          Emergency Activity Timeline
                        </h3>
                        <p className="font-body text-xs text-[#8E8E93]">
                          Recent emergency triggers & response statuses
                        </p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => setActiveRoute('/security/sos')}>
                        View SOS Panel
                      </Button>
                    </div>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E7E4DF]">
                      {emergencyTimelineItems.map((item) => (
                        <div key={item.id} className="relative group">
                          {/* Timeline dot */}
                          <div className="absolute -left-6 top-1 p-1 rounded-full bg-white border-2 border-[#2A5C8A] shadow-sm">
                            {item.icon}
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1.5 hover:border-[#2A5C8A] transition-all">
                            <div className="flex items-center justify-between">
                              <span className="font-heading text-xs font-bold text-[#1A1A1A]">
                                {item.type}
                              </span>
                              <Badge
                                variant={
                                  item.status === 'Resolved'
                                    ? 'success'
                                    : item.status === 'Responding'
                                    ? 'warning'
                                    : 'secondary'
                                }
                                size="sm"
                              >
                                {item.status}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-xs text-[#666666]">
                              <span>
                                {item.student} • <strong className="text-[#1A1A1A]">{item.hostel}</strong>
                              </span>
                              <span className="font-mono text-[#8E8E93] text-[11px]">{item.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* 6. LIVE ACTIVITY FEED */}
                <Card className="p-5 space-y-4 border-[#E7E4DF] bg-white">
                  <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-ping" />
                      <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                        Live Security Feed
                      </h3>
                    </div>
                    <span className="text-xs text-[#8E8E93] font-mono">Auto-updating live</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {liveActivityFeed.map((feed) => (
                      <div
                        key={feed.id}
                        className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] flex items-center gap-3 hover:border-[#2A5C8A] transition-all"
                      >
                        <span className={`p-2 rounded-xl ${feed.bgColor} shrink-0`}>
                          {feed.icon}
                        </span>
                        <div className="space-y-0.5 overflow-hidden">
                          <p className="text-xs font-semibold text-[#1A1A1A] truncate">{feed.event}</p>
                          <span className="text-[10px] text-[#8E8E93] block font-mono">{feed.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== 2. QR SCANNER SCREEN WITH SCAN HISTORY ==================== */}
          {activeRoute === '/security/qr-scanner' && (
            <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
              {renderBreadcrumbs('QR Scanner')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Gate Pass QR Scanner
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Align pass QR code within camera frame or enter pass ID manually
                  </p>
                </div>
              </div>

              {/* CAMERA PREVIEW & SCANNER INTERFACE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 p-6 bg-[#1A1A1A] text-white rounded-[24px] border border-white/10 space-y-5 relative overflow-hidden shadow-2xl">
                  {/* Camera Header Bar */}
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-ping" />
                      <span className="font-mono text-white/90">CAM_01 • Main Gate Lens</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleTorch}
                        disabled={!torchSupported}
                        className={`p-2 rounded-xl transition-colors ${
                          flashOn ? 'bg-amber-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                        } ${!torchSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
                        title={torchSupported ? 'Toggle Flashlight' : 'Flashlight not supported on this camera/browser'}
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSwitchCamera}
                        className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                        title="Switch Camera"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Live Camera Frame Viewport — real getUserMedia feed + QR decode via html5-qrcode */}
                  <div className="relative aspect-4/3 rounded-2xl bg-black border-2 border-dashed border-white/20 overflow-hidden">
                    <GateQrScanner
                      ref={scannerRef}
                      onDecode={handleCameraDecode}
                      onError={handleCameraError}
                      onTorchSupportChange={setTorchSupported}
                      paused={!!scannedResultModal}
                    />

                    {/* Decorative scan-frame overlay (purely visual, sits above the video) */}
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#996E7D] rounded-tl-lg" />
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#996E7D] rounded-tr-lg" />
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#996E7D] rounded-bl-lg" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#996E7D] rounded-br-lg" />
                      <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#996E7D] to-transparent shadow-[0_0_15px_#996E7D] animate-scanLine" />
                    </div>
                  </div>
                </Card>

                {/* MANUAL ENTRY */}
                <div className="space-y-6">
                  <Card className="p-5 space-y-4 border-[#E7E4DF]">
                    <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A]">
                      Manual Pass Verification
                    </h3>
                    <div className="space-y-3">
                      <Input
                        label="Enter Pass Code"
                        placeholder="e.g. VP-1089 or WP-1081"
                        value={manualPassInput}
                        onChange={(e) => setManualPassInput(e.target.value)}
                      />
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full"
                        onClick={() => handleScanPass(manualPassInput)}
                      >
                        Verify Pass Code
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-5 space-y-3 border-[#E7E4DF] bg-[#FAF8F2]">
                    <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A]">
                      Verification Tips
                    </h3>
                    <ul className="text-xs text-[#666666] space-y-2 list-disc pl-4">
                      <li>Hold smartphone screen 15-20cm from camera lens.</li>
                      <li>Verify visitor government ID matches pass details.</li>
                      <li>Yellow work passes require approved extensions for overtime.</li>
                    </ul>
                  </Card>
                </div>
              </div>

              {/* DETAILED SCAN HISTORY TABLE VIEW */}
              <Card className="p-5 space-y-4 border-[#E7E4DF] bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4DF] pb-3">
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-[#2A5C8A]" />
                      Scan History & Recent Verifications
                    </h3>
                    <p className="font-body text-xs text-[#8E8E93]">
                      List of all recent verification attempts logged at Main Gate camera
                    </p>
                  </div>

                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Search scan history..."
                      value={scanHistorySearch}
                      onChange={(e) => setScanHistorySearch(e.target.value)}
                      leftIcon={<Search className="w-4 h-4 text-[#8E8E93]" />}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E7E4DF]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF8F2] border-b border-[#E7E4DF] text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                        <th className="p-3.5">Person Name</th>
                        <th className="p-3.5">Pass Type & ID</th>
                        <th className="p-3.5">Gate Location</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Verification Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4DF] text-xs">
                      {logs
                        .filter(
                          (l) =>
                            l.personName.toLowerCase().includes(scanHistorySearch.toLowerCase()) ||
                            l.passId.toLowerCase().includes(scanHistorySearch.toLowerCase()) ||
                            l.role.toLowerCase().includes(scanHistorySearch.toLowerCase())
                        )
                        .map((l) => (
                          <tr key={l.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                            <td className="p-3.5">
                              <strong className="block text-[#1A1A1A]">{l.personName}</strong>
                              <span className="text-[11px] text-[#8E8E93]">{l.role}</span>
                            </td>
                            <td className="p-3.5">
                              <Badge
                                variant={l.passType === 'Visitor' ? 'primary' : 'warning'}
                                size="sm"
                              >
                                {l.passType} ({l.passId})
                              </Badge>
                            </td>
                            <td className="p-3.5 text-[#1A1A1A] font-medium">{l.gate}</td>
                            <td className="p-3.5 text-[#2E7D32] font-mono font-semibold">
                              {l.entryTime}
                            </td>
                            <td className="p-3.5">
                              <Badge
                                variant={l.status === 'Inside' ? 'warning' : 'success'}
                                size="sm"
                              >
                                {l.status === 'Inside' ? 'Cleared (In Campus)' : 'Completed Exit'}
                              </Badge>
                            </td>
                            <td className="p-3.5 text-right">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleScanPass(l.passId)}
                              >
                                Re-verify Pass
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 3. VISITOR VERIFICATION SCREEN ==================== */}
          {activeRoute === '/security/verification' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Visitor Verification')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Pending Visitor Clearances ({visitorPasses.filter((v) => v.status === 'pending').length})
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Pre-approved parent and visitor passes requesting gate entry
                  </p>
                </div>
              </div>

              {visitorPasses.length === 0 && (
                <Card className="p-10 text-center border-[#E7E4DF]">
                  <p className="text-sm text-[#666666]">No visitor passes have been generated yet.</p>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visitorPasses.map((v) => (
                  <Card key={v.passId} className="p-5 space-y-4 border-[#E7E4DF] hover:border-[#2A5C8A] transition-all">
                    <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-[#E3F2FD] text-[#1976D2]">
                          <User className="w-5 h-5" />
                        </span>
                        <div>
                          <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A]">
                            {v.guestName}
                          </h3>
                          <span className="font-mono text-xs text-[#996E7D]">{v.passId}</span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          v.status === 'approved' || v.status === 'checked_in' || v.status === 'checked_out'
                            ? 'success'
                            : v.status === 'pending'
                            ? 'warning'
                            : 'secondary'
                        }
                        size="sm"
                      >
                        {v.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs bg-[#FAF8F2] p-3 rounded-xl border border-[#E7E4DF]">
                      <div className="flex justify-between">
                        <span className="text-[#8E8E93]">Resident Host:</span>
                        <strong className="text-[#1A1A1A]">{v.residentName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E8E93]">Location:</span>
                        <strong className="text-[#996E7D]">{v.block} (Room {v.room})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E8E93]">Relation:</span>
                        <strong className="text-[#1A1A1A]">{v.relation}</strong>
                      </div>
                      <div className="flex justify-between border-t border-[#E7E4DF] pt-2">
                        <span className="text-[#8E8E93]">Scheduled:</span>
                        <span className="text-[#1A1A1A] font-medium">{v.scheduledLabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleScanPass(v.passId)}
                      >
                        View Pass
                      </Button>
                      {v.status === 'checked_in' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleRecordVisitorExit(v)}
                        >
                          Mark Exit
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1 text-xs bg-[#2E7D32] hover:bg-[#1B5E20]"
                            onClick={() => handleAllowVisitorEntry(v)}
                            disabled={v.status === 'rejected' || v.status === 'cancelled' || v.status === 'checked_out'}
                          >
                            Allow Entry ✅
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs bg-[#FDF2F2] hover:bg-[#F8D7DA] text-[#D9534F]"
                            onClick={() => handleRejectVisitorEntry(v)}
                            disabled={v.status === 'rejected' || v.status === 'cancelled' || v.status === 'checked_out'}
                          >
                            Deny
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. ENTRY & EXIT LOGS SCREEN ==================== */}
          {activeRoute === '/security/logs' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Entry & Exit Logs')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Gate Entry & Exit Logs
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Real-time register of all visitor and maintenance personnel entering Main Gate
                  </p>
                </div>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <Card className="p-4 space-y-4 border-[#E7E4DF]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Search person, pass ID, room number..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      leftIcon={<Search className="w-4 h-4 text-[#8E8E93]" />}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#8E8E93]">Type:</span>
                    <select
                      value={logTypeFilter}
                      onChange={(e) => setLogTypeFilter(e.target.value as any)}
                      className="w-full bg-[#FAF8F2] border border-[#E7E4DF] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#996E7D]"
                    >
                      <option value="All">All Passes</option>
                      <option value="Visitor">Visitors</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#8E8E93]">Status:</span>
                    <select
                      value={logStatusFilter}
                      onChange={(e) => setLogStatusFilter(e.target.value as any)}
                      className="w-full bg-[#FAF8F2] border border-[#E7E4DF] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#996E7D]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Inside">Inside Hostel</option>
                      <option value="Completed">Completed Exits</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* LOG TABLE / CARDS */}
              <Card className="p-0 overflow-hidden border-[#E7E4DF]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF8F2] border-b border-[#E7E4DF] text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                        <th className="p-4">Person Details</th>
                        <th className="p-4">Pass Type</th>
                        <th className="p-4">Destination</th>
                        <th className="p-4">Entry Time</th>
                        <th className="p-4">Exit Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4DF] text-xs">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                          <td className="p-4">
                            <strong className="block text-[#1A1A1A] font-bold">{log.personName}</strong>
                            <span className="text-[11px] text-[#8E8E93]">{log.role}</span>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={log.passType === 'Visitor' ? 'primary' : 'warning'}
                              size="sm"
                            >
                              {log.passType} ({log.passId})
                            </Badge>
                          </td>
                          <td className="p-4 text-[#1A1A1A] font-medium">{log.room}</td>
                          <td className="p-4 text-[#2E7D32] font-mono font-semibold">{log.entryTime}</td>
                          <td className="p-4 text-[#8E8E93] font-mono">
                            {log.exitTime || <span className="text-[#E65100] italic">In Hostel</span>}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={log.status === 'Inside' ? 'warning' : 'success'}
                              size="sm"
                            >
                              {log.status === 'Inside' ? 'Inside Hostel' : 'Exited'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            {log.status === 'Inside' ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleRecordExit(log.id)}
                              >
                                Record Exit
                              </Button>
                            ) : (
                              <span className="text-[#2E7D32] text-[11px] font-semibold">Logged</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 5. SOS ALERTS SCREEN (live data) ==================== */}
          {activeRoute === '/security/sos' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('SOS Alerts')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#D9534F] flex items-center gap-2">
                    <AlertTriangle className="w-7 h-7 text-[#D9534F] animate-pulse" />
                    Emergency SOS Dashboard
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Immediate responder dispatch center for resident emergency alerts
                  </p>
                </div>
              </div>

              {sosAlerts.length === 0 && (
                <Card className="p-8 text-center border-[#E7E4DF]">
                  <ShieldCheck className="w-10 h-10 text-[#2E7D32] mx-auto mb-3" />
                  <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">No active emergencies</h4>
                  <p className="font-body text-xs text-[#666666] mt-1">All clear across campus right now.</p>
                </Card>
              )}

              <div className="space-y-4">
                {sosAlerts.map((sos) => (
                  <Card
                    key={sos.id}
                    className="p-6 border-2 border-[#D9534F] bg-[#FFF8F8] space-y-4 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9534F]/30 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="p-3 rounded-2xl bg-[#FFEBEE] text-[#D9534F] border border-[#D9534F]/30 animate-bounce">
                          <Flame className="w-6 h-6" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-lg font-black text-[#1A1A1A]">
                              {sos.studentName}
                            </h3>
                            <Badge variant="danger" size="md">
                              {sos.priority} SOS
                            </Badge>
                            {sos.status === 'Dispatched' && (
                              <Badge variant="warning" size="sm">Dispatched</Badge>
                            )}
                          </div>
                          <p className="font-body text-xs text-[#666666]">
                            Phone: {sos.phone}
                            {sos.rollNo ? ` • Roll No: ${sos.rollNo}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#8E8E93] block">Hostel Location</span>
                        <strong className="font-heading text-base font-extrabold text-[#D9534F]">
                          {sos.hostelBlock}, {sos.room}
                          {sos.floor ? ` (${sos.floor})` : ''}
                        </strong>
                        {sos.locationMode === 'manual' && sos.locationNote && (
                          <p className="text-[11px] text-[#666666] mt-1 max-w-[220px]">"{sos.locationNote}"</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#D9534F]/30 text-xs space-y-1">
                      <span className="font-bold text-[#D9534F] block">Emergency Type & Details:</span>
                      <p className="text-[#1A1A1A] font-medium text-sm">{sos.emergencyType}</p>
                      {sos.description && <p className="text-[#666666] pt-1">{sos.description}</p>}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                      <a
                        href={`tel:${sos.phone}`}
                        className="px-4 py-2 rounded-xl bg-white border border-[#E7E4DF] text-xs font-bold text-[#1A1A1A] flex items-center gap-2 hover:bg-[#FAF8F2]"
                      >
                        <Phone className="w-4 h-4 text-[#2E7D32]" /> Call Resident
                      </a>

                      <a
                        href="tel:+919876500000"
                        className="px-4 py-2 rounded-xl bg-white border border-[#E7E4DF] text-xs font-bold text-[#1A1A1A] flex items-center gap-2 hover:bg-[#FAF8F2]"
                      >
                        <Shield className="w-4 h-4 text-[#2A5C8A]" /> Call Warden
                      </a>

                      <Button
                        variant="primary"
                        size="md"
                        className="bg-[#D9534F] hover:bg-[#C9302C]"
                        onClick={() => handleResolveSOS(sos.id)}
                      >
                        Mark Emergency Resolved ✅
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 6. NOTIFICATIONS SCREEN ==================== */}
          {activeRoute === '/security/notifications' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
              {renderBreadcrumbs('Notifications')}

              <div className="flex items-center justify-between">
                <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                  Gate Notifications
                </h1>
                <Button variant="secondary" size="sm" onClick={() => showToast({ title: 'Cleared', message: 'All notifications marked read', type: 'info' })}>
                  Mark All Read
                </Button>
              </div>

              <div className="space-y-3">
                <Card className="p-4 space-y-1 border-[#E7E4DF]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#D9534F] flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Urgent SOS Triggered
                    </span>
                    <span className="text-[#8E8E93]">12 mins ago</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]">
                    Student Priya R in Block C Room 312 triggered medical emergency SOS alert.
                  </p>
                </Card>

                <Card className="p-4 space-y-1 border-[#E7E4DF]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1976D2] flex items-center gap-1">
                      <User className="w-4 h-4" /> Visitor Arrival Request
                    </span>
                    <span className="text-[#8E8E93]">1 hour ago</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]">
                    Parent Ramesh K pre-approved visitor pass VP-1089 ready at gate.
                  </p>
                </Card>

                <Card className="p-4 space-y-1 border-[#E7E4DF]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E65100] flex items-center gap-1">
                      <Wrench className="w-4 h-4" /> Maintenance Gate Pass
                    </span>
                    <span className="text-[#8E8E93]">2 hours ago</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]">
                    Electrician Manoj Kumar generated active digital work pass WP-9081.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== 7. PROFILE SCREEN ==================== */}
          {activeRoute === '/security/profile' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
              {renderBreadcrumbs('Security Profile')}

              <Card className="p-6 space-y-6 border-[#E7E4DF]">
                <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-[#E7E4DF] pb-6">
                  <div className="w-20 h-20 rounded-full bg-[#2A5C8A] text-white flex items-center justify-center font-heading text-2xl font-black shadow-lg">
                    SK
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">{userName}</h1>
                    <p className="font-body text-xs text-[#666666]">Senior Security Officer • Gate Clearance Officer</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="primary" size="sm">Employee ID: SEC-014</Badge>
                      <Badge variant="success" size="sm">On Duty (Gate 1)</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] block">Assigned Duty Gate</span>
                    <strong className="text-[#1A1A1A] text-sm">Main Hostel Gate (#1)</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] block">Shift Schedule</span>
                    <strong className="text-[#1A1A1A] text-sm">Morning (06:00 AM - 02:00 PM)</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] block">Contact Phone</span>
                    <strong className="text-[#1A1A1A] text-sm">+91 98765 43210</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] block">Official Email</span>
                    <strong className="text-[#1A1A1A] text-sm">suresh.kumar@vaigai.edu</strong>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 8. SETTINGS SCREEN ==================== */}
          {activeRoute === '/security/settings' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
              {renderBreadcrumbs('Gate Settings')}

              <form onSubmit={handleSaveSettings}>
                <Card className="p-6 space-y-6 border-[#E7E4DF]">
                  <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-4">
                    <div>
                      <h2 className="font-heading text-lg font-black text-[#1A1A1A]">
                        Gate Control & Security Settings
                      </h2>
                      <p className="font-body text-xs text-[#666666]">
                        Configure scanner behavior, audio alerts, and duty parameters
                      </p>
                    </div>
                    <Button variant="primary" size="sm" type="submit" className="gap-2">
                      <Save className="w-4 h-4" /> Save Settings
                    </Button>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Audio Siren Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                      <div className="space-y-0.5">
                        <strong className="block text-[#1A1A1A]">SOS Audio Siren Alert</strong>
                        <span className="text-[#8E8E93]">Play high-priority siren on incoming emergency alert</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.audioSiren}
                        onChange={(e) => setSettingsForm({ ...settingsForm, audioSiren: e.target.checked })}
                        className="w-4 h-4 accent-[#996E7D] cursor-pointer"
                      />
                    </div>

                    {/* Auto Entry Log Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                      <div className="space-y-0.5">
                        <strong className="block text-[#1A1A1A]">Automatic Entry Logging</strong>
                        <span className="text-[#8E8E93]">Automatically record entry upon scanning valid pass</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.autoLogEntry}
                        onChange={(e) => setSettingsForm({ ...settingsForm, autoLogEntry: e.target.checked })}
                        className="w-4 h-4 accent-[#996E7D] cursor-pointer"
                      />
                    </div>

                    {/* Camera Torch Default */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                      <div className="space-y-0.5">
                        <strong className="block text-[#1A1A1A]">Enable Camera Flashlight by Default</strong>
                        <span className="text-[#8E8E93]">Auto-enable torch during night scan mode</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.cameraFlashDefault}
                        onChange={(e) => setSettingsForm({ ...settingsForm, cameraFlashDefault: e.target.checked })}
                        className="w-4 h-4 accent-[#996E7D] cursor-pointer"
                      />
                    </div>

                    {/* Display Language */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                      <div className="space-y-0.5">
                        <strong className="block text-[#1A1A1A]">Gate Interface Language</strong>
                        <span className="text-[#8E8E93]">Selected UI display language</span>
                      </div>
                      <select
                        value={settingsForm.displayLanguage}
                        onChange={(e) => setSettingsForm({ ...settingsForm, displayLanguage: e.target.value })}
                        className="bg-white border border-[#E7E4DF] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#996E7D]"
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                      </select>
                    </div>

                    {/* Duty Gate Designation */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                      <div className="space-y-0.5">
                        <strong className="block text-[#1A1A1A]">Assigned Gate Location</strong>
                        <span className="text-[#8E8E93]">Active security post camera identifier</span>
                      </div>
                      <select
                        value={settingsForm.assignedGate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, assignedGate: e.target.value })}
                        className="bg-white border border-[#E7E4DF] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#996E7D]"
                      >
                        <option value="Main Hostel Gate (#1)">Main Hostel Gate (#1)</option>
                        <option value="North Gate (#2)">North Gate (#2)</option>
                        <option value="South Gate (#3)">South Gate (#3)</option>
                        <option value="Service Gate (#4)">Service Gate (#4)</option>
                      </select>
                    </div>

                    {/* Notify Warden on SOS */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                      <div className="space-y-0.5">
                        <strong className="block text-[#1A1A1A]">Direct Warden Dispatch</strong>
                        <span className="text-[#8E8E93]">Send SMS & push alerts to Chief Warden on SOS trigger</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.notifyWardenOnSOS}
                        onChange={(e) => setSettingsForm({ ...settingsForm, notifyWardenOnSOS: e.target.checked })}
                        className="w-4 h-4 accent-[#996E7D] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="primary" size="md" type="submit" className="gap-2 bg-[#2A5C8A] hover:bg-[#1B4062]">
                      <Save className="w-4 h-4" /> Save Gate Settings
                    </Button>
                  </div>
                </Card>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ==================== SCAN RESULT MODAL ==================== */}
      {scannedResultModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#2A5C8A]" />
                <h3 className="font-heading text-lg font-black text-[#1A1A1A]">
                  {scannedResultModal.type === 'visitor' ? 'Visitor Gate Pass' : 'Maintenance Work Pass'}
                </h3>
              </div>
              <button
                onClick={() => setScannedResultModal(null)}
                className="p-1 rounded-full hover:bg-[#FAF8F2] text-[#8E8E93]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VISITOR PASS DETAILS */}
            {scannedResultModal.type === 'visitor' && scannedResultModal.visitorData && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#E3F2FD] border border-[#1976D2]/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-base font-bold text-[#1976D2]">
                      {scannedResultModal.visitorData.guestName}
                    </h4>
                    <p className="text-xs text-[#666666]">Relation: {scannedResultModal.visitorData.relation}</p>
                  </div>
                  <Badge
                    variant={
                      scannedResultModal.visitorData.status === 'rejected' ||
                      scannedResultModal.visitorData.status === 'cancelled'
                        ? 'danger'
                        : scannedResultModal.visitorData.status === 'pending'
                        ? 'warning'
                        : 'success'
                    }
                    size="md"
                  >
                    {scannedResultModal.visitorData.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Visiting Resident:</span>
                    <strong className="text-[#1A1A1A]">{scannedResultModal.visitorData.residentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Room & Block:</span>
                    <strong className="text-[#996E7D]">{scannedResultModal.visitorData.block} ({scannedResultModal.visitorData.room})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Scheduled:</span>
                    <strong className="text-[#1A1A1A]">{scannedResultModal.visitorData.scheduledLabel}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Pass ID:</span>
                    <strong className="text-[#2E7D32] font-mono">{scannedResultModal.visitorData.passId}</strong>
                  </div>
                </div>

                {scannedResultModal.visitorData.status === 'checked_in' ? (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full text-xs"
                    onClick={() => {
                      handleRecordVisitorExit(scannedResultModal.visitorData!);
                      setScannedResultModal(null);
                    }}
                  >
                    Mark Exit
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1 text-xs"
                      onClick={() => handleRejectVisitorEntry(scannedResultModal.visitorData!)}
                      disabled={
                        scannedResultModal.visitorData.status === 'rejected' ||
                        scannedResultModal.visitorData.status === 'cancelled' ||
                        scannedResultModal.visitorData.status === 'checked_out'
                      }
                    >
                      Reject Entry
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1 text-xs bg-[#2E7D32] hover:bg-[#1B5E20]"
                      onClick={() => handleAllowVisitorEntry(scannedResultModal.visitorData!)}
                      disabled={
                        scannedResultModal.visitorData.status === 'rejected' ||
                        scannedResultModal.visitorData.status === 'cancelled' ||
                        scannedResultModal.visitorData.status === 'checked_out'
                      }
                    >
                      Allow Entry ✅
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* MAINTENANCE WORK PASS DETAILS WITH STATUS STRIP */}
            {scannedResultModal.type === 'maintenance' && scannedResultModal.passData && (
              <div className="space-y-4">
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    scannedResultModal.passData.extensionStatus === 'Pending'
                      ? 'bg-[#FFF8E1] border-[#FFE082] text-[#F57F17]'
                      : scannedResultModal.passData.extensionStatus === 'Approved'
                      ? 'bg-[#E3F2FD] border-[#90CAF9] text-[#1976D2]'
                      : scannedResultModal.passData.status === 'EXPIRED'
                      ? 'bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]'
                      : 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-current animate-ping" />
                    <span>
                      {scannedResultModal.passData.extensionStatus === 'Pending'
                        ? '🟡 YELLOW — Extension Pending'
                        : scannedResultModal.passData.extensionStatus === 'Approved'
                        ? '🔵 BLUE — Extended Work Pass'
                        : scannedResultModal.passData.status === 'EXPIRED'
                        ? '🔴 RED — Pass Expired'
                        : '🟢 GREEN — Active Pass'}
                    </span>
                  </div>

                  <span className="font-mono">
                    Valid: {scannedResultModal.passData.validUntil}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Technician Name:</span>
                    <strong className="text-[#1A1A1A]">{scannedResultModal.passData.employeeName} ({scannedResultModal.passData.role})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Assigned Task:</span>
                    <strong className="text-[#1A1A1A]">{scannedResultModal.passData.complaintTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Complaint ID:</span>
                    <strong className="font-mono text-[#996E7D]">{scannedResultModal.passData.complaintId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Location:</span>
                    <strong className="text-[#1A1A1A]">{scannedResultModal.passData.block}, Room {scannedResultModal.passData.room}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setScannedResultModal(null);
                      showToast({ title: 'Entry Denied', message: 'Technician entry denied.', type: 'error' });
                    }}
                  >
                    Reject Entry
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1 text-xs bg-[#2E7D32] hover:bg-[#1B5E20]"
                    onClick={() => handleAllowMaintenanceEntry(scannedResultModal.passData!)}
                  >
                    Allow Gate Entry ✅
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Vaigai AI Helper Modal */}
      <VaigaiAiHelperModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onNavigateRoute={(r) => setActiveRoute(r)}
        userRole="Security"
      />
      {/* Floating "Stop Siren" control — appears whenever the SOS siren is playing */}
      <SosSirenBanner />
    </div>
  );
};

export default SecurityDashboard;