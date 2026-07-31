import React, { useState, useEffect } from 'react';
import { 
  Building, ShieldCheck, QrCode, Users, Wrench, AlertTriangle, 
  CheckCircle2, ArrowRight, Sparkles, ChevronRight, Check, Shield, Eye
} from 'lucide-react';

export const InteractiveHeroVisual: React.FC = () => {
  // Active Hostel Block Selection
  const [selectedHostel, setSelectedHostel] = useState<string>('Vaigai');

  interface RoomData {
    number: string;
    status: 'normal' | 'maintenance' | 'complaint' | 'visitor';
    label: string;
    details: string;
    tech?: string;
  }

  // Room Tooltip Hover State
  const [hoveredRoom, setHoveredRoom] = useState<RoomData | null>({
    number: '203',
    status: 'complaint',
    label: 'Water Leakage',
    details: 'In Progress',
    tech: 'M. Selvam (Plumber)',
  });

  // QR Workflow Auto-Cycling Step
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 7);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Hostels Data
  const hostels = [
    { name: 'Vaigai', status: 'Healthy', badge: '🟢 Healthy', color: '#059669', bg: '#EBF7EE', occupied: '190/200' },
    { name: 'Kaveri', status: 'Maintenance', badge: '🟡 Maintenance', color: '#D97706', bg: '#FEF9E7', occupied: '158/180' },
    { name: 'Tamirabarani', status: 'Complaint', badge: '🔴 Active Complaint', color: '#D9534F', bg: '#FDF2F2', occupied: '202/220' },
    { name: 'Bhavani', status: 'Healthy', badge: '🟢 Healthy', color: '#059669', bg: '#EBF7EE', occupied: '144/160' },
    { name: 'Palar', status: 'Healthy', badge: '🟢 Healthy', color: '#059669', bg: '#EBF7EE', occupied: '170/200' },
  ];

  // Blueprint Rooms Data
  const floor2Rooms: RoomData[] = [
    { number: '201', status: 'normal', label: 'All Normal', details: 'No active tickets' },
    { number: '202', status: 'normal', label: 'All Normal', details: 'No active tickets' },
    { number: '203', status: 'complaint', label: 'Water Leakage', details: 'In Progress', tech: 'M. Selvam (Plumber)' },
    { number: '204', status: 'maintenance', label: 'Fan Regulator Repair', details: 'Assigned', tech: 'S. Kumar (Electrician)' },
    { number: '205', status: 'normal', label: 'All Normal', details: 'No active tickets' },
  ];

  const floor1Rooms: RoomData[] = [
    { number: '101', status: 'normal', label: 'All Normal', details: 'No active tickets' },
    { number: '102', status: 'normal', label: 'All Normal', details: 'No active tickets' },
    { number: '103', status: 'normal', label: 'All Normal', details: 'No active tickets' },
    { number: '104', status: 'normal', label: 'All Normal', details: 'No active tickets' },
    { number: '105', status: 'visitor', label: 'Parent Visit Expected', details: 'Pass PV-8910 Approved', tech: 'Gate A Security' },
  ];

  // QR Workflow Steps Data
  const workflowSteps = [
    { id: 0, title: 'Resident', icon: Users, desc: 'Logged In' },
    { id: 1, title: 'Registers Visitor', icon: Sparkles, desc: 'Form Submitted' },
    { id: 2, title: 'QR Pass Generated', icon: QrCode, desc: 'TOTP Pass Ready' },
    { id: 3, title: 'Security Scans QR', icon: ShieldCheck, desc: 'Gate Scan' },
    { id: 4, title: 'Entry Approved', icon: CheckCircle2, desc: 'Check-In Granted' },
    { id: 5, title: 'Visit Completed', icon: Building, desc: 'On Campus' },
    { id: 6, title: 'Exit Logged', icon: ArrowRight, desc: 'Out-Pass Verified' },
  ];

  return (
    <div className="w-full relative flex flex-col gap-5 select-none text-[#1A1A1A]">
      {/* Decorative Subtle Background Mesh & Floating Geometric Elements */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#996E7D]/10 via-[#2A5C8A]/5 to-[#059669]/5 rounded-[32px] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-2 right-4 w-3 h-3 rounded-full bg-[#059669]/30 animate-ping pointer-events-none" />
      <div className="absolute bottom-6 left-2 w-2 h-2 rounded-full bg-[#996E7D]/40 animate-pulse pointer-events-none" />

      {/* TOP SECTION: Campus Hostel Overview Floating Header */}
      <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-[24px] border border-[#E7E4DF] shadow-xl relative overflow-hidden transition-all">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#FAF8F2] text-[#996E7D] border border-[#E7E4DF]">
              <Building className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#1A1A1A] leading-none">
                Campus Hostel Overview
              </h3>
              <p className="font-body text-[11px] text-[#666666] mt-0.5">
                Live Hostel Operations
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-[#EBF7EE] text-[#059669] text-[10px] font-extrabold flex items-center gap-1.5 border border-[#059669]/20 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Live Sync
          </span>
        </div>

        {/* 5 Hostel Blocks Horizontal Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {hostels.map((h) => {
            const isSelected = selectedHostel === h.name;
            return (
              <button
                key={h.name}
                type="button"
                onClick={() => setSelectedHostel(h.name)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.03]'
                    : 'bg-[#FAF8F2] hover:bg-white text-[#1A1A1A] border-[#E7E4DF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading text-xs font-extrabold truncate">{h.name}</span>
                </div>
                <div className="text-[10px] font-semibold flex items-center gap-1 opacity-90">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: h.color }} />
                  <span className={isSelected ? 'text-gray-200' : ''}>{h.status}</span>
                </div>
                <div className={`text-[9px] mt-1 font-mono ${isSelected ? 'text-gray-400' : 'text-[#8E8E93]'}`}>
                  {h.occupied}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MIDDLE SECTION: Responsive Split Grid (Blueprint + QR Workflow) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* HOSTEL BLUEPRINT (Col 7 on Desktop) */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-[24px] border border-[#E7E4DF] shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#FAF8F2] text-[#2A5C8A]">
                  <Building className="w-4 h-4" />
                </span>
                <span className="font-heading text-xs sm:text-sm font-extrabold text-[#1A1A1A]">
                  {selectedHostel} Block Blueprint
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                Interactive Grid
              </span>
            </div>

            {/* Blueprint Grid Floors */}
            <div className="space-y-3">
              
              {/* Floor 2 */}
              <div className="p-2.5 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF]">
                <div className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Floor 2</span>
                  <span>5 Rooms</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {floor2Rooms.map((room) => {
                    const isHovered = hoveredRoom?.number === room.number;
                    let colorBg = 'bg-[#EBF7EE] text-[#059669] border-[#059669]/30';
                    let dotColor = '#059669';

                    if (room.status === 'maintenance') {
                      colorBg = 'bg-[#FEF9E7] text-[#D97706] border-[#D97706]/30';
                      dotColor = '#D97706';
                    } else if (room.status === 'complaint') {
                      colorBg = 'bg-[#FDF2F2] text-[#D9534F] border-[#D9534F]/30';
                      dotColor = '#D9534F';
                    } else if (room.status === 'visitor') {
                      colorBg = 'bg-[#EBF3FA] text-[#2A5C8A] border-[#2A5C8A]/30';
                      dotColor = '#2A5C8A';
                    }

                    return (
                      <button
                        key={room.number}
                        type="button"
                        onMouseEnter={() => setHoveredRoom(room)}
                        className={`p-2 rounded-xl border text-center font-mono font-extrabold text-xs transition-all duration-200 cursor-pointer relative ${colorBg} ${
                          isHovered ? 'scale-110 shadow-md ring-2 ring-offset-1 ring-[#1A1A1A] z-10' : 'hover:scale-105'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full absolute top-1 right-1 animate-ping" style={{ backgroundColor: dotColor }} />
                        <span>{room.number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Floor 1 */}
              <div className="p-2.5 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF]">
                <div className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Floor 1</span>
                  <span>5 Rooms</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {floor1Rooms.map((room) => {
                    const isHovered = hoveredRoom?.number === room.number;
                    let colorBg = 'bg-[#EBF7EE] text-[#059669] border-[#059669]/30';
                    let dotColor = '#059669';

                    if (room.status === 'visitor') {
                      colorBg = 'bg-[#EBF3FA] text-[#2A5C8A] border-[#2A5C8A]/30';
                      dotColor = '#2A5C8A';
                    }

                    return (
                      <button
                        key={room.number}
                        type="button"
                        onMouseEnter={() => setHoveredRoom(room)}
                        className={`p-2 rounded-xl border text-center font-mono font-extrabold text-xs transition-all duration-200 cursor-pointer relative ${colorBg} ${
                          isHovered ? 'scale-110 shadow-md ring-2 ring-offset-1 ring-[#1A1A1A] z-10' : 'hover:scale-105'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full absolute top-1 right-1 animate-ping" style={{ backgroundColor: dotColor }} />
                        <span>{room.number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Legend Row */}
            <div className="mt-3 pt-2.5 border-t border-[#E7E4DF] flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-[#666666]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#059669]" /> Normal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D97706]" /> Maintenance</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D9534F]" /> Complaint</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2A5C8A]" /> Visitor Expected</span>
            </div>
          </div>

          {/* Room Tooltip Panel Footer */}
          {hoveredRoom && (
            <div className="mt-3 p-2.5 rounded-xl bg-[#1A1A1A] text-white text-xs animate-fadeIn flex items-center justify-between gap-2">
              <div>
                <span className="font-heading font-extrabold text-[#996E7D]">
                  Room {hoveredRoom.number}
                </span>
                <span className="text-gray-300 ml-2 font-medium">
                  {hoveredRoom.label} ({hoveredRoom.details})
                </span>
              </div>
              {hoveredRoom.tech && (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-gray-300 shrink-0 font-mono">
                  {hoveredRoom.tech}
                </span>
              )}
            </div>
          )}
        </div>

        {/* QR ECOSYSTEM WORKFLOW (Col 5 on Desktop) */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-[24px] border border-[#E7E4DF] shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#FAF8F2] text-[#996E7D] border border-[#E7E4DF]">
                  <QrCode className="w-4 h-4" />
                </span>
                <h4 className="font-heading text-xs sm:text-sm font-extrabold text-[#1A1A1A]">
                  QR Visitor Ecosystem
                </h4>
              </div>
              <span className="text-[10px] font-extrabold text-[#2E7D32] bg-[#EBF7EE] px-2 py-0.5 rounded-full">
                Step {activeWorkflowStep + 1} of 7
              </span>
            </div>

            <p className="text-[11px] text-[#666666] mb-3 leading-relaxed">
              Automated visitor pass creation, instant gate QR scanning, and exit verification.
            </p>

            {/* Vertical Flowchart Steps */}
            <div className="space-y-1.5 relative">
              {workflowSteps.map((step, idx) => {
                const isActive = activeWorkflowStep === idx;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveWorkflowStep(idx)}
                    className={`w-full p-2 rounded-xl text-left transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.02]'
                        : 'bg-[#FAF8F2] hover:bg-white text-[#1A1A1A] border-[#E7E4DF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive ? 'bg-[#996E7D] text-white ring-2 ring-white/30' : 'bg-white text-[#1A1A1A] border border-[#E7E4DF]'
                      }`}>
                        <StepIcon className="w-3.5 h-3.5" />
                      </span>

                      <div className="min-w-0">
                        <div className="font-heading text-xs font-extrabold truncate">
                          {step.title}
                        </div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-gray-300' : 'text-[#666666]'}`}>
                          {step.desc}
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Live Status Panel Card */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2A5C8A] to-[#1A1A1A] text-white p-4 sm:p-5 rounded-[24px] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F4B400] shrink-0 border border-white/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-xs sm:text-sm font-extrabold">Campus Status</h4>
              <span className="px-2 py-0.5 rounded-full bg-[#059669] text-white text-[10px] font-bold">
                🟢 Operational
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              5 Hostel Blocks Connected • Zero Security Hazards
            </p>
          </div>
        </div>

        {/* Four Compact Count-Up Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <div className="font-heading text-base font-extrabold text-white">42</div>
            <div className="text-[9px] text-gray-300 uppercase tracking-wider font-bold">Visitors Today</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <div className="font-heading text-base font-extrabold text-[#F4B400]">12</div>
            <div className="text-[9px] text-gray-300 uppercase tracking-wider font-bold">Open Tickets</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <div className="font-heading text-base font-extrabold text-[#9EB8D2]">6</div>
            <div className="text-[9px] text-gray-300 uppercase tracking-wider font-bold">Active Maintenance</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <div className="font-heading text-base font-extrabold text-[#059669]">0</div>
            <div className="text-[9px] text-gray-300 uppercase tracking-wider font-bold">SOS Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeroVisual;
