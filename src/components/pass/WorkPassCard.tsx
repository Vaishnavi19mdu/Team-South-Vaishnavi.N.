import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Clock,
  User,
  Shield,
  Building,
  AlertTriangle,
  CheckCircle2,
  Download,
  Share2,
  Maximize2,
  RotateCcw,
  Upload,
  ChevronRight,
  Sparkles,
  FileText,
  Lock,
  X,
  Plus
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { WorkPass, useWorkPass } from '../../context/WorkPassContext';

interface WorkPassCardProps {
  pass: WorkPass;
  onOpenFullScreen?: () => void;
  onOpenTimeline?: () => void;
  onOpenSecurityScan?: () => void;
}

export const WorkPassCard: React.FC<WorkPassCardProps> = ({
  pass,
  onOpenFullScreen,
  onOpenTimeline,
  onOpenSecurityScan,
}) => {
  const { requestExtension } = useWorkPass();

  // Countdown calculation
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Extension Modal state
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionReason, setExtensionReason] = useState('');
  const [extensionDuration, setExtensionDuration] = useState('60');
  const [proofImage, setProofImage] = useState<string | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = pass.expiryTimestamp - Date.now();
      if (diff <= 0) {
        setTimeLeftStr('Expired');
        setIsExpired(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftStr(`${hours > 0 ? `${hours} hr ` : ''}${mins} mins`);
        setIsExpired(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 5000);
    return () => clearInterval(timer);
  }, [pass.expiryTimestamp]);

  const handleExtensionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extensionReason.trim()) return;

    requestExtension(
      pass.id,
      extensionReason,
      parseInt(extensionDuration, 10),
      proofImage || undefined
    );
    setShowExtensionModal(false);
    setExtensionReason('');
  };

  return (
    <Card className="p-0 overflow-hidden border-2 border-[#E7E4DF] hover:border-[#996E7D] transition-all shadow-md bg-white">
      {/* PASS HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2D2328] to-[#996E7D] p-4 text-white relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[#996E7D] bg-white">
              <Shield className="w-5 h-5 text-[#996E7D]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-white/70 block">
                Digital Pass System
              </span>
              <h3 className="font-heading text-sm font-black tracking-tight text-white">
                Maintenance Work Pass
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs font-bold text-white/90 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-md block">
              {pass.id}
            </span>
            <span className="text-[10px] text-white/60 block mt-1">Vaigai Portal</span>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            {pass.status === 'EXTENDED' ? (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/30 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> EXTENDED — Approved by Warden
              </span>
            ) : pass.status === 'ACTIVE' && !isExpired ? (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/30 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            ) : pass.status === 'COMPLETED' ? (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> WORK COMPLETED
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFEBEE] text-[#C62828] border border-[#C62828]/30 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> PASS EXPIRED
              </span>
            )}

            {pass.extensionStatus === 'Pending' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF9E7] text-[#B7791F] border border-[#B7791F]/30">
                Extension Pending Approval
              </span>
            )}
          </div>

          {/* TIMER DISPLAY */}
          <div className="flex items-center gap-1 text-xs font-bold text-white bg-black/30 px-2.5 py-1 rounded-lg backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-[#F0AD4E]" />
            <span>
              {isExpired || pass.status === 'EXPIRED'
                ? 'Expired'
                : `Expires in ${timeLeftStr}`}
            </span>
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="p-5 space-y-4">
        {/* QR CODE & DETAILS LAYOUT */}
        <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#FAF8F2] p-4 rounded-[16px] border border-[#E7E4DF]">
          {/* QR CODE BOX */}
          <div className="relative group shrink-0">
            <div
              className={`w-32 h-32 rounded-2xl bg-white p-2 border-2 flex flex-col items-center justify-center transition-all ${
                isExpired || pass.status === 'EXPIRED'
                  ? 'border-gray-300 opacity-40 grayscale'
                  : 'border-[#996E7D] shadow-inner'
              }`}
            >
              {/* SVG Styled Mock QR matrix */}
              <div className="w-full h-full relative flex items-center justify-center bg-gray-50 rounded-lg p-1.5 overflow-hidden">
                <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#996E7D] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#FAF8F2] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#FAF8F2] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#996E7D] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#996E7D] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#FAF8F2] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#FAF8F2] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#996E7D] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                  <div className="bg-[#1A1A1A] rounded-xs" />
                </div>
                {/* Center Badge Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-lg bg-[#996E7D] text-white flex items-center justify-center text-[10px] font-black border border-white shadow-xs">
                    V
                  </div>
                </div>
              </div>
            </div>

            {/* Expired Overlay */}
            {(isExpired || pass.status === 'EXPIRED') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs rounded-2xl text-white text-center p-2">
                <Lock className="w-6 h-6 text-[#D9534F] mb-1" />
                <span className="text-[10px] font-bold text-white uppercase">Pass Inactive</span>
              </div>
            )}
          </div>

          {/* PASS METADATA GRID */}
          <div className="flex-1 w-full space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E7E4DF]">
              <div>
                <span className="text-[10px] text-[#8E8E93] block">Technician Name</span>
                <strong className="text-[#1A1A1A] font-bold block">{pass.employeeName}</strong>
                <span className="text-[10px] text-[#996E7D] font-mono">{pass.employeeId} • {pass.role}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8E93] block">Department</span>
                <strong className="text-[#1A1A1A] font-bold block">{pass.department}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-[#8E8E93] block">Complaint Reference</span>
                <strong className="text-[#1A1A1A] font-bold block line-clamp-1">{pass.complaintTitle}</strong>
                <span className="text-[10px] font-mono text-[#666666]">{pass.complaintId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8E93] block">Location</span>
                <strong className="text-[#1A1A1A] font-bold block">{pass.room}</strong>
                <span className="text-[10px] text-[#666666]">{pass.block} ({pass.residentName})</span>
              </div>
            </div>
          </div>
        </div>

        {/* VALIDITY TIMINGS ROW */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F5EFF2]/60 border border-[#E7E4DF] text-center text-xs">
          <div>
            <span className="text-[10px] text-[#8E8E93] block uppercase font-bold">Valid From</span>
            <strong className="text-[#1A1A1A]">{pass.validFrom}</strong>
          </div>
          <div className="border-x border-[#E7E4DF]">
            <span className="text-[10px] text-[#8E8E93] block uppercase font-bold">Valid Until</span>
            <strong className="text-[#996E7D]">{pass.validUntil}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#8E8E93] block uppercase font-bold">Gate Status</span>
            <strong className="text-[#2E7D32]">
              {pass.entryTime ? `Entered (${pass.entryTime})` : 'Awaiting Entry'}
            </strong>
          </div>
        </div>

        {/* EXTENSION STATUS BANNER (IF ANY) */}
        {pass.extensionStatus === 'Pending' && (
          <div className="p-3 rounded-xl bg-[#FEF9E7] border border-[#F0AD4E]/40 text-xs space-y-1">
            <div className="flex items-center justify-between text-[#B7791F] font-bold">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Extension Request Submitted
              </span>
              <span>Waiting for Warden Approval</span>
            </div>
            <p className="text-[11px] text-[#555555]">
              Reason: "{pass.extensionReason}" (+{pass.requestedExtensionMinutes} mins requested)
            </p>
          </div>
        )}

        {pass.extensionStatus === 'Rejected' && (
          <div className="p-3 rounded-xl bg-[#FFEBEE] border border-[#C62828]/30 text-xs text-[#C62828] space-y-1">
            <span className="font-bold block">Extension Rejected — Access Denied</span>
            <p className="text-[11px] text-[#555555]">Reason: {pass.extensionRejectionReason}</p>
          </div>
        )}

        {/* INTERACTION BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSecurityScan}
            leftIcon={<QrCode className="w-3.5 h-3.5" />}
            className="text-[11px]"
          >
            Scan Gate QR
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenTimeline}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            className="text-[11px]"
          >
            Timeline
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExtensionModal(true)}
            disabled={pass.extensionStatus === 'Pending'}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-[11px]"
          >
            Request Extension
          </Button>

          <div className="flex items-center gap-1">
            <button
              disabled
              title="Download PDF (Disabled for security compliance)"
              className="p-2 rounded-xl bg-gray-100 text-gray-400 border border-gray-200 text-xs cursor-not-allowed flex-1 flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              disabled
              title="Share (Disabled for security compliance)"
              className="p-2 rounded-xl bg-gray-100 text-gray-400 border border-gray-200 text-xs cursor-not-allowed flex-1 flex items-center justify-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* EXTENSION REQUEST MODAL */}
      {showExtensionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 border border-[#E7E4DF] shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
                  Request Work Extension
                </h3>
                <p className="font-body text-xs text-[#666666]">
                  Pass ID: {pass.id} • {pass.room}
                </p>
              </div>
              <button
                onClick={() => setShowExtensionModal(false)}
                className="p-1 rounded-lg hover:bg-[#FAF8F2] text-[#666666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExtensionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">
                  Reason for Extension <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  placeholder="e.g. Additional circuit wiring isolation required, awaiting replacement gasket drying..."
                  required
                  className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] focus:bg-white text-xs min-h-[90px]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">
                  Additional Time Required
                </label>
                <select
                  value={extensionDuration}
                  onChange={(e) => setExtensionDuration(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-xs font-semibold"
                >
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="120">2 Hours</option>
                  <option value="180">Custom (3 Hours)</option>
                </select>
              </div>

              {/* Upload Proof */}
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">
                  Upload Proof (Photo of issue/part required)
                </label>
                <div
                  onClick={() =>
                    setProofImage(
                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80'
                    )
                  }
                  className="p-3 rounded-xl border-2 border-dashed border-[#996E7D]/40 bg-[#F5EFF2] text-center cursor-pointer hover:bg-[#F5EFF2]/80 transition-colors"
                >
                  <Upload className="w-5 h-5 text-[#996E7D] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#996E7D]">
                    {proofImage ? 'Photo Attached ✅ (Click to change)' : 'Click to attach photo evidence'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E7E4DF]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowExtensionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WorkPassCard;
