import React, { useState, useEffect } from 'react';
import { 
  FileText, QrCode, AlertTriangle, Sparkles, Bell, User, Plus, Search, 
  CheckCircle2, Clock, Filter, Wifi, Shield, ArrowRight, LogOut, Edit3, X,
  Phone, Mail, Calendar, MapPin, ShieldCheck, Camera, Check, Megaphone,
  ChevronRight, ArrowUpRight, ShieldAlert, Wrench, RefreshCw, Layers, Package,
  ChevronLeft
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Snackbar from '../../components/common/Snackbar';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import MessResourceChart from '../../components/dashboard/MessResourceChart';
import DynamicResidentQR from '../../components/dashboard/DynamicResidentQR';
import VisitorQRCode from '../../components/dashboard/VisitorQRCode';
import HostelCircleFeed from '../../components/circle/HostelCircleFeed';
import CommunitySettings from '../../components/circle/CommunitySettings';
import VaigaiAiHelperModal from '../../components/ai/VaigaiAiHelperModal';
import { useToast } from '../../context/ToastContext';
import { useCircle } from '../../context/CircleContext';
import { useVisitorPass } from '../../context/VisitorPassContext';
import { useSos } from '../../context/SosContext';
import { useAuth } from '../../context/AuthContext';
import SosSirenBanner from '../../components/common/SosSirenBanner';

export interface ResidentDashboardProps {
  userName?: string;
  roomNumber?: string;
  hostelBlock?: string;
  onLogout: () => void;
}

// Local shape the dashboard actually renders. Kept separate from your
// Firestore UserProfile type so the UI doesn't care about raw field names.
interface ResidentProfileView {
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  dob: string;
  block: string;
  floor: string;
  room: string;
  emergencyName: string;
  emergencyPhone: string;
  avatarColor: string;
  avatarInitials: string;
}

const FALLBACK_PROFILE: ResidentProfileView = {
  name: 'Resident',
  rollNo: '—',
  email: '—',
  phone: '—',
  dob: '',
  block: 'Hostel Block',
  floor: 'Floor —',
  room: '—',
  emergencyName: '—',
  emergencyPhone: '—',
  avatarColor: '#996E7D',
  avatarInitials: 'R',
};

/**
 * Maps whatever shape your Firestore `users/{uid}` doc actually has into
 * the flat view-model this component renders. ADAPT THE FIELD NAMES BELOW
 * to match your real UserProfile type (types/auth.ts) — these are best
 * guesses based on the console screenshot you shared.
 */
function mapFirestoreProfileToView(d: any, fallback: ResidentProfileView): ResidentProfileView {
  const firstName = d.firstName ?? '';
  const lastName = d.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  const initials =
    (firstName?.[0] ?? '') + (lastName?.[0] ?? '') ||
    fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  return {
    name: fullName || fallback.name,
    rollNo: d.rollNo ?? d.registerNumber ?? d.regNo ?? fallback.rollNo,
    email: d.email ?? fallback.email,
    phone: d.phone ?? fallback.phone,
    dob: d.dob ?? fallback.dob,
    block: d.hostelBlock ?? d.block ?? fallback.block,
    floor: d.floorNumber ? `Floor ${d.floorNumber}` : (d.floor ?? fallback.floor),
    room: d.room ?? d.roomNumber ?? fallback.room,
    emergencyName: d.emergencyName ?? fallback.emergencyName,
    emergencyPhone: d.emergencyNumber ?? d.emergencyPhone ?? fallback.emergencyPhone,
    avatarColor: d.avatarColor ?? fallback.avatarColor,
    avatarInitials: (initials || fallback.avatarInitials).toUpperCase(),
  };
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  userName,
  roomNumber,
  hostelBlock,
  onLogout,
}) => {
  const { showToast } = useToast();
  const { triggerSOS } = useSos();
  const { profile: authProfile, firebaseUser, isLoading: authLoading } = useAuth();
  const {
    passes: allVisitorPasses,
    createVisitorPass,
    cancelVisitorPass,
  } = useVisitorPass();

  // Active route inside Resident Portal
  const [activeRoute, setActiveRoute] = useState<string>('/resident/dashboard');

  // AI Helper Modal State
  const [showAiModal, setShowAiModal] = useState(false);

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Complaints filter and search state
  const [complaintFilter, setComplaintFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');
  const [complaintSearch, setComplaintSearch] = useState('');

  // ==================== REAL PROFILE STATE (was hardcoded before) ====================
  // Seed with prop-based fallbacks so the UI has *something* to show on first paint,
  // then overwrite as soon as AuthContext resolves the real Firestore profile.
  const [profile, setProfile] = useState<ResidentProfileView>({
    ...FALLBACK_PROFILE,
    name: userName || FALLBACK_PROFILE.name,
    block: hostelBlock || FALLBACK_PROFILE.block,
    room: roomNumber || FALLBACK_PROFILE.room,
  });

  const [profileHydrated, setProfileHydrated] = useState(false);

  useEffect(() => {
    if (authLoading) return; // still resolving auth state, wait

    if (!authProfile) {
      // Not signed in / no profile doc found — keep fallback values.
      setProfileHydrated(true);
      return;
    }

    setProfile((prev) => mapFirestoreProfileToView(authProfile, prev));
    setProfileHydrated(true);
  }, [authProfile, authLoading]);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState<ResidentProfileView>({ ...profile });
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  // Keep the edit form in sync whenever the underlying profile changes
  // (e.g. right after Firestore hydration completes) and the modal isn't open yet.
  useEffect(() => {
    if (!showProfileModal) {
      setProfileEditForm({ ...profile });
    }
  }, [profile, showProfileModal]);

  // Calculate age helper
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profileEditForm });
    setShowProfileModal(false);
    showToast({
      title: 'Profile Updated',
      message: 'Your resident details have been updated successfully!',
      type: 'success',
    });
    // NOTE: this only updates local UI state. If you want edits here to persist,
    // call an updateUserProfile(uid, {...}) Firestore write here too — currently
    // there isn't one wired up, so a refresh will revert to the Firestore values.
  };

  // Complaints State
  const [complaints, setComplaints] = useState([
    {
      id: 'VAI-8921',
      title: 'Water Leakage in Bathroom',
      category: 'Plumbing',
      priority: 'High',
      status: 'Pending',
      time: '2 hours ago',
      assignedTo: 'M. Selvam (Plumber)',
      aiCategory: 'Auto-Tagged: Urgent Plumbing',
    },
    {
      id: 'VAI-8810',
      title: 'Wi-Fi Issue in Room',
      category: 'IT / Network',
      priority: 'Medium',
      status: 'In Progress',
      time: 'Yesterday',
      assignedTo: 'K. Rajan (Network Admin)',
      aiCategory: 'Auto-Tagged: Campus Wi-Fi',
    },
    {
      id: 'VAI-8750',
      title: 'Fan Repair & Speed Regulator',
      category: 'Electrical',
      priority: 'Normal',
      status: 'Resolved',
      time: '2 Days Ago',
      assignedTo: 'S. Kumar (Electrician)',
      aiCategory: 'Auto-Tagged: Electrical Maintenance',
    },
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Plumbing & Water');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle) return;

    const newTicket = {
      id: `VAI-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicketTitle,
      category: newCategory,
      priority: newPriority,
      status: 'Pending' as const,
      time: 'Just now',
      assignedTo: 'Pending Warden Assignment',
      aiCategory: `Gemini AI: Auto-routed (${newCategory})`,
    };

    setComplaints([newTicket, ...complaints]);
    setNewTicketTitle('');
    setNewDescription('');
    setNewCategory('Plumbing & Water');
    setNewPriority('Medium');
    setShowNewModal(false);

    showToast({
      title: 'Complaint Logged Successfully',
      message: `Ticket ${newTicket.id} (${newCategory}) logged and dispatched to Warden queue!`,
      type: 'success',
    });
  };

  // Visitors — live-synced from Firestore via VisitorPassContext (no more local mock array)
  const visitors = allVisitorPasses.filter(
    (p) => p.residentUid === (firebaseUser?.uid ?? '__none__')
  );

  const visitorStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'checked_in':
        return 'Checked In';
      case 'checked_out':
        return 'Checked Out';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const visitorStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'secondary' => {
    if (status === 'approved' || status === 'checked_in' || status === 'checked_out') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'rejected' || status === 'cancelled' || status === 'expired') return 'danger';
    return 'secondary';
  };

  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestRelation, setGuestRelation] = useState('Parents');
  const [isGeneratingPass, setIsGeneratingPass] = useState(false);

  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !firebaseUser?.uid) return;

    setIsGeneratingPass(true);
    try {
      await createVisitorPass({
        residentUid: firebaseUser.uid,
        residentName: profile.name,
        block: profile.block,
        room: profile.room,
        guestName,
        relation: guestRelation,
        scheduledLabel: 'Today, Soon',
      });
      setGuestName('');
      setShowVisitorModal(false);
      showToast({
        title: 'Visitor Pass Generated',
        message: `QR gate pass for ${guestName} is ready — share it or have them scan in at the gate.`,
        type: 'success',
      });
    } catch (err) {
      console.error('createVisitorPass failed', err);
      showToast({
        title: 'Could Not Generate Pass',
        message: 'Something went wrong creating the visitor pass. Please try again.',
        type: 'error',
      });
    } finally {
      setIsGeneratingPass(false);
    }
  };

  const handleCancelVisitorPass = async (passId: string) => {
    try {
      await cancelVisitorPass(passId);
      showToast({ title: 'Pass Cancelled', message: `Visitor pass ${passId} has been cancelled.`, type: 'info' });
    } catch (err) {
      console.error('cancelVisitorPass failed', err);
      showToast({ title: 'Could Not Cancel', message: 'Please try again.', type: 'error' });
    }
  };

  // ==================== SOS Distress State (now backed by live SosContext) ====================
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosLocationMode, setSosLocationMode] = useState<'room' | 'manual'>('room');
  const [sosManualLocationNote, setSosManualLocationNote] = useState('');
  const [sosEmergencyType, setSosEmergencyType] = useState('Medical Emergency');

  const handleTriggerSos = async () => {
    setSosTriggered(true);
    try {
      await triggerSOS({
        // Use the REAL Firebase uid now, not rollNo. This is the fix for the
        // sosAlerts permission/ownership check in your Firestore rules
        // (allow create: if request.auth.uid == request.resource.data.studentUid).
        studentUid: firebaseUser?.uid ?? '',
        studentName: profile.name,
        rollNo: profile.rollNo,
        phone: profile.phone,
        hostelBlock: profile.block,
        floor: profile.floor,
        room: profile.room,
        locationMode: sosLocationMode,
        locationNote: sosLocationMode === 'manual' ? sosManualLocationNote : undefined,
        emergencyType: sosEmergencyType,
      });

      showToast({
        title: '🚨 EMERGENCY ALERT BROADCAST',
        message: 'Security & Wardens notified with your live location!',
        type: 'error',
      });
    } catch (err) {
      showToast({
        title: 'SOS Failed to Send',
        message: 'Please try again, or call the Warden Helpline directly.',
        type: 'error',
      });
    } finally {
      setShowSosModal(false);
      setSosTriggered(false);
    }
  };

  // Announcements State
  const announcements = [
    {
      id: 1,
      title: 'Water Supply Maintenance',
      desc: 'Scheduled water tank cleaning in Vaigai Block A & B from 6 AM to 9 AM tomorrow.',
      date: 'Tomorrow',
      type: 'Maintenance',
    },
    {
      id: 2,
      title: 'Mess Menu Updated for March',
      desc: 'Special South Indian breakfast additions updated according to resident committee vote.',
      date: 'Today',
      type: 'Mess',
    },
    {
      id: 3,
      title: 'Hostel Committee Meeting',
      desc: 'All floor representatives and block wardens meeting at Common Hall on Friday at 5 PM.',
      date: 'Friday',
      type: 'Notice',
    },
  ];

  // Helper title resolver
  const getPageTitle = (route: string) => {
    switch (route) {
      case '/resident/dashboard': return 'Dashboard';
      case '/resident/complaints': return 'Complaints';
      case '/resident/visitors': return 'Visitors';
      case '/resident/sos': return 'Emergency SOS';
      case '/resident/inventory': return 'Digital Room Inventory';
      case '/resident/announcements': return 'Announcements';
      case '/resident/notifications': return 'Notifications';
      case '/resident/profile': return 'My Profile';
      case '/resident/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  // Digital Room Inventory Check-In State
  const [roomInventoryItems, setRoomInventoryItems] = useState([
    { id: 'INV-1', name: 'Single Bed Frame & High-Density Mattress', category: 'Furniture', condition: 'Good', notes: 'Slats intact, mattress clean', photoAttached: false, issueFlagged: false },
    { id: 'INV-2', name: 'Wooden Study Desk with Drawers', category: 'Furniture', condition: 'Good', notes: 'Minor scratch on left corner', photoAttached: true, issueFlagged: false },
    { id: 'INV-3', name: 'Ergonomic Mesh Study Chair', category: 'Furniture', condition: 'Minor Wear', notes: 'Height adjustment lever slightly stiff', photoAttached: false, issueFlagged: false },
    { id: 'INV-4', name: 'Double-Door Wooden Wardrobe with Key', category: 'Furniture', condition: 'Good', notes: 'Hinges operational, key present', photoAttached: false, issueFlagged: false },
    { id: 'INV-5', name: 'Ceiling Fan & 5-Speed Regulator', category: 'Appliance', condition: 'Good', notes: 'High speed rotation normal', photoAttached: false, issueFlagged: false },
    { id: 'INV-6', name: '20W LED Ceiling Tube Light', category: 'Appliance', condition: 'Good', notes: 'Flicker-free illumination', photoAttached: false, issueFlagged: false },
    { id: 'INV-7', name: 'Adjustable Flexible Study Lamp', category: 'Appliance', condition: 'Needs Repair', notes: 'Lamp power switch loose', photoAttached: true, issueFlagged: true },
    { id: 'INV-8', name: 'High-Speed RJ45 LAN Outlet', category: 'Fitting', condition: 'Good', notes: 'Campus network active', photoAttached: false, issueFlagged: false },
    { id: 'INV-9', name: 'Window Sun Blinds & Curtain Rods', category: 'Fixture', condition: 'Good', notes: 'Smooth chord mechanism', photoAttached: false, issueFlagged: false },
  ]);

  const [inventoryCertify, setInventoryCertify] = useState(false);
  const [inventorySubmitted, setInventorySubmitted] = useState(false);

  const handleUpdateItemCondition = (id: string, condition: string) => {
    setRoomInventoryItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              condition,
              issueFlagged: condition === 'Needs Repair' || condition === 'Damaged' || condition === 'Missing',
            }
          : item
      )
    );
  };

  const handleUpdateItemNotes = (id: string, notes: string) => {
    setRoomInventoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleToggleItemPhoto = (id: string) => {
    setRoomInventoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, photoAttached: !item.photoAttached } : item))
    );
  };

  const handleCompleteInventoryCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryCertify) return;

    setInventorySubmitted(true);

    // Auto-create maintenance tickets for flagged damaged items
    const flaggedItems = roomInventoryItems.filter((item) => item.issueFlagged);
    if (flaggedItems.length > 0) {
      const newTickets = flaggedItems.map((item) => ({
        id: `VAI-INV-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `Room ${profile.room} Arrival Defect: ${item.name}`,
        category: item.category === 'Appliance' ? 'Electrical' : 'Furniture & Fixtures',
        priority: 'High' as const,
        status: 'Pending' as const,
        time: 'Just now',
        assignedTo: 'Automated Room Arrival Audit Dispatch',
        aiCategory: 'Auto-Logged from Digital Check-In Inventory',
      }));
      setComplaints((prev) => [...newTickets, ...prev]);
    }

    showToast({
      title: 'Digital Room Inventory Submitted!',
      message: `Room Arrival Check-In for Room ${profile.room} logged successfully with Warden records.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] font-body">
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={(route) => setActiveRoute(route)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onLogout={onLogout}
        onOpenAiHelper={() => setShowAiModal(true)}
      />

      {/* Main Container Wrapper */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isSidebarCollapsed ? 'md:pl-[80px]' : 'md:pl-[280px]'
        }`}
      >
        {/* Top Header Bar */}
        <TopBar
          currentPageTitle={getPageTitle(activeRoute)}
          role="resident"
          userName={profile.name}
          userRole="Resident"
          avatarInitials={profile.avatarInitials}
          avatarColor={profile.avatarColor}
          hostelBlock={profile.block}
          roomNumber={`Room ${profile.room}`}
          unreadCount={3}
          showBackButton={activeRoute !== '/resident/dashboard'}
          onBack={() => setActiveRoute('/resident/dashboard')}
          onOpenAiHelper={() => setShowAiModal(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigate={(r) => setActiveRoute(r)}
          onLogout={onLogout}
        />

        {/* Dynamic Route Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">

          {!profileHydrated && (
            <div className="mb-4 text-xs text-[#8E8E93] font-body">Loading your profile…</div>
          )}

          {/* ==================== DASHBOARD VIEW ==================== */}
          {activeRoute === '/resident/dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Greeting Card */}
              <div className="bg-gradient-to-r from-white via-white to-[#F5EFF2] border border-[#E7E4DF] p-6 sm:p-8 rounded-[24px] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-2xl">Good Evening 👋</span>
                    <Badge variant="primary" size="sm">Active Resident</Badge>
                  </div>
                  
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                    {profile.name}
                  </h1>

                  <p className="font-body text-xs sm:text-sm text-[#666666] mt-1.5 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#1A1A1A]">{profile.block}</span>
                    <span>•</span>
                    <span>{profile.floor}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF8F2] border border-[#E7E4DF] font-bold text-[#996E7D]">
                      Room {profile.room}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto relative z-10 flex-wrap">
                  <Button
                    variant="ai"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowNewModal(true)}
                    className="w-full sm:w-auto hover:scale-105 transition-transform"
                  >
                    + New Complaint
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<QrCode className="w-4 h-4" />}
                    onClick={() => setShowVisitorModal(true)}
                    className="w-full sm:w-auto hover:scale-105 transition-transform"
                  >
                    Register Visitor
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<AlertTriangle className="w-4 h-4" />}
                    onClick={() => setShowSosModal(true)}
                    className="w-full sm:w-auto hover:scale-105 transition-transform"
                  >
                    SOS
                  </Button>
                </div>
              </div>

              {/* Four Statistic Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* 1. Open Complaints */}
                <Card className="p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border-[#E7E4DF] hover:border-[#996E7D]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Open Complaints</span>
                    <div className="p-2.5 rounded-xl bg-[#F5EFF2] text-[#996E7D]">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#1A1A1A] mb-1">
                    2
                  </div>
                  <p className="font-body text-xs text-[#666666]">
                    1 In Progress • 1 Pending
                  </p>
                </Card>

                {/* 2. Pending Visitors */}
                <Card className="p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border-[#E7E4DF] hover:border-[#2A5C8A]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Pending Visitors</span>
                    <div className="p-2.5 rounded-xl bg-[#EBF3FA] text-[#2A5C8A]">
                      <QrCode className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#1A1A1A] mb-1">
                    {visitors.filter((v) => v.status === 'pending' || v.status === 'approved').length}
                  </div>
                  <p className="font-body text-xs text-[#666666]">
                    {visitors[0] ? `${visitors[0].guestName} • ${visitors[0].scheduledLabel}` : 'No upcoming guests'}
                  </p>
                </Card>

                {/* 3. Unread Announcements */}
                <Card className="p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border-[#E7E4DF] hover:border-[#F4B400]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Announcements</span>
                    <div className="p-2.5 rounded-xl bg-[#FFF8E1] text-[#D97706]">
                      <Megaphone className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#1A1A1A] mb-1">
                    3
                  </div>
                  <p className="font-body text-xs text-[#666666]">
                    Water Supply & Mess Menu
                  </p>
                </Card>

                {/* 4. Emergency Contacts */}
                <Card className="p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border-[#E7E4DF] hover:border-[#D9534F]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Emergency Contacts</span>
                    <div className="p-2.5 rounded-xl bg-[#FDF2F2] text-[#D9534F]">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#1A1A1A] mb-1">
                    4
                  </div>
                  <p className="font-body text-xs text-[#666666]">
                    Warden, Security & Medical
                  </p>
                </Card>
              </div>

              {/* Dynamic Resident Gate Pass QR Code */}
              <DynamicResidentQR
              residentUid={firebaseUser?.uid}
                residentName={profile.name}
                rollNumber={profile.rollNo}
                roomNumber={profile.room}
                hostelBlock={profile.block}
              />

              {/* Recharts Mess & Resource Usage Analytics */}
              <MessResourceChart />

              {/* Quick Action Large Buttons Grid */}
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#996E7D] mb-4">
                  Quick Actions
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="p-5 rounded-[20px] bg-white border border-[#E7E4DF] shadow-xs text-left hover:border-[#996E7D] hover:shadow-md hover:scale-[1.02] transition-all group flex flex-col justify-between"
                  >
                    <div className="p-3 rounded-2xl bg-[#F5EFF2] text-[#996E7D] w-fit mb-4 group-hover:rotate-6 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-[#1A1A1A] group-hover:text-[#996E7D] transition-colors">
                        + New Complaint
                      </h4>
                      <p className="font-body text-xs text-[#666666] mt-1">
                        Report electrical, plumbing or room maintenance issues
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowVisitorModal(true)}
                    className="p-5 rounded-[20px] bg-white border border-[#E7E4DF] shadow-xs text-left hover:border-[#2A5C8A] hover:shadow-md hover:scale-[1.02] transition-all group flex flex-col justify-between"
                  >
                    <div className="p-3 rounded-2xl bg-[#EBF3FA] text-[#2A5C8A] w-fit mb-4 group-hover:rotate-6 transition-transform">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-[#1A1A1A] group-hover:text-[#2A5C8A] transition-colors">
                        Register Visitor
                      </h4>
                      <p className="font-body text-xs text-[#666666] mt-1">
                        Generate digital guest QR pass for hostel gate entry
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowSosModal(true)}
                    className="p-5 rounded-[20px] bg-white border border-[#E7E4DF] shadow-xs text-left hover:border-[#D9534F] hover:shadow-md hover:scale-[1.02] transition-all group flex flex-col justify-between"
                  >
                    <div className="p-3 rounded-2xl bg-[#FDF2F2] text-[#D9534F] w-fit mb-4 group-hover:animate-pulse">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-[#D9534F] group-hover:text-[#B92C28] transition-colors">
                        Emergency SOS
                      </h4>
                      <p className="font-body text-xs text-[#666666] mt-1">
                        1-Tap immediate broadcast to security & wardens
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveRoute('/resident/complaints')}
                    className="p-5 rounded-[20px] bg-white border border-[#E7E4DF] shadow-xs text-left hover:border-[#A73FD3] hover:shadow-md hover:scale-[1.02] transition-all group flex flex-col justify-between"
                  >
                    <div className="p-3 rounded-2xl bg-[#F7EDFC] text-[#A73FD3] w-fit mb-4 group-hover:rotate-6 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-[#1A1A1A] group-hover:text-[#A73FD3] transition-colors">
                        Track Complaints
                      </h4>
                      <p className="font-body text-xs text-[#666666] mt-1">
                        View real-time status & warden dispatch logs
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Two Column Grid: Recent Complaints & Visitors / Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Complaints Card */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7E4DF]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#996E7D]" />
                      <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                        Recent Complaints
                      </h3>
                    </div>

                    <button
                      onClick={() => setActiveRoute('/resident/complaints')}
                      className="text-xs font-bold text-[#996E7D] hover:underline flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {complaints.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-[14px] bg-[#FAF8F2] border border-[#E7E4DF] flex items-center justify-between hover:border-[#996E7D] transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-xs font-bold text-[#1A1A1A]">
                              {item.title}
                            </span>
                          </div>
                          <p className="font-body text-[11px] text-[#666666] mt-0.5">
                            {item.category} • Assigned: {item.assignedTo}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <Badge
                            variant={item.status === 'Resolved' ? 'success' : item.status === 'In Progress' ? 'warning' : 'primary'}
                            size="sm"
                          >
                            {item.status}
                          </Badge>
                          <span className="block text-[10px] text-[#8E8E93] mt-1">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Visitor Requests & Announcements Split */}
                <div className="space-y-6">
                  
                  {/* Visitor Requests Card */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7E4DF]">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-[#2A5C8A]" />
                        <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                          Visitor Requests
                        </h3>
                      </div>

                      <button
                        onClick={() => setActiveRoute('/resident/visitors')}
                        className="text-xs font-bold text-[#2A5C8A] hover:underline flex items-center gap-1"
                      >
                        Manage Passes <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {visitors.length === 0 && (
                        <p className="text-xs text-[#8E8E93] text-center py-4">
                          No visitor passes yet. Generate one to get started.
                        </p>
                      )}
                      {visitors.map((vis) => (
                        <div
                          key={vis.passId}
                          className="p-3 rounded-[14px] bg-[#FAF8F2] border border-[#E7E4DF] flex items-center justify-between"
                        >
                          <div>
                            <span className="font-heading text-xs font-bold text-[#1A1A1A]">
                              {vis.guestName}
                            </span>
                            <span className="block text-[11px] text-[#666666]">
                              {vis.relation} • Pass: <code className="font-mono text-[#2A5C8A]">{vis.passId}</code>
                            </span>
                          </div>

                          <div className="text-right">
                            <Badge variant={visitorStatusVariant(vis.status)} size="sm">
                              {visitorStatusLabel(vis.status)}
                            </Badge>
                            <span className="block text-[10px] text-[#8E8E93] mt-1">
                              {vis.scheduledLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Latest Announcements */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7E4DF]">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-[#D97706]" />
                        <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                          Hostel Announcements
                        </h3>
                      </div>

                      <button
                        onClick={() => setActiveRoute('/resident/announcements')}
                        className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1"
                      >
                        View Feed <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-3 rounded-[12px] bg-[#FAF8F2] border border-[#E7E4DF]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading text-xs font-bold text-[#1A1A1A]">
                              {ann.title}
                            </span>
                            <span className="text-[10px] font-bold text-[#996E7D]">
                              {ann.date}
                            </span>
                          </div>
                          <p className="font-body text-xs text-[#666666]">
                            {ann.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>

                </div>
              </div>

            </div>
          )}

          {/* ==================== COMPLAINTS VIEW ==================== */}
          {activeRoute === '/resident/complaints' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header with Location Tag */}
              <div className="bg-white border border-[#E7E4DF] p-6 rounded-[20px] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="primary" size="sm">
                      <MapPin className="w-3 h-3 mr-1" /> {profile.block} • Room {profile.room}
                    </Badge>
                    <span className="text-xs font-semibold text-[#8E8E93]">Resident Maintenance Portal</span>
                  </div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
                    Complaints & Maintenance
                  </h2>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Log and track room issues with AI auto-routing to floor wardens & plumbers
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowNewModal(true)}
                  className="shrink-0"
                >
                  Log New Complaint
                </Button>
              </div>

              {/* Status Summary Cards & Filter Row */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-[16px] border border-[#E7E4DF]">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((status) => {
                    const count = status === 'All' 
                      ? complaints.length 
                      : complaints.filter(c => c.status === status).length;
                    const isActive = complaintFilter === status;

                    return (
                      <button
                        key={status}
                        onClick={() => setComplaintFilter(status)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                          isActive
                            ? 'bg-[#996E7D] text-white shadow-2xs'
                            : 'bg-[#FAF8F2] text-[#666666] hover:bg-[#E7E4DF]/50 hover:text-[#1A1A1A]'
                        }`}
                      >
                        <span>{status}</span>
                        <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#E7E4DF] text-[#666666]'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tickets or ID..."
                    value={complaintSearch}
                    onChange={(e) => setComplaintSearch(e.target.value)}
                    className="w-full bg-[#FAF8F2] border border-[#E7E4DF] rounded-xl pl-9 pr-3 py-2 text-xs font-body text-[#1A1A1A] placeholder-[#8E8E93] focus:outline-none focus:border-[#996E7D]"
                  />
                  {complaintSearch && (
                    <button 
                      onClick={() => setComplaintSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1A1A1A]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Un-clumped Tickets List */}
              <div className="space-y-3.5">
                {complaints
                  .filter((item) => {
                    const matchesFilter = complaintFilter === 'All' || item.status === complaintFilter;
                    const matchesSearch = !complaintSearch || 
                      item.title.toLowerCase().includes(complaintSearch.toLowerCase()) ||
                      item.id.toLowerCase().includes(complaintSearch.toLowerCase()) ||
                      item.category.toLowerCase().includes(complaintSearch.toLowerCase());
                    return matchesFilter && matchesSearch;
                  })
                  .map((item) => (
                    <Card key={item.id} className="p-5 hover:border-[#996E7D] transition-all duration-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F2] border border-[#E7E4DF] text-xs font-mono font-bold text-[#996E7D]">
                              {item.id}
                            </span>
                            <Badge variant={item.priority === 'High' ? 'danger' : 'primary'} size="sm">
                              {item.priority} Priority
                            </Badge>
                            <Badge 
                              variant={item.status === 'Resolved' ? 'success' : item.status === 'In Progress' ? 'warning' : 'secondary'} 
                              size="sm"
                            >
                              {item.status}
                            </Badge>
                          </div>

                          <h3 className="font-heading text-base font-bold text-[#1A1A1A] tracking-tight">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-4 text-xs text-[#666666] flex-wrap">
                            <span>Category: <strong className="text-[#1A1A1A]">{item.category}</strong></span>
                            <span>•</span>
                            <span>Assigned To: <strong className="text-[#2A5C8A]">{item.assignedTo}</strong></span>
                            <span>•</span>
                            <span>Logged: <strong className="text-[#8E8E93]">{item.time}</strong></span>
                          </div>

                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EDFC] border border-[#A73FD3]/20 text-[11px] font-bold text-[#A73FD3]">
                            <Sparkles className="w-3.5 h-3.5" />
                            {item.aiCategory}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-[#E7E4DF] shrink-0 gap-2">
                          <span className="text-xs text-[#8E8E93] hidden md:block">{item.time}</span>
                          <Button variant="secondary" size="sm" className="w-full md:w-auto">
                            Activity Log
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                {complaints.filter((item) => {
                  const matchesFilter = complaintFilter === 'All' || item.status === complaintFilter;
                  const matchesSearch = !complaintSearch || 
                    item.title.toLowerCase().includes(complaintSearch.toLowerCase()) ||
                    item.id.toLowerCase().includes(complaintSearch.toLowerCase());
                  return matchesFilter && matchesSearch;
                }).length === 0 && (
                  <div className="text-center py-12 bg-white rounded-[20px] border border-[#E7E4DF]">
                    <FileText className="w-10 h-10 text-[#8E8E93] mx-auto mb-3 opacity-50" />
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">No complaints found</h4>
                    <p className="font-body text-xs text-[#666666] mt-1">Try resetting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== VISITORS VIEW ==================== */}
          {activeRoute === '/resident/visitors' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4DF]">
                <div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    QR Visitor Gate Passes
                  </h2>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Pre-register guests for encrypted QR pass scanning at main gate
                  </p>
                </div>

                <Button
                  variant="primary"
                  leftIcon={<QrCode className="w-4 h-4" />}
                  onClick={() => setShowVisitorModal(true)}
                >
                  Register New Guest
                </Button>
              </div>

              {visitors.length === 0 && (
                <Card className="p-10 text-center">
                  <QrCode className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
                  <p className="text-sm text-[#666666]">
                    No visitor passes yet. Tap "Register New Guest" to generate a scannable gate QR.
                  </p>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visitors.map((vis) => (
                  <Card key={vis.passId} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={visitorStatusVariant(vis.status)} size="sm">
                        {visitorStatusLabel(vis.status)}
                      </Badge>
                      <span className="text-xs font-mono font-bold text-[#2A5C8A]">{vis.passId}</span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-1">
                      {vis.guestName}
                    </h3>
                    <p className="font-body text-xs text-[#666666]">
                      Relation: {vis.relation} • Scheduled: {vis.scheduledLabel}
                    </p>

                    <div className="mt-4 p-4 rounded-[16px] bg-[#FAF8F2] border border-[#E7E4DF] text-center">
                      <div className="w-32 h-32 mx-auto bg-white border border-[#E7E4DF] rounded-xl flex items-center justify-center p-2 mb-2 shadow-xs">
                        <VisitorQRCode passId={vis.passId} token={vis.token} size={112} />
                      </div>
                      <span className="font-mono text-xs font-extrabold text-[#2A5C8A] tracking-wider block">
                        PASS: {vis.passId}
                      </span>
                      <span className="block text-[10px] text-[#8E8E93] mt-1">
                        Show this at the gate — security scans it to check your guest in.
                      </span>
                    </div>

                    {(vis.status === 'pending' || vis.status === 'approved') && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleCancelVisitorPass(vis.passId)}
                      >
                        Cancel Pass
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SOS VIEW ==================== */}
          {activeRoute === '/resident/sos' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto text-center py-8">
              <div className="p-4 rounded-full bg-[#FDF2F2] text-[#D9534F] w-20 h-20 mx-auto flex items-center justify-center animate-bounce">
                <ShieldAlert className="w-10 h-10" />
              </div>

              <h2 className="font-heading text-3xl font-extrabold text-[#1A1A1A]">
                24/7 Emergency SOS Broadcast
              </h2>

              <p className="font-body text-sm text-[#666666] leading-relaxed">
                Triggering the Emergency SOS instantly overrides quiet modes and transmits your live room location (<span className="font-bold text-[#1A1A1A]">{profile.block}, Room {profile.room}</span>) directly to the Warden on Duty and Main Gate Guard.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => setShowSosModal(true)}
                  disabled={sosTriggered}
                  className="px-10 py-5 rounded-full bg-[#D9534F] hover:bg-[#B92C28] text-white font-heading text-lg font-extrabold shadow-xl hover:shadow-2xl transition-all active:scale-95"
                >
                  {sosTriggered ? 'BROADCASTING EMERGENCY ALERT...' : 'TAP TO ACTIVATE SOS ALERT'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 text-left">
                <Card className="p-4">
                  <span className="text-xs text-[#8E8E93] block">Warden Helpline</span>
                  <span className="font-bold text-sm text-[#1A1A1A]">+91 98401 00112</span>
                </Card>
                <Card className="p-4">
                  <span className="text-xs text-[#8E8E93] block">Campus Health Center</span>
                  <span className="font-bold text-sm text-[#1A1A1A]">+91 98401 00999</span>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== ANNOUNCEMENTS VIEW ==================== */}
          {activeRoute === '/resident/announcements' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF]">
                <h2 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                  Hostel Announcements & Circulars
                </h2>
                <p className="font-body text-xs text-[#666666] mt-1">
                  Official notices published by hostel warden office and management
                </p>
              </div>

              <div className="space-y-4">
                {announcements.map((ann) => (
                  <Card key={ann.id} className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="primary" size="sm">{ann.type}</Badge>
                      <span className="text-xs font-bold text-[#996E7D]">{ann.date}</span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-2">
                      {ann.title}
                    </h3>
                    <p className="font-body text-sm text-[#666666] leading-relaxed">
                      {ann.desc}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== NOTIFICATIONS VIEW ==================== */}
          {activeRoute === '/resident/notifications' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <div className="pb-4 border-b border-[#E7E4DF]">
                <h2 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                  Notifications Center
                </h2>
                <p className="font-body text-xs text-[#666666] mt-1">
                  Real-time alerts regarding complaints, guest approvals, and announcements
                </p>
              </div>

              <div className="space-y-3">
                <Card className="p-4 flex items-start gap-3 bg-[#FAF8F2] border-[#996E7D]/30">
                  <div className="p-2 rounded-xl bg-[#F5EFF2] text-[#996E7D] shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-[#1A1A1A]">Work Order Assigned</h4>
                    <p className="font-body text-xs text-[#666666] mt-0.5">Complaint VAI-8921 assigned to Electrician K. Rajan.</p>
                    <span className="text-[10px] text-[#8E8E93] mt-1 block">10 mins ago</span>
                  </div>
                </Card>

                <Card className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#EBF3FA] text-[#2A5C8A] shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-[#1A1A1A]">Visitor Pass Approved</h4>
                    <p className="font-body text-xs text-[#666666] mt-0.5">Parent visitor pass PV-8910 approved by Warden.</p>
                    <span className="text-[10px] text-[#8E8E93] mt-1 block">1 hour ago</span>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== DIGITAL ROOM INVENTORY VIEW ==================== */}
          {activeRoute === '/resident/inventory' && (
            <div className="space-y-6 animate-fadeIn max-w-4xl">
              <div className="bg-gradient-to-r from-white via-white to-[#F5EFF2] p-6 rounded-[24px] border border-[#E7E4DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-[#996E7D]/10 text-[#996E7D]">
                      <Package className="w-5 h-5" />
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1A1A1A]">
                      Digital Room Inventory Check-In
                    </h2>
                  </div>
                  <p className="font-body text-xs text-[#666666] ml-8">
                    Log and verify the physical condition of all room furniture, appliances, and fixtures in <span className="font-bold text-[#1A1A1A]">{profile.block}, Room {profile.room}</span> upon arrival.
                  </p>
                </div>

                {inventorySubmitted ? (
                  <Badge variant="success" size="md" className="shrink-0 self-start md:self-auto py-2 px-3">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Check-In Verified
                  </Badge>
                ) : (
                  <Badge variant="warning" size="md" className="shrink-0 self-start md:self-auto py-2 px-3">
                    <Clock className="w-4 h-4 mr-1.5" /> Pending Resident Audit
                  </Badge>
                )}
              </div>

              <form onSubmit={handleCompleteInventoryCheckIn} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {roomInventoryItems.map((item) => (
                    <Card key={item.id} className="p-4 sm:p-5 border border-[#E7E4DF] hover:border-[#996E7D]/40 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E4DF]">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#8E8E93] bg-[#FAF8F2] px-2 py-1 rounded-md border border-[#E7E4DF]">
                            {item.id}
                          </span>
                          <div>
                            <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">
                              {item.name}
                            </h3>
                            <span className="text-[11px] font-medium text-[#666666]">
                              Category: <strong className="text-[#996E7D]">{item.category}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Condition radio selector */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          {['Good', 'Minor Wear', 'Needs Repair', 'Damaged', 'Missing'].map((cond) => (
                            <button
                              key={cond}
                              type="button"
                              onClick={() => handleUpdateItemCondition(item.id, cond)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border shrink-0 ${
                                item.condition === cond
                                  ? cond === 'Good'
                                    ? 'bg-[#EBF7EE] border-[#2E7D32] text-[#2E7D32] font-bold'
                                    : cond === 'Minor Wear'
                                    ? 'bg-[#FEF9E7] border-[#F0AD4E] text-[#B7791F] font-bold'
                                    : 'bg-[#FDF2F2] border-[#D9534F] text-[#D9534F] font-bold'
                                  : 'bg-[#FAF8F2] border-[#E7E4DF] text-[#666666] hover:bg-white'
                              }`}
                            >
                              {cond}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="Add observations or notes (e.g. minor scratches, working condition)..."
                          value={item.notes}
                          onChange={(e) => handleUpdateItemNotes(item.id, e.target.value)}
                          className="flex-1 p-2 px-3 rounded-xl border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] bg-[#FAF8F2] outline-none focus:bg-white focus:border-[#996E7D]"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleItemPhoto(item.id)}
                            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                              item.photoAttached
                                ? 'bg-[#F5EFF2] border-[#996E7D] text-[#996E7D]'
                                : 'bg-[#FAF8F2] border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A]'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            {item.photoAttached ? 'Photo Attached' : 'Attach Photo'}
                          </button>

                          {item.issueFlagged && (
                            <span className="px-2.5 py-1 rounded-xl bg-[#FDF2F2] text-[#D9534F] border border-[#D9534F]/30 text-[11px] font-bold flex items-center gap-1">
                              <Wrench className="w-3 h-3" /> Auto Ticket
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Sign off and submission card */}
                <Card className="p-6 bg-white border-2 border-[#996E7D]/30 space-y-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="certify-check"
                      checked={inventoryCertify}
                      onChange={(e) => setInventoryCertify(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-[#996E7D] rounded cursor-pointer shrink-0"
                    />
                    <label htmlFor="certify-check" className="font-body text-xs text-[#1A1A1A] cursor-pointer leading-relaxed">
                      <strong>Resident Declaration:</strong> I hereby certify that I have thoroughly inspected all room furniture, electrical appliances, and fittings in <span className="font-bold">{profile.block}, Room {profile.room}</span>. I confirm the conditions logged above are accurate. I understand that flagged defects will automatically generate maintenance tickets.
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DF]">
                    <div className="text-xs text-[#666666]">
                      Logged by: <strong className="text-[#1A1A1A]">{profile.name} ({profile.rollNo})</strong>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!inventoryCertify || inventorySubmitted}
                      className="px-6"
                    >
                      {inventorySubmitted ? 'Check-In Completed ✅' : 'Submit Digital Room Inventory'}
                    </Button>
                  </div>
                </Card>
              </form>
            </div>
          )}

          {/* ==================== PROFILE VIEW ==================== */}
          {activeRoute === '/resident/profile' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DF]">
                <div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    My Resident Profile
                  </h2>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Manage your personal student details and emergency contacts
                  </p>
                </div>

                <Button
                  variant="primary"
                  leftIcon={<Edit3 className="w-4 h-4" />}
                  onClick={() => setShowProfileModal(true)}
                >
                  Edit Profile
                </Button>
              </div>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E7E4DF]">
                  <div 
                    className="w-16 h-16 rounded-full text-white font-heading font-extrabold text-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: profile.avatarColor }}
                  >
                    {profile.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-extrabold text-[#1A1A1A]">
                      {profile.name}
                    </h3>
                    <p className="font-body text-xs text-[#666666]">
                      Roll No: <span className="font-bold text-[#1A1A1A]">{profile.rollNo}</span> • {calculateAge(profile.dob)} Years Old
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-[#8E8E93] block">Hostel Location</span>
                    <span className="font-bold text-sm text-[#1A1A1A] mt-0.5 block">{profile.block}, {profile.floor}, Room {profile.room}</span>
                  </div>

                  <div>
                    <span className="text-[#8E8E93] block">Email Address</span>
                    <span className="font-bold text-sm text-[#1A1A1A] mt-0.5 block">{profile.email}</span>
                  </div>

                  <div>
                    <span className="text-[#8E8E93] block">Mobile Phone</span>
                    <span className="font-bold text-sm text-[#1A1A1A] mt-0.5 block">{profile.phone}</span>
                  </div>

                  <div>
                    <span className="text-[#8E8E93] block">Emergency Guardian</span>
                    <span className="font-bold text-sm text-[#1A1A1A] mt-0.5 block">{profile.emergencyName} ({profile.emergencyPhone})</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== HOSTEL CIRCLE FEED ==================== */}
          {(activeRoute === '/resident/circle' || activeRoute.startsWith('/resident/circle/post/')) && (
            <HostelCircleFeed
              viewMode="resident"
              selectedPostId={
                activeRoute.startsWith('/resident/circle/post/')
                  ? activeRoute.replace('/resident/circle/post/', '')
                  : undefined
              }
              onNavigateRoute={(r) => setActiveRoute(r)}
            />
          )}

          {/* ==================== SETTINGS VIEW ==================== */}
          {activeRoute === '/resident/settings' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <div className="pb-4 border-b border-[#E7E4DF]">
                <h2 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                  Account & App Settings
                </h2>
                <p className="font-body text-xs text-[#666666] mt-1">
                  Configure notification preferences, community privacy, and username
                </p>
              </div>

              {/* Hostel Circle Community Preferences */}
              <div className="space-y-4">
                <CommunitySettings />
              </div>

              <Card className="p-6 space-y-4">
                <h4 className="font-heading text-sm font-bold text-[#1A1A1A] pb-2 border-b border-[#E7E4DF]">
                  Notification & Emergency Controls
                </h4>

                <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DF]">
                  <div>
                    <h5 className="font-heading text-xs font-bold text-[#1A1A1A]">Push Notifications</h5>
                    <p className="font-body text-xs text-[#666666]">Receive SMS & mobile alerts for warden approvals</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#996E7D]" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-heading text-xs font-bold text-[#1A1A1A]">Community Circle Alerts</h5>
                    <p className="font-body text-xs text-[#666666]">Notify when someone replies to your Hostel Circle posts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#2A5C8A]" />
                </div>
              </Card>
            </div>
          )}

        </main>
      </div>

      {/* ==================== NEW COMPLAINT MODAL ==================== */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7E4DF]">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
                  Log New Complaint
                </h3>
                <p className="font-body text-xs text-[#666666]">
                  Dispatches directly to Warden & Floor Technicians
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-1">
                  Issue Category <span className="text-[#D9534F]">*</span>
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] bg-white outline-none focus:border-[#996E7D]"
                  required
                >
                  <option value="Plumbing & Water">Plumbing & Water Leakage</option>
                  <option value="Electrical & Power">Electrical, Fan & Power</option>
                  <option value="Furniture & Fixtures">Furniture, Lock & Carpentry</option>
                  <option value="WiFi & Network">WiFi, Router & Network</option>
                  <option value="Cleanliness & Hygiene">Cleanliness & Hygiene</option>
                  <option value="General Maintenance">General Hostel Maintenance</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-1.5">
                  Severity / Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        newPriority === p
                          ? p === 'High'
                            ? 'bg-[#FDF2F2] border-[#D9534F] text-[#D9534F]'
                            : p === 'Medium'
                            ? 'bg-[#FEF9E7] border-[#F0AD4E] text-[#B7791F]'
                            : 'bg-[#F5EFF2] border-[#996E7D] text-[#996E7D]'
                          : 'bg-[#FAF8F2] border-[#E7E4DF] text-[#666666] hover:border-[#8E8E93]'
                      }`}
                    >
                      {p} Priority
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Short Subject */}
              <Input
                label="Issue Title / Subject"
                placeholder="e.g. Flush valve leaking in washroom B-2"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                required
              />

              {/* Description */}
              <div>
                <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-1">
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide any additional details or specific time slots when maintenance can enter room..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-[12px] border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] bg-white outline-none focus:border-[#996E7D] resize-none"
                />
              </div>

              {/* AI Auto-routing badge */}
              <div className="bg-[#F7EDFC] p-3 rounded-[12px] text-xs text-[#A73FD3] flex items-center gap-2 border border-[#A73FD3]/20">
                <Sparkles className="w-4 h-4 shrink-0 text-[#A73FD3]" />
                <span>
                  <strong>Gemini AI Auto-Routing:</strong> Ticket will auto-notify Warden Dr. Priya & Block Maintenance
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DF]">
                <Button variant="text" type="button" onClick={() => setShowNewModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit & Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== REGISTER VISITOR MODAL ==================== */}
      {showVisitorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7E4DF]">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
                Register Guest QR Pass
              </h3>
              <button
                onClick={() => setShowVisitorModal(false)}
                className="p-1 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <Input
                label="Visitor Full Name"
                placeholder="e.g. Ramesh Sundaram"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />

              <div>
                <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-1">
                  Relationship
                </label>
                <select
                  value={guestRelation}
                  onChange={(e) => setGuestRelation(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] bg-white outline-none focus:border-[#996E7D]"
                >
                  <option value="Parents">Parents</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend / Student</option>
                  <option value="Relative">Relative</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button variant="text" type="button" onClick={() => setShowVisitorModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isGeneratingPass}>
                  {isGeneratingPass ? 'Generating…' : 'Generate Pass'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EMERGENCY SOS MODAL (now with location capture) ==================== */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 text-center shadow-2xl border border-[#D9534F] animate-slideUp">
            <div className="p-3 rounded-full bg-[#FDF2F2] text-[#D9534F] w-16 h-16 mx-auto flex items-center justify-center mb-4 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="font-heading text-xl font-extrabold text-[#1A1A1A] mb-2">
              Confirm Emergency SOS?
            </h3>

            <p className="font-body text-xs text-[#666666] mb-4">
              This will send a high-priority distress signal to Warden & Gate Security.
            </p>

            {/* Emergency Type */}
            <div className="text-left mb-3">
              <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-1">
                What's the emergency?
              </label>
              <select
                value={sosEmergencyType}
                onChange={(e) => setSosEmergencyType(e.target.value)}
                className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] bg-white outline-none focus:border-[#D9534F]"
              >
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Fire / Smoke">Fire / Smoke</option>
                <option value="Security Threat">Security Threat</option>
                <option value="Harassment">Harassment</option>
                <option value="Other Urgent Issue">Other Urgent Issue</option>
              </select>
            </div>

            {/* Location Mode Toggle */}
            <div className="text-left mb-3">
              <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-1">
                Your location
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setSosLocationMode('room')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    sosLocationMode === 'room'
                      ? 'bg-[#996E7D] text-white border-[#996E7D]'
                      : 'bg-[#FAF8F2] border-[#E7E4DF] text-[#666666]'
                  }`}
                >
                  I'm at my room
                </button>
                <button
                  type="button"
                  onClick={() => setSosLocationMode('manual')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    sosLocationMode === 'manual'
                      ? 'bg-[#996E7D] text-white border-[#996E7D]'
                      : 'bg-[#FAF8F2] border-[#E7E4DF] text-[#666666]'
                  }`}
                >
                  I'm elsewhere
                </button>
              </div>

              {sosLocationMode === 'room' ? (
                <p className="text-xs text-[#666666] bg-[#FAF8F2] border border-[#E7E4DF] rounded-xl p-2.5">
                  Sending: <span className="font-bold text-[#1A1A1A]">{profile.block}, {profile.floor}, Room {profile.room}</span>
                </p>
              ) : (
                <input
                  type="text"
                  placeholder="Describe your location (e.g. 2nd floor common hall, near canteen)"
                  value={sosManualLocationNote}
                  onChange={(e) => setSosManualLocationNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] bg-white outline-none focus:border-[#D9534F]"
                />
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowSosModal(false)}
                className="w-full"
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleTriggerSos}
                disabled={sosTriggered || (sosLocationMode === 'manual' && !sosManualLocationNote.trim())}
                className="w-full font-bold"
              >
                {sosTriggered ? 'SENDING...' : 'CONFIRM SOS'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E7E4DF] relative animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DF] mb-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full text-white font-extrabold flex items-center justify-center text-lg shadow-sm"
                  style={{ backgroundColor: profileEditForm.avatarColor }}
                >
                  {profileEditForm.avatarInitials}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-[#1A1A1A]">
                    Edit Profile Details
                  </h3>
                  <p className="font-body text-xs text-[#666666]">
                    Update your student profile and emergency guardian contacts
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="font-heading text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block mb-2">
                  Choose Avatar Color
                </label>
                <div className="flex items-center gap-3">
                  {['#996E7D', '#2A5C8A', '#A73FD3', '#059669', '#D97706'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setProfileEditForm((prev) => ({ ...prev, avatarColor: color }))}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform ${
                        profileEditForm.avatarColor === color ? 'scale-110 ring-2 ring-offset-2 ring-[#1A1A1A]' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {profileEditForm.avatarColor === color && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profileEditForm.name}
                  onChange={(e) => setProfileEditForm({ 
                    ...profileEditForm, 
                    name: e.target.value,
                    avatarInitials: e.target.value.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
                  })}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={profileEditForm.email}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, email: e.target.value })}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={profileEditForm.phone}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, phone: e.target.value })}
                  required
                />

                <Input
                  label="Emergency Contact Name"
                  value={profileEditForm.emergencyName}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, emergencyName: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E4DF]">
                <Button type="button" variant="text" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vaigai AI Helper Modal */}
      <VaigaiAiHelperModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onNavigateRoute={(r) => setActiveRoute(r)}
        userRole="Resident"
      />

      {/* Floating "Stop Siren" control — appears whenever the SOS siren is playing */}
      <SosSirenBanner />

    </div>
  );
};

export default ResidentDashboard;