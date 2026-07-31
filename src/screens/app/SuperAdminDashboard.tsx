import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Activity, 
  Building, 
  Trophy, 
  AlertCircle, 
  Sparkles, 
  HardDrive, 
  FileCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  LogOut, 
  X, 
  Check, 
  TrendingUp, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wrench, 
  Eye, 
  UserX, 
  Key, 
  ShieldAlert, 
  Play, 
  RotateCcw,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  HelpCircle,
  UserCheck,
  XCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Snackbar from '../../components/common/Snackbar';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import VaigaiAiHelperModal from '../../components/ai/VaigaiAiHelperModal';
import { useToast } from '../../context/ToastContext';
import {
  createBackupSnapshot,
  subscribeToBackups,
  formatBackupTimestamp,
  BackupSnapshotDoc,
} from '../../services/backupService';
import {
  subscribeToPendingUsers,
  approveUserRequest,
  rejectUserRequest,
  formatRequestTimestamp,
  PendingUserDoc,
} from '../../services/pendingRequestsService';

export interface SuperAdminDashboardProps {
  userName?: string;
  onLogout: () => void;
  initialRoute?: string;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  userName = 'Super Administrator',
  onLogout,
  initialRoute = '/superadmin/dashboard',
}) => {
  const { showToast } = useToast();

  const [activeRoute, setActiveRoute] = useState<string>(initialRoute);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ==================== 1. ACCESS CONTROL STATE ====================
  const [roleLoginEnabled, setRoleLoginEnabled] = useState({
    resident: true,
    warden: true,
    maintenance: true,
    security: true,
  });
  const [sessionTimeout, setSessionTimeout] = useState('30m');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [passwordExpiry, setPasswordExpiry] = useState('90d');
  const [global2FA, setGlobal2FA] = useState(true);
  const [role2FA, setRole2FA] = useState({
    resident: false,
    warden: true,
    maintenance: true,
    security: true,
    superadmin: true,
  });

  const [activeSessions, setActiveSessions] = useState([
    { id: 'SES-901', user: 'Dr. Priya Raman', role: 'Warden', hostel: 'Vaigai Block A', device: 'MacBook Pro 16"', browser: 'Chrome 122.0', loginTime: 'Today, 08:30 AM', status: 'Active', ip: '192.168.1.42' },
    { id: 'SES-902', user: 'Vaishnavi S.', role: 'Resident', hostel: 'Vaigai Block A', device: 'iPhone 15 Pro', browser: 'Safari Mobile', loginTime: 'Today, 09:12 AM', status: 'Active', ip: '10.0.4.102' },
    { id: 'SES-903', user: 'Manoj Kumar', role: 'Maintenance', hostel: 'All Blocks', device: 'Samsung Galaxy S23', browser: 'Chrome Mobile', loginTime: 'Today, 07:45 AM', status: 'Idle', ip: '10.0.8.55' },
    { id: 'SES-904', user: 'Suresh Kumar', role: 'Security', hostel: 'Main Gate', device: 'Android Rugged Tablet', browser: 'Firefox 118.0', loginTime: 'Today, 06:00 AM', status: 'Active', ip: '192.168.2.10' },
    { id: 'SES-905', user: 'K. Rajan', role: 'IT Support', hostel: 'Tamirabarani Block', device: 'Windows 11 PC', browser: 'Edge 121.0', loginTime: 'Yesterday, 11:20 PM', status: 'Idle', ip: '192.168.1.88' },
  ]);

  const handleForceLogoutSession = (sessionId: string, userName: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast({
      title: 'Session Terminated',
      message: `Force logged out active session for ${userName}.`,
      type: 'info',
    });
  };

  // ==================== 2. BACKUP & RECOVERY STATE (Firestore-backed) ====================
  const [backups, setBackups] = useState<BackupSnapshotDoc[]>([]);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  // Live-subscribe to real backup records in Firestore (collection: "backups"),
  // newest first, so this list survives refreshes and is shared across admins.
  useEffect(() => {
    const unsubscribe = subscribeToBackups(setBackups);
    return unsubscribe;
  }, []);

  const handleRunManualBackup = () => {
    setIsBackupRunning(true);
    setBackupProgress(0);
    showToast({ title: 'Backup Initialized', message: 'Running cloud snapshot and database dump...', type: 'info' });

    const interval = setInterval(() => {
      setBackupProgress((prev) => (prev >= 95 ? prev : prev + Math.floor(Math.random() * 12) + 5));
    }, 300);

    setTimeout(async () => {
      clearInterval(interval);
      setBackupProgress(100);
      setIsBackupRunning(false);

      try {
        await createBackupSnapshot({
          label: `BKP-${Math.floor(1100 + Math.random() * 900)}`,
          type: 'Manual On-Demand Backup',
          status: 'Healthy',
          size: '1.43 GB',
          duration: '1m 24s',
          triggeredBy: userName,
        });
        // No need to manually prepend to `backups` — the live Firestore
        // subscription above picks up the new doc automatically.
        showToast({ title: 'Backup Successful ✅', message: 'Snapshot created and verified in cloud cold vault.', type: 'success' });
      } catch (err) {
        console.error('Failed to persist backup snapshot:', err);
        showToast({ title: 'Backup Failed', message: 'Could not save the snapshot record. Please try again.', type: 'error' });
      } finally {
        setTimeout(() => setBackupProgress(0), 800);
      }
    }, 2500);
  };

  const handleRestoreBackup = (bkp: BackupSnapshotDoc) => {
    setRestoringId(bkp.id);
    showToast({ title: 'Restore Started', message: `Spinning up sandbox environment for ${bkp.label}...`, type: 'info' });

    setTimeout(() => {
      showToast({ title: 'Restore In Progress', message: `Rehydrating database from ${bkp.label} (${bkp.size})...`, type: 'info' });
    }, 1200);

    setTimeout(() => {
      setRestoringId(null);
      showToast({ title: 'Restore Complete ✅', message: `Sandbox restored from ${bkp.label}. Verify data before promoting.`, type: 'success' });
    }, 3200);
  };

  // ==================== 3. SYSTEM HEALTH MONITOR STATE ====================
  const subsystems = [
    { name: 'Authentication Service', status: 'Healthy', responseTime: '18ms', uptime: '99.99%', errorCount: 0, color: '#2E7D32' },
    { name: 'Database Cluster', status: 'Healthy', responseTime: '24ms', uptime: '99.98%', errorCount: 1, color: '#2E7D32' },
    { name: 'QR Pass Scanner Service', status: 'Healthy', responseTime: '32ms', uptime: '99.95%', errorCount: 0, color: '#2E7D32' },
    { name: 'AI Module (Gemini Engine)', status: 'Healthy', responseTime: '140ms', uptime: '99.90%', errorCount: 0, color: '#2E7D32' },
    { name: 'Notification & SMS Service', status: 'Healthy', responseTime: '45ms', uptime: '99.98%', errorCount: 0, color: '#2E7D32' },
    { name: 'Media Storage Engine', status: 'Warning', responseTime: '88ms', uptime: '99.85%', errorCount: 3, color: '#F0AD4E' },
    { name: 'Analytics Processing Engine', status: 'Healthy', responseTime: '52ms', uptime: '99.99%', errorCount: 0, color: '#2E7D32' },
  ];

  // ==================== 4. HOSTEL COMPARISON DATA ====================
  const hostelDataList = [
    { name: 'Vaigai Hostel', gender: 'Boys', floors: 9, capacity: 340, occupied: 322, occupancyPct: 95, complaints: 12, avgResolutionHours: 2.4, sosCount: 1, visitorCount: 38, maintenanceRequests: 7, securityIncidents: 0, warden: 'Dr. Priya Raman' },
    { name: 'Cauvery Hostel', gender: 'Girls', floors: 9, capacity: 320, occupied: 282, occupancyPct: 88, complaints: 8, avgResolutionHours: 1.8, sosCount: 0, visitorCount: 24, maintenanceRequests: 4, securityIncidents: 0, warden: 'Dr. S. Vignesh' },
    { name: 'Thamirabarani Hostel', gender: 'Boys', floors: 5, capacity: 190, occupied: 175, occupancyPct: 92, complaints: 15, avgResolutionHours: 3.1, sosCount: 0, visitorCount: 42, maintenanceRequests: 9, securityIncidents: 1, warden: 'Dr. Anita Roy' },
    { name: 'Bhavani Hostel', gender: 'Boys', floors: 3, capacity: 120, occupied: 108, occupancyPct: 90, complaints: 5, avgResolutionHours: 2.0, sosCount: 0, visitorCount: 19, maintenanceRequests: 3, securityIncidents: 0, warden: 'Prof. K. Sundar' },
    { name: 'Palar Hostel', gender: 'Boys', floors: 5, capacity: 190, occupied: 162, occupancyPct: 85, complaints: 9, avgResolutionHours: 2.8, sosCount: 0, visitorCount: 28, maintenanceRequests: 5, securityIncidents: 0, warden: 'Dr. M. Lakshmi' },
    { name: 'Amaravathi Hostel', gender: 'Girls', floors: 8, capacity: 300, occupied: 279, occupancyPct: 93, complaints: 6, avgResolutionHours: 2.1, sosCount: 0, visitorCount: 21, maintenanceRequests: 4, securityIncidents: 0, warden: 'Dr. Kavitha Sundaram' },
    { name: 'Pothigai Hostel', gender: 'Boys', floors: 12, capacity: 440, occupied: 396, occupancyPct: 90, complaints: 18, avgResolutionHours: 2.9, sosCount: 0, visitorCount: 50, maintenanceRequests: 11, securityIncidents: 0, warden: 'Prof. R. Elangovan' },
  ];
  // ==================== 5. PERFORMANCE LEADERBOARD ====================
  const leaderboardData = {
    wardens: [
      { rank: 1, medal: '🥇', name: 'Dr. Priya Raman', role: 'Chief Warden', hostel: 'Vaigai Block A', score: '98.6%', trend: '+2.4%', resolutionTime: '2.4 hrs', avatarColor: '#996E7D' },
      { rank: 2, medal: '🥈', name: 'Dr. S. Vignesh', role: 'Block Warden', hostel: 'Kaveri Block B', score: '96.2%', trend: '+1.8%', resolutionTime: '1.8 hrs', avatarColor: '#2A5C8A' },
      { rank: 3, medal: '🥉', name: 'Dr. Anita Roy', role: 'Block Warden', hostel: 'Tamirabarani Block C', score: '94.1%', trend: '+0.9%', resolutionTime: '3.1 hrs', avatarColor: '#059669' },
    ],
    maintenance: [
      { rank: 1, medal: '🥇', name: 'Manoj Kumar', role: 'Lead Electrician', hostel: 'All Blocks', score: '99.1%', trend: '+3.5%', resolutionTime: '42 mins', avatarColor: '#2E7D32' },
      { rank: 2, medal: '🥈', name: 'M. Selvam', role: 'Senior Plumber', hostel: 'Vaigai & Kaveri', score: '97.5%', trend: '+2.1%', resolutionTime: '55 mins', avatarColor: '#D97706' },
      { rank: 3, medal: '🥉', name: 'K. Rajan', role: 'Network Admin', hostel: 'All Blocks', score: '95.8%', trend: '+1.2%', resolutionTime: '1.1 hrs', avatarColor: '#2A5C8A' },
    ],
    security: [
      { rank: 1, medal: '🥇', name: 'Suresh Kumar', role: 'Head Guard', hostel: 'Main Gate A', score: '99.4%', trend: '+1.0%', resolutionTime: 'Instant', avatarColor: '#D9534F' },
      { rank: 2, medal: '🥈', name: 'P. Ramesh', role: 'Shift Inspector', hostel: 'North Gate B', score: '97.8%', trend: '+2.3%', resolutionTime: 'Instant', avatarColor: '#996E7D' },
      { rank: 3, medal: '🥉', name: 'R. Arumugam', role: 'Patrol Guard', hostel: 'Perimeter Patrol', score: '96.0%', trend: '+0.5%', resolutionTime: 'Instant', avatarColor: '#2A5C8A' },
    ],
    hostels: [
      { rank: 1, medal: '🥇', name: 'Vaigai Hostel', role: 'Boys • 9 Floors', hostel: '340 Residents', score: '4.9 / 5.0 ⭐', trend: 'Occupancy 95%', resolutionTime: '2.4 hrs', avatarColor: '#996E7D' },
      { rank: 2, medal: '🥈', name: 'Amaravathi Hostel', role: 'Girls • 8 Floors', hostel: '300 Residents', score: '4.8 / 5.0 ⭐', trend: 'Occupancy 93%', resolutionTime: '2.1 hrs', avatarColor: '#2A5C8A' },
      { rank: 3, medal: '🥉', name: 'Bhavani Hostel', role: 'Boys • 3 Floors', hostel: '120 Residents', score: '4.6 / 5.0 ⭐', trend: 'Occupancy 90%', resolutionTime: '2.0 hrs', avatarColor: '#059669' },
    ],
  };

  // ==================== 6. SYSTEM ALERTS STATE ====================
  const [alertsList, setAlertsList] = useState([
    { id: 'ALT-101', title: 'QR Pass Verification Delay', service: 'QR Service', priority: 'High', message: 'Gate scanner latency elevated above 450ms during peak evening hours.', time: '12 mins ago', status: 'Unresolved' },
    { id: 'ALT-102', title: 'Media Storage Near Capacity', service: 'Storage', priority: 'Medium', message: 'Hostel visitor ID photo vault reached 88% allocated limit.', time: '1 hour ago', status: 'Unresolved' },
    { id: 'ALT-103', title: 'Multiple SOS Events Detected', service: 'Security Engine', priority: 'Critical', message: 'Vaigai Block A, Room 204 distress signal triggered and dispatched.', time: '2 hours ago', status: 'Resolved' },
    { id: 'ALT-104', title: 'Database Connection Spike', service: 'Database', priority: 'Medium', message: 'Active pooled connections reached 82% threshold during student check-in.', time: '3 hours ago', status: 'Unresolved' },
    { id: 'ALT-105', title: 'High Complaint Volume - Water Supply', service: 'Maintenance', priority: 'Low', message: '12 complaints logged in Tamirabarani Block regarding water pressure.', time: '5 hours ago', status: 'Unresolved' },
  ]);
  const [alertPriorityFilter, setAlertPriorityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');

  const handleResolveAlert = (id: string) => {
    setAlertsList((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
    showToast({
      title: 'Alert Resolved',
      message: `System alert ${id} marked as resolved.`,
      type: 'success',
    });
  };

  // ==================== 7. CAMPUS OVERVIEW STATE ====================
  const [selectedHostelPanel, setSelectedHostelPanel] = useState<typeof hostelDataList[0] | null>(null);

  // ==================== 8. ENTERPRISE ANALYTICS DATA ====================
  const analyticsData = {
    monthlyOccupancy: [
      { month: 'Oct', Vaigai: 88, Kaveri: 82, Tamirabarani: 85, Bhavani: 80, Palar: 78 },
      { month: 'Nov', Vaigai: 90, Kaveri: 84, Tamirabarani: 88, Bhavani: 85, Palar: 80 },
      { month: 'Dec', Vaigai: 92, Kaveri: 85, Tamirabarani: 90, Bhavani: 87, Palar: 82 },
      { month: 'Jan', Vaigai: 94, Kaveri: 87, Tamirabarani: 91, Bhavani: 88, Palar: 84 },
      { month: 'Feb', Vaigai: 95, Kaveri: 88, Tamirabarani: 92, Bhavani: 90, Palar: 85 },
    ],
    complaintForecast: [
      { week: 'W1', Actual: 45, Forecast: 42 },
      { week: 'W2', Actual: 38, Forecast: 40 },
      { week: 'W3', Actual: 52, Forecast: 48 },
      { week: 'W4', Actual: 32, Forecast: 35 },
      { week: 'W5 (Next)', Actual: null, Forecast: 30 },
    ],
    visitorGrowth: [
      { day: 'Mon', Visitors: 120 },
      { day: 'Tue', Visitors: 145 },
      { day: 'Wed', Visitors: 130 },
      { day: 'Thu', Visitors: 160 },
      { day: 'Fri', Visitors: 210 },
      { day: 'Sat', Visitors: 290 },
      { day: 'Sun', Visitors: 340 },
    ],
    roleDistribution: [
      { name: 'Residents', value: 864, color: '#996E7D' },
      { name: 'Wardens & Staff', value: 24, color: '#2A5C8A' },
      { name: 'Maintenance Techs', value: 18, color: '#2E7D32' },
      { name: 'Security Personnel', value: 32, color: '#D9534F' },
    ],
  };

  // ==================== 9. AUDIT INSIGHTS STATE ====================
  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-8812', time: '2026-07-25 09:12:04', user: 'Vaishnavi S. (Resident)', role: 'Resident', hostel: 'Vaigai Block A', action: 'Digital Room Inventory Check-In Submitted', severity: 'Info', ip: '10.0.4.102' },
    { id: 'LOG-8811', time: '2026-07-25 08:45:22', user: 'Dr. Priya Raman (Warden)', role: 'Warden', hostel: 'Vaigai Block A', action: 'Approved Pass Extension for Visitor PV-8910', severity: 'Success', ip: '192.168.1.42' },
    { id: 'LOG-8810', time: '2026-07-25 08:30:10', user: 'Manoj Kumar (Tech)', role: 'Maintenance', hostel: 'Kaveri Block B', action: 'Resolved Complaint VAI-8750 (Fan Regulator)', severity: 'Info', ip: '10.0.8.55' },
    { id: 'LOG-8809', time: '2026-07-25 07:15:00', user: 'Suresh Kumar (Security)', role: 'Security', hostel: 'Main Gate A', action: 'QR Code Pass Scan Validated (PV-8910)', severity: 'Info', ip: '192.168.2.10' },
    { id: 'LOG-8808', time: '2026-07-24 23:10:44', user: 'System Auto-Engine', role: 'System', hostel: 'Global', action: 'Global 2FA Security Policy Enforced for Wardens', severity: 'Warning', ip: '127.0.0.1' },
    { id: 'LOG-8807', time: '2026-07-24 22:00:00', user: 'Super Admin', role: 'Super Admin', hostel: 'Global', action: 'Manual Automated Cloud Backup Triggered (BKP-1088)', severity: 'Success', ip: '192.168.1.1' },
  ]);

  const [auditRoleFilter, setAuditRoleFilter] = useState('All');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState('All');

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditRoleFilter !== 'All' && log.role !== auditRoleFilter) return false;
    if (auditSeverityFilter !== 'All' && log.severity !== auditSeverityFilter) return false;
    return true;
  });

  const handleExportAuditCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'User', 'Role', 'Hostel', 'Action', 'IP Address', 'Severity'];
    const rows = filteredAuditLogs.map((log) => [
      log.id, log.time, log.user, log.role, log.hostel, log.action, log.ip, log.severity,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      title: 'Audit Report Exported',
      message: `Downloaded ${filteredAuditLogs.length} audit log entries as CSV.`,
      type: 'success',
    });
  };

  // ==================== 10. PENDING REQUESTS STATE (Firestore-backed, client-side only) ====================
  const [pendingRequests, setPendingRequests] = useState<PendingUserDoc[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<PendingUserDoc | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Live-subscribe to users with status "pending" in Firestore, newest first.
  useEffect(() => {
    const unsubscribe = subscribeToPendingUsers(setPendingRequests);
    return unsubscribe;
  }, []);

  const handleApproveRequest = async (req: PendingUserDoc) => {
    setProcessingId(req.id);
    try {
      await approveUserRequest(req, userName);
      showToast({
        title: 'Request Approved',
        message: `${req.displayName || req.email} can now sign in as ${req.role}.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to approve request:', err);
      showToast({ title: 'Approval Failed', message: 'Could not approve this request. Please try again.', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectingRequest) return;
    setProcessingId(rejectingRequest.id);
    try {
      await rejectUserRequest(rejectingRequest, userName, rejectionReason);
      showToast({
        title: 'Request Rejected',
        message: `${rejectingRequest.displayName || rejectingRequest.email}'s request was declined.`,
        type: 'info',
      });
    } catch (err) {
      console.error('Failed to reject request:', err);
      showToast({ title: 'Action Failed', message: 'Could not reject this request. Please try again.', type: 'error' });
    } finally {
      setProcessingId(null);
      setRejectingRequest(null);
      setRejectionReason('');
    }
  };

  // Page title helper
  const getPageTitle = (route: string) => {
    switch (route) {
      case '/superadmin/dashboard': return 'Super Admin Dashboard';
      case '/superadmin/requests': return 'Pending Requests';
      case '/superadmin/access-control': return 'Access Control Center';
      case '/superadmin/backup': return 'Backup & Disaster Recovery';
      case '/superadmin/system-health': return 'System Health Monitor';
      case '/superadmin/hostel-comparison': return 'Cross-Hostel Comparison';
      case '/superadmin/leaderboard': return 'Performance Leaderboard';
      case '/superadmin/alerts': return 'System Alert Center';
      case '/superadmin/campus': return 'Campus Overview';
      case '/superadmin/analytics': return 'Enterprise Analytics';
      case '/superadmin/audit': return 'Audit Insights';
      case '/superadmin/profile': return 'Administrator Profile';
      case '/superadmin/settings': return 'Platform Settings';
      default: return 'Super Admin Portal';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] font-body">
      {/* Sidebar Navigation */}
      <Sidebar
        role="superadmin"
        activeRoute={activeRoute}
        onNavigate={(route) => setActiveRoute(route)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onLogout={onLogout}
        onOpenAiHelper={() => setShowAiModal(true)}
        pendingRequestsCount={pendingRequests.length}
      />

      {/* Main Layout Container */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isSidebarCollapsed ? 'md:pl-[80px]' : 'md:pl-[280px]'
        }`}
      >
        {/* Header Bar */}
        <TopBar
          currentPageTitle={getPageTitle(activeRoute)}
          role="superadmin"
          userName={userName}
          userRole="Super Administrator"
          avatarInitials="SA"
          avatarColor="#2A5C8A"
          hostelBlock="Global Administration"
          roomNumber="Central Console"
          unreadCount={5}
          showBackButton={activeRoute !== '/superadmin/dashboard'}
          onBack={() => setActiveRoute('/superadmin/dashboard')}
          onOpenAiHelper={() => setShowAiModal(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigate={(r) => setActiveRoute(r)}
          onLogout={onLogout}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">

          {/* ==================== 0. MASTER DASHBOARD OVERVIEW ==================== */}
          {activeRoute === '/superadmin/dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Banner */}
              <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2A5C8A] to-[#1A1A1A] text-white p-6 sm:p-8 rounded-[24px] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase">
                      Enterprise Suite
                    </span>
                    <Badge variant="success" size="sm">
                      <span className="w-2 h-2 rounded-full bg-[#059669] inline-block mr-1.5 animate-pulse" />
                      All Systems Operational
                    </Badge>
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Project Vaigai Super Admin Command Center
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1.5 max-w-2xl">
                    Real-time cross-hostel governance, security policies, system diagnostics, and performance analytics across campus.
                  </p>
                </div>

                <div className="flex items-center gap-3 relative z-10 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    onClick={() => {
                      showToast({
                        title: 'Telemetry Synced',
                        message: 'Real-time hostel metrics updated.',
                        type: 'info',
                      });
                    }}
                  >
                    Sync Live Metrics
                  </Button>
                </div>
              </div>

              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="p-5 border border-[#E7E4DF] hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#666666]">
                      Active Sessions
                    </span>
                    <span className="p-2 rounded-xl bg-[#EBF3FA] text-[#2A5C8A]">
                      <Users className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#1A1A1A]">
                    1,482
                  </div>
                  <p className="text-xs text-[#2E7D32] font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs peak yesterday
                  </p>
                </Card>

                <Card
                  className="p-5 border border-[#E7E4DF] hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setActiveRoute('/superadmin/requests')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#666666]">
                      Pending Requests
                    </span>
                    <span className="p-2 rounded-xl bg-[#FEF9E7] text-[#D97706]">
                      <UserCheck className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#1A1A1A]">
                    {pendingRequests.length}
                  </div>
                  <p className="text-xs text-[#D97706] font-semibold mt-1">
                    Awaiting your review
                  </p>
                </Card>

                <Card className="p-5 border border-[#E7E4DF] hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#666666]">
                      Managed Hostels
                    </span>
                    <span className="p-2 rounded-xl bg-[#F5EFF2] text-[#996E7D]">
                      <Building className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#1A1A1A]">
                    7 Blocks
                  </div>
                  <p className="text-xs text-[#666666] font-medium mt-1">
                    1,900 total rooms • 91% occupancy
                  </p>
                </Card>

                <Card className="p-5 border border-[#E7E4DF] hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#666666]">
                      Unresolved Alerts
                    </span>
                    <span className="p-2 rounded-xl bg-[#FDF2F2] text-[#D9534F]">
                      <AlertCircle className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[#D9534F]">
                    4 Active
                  </div>
                  <p className="text-xs text-[#666666] font-medium mt-1">
                    1 Critical • 2 High • 1 Medium
                  </p>
                </Card>
              </div>

              {/* Quick Navigation Cards Grid to all modules */}
              <div>
                <h2 className="font-heading text-lg font-extrabold text-[#1A1A1A] mb-4">
                  Enterprise Modules Navigation
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { title: 'Pending Requests', desc: 'Approve or reject Warden, Maintenance & Security signup requests.', route: '/superadmin/requests', icon: UserCheck, color: '#D97706', badge: 'Action Needed' },
                    { title: 'Access Control Center', desc: 'Global role login toggles, 2FA policies & active session logs.', route: '/superadmin/access-control', icon: Lock, color: '#2A5C8A', badge: 'Security' },
                    { title: 'Backup & Disaster Recovery', desc: 'Cloud snapshot dumps, automated schedules & RTO recovery.', route: '/superadmin/backup', icon: HardDrive, color: '#666666', badge: 'Vault' },
                    { title: 'System Health Monitor', desc: 'Real-time microservice status, latency, CPU/memory telemetry.', route: '/superadmin/system-health', icon: Activity, color: '#059669', badge: 'Live' },
                    { title: 'Cross-Hostel Comparison', desc: 'Benchmark metrics, occupancy ratios & complaint resolution across all 7 blocks.', route: '/superadmin/hostel-comparison', icon: BarChart3, color: '#E65100', badge: 'Analytics' },
                    { title: 'Staff Leaderboard', desc: 'Top wardens, fastest technicians & highest-rated hostels with medals.', route: '/superadmin/leaderboard', icon: Trophy, color: '#D97706', badge: 'Awards' },
                    { title: 'System Alert Center', desc: 'Real-time alert dispatch, priority filtering & automated resolution.', route: '/superadmin/alerts', icon: AlertCircle, color: '#D9534F', badge: 'Alerts' },
                    { title: 'Campus Overview', desc: 'Interactive block cards & detailed warden slide-over inspection panel.', route: '/superadmin/campus', icon: Building, color: '#996E7D', badge: 'Map' },
                    { title: 'Enterprise Analytics', desc: 'Occupancy trends, complaint forecasting & visitor growth charts.', route: '/superadmin/analytics', icon: Sparkles, color: '#2A5C8A', badge: 'BI' },
                    { title: 'Audit Insights', desc: 'Comprehensive system log audit trail with CSV/PDF exports.', route: '/superadmin/audit', icon: FileCheck, color: '#2E7D32', badge: 'Logs' },
                  ].map((mod) => (
                    <Card
                      key={mod.route}
                      onClick={() => setActiveRoute(mod.route)}
                      className="p-5 border border-[#E7E4DF] hover:border-[#996E7D] hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span 
                          className="p-2.5 rounded-xl text-white shadow-xs"
                          style={{ backgroundColor: mod.color }}
                        >
                          <mod.icon className="w-5 h-5" />
                        </span>
                        <Badge variant="primary" size="sm">{mod.badge}</Badge>
                      </div>

                      <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] group-hover:text-[#996E7D] transition-colors flex items-center gap-1.5">
                        {mod.title}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#996E7D]" />
                      </h3>

                      <p className="font-body text-xs text-[#666666] mt-1.5 leading-relaxed">
                        {mod.desc}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== PENDING REQUESTS ==================== */}
          {activeRoute === '/superadmin/requests' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    Pending Account Requests
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Review and approve or reject Warden, Maintenance, and Security signups awaiting verification.
                  </p>
                </div>
                <Badge variant={pendingRequests.length > 0 ? 'warning' : 'success'} size="md">
                  {pendingRequests.length} Awaiting Review
                </Badge>
              </div>

              {pendingRequests.length === 0 ? (
                <Card className="p-10 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto mb-3" />
                  <h3 className="font-heading text-base font-bold text-[#1A1A1A]">All caught up</h3>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    There are no pending signup requests right now.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <Card key={req.id} className="p-5 border border-[#E7E4DF] hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-[#F5EFF2] text-[#996E7D] font-extrabold text-sm flex items-center justify-center shrink-0">
                            {(req.displayName || req.email).slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A]">
                              {req.displayName || req.email}
                            </h3>
                            <p className="font-body text-xs text-[#666666]">{req.email}</p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <Badge variant="primary" size="sm" className="capitalize">{req.role}</Badge>
                              {req.hostelBlock && (
                                <span className="text-[11px] text-[#8E8E93] font-medium">{req.hostelBlock}</span>
                              )}
                              <span className="text-[11px] text-[#8E8E93]">
                                Requested {formatRequestTimestamp(req.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={processingId === req.id}
                            onClick={() => setRejectingRequest(req)}
                            leftIcon={<XCircle className="w-4 h-4" />}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={processingId === req.id}
                            onClick={() => handleApproveRequest(req)}
                            leftIcon={<UserCheck className="w-4 h-4" />}
                          >
                            {processingId === req.id ? 'Approving…' : 'Approve'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Rejection Reason Modal */}
              {rejectingRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                  <div className="bg-white rounded-[20px] max-w-sm w-full p-6 shadow-2xl border border-[#E7E4DF]">
                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-2">
                      Reject Request
                    </h3>
                    <p className="font-body text-xs text-[#666666] mb-4">
                      Optionally add a reason for rejecting {rejectingRequest.displayName || rejectingRequest.email}'s request.
                    </p>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reason (optional)"
                      rows={3}
                      className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-xs outline-none"
                    />
                    <div className="flex items-center justify-end gap-3 mt-4">
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => { setRejectingRequest(null); setRejectionReason(''); }}
                      >
                        Cancel
                      </Button>
                      <Button variant="danger" size="sm" onClick={handleRejectRequest}>
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 1. ACCESS CONTROL CENTER ==================== */}
          {activeRoute === '/superadmin/access-control' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    Access Control Center
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Manage authentication security policies, role access switches, and active user sessions across the platform.
                  </p>
                </div>

                <Badge variant="secondary" size="md">
                  <ShieldCheck className="w-4 h-4 mr-1 text-[#2A5C8A]" /> Global Security Active
                </Badge>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border-l-4 border-l-[#2A5C8A]">
                  <span className="text-xs font-bold text-[#666666] uppercase block">Active Sessions</span>
                  <span className="font-heading text-2xl font-extrabold text-[#1A1A1A] mt-1 block">1,482</span>
                  <span className="text-[11px] text-[#2E7D32] mt-0.5 block">Across web & mobile</span>
                </Card>

                <Card className="p-4 border-l-4 border-l-[#F0AD4E]">
                  <span className="text-xs font-bold text-[#666666] uppercase block">Failed Login Attempts (24h)</span>
                  <span className="font-heading text-2xl font-extrabold text-[#1A1A1A] mt-1 block">14</span>
                  <span className="text-[11px] text-[#F0AD4E] mt-0.5 block">Auto-throttled by gateway</span>
                </Card>

                <Card className="p-4 border-l-4 border-l-[#D9534F]">
                  <span className="text-xs font-bold text-[#666666] uppercase block">Locked Accounts</span>
                  <span className="font-heading text-2xl font-extrabold text-[#D9534F] mt-1 block">3</span>
                  <span className="text-[11px] text-[#666666] mt-0.5 block">Exceeded max retry limits</span>
                </Card>

                <Card className="p-4 border-l-4 border-l-[#996E7D]">
                  <span className="text-xs font-bold text-[#666666] uppercase block">Security Alerts</span>
                  <span className="font-heading text-2xl font-extrabold text-[#1A1A1A] mt-1 block">2</span>
                  <span className="text-[11px] text-[#2A5C8A] mt-0.5 block">New IP locations flagged</span>
                </Card>
              </div>

              {/* Global Login Policies & Auth Security */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Policy Controls */}
                <Card className="p-6 space-y-6">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] border-b border-[#E7E4DF] pb-3">
                    Global Login Policies
                  </h3>

                  <div>
                    <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-2">
                      Enable / Disable Role Login Access
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['resident', 'warden', 'maintenance', 'security'] as const).map((r) => (
                        <label key={r} className="flex items-center justify-between p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-xs font-bold capitalize">
                          <span>{r} Portal</span>
                          <input
                            type="checkbox"
                            checked={roleLoginEnabled[r]}
                            onChange={(e) => setRoleLoginEnabled({ ...roleLoginEnabled, [r]: e.target.checked })}
                            className="w-4 h-4 accent-[#996E7D]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-[#1A1A1A] block mb-1">Session Timeout</label>
                      <select
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-white font-medium"
                      >
                        <option value="15m">15 Minutes</option>
                        <option value="30m">30 Minutes</option>
                        <option value="1h">1 Hour</option>
                        <option value="8h">8 Hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[#1A1A1A] block mb-1">Max Login Retries</label>
                      <select
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-white font-medium"
                      >
                        <option value="3">3 Attempts</option>
                        <option value="5">5 Attempts</option>
                        <option value="10">10 Attempts</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[#1A1A1A] block mb-1">Password Expiry</label>
                      <select
                        value={passwordExpiry}
                        onChange={(e) => setPasswordExpiry(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-white font-medium"
                      >
                        <option value="30d">30 Days</option>
                        <option value="60d">60 Days</option>
                        <option value="90d">90 Days</option>
                        <option value="never">Never Expire</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Authentication Security */}
                <Card className="p-6 space-y-6">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] border-b border-[#E7E4DF] pb-3">
                    Authentication & 2FA Enforcement
                  </h3>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#EBF3FA] border border-[#2A5C8A]/20">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">Global 2FA Requirement</h4>
                      <p className="font-body text-xs text-[#666666]">Mandate TOTP or SMS OTP verification on login</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={global2FA}
                      onChange={(e) => setGlobal2FA(e.target.checked)}
                      className="w-5 h-5 accent-[#2A5C8A]"
                    />
                  </div>

                  <div>
                    <label className="font-heading text-xs font-bold text-[#1A1A1A] block mb-2">
                      Two-Factor Enforced Roles
                    </label>
                    <div className="space-y-2">
                      {(['resident', 'warden', 'maintenance', 'security', 'superadmin'] as const).map((roleKey) => (
                        <label key={roleKey} className="flex items-center justify-between text-xs font-medium text-[#1A1A1A]">
                          <span className="capitalize">{roleKey} Role</span>
                          <input
                            type="checkbox"
                            checked={role2FA[roleKey]}
                            onChange={(e) => setRole2FA({ ...role2FA, [roleKey]: e.target.checked })}
                            className="w-4 h-4 accent-[#2A5C8A]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        showToast({
                          title: 'Password Reset Issued',
                          message: 'All user accounts flagged for mandatory password change on next login.',
                          type: 'info',
                        });
                      }}
                    >
                      Force Global Password Reset
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Active Sessions Table */}
              <Card className="p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                      Active Live Sessions ({activeSessions.length})
                    </h3>
                    <p className="font-body text-xs text-[#666666]">
                      Monitor concurrent authenticated user sessions across devices
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActiveSessions([]);
                      showToast({ title: 'Sessions Purged', message: 'All active sessions terminated.', type: 'info' });
                    }}
                  >
                    Terminate All Sessions
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E4DF] text-[#8E8E93] uppercase tracking-wider font-heading sticky top-0 bg-white">
                        <th className="pb-3 font-bold">User</th>
                        <th className="pb-3 font-bold">Role</th>
                        <th className="pb-3 font-bold">Hostel Block</th>
                        <th className="pb-3 font-bold">Device & Browser</th>
                        <th className="pb-3 font-bold">Login Time</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4DF]">
                      {activeSessions.map((session) => (
                        <tr key={session.id} className="hover:bg-[#FAF8F2]">
                          <td className="py-3 font-bold text-[#1A1A1A]">{session.user}</td>
                          <td className="py-3">
                            <Badge variant={session.role === 'Warden' ? 'primary' : session.role === 'Security' ? 'danger' : 'secondary'} size="sm">
                              {session.role}
                            </Badge>
                          </td>
                          <td className="py-3 text-[#666666]">{session.hostel}</td>
                          <td className="py-3 text-[#666666]">
                            <span className="font-medium text-[#1A1A1A]">{session.device}</span> ({session.browser})
                          </td>
                          <td className="py-3 text-[#8E8E93]">{session.loginTime}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              session.status === 'Active' ? 'bg-[#EBF7EE] text-[#2E7D32]' : 'bg-[#FEF9E7] text-[#B7791F]'
                            }`}>
                              {session.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleForceLogoutSession(session.id, session.user)}
                            >
                              Force Logout
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

          {/* ==================== 2. BACKUP & DISASTER RECOVERY ==================== */}
          {activeRoute === '/superadmin/backup' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    Backup & Disaster Recovery Center
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Automated cold storage database snapshots, point-in-time recovery, and cloud replication.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isBackupRunning && (
                    <div className="w-40 h-2 bg-[#E7E4DF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#996E7D] transition-all duration-300"
                        style={{ width: `${backupProgress}%` }}
                      />
                    </div>
                  )}
                  <Button
                    variant="primary"
                    disabled={isBackupRunning}
                    leftIcon={<HardDrive className="w-4 h-4" />}
                    onClick={handleRunManualBackup}
                  >
                    {isBackupRunning ? `Backing Up… ${backupProgress}%` : 'Run Manual Backup'}
                  </Button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                  <span className="text-xs font-heading font-bold text-[#8E8E93] uppercase">Last Successful Backup</span>
                  <div className="font-heading text-xl font-extrabold text-[#1A1A1A] mt-1">
                    {backups.find((b) => b.status === 'Healthy')
                      ? formatBackupTimestamp(backups.find((b) => b.status === 'Healthy')!.createdAt)
                      : 'No backups yet'}
                  </div>
                  <span className="text-xs text-[#2E7D32] font-semibold mt-1 block">
                    {backups.find((b) => b.status === 'Healthy')
                      ? `${backups.find((b) => b.status === 'Healthy')!.type} (${backups.find((b) => b.status === 'Healthy')!.size})`
                      : 'Run your first backup to populate this'}
                  </span>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-heading font-bold text-[#8E8E93] uppercase">Next Scheduled Backup</span>
                  <div className="font-heading text-xl font-extrabold text-[#1A1A1A] mt-1">Today, 10:00 PM</div>
                  <span className="text-xs text-[#666666] font-medium mt-1 block">Automated Daily Cron</span>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-heading font-bold text-[#8E8E93] uppercase">Cloud Vault Storage Used</span>
                  <div className="font-heading text-xl font-extrabold text-[#1A1A1A] mt-1">142.8 GB / 500 GB</div>
                  <div className="w-full h-1.5 bg-[#E7E4DF] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#996E7D]" style={{ width: '28%' }} />
                  </div>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-heading font-bold text-[#8E8E93] uppercase">System Recovery Status</span>
                  <div className="font-heading text-xl font-extrabold text-[#2E7D32] mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" /> Healthy
                  </div>
                  <span className="text-xs text-[#666666] font-medium mt-1 block">RTO 15 mins • RPO 1 hour</span>
                </Card>
              </div>

              {/* Backup History Table */}
              <Card className="p-6 overflow-hidden">
                <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] mb-4">
                  Backup Execution History
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E4DF] text-[#8E8E93] uppercase tracking-wider font-heading sticky top-0 bg-white">
                        <th className="pb-3 font-bold">Backup ID</th>
                        <th className="pb-3 font-bold">Timestamp</th>
                        <th className="pb-3 font-bold">Backup Type</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold">Archive Size</th>
                        <th className="pb-3 font-bold">Duration</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4DF]">
                      {backups.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#8E8E93]">
                            No backups yet — click "Run Manual Backup" to create your first snapshot.
                          </td>
                        </tr>
                      )}
                      {backups.map((bkp) => (
                        <tr key={bkp.id} className="hover:bg-[#FAF8F2]">
                          <td className="py-3 font-mono font-bold text-[#1A1A1A]">{bkp.label}</td>
                          <td className="py-3 text-[#666666]">{formatBackupTimestamp(bkp.createdAt)}</td>
                          <td className="py-3 font-medium text-[#1A1A1A]">{bkp.type}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              bkp.status === 'Healthy'
                                ? 'bg-[#EBF7EE] text-[#2E7D32]'
                                : 'bg-[#FDF2F2] text-[#D9534F]'
                            }`}>
                              {bkp.status}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-[#666666]">{bkp.size}</td>
                          <td className="py-3 text-[#8E8E93]">{bkp.duration}</td>
                          <td className="py-3 text-right space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={restoringId !== null}
                              onClick={() => handleRestoreBackup(bkp)}
                            >
                              {restoringId === bkp.id ? 'Restoring…' : 'Restore'}
                            </Button>
                            <Button
                              variant="text"
                              size="sm"
                              onClick={() => {
                                showToast({ title: 'Downloading Logs', message: `Logs for ${bkp.label} downloaded.`, type: 'info' });
                              }}
                            >
                              Log
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

          {/* ==================== 3. SYSTEM HEALTH MONITOR ==================== */}
          {activeRoute === '/superadmin/system-health' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex items-center justify-between">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    System Health & Infrastructure Monitor
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Live telemetry for backend microservices, database clusters, AI inference engines, and API workloads.
                  </p>
                </div>

                <Badge variant="success" size="md">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] inline-block mr-1.5 animate-pulse" />
                  Live Stream Active
                </Badge>
              </div>

              {/* Subsystems Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subsystems.map((sub) => (
                  <Card key={sub.name} className="p-5 border border-[#E7E4DF] hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A]">
                        {sub.name}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        sub.status === 'Healthy'
                          ? 'bg-[#EBF7EE] text-[#2E7D32]'
                          : sub.status === 'Warning'
                          ? 'bg-[#FEF9E7] text-[#B7791F]'
                          : 'bg-[#FDF2F2] text-[#D9534F]'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {sub.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-center pt-2 border-t border-[#E7E4DF]">
                      <div className="p-2 rounded-xl bg-[#FAF8F2]">
                        <span className="text-[10px] text-[#8E8E93] block">Latency</span>
                        <span className="font-bold text-[#1A1A1A]">{sub.responseTime}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF8F2]">
                        <span className="text-[10px] text-[#8E8E93] block">Uptime</span>
                        <span className="font-bold text-[#2E7D32]">{sub.uptime}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF8F2]">
                        <span className="text-[10px] text-[#8E8E93] block">Errors</span>
                        <span className="font-bold text-[#1A1A1A]">{sub.errorCount}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Infrastructure Load Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                  <span className="text-xs font-bold text-[#8E8E93] uppercase">CPU Usage</span>
                  <div className="font-heading text-2xl font-extrabold text-[#1A1A1A] mt-1">28%</div>
                  <div className="w-full h-2 bg-[#E7E4DF] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#2E7D32]" style={{ width: '28%' }} />
                  </div>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-bold text-[#8E8E93] uppercase">RAM Memory</span>
                  <div className="font-heading text-2xl font-extrabold text-[#1A1A1A] mt-1">13.4 GB / 32 GB</div>
                  <div className="w-full h-2 bg-[#E7E4DF] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#2A5C8A]" style={{ width: '42%' }} />
                  </div>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-bold text-[#8E8E93] uppercase">Storage Capacity</span>
                  <div className="font-heading text-2xl font-extrabold text-[#1A1A1A] mt-1">320 GB / 500 GB</div>
                  <div className="w-full h-2 bg-[#E7E4DF] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#F0AD4E]" style={{ width: '64%' }} />
                  </div>
                </Card>

                <Card className="p-5">
                  <span className="text-xs font-bold text-[#8E8E93] uppercase">API Throughput</span>
                  <div className="font-heading text-2xl font-extrabold text-[#1A1A1A] mt-1">12.4k req/min</div>
                  <p className="text-xs text-[#2E7D32] font-semibold mt-1">Peak capacity headroom 85%</p>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== 4. CROSS-HOSTEL COMPARISON ==================== */}
          {activeRoute === '/superadmin/hostel-comparison' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF]">
                <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                  Cross-Hostel Performance Comparison
                </h1>
                <p className="font-body text-xs text-[#666666] mt-1">
                  Side-by-side benchmark analytics across all 7 hostel blocks: Vaigai, Cauvery, Thamirabarani, Bhavani, Palar, Amaravathi, and Pothigai.
                </p>
              </div>

              {/* Bar Chart Comparison */}
              <Card className="p-6">
                <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] mb-4">
                  Occupancy % vs Complaints Count
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hostelDataList}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DF" />
                      <XAxis dataKey="name" stroke="#666666" fontSize={11} />
                      <YAxis stroke="#666666" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="occupancyPct" name="Occupancy %" fill="#996E7D" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="complaints" name="Active Complaints" fill="#2A5C8A" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Detailed Comparison Table */}
              <Card className="p-6 overflow-hidden">
                <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] mb-4">
                  Comprehensive Hostel Metrics Matrix
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E4DF] text-[#8E8E93] uppercase tracking-wider font-heading sticky top-0 bg-white">
                        <th className="pb-3 font-bold">Hostel Block</th>
                        <th className="pb-3 font-bold">Gender</th>
                        <th className="pb-3 font-bold">Floors</th>
                        <th className="pb-3 font-bold">Warden</th>
                        <th className="pb-3 font-bold">Occupancy</th>
                        <th className="pb-3 font-bold">Complaints</th>
                        <th className="pb-3 font-bold">Avg Resolution Time</th>
                        <th className="pb-3 font-bold">SOS Count</th>
                        <th className="pb-3 font-bold">Visitors Today</th>
                        <th className="pb-3 font-bold">Maintenance Requests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4DF]">
                      {hostelDataList.map((h) => (
                        <tr key={h.name} className="hover:bg-[#FAF8F2]">
                          <td className="py-3 font-extrabold text-[#1A1A1A]">{h.name}</td>
                          <td className="py-3">
                            <Badge variant={h.gender === 'Girls' ? 'danger' : 'primary'} size="sm">{h.gender}</Badge>
                          </td>
                          <td className="py-3 text-[#666666]">{h.floors}</td>
                          <td className="py-3 text-[#666666]">{h.warden}</td>
                          <td className="py-3 font-bold text-[#996E7D]">
                            {h.occupied}/{h.capacity} ({h.occupancyPct}%)
                          </td>
                          <td className="py-3 font-bold text-[#1A1A1A]">{h.complaints}</td>
                          <td className="py-3 text-[#2E7D32] font-semibold">{h.avgResolutionHours} hrs</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold ${
                              h.sosCount > 0 ? 'bg-[#FDF2F2] text-[#D9534F]' : 'text-[#666666]'
                            }`}>
                              {h.sosCount}
                            </span>
                          </td>
                          <td className="py-3 text-[#1A1A1A]">{h.visitorCount}</td>
                          <td className="py-3 text-[#2A5C8A] font-bold">{h.maintenanceRequests}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 5. PERFORMANCE LEADERBOARD ==================== */}
          {activeRoute === '/superadmin/leaderboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF]">
                <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                  Enterprise Staff & Hostel Leaderboard
                </h1>
                <p className="font-body text-xs text-[#666666] mt-1">
                  Gamified performance ranking based on SLA resolution speed, resident feedback ratings, and operational responsiveness.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wardens */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E7E4DF]">
                    <Trophy className="w-5 h-5 text-[#D97706]" />
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                      Top Performing Wardens
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {leaderboardData.wardens.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] hover:border-[#996E7D]/50 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.medal}</span>
                          <div
                            className="w-10 h-10 rounded-full text-white font-extrabold text-xs flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: item.avatarColor }}
                          >
                            {item.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                          </div>
                          <div>
                            <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">{item.name}</h4>
                            <p className="text-[11px] text-[#666666]">{item.hostel}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-sm font-extrabold text-[#996E7D] block">{item.score}</span>
                          <span className="text-[10px] text-[#2E7D32] font-semibold">{item.trend} vs last mo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Maintenance Staff */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E7E4DF]">
                    <Wrench className="w-5 h-5 text-[#2E7D32]" />
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                      Fastest Maintenance Technicians
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {leaderboardData.maintenance.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] hover:border-[#2E7D32]/50 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.medal}</span>
                          <div
                            className="w-10 h-10 rounded-full text-white font-extrabold text-xs flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: item.avatarColor }}
                          >
                            {item.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                          </div>
                          <div>
                            <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">{item.name}</h4>
                            <p className="text-[11px] text-[#666666]">{item.role}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-sm font-extrabold text-[#2E7D32] block">{item.score}</span>
                          <span className="text-[10px] text-[#666666]">Avg: {item.resolutionTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Security Personnel */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E7E4DF]">
                    <ShieldAlert className="w-5 h-5 text-[#D9534F]" />
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                      Most Responsive Security Staff
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {leaderboardData.security.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] hover:border-[#D9534F]/50 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.medal}</span>
                          <div
                            className="w-10 h-10 rounded-full text-white font-extrabold text-xs flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: item.avatarColor }}
                          >
                            {item.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                          </div>
                          <div>
                            <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">{item.name}</h4>
                            <p className="text-[11px] text-[#666666]">{item.hostel}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-sm font-extrabold text-[#D9534F] block">{item.score}</span>
                          <span className="text-[10px] text-[#2E7D32] font-semibold">{item.trend} rating</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Highest Rated Hostel */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E7E4DF]">
                    <Building className="w-5 h-5 text-[#2A5C8A]" />
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                      Highest Rated Hostel Blocks
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {leaderboardData.hostels.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF] hover:border-[#2A5C8A]/50 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.medal}</span>
                          <div>
                            <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">{item.name}</h4>
                            <p className="text-[11px] text-[#666666]">{item.hostel}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-sm font-extrabold text-[#2A5C8A] block">{item.score}</span>
                          <span className="text-[10px] text-[#666666]">{item.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== 6. SYSTEM ALERT CENTER ==================== */}
          {activeRoute === '/superadmin/alerts' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    System Alert Center
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Real-time alert dispatch console for gateway latencies, SOS events, and resource limits.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setAlertPriorityFilter(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                        alertPriorityFilter === p
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white border-[#E7E4DF] text-[#666666] hover:bg-[#FAF8F2]'
                      }`}
                    >
                      {p} Priority
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert List */}
              <div className="space-y-4">
                {alertsList
                  .filter((a) => alertPriorityFilter === 'All' || a.priority === alertPriorityFilter)
                  .map((alert) => (
                    <Card key={alert.id} className="p-5 border border-[#E7E4DF] hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E4DF]">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            alert.priority === 'Critical'
                              ? 'bg-[#FDF2F2] text-[#D9534F] border border-[#D9534F]/30'
                              : alert.priority === 'High'
                              ? 'bg-[#FEF9E7] text-[#B7791F] border border-[#F0AD4E]/30'
                              : 'bg-[#EBF3FA] text-[#2A5C8A] border border-[#2A5C8A]/30'
                          }`}>
                            {alert.priority}
                          </span>
                          <div>
                            <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
                              {alert.title}
                              <span className="text-xs text-[#8E8E93] font-normal">({alert.service})</span>
                            </h3>
                          </div>
                        </div>

                        <span className="text-xs text-[#8E8E93]">{alert.time}</span>
                      </div>

                      <p className="font-body text-xs text-[#666666] mt-3 leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[#E7E4DF] mt-4">
                        <span className={`text-xs font-bold ${
                          alert.status === 'Resolved' ? 'text-[#2E7D32]' : 'text-[#D9534F]'
                        }`}>
                          Status: {alert.status}
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              showToast({ title: 'Alert Context', message: `Inspecting ${alert.id} telemetry logs.`, type: 'info' });
                            }}
                          >
                            View
                          </Button>
                          {alert.status !== 'Resolved' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Resolve Alert
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* ==================== 7. CAMPUS OVERVIEW ==================== */}
          {activeRoute === '/superadmin/campus' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF]">
                <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                  Campus Overview Panel
                </h1>
                <p className="font-body text-xs text-[#666666] mt-1">
                  Click any hostel card to inspect detailed warden roster, live occupant counts, and security gate status.
                </p>
              </div>

              {/* Hostels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostelDataList.map((h) => (
                  <Card
                    key={h.name}
                    onClick={() => setSelectedHostelPanel(h)}
                    className="p-6 border border-[#E7E4DF] hover:border-[#996E7D] hover:shadow-lg cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-[#996E7D]" />
                        <h3 className="font-heading text-lg font-extrabold text-[#1A1A1A]">
                          {h.name}
                        </h3>
                      </div>
                      <Badge variant="primary" size="sm">{h.occupancyPct}% Occupied</Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={h.gender === 'Girls' ? 'danger' : 'secondary'} size="sm">{h.gender}</Badge>
                      <span className="text-[11px] text-[#8E8E93] font-medium">{h.floors} Floors</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                      <div className="p-2.5 rounded-xl bg-[#FAF8F2]">
                        <span className="text-[#8E8E93] block">Active Complaints</span>
                        <span className="font-bold text-[#1A1A1A] text-sm">{h.complaints}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FAF8F2]">
                        <span className="text-[#8E8E93] block">Visitors Today</span>
                        <span className="font-bold text-[#2A5C8A] text-sm">{h.visitorCount}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FAF8F2]">
                        <span className="text-[#8E8E93] block">Active Maintenance</span>
                        <span className="font-bold text-[#2E7D32] text-sm">{h.maintenanceRequests}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FAF8F2]">
                        <span className="text-[#8E8E93] block">SOS Events</span>
                        <span className="font-bold text-[#D9534F] text-sm">{h.sosCount}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E7E4DF] flex items-center justify-between text-xs text-[#996E7D] font-bold group-hover:translate-x-1 transition-transform">
                      <span>Inspect Hostel Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Side Panel Slide-Over Modal */}
              {selectedHostelPanel && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl overflow-y-auto border-l border-[#E7E4DF] animate-slideUp space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DF]">
                      <div className="flex items-center gap-2">
                        <Building className="w-6 h-6 text-[#996E7D]" />
                        <h2 className="font-heading text-xl font-extrabold text-[#1A1A1A]">
                          {selectedHostelPanel.name}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedHostelPanel(null)}
                        className="p-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedHostelPanel.gender === 'Girls' ? 'danger' : 'secondary'} size="sm">
                          {selectedHostelPanel.gender}
                        </Badge>
                        <span className="text-[11px] text-[#8E8E93] font-medium">{selectedHostelPanel.floors} Floors</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F5EFF2] border border-[#996E7D]/20">
                        <span className="text-[#8E8E93] block">Assigned Chief Warden</span>
                        <span className="font-heading text-base font-extrabold text-[#1A1A1A] block mt-0.5">
                          {selectedHostelPanel.warden}
                        </span>
                        <span className="text-[#996E7D] font-medium block mt-1">+91 98401 11223</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                          <span className="text-[#8E8E93]">Rooms Occupied</span>
                          <span className="font-bold text-sm block mt-1 text-[#1A1A1A]">
                            {selectedHostelPanel.occupied} / {selectedHostelPanel.capacity}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF]">
                          <span className="text-[#8E8E93]">Pending Complaints</span>
                          <span className="font-bold text-sm block mt-1 text-[#D9534F]">
                            {selectedHostelPanel.complaints} Active
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-[#E7E4DF] space-y-2">
                        <h4 className="font-bold text-[#1A1A1A]">Security & Gate Status</h4>
                        <div className="flex items-center justify-between text-[#666666]">
                          <span>Gate Security Guard:</span>
                          <strong className="text-[#1A1A1A]">Suresh Kumar</strong>
                        </div>
                        <div className="flex items-center justify-between text-[#666666]">
                          <span>Active Visitors Checked-In:</span>
                          <strong className="text-[#2A5C8A]">{selectedHostelPanel.visitorCount}</strong>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E7E4DF]">
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => {
                            showToast({ title: 'Full Report Generated', message: `Hostel report for ${selectedHostelPanel.name} ready.`, type: 'success' });
                            setSelectedHostelPanel(null);
                          }}
                        >
                          Generate Full Block Inspection Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 8. ENTERPRISE ANALYTICS ==================== */}
          {activeRoute === '/superadmin/analytics' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF]">
                <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                  Enterprise BI & Predictive Analytics
                </h1>
                <p className="font-body text-xs text-[#666666] mt-1">
                  Predictive complaint forecasting, monthly occupancy curves, and visitor growth trends.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Occupancy Trend Area Chart */}
                <Card className="p-6">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] mb-4">
                    Monthly Occupancy Curve (%)
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.monthlyOccupancy}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DF" />
                        <XAxis dataKey="month" stroke="#666666" fontSize={11} />
                        <YAxis stroke="#666666" fontSize={11} domain={[70, 100]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="Vaigai" stroke="#996E7D" fill="#996E7D" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="Kaveri" stroke="#2A5C8A" fill="#2A5C8A" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Complaint Forecast Line Chart */}
                <Card className="p-6">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] mb-4">
                    Complaint Forecast vs Actuals
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.complaintForecast}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DF" />
                        <XAxis dataKey="week" stroke="#666666" fontSize={11} />
                        <YAxis stroke="#666666" fontSize={11} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Actual" stroke="#996E7D" strokeWidth={3} />
                        <Line type="monotone" dataKey="Forecast" stroke="#D97706" strokeDasharray="5 5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Visitor Growth Bar Chart */}
                <Card className="p-6">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] mb-4">
                    Daily Campus Visitor Traffic
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.visitorGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DF" />
                        <XAxis dataKey="day" stroke="#666666" fontSize={11} />
                        <YAxis stroke="#666666" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="Visitors" fill="#2A5C8A" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Role Distribution Pie Chart */}
                <Card className="p-6">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] mb-4">
                    Platform User Role Distribution
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.roleDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {analyticsData.roleDistribution.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== 9. AUDIT INSIGHTS ==================== */}
          {activeRoute === '/superadmin/audit' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    Audit Logs & System Insights
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Immutable security log trail covering logins, role escalations, QR scans, and policy updates.
                  </p>
                </div>

                <Button
                  variant="primary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={handleExportAuditCSV}
                >
                  Export Audit CSV
                </Button>
              </div>

              {/* Multi-Filter Controls */}
              <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <div>
                    <label className="font-bold text-[#1A1A1A] mr-2">Role:</label>
                    <select
                      value={auditRoleFilter}
                      onChange={(e) => setAuditRoleFilter(e.target.value)}
                      className="p-2 rounded-xl border border-[#E7E4DF] bg-white outline-none"
                    >
                      <option value="All">All Roles</option>
                      <option value="Resident">Resident</option>
                      <option value="Warden">Warden</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Security">Security</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] mr-2">Severity:</label>
                    <select
                      value={auditSeverityFilter}
                      onChange={(e) => setAuditSeverityFilter(e.target.value)}
                      className="p-2 rounded-xl border border-[#E7E4DF] bg-white outline-none"
                    >
                      <option value="All">All Severities</option>
                      <option value="Info">Info</option>
                      <option value="Success">Success</option>
                      <option value="Warning">Warning</option>
                    </select>
                  </div>
                </div>

                <span className="text-xs text-[#8E8E93] font-medium">
                  Showing {filteredAuditLogs.length} of {auditLogs.length} events
                </span>
              </Card>

              {/* Audit Table */}
              <Card className="p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E4DF] text-[#8E8E93] uppercase tracking-wider font-heading sticky top-0 bg-white">
                        <th className="pb-3 font-bold">Event ID</th>
                        <th className="pb-3 font-bold">Timestamp</th>
                        <th className="pb-3 font-bold">User Name</th>
                        <th className="pb-3 font-bold">Role</th>
                        <th className="pb-3 font-bold">Action Executed</th>
                        <th className="pb-3 font-bold">IP Address</th>
                        <th className="pb-3 font-bold text-right">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4DF]">
                      {filteredAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FAF8F2]">
                          <td className="py-3 font-mono font-bold text-[#1A1A1A]">{log.id}</td>
                          <td className="py-3 text-[#8E8E93]">{log.time}</td>
                          <td className="py-3 font-bold text-[#1A1A1A]">{log.user}</td>
                          <td className="py-3">
                            <Badge variant="secondary" size="sm">{log.role}</Badge>
                          </td>
                          <td className="py-3 text-[#666666] font-medium">{log.action}</td>
                          <td className="py-3 font-mono text-[#8E8E93]">{log.ip}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              log.severity === 'Success'
                                ? 'bg-[#EBF7EE] text-[#2E7D32]'
                                : log.severity === 'Warning'
                                ? 'bg-[#FEF9E7] text-[#B7791F]'
                                : 'bg-[#EBF3FA] text-[#2A5C8A]'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ==================== 10. SUPER ADMIN PROFILE ==================== */}
          {activeRoute === '/superadmin/profile' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    Super Administrator Profile
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Manage root identity parameters, authentication security, and administrative preferences.
                  </p>
                </div>

                <Badge variant="success" size="lg">
                  <span className="w-2 h-2 rounded-full bg-[#059669] inline-block mr-1.5 animate-pulse" />
                  Root Clearance Level 1
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Card: Profile Avatar & Identity */}
                <Card className="p-6 text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-[#2A5C8A] text-white font-extrabold text-3xl flex items-center justify-center mx-auto shadow-xl ring-4 ring-[#2A5C8A]/10">
                    SA
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-black text-[#1A1A1A]">{userName}</h2>
                    <p className="font-body text-xs text-[#2A5C8A] font-bold mt-0.5">Global Super Administrator</p>
                    <p className="font-body text-[11px] text-[#8E8E93]">Central Administration Console</p>
                  </div>

                  <div className="pt-4 border-t border-[#E7E4DF] space-y-2 text-left text-xs font-body">
                    <div className="flex justify-between py-1">
                      <span className="text-[#8E8E93] font-bold">Employee ID:</span>
                      <span className="font-mono font-extrabold text-[#1A1A1A]">SA-9001</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8E8E93] font-bold">Email:</span>
                      <span className="font-bold text-[#1A1A1A]">superadmin@vaigai.edu.in</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8E8E93] font-bold">Phone:</span>
                      <span className="font-bold text-[#1A1A1A]">+91 98765 43210</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8E8E93] font-bold">Primary Office:</span>
                      <span className="font-bold text-[#1A1A1A]">Central Wing, Room 101</span>
                    </div>
                  </div>
                </Card>

                {/* Right Details Grid: Security, Preferences & History */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Security & Access */}
                  <Card className="p-6 space-y-4">
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#2A5C8A]" />
                      Security & Multi-Factor Auth
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
                        <span className="text-[#8E8E93] font-bold block mb-1">Global 2FA Status</span>
                        <span className="font-bold text-[#059669] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Enabled & Active
                        </span>
                      </div>
                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
                        <span className="text-[#8E8E93] font-bold block mb-1">Last Authorized IP</span>
                        <span className="font-mono font-extrabold text-[#1A1A1A]">192.168.1.1 (Static)</span>
                      </div>
                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
                        <span className="text-[#8E8E93] font-bold block mb-1">Passkey Credential</span>
                        <span className="font-bold text-[#1A1A1A]">FIDO2 Hardware Key Bound</span>
                      </div>
                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
                        <span className="text-[#8E8E93] font-bold block mb-1">Session Inactivity Timeout</span>
                        <span className="font-bold text-[#1A1A1A]">30 Minutes</span>
                      </div>
                    </div>
                  </Card>

                  {/* Preferences & History */}
                  <Card className="p-6 space-y-4">
                    <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#996E7D]" />
                      Recent Administrator Actions
                    </h3>

                    <div className="space-y-3 text-xs font-body">
                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#1A1A1A]">Triggered Manual On-Demand Backup</p>
                          <p className="text-[10px] text-[#8E8E93]">Created snapshot BKP-1089 successfully</p>
                        </div>
                        <span className="text-[10px] text-[#8E8E93] font-mono">2 hours ago</span>
                      </div>

                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#1A1A1A]">Terminated Idle Session SES-905</p>
                          <p className="text-[10px] text-[#8E8E93]">Enforced active security policy on IT Support account</p>
                        </div>
                        <span className="text-[10px] text-[#8E8E93] font-mono">Yesterday</span>
                      </div>

                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#1A1A1A]">Enforced Global 2FA Policy</p>
                          <p className="text-[10px] text-[#8E8E93]">Applied mandatory 2FA on all Warden accounts</p>
                        </div>
                        <span className="text-[10px] text-[#8E8E93] font-mono">3 days ago</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 11. PLATFORM SETTINGS ==================== */}
          {activeRoute === '/superadmin/settings' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="pb-4 border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">
                    Platform Settings & Global Configurations
                  </h1>
                  <p className="font-body text-xs text-[#666666] mt-1">
                    Manage campus wide defaults, alert triggers, storage quotas, and integration parameters.
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={() => {
                    showToast({
                      title: 'Settings Saved',
                      message: 'Global platform configuration updated successfully.',
                      type: 'success',
                    });
                  }}
                >
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Campus Settings */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                    Campus Identity & Defaults
                  </h3>

                  <div className="space-y-3 text-xs font-body">
                    <div>
                      <label className="font-bold text-[#1A1A1A] block mb-1">Campus Name</label>
                      <input
                        type="text"
                        defaultValue="Project Vaigai - Central Campus"
                        className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-[#1A1A1A] outline-none font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#1A1A1A] block mb-1">Academic Year</label>
                        <input
                          type="text"
                          defaultValue="2026 – 2027"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-[#1A1A1A] outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[#1A1A1A] block mb-1">Active Blocks</label>
                        <input
                          type="text"
                          defaultValue="7 Hostels"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-[#1A1A1A] outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* System Maintenance & Limits */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                    System Maintenance & Quotas
                  </h3>

                  <div className="space-y-3 text-xs font-body">
                    <div className="flex items-center justify-between p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
                      <div>
                        <span className="font-bold text-[#1A1A1A] block">Automated Nightly Backups</span>
                        <span className="text-[10px] text-[#8E8E93]">Snapshot taken every night at 02:00 AM IST</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2A5C8A] cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
                      <div>
                        <span className="font-bold text-[#1A1A1A] block">Real-time Visitor Audit Trailing</span>
                        <span className="text-[10px] text-[#8E8E93]">Log every gate scan to cloud storage</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2A5C8A] cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
                      <div>
                        <span className="font-bold text-[#1A1A1A] block">Maintenance Mode</span>
                        <span className="text-[10px] text-[#8E8E93]">Temporarily restrict non-admin access</span>
                      </div>
                      <input type="checkbox" className="w-4 h-4 accent-[#D9534F] cursor-pointer" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Vaigai AI Helper Modal */}
      <VaigaiAiHelperModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onNavigateRoute={(r) => setActiveRoute(r)}
        userRole="SuperAdmin"
      />
    </div>
  );
};

export default SuperAdminDashboard;