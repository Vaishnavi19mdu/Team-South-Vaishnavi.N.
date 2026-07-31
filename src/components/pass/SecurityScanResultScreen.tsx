import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  QrCode,
  LogOut,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { WorkPass, useWorkPass } from '../../context/WorkPassContext';
import { useToast } from '../../context/ToastContext';

interface SecurityScanResultScreenProps {
  pass?: WorkPass;
  onBack?: () => void;
}

export const SecurityScanResultScreen: React.FC<SecurityScanResultScreenProps> = ({
  pass: propPass,
  onBack,
}) => {
  const { passes, recordSecurityEntry, recordSecurityExit } = useWorkPass();
  const { showToast } = useToast();

  const activePass = propPass || passes[0];

  const [entryAllowed, setEntryAllowed] = useState<boolean | null>(
    activePass?.entryTime ? true : null
  );
  const [exitDone, setExitDone] = useState<boolean>(
    activePass?.status === 'COMPLETED' || !!activePass?.exitTime
  );

  if (!activePass) {
    return (
      <div className="p-8 text-center text-[#666666]">
        <ShieldAlert className="w-12 h-12 text-[#D9534F] mx-auto mb-2" />
        <h3 className="font-heading text-lg font-bold">No Active Work Pass Found</h3>
        <p className="text-xs">Scan or select a valid Maintenance Work Pass QR code.</p>
        {onBack && (
          <Button variant="secondary" size="sm" onClick={onBack} className="mt-4">
            Back to Dashboard
          </Button>
        )}
      </div>
    );
  }

  const isPassValid = activePass.status === 'ACTIVE' || activePass.status === 'EXTENDED';

  const handleAllowEntry = () => {
    recordSecurityEntry(activePass.id);
    setEntryAllowed(true);
    showToast({
      title: 'Security Clearance Approved ✅',
      message: `Entry granted to ${activePass.employeeName} (${activePass.role}) for ${activePass.room}.`,
      type: 'success',
    });
  };

  const handleDenyEntry = () => {
    setEntryAllowed(false);
    showToast({
      title: 'Entry Denied ⛔',
      message: `Security officer denied entry for ${activePass.employeeName}. Pass reported to Warden.`,
      type: 'error',
    });
  };

  const handleExitScan = () => {
    recordSecurityExit(activePass.id);
    setExitDone(true);
    showToast({
      title: 'Security Exit Recorded 🚪',
      message: `Technician exit logged at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Total duration: 1 hr 26 mins.`,
      type: 'info',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn p-4 sm:p-6">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-[#FAF8F2] hover:bg-[#F5EFF2] border border-[#E7E4DF] text-[#1A1A1A]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
              <span className="text-xs font-mono font-bold uppercase text-[#996E7D]">
                Hostel Gate Security System
              </span>
            </div>
            <h1 className="font-heading text-xl font-black text-[#1A1A1A] tracking-tight">
              Maintenance Work Pass Verification
            </h1>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#1A1A1A] text-white text-xs font-mono font-bold">
          GATE-01 MAIN
        </span>
      </div>

      {/* VERIFICATION CARD */}
      <Card className="p-6 space-y-6 border-2 border-[#E7E4DF] shadow-xl bg-white">
        {/* TOP STATUS ALERT */}
        {isPassValid ? (
          <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#2E7D32]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#2E7D32]">
                  Work Pass Verified & Valid
                </h3>
                <p className="text-xs text-[#2E7D32]/80 font-medium">
                  Authorised for Maintenance Access to {activePass.block} ({activePass.room})
                </p>
              </div>
            </div>

            <Badge variant="success" size="lg">
              {activePass.status}
            </Badge>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FFEBEE] border border-[#C62828]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C62828] text-white flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#C62828]">
                  Work Pass Inactive / Expired
                </h3>
                <p className="text-xs text-[#C62828]/80 font-medium">
                  Entry requires Warden extension approval. Do not permit entry.
                </p>
              </div>
            </div>

            <Badge variant="danger" size="lg">
              {activePass.status}
            </Badge>
          </div>
        )}

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-[#FAF8F2] border border-[#E7E4DF]">
          {/* LEFT: TECHNICIAN */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
              Technician Credentials
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#996E7D] text-white font-black text-base flex items-center justify-center">
                MK
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#1A1A1A]">
                  {activePass.employeeName}
                </h3>
                <p className="text-xs text-[#996E7D] font-bold">
                  {activePass.role} • ID: {activePass.employeeId}
                </p>
                <p className="text-[11px] text-[#666666]">{activePass.department}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: TASK ASSIGNMENT */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
              Assigned Complaint & Location
            </h4>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#996E7D] block">
                {activePass.complaintId} • Priority: {activePass.priority}
              </span>
              <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                {activePass.complaintTitle}
              </h4>
              <p className="text-xs text-[#555555]">
                Target Location: <strong className="text-[#1A1A1A]">{activePass.room}</strong> ({activePass.block})
              </p>
              <p className="text-[11px] text-[#8E8E93]">Resident: {activePass.residentName}</p>
            </div>
          </div>
        </div>

        {/* PASS TIMINGS & ENTRY LOG */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#E7E4DF]">
            <span className="text-[10px] text-[#8E8E93] uppercase block font-bold">Valid From</span>
            <strong className="text-[#1A1A1A] font-bold text-sm">{activePass.validFrom}</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E7E4DF]">
            <span className="text-[10px] text-[#8E8E93] uppercase block font-bold">Valid Until</span>
            <strong className="text-[#996E7D] font-bold text-sm">{activePass.validUntil}</strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E7E4DF]">
            <span className="text-[10px] text-[#8E8E93] uppercase block font-bold">Logged Entry</span>
            <strong className="text-[#2E7D32] font-bold text-sm">
              {activePass.entryTime || 'Not Logged'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E7E4DF]">
            <span className="text-[10px] text-[#8E8E93] uppercase block font-bold">Logged Exit</span>
            <strong className="text-[#1A1A1A] font-bold text-sm">
              {activePass.exitTime || 'In Building'}
            </strong>
          </div>
        </div>

        {/* ENTRY CLEARANCE ACTIONS */}
        <div className="space-y-3 pt-2 border-t border-[#E7E4DF]">
          <h4 className="font-heading text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            Security Clearance Decision
          </h4>

          {entryAllowed === null ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="danger"
                size="md"
                onClick={handleDenyEntry}
                leftIcon={<XCircle className="w-5 h-5" />}
                className="w-full justify-center"
              >
                Deny Entry
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleAllowEntry}
                disabled={!isPassValid}
                leftIcon={<CheckCircle2 className="w-5 h-5" />}
                className="w-full justify-center bg-[#2E7D32] hover:bg-[#236327] border-[#2E7D32]"
              >
                Allow Entry
              </Button>
            </div>
          ) : entryAllowed ? (
            <div className="p-4 rounded-xl bg-[#E8F5E9] border border-[#2E7D32]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#2E7D32] font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>ENTRY GRANTED at {activePass.entryTime || '11:02 AM'}</span>
              </div>

              {!exitDone ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExitScan}
                  leftIcon={<LogOut className="w-4 h-4 text-[#996E7D]" />}
                >
                  Record Security Exit Scan
                </Button>
              ) : (
                <Badge variant="success" size="md">
                  EXIT RECORDED ({activePass.exitTime || '12:28 PM'})
                </Badge>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#C62828]/30 flex items-center justify-between">
              <span className="text-[#C62828] font-bold text-xs flex items-center gap-2">
                <XCircle className="w-5 h-5" /> ENTRY DENIED — Gate Security Override
              </span>
              <Button variant="secondary" size="sm" onClick={() => setEntryAllowed(null)}>
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* EXIT SCAN SUMMARY DISPLAY */}
        {exitDone && (
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#996E7D]/30 space-y-2 text-xs">
            <h4 className="font-heading text-xs font-bold text-[#996E7D] uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Exit Audit Record Summary
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div>
                <span className="text-[#8E8E93] block">Entry Time</span>
                <strong className="text-[#1A1A1A]">{activePass.entryTime || '11:02 AM'}</strong>
              </div>
              <div>
                <span className="text-[#8E8E93] block">Exit Time</span>
                <strong className="text-[#1A1A1A]">{activePass.exitTime || '12:28 PM'}</strong>
              </div>
              <div>
                <span className="text-[#8E8E93] block">Total Duration</span>
                <strong className="text-[#2E7D32] font-bold">
                  {activePass.totalDuration || '1 Hour 26 Mins'}
                </strong>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SecurityScanResultScreen;
