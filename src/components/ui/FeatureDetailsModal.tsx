import React from 'react';
import { 
  X, ChevronRight, User, Camera, Sparkles, Shield, Wrench, CheckCircle2,
  UserPlus, Bell, ShieldCheck, QrCode, ScanLine, ClipboardCheck,
  AlertTriangle, MapPin, BellRing, ShieldAlert, Send, Cpu, Layers,
  FolderGit2, ArrowUpRight, WifiOff, Save, HardDrive, Wifi, RefreshCw,
  Database, FileBarChart, BarChart3, TrendingUp, FileCheck2
} from 'lucide-react';
import Badge from '../common/Badge';

export type FeatureKey = 
  | 'smart-complaint'
  | 'qr-visitor'
  | 'emergency-sos'
  | 'ai-assistance'
  | 'offline-sync'
  | 'analytics';

interface FeatureDetailsModalProps {
  featureKey: FeatureKey | null;
  onClose: () => void;
}

interface WorkflowItem {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface FeatureConfig {
  title: string;
  badge: string;
  desc: string;
  accentColor: string;
  isAi?: boolean;
  steps: WorkflowItem[];
}

const FEATURE_DATA: Record<FeatureKey, FeatureConfig> = {
  'smart-complaint': {
    title: 'SMART COMPLAINT MANAGEMENT',
    badge: 'Core Operations',
    desc: 'End-to-end digital complaint tracking with instant photo uploads, room mapping, and automated warden work-order dispatch.',
    accentColor: '#996E7D',
    steps: [
      { step: '01', title: 'Resident', desc: 'Selects category & room location', icon: <User className="w-5 h-5 text-[#996E7D]" /> },
      { step: '02', title: 'Capture Issue', desc: 'Inputs ticket subject & description', icon: <Camera className="w-5 h-5 text-[#996E7D]" /> },
      { step: '03', title: 'Upload Photos', desc: 'Attaches physical evidence photo', icon: <Save className="w-5 h-5 text-[#996E7D]" /> },
      { step: '04', title: 'AI Categorization', desc: 'Gemini AI tags priority & department', icon: <Sparkles className="w-5 h-5 text-[#A73FD3]" /> },
      { step: '05', title: 'Warden Approval', desc: 'Hostel warden verifies work order', icon: <Shield className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '06', title: 'Maintenance Assigned', desc: 'Technician dispatches for repair', icon: <Wrench className="w-5 h-5 text-[#D97706]" /> },
      { step: '07', title: 'Resolved', desc: 'Resident verifies fix & closes ticket', icon: <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" /> },
    ],
  },
  'qr-visitor': {
    title: 'QR VISITOR MANAGEMENT',
    badge: 'Gate Security',
    desc: 'Contactless guest registration replacing physical paper registers with instant host authorization & encrypted QR entry passes.',
    accentColor: '#2A5C8A',
    steps: [
      { step: '01', title: 'Guest Registration', desc: 'Visitor fills pre-registration link', icon: <UserPlus className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '02', title: 'Resident Approval', desc: 'Host student receives mobile prompt', icon: <Bell className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '03', title: 'Warden Verification', desc: 'Curfew & safety check clearance', icon: <ShieldCheck className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '04', title: 'QR Generated', desc: 'Encrypted single-use visitor pass', icon: <QrCode className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '05', title: 'Security Scan', desc: 'Gate camera validates pass code', icon: <ScanLine className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '06', title: 'Entry Recorded', desc: 'Digital timestamp logged permanently', icon: <ClipboardCheck className="w-5 h-5 text-[#4CAF50]" /> },
    ],
  },
  'emergency-sos': {
    title: 'EMERGENCY SOS BROADCAST',
    badge: '24/7 Safety System',
    desc: 'High-priority distress activation that overrides silent modes and sends immediate live room coordinates to security teams.',
    accentColor: '#D9534F',
    steps: [
      { step: '01', title: 'Resident', desc: 'Student faces distress or medical emergency', icon: <User className="w-5 h-5 text-[#D9534F]" /> },
      { step: '02', title: 'One Tap SOS', desc: 'Holds 3-second emergency safety button', icon: <AlertTriangle className="w-5 h-5 text-[#D9534F]" /> },
      { step: '03', title: 'GPS Captured', desc: 'Pinpoints exact block & room number', icon: <MapPin className="w-5 h-5 text-[#D9534F]" /> },
      { step: '04', title: 'Wardens Alerted', desc: 'High-pitch alert dispatched to wardens', icon: <BellRing className="w-5 h-5 text-[#D9534F]" /> },
      { step: '05', title: 'Security Notified', desc: 'Main gate guard dispatches team', icon: <ShieldAlert className="w-5 h-5 text-[#D9534F]" /> },
      { step: '06', title: 'Emergency Resolved', desc: 'On-site medical/security support given', icon: <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" /> },
    ],
  },
  'ai-assistance': {
    title: 'AI ASSISTANCE & AUTOMATION',
    badge: 'Gemini AI Engine',
    desc: 'Smart intelligence engine powered by Gemini AI that eliminates duplicate complaints and assigns priority levels automatically.',
    accentColor: '#A73FD3',
    isAi: true,
    steps: [
      { step: '01', title: 'Complaint Submitted', desc: 'Resident logs text or audio report', icon: <Send className="w-5 h-5 text-[#A73FD3]" /> },
      { step: '02', title: 'AI Reads Complaint', desc: 'Gemini NLP parses urgency keywords', icon: <Cpu className="w-5 h-5 text-[#A73FD3]" /> },
      { step: '03', title: 'Detect Duplicate', desc: 'Groups matching issues in same block', icon: <Layers className="w-5 h-5 text-[#A73FD3]" /> },
      { step: '04', title: 'Assign Department', desc: 'Routes directly to Plumbing/Electrical', icon: <FolderGit2 className="w-5 h-5 text-[#A73FD3]" /> },
      { step: '05', title: 'Priority Generated', desc: 'Calculates priority based on safety impact', icon: <ArrowUpRight className="w-5 h-5 text-[#A73FD3]" /> },
      { step: '06', title: 'Ready for Warden', desc: 'Pre-sorted ticket queue ready for approval', icon: <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" /> },
    ],
  },
  'offline-sync': {
    title: 'OFFLINE SYNCHRONIZATION',
    badge: 'Offline Resilience',
    desc: 'Local-first architecture that stores pending complaints and gate logs in browser storage during campus Wi-Fi network outages.',
    accentColor: '#9EB8D2',
    steps: [
      { step: '01', title: 'No Internet', desc: 'Hostel Wi-Fi or cellular network drops', icon: <WifiOff className="w-5 h-5 text-[#9EB8D2]" /> },
      { step: '02', title: 'Complaint Saved', desc: 'Ticket captured with local timestamp', icon: <Save className="w-5 h-5 text-[#9EB8D2]" /> },
      { step: '03', title: 'Local Storage', desc: 'Stored safely in device IndexedDB', icon: <HardDrive className="w-5 h-5 text-[#9EB8D2]" /> },
      { step: '04', title: 'Connection Restored', desc: 'App detects active network ping', icon: <Wifi className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '05', title: 'Auto Sync', desc: 'Background queue pushes pending payloads', icon: <RefreshCw className="w-5 h-5 text-[#2A5C8A]" /> },
      { step: '06', title: 'Database Updated', desc: 'Firestore cloud state fully synchronized', icon: <Database className="w-5 h-5 text-[#4CAF50]" /> },
    ],
  },
  'analytics': {
    title: 'ANALYTICS DASHBOARD',
    badge: 'Campus Intelligence',
    desc: 'Real-time performance metrics tracking resolution turnaround speeds, recurring maintenance issues, and warden SLAs.',
    accentColor: '#F4B400',
    steps: [
      { step: '01', title: 'Complaints Collected', desc: 'Gathers ticket timestamps across blocks', icon: <FileBarChart className="w-5 h-5 text-[#D97706]" /> },
      { step: '02', title: 'Data Processed', desc: 'AI calculates resolution turnarounds', icon: <Cpu className="w-5 h-5 text-[#D97706]" /> },
      { step: '03', title: 'Charts Generated', desc: 'Visual graphs by department & floor', icon: <BarChart3 className="w-5 h-5 text-[#D97706]" /> },
      { step: '04', title: 'Performance Metrics', desc: 'Measures SLA completion rates', icon: <TrendingUp className="w-5 h-5 text-[#D97706]" /> },
      { step: '05', title: 'Monthly Reports', desc: 'Executive summaries for college management', icon: <FileCheck2 className="w-5 h-5 text-[#4CAF50]" /> },
    ],
  },
};

export const FeatureDetailsModal: React.FC<FeatureDetailsModalProps> = ({
  featureKey,
  onClose,
}) => {
  if (!featureKey) return null;

  const data = FEATURE_DATA[featureKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1A1A]/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white border border-[#E7E4DF] rounded-[24px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slideUp p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between pb-6 border-b border-[#E7E4DF] mb-6">
          <div>
            <Badge variant={data.isAi ? 'ai' : 'primary'} size="sm" className="mb-2">
              {data.badge}
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              {data.title}
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#666666] mt-1.5 max-w-2xl leading-relaxed">
              {data.desc}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#FAF8F2] hover:bg-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] transition-colors shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Title */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#996E7D]">
            Visual Execution Workflow ({data.steps.length} Steps)
          </h3>
          <span className="text-xs text-[#8E8E93]">End-to-End Traceability</span>
        </div>

        {/* Workflow Connected Diagram */}
        <div className="bg-[#FAF8F2] p-4 sm:p-6 rounded-[20px] border border-[#E7E4DF]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
            {data.steps.map((item, idx) => {
              const isLast = idx === data.steps.length - 1;
              return (
                <div key={idx} className="relative">
                  <div className={`p-4 rounded-[16px] bg-white border border-[#E7E4DF] shadow-xs flex flex-col justify-between h-full hover:border-[${data.accentColor}] transition-all hover:shadow-md group`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-full bg-[#FAF8F2] text-[#1A1A1A] font-bold text-xs flex items-center justify-center border border-[#E7E4DF]">
                        {item.step}
                      </span>
                      <div className="p-2 rounded-xl bg-[#FAF8F2] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#1A1A1A] mb-1 group-hover:text-[#996E7D] transition-colors">
                        {item.title}
                      </h4>
                      <p className="font-body text-xs text-[#666666] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {!isLast && (
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                        <span>Next</span>
                        <ChevronRight className="w-3 h-3 text-[#996E7D] animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-4 border-t border-[#E7E4DF] flex items-center justify-between flex-wrap gap-4">
          <p className="font-body text-xs text-[#8E8E93]">
            Powered by Project Vaigai High-Speed Campus Cloud Network
          </p>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#996E7D] hover:bg-[#855B69] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg"
          >
            Close Feature Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailsModal;
