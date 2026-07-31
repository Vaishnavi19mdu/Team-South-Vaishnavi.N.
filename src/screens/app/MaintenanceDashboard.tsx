import React, { useState } from 'react';
import {
  Home,
  ClipboardList,
  History,
  Package,
  Bell,
  User,
  Settings,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Play,
  Check,
  Upload,
  Star,
  Phone,
  Mail,
  Building,
  Shield,
  ChevronRight,
  Plus,
  Send,
  X,
  FileText,
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Camera,
  Edit3,
  Award,
  Zap,
  Hammer,
  HelpCircle,
  MessageSquare,
  Lock,
  Globe,
  RotateCcw,
  CheckSquare,
  QrCode
} from 'lucide-react';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { useWorkPass, WorkPass } from '../../context/WorkPassContext';
import WorkPassCard from '../../components/pass/WorkPassCard';
import ComplaintTimelineModal from '../../components/pass/ComplaintTimelineModal';
import SecurityScanResultScreen from '../../components/pass/SecurityScanResultScreen';
import VaigaiAiHelperModal from '../../components/ai/VaigaiAiHelperModal';

export interface MaintenanceDashboardProps {
  userName?: string;
  onLogout: () => void;
}

export interface TaskItem {
  id: string;
  title: string;
  residentName: string;
  room: string;
  block: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTime: string;
  estimatedDuration: string;
  status: 'Assigned' | 'Accepted' | 'In Progress' | 'Completed' | 'Delayed';
  progress: number;
  category: string;
  description: string;
  remarks?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  room: string;
  residentName: string;
  completedDate: string;
  completionTime: string;
  rating: number;
  feedback: string;
  materialsUsed: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  available: number;
  unit: string;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({
  userName = 'Manoj Kumar',
  onLogout,
}) => {
  const { showToast } = useToast();

  // Navigation State
  const [activeRoute, setActiveRoute] = useState<string>('/maintenance/dashboard');
  const [showAiModal, setShowAiModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // -------------------------------------------------------------
  // MOCK DATA STATES
  // -------------------------------------------------------------

  // Tasks List
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'VAI-1082',
      title: 'Water Leakage in Washroom Pipe',
      residentName: 'Vaishnavi S',
      room: 'Room B-204',
      block: 'Block B',
      priority: 'High',
      assignedTime: 'Today, 09:15 AM',
      estimatedDuration: '45 mins',
      status: 'In Progress',
      progress: 50,
      category: 'Plumbing',
      description: 'Main flush valve joint leaking continuously on bathroom tiles.',
      remarks: 'Inspected joint gasket, replacing washer seal now.',
    },
    {
      id: 'VAI-1079',
      title: 'Broken Ceiling Fan Regulator',
      residentName: 'Siddharth M',
      room: 'Room B-203',
      block: 'Block B',
      priority: 'High',
      assignedTime: 'Today, 08:30 AM',
      estimatedDuration: '30 mins',
      status: 'Assigned',
      progress: 0,
      category: 'Electrical',
      description: 'Ceiling fan stuck on maximum speed 5, regulator knob loose.',
    },
    {
      id: 'VAI-1074',
      title: 'Switch Board Sparking Fault',
      residentName: 'Arjun Das',
      room: 'Room C-301',
      block: 'Block C',
      priority: 'Critical',
      assignedTime: 'Today, 07:45 AM',
      estimatedDuration: '60 mins',
      status: 'Accepted',
      progress: 25,
      category: 'Electrical',
      description: 'Main wall outlet socket sparking when plugging laptop charger.',
    },
    {
      id: 'VAI-1068',
      title: 'Water Leakage under Sink',
      residentName: 'Kavitha P',
      room: 'Room A-108',
      block: 'Block A',
      priority: 'Medium',
      assignedTime: 'Yesterday, 04:20 PM',
      estimatedDuration: '40 mins',
      status: 'Assigned',
      progress: 0,
      category: 'Plumbing',
      description: 'Drip from sink drainage pipe trap assembly.',
    },
    {
      id: 'VAI-1055',
      title: 'Ceiling Tube Light Flickering',
      residentName: 'Rahul Rao',
      room: 'Room A-112',
      block: 'Block A',
      priority: 'Low',
      assignedTime: 'Yesterday, 02:00 PM',
      estimatedDuration: '20 mins',
      status: 'Assigned',
      progress: 0,
      category: 'Electrical',
      description: 'LED tubelight starter unit buzzes repeatedly.',
    },
  ]);

  // Completed History Data
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'VAI-1048',
      title: 'Room Main Door Handle Latch Repair',
      room: 'Room C-210',
      residentName: 'Priya K',
      completedDate: '2 Days Ago',
      completionTime: '35 mins',
      rating: 5.0,
      feedback: 'Very quick service! Door locks properly now. Thank you Manoj sir!',
      materialsUsed: '1x Cylinder Latch Lock Pin',
    },
    {
      id: 'VAI-1035',
      title: 'Geyser Heating Element Wire Terminal Replacement',
      room: 'Room B-105',
      residentName: 'Karthik V',
      completedDate: '3 Days Ago',
      completionTime: '50 mins',
      rating: 4.8,
      feedback: 'Punctual and neat work. Hot water working properly.',
      materialsUsed: '2m Heat Resistant Wire, Ceramic Terminal',
    },
    {
      id: 'VAI-1022',
      title: 'Study Table Light Socket Replacement',
      room: 'Room A-302',
      residentName: 'Meera R',
      completedDate: '4 Days Ago',
      completionTime: '25 mins',
      rating: 5.0,
      feedback: 'Fixed within half an hour of logging complaint. Excellent!',
      materialsUsed: '1x 6A Modular Switch',
    },
    {
      id: 'VAI-1009',
      title: 'Floor Corridor Junction Box Insulation',
      room: 'Block B Floor 2',
      residentName: 'Warden Office',
      completedDate: '5 Days Ago',
      completionTime: '45 mins',
      rating: 5.0,
      feedback: 'Inspected and certified safe for floor residents.',
      materialsUsed: 'Insulation Tape Roll, Junction Cap',
    },
  ]);

  // Inventory Stock Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'INV-01', name: 'LED Light Bulbs (12W)', available: 34, unit: 'pcs', category: 'Electrical', status: 'In Stock' },
    { id: 'INV-02', name: 'PVC Pipes (1/2 inch)', available: 12, unit: 'm', category: 'Plumbing', status: 'In Stock' },
    { id: 'INV-03', name: 'Copper Electrical Wires', available: 18, unit: 'rolls', category: 'Electrical', status: 'In Stock' },
    { id: 'INV-04', name: 'Modular Switch Boards (6A)', available: 9, unit: 'pcs', category: 'Electrical', status: 'Low Stock' },
    { id: 'INV-05', name: 'LED Tube Light Starters', available: 22, unit: 'pcs', category: 'Electrical', status: 'In Stock' },
    { id: 'INV-06', name: 'Water Pipe Rubber Washers', available: 45, unit: 'pcs', category: 'Plumbing', status: 'In Stock' },
    { id: 'INV-07', name: 'High-Grade Electrical Tape', available: 8, unit: 'rolls', category: 'Consumable', status: 'Low Stock' },
    { id: 'INV-08', name: 'Miniature Circuit Breaker (16A)', available: 3, unit: 'pcs', category: 'Electrical', status: 'Low Stock' },
  ]);

  // Notifications Data
  const [notifications, setNotifications] = useState([
    {
      id: 'NOT-1',
      type: 'Task Assigned',
      title: 'New High Priority Task Assigned',
      message: 'Warden Dr. Priya Raman assigned ticket VAI-1082 (Water Leakage in Room B-204).',
      time: '20 mins ago',
      unread: true,
    },
    {
      id: 'NOT-2',
      type: 'Task Updated',
      title: 'Task Priority Escalated',
      message: 'Ticket VAI-1074 (Switch Board Sparking) escalated to Critical by Warden.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 'NOT-3',
      type: 'Task Completed',
      title: '5-Star Rating Received ⭐',
      message: 'Resident Priya K rated 5.0 stars for Room C-210 Door Latch repair.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 'NOT-4',
      type: 'Announcement',
      title: 'Annual Tools & Inventory Inspection',
      message: 'Please submit material usage report to Maintenance Dept by Friday evening.',
      time: '3 days ago',
      unread: false,
    },
  ]);

  // Profile Info
  const [profile, setProfile] = useState({
    name: 'Manoj Kumar',
    role: 'Electrician & Technical Specialist',
    empId: 'EMP-104',
    department: 'Hostel Maintenance Staff',
    phone: '+91 98760 22334',
    email: 'manoj.kumar@vaigai.edu.in',
    experience: '6+ Years Facilities Electrical & Maintenance',
    skills: 'Circuit Wiring, DB Breakers, Conduit Piping, Pump Diagnostics, Safety Earthings',
  });

  // -------------------------------------------------------------
  // MODAL & INTERACTION STATES
  // -------------------------------------------------------------

  // Update Task Modal
  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState<TaskItem | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProgressVal, setUpdateProgressVal] = useState<number>(50);
  const [updateRemarks, setUpdateRemarks] = useState('');

  // Complete Task Modal
  const [selectedTaskForComplete, setSelectedTaskForComplete] = useState<TaskItem | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [materialsUsedInput, setMaterialsUsedInput] = useState('');
  const [completionTimeInput, setCompletionTimeInput] = useState('35 minutes');

  // Inventory Request Modal
  const [showMaterialRequestModal, setShowMaterialRequestModal] = useState(false);
  const [requestItemName, setRequestItemName] = useState('Modular Switch Boards (6A)');
  const [requestQuantity, setRequestQuantity] = useState('5');
  const [requestUrgency, setRequestUrgency] = useState('Immediate');

  // Contact Warden Modal
  const [showContactWardenModal, setShowContactWardenModal] = useState(false);
  const [wardenMessage, setWardenMessage] = useState('');

  // Edit Profile Modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    smsAlerts: true,
    pushNotifications: true,
    autoAcceptTasks: false,
    darkTheme: false,
    language: 'English',
  });

  // Filter & Search states
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('All');

  // Work Pass Context Hook
  const { passes, generatePassForTask, markTaskProgressInPass } = useWorkPass();

  // Work Pass Modals State
  const [generatedPassModal, setGeneratedPassModal] = useState<WorkPass | null>(null);
  const [selectedPassForTimeline, setSelectedPassForTimeline] = useState<WorkPass | null>(null);
  const [selectedPassForSecurityScan, setSelectedPassForSecurityScan] = useState<WorkPass | null>(null);

  // -------------------------------------------------------------
  // TASK HANDLERS
  // -------------------------------------------------------------

  const handleAcceptTask = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Accepted', progress: 25 } : t))
    );

    if (targetTask) {
      const newPass = generatePassForTask(targetTask);
      setGeneratedPassModal(newPass);
    }

    showToast({
      title: 'Task Accepted & Work Pass Generated 🎟️',
      message: `Task ${id} accepted. Maintenance Work Pass generated automatically for Security Gate clearance.`,
      type: 'success',
    });
  };

  const handleStartWork = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'In Progress', progress: 50 } : t))
    );
    const pass = passes.find((p) => p.complaintId === id);
    if (pass) {
      markTaskProgressInPass(pass.id, 'started');
    }
    showToast({
      title: 'Work Started 🛠️',
      message: `Status updated to In Progress for ${id}. Timeline updated.`,
      type: 'info',
    });
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForUpdate) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskForUpdate.id
          ? {
              ...t,
              progress: updateProgressVal,
              remarks: updateRemarks || t.remarks,
              status: updateProgressVal === 100 ? 'Completed' : 'In Progress',
            }
          : t
      )
    );

    setShowUpdateModal(false);
    showToast({
      title: 'Progress Updated',
      message: `Task ${selectedTaskForUpdate.id} updated to ${updateProgressVal}%.`,
      type: 'success',
    });
  };

  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForComplete) return;

    // Remove from active tasks
    setTasks((prev) => prev.filter((t) => t.id !== selectedTaskForComplete.id));

    // Add to history
    const newHistory: HistoryItem = {
      id: selectedTaskForComplete.id,
      title: selectedTaskForComplete.title,
      room: selectedTaskForComplete.room,
      residentName: selectedTaskForComplete.residentName,
      completedDate: 'Just now',
      completionTime: completionTimeInput || '30 mins',
      rating: 5.0,
      feedback: completionNotes || 'Work completed neatly and verified.',
      materialsUsed: materialsUsedInput || 'Standard Maintenance Supplies',
    };

    setHistory([newHistory, ...history]);
    setShowCompleteModal(false);

    showToast({
      title: 'Task Marked Completed 🎉',
      message: `Ticket ${selectedTaskForComplete.id} resolved and archived. Warden notified!`,
      type: 'success',
    });
  };

  const handleSendMaterialRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMaterialRequestModal(false);
    showToast({
      title: 'Stock Request Sent',
      message: `Requisition for ${requestQuantity} x ${requestItemName} sent to Warden Office.`,
      type: 'success',
    });
  };

  const handleSendWardenMsg = (e: React.FormEvent) => {
    e.preventDefault();
    setShowContactWardenModal(false);
    setWardenMessage('');
    showToast({
      title: 'Message Dispatched',
      message: 'Direct note sent to Dr. Priya Raman (Warden).',
      type: 'success',
    });
  };

  // Filtered tasks calculation
  const filteredTasks = tasks.filter((t) => {
    let matchStatus = true;
    if (taskStatusFilter === 'High Priority') {
      matchStatus = t.priority === 'High' || t.priority === 'Critical';
    } else if (taskStatusFilter === 'Pending') {
      matchStatus = t.status === 'Assigned' || t.status === 'Accepted';
    } else if (taskStatusFilter === 'In Progress') {
      matchStatus = t.status === 'In Progress';
    } else if (taskStatusFilter !== 'All') {
      matchStatus = t.status === taskStatusFilter;
    }

    const matchSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.room.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.residentName.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(taskSearch.toLowerCase()));

    return matchStatus && matchSearch;
  });

  // Breadcrumbs Helper
  const renderBreadcrumbs = (currentPage: string) => (
    <div className="flex items-center gap-2 text-xs font-body text-[#8E8E93] mb-4">
      <span
        onClick={() => setActiveRoute('/maintenance/dashboard')}
        className="hover:text-[#996E7D] cursor-pointer transition-colors"
      >
        Maintenance Portal
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-[#CCCCCC]" />
      <span className="font-bold text-[#1A1A1A] capitalize">{currentPage}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex">
      {/* Sidebar with Maintenance Configuration */}
      <Sidebar
        role="maintenance"
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
          currentPageTitle={
            activeRoute === '/maintenance/dashboard'
              ? 'Maintenance Dashboard'
              : activeRoute.replace('/maintenance/', '').replace('-', ' ').toUpperCase()
          }
          role="maintenance"
          userRole="Electrician"
          userName={profile.name}
          avatarInitials="MK"
          avatarColor="#996E7D"
          hostelBlock="Maintenance Department"
          roomNumber="All Blocks Access"
          unreadCount={notifications.filter((n) => n.unread).length}
          showBackButton={activeRoute !== '/maintenance/dashboard'}
          onBack={() => setActiveRoute('/maintenance/dashboard')}
          onOpenAiHelper={() => setShowAiModal(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigate={(r) => setActiveRoute(r)}
          onLogout={onLogout}
          profileEmployeeId={profile.empId}
          profileEmail={profile.email}
          profileAccessLevel={profile.role}
          profileOfficeLocation="Main Maintenance Office, Block B"
          profilePrimaryCampus="Vaigai Hostel Campus"
          profileStats={[
            { label: 'Active Tasks', value: String(tasks.length), color: '#996E7D' },
            { label: 'Completed Jobs', value: String(history.length), color: '#059669' },
            {
              label: 'Avg. Rating',
              value: history.length
                ? (history.reduce((sum, h) => sum + h.rating, 0) / history.length).toFixed(1) + ' ★'
                : 'N/A',
              color: '#D97706',
            },
            {
              label: 'Low Stock Items',
              value: String(inventory.filter((i) => i.status !== 'In Stock').length),
              color: '#D9534F',
            },
          ]}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ==================== 1. MAINTENANCE DASHBOARD ==================== */}
          {activeRoute === '/maintenance/dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {renderBreadcrumbs('Dashboard')}

              {/* WELCOME HERO BANNER */}
              <div className="bg-gradient-to-r from-[#1A1A1A] via-[#996E7D] to-[#1A1A1A] rounded-[24px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-3xl transform skew-x-12 pointer-events-none hidden md:block" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-md">
                        Good Morning 👋
                      </span>
                      <span className="text-xs text-white/70 font-mono">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {profile.name}
                    </h1>
                    <p className="font-body text-xs sm:text-sm text-white/80 mt-1">
                      {profile.role} • Employee ID: <strong className="text-white">{profile.empId}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-[16px] backdrop-blur-md border border-white/15 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#996E7D] flex items-center justify-center font-black text-sm shadow-inner">
                      4.9★
                    </div>
                    <div>
                      <span className="text-xs text-white/70 block">Performance Rating</span>
                      <span className="text-xs font-bold text-white">48 Jobs Completed This Month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TODAY'S SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Assigned Today */}
                <Card className="p-4 hover:border-[#996E7D] transition-all hover:shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#F5EFF2] text-[#996E7D] group-hover:scale-110 transition-transform">
                      <ClipboardList className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5EFF2] text-[#996E7D]">
                      Today
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">5</h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Assigned Today</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">2 high priority</p>
                </Card>

                {/* Tasks Completed */}
                <Card className="p-4 hover:border-[#5CB85C] transition-all hover:shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32] group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                      Done
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">3</h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Tasks Completed</p>
                  <p className="font-body text-[11px] text-[#2E7D32] font-semibold mt-1">Avg 28 mins / job</p>
                </Card>

                {/* Pending Tasks */}
                <Card className="p-4 hover:border-[#F0AD4E] transition-all hover:shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#FEF9E7] text-[#B7791F] group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF9E7] text-[#B7791F]">
                      Active
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">{tasks.length}</h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Pending Tasks</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">1 currently in progress</p>
                </Card>

                {/* Average Rating */}
                <Card className="p-4 hover:border-[#2A5C8A] transition-all hover:shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-[#EBF3FA] text-[#2A5C8A] group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5 fill-[#2A5C8A]" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3FA] text-[#2A5C8A]">
                      Feedback
                    </span>
                  </div>
                  <h4 className="font-heading text-2xl font-black text-[#1A1A1A]">4.9 ★</h4>
                  <p className="font-body text-xs font-bold text-[#1A1A1A] mt-0.5">Average Rating</p>
                  <p className="font-body text-[11px] text-[#666666] mt-1">Based on 64 reviews</p>
                </Card>
              </div>

              {/* QUICK ACTIONS BAR */}
              <div className="bg-white p-5 rounded-[20px] border border-[#E7E4DF] shadow-xs">
                <h3 className="font-heading text-xs font-extrabold text-[#8E8E93] uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <button
                    onClick={() => setActiveRoute('/maintenance/tasks')}
                    className="p-3.5 rounded-[14px] bg-[#FAF8F2] hover:bg-[#F5EFF2] hover:border-[#996E7D] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <ClipboardList className="w-5 h-5 text-[#996E7D] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">View Assigned Tasks</span>
                  </button>

                  <button
                    onClick={() => {
                      if (tasks.length > 0) {
                        setSelectedTaskForUpdate(tasks[0]);
                        setUpdateProgressVal(tasks[0].progress);
                        setShowUpdateModal(true);
                      } else {
                        showToast({ title: 'No Tasks', message: 'No active tasks to update.', type: 'info' });
                      }
                    }}
                    className="p-3.5 rounded-[14px] bg-[#FAF8F2] hover:bg-[#EBF3FA] hover:border-[#2A5C8A] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <Wrench className="w-5 h-5 text-[#2A5C8A] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Update Progress</span>
                  </button>

                  <button
                    onClick={() => setActiveRoute('/maintenance/inventory')}
                    className="p-3.5 rounded-[14px] bg-[#FAF8F2] hover:bg-[#E8F5E9] hover:border-[#2E7D32] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <Package className="w-5 h-5 text-[#2E7D32] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">View Inventory</span>
                  </button>

                  <button
                    onClick={() => setShowContactWardenModal(true)}
                    className="p-3.5 rounded-[14px] bg-[#FAF8F2] hover:bg-[#FEF9E7] hover:border-[#B7791F] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <Phone className="w-5 h-5 text-[#B7791F] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Contact Warden</span>
                  </button>

                  <button
                    onClick={() => setShowMaterialRequestModal(true)}
                    className="p-3.5 rounded-[14px] bg-[#FAF8F2] hover:bg-[#F7EDFC] hover:border-[#A73FD3] border border-[#E7E4DF] text-[#1A1A1A] transition-all flex flex-col items-center text-center gap-2 group"
                  >
                    <Plus className="w-5 h-5 text-[#A73FD3] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Request Materials</span>
                  </button>
                </div>
              </div>

              {/* RECENT ACTIVE TASKS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-extrabold text-[#1A1A1A] tracking-tight">
                      Active Task Queue ({tasks.length})
                    </h2>
                    <p className="font-body text-xs text-[#666666]">
                      Tasks requiring immediate inspection or work
                    </p>
                  </div>

                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => setActiveRoute('/maintenance/tasks')}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    All Tasks
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.map((task) => (
                    <Card key={task.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-[#996E7D] transition-all hover:shadow-md">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[#996E7D]">
                            {task.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={
                                task.priority === 'Critical' || task.priority === 'High'
                                  ? 'danger'
                                  : task.priority === 'Medium'
                                  ? 'warning'
                                  : 'primary'
                              }
                              size="sm"
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              variant={
                                task.status === 'In Progress'
                                  ? 'warning'
                                  : task.status === 'Accepted'
                                  ? 'primary'
                                  : 'secondary'
                              }
                              size="sm"
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </div>

                        <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                          {task.title}
                        </h3>

                        <p className="font-body text-xs text-[#555555]">
                          Resident: <strong className="text-[#1A1A1A]">{task.residentName}</strong> ({task.room})
                        </p>

                        <div className="p-2.5 rounded-xl bg-[#FAF8F2] text-xs text-[#666666] border border-[#E7E4DF] space-y-1">
                          <div><strong className="text-[#1A1A1A]">Est. Time:</strong> {task.estimatedDuration}</div>
                          <div><strong className="text-[#1A1A1A]">Assigned:</strong> {task.assignedTime}</div>
                          <div className="text-[11px] text-[#8E8E93] italic line-clamp-2 mt-1">
                            "{task.description}"
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] font-bold text-[#1A1A1A]">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-[#E7E4DF] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#996E7D] h-full rounded-full transition-all duration-500"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="pt-2 border-t border-[#E7E4DF] flex items-center gap-2">
                        {task.status === 'Assigned' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => handleAcceptTask(task.id)}
                          >
                            Accept Task
                          </Button>
                        )}

                        {task.status === 'Accepted' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => handleStartWork(task.id)}
                          >
                            Start Work
                          </Button>
                        )}

                        {task.status === 'In Progress' && (
                          <div className="flex items-center gap-2 w-full">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedTaskForUpdate(task);
                                setUpdateProgressVal(task.progress);
                                setShowUpdateModal(true);
                              }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedTaskForComplete(task);
                                setShowCompleteModal(true);
                              }}
                            >
                              Complete
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 1B. DIGITAL WORK PASSES ==================== */}
          {activeRoute === '/maintenance/passes' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Digital Work Passes')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A] tracking-tight">
                    Active Digital Work Passes ({passes.length})
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Security clearance QR passes generated automatically upon task acceptance
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (passes.length > 0) {
                        setSelectedPassForSecurityScan(passes[0]);
                      }
                    }}
                    leftIcon={<QrCode className="w-4 h-4 text-[#996E7D]" />}
                  >
                    Simulate Gate Security Scan
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {passes.map((pass) => (
                  <WorkPassCard
                    key={pass.id}
                    pass={pass}
                    onOpenSecurityScan={() => setSelectedPassForSecurityScan(pass)}
                    onOpenTimeline={() => setSelectedPassForTimeline(pass)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ==================== 2. ASSIGNED TASKS ==================== */}
          {activeRoute === '/maintenance/tasks' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Assigned Tasks')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A] tracking-tight">
                    Maintenance Task Assignments
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    View, accept, update, and resolve allocated repair tickets
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search by room, ID, resident..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    leftIcon={<Search className="w-4 h-4 text-[#8E8E93]" />}
                    className="w-64"
                  />
                </div>
              </div>

              {/* STATUS FILTER CHIPS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['All', 'High Priority', 'Pending', 'In Progress'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTaskStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                      taskStatusFilter === st
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'bg-white text-[#666666] hover:bg-[#FAF8F2] border border-[#E7E4DF]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* TASKS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-[20px] border border-[#E7E4DF]">
                    <CheckCircle2 className="w-12 h-12 text-[#5CB85C] mx-auto mb-3" />
                    <h3 className="font-heading text-base font-bold text-[#1A1A1A]">No Tasks Found</h3>
                    <p className="font-body text-xs text-[#8E8E93]">All assigned tasks in this view have been attended to.</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <Card key={task.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-[#996E7D] transition-all hover:shadow-md">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[#996E7D]">
                            {task.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={
                                task.priority === 'Critical' || task.priority === 'High'
                                  ? 'danger'
                                  : task.priority === 'Medium'
                                  ? 'warning'
                                  : 'primary'
                              }
                              size="sm"
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              variant={
                                task.status === 'In Progress'
                                  ? 'warning'
                                  : task.status === 'Accepted'
                                  ? 'primary'
                                  : 'secondary'
                              }
                              size="sm"
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                            {task.title}
                          </h3>
                          <p className="font-body text-xs text-[#555555] mt-0.5">
                            Resident: <strong className="text-[#1A1A1A]">{task.residentName}</strong> ({task.room})
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#FAF8F2] text-xs text-[#666666] border border-[#E7E4DF] space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-[#8E8E93]">Est. Duration:</span>
                            <span className="font-bold text-[#1A1A1A]">{task.estimatedDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8E8E93]">Assigned Time:</span>
                            <span className="font-bold text-[#1A1A1A]">{task.assignedTime}</span>
                          </div>
                          <p className="text-[11px] text-[#555555] pt-1 border-t border-[#E7E4DF]">
                            {task.description}
                          </p>
                          {task.remarks && (
                            <p className="text-[11px] text-[#996E7D] font-semibold pt-0.5">
                              Note: {task.remarks}
                            </p>
                          )}
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-[#1A1A1A]">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-[#E7E4DF] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#996E7D] h-full rounded-full transition-all duration-500"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* TASK ACTION BUTTONS */}
                      <div className="pt-3 border-t border-[#E7E4DF] flex items-center gap-2">
                        {task.status === 'Assigned' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => handleAcceptTask(task.id)}
                          >
                            Accept Task
                          </Button>
                        )}

                        {task.status === 'Accepted' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => handleStartWork(task.id)}
                          >
                            Start Work
                          </Button>
                        )}

                        {task.status === 'In Progress' && (
                          <div className="flex items-center gap-2 w-full">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedTaskForUpdate(task);
                                setUpdateProgressVal(task.progress);
                                setShowUpdateModal(true);
                              }}
                            >
                              Update Progress
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedTaskForComplete(task);
                                setShowCompleteModal(true);
                              }}
                            >
                              Complete Task
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== 3. TASK HISTORY ==================== */}
          {activeRoute === '/maintenance/history' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Task History')}

              <div>
                <h1 className="font-heading text-2xl font-black text-[#1A1A1A] tracking-tight">
                  Completed Task Log
                </h1>
                <p className="font-body text-xs text-[#666666]">
                  Archive of resolved maintenance tickets, completion times, and resident star ratings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                  <Card key={item.id} className="p-5 space-y-4 hover:border-[#996E7D] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#996E7D] block">
                          {item.id} • {item.completedDate}
                        </span>
                        <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                          {item.title}
                        </h3>
                        <p className="font-body text-xs text-[#666666]">
                          {item.room} — <strong className="text-[#1A1A1A]">{item.residentName}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-[#FEF9E7] border border-[#F0AD4E]/30 px-2.5 py-1 rounded-full text-xs font-bold text-[#B7791F]">
                        <Star className="w-3.5 h-3.5 fill-[#B7791F]" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-1 text-xs text-[#555555]">
                      <div><strong className="text-[#1A1A1A]">Time Spent:</strong> {item.completionTime}</div>
                      <div><strong className="text-[#1A1A1A]">Materials Used:</strong> {item.materialsUsed}</div>
                      <p className="italic text-[#1A1A1A] pt-1 border-t border-[#E7E4DF]">
                        "{item.feedback}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#2E7D32] font-bold pt-1">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Verified Completed
                      </span>
                      <span className="text-[11px] text-[#8E8E93]">Signed by Resident</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. INVENTORY ==================== */}
          {activeRoute === '/maintenance/inventory' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Inventory')}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A] tracking-tight">
                    Maintenance Stock & Supplies
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Track spare parts, electrical components, and request re-stocking
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowMaterialRequestModal(true)}
                >
                  Request Stock
                </Button>
              </div>

              {/* INVENTORY CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {inventory.map((item) => {
                  const isLowStock = item.available < 5 || item.status === 'Low Stock';
                  return (
                    <Card
                      key={item.id}
                      className={`p-4 space-y-3 transition-colors relative ${
                        isLowStock
                          ? 'border-[#D9534F] bg-[#FFF8F8] shadow-xs'
                          : 'hover:border-[#996E7D]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="p-2 rounded-xl bg-[#FAF8F2] text-[#996E7D] border border-[#E7E4DF]">
                          <Package className="w-5 h-5" />
                        </span>
                        {isLowStock ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEBEE] text-[#C62828] border border-[#C62828]/30 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Restock Urgent (&lt;5)
                          </span>
                        ) : (
                          <Badge variant="success" size="sm">
                            {item.status}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                          {item.name}
                        </h4>
                        <p className="font-body text-[11px] text-[#8E8E93]">Category: {item.category}</p>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isLowStock ? 'bg-white border-[#D9534F]/30' : 'bg-[#FAF8F2] border-[#E7E4DF]'
                      }`}>
                        <span className="text-xs text-[#666666]">Available:</span>
                        <span className={`font-heading text-lg font-black ${isLowStock ? 'text-[#C62828]' : 'text-[#1A1A1A]'}`}>
                          {item.available} <span className="text-xs font-normal text-[#8E8E93]">{item.unit}</span>
                        </span>
                      </div>

                      <Button
                        variant={isLowStock ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          setRequestItemName(item.name);
                          setShowMaterialRequestModal(true);
                        }}
                      >
                        {isLowStock ? 'Re-order Stock Now ⚡' : 'Re-order Stock'}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== 5. NOTIFICATIONS ==================== */}
          {activeRoute === '/maintenance/notifications' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Notifications')}

              <div>
                <h1 className="font-heading text-2xl font-black text-[#1A1A1A] tracking-tight">
                  Notification Center
                </h1>
                <p className="font-body text-xs text-[#666666]">
                  Recent dispatch alerts, warden messages, and rating notifications
                </p>
              </div>

              <div className="space-y-3 max-w-3xl">
                {notifications.map((item) => (
                  <Card
                    key={item.id}
                    className={`p-4 flex items-start gap-3 transition-colors ${
                      item.unread ? 'bg-white border-[#996E7D]' : 'bg-[#FAF8F2]/60 border-[#E7E4DF]'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[#F5EFF2] text-[#996E7D] shrink-0 mt-0.5">
                      <Bell className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-[#8E8E93] font-mono">{item.time}</span>
                      </div>
                      <p className="font-body text-xs text-[#555555]">{item.message}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 6. PROFILE ==================== */}
          {activeRoute === '/maintenance/profile' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Profile')}

              <Card className="p-6 sm:p-8 border border-[#E7E4DF] space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#E7E4DF]">
                  <div className="w-20 h-20 rounded-2xl bg-[#996E7D] text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                    MK
                  </div>

                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">
                        {profile.name}
                      </h1>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Edit3 className="w-4 h-4" />}
                        onClick={() => setShowEditProfileModal(true)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                    <p className="font-body text-sm font-semibold text-[#996E7D]">
                      {profile.role}
                    </p>
                    <p className="font-body text-xs text-[#666666]">
                      {profile.department} • ID: <strong className="text-[#1A1A1A]">{profile.empId}</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3">
                    <h3 className="font-heading text-sm font-bold text-[#1A1A1A] uppercase tracking-wider text-[#8E8E93]">
                      Contact Information
                    </h3>
                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#8E8E93]">Phone:</span>
                        <span className="font-bold text-[#1A1A1A]">{profile.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E8E93]">Email:</span>
                        <span className="font-bold text-[#1A1A1A]">{profile.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E8E93]">Work Location:</span>
                        <span className="font-bold text-[#1A1A1A]">Main Maintenance Office, Block B</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-heading text-sm font-bold text-[#1A1A1A] uppercase tracking-wider text-[#8E8E93]">
                      Skills & Experience
                    </h3>
                    <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-2">
                      <div>
                        <span className="text-[#8E8E93] block">Experience:</span>
                        <span className="font-bold text-[#1A1A1A]">{profile.experience}</span>
                      </div>
                      <div>
                        <span className="text-[#8E8E93] block">Technical Competencies:</span>
                        <span className="font-bold text-[#1A1A1A]">{profile.skills}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 7. SETTINGS ==================== */}
          {activeRoute === '/maintenance/settings' && (
            <div className="space-y-6 animate-fadeIn">
              {renderBreadcrumbs('Settings')}

              <div className="max-w-3xl space-y-4">
                <div>
                  <h1 className="font-heading text-2xl font-black text-[#1A1A1A] tracking-tight">
                    Preferences & Settings
                  </h1>
                  <p className="font-body text-xs text-[#666666]">
                    Configure notification dispatches, language, and security
                  </p>
                </div>

                <Card className="p-5 space-y-4">
                  <h3 className="font-heading text-sm font-bold text-[#1A1A1A] border-b border-[#E7E4DF] pb-2">
                    Notification Preferences
                  </h3>
                  <div className="space-y-3 text-xs">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-bold text-[#1A1A1A] block">SMS Alert Dispatches</span>
                        <span className="text-[#8E8E93]">Receive immediate SMS when Critical tickets are logged</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.smsAlerts}
                        onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                        className="w-4 h-4 accent-[#996E7D]"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#E7E4DF]">
                      <div>
                        <span className="font-bold text-[#1A1A1A] block">App Push Notifications</span>
                        <span className="text-[#8E8E93]">In-app sound and banner for new task assignments</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                        className="w-4 h-4 accent-[#996E7D]"
                      />
                    </label>
                  </div>
                </Card>

                <Card className="p-5 space-y-4">
                  <h3 className="font-heading text-sm font-bold text-[#1A1A1A] border-b border-[#E7E4DF] pb-2">
                    System & Display
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A]">Portal Language</span>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="p-1.5 rounded-lg border border-[#E7E4DF] bg-white text-xs font-semibold"
                      >
                        <option>English</option>
                        <option>Tamil (தமிழ்)</option>
                        <option>Hindi (हिंदी)</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== UPDATE TASK MODAL ==================== */}
      {showUpdateModal && selectedTaskForUpdate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
                  Update Progress ({selectedTaskForUpdate.id})
                </h3>
                <p className="font-body text-xs text-[#666666]">
                  {selectedTaskForUpdate.title} • {selectedTaskForUpdate.room}
                </p>
              </div>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="p-1 rounded-lg hover:bg-[#FAF8F2] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-2">Select Progress Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setUpdateProgressVal(val)}
                      className={`p-2.5 rounded-xl font-bold transition-all border ${
                        updateProgressVal === val
                          ? 'bg-[#996E7D] text-white border-[#996E7D] shadow-xs'
                          : 'bg-[#FAF8F2] text-[#1A1A1A] border-[#E7E4DF] hover:bg-[#F5EFF2]'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Technician Remarks</label>
                <textarea
                  value={updateRemarks}
                  onChange={(e) => setUpdateRemarks(e.target.value)}
                  placeholder="e.g. Replaced faulty washer seal, checking water pressure..."
                  className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] focus:bg-white text-xs min-h-[80px]"
                />
              </div>

              {/* Photo Upload Placeholder */}
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Upload Work Photo (Optional)</label>
                <div className="p-4 rounded-xl border-2 border-dashed border-[#E7E4DF] text-center bg-[#FAF8F2] hover:bg-[#F5EFF2] cursor-pointer transition-colors">
                  <Camera className="w-6 h-6 text-[#996E7D] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-[#666666] block">
                    Click to capture/attach inspection photo
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E7E4DF]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Save Progress
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== COMPLETE TASK MODAL ==================== */}
      {showCompleteModal && selectedTaskForComplete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
                  Complete Task ({selectedTaskForComplete.id})
                </h3>
                <p className="font-body text-xs text-[#666666]">
                  {selectedTaskForComplete.title} • {selectedTaskForComplete.room}
                </p>
              </div>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="p-1 rounded-lg hover:bg-[#FAF8F2] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCompletion} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Materials / Spare Parts Used</label>
                <Input
                  placeholder="e.g. 1x Rubber Gasket, 1x Modular Switch"
                  value={materialsUsedInput}
                  onChange={(e) => setMaterialsUsedInput(e.target.value)}
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Time Spent on Job</label>
                <Input
                  placeholder="e.g. 35 minutes"
                  value={completionTimeInput}
                  onChange={(e) => setCompletionTimeInput(e.target.value)}
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Completion Notes</label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="e.g. Joint tested under full pressure, no leaks observed. Area cleaned."
                  className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-xs min-h-[70px]"
                />
              </div>

              {/* Proof Photo & Signature Placeholder */}
              <div className="space-y-2">
                <label className="font-bold text-[#1A1A1A] block">Upload Proof Image & Signature</label>
                <div className="p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-center text-[11px] text-[#666666] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-[#1A1A1A]">
                    <Upload className="w-4 h-4 text-[#996E7D]" /> Proof Photo Attached
                  </span>
                  <span className="text-[#2E7D32] font-bold">Ready ✅</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E7E4DF]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowCompleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Confirm Completion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MATERIAL REQUEST MODAL ==================== */}
      {showMaterialRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Request Inventory Stock</h3>
              <button onClick={() => setShowMaterialRequestModal(false)} className="p-1 text-[#666666]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMaterialRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Item Name</label>
                <input
                  type="text"
                  value={requestItemName}
                  onChange={(e) => setRequestItemName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Required Quantity</label>
                <input
                  type="number"
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-xs font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E7E4DF]">
                <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => setShowMaterialRequestModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="flex-1">
                  Submit Requisition
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CONTACT WARDEN MODAL ==================== */}
      {showContactWardenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Contact Warden Office</h3>
              <button onClick={() => setShowContactWardenModal(false)} className="p-1 text-[#666666]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendWardenMsg} className="space-y-4 text-xs">
              <p className="text-[#666666]">
                Send a direct operational message to Dr. Priya Raman (Warden).
              </p>

              <div>
                <textarea
                  value={wardenMessage}
                  onChange={(e) => setWardenMessage(e.target.value)}
                  placeholder="e.g. Urgent requirement for heavy-duty circuit breaker for Block C..."
                  className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-xs min-h-[90px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E7E4DF]">
                <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => setShowContactWardenModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="flex-1">
                  Send Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Edit Profile Details</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="p-1 text-[#666666]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowEditProfileModal(false);
                showToast({ title: 'Profile Updated', message: 'Your details have been saved.', type: 'success' });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Phone Number</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Email</label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E7E4DF]">
                <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => setShowEditProfileModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== WORK PASS GENERATED CONFIRMATION MODAL ==================== */}
      {generatedPassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl animate-scaleIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto border border-[#2E7D32]/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-[#1A1A1A]">
                Work Pass Generated Successfully 🎉
              </h3>
              <p className="font-body text-xs text-[#666666]">
                Automatic Maintenance Work Pass created for Security Gate verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Pass ID:</span>
                <strong className="font-mono text-[#996E7D]">{generatedPassModal.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Complaint:</span>
                <strong className="text-[#1A1A1A]">{generatedPassModal.complaintId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Location:</span>
                <strong className="text-[#1A1A1A]">{generatedPassModal.room} ({generatedPassModal.block})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Valid Until:</span>
                <strong className="text-[#2E7D32]">{generatedPassModal.validUntil}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setGeneratedPassModal(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => {
                  setGeneratedPassModal(null);
                  setActiveRoute('/maintenance/passes');
                }}
              >
                View Pass
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== COMPLAINT TIMELINE MODAL ==================== */}
      {selectedPassForTimeline && (
        <ComplaintTimelineModal
          pass={selectedPassForTimeline}
          onClose={() => setSelectedPassForTimeline(null)}
        />
      )}

      {/* ==================== SECURITY SCAN MODAL / SCREEN ==================== */}
      {selectedPassForSecurityScan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="bg-[#FAF8F2] rounded-[24px] max-w-3xl w-full p-2 relative shadow-2xl animate-scaleIn">
            <button
              onClick={() => setSelectedPassForSecurityScan(null)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A] shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <SecurityScanResultScreen
              pass={selectedPassForSecurityScan}
              onBack={() => setSelectedPassForSecurityScan(null)}
            />
          </div>
        </div>
      )}
      {/* Vaigai AI Helper Modal */}
      <VaigaiAiHelperModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onNavigateRoute={(r) => setActiveRoute(r)}
        userRole="Maintenance"
      />
    </div>
  );
};

export default MaintenanceDashboard;