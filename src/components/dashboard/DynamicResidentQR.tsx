import React, { useState, useEffect } from 'react';
import { 
  QrCode, ShieldCheck, RefreshCw, Clock, ArrowRightLeft, CheckCircle2, 
  AlertCircle, Download, Smartphone, Lock, Sparkles, Check, ChevronRight
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

export interface DynamicResidentQRProps {
  residentName?: string;
  rollNumber?: string;
  roomNumber?: string;
  hostelBlock?: string;
}

export const DynamicResidentQR: React.FC<DynamicResidentQRProps> = ({
  residentName = 'Vaishnavi S.',
  rollNumber = '21CS094',
  roomNumber = '204',
  hostelBlock = 'Vaigai Block A',
}) => {
  const { showToast } = useToast();

  const [passMode, setPassMode] = useState<'entry' | 'exit'>('entry');
  const [campusStatus, setCampusStatus] = useState<'inside' | 'outside'>('inside');
  const [timer, setTimer] = useState(30);
  const [isScanning, setIsScanning] = useState(false);
  const [tokenHash, setTokenHash] = useState('PV-GATE-8910-AX92');
  const [lastScannedTime, setLastScannedTime] = useState<string | null>('Today, 08:30 AM');

  // Rotate QR code token every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          generateNewHash();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateNewHash = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randStr = '';
    for (let i = 0; i < 4; i++) {
      randStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newHash = `PV-GATE-${Math.floor(1000 + Math.random() * 9000)}-${randStr}`;
    setTokenHash(newHash);
  };

  const handleManualRefresh = () => {
    generateNewHash();
    setTimer(30);
    showToast({
      title: 'Security Token Refreshed',
      message: 'Generated a new dynamic anti-spoofing QR code hash.',
      type: 'info',
    });
  };

  const handleSimulateGateScan = () => {
    setIsScanning(true);
    showToast({
      title: 'Scanning at Security Gate...',
      message: 'Verifying digital signature with Main Gate Scanner...',
      type: 'info',
    });

    setTimeout(() => {
      setIsScanning(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastScannedTime(`Today, ${now}`);

      if (passMode === 'exit') {
        setCampusStatus('outside');
        showToast({
          title: '✅ Exit Scan Approved',
          message: `${residentName} logged as Checked-Out at Main Gate A. Return curfew: 09:30 PM.`,
          type: 'success',
        });
      } else {
        setCampusStatus('inside');
        showToast({
          title: '✅ Entry Scan Approved',
          message: `${residentName} verified and Checked-In to ${hostelBlock} ${roomNumber}.`,
          type: 'success',
        });
      }
    }, 1800);
  };

  // Helper to draw a procedural SVG QR Code pattern based on tokenHash
  const renderSvgQrPattern = (hash: string) => {
    // Generate a 15x15 grid of modules based on hash char codes
    const size = 15;
    const modules: boolean[][] = [];
    let hashIdx = 0;

    for (let r = 0; r < size; r++) {
      modules[r] = [];
      for (let c = 0; c < size; c++) {
        // Corner finder patterns (7x7)
        const isTopLeft = r < 5 && c < 5;
        const isTopRight = r < 5 && c >= size - 5;
        const isBottomLeft = r >= size - 5 && c < 5;

        if (isTopLeft || isTopRight || isBottomLeft) {
          // Standard QR alignment box logic
          const rLocal = isTopLeft ? r : isTopRight ? r : r - (size - 5);
          const cLocal = isTopLeft ? c : isTopRight ? c - (size - 5) : c;
          if (rLocal === 0 || rLocal === 4 || cLocal === 0 || cLocal === 4) {
            modules[r][c] = true;
          } else if (rLocal >= 1 && rLocal <= 3 && cLocal >= 1 && cLocal <= 3) {
            modules[r][c] = rLocal === 2 && cLocal === 2;
          } else {
            modules[r][c] = false;
          }
        } else {
          // Pseudo-random modules driven by hash string
          const charCode = hash.charCodeAt(hashIdx % hash.length);
          modules[r][c] = (r * 7 + c * 13 + charCode + timer) % 3 !== 0;
          hashIdx++;
        }
      }
    }

    return (
      <svg className="w-full h-full text-[#1A1A1A]" viewBox="0 0 150 150" fill="currentColor">
        <rect width="150" height="150" fill="white" rx="8" />
        {modules.map((row, r) =>
          row.map((cell, c) => (
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c * 10}
                y={r * 10}
                width="10"
                height="10"
                rx="1.5"
                fill="#1A1A1A"
              />
            ) : null
          ))
        )}
        {/* Center Security Emblem Overlay */}
        <rect x="55" y="55" width="40" height="40" fill="white" rx="8" stroke="#E7E4DF" strokeWidth="2" />
        <text x="75" y="79" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#996E7D" fontFamily="sans-serif">
          PV
        </text>
      </svg>
    );
  };

  return (
    <Card className="p-6 border border-[#E7E4DF] shadow-sm relative overflow-hidden bg-white">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#996E7D]/10 via-[#2A5C8A]/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header / Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E4DF] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#FAF8F2] text-[#996E7D] border border-[#E7E4DF]">
              <QrCode className="w-5 h-5" />
            </span>
            <h2 className="font-heading text-lg font-extrabold text-[#1A1A1A]">
              Dynamic Gate Pass QR
            </h2>
            <Badge variant="primary" size="sm">Anti-Spoof TOTP</Badge>
          </div>
          <p className="font-body text-xs text-[#666666]">
            Present this dynamic digital pass at hostel gates for instant contactless entry & exit logging.
          </p>
        </div>

        {/* Campus Live Status */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-[#666666]">Campus Status:</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
            campusStatus === 'inside'
              ? 'bg-[#EBF7EE] text-[#2E7D32] border border-[#2E7D32]/20'
              : 'bg-[#FEF9E7] text-[#B7791F] border border-[#B7791F]/20'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {campusStatus === 'inside' ? 'Inside Hostel' : 'Out of Campus'}
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="mt-5 grid grid-cols-2 gap-2 p-1 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF]">
        <button
          type="button"
          onClick={() => setPassMode('entry')}
          className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            passMode === 'entry'
              ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#E7E4DF]'
              : 'text-[#666666] hover:text-[#1A1A1A]'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#2E7D32]" />
          Entry Check-In Pass
        </button>

        <button
          type="button"
          onClick={() => setPassMode('exit')}
          className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            passMode === 'exit'
              ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#E7E4DF]'
              : 'text-[#666666] hover:text-[#1A1A1A]'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#D9534F]" />
          Exit Out-Pass
        </button>
      </div>

      {/* Main QR Card Content Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: QR Code Display Frame */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative p-4 bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-md w-56 h-56 flex items-center justify-center group overflow-hidden">
            {/* Rendered SVG QR code */}
            <div className="w-full h-full">
              {renderSvgQrPattern(tokenHash)}
            </div>

            {/* Laser Scan Animation Line when testing */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent shadow-[0_0_12px_#2E7D32] animate-bounce top-1/2" />
            )}

            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-[#2E7D32] font-heading text-xs font-bold gap-2">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Verifying Gate Scanner...</span>
              </div>
            )}
          </div>

          {/* Dynamic Token Refresh Timer Bar */}
          <div className="w-56 mt-3 flex items-center justify-between text-[11px] font-bold text-[#666666]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#996E7D]" />
              Refreshes in {timer}s
            </span>

            <button
              type="button"
              onClick={handleManualRefresh}
              className="text-[#2A5C8A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Refresh Now
            </button>
          </div>

          {/* Progress bar line */}
          <div className="w-56 h-1 bg-[#E7E4DF] rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-[#996E7D] transition-all duration-1000 ease-linear"
              style={{ width: `${(timer / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Column: Resident & Security Pass Meta */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E7E4DF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#8E8E93]">Resident Details</span>
              <span className="text-xs font-bold text-[#2A5C8A] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" /> Verified Identity
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#666666] block text-[11px]">Resident Name</span>
                <span className="font-extrabold text-[#1A1A1A] block">{residentName}</span>
              </div>
              <div>
                <span className="text-[#666666] block text-[11px]">Roll Number</span>
                <span className="font-extrabold text-[#1A1A1A] block">{rollNumber}</span>
              </div>
              <div>
                <span className="text-[#666666] block text-[11px]">Hostel & Room</span>
                <span className="font-extrabold text-[#1A1A1A] block">{hostelBlock} • {roomNumber}</span>
              </div>
              <div>
                <span className="text-[#666666] block text-[11px]">Security Hash</span>
                <span className="font-mono font-bold text-[#996E7D] text-[10px] block truncate">{tokenHash}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E7E4DF] flex items-center justify-between text-[11px] text-[#666666]">
              <span>Last Gate Activity: <strong className="text-[#1A1A1A]">{lastScannedTime}</strong></span>
              <span className="font-semibold text-[#2E7D32]">Gate Gatekeeper Active</span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Smartphone className="w-4 h-4" />}
              onClick={handleSimulateGateScan}
              disabled={isScanning}
              className="w-full sm:w-auto flex-1 shadow-sm"
            >
              Simulate Gate Scanner
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => {
                showToast({
                  title: 'Offline Pass Saved',
                  message: 'Encrypted QR token saved for offline wallet scanning.',
                  type: 'success',
                });
              }}
              className="w-full sm:w-auto"
            >
              Download Offline Pass
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DynamicResidentQR;
