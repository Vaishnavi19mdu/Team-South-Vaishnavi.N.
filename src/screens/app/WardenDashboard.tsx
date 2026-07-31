import React, { useState } from 'react';
import {
  FileText,
  Users,
  Wrench,
  AlertTriangle,
  Megaphone,
  BarChart3,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Sparkles,
  Building,
  UserCheck,
  UserX,
  ShieldAlert,
  Vote,
  TrendingUp,
  ArrowUpRight,
  Send,
  X,
  ChevronRight,
  Hammer,
  AlertCircle,
  QrCode,
  Camera,
  Flashlight,
  RefreshCw,
  Download,
  Phone,
  Mail,
  MapPin,
  User,
  Lock,
  Bell,
  Eye,
  Globe,
  Shield,
  Edit3,
  Trash2,
  RotateCcw,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
  Activity,
  Calendar,
  ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { useWorkPass, WorkPass } from '../../context/WorkPassContext';
import WardenCircleModeration from '../../components/circle/WardenCircleModeration';
import VaigaiAiHelperModal from '../../components/ai/VaigaiAiHelperModal';

export interface WardenDashboardProps {
  userName?: string;
  onLogout: () => void;
}

// Interfaces
interface ComplaintItem {
  id: string;
  title: string;
  residentName: string;
  room: string;
  block: string;
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';
  category: string;
  date: string;
  description?: string;
}

interface VisitorItem {
  id: string;
  visitorName: string;
  residentName: string;
  room: string;
  purpose: string;
  visitTime: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  passCode: string;
}

interface MaintenanceStaffItem {
  id: string;
  staffName: string;
  profession: 'Electrician' | 'Plumber' | 'Carpenter' | 'Technician' | 'Cleaner';
  assignedComplaint: string;
  room: string;
  progress: number;
  status: 'Active' | 'On Break' | 'Completed';
  phone: string;
}

interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  audience: string;
  date: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  author: string;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({
  userName = 'Dr. Priya Raman',
  onLogout,
}) => {
  const { showToast } = useToast();

  // Navigation State
  const [activeRoute, setActiveRoute] = useState<string>('/warden/dashboard');
  const [showAiModal, setShowAiModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // -------------------------------------------------------------
  // MOCK DATA STATES
  // -------------------------------------------------------------

  // 12 Mock Complaints
  const [complaints, setComplaints] = useState<ComplaintItem[]>([
    {
      id: 'VAI-1082',
      title: 'Water Leakage in Bathroom Valve',
      residentName: 'Vaishnavi S',
      room: 'B-204',
      block: 'Block B',
      priority: 'High',
      assignedTo: 'S. Kumar (Plumber)',
      status: 'In Progress',
      category: 'Plumbing',
      date: 'Today, 09:15 AM',
      description: 'Main washroom flush pipe leaking continuously onto bathroom floor.',
    },
    {
      id: 'VAI-1079',
      title: 'WiFi Router Power Failure',
      residentName: 'Rahul Rao',
      room: 'A-112',
      block: 'Block A',
      priority: 'Medium',
      assignedTo: 'K. Vignesh (IT Tech)',
      status: 'Pending',
      category: 'WiFi & Network',
      date: 'Today, 08:30 AM',
      description: 'Corridor 2nd floor router red light flashing, no internet access.',
    },
    {
      id: 'VAI-1074',
      title: 'Broken Study Desk Hinge',
      residentName: 'Priya K',
      room: 'C-018',
      block: 'Block C',
      priority: 'Low',
      assignedTo: 'R. Ramu (Carpenter)',
      status: 'Assigned',
      category: 'Furniture',
      date: 'Yesterday, 04:20 PM',
      description: 'Left drawer hinge unattached and study table drawer stuck.',
    },
    {
      id: 'VAI-1068',
      title: 'Room Circuit Breaker Tripped',
      residentName: 'Arjun Das',
      room: 'B-105',
      block: 'Block B',
      priority: 'High',
      assignedTo: 'M. Selvam (Electrician)',
      status: 'Pending',
      category: 'Electrical',
      date: 'Yesterday, 02:10 PM',
      description: 'Power cut in entire room B-105 after switching on kettle.',
    },
    {
      id: 'VAI-1052',
      title: 'Ceiling Fan Regulator Noise',
      residentName: 'Siddharth M',
      room: 'A-302',
      block: 'Block A',
      priority: 'Low',
      assignedTo: 'M. Selvam (Electrician)',
      status: 'In Progress',
      date: '2 Days Ago',
      category: 'Electrical',
      description: 'High pitched metallic buzzing noise when fan runs at speed 4.',
    },
    {
      id: 'VAI-1048',
      title: 'Flush Valve Jammed in Washroom',
      residentName: 'Kavitha P',
      room: 'C-210',
      block: 'Block C',
      priority: 'Medium',
      assignedTo: 'S. Kumar (Plumber)',
      status: 'Resolved',
      category: 'Plumbing',
      date: '3 Days Ago',
      description: 'Flush valve handle got stuck in pressed position.',
    },
    {
      id: 'VAI-1041',
      title: 'Corridor Floor Deep Cleaning',
      residentName: 'Hostel Representative',
      room: 'Block B Floor 2',
      block: 'Block B',
      priority: 'Low',
      assignedTo: 'G. Lakshmi (Cleaner)',
      status: 'Resolved',
      category: 'Cleanliness',
      date: '3 Days Ago',
      description: 'Spill stain near elevator lobby needs machine scrub.',
    },
    {
      id: 'VAI-1035',
      title: 'Window Latch Damaged',
      residentName: 'Karthik V',
      room: 'A-201',
      block: 'Block A',
      priority: 'Medium',
      assignedTo: 'R. Ramu (Carpenter)',
      status: 'Pending',
      category: 'Furniture',
      date: '4 Days Ago',
      description: 'Balcony glass window lock loose, doesn\'t close securely.',
    },
    {
      id: 'VAI-1029',
      title: 'LAN Cable Port Broken',
      residentName: 'Devika Nair',
      room: 'B-308',
      block: 'Block B',
      priority: 'Low',
      assignedTo: 'K. Vignesh (IT Tech)',
      status: 'Assigned',
      category: 'WiFi & Network',
      date: '5 Days Ago',
      description: 'RJ45 socket clip broke off inside wall jack plate.',
    },
    {
      id: 'VAI-1022',
      title: 'Water Filter Cartridge Replacement',
      residentName: 'Block C Mess',
      room: 'Mess Hall',
      block: 'Block C',
      priority: 'High',
      assignedTo: 'S. Kumar (Plumber)',
      status: 'In Progress',
      category: 'Plumbing',
      date: '5 Days Ago',
      description: 'RO Water dispenser filter indicator turning red.',
    },
    {
      id: 'VAI-1015',
      title: 'Tube Light Flickering',
      residentName: 'Meera R',
      room: 'A-104',
      block: 'Block A',
      priority: 'Low',
      assignedTo: 'M. Selvam (Electrician)',
      status: 'Resolved',
      category: 'Electrical',
      date: '6 Days Ago',
      description: 'LED tube light starter flickering repeatedly in study corner.',
    },
    {
      id: 'VAI-1008',
      title: 'Door Key Cylinder Sticking',
      residentName: 'Anand Kumar',
      room: 'C-102',
      block: 'Block C',
      priority: 'Medium',
      assignedTo: 'R. Ramu (Carpenter)',
      status: 'Resolved',
      category: 'Furniture',
      date: '1 Week Ago',
      description: 'Main room key requires force to rotate cylinder.',
    },
  ]);

  // Visitor Requests Data
  const [visitors, setVisitors] = useState<VisitorItem[]>([
    {
      id: 'VIS-901',
      visitorName: 'Ramesh Sundaram',
      residentName: 'Vaishnavi S',
      room: 'Room B-204',
      purpose: 'Parent Visit & Homemade Food Dropoff',
      visitTime: 'Today, 04:00 PM - 06:00 PM',
      status: 'Pending',
      passCode: 'VG-PAS-90184',
    },
    {
      id: 'VIS-902',
      visitorName: 'Ananya Rao',
      residentName: 'Rahul Rao',
      room: 'Room A-112',
      purpose: 'Academic Course Material Exchange',
      visitTime: 'Today, 05:30 PM - 07:00 PM',
      status: 'Pending',
      passCode: 'VG-PAS-90291',
    },
    {
      id: 'VIS-903',
      visitorName: 'Suresh Kumar',
      residentName: 'Priya K',
      room: 'Room C-018',
      purpose: 'Medical Medicines Delivery',
      visitTime: 'Tomorrow, 10:00 AM - 12:00 PM',
      status: 'Pending',
      passCode: 'VG-PAS-90342',
    },
    {
      id: 'VIS-898',
      visitorName: 'Girish Menon',
      residentName: 'Arjun Das',
      room: 'Room B-105',
      purpose: 'Relative Dropping Off Luggage',
      visitTime: 'Yesterday, 02:00 PM',
      status: 'Approved',
      passCode: 'VG-PAS-89812',
    },
    {
      id: 'VIS-890',
      visitorName: 'Vijay V',
      residentName: 'Karthik V',
      room: 'Room A-201',
      purpose: 'Casual Meeting at Visitor Lounge',
      visitTime: '2 Days Ago',
      status: 'Rejected',
      passCode: 'VG-PAS-89004',
    },
  ]);

  // Maintenance Staff Roster
  const [staffList, setStaffList] = useState<MaintenanceStaffItem[]>([
    { id: 'ST-01', staffName: 'S. Kumar', profession: 'Plumber', assignedComplaint: 'Water Leakage in Bathroom Valve (VAI-1082)', room: 'Room B-204', progress: 80, status: 'Active', phone: '+91 98760 11223' },
    { id: 'ST-02', staffName: 'M. Selvam', profession: 'Electrician', assignedComplaint: 'Ceiling Fan Regulator Noise (VAI-1052)', room: 'Room A-302', progress: 45, status: 'Active', phone: '+91 98760 22334' },
    { id: 'ST-03', staffName: 'R. Ramu', profession: 'Carpenter', assignedComplaint: 'Broken Study Desk Hinge (VAI-1074)', room: 'Room C-018', progress: 20, status: 'Active', phone: '+91 98760 33445' },
    { id: 'ST-04', staffName: 'K. Vignesh', profession: 'Technician', assignedComplaint: 'WiFi Router Power Failure (VAI-1079)', room: 'Room A-112', progress: 60, status: 'Active', phone: '+91 98760 44556' },
    { id: 'ST-05', staffName: 'G. Lakshmi', profession: 'Cleaner', assignedComplaint: 'Corridor Floor Machine Scrubbing', room: 'Block B Floor 2', progress: 100, status: 'On Break', phone: '+91 98760 55667' },
  ]);

  // Announcements Data
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    {
      id: 'ANN-101',
      title: 'Scheduled Water Tank Flushing & Shutdown',
      description: 'Water supply to Block A & B will be shut down between 6:00 AM to 9:00 AM on Saturday for annual pressure washing.',
      audience: 'All Block Residents',
      date: 'Today, 02:15 PM',
      status: 'Published',
      author: 'Dr. Priya Raman (Warden)',
    },
    {
      id: 'ANN-102',
      title: 'Mandatory Room Safety & Cleanliness Audit',
      description: 'Hostel Committee and Wardens will inspect rooms for unauthorized electrical appliances and balcony safety.',
      audience: 'Block A & B Students',
      date: 'Yesterday, 05:00 PM',
      status: 'Published',
      author: 'Hostel Warden Office',
    },
    {
      id: 'ANN-103',
      title: 'Mess Menu Revision & Feedback Poll',
      description: 'Vote on proposed dinner menu changes for the upcoming month using the Hostel App poll section.',
      audience: 'All Hostel Residents',
      date: '3 Days Ago',
      status: 'Published',
      author: 'Mess Committee Manager',
    },
  ]);

  // Active Poll State
  const [pollData, setPollData] = useState({
    id: 'POLL-01',
    question: 'Should night study room hours in Block B be extended to 2:00 AM during mid-semester exams?',
    totalVotes: 248,
    options: [
      { id: 'opt1', text: 'Yes, extend to 2:00 AM', votes: 182 },
      { id: 'opt2', text: 'Keep current 12:00 AM limit', votes: 52 },
      { id: 'opt3', text: 'Extend to 1:00 AM only', votes: 14 },
    ],
  });

  // Emergency SOS Items
  const [sosAlerts, setSosAlerts] = useState([
    {
      id: 'SOS-004',
      studentName: 'Ananya Sharma',
      room: 'Room A-308',
      time: '12 mins ago',
      status: 'Active',
      priority: 'CRITICAL',
      reason: 'Medical Sudden Fever & Dizziness',
      contact: '+91 91234 56789',
    },
    {
      id: 'SOS-003',
      studentName: 'Karthik N',
      room: 'Room B-112',
      time: 'Yesterday, 11:45 PM',
      status: 'Resolved',
      priority: 'HIGH',
      reason: 'Power Outlet Short Circuit Spark',
      contact: '+91 98765 12345',
    },
  ]);

  // Warden Profile State
  const [profile, setProfile] = useState({
    name: 'Dr. Priya Raman',
    role: 'Hostel Warden',
    hostel: 'Vaigai Hostel',
    empId: 'EMP-7842',
    department: 'Student Affairs & Hostel Administration',
    phone: '+91 98765 43210',
    email: 'priya.raman@vaigai.edu.in',
    office: 'Warden Suite 101, Main Administrative Block',
  });

  // -------------------------------------------------------------
  // UI & MODAL STATES
  // -------------------------------------------------------------

  // Filter & Search states for Complaints page
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintFilter, setComplaintFilter] = useState<'All' | 'Pending' | 'Assigned' | 'In Progress' | 'Resolved'>('All');
  const [complaintSort, setComplaintSort] = useState<'priority' | 'date' | 'room'>('priority');

  // Selected Items for Modals
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTechId, setAssignTechId] = useState('S. Kumar (Plumber)');

  // QR Pass Modal
  const [selectedVisitorForQR, setSelectedVisitorForQR] = useState<VisitorItem | null>(null);

  // QR Scanner Simulated State
  const [qrFlashOn, setQrFlashOn] = useState(false);
  const [qrCameraFront, setQrCameraFront] = useState(false);
  const [manualQrCode, setManualQrCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    verified: boolean;
    visitor: string;
    resident: string;
    time: string;
    status: string;
  } | null>(null);

  // Modals for Announcements & Polls
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [annAudience, setAnnAudience] = useState('All Block Residents');

  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');

  // Reassign Maintenance Modal
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedStaffForReassign, setSelectedStaffForReassign] = useState<MaintenanceStaffItem | null>(null);
  const [reassignTargetComplaint, setReassignTargetComplaint] = useState('');

  // Edit Profile Modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    gateLockTime: '10:30 PM',
    smsSosAlerts: true,
    emailDailyReport: true,
    whatsappDispatch: true,
    darkTheme: false,
    highContrast: false,
    language: 'English',
    autoApproveParents: false,
    dataRetentionMonths: '12 Months',
  });

  // Work Pass Context
  const { passes, approveExtension } = useWorkPass();

  // -------------------------------------------------------------
  // RECHARTS ANALYTICS DATA
  // -------------------------------------------------------------
  const categoryChartData = [
    { name: 'Plumbing', count: 38, fill: '#996E7D' },
    { name: 'Electrical', count: 27, fill: '#2A5C8A' },
    { name: 'WiFi & Net', count: 18, fill: '#A73FD3' },
    { name: 'Furniture', count: 12, fill: '#F0AD4E' },
    { name: 'Cleanliness', count: 9, fill: '#5CB85C' },
  ];

  const monthlyTrendData = [
    { month: 'Jan', logged: 42, resolved: 40 },
    { month: 'Feb', logged: 55, resolved: 52 },
    { month: 'Mar', logged: 68, resolved: 65 },
    { month: 'Apr', logged: 48, resolved: 47 },
    { month: 'May', logged: 60, resolved: 58 },
    { month: 'Jun', logged: 74, resolved: 70 },
  ];

  const resolutionTimeData = [
    { category: 'Plumbing', avgHours: 3.2 },
    { category: 'Electrical', avgHours: 2.1 },
    { category: 'WiFi Net', avgHours: 1.5 },
    { category: 'Furniture', avgHours: 6.8 },
    { category: 'Cleanliness', avgHours: 1.2 },
  ];

  const maintenancePerformanceData = [
    { staff: 'S. Kumar', trade: 'Plumber', resolved: 42, rating: 4.8 },
    { staff: 'M. Selvam', trade: 'Electrician', resolved: 36, rating: 4.9 },
    { staff: 'R. Ramu', trade: 'Carpenter', resolved: 24, rating: 4.6 },
    { staff: 'K. Vignesh', trade: 'IT Tech', resolved: 51, rating: 4.9 },
    { staff: 'G. Lakshmi', trade: 'Cleaner', resolved: 60, rating: 4.7 },
  ];

  // -------------------------------------------------------------
  // ACTION HANDLERS
  // -------------------------------------------------------------

  // Filtered complaints calculation
  const filteredComplaints = complaints
    .filter((c) => {
      const matchFilter = complaintFilter === 'All' ? true : c.status === complaintFilter;
      const matchSearch =
        c.title.toLowerCase().includes(complaintSearch.toLowerCase()) ||
        c.residentName.toLowerCase().includes(complaintSearch.toLowerCase()) ||
        c.room.toLowerCase().includes(complaintSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(complaintSearch.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => {
      if (complaintSort === 'priority') {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (complaintSort === 'room') {
        return a.room.localeCompare(b.room);
      }
      return 0;
    });

  // Handle Assign Tech
  const handleAssignConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? { ...c, status: 'In Progress', assignedTo: assignTechId }
          : c
      )
    );

    setShowAssignModal(false);
    setSelectedComplaint(null);

    showToast({
      title: 'Technician Dispatched',
      message: `Assigned ${assignTechId} to Ticket ${selectedComplaint.id}.`,
      type: 'success',
    });
  };

  // Handle Mark Complaint Resolved
  const handleMarkResolved = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' } : c))
    );
    showToast({
      title: 'Complaint Marked Resolved',
      message: `Ticket ${id} closed and verified by Warden.`,
      type: 'success',
    });
  };

  // Visitor Pass Decision
  const handleVisitorDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: decision } : v))
    );
    const vis = visitors.find((v) => v.id === id);
    if (decision === 'Approved') {
      showToast({
        title: 'Visitor Pass Approved',
        message: `Generated QR pass for ${vis?.visitorName}. Resident notified.`,
        type: 'success',
      });
    } else {
      showToast({
        title: 'Visitor Request Declined',
        message: `Request for ${vis?.visitorName} declined.`,
        type: 'error',
      });
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle) return;

    const newAnn: AnnouncementItem = {
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      title: annTitle,
      description: annDesc || 'Official hostel update broadcasted by Warden Office.',
      audience: annAudience,
      date: 'Just now',
      status: 'Published',
      author: profile.name,
    };

    setAnnouncements([newAnn, ...announcements]);
    setAnnTitle('');
    setAnnDesc('');
    setShowAnnouncementModal(false);

    showToast({
      title: 'Notice Published',
      message: 'Announcement broadcasted to student app feed!',
      type: 'success',
    });
  };

  // Create Poll
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion) return;

    setPollData({
      id: `POLL-${Math.floor(10 + Math.random() * 90)}`,
      question: pollQuestion,
      totalVotes: 0,
      options: [
        { id: 'opt1', text: 'Option A (Agree)', votes: 0 },
        { id: 'opt2', text: 'Option B (Disagree)', votes: 0 },
      ],
    });

    setPollQuestion('');
    setShowPollModal(false);

    showToast({
      title: 'New Poll Live',
      message: 'Resident voting poll created and active!',
      type: 'success',
    });
  };

  // QR Scan Verification
  const handleVerifyManualQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQrCode) return;

    // Simulate match
    setScannedResult({
      verified: true,
      visitor: 'Rahul Sharma (Parent)',
      resident: 'Vaishnavi S (Room B-204)',
      time: 'Today, 02:30 PM - Gate 1',
      status: 'APPROVED ENTRY',
    });

    showToast({
      title: 'QR Code Verified ✅',
      message: 'Valid entry pass for Rahul Sharma verified by Gate Security.',
      type: 'success',
    });
  };

  // Breadcrumb Helper Component
  const renderBreadcrumbs = (currentPage: string) => (
    <div className="flex items-center gap-2 text-xs font-body text-[#8E8E93] mb-4">
      <span
        onClick={() => setActiveRoute('/warden/dashboard')}
        className="hover:text-[#996E7D] cursor-pointer transition-colors"
      >
        Warden Portal
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-[#CCCCCC]" />
      <span className="font-bold text-[#1A1A1A] capitalize">{currentPage}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex">
      {/* Dynamic Role Sidebar */}
      <Sidebar
        role="warden"
        activeRoute={activeRoute}
        onNavigate={(route) => setActiveRoute(route)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onLogout={onLogout}
        onOpenAiHelper={() => setShowAiModal(true)}
      />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'
        }`}
      >
        {/* Top Header */}
        <TopBar
          role="warden"
          currentPageTitle={
            activeRoute === '/warden/dashboard'
              ? 'Warden Dashboard'
              : activeRoute === '/warden/qr-scanner'
              ? 'Gate QR Scanner'
              : activeRoute.replace('/warden/', '').replace('-', ' ').toUpperCase()
          }
          userRole={profile.role}
          userName={profile.name}
          avatarInitials="WA"
          avatarColor="#2A5C8A"
          hostelBlock={profile.hostel}
          roomNumber="Campus Block A"
          unreadCount={4}
          showBackButton={activeRoute !== '/warden/dashboard'}
          onBack={() => setActiveRoute('/warden/dashboard')}
          onOpenAiHelper={() => setShowAiModal(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigate={(r) => setActiveRoute(r)}
          onLogout={onLogout}
          // FIX: these were missing entirely, so the Profile Overview modal
          // was silently showing TopBar's hardcoded Super Admin fallback
          // values (SA-9001 / superadmin@vaigai.edu.in) instead of the
          // Warden's real details from `profile` state above.
          profileEmployeeId={profile.empId}
          profileEmail={profile.email}
          profileAccessLevel={profile.role}
          profileOfficeLocation={profile.office}
          profilePrimaryCampus={profile.hostel}
          profileStats={[
            { label: 'Pending Complaints', value: String(complaints.filter((c) => c.status === 'Pending').length), color: '#D9534F' },
            { label: 'Active Maintenance', value: String(staffList.filter((s) => s.status === 'Active').length), color: '#2A5C8A' },
            { label: "Today's Visitors", value: String(visitors.length), color: '#996E7D' },
            { label: 'Open SOS Alerts', value: String(sosAlerts.filter((s) => s.status === 'Active').length), color: '#D9534F' },
          ]}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ==================== 1. WARDEN DASHBOARD ==================== */}
          {activeRoute === '/warden/dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {renderBreadcrumbs('Dashboard')}

              {/* WELCOME CARD */}
              <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2A5C8A] to-[#1A1A1A] rounded-[24px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-3xl transform skew-x-12 pointer-events-none hidden md:block" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-md">
                        Good Evening 👋
                      </span>
                      <span className="text-xs text-white/70 font-mono">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {profile.name}
                    </h1>
                    <p className="font-body text-xs sm:text-sm text-white/80 mt-1">
                      {profile.role} • <strong className="text-white">{profile.hostel}</strong>, Campus Block A
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-[16px] backdrop-blur-md border border-white/15 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[#996E7D] text-white flex items-center justify-center font-black text-sm shadow-inner">
                      94%
                    </div>
                    <div>
                      <span className="text-xs text-white/70 block">Block Occupancy</span>
                      <span className="text-xs font-bold text-white">376 / 400 Residents Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Pending Complaints */}
                <Card
                  onClick={() => setActiveRoute('/warden/complaints')}
                  className="p-4 hover:border-[#996E7D] cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#FDF2F2] text-[#D9534F] group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF2F2] text-[#D9534F]">
                      +12% wk
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    {complaints.filter((c) => c.status === 'Pending').length}
                  </h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Pending Complaints</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">3 urgent priority</p>
                </Card>

                {/* Active Maintenance */}
                <Card
                  onClick={() => setActiveRoute('/warden/maintenance')}
                  className="p-4 hover:border-[#2A5C8A] cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#EBF3FA] text-[#2A5C8A] group-hover:scale-110 transition-transform">
                      <Wrench className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3FA] text-[#2A5C8A]">
                      On Site
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    {staffList.filter((s) => s.status === 'Active').length}
                  </h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Active Maintenance</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">2 near completion</p>
                </Card>

                {/* Today's Visitors */}
                <Card
                  onClick={() => setActiveRoute('/warden/visitors')}
                  className="p-4 hover:border-[#996E7D] cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#F5EFF2] text-[#996E7D] group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5EFF2] text-[#996E7D]">
                      Gate Pass
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    {visitors.length}
                  </h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Today's Visitors</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">
                    {visitors.filter((v) => v.status === 'Pending').length} awaiting pass
                  </p>
                </Card>

                {/* Open SOS Alerts */}
                <Card
                  onClick={() => setActiveRoute('/warden/sos')}
                  className="p-4 hover:border-[#D9534F] cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#FDF2F2] text-[#D9534F] group-hover:scale-110 transition-transform">
                      <ShieldAlert className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF2F2] text-[#D9534F]">
                      Emergency
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    {sosAlerts.filter((s) => s.status === 'Active').length}
                  </h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Open SOS Alerts</p>
                  <p className="font-body text-[11px] text-[#D9534F] font-semibold mt-1">
                    {sosAlerts.filter((s) => s.status === 'Active').length > 0 ? '1 medical dispatch' : 'No active alerts'}
                  </p>
                </Card>

                {/* Unread Announcements */}
                <Card
                  onClick={() => setActiveRoute('/warden/announcements')}
                  className="p-4 hover:border-[#A73FD3] cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#F7EDFC] text-[#A73FD3] group-hover:scale-110 transition-transform">
                      <Megaphone className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7EDFC] text-[#A73FD3]">
                      Active
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    {announcements.length}
                  </h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Announcements</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">1 active poll live</p>
                </Card>

                {/* Occupancy Rate */}
                <Card className="p-4 hover:border-[#5CB85C] transition-all hover:shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32] group-hover:scale-110 transition-transform">
                      <Building className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                      Block A
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">94%</h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Occupancy Rate</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">376 / 400 Beds</p>
                </Card>
              </div>

              {/* QUICK ACTIONS BAR */}
              <div className="bg-white p-5 rounded-[20px] border border-[#E7E4DF] shadow-xs">
                <h3 className="font-heading text-xs font-extrabold text-[#8E8E93] uppercase tracking-wider mb-3">
                  Warden Quick Operations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <button
                    onClick={() => setActiveRoute('/warden/visitors')}
                    className="p-3 rounded-[14px] bg-[#FAF8F2] hover:bg-[#F5EFF2] hover:border-[#996E7D] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <UserCheck className="w-5 h-5 text-[#996E7D] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Approve Visitors</span>
                  </button>

                  <button
                    onClick={() => setActiveRoute('/warden/maintenance')}
                    className="p-3 rounded-[14px] bg-[#FAF8F2] hover:bg-[#EBF3FA] hover:border-[#2A5C8A] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <Wrench className="w-5 h-5 text-[#2A5C8A] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Assign Maintenance</span>
                  </button>

                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="p-3 rounded-[14px] bg-[#FAF8F2] hover:bg-[#F7EDFC] hover:border-[#A73FD3] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <Megaphone className="w-5 h-5 text-[#A73FD3] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Create Notice</span>
                  </button>

                  <button
                    onClick={() => setShowPollModal(true)}
                    className="p-3 rounded-[14px] bg-[#FAF8F2] hover:bg-[#FEF9E7] hover:border-[#F0AD4E] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <Vote className="w-5 h-5 text-[#B7791F] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Create Poll</span>
                  </button>

                  <button
                    onClick={() => setActiveRoute('/warden/analytics')}
                    className="p-3 rounded-[14px] bg-[#FAF8F2] hover:bg-[#E8F5E9] hover:border-[#2E7D32] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <BarChart3 className="w-5 h-5 text-[#2E7D32] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">View Analytics</span>
                  </button>

                  <button
                    onClick={() => setActiveRoute('/warden/sos')}
                    className="p-3 rounded-[14px] bg-[#FDF2F2] hover:bg-[#FDF2F2]/80 border border-[#D9534F]/30 text-[#D9534F] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <AlertTriangle className="w-5 h-5 text-[#D9534F] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Emergency Dashboard</span>
                  </button>
                </div>
              </div>

              {/* TWO COLUMN GRID: PENDING COMPLAINTS & VISITOR APPROVALS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PENDING COMPLAINTS */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-lg font-extrabold text-[#1A1A1A] tracking-tight">
                        Pending Complaint Dispatches
                      </h2>
                      <p className="font-body text-xs text-[#666666]">
                        Requires Warden review & technician assignment
                      </p>
                    </div>

                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => setActiveRoute('/warden/complaints')}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      View All 12 Complaints
                    </Button>
                  </div>

                  <Card className="p-0 overflow-hidden border border-[#E7E4DF]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FAF8F2] border-b border-[#E7E4DF] text-[11px] font-heading font-extrabold text-[#666666] uppercase tracking-wider">
                            <th className="p-3.5 pl-5">Complaint</th>
                            <th className="p-3.5">Room</th>
                            <th className="p-3.5">Priority</th>
                            <th className="p-3.5">Assigned To</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 pr-5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7E4DF] text-xs font-body text-[#1A1A1A]">
                          {complaints.slice(0, 5).map((item) => (
                            <tr key={item.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                              <td className="p-3.5 pl-5">
                                <div className="font-bold text-[#1A1A1A]">{item.title}</div>
                                <div className="text-[10px] text-[#8E8E93] font-mono mt-0.5">
                                  {item.id} • {item.date}
                                </div>
                              </td>

                              <td className="p-3.5 font-mono font-bold text-[#996E7D]">
                                {item.room}
                              </td>

                              <td className="p-3.5">
                                <Badge
                                  variant={item.priority === 'High' ? 'danger' : item.priority === 'Medium' ? 'warning' : 'primary'}
                                  size="sm"
                                >
                                  {item.priority}
                                </Badge>
                              </td>

                              <td className="p-3.5 text-[#2A5C8A] font-semibold">
                                {item.assignedTo}
                              </td>

                              <td className="p-3.5">
                                <Badge
                                  variant={item.status === 'In Progress' ? 'warning' : item.status === 'Assigned' ? 'primary' : 'secondary'}
                                  size="sm"
                                >
                                  {item.status}
                                </Badge>
                              </td>

                              <td className="p-3.5 pr-5 text-right">
                                {item.status === 'Pending' ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedComplaint(item);
                                      setShowAssignModal(true);
                                    }}
                                  >
                                    Assign Tech
                                  </Button>
                                ) : (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleMarkResolved(item.id)}
                                  >
                                    Resolve
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* VISITOR REQUESTS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-lg font-extrabold text-[#1A1A1A] tracking-tight">
                        Visitor Pass Approvals
                      </h2>
                      <p className="font-body text-xs text-[#666666]">
                        Pending security gate approvals
                      </p>
                    </div>

                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => setActiveRoute('/warden/visitors')}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      All Requests
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {visitors.slice(0, 3).map((item) => (
                      <Card key={item.id} className="p-4 space-y-3 hover:border-[#996E7D] transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                              {item.visitorName}
                            </h4>
                            <p className="font-body text-xs text-[#666666]">
                              Visiting <strong className="text-[#1A1A1A]">{item.residentName}</strong> ({item.room})
                            </p>
                          </div>

                          <Badge
                            variant={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'secondary'}
                            size="sm"
                          >
                            {item.status}
                          </Badge>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#FAF8F2] text-xs text-[#555555] border border-[#E7E4DF]">
                          <span className="font-semibold text-[#1A1A1A] block mb-0.5">Purpose:</span>
                          {item.purpose}
                          <span className="block text-[10px] text-[#8E8E93] mt-1 font-mono">
                            Time: {item.visitTime}
                          </span>
                        </div>

                        {item.status === 'Pending' ? (
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                              onClick={() => handleVisitorDecision(item.id, 'Approved')}
                            >
                              Approve
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              className="flex-1"
                              leftIcon={<UserX className="w-3.5 h-3.5" />}
                              onClick={() => handleVisitorDecision(item.id, 'Rejected')}
                            >
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            leftIcon={<QrCode className="w-3.5 h-3.5" />}
                            onClick={() => setSelectedVisitorForQR(item)}
                          >
                            View Pass QR
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* ANALYTICS PREVIEW SECTION */}
              <div className="space-y-4 pt-4 border-t border-[#E7E4DF]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-extrabold text-[#1A1A1A] tracking-tight">
                      Real-time Complaint & Resolution Analytics
                    </h2>
                    <p className="font-body text-xs text-[#666666]">
                      Hostel complaint category breakdown and monthly resolution trends
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveRoute('/warden/analytics')}
                  >
                    Open Full Analytics
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Breakdown Bar Chart */}
                  <Card className="p-5 space-y-3">
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                      Complaint Distribution by Category
                    </h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Monthly Trend Area Chart */}
                  <Card className="p-5 space-y-3">
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                      Monthly Logged vs. Resolved Tickets
                    </h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                          <Area type="monotone" dataKey="logged" stroke="#996E7D" fill="#F5EFF2" name="Logged" />
                          <Area type="monotone" dataKey="resolved" stroke="#2E7D32" fill="#E8F5E9" name="Resolved" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. COMPLAINTS MANAGEMENT ==================== */}
          {activeRoute === '/warden/complaints' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Complaints')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Complaint Management Center
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Search, filter, assign technicians, and track resolution timeline across all hostel blocks.
                  </p>
                </div>

                <Badge variant="primary" size="md">
                  Total {complaints.length} Tickets Logged
                </Badge>
              </div>

              {/* SEARCH, FILTER CHIPS & SORT */}
              <div className="bg-white p-4 rounded-[20px] border border-[#E7E4DF] shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                    <input
                      type="text"
                      placeholder="Search complaint by title, resident name, room or ticket ID..."
                      value={complaintSearch}
                      onChange={(e) => setComplaintSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] outline-none focus:border-[#996E7D] bg-[#FAF8F2]"
                    />
                    {complaintSearch && (
                      <button
                        onClick={() => setComplaintSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1A1A1A]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-xs font-bold text-[#8E8E93] shrink-0">Sort By:</span>
                    <select
                      value={complaintSort}
                      onChange={(e) => setComplaintSort(e.target.value as any)}
                      className="p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs font-body text-[#1A1A1A] bg-[#FAF8F2] outline-none focus:border-[#996E7D]"
                    >
                      <option value="priority">Priority Level</option>
                      <option value="room">Room Number</option>
                      <option value="date">Date Logged</option>
                    </select>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  <span className="text-xs font-bold text-[#8E8E93] mr-1 shrink-0 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Status:
                  </span>
                  {(['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'] as const).map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setComplaintFilter(chip)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                        complaintFilter === chip
                          ? 'bg-[#996E7D] text-white shadow-xs'
                          : 'bg-[#FAF8F2] text-[#666666] border border-[#E7E4DF] hover:border-[#8E8E93]'
                      }`}
                    >
                      {chip}{' '}
                      {chip === 'All'
                        ? `(${complaints.length})`
                        : `(${complaints.filter((c) => c.status === chip).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* COMPLAINTS GRID (12 MOCK COMPLAINTS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComplaints.map((item) => (
                  <Card key={item.id} className="p-5 space-y-3.5 hover:border-[#996E7D] transition-all hover:shadow-md flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant={item.priority === 'High' ? 'danger' : item.priority === 'Medium' ? 'warning' : 'primary'}
                          size="sm"
                        >
                          {item.priority} Priority
                        </Badge>

                        <Badge
                          variant={item.status === 'Resolved' ? 'success' : item.status === 'In Progress' ? 'warning' : 'secondary'}
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A] leading-snug">
                        {item.title}
                      </h3>

                      <p className="font-body text-xs text-[#666666] line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E7E4DF] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[#555555]">
                        <span>Resident: <strong className="text-[#1A1A1A]">{item.residentName}</strong></span>
                        <span className="font-mono font-bold text-[#996E7D]">{item.room}</span>
                      </div>

                      <div className="flex items-center justify-between text-[#555555]">
                        <span>Assigned: <strong className="text-[#2A5C8A]">{item.assignedTo}</strong></span>
                        <span className="text-[10px] text-[#8E8E93]">{item.date}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedComplaint(item)}
                        >
                          Details
                        </Button>

                        {item.status !== 'Resolved' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedComplaint(item);
                              setShowAssignModal(true);
                            }}
                          >
                            Assign Tech
                          </Button>
                        )}

                        {item.status !== 'Resolved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkResolved(item.id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredComplaints.length === 0 && (
                <div className="bg-white p-12 text-center rounded-[24px] border border-[#E7E4DF] space-y-3">
                  <FileText className="w-10 h-10 text-[#CCCCCC] mx-auto" />
                  <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">No complaints match filter</h3>
                  <p className="font-body text-xs text-[#666666]">Try clearing your search query or status filter.</p>
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. VISITOR MANAGEMENT ==================== */}
          {activeRoute === '/warden/visitors' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Visitors')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Visitor Security & Pass Approvals
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Review gate pass requests from residents, issue QR access codes, or decline visitors.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<QrCode className="w-4 h-4" />}
                  onClick={() => setActiveRoute('/warden/qr-scanner')}
                >
                  Open QR Gate Scanner
                </Button>
              </div>

              {/* VISITOR CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visitors.map((item) => (
                  <Card key={item.id} className="p-5 space-y-4 hover:border-[#996E7D] transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#8E8E93]">{item.id}</span>
                        <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                          {item.visitorName}
                        </h3>
                      </div>

                      <Badge
                        variant={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1.5 text-xs">
                      <div>
                        <span className="text-[#8E8E93]">Resident Host:</span>{' '}
                        <strong className="text-[#1A1A1A]">{item.residentName}</strong> ({item.room})
                      </div>
                      <div>
                        <span className="text-[#8E8E93]">Visit Purpose:</span>{' '}
                        <span className="text-[#1A1A1A] font-medium">{item.purpose}</span>
                      </div>
                      <div>
                        <span className="text-[#8E8E93]">Expected Slot:</span>{' '}
                        <span className="font-mono text-[#996E7D] font-bold">{item.visitTime}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {item.status === 'Pending' ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                            onClick={() => handleVisitorDecision(item.id, 'Approved')}
                          >
                            Approve Pass
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            className="flex-1"
                            leftIcon={<UserX className="w-3.5 h-3.5" />}
                            onClick={() => handleVisitorDecision(item.id, 'Rejected')}
                          >
                            Decline
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          leftIcon={<QrCode className="w-4 h-4" />}
                          onClick={() => setSelectedVisitorForQR(item)}
                        >
                          View Gate QR Pass
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. QR SCANNER PAGE ==================== */}
          {activeRoute === '/warden/qr-scanner' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('QR Scanner')}

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Gate 1 Live QR Pass Scanner
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Simulates security scanner for verifying student visitor digital passes at hostel entry.
                  </p>
                </div>

                <Badge variant="success" size="md">
                  Gate Security Online
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CAMERA PREVIEW PLACEHOLDER */}
                <div className="lg:col-span-2 bg-[#1A1A1A] rounded-[24px] p-6 text-white shadow-2xl relative flex flex-col items-center justify-center min-h-[420px] border border-black overflow-hidden">
                  {/* Camera view header */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      CAMERA PREVIEW ACTIVE
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setQrFlashOn(!qrFlashOn);
                          showToast({ title: qrFlashOn ? 'Flash Off' : 'Flash On', message: 'Toggled gate camera light', type: 'info' });
                        }}
                        className={`p-2 rounded-full ${qrFlashOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'} backdrop-blur-md transition-colors`}
                      >
                        <Flashlight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setQrCameraFront(!qrCameraFront);
                          showToast({ title: 'Camera Switched', message: qrCameraFront ? 'Using Rear Gate Camera' : 'Using Front Camera', type: 'info' });
                        }}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* SCANNING TARGET FRAME WITH ANIMATED LINE */}
                  <div className="relative w-64 h-64 border-2 border-dashed border-[#996E7D] rounded-3xl flex items-center justify-center p-4 my-8">
                    {/* Animated scanning bar */}
                    <div className="absolute left-2 right-2 h-1 bg-[#996E7D] rounded-full shadow-[0_0_15px_#996E7D] animate-bounce" />

                    <QrCode className="w-24 h-24 text-white/20" />
                    <p className="absolute bottom-3 text-[11px] font-mono text-white/60">
                      Align Visitor QR Pass inside frame
                    </p>
                  </div>

                  {/* Manual trigger scan simulation button */}
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Camera className="w-4 h-4" />}
                    onClick={() => {
                      setScannedResult({
                        verified: true,
                        visitor: 'Ramesh Sundaram (Parent)',
                        resident: 'Vaishnavi S (Room B-204)',
                        time: 'Today, 04:00 PM - Gate 1',
                        status: 'APPROVED ENTRY',
                      });
                      showToast({ title: 'QR Code Scanned ✅', message: 'Visitor pass verified successfully!', type: 'success' });
                    }}
                  >
                    Simulate Camera QR Scan
                  </Button>
                </div>

                {/* MANUAL ENTRY & SCAN RESULT SIDEBAR */}
                <div className="space-y-6">
                  {/* Manual Code Input */}
                  <Card className="p-5 space-y-4">
                    <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">
                      Manual Pass Verification
                    </h3>
                    <p className="font-body text-xs text-[#666666]">
                      If visitor camera QR display is broken, enter Unique Pass ID printed on pass.
                    </p>

                    <form onSubmit={handleVerifyManualQr} className="space-y-3">
                      <Input
                        label="Pass Code (e.g. VG-PAS-90184)"
                        placeholder="VG-PAS-90184"
                        value={manualQrCode}
                        onChange={(e) => setManualQrCode(e.target.value)}
                        required
                      />

                      <Button variant="secondary" size="md" type="submit" className="w-full">
                        Verify Pass Code
                      </Button>
                    </form>
                  </Card>

                  {/* SCAN RESULT OVERLAY CARD */}
                  {scannedResult ? (
                    <Card className="p-5 space-y-3 bg-[#E8F5E9] border-[#2E7D32] animate-fadeIn">
                      <div className="flex items-center gap-2 text-[#2E7D32]">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <h4 className="font-heading text-sm font-black uppercase tracking-wider">
                          {scannedResult.status}
                        </h4>
                      </div>

                      <div className="space-y-1 text-xs text-[#1A1A1A]">
                        <div><span className="text-[#666666]">Visitor:</span> <strong>{scannedResult.visitor}</strong></div>
                        <div><span className="text-[#666666]">Host Resident:</span> <strong>{scannedResult.resident}</strong></div>
                        <div><span className="text-[#666666]">Approved Slot:</span> <span className="font-mono">{scannedResult.time}</span></div>
                      </div>

                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => setScannedResult(null)}
                        className="text-[#2E7D32] p-0 text-xs font-bold hover:underline"
                      >
                        Clear Result
                      </Button>
                    </Card>
                  ) : (
                    <Card className="p-5 text-center text-xs text-[#8E8E93] border-dashed">
                      No scan performed yet. Point camera at visitor phone or click simulate scan.
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5. MAINTENANCE MANAGEMENT ==================== */}
          {activeRoute === '/warden/maintenance' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Maintenance')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Maintenance Staff Roster & Assignments
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Track electrician, plumber, carpenter, IT technician, and cleaning staff workload.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    if (staffList.length > 0) {
                      setSelectedStaffForReassign(staffList[0]);
                      setShowReassignModal(true);
                    }
                  }}
                >
                  Reassign Task
                </Button>
              </div>

              {/* STAFF CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {staffList.map((staff) => (
                  <Card key={staff.id} className="p-5 space-y-4 hover:border-[#2A5C8A] transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-[#EBF3FA] text-[#2A5C8A] font-extrabold text-sm">
                          {staff.profession.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">
                            {staff.staffName}
                          </h3>
                          <p className="font-body text-xs text-[#2A5C8A] font-semibold">
                            {staff.profession}
                          </p>
                        </div>
                      </div>

                      <Badge variant={staff.status === 'Active' ? 'success' : 'secondary'} size="sm">
                        {staff.status}
                      </Badge>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-2 text-xs">
                      <div>
                        <span className="text-[#8E8E93] block">Active Assignment:</span>
                        <strong className="text-[#1A1A1A]">{staff.assignedComplaint}</strong>
                      </div>
                      <div>
                        <span className="text-[#8E8E93]">Location:</span>{' '}
                        <span className="font-mono text-[#996E7D] font-bold">{staff.room}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-bold text-[#1A1A1A]">
                          <span>Work Progress</span>
                          <span>{staff.progress}%</span>
                        </div>
                        <div className="w-full bg-[#E7E4DF] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#2A5C8A] h-full rounded-full transition-all duration-500"
                            style={{ width: `${staff.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedStaffForReassign(staff);
                          setShowReassignModal(true);
                        }}
                      >
                        Reassign Task
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          showToast({
                            title: 'Staff Work History',
                            message: `${staff.staffName} has resolved 34 tickets this month with 4.8★ rating.`,
                            type: 'info',
                          });
                        }}
                      >
                        History
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 5B. PASS EXTENSIONS APPROVAL ==================== */}
          {activeRoute === '/warden/pass-extensions' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Pass Extensions')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
Digital Work Pass Extensions ({passes.filter((p) => p.extensionStatus === 'Pending').length} Pending)                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Approve or manage extra time requests submitted by maintenance technicians in the field
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {passes.map((pass) => (
                  <Card key={pass.id} className="p-5 space-y-4 border-[#E7E4DF]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DF] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-[#FAF8F2] text-[#996E7D] border border-[#E7E4DF]">
                          <Shield className="w-5 h-5" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A]">{pass.id}</h3>
                            <Badge variant={pass.status === 'EXPIRED' ? 'danger' : 'success'} size="sm">
                              {pass.status}
                            </Badge>
                          </div>
                          <p className="font-body text-xs text-[#666666]">
                            Ticket: <strong className="text-[#1A1A1A]">{pass.complaintTitle}</strong> ({pass.complaintId})
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-[#8E8E93] block">Location</span>
                        <strong className="text-[#996E7D] font-mono">{pass.room} ({pass.block})</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#FAF8F2] p-3 rounded-xl border border-[#E7E4DF]">
                      <div>
                        <span className="text-[#8E8E93] block">Technician:</span>
                        <strong className="text-[#1A1A1A]">{pass.employeeName} ({pass.role})</strong>
                      </div>
                      <div>
                        <span className="text-[#8E8E93] block">Original Expiry:</span>
                        <strong className="text-[#1A1A1A]">{pass.validUntil}</strong>
                      </div>
                      <div>
                        <span className="text-[#8E8E93] block">Extension Status:</span>
                        <Badge
  variant={
    pass.extensionStatus === 'Pending'
      ? 'warning'
      : pass.extensionStatus === 'Approved'
      ? 'success'
      : 'secondary'
  }
  size="sm"
>
  {pass.extensionStatus === 'Pending' ? 'Extension Requested (+30 mins)' : pass.extensionStatus}
</Badge>
                      </div>
                    </div>

                    {pass.extensionReason && (
                      <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#FFE082] text-xs text-[#856404]">
                        <strong>Technician Note:</strong> "{pass.extensionReason}"
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-1">
                      {pass.extensionStatus === 'Pending' ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              showToast({
                                title: 'Extension Declined',
                                message: `Extension request for pass ${pass.id} declined.`,
                                type: 'error',
                              });
                            }}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              approveExtension(pass.id);
                              showToast({
                                title: 'Extension Approved (+30 Mins)',
                                message: `Pass ${pass.id} extended by 30 minutes. Security & Technician notified.`,
                                type: 'success',
                              });
                            }}
                          >
                            Approve +30 Mins Extension ⚡
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-[#2E7D32] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Pass Validated & Active
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 6. ANNOUNCEMENTS & POLLS ==================== */}
          {activeRoute === '/warden/announcements' && (
            <div className="space-y-8 animate-fadeIn">
              {renderBreadcrumbs('Announcements')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Announcements & Resident Polls
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Broadcast hostel notices, update student feeds, or launch decision polls.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Vote className="w-4 h-4" />}
                    onClick={() => setShowPollModal(true)}
                  >
                    Create Poll
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowAnnouncementModal(true)}
                  >
                    New Announcement
                  </Button>
                </div>
              </div>

              {/* ANNOUNCEMENT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {announcements.map((ann) => (
                  <Card key={ann.id} className="p-5 space-y-3 hover:border-[#A73FD3] transition-all hover:shadow-md flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="primary" size="sm">{ann.audience}</Badge>
                        <span className="text-[10px] text-[#8E8E93] font-mono">{ann.date}</span>
                      </div>

                      <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                        {ann.title}
                      </h3>

                      <p className="font-body text-xs text-[#666666] leading-relaxed">
                        {ann.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E7E4DF] flex items-center justify-between">
                      <span className="text-[10px] text-[#8E8E93]">By: {ann.author}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            showToast({ title: 'Edit Mode', message: 'Editing announcement content...', type: 'info' });
                          }}
                          className="p-1.5 text-[#666666] hover:text-[#1A1A1A]"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAnnouncements(announcements.filter((a) => a.id !== ann.id));
                            showToast({ title: 'Notice Removed', message: 'Announcement deleted from feed.', type: 'error' });
                          }}
                          className="p-1.5 text-[#D9534F] hover:opacity-80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* ACTIVE POLL PREVIEW SECTION */}
              <Card className="p-6 space-y-4 border-[#F0AD4E]/40 bg-gradient-to-r from-white to-[#FEF9E7]/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vote className="w-5 h-5 text-[#B7791F]" />
                    <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                      Live Student Poll Results
                    </h3>
                  </div>

                  <Badge variant="warning" size="sm">
                    {pollData.totalVotes} Total Votes Recorded
                  </Badge>
                </div>

                <p className="font-body text-sm font-semibold text-[#1A1A1A]">
                  {pollData.question}
                </p>

                <div className="space-y-3 pt-2">
                  {pollData.options.map((opt) => {
                    const percentage = pollData.totalVotes > 0 ? Math.round((opt.votes / pollData.totalVotes) * 100) : 0;
                    return (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#1A1A1A]">{opt.text}</span>
                          <span className="font-bold text-[#B7791F]">{opt.votes} votes ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-[#E7E4DF] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#F0AD4E] h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 7. FULL ANALYTICS DASHBOARD ==================== */}
          {activeRoute === '/warden/analytics' && (
            <div className="space-y-8 animate-fadeIn">
              {renderBreadcrumbs('Analytics')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Hostel Operations Analytics
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Comprehensive real-time statistics on ticket velocity, resolution times, and staff performance.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => {
                    showToast({ title: 'Exporting PDF Report', message: 'Downloading Monthly Hostel Analytics Report...', type: 'success' });
                  }}
                >
                  Export PDF Report
                </Button>
              </div>

              {/* 6 KEY METRIC WIDGETS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="p-4 text-center">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Total Complaints</span>
                  <h3 className="font-heading text-2xl font-black text-[#1A1A1A] mt-1">182</h3>
                  <span className="text-[10px] text-[#2E7D32] font-semibold">This Month</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Resolved</span>
                  <h3 className="font-heading text-2xl font-black text-[#2E7D32] mt-1">168</h3>
                  <span className="text-[10px] text-[#2E7D32] font-semibold">92.3% Rate</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Pending</span>
                  <h3 className="font-heading text-2xl font-black text-[#D9534F] mt-1">14</h3>
                  <span className="text-[10px] text-[#D9534F] font-semibold">Active Queue</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Avg Res. Time</span>
                  <h3 className="font-heading text-2xl font-black text-[#2A5C8A] mt-1">2.4h</h3>
                  <span className="text-[10px] text-[#2E7D32] font-semibold">-18% vs last mo</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Visitors Count</span>
                  <h3 className="font-heading text-2xl font-black text-[#996E7D] mt-1">342</h3>
                  <span className="text-[10px] text-[#8E8E93]">This Month</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Occupancy</span>
                  <h3 className="font-heading text-2xl font-black text-[#A73FD3] mt-1">94%</h3>
                  <span className="text-[10px] text-[#8E8E93]">376 Beds</span>
                </Card>
              </div>

              {/* 4 RECHARTS CHARTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1: Category Breakdown Bar Chart */}
                <Card className="p-5 space-y-3">
                  <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                    Complaints Count by Category
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Chart 2: Monthly Trend Area Chart */}
                <Card className="p-5 space-y-3">
                  <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                    Monthly Logged vs. Resolved Trend
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="logged" stroke="#996E7D" fill="#F5EFF2" name="Logged" />
                        <Area type="monotone" dataKey="resolved" stroke="#2E7D32" fill="#E8F5E9" name="Resolved" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Chart 3: Resolution Time by Category */}
                <Card className="p-5 space-y-3">
                  <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                    Average Resolution Time (Hours)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resolutionTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
                        <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="avgHours" fill="#2A5C8A" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Chart 4: Maintenance Staff Performance */}
                <Card className="p-5 space-y-3">
                  <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                    Maintenance Staff Monthly Output
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={maintenancePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
                        <XAxis dataKey="staff" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="resolved" fill="#2E7D32" radius={[8, 8, 0, 0]} name="Tickets Resolved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== 8. EMERGENCY SOS DASHBOARD ==================== */}
          {activeRoute === '/warden/sos' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Emergency SOS')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A] flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-[#D9534F]" />
                    Emergency SOS Command Center
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Real-time student medical & security distress signals across Vaigai Hostel blocks.
                  </p>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Phone className="w-4 h-4" />}
                  onClick={() => {
                    showToast({
                      title: 'Calling Campus Security Desk',
                      message: 'Initiating direct emergency call to +91 99999 00000...',
                      type: 'error',
                    });
                  }}
                >
                  Call Campus Security
                </Button>
              </div>

              {/* SOS ACTIVE ALERTS */}
              <div className="space-y-4">
                <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">Active Emergency Signals</h3>

                {sosAlerts.map((sos) => (
                  <Card
                    key={sos.id}
                    className={`p-5 space-y-3 ${
                      sos.status === 'Active' ? 'bg-[#FDF2F2] border-[#D9534F]' : 'bg-white border-[#E7E4DF]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-[#D9534F] text-white">
                          <ShieldAlert className="w-6 h-6 animate-bounce" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-base font-black text-[#1A1A1A]">
                              {sos.studentName}
                            </h4>
                            <Badge variant={sos.status === 'Active' ? 'danger' : 'success'} size="sm">
                              {sos.priority} • {sos.status}
                            </Badge>
                          </div>
                          <p className="font-body text-xs text-[#666666] mt-0.5">
                            {sos.room} • Contact: <span className="font-mono font-bold text-[#1A1A1A]">{sos.contact}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-[#8E8E93]">{sos.time}</span>
                    </div>

                    <p className="font-body text-xs text-[#1A1A1A] font-semibold bg-white/80 p-3 rounded-xl border border-[#E7E4DF]">
                      Alert Details: {sos.reason}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      {sos.status === 'Active' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSosAlerts((prev) =>
                              prev.map((s) => (s.id === sos.id ? { ...s, status: 'Resolved' } : s))
                            );
                            showToast({ title: 'SOS Alert Resolved', message: 'Medical / Security personnel reached room.', type: 'success' });
                          }}
                        >
                          Mark Emergency Resolved
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          showToast({ title: 'Calling Resident Phone', message: `Dialing ${sos.contact}...`, type: 'info' });
                        }}
                      >
                        Call Student
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 9. WARDEN PROFILE ==================== */}
          {activeRoute === '/warden/profile' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Profile')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                    Warden Profile & Accreditation
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Official administrative record and credentials for Dr. Priya Raman.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Edit3 className="w-4 h-4" />}
                  onClick={() => setShowEditProfileModal(true)}
                >
                  Edit Profile
                </Button>
              </div>

              {/* PROFILE CARD */}
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E7E4DF]">
                  <div className="w-24 h-24 rounded-full bg-[#2A5C8A] text-white flex items-center justify-center font-black text-3xl shadow-xl border-4 border-white shrink-0">
                    WA
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <h2 className="font-heading text-2xl font-black text-[#1A1A1A]">
                      {profile.name}
                    </h2>
                    <p className="font-body text-sm font-bold text-[#2A5C8A]">
                      {profile.role} • {profile.hostel}
                    </p>
                    <p className="font-body text-xs text-[#666666]">
                      Employee ID: <span className="font-mono font-bold text-[#1A1A1A]">{profile.empId}</span>
                    </p>
                  </div>
                </div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-body">
                  <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] font-bold block">Department</span>
                    <strong className="text-[#1A1A1A] text-sm">{profile.department}</strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] font-bold block">Phone Contact</span>
                    <strong className="text-[#1A1A1A] text-sm">{profile.phone}</strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] font-bold block">Email Address</span>
                    <strong className="text-[#1A1A1A] text-sm">{profile.email}</strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                    <span className="text-[#8E8E93] font-bold block">Office Address</span>
                    <strong className="text-[#1A1A1A] text-sm">{profile.office}</strong>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 10. WARDEN SETTINGS ==================== */}
          {activeRoute === '/warden/settings' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Settings')}

              <div>
                <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                  System & Administrative Settings
                </h1>
                <p className="font-body text-xs text-[#666666]">
                  Configure security gate lock times, emergency dispatch notifications, and app preferences.
                </p>
              </div>

              {/* GROUPED SETTINGS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-heading text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#2A5C8A]" /> General Hostel Controls
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-[#1A1A1A] block mb-1">Night Gate Lock Time</label>
                      <select
                        value={settings.gateLockTime}
                        onChange={(e) => setSettings({ ...settings, gateLockTime: e.target.value })}
                        className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs bg-[#FAF8F2]"
                      >
                        <option value="10:00 PM">10:00 PM</option>
                        <option value="10:30 PM">10:30 PM (Default)</option>
                        <option value="11:00 PM">11:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[#1A1A1A] block mb-1">Default Data Retention</label>
                      <select
                        value={settings.dataRetentionMonths}
                        onChange={(e) => setSettings({ ...settings, dataRetentionMonths: e.target.value })}
                        className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs bg-[#FAF8F2]"
                      >
                        <option value="6 Months">6 Months</option>
                        <option value="12 Months">12 Months</option>
                        <option value="24 Months">24 Months</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Notifications Settings */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-heading text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#996E7D]" /> Notification Dispatch
                  </h3>

                  <div className="space-y-3 text-xs">
                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] cursor-pointer">
                      <span>SMS Alert for SOS Distress</span>
                      <input
                        type="checkbox"
                        checked={settings.smsSosAlerts}
                        onChange={(e) => setSettings({ ...settings, smsSosAlerts: e.target.checked })}
                        className="accent-[#996E7D] w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] cursor-pointer">
                      <span>Daily Email Summary Report</span>
                      <input
                        type="checkbox"
                        checked={settings.emailDailyReport}
                        onChange={(e) => setSettings({ ...settings, emailDailyReport: e.target.checked })}
                        className="accent-[#996E7D] w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] cursor-pointer">
                      <span>WhatsApp Tech Dispatch Alerts</span>
                      <input
                        type="checkbox"
                        checked={settings.whatsappDispatch}
                        onChange={(e) => setSettings({ ...settings, whatsappDispatch: e.target.checked })}
                        className="accent-[#996E7D] w-4 h-4"
                      />
                    </label>
                  </div>
                </Card>

                {/* Security & Access */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-heading text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#2E7D32]" /> Security & Access
                  </h3>

                  <div className="space-y-3 text-xs">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => showToast({ title: 'Password Reset', message: 'Password change email sent to warden inbox.', type: 'info' })}
                    >
                      Change Admin Password
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => showToast({ title: '2FA Enabled', message: 'Two-factor authentication is active.', type: 'success' })}
                    >
                      Two-Factor Authentication (2FA)
                    </Button>
                  </div>
                </Card>

                {/* System Info */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-heading text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#A73FD3]" /> About Vaigai OS
                  </h3>

                  <div className="space-y-2 text-xs text-[#666666]">
                    <div>System Version: <strong className="text-[#1A1A1A]">v2.4.0-WardenPortal</strong></div>
                    <div>Build Engine: <strong className="text-[#1A1A1A]">Project Vaigai React Engine</strong></div>
                    <div>Hostel Campus: <strong className="text-[#1A1A1A]">Vaigai Hostel Block A-C</strong></div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* CIRCLE MODERATION PORTAL */}
          {activeRoute === '/warden/circle' && (
            <WardenCircleModeration
              wardenName={userName}
              assignedHostel="Vaigai Hostel"
            />
          )}
        </main>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. VIEW DETAILS / COMPLAINT HISTORY MODAL */}
      {selectedComplaint && !showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp space-y-4">
            <div className="flex items-start justify-between border-b border-[#E7E4DF] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#8E8E93]">{selectedComplaint.id}</span>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">{selectedComplaint.title}</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#1A1A1A]">
              <div className="flex items-center justify-between">
                <span>Priority: <Badge variant={selectedComplaint.priority === 'High' ? 'danger' : 'warning'}>{selectedComplaint.priority}</Badge></span>
                <span>Status: <Badge variant={selectedComplaint.status === 'Resolved' ? 'success' : 'outline'}>{selectedComplaint.status}</Badge></span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1">
                <div>Resident: <strong>{selectedComplaint.residentName}</strong></div>
                <div>Room: <strong className="text-[#996E7D]">{selectedComplaint.room}</strong> ({selectedComplaint.block})</div>
                <div>Assigned Staff: <strong className="text-[#2A5C8A]">{selectedComplaint.assignedTo}</strong></div>
              </div>

              <div>
                <span className="font-bold block mb-1">Description:</span>
                <p className="text-[#555555] bg-[#FAF8F2] p-3 rounded-xl border border-[#E7E4DF]">{selectedComplaint.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DF]">
              <Button variant="text" onClick={() => setSelectedComplaint(null)}>
                Close
              </Button>
              {selectedComplaint.status !== 'Resolved' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleMarkResolved(selectedComplaint.id);
                    setSelectedComplaint(null);
                  }}
                >
                  Mark Ticket Resolved
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ASSIGN STAFF MODAL */}
      {showAssignModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Dispatch Technician</h3>
                <p className="font-body text-xs text-[#666666]">Assign technician to {selectedComplaint.id}</p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignConfirm} className="space-y-4">
              <div>
                <label className="font-bold text-xs text-[#1A1A1A] block mb-1">Select Technician</label>
                <select
                  value={assignTechId}
                  onChange={(e) => setAssignTechId(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs bg-white"
                >
                  <option value="S. Kumar (Plumber)">S. Kumar (Plumber)</option>
                  <option value="M. Selvam (Electrician)">M. Selvam (Electrician)</option>
                  <option value="R. Ramu (Carpenter)">R. Ramu (Carpenter)</option>
                  <option value="K. Vignesh (IT Tech)">K. Vignesh (IT Tech)</option>
                  <option value="G. Lakshmi (Cleaner)">G. Lakshmi (Cleaner)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DF]">
                <Button variant="text" type="button" onClick={() => setShowAssignModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Confirm Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. VIEW QR PASS MODAL */}
      {selectedVisitorForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp text-center space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-2">
              <h3 className="font-heading text-base font-bold text-[#1A1A1A]">Visitor Entry QR Pass</h3>
              <button
                onClick={() => setSelectedVisitorForQR(null)}
                className="p-1 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LARGE QR PLACEHOLDER */}
            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E7E4DF] inline-block mx-auto">
              <div className="w-48 h-48 bg-white border-2 border-[#1A1A1A] p-2 rounded-xl flex flex-col items-center justify-center relative">
                <QrCode className="w-36 h-36 text-[#1A1A1A]" />
                <span className="text-[10px] font-mono font-bold text-[#996E7D] mt-1">
                  {selectedVisitorForQR.passCode}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-[#1A1A1A]">
              <div className="font-bold text-base text-[#1A1A1A]">{selectedVisitorForQR.visitorName}</div>
              <div className="text-[#666666]">Visiting {selectedVisitorForQR.residentName} ({selectedVisitorForQR.room})</div>
              <div className="font-mono text-[#996E7D]">{selectedVisitorForQR.visitTime}</div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full opacity-60 cursor-not-allowed"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={() => {
                  showToast({ title: 'Download Pass', message: 'Pass SVG saved to downloads.', type: 'info' });
                }}
              >
                Download Pass
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">New Announcement Broadcast</h3>
              <button onClick={() => setShowAnnouncementModal(false)} className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <Input
                label="Notice Title"
                placeholder="e.g. Mess Menu Change / Hostel Inspection"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                required
              />

              <div>
                <label className="font-bold text-xs text-[#1A1A1A] block mb-1">Target Audience</label>
                <select
                  value={annAudience}
                  onChange={(e) => setAnnAudience(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs bg-white"
                >
                  <option value="All Block Residents">All Block Residents</option>
                  <option value="Block A Students">Block A Students</option>
                  <option value="Block B Students">Block B Students</option>
                  <option value="Block C Students">Block C Students</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-xs text-[#1A1A1A] block mb-1">Description / Content</label>
                <textarea
                  rows={4}
                  placeholder="Enter notice details..."
                  value={annDesc}
                  onChange={(e) => setAnnDesc(e.target.value)}
                  className="w-full p-3 rounded-[12px] border border-[#E7E4DF] text-xs font-body outline-none focus:border-[#996E7D]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DF]">
                <Button variant="text" type="button" onClick={() => setShowAnnouncementModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Publish Notice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. CREATE POLL MODAL */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Create Student Poll</h3>
              <button onClick={() => setShowPollModal(false)} className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4">
              <Input
                label="Poll Question"
                placeholder="e.g. Should study room hours be extended during exams?"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                required
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DF]">
                <Button variant="text" type="button" onClick={() => setShowPollModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Launch Poll
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Edit Warden Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowEditProfileModal(false);
                showToast({ title: 'Profile Updated', message: 'Saved warden administrative changes.', type: 'success' });
              }}
              className="space-y-3"
            >
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <Input
                label="Email Address"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <Input
                label="Office Location"
                value={profile.office}
                onChange={(e) => setProfile({ ...profile, office: e.target.value })}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DF]">
                <Button variant="text" type="button" onClick={() => setShowEditProfileModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. REASSIGN MAINTENANCE MODAL */}
      {showReassignModal && selectedStaffForReassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#E7E4DF] animate-slideUp space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Reassign Staff Duty</h3>
              <button onClick={() => setShowReassignModal(false)} className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStaffList((prev) =>
                  prev.map((s) =>
                    s.id === selectedStaffForReassign.id
                      ? { ...s, assignedComplaint: reassignTargetComplaint || s.assignedComplaint }
                      : s
                  )
                );
                setShowReassignModal(false);
                showToast({ title: 'Task Reassigned', message: `Updated active task for ${selectedStaffForReassign.staffName}.`, type: 'success' });
              }}
              className="space-y-4"
            >
              <div>
                <label className="font-bold text-xs text-[#1A1A1A] block mb-1">Staff Member</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedStaffForReassign.staffName} (${selectedStaffForReassign.profession})`}
                  className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs bg-[#FAF8F2] text-[#666666]"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-[#1A1A1A] block mb-1">New Task / Room Location</label>
                <input
                  type="text"
                  placeholder="e.g. Water Leakage in Room B-204"
                  value={reassignTargetComplaint}
                  onChange={(e) => setReassignTargetComplaint(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] border border-[#E7E4DF] text-xs bg-white text-[#1A1A1A]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DF]">
                <Button variant="text" type="button" onClick={() => setShowReassignModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Confirm Reassignment
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
        userRole="Warden"
      />
    </div>
  );
};

export default WardenDashboard;