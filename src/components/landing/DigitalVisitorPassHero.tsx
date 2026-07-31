import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Shield, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export const DigitalVisitorPassHero: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isActiveStatus, setIsActiveStatus] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Format today's date in a clean readable format (e.g. July 25, 2026)
  const todayDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const passId = 'PV-2026-1048';

  const handleCopyPassId = () => {
    navigator.clipboard.writeText(passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerToastFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // Render a crisp, Apple Wallet style 15x15 SVG QR Code module pattern
  const renderQrSvg = () => {
    const modules: boolean[][] = [
      [true, true, true, true, true, false, true, false, true, true, true, true, true, true, true],
      [true, false, false, false, true, false, true, true, false, true, false, false, false, false, true],
      [true, false, true, false, true, false, false, true, false, true, false, true, true, false, true],
      [true, false, true, false, true, false, true, false, true, true, false, true, true, false, true],
      [true, true, true, true, true, false, true, true, false, true, true, true, true, true, true],
      [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      [true, true, false, true, true, true, false, true, true, false, true, true, false, true, true],
      [false, true, true, false, true, false, true, false, true, true, false, true, true, true, false],
      [true, false, false, true, false, true, true, true, false, false, true, false, false, true, true],
      [false, false, false, false, false, false, true, false, true, false, false, false, false, false, false],
      [true, true, true, true, true, false, false, true, false, true, true, true, true, true, true],
      [true, false, false, false, true, false, true, true, true, false, true, false, false, false, true],
      [true, false, true, false, true, false, false, false, true, true, true, false, true, false, true],
      [true, false, false, false, true, false, true, false, false, false, true, false, false, false, true],
      [true, true, true, true, true, false, true, true, false, true, true, true, true, true, true],
    ];

    return (
      <svg className="w-full h-full text-[#1A1A1A]" viewBox="0 0 150 150" fill="currentColor">
        <rect width="150" height="150" fill="white" rx="12" />
        {modules.map((row, r) =>
          row.map((cell, c) => (
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c * 10}
                y={r * 10}
                width="10"
                height="10"
                rx="2"
                fill="#1A1A1A"
              />
            ) : null
          ))
        )}
        {/* Center Security Emblem Overlay */}
        <rect x="52" y="52" width="46" height="46" fill="white" rx="10" stroke="#E7E4DF" strokeWidth="2" />
        <rect x="56" y="56" width="38" height="38" fill="#1A1A1A" rx="8" />
        <text x="75" y="80" fontSize="13" fontWeight="900" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">
          PV
        </text>
      </svg>
    );
  };

  return (
    <div className="w-full relative flex items-center justify-center py-4 px-2 sm:px-6 select-none">
      
      {/* Toast Feedback Popup */}
      {actionFeedback && (
        <div className="absolute top-0 z-30 bg-[#1A1A1A] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl animate-fadeIn border border-white/20 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
          {actionFeedback}
        </div>
      )}

      {/* Background: Faint Abstract Circles & Minimal Geometric Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full border border-[#996E7D]/15 opacity-40 animate-pulse" />
        <div className="absolute w-[240px] sm:w-[320px] h-[240px] sm:h-[320px] rounded-full border border-[#2A5C8A]/15 opacity-30" />
        <div className="absolute w-[280px] h-[280px] bg-gradient-to-br from-[#996E7D]/10 to-[#2A5C8A]/10 rounded-full blur-3xl opacity-60" />
      </div>

      {/* FLOATING CHIP 1: Verified by Security */}
      <div className="absolute -top-2 right-2 sm:right-6 z-20 animate-float-chip1">
        <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-full border border-[#E7E4DF] shadow-lg flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#EBF7EE] text-[#059669] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
          <span className="font-body text-xs font-extrabold text-[#1A1A1A] whitespace-nowrap">
            Verified by Security
          </span>
        </div>
      </div>

      {/* FLOATING CHIP 2: Campus Secure Live */}
      <div className="absolute -bottom-3 left-2 sm:left-6 z-20 animate-float-chip2">
        <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-full border border-[#E7E4DF] shadow-lg flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2A5C8A]/10 text-[#2A5C8A] flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </span>
          <span className="font-body text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5 whitespace-nowrap">
            Campus Secure
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse inline-block" />
            <span className="text-[#059669] font-bold">Live</span>
          </span>
        </div>
      </div>

      {/* MAIN CONTAINER: Digital Visitor Pass Card */}
      <div className="w-full max-w-[390px] bg-white rounded-[28px] border border-[#E7E4DF] shadow-2xl relative z-10 overflow-hidden animate-float-pass hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
        
        {/* Pass Header */}
        <div className="p-5 pb-4 border-b border-[#F0EEEA] flex items-center justify-between">
          
          {/* Top Left: Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-xs">
              PV
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xs font-black tracking-wider uppercase text-[#1A1A1A]">
                  Project Vaigai
                </span>
                {/* 6. Pass Type Badge */}
                <span className="px-2 py-0.5 rounded-full bg-[#EBF3FA] text-[#2A5C8A] border border-[#2A5C8A]/20 text-[9px] font-extrabold uppercase">
                  Visitor Pass
                </span>
              </div>
              <div className="font-body text-[10px] text-[#8E8E93] font-semibold tracking-wide mt-0.5">
                Digital Identity Pass
              </div>
            </div>
          </div>

          {/* Top Right: Actions (Download & Share) + Status Badge */}
          <div className="flex items-center gap-2">
            {/* 2. Download Icon */}
            <button
              type="button"
              onClick={() => triggerToastFeedback('Downloading encrypted Pass PKPASS...')}
              title="Download Pass"
              className="p-1.5 rounded-lg border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] hover:scale-105 hover:rotate-6 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* 3. Share Icon */}
            <button
              type="button"
              onClick={() => triggerToastFeedback('Secure Pass link copied to clipboard')}
              title="Share Pass"
              className="p-1.5 rounded-lg border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] hover:scale-105 hover:-rotate-6 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Status Badge */}
            <div className="px-2.5 py-1 rounded-full bg-[#EBF7EE] border border-[#059669]/20 text-[#059669] font-heading text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              APPROVED
            </div>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-5 space-y-4">
          
          {/* CENTER VISUAL FOCUS: Large QR Code */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative p-3.5 bg-white rounded-2xl border border-[#E7E4DF] shadow-md w-44 h-44 flex items-center justify-center overflow-hidden group">
              {/* QR Pattern */}
              <div className="w-full h-full">
                {renderQrSvg()}
              </div>

              {/* Scanning Shimmer Effect */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2A5C8A] to-transparent shadow-[0_0_8px_#2A5C8A] animate-scan-shimmer pointer-events-none" />
            </div>

            {/* 5. Security Verification Indicator */}
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>Security Verified</span>
            </div>

            {/* 9. Tiny Scan Hint */}
            <p className="text-[11px] text-[#8E8E93] font-medium text-center mt-0.5">
              Present this QR at the hostel entrance.
            </p>

            {/* 1. Copy Pass ID Row */}
            <div className="mt-2 flex items-center gap-1.5 bg-[#FAF8F2] px-3 py-1 rounded-full border border-[#E7E4DF] relative">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E93]">
                Pass ID: <span className="text-[#1A1A1A] font-extrabold">{passId}</span>
              </span>

              <button
                type="button"
                onClick={handleCopyPassId}
                title="Copy Pass ID"
                className="p-1 rounded-md text-[#666666] hover:text-[#1A1A1A] hover:bg-white hover:scale-105 transition-all cursor-pointer ml-1"
              >
                {copied ? <Check className="w-3 h-3 text-[#059669]" /> : <Copy className="w-3 h-3" />}
              </button>

              {/* Copied Tooltip */}
              {copied && (
                <span className="absolute -top-7 right-0 bg-[#1A1A1A] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md animate-fadeIn">
                  Copied!
                </span>
              )}
            </div>
          </div>

          {/* PASS DETAILS GRID */}
          <div className="bg-[#FAF8F2] rounded-2xl p-4 border border-[#E7E4DF]/80 space-y-2.5">
            
            {/* Row 1: Visitor Name & Resident */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Visitor Name
                </span>
                <span className="font-heading font-extrabold text-[#1A1A1A] block mt-0.5 truncate">
                  Vaishnavi N
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Resident
                </span>
                <span className="font-heading font-extrabold text-[#1A1A1A] block mt-0.5 truncate">
                  Maha Gowri S
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-[#E7E4DF]/60" />

            {/* Row 2: Hostel (Badge) & Room */}
            <div className="grid grid-cols-2 gap-2 text-xs items-center">
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block mb-1">
                  Hostel
                </span>
                {/* 7. Hostel Badge */}
                <span className="bg-white border border-[#E7E4DF] px-2.5 py-0.5 rounded-md text-xs font-bold text-[#1A1A1A] inline-block shadow-2xs">
                  Vaigai Hostel
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Room
                </span>
                <span className="font-body font-bold text-[#1A1A1A] block mt-0.5">
                  A-204
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-[#E7E4DF]/60" />

            {/* Row 3: Purpose & Date */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Purpose
                </span>
                <span className="font-body font-bold text-[#1A1A1A] block mt-0.5">
                  Personal Visit
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Date
                </span>
                <span className="font-body font-bold text-[#1A1A1A] block mt-0.5">
                  {todayDate}
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-[#E7E4DF]/60" />

            {/* Row 4: Allowed Time Window */}
            <div className="text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Time Window
                </span>
                <span className="font-body font-bold text-[#2A5C8A] block mt-0.5">
                  2:00 PM – 4:00 PM
                </span>
              </div>

              {/* 4. Validity Countdown Badge */}
              <div className="text-right">
                <span className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-wider block">
                  Expires in
                </span>
                <span className="inline-flex items-center gap-1 bg-[#FEF9E7] text-[#D97706] border border-[#D97706]/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold mt-0.5">
                  <Clock className="w-3 h-3" /> 01h 38m
                </span>
              </div>
            </div>

          </div>

          {/* 10. Footer Separator & Small Text */}
          <div className="border-t border-[#E7E4DF]/60 pt-3 text-center">
            <span className="text-[10px] font-mono text-[#8E8E93] tracking-wider">
              Project Vaigai • Secure Digital Visitor Pass
            </span>
          </div>

        </div>

        {/* PASS FOOTER */}
        <div className="px-5 py-3 bg-[#1A1A1A] text-white flex items-center justify-between text-xs font-body">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span className="text-gray-300 text-[11px] font-medium">Valid Until:</span>
            <span className="font-heading font-extrabold text-sm text-[#F4B400] ml-1">4:00 PM</span>
          </div>

          {/* 8. Online Status Badge (Bottom Right) */}
          <button
            type="button"
            onClick={() => setIsActiveStatus(!isActiveStatus)}
            title="Click to toggle status"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-[10px] font-bold cursor-pointer border border-white/10"
          >
            <span className={`w-2 h-2 rounded-full ${isActiveStatus ? 'bg-[#059669] animate-pulse' : 'bg-gray-400'}`} />
            <span className={isActiveStatus ? 'text-[#059669]' : 'text-gray-400'}>
              {isActiveStatus ? '🟢 Active' : '⚪ Expired'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default DigitalVisitorPassHero;
