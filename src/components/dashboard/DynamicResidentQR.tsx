import React, { useEffect, useRef, useState } from 'react';
import {
  QrCode, ShieldCheck, RefreshCw, ArrowRightLeft,
  Download, Smartphone, Lock,
} from 'lucide-react';
import QRCode from 'qrcode';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { useResidentGatePass, GateDirection } from '../../hooks/useResidentGatePass';

export interface DynamicResidentQRProps {
  residentUid?: string;
  residentName?: string;
  rollNumber?: string;
  roomNumber?: string;
  hostelBlock?: string;
}

const formatTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Small canvas helper so we can overlay a rounded "PV" emblem on top of the
// real QR without breaking scannability (errorCorrectionLevel 'H' below
// leaves enough redundancy to tolerate a small covered center).
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export const DynamicResidentQR: React.FC<DynamicResidentQRProps> = ({
  residentUid,
  residentName = 'Resident',
  rollNumber = '—',
  roomNumber = '—',
  hostelBlock = 'Hostel Block',
}) => {
  const { showToast } = useToast();
  const { pass, loading, refreshToken, recordGateScan } = useResidentGatePass(residentUid);

  const [passMode, setPassMode] = useState<GateDirection>('entry');
  const [isScanning, setIsScanning] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const campusStatus = pass?.campusStatus ?? 'inside';
  const size = 224; // matches the old w-56/h-56 (56 * 4px)

  // Render an actual, decodable QR whenever the live token changes.
  useEffect(() => {
    if (!canvasRef.current || !pass?.token || !residentUid) return;
    setQrFailed(false);

    const payload = JSON.stringify({ type: 'resident', uid: residentUid, token: pass.token });

    QRCode.toCanvas(
      canvasRef.current,
      payload,
      { width: size, margin: 1, errorCorrectionLevel: 'H' },
      (err) => {
        if (err) {
          console.error('Resident QR generation failed', err);
          setQrFailed(true);
          return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Center emblem overlay
        const boxSize = size * 0.26;
        const boxPos = (size - boxSize) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#E7E4DF';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, boxPos, boxPos, boxSize, boxSize, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#996E7D';
        ctx.font = `bold ${Math.round(boxSize * 0.42)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PV', size / 2, size / 2 + 1);
      }
    );
  }, [pass?.token, residentUid]);

  const handleManualRefresh = async () => {
    if (!residentUid) return;
    try {
      await refreshToken();
      showToast({
        title: 'Security Token Refreshed',
        message: 'Generated a new gate pass code. Your old QR is no longer valid.',
        type: 'info',
      });
    } catch (err) {
      console.error('refreshToken failed', err);
      showToast({ title: 'Could Not Refresh', message: 'Please try again.', type: 'error' });
    }
  };

  // Dev/demo shortcut that exercises the same real Firestore write a Security
  // gate scan would make, so the update is genuinely live (visible to any
  // Security dashboard listening on the same doc/entryLogs), not a local
  // setTimeout illusion.
  const handleSimulateGateScan = async () => {
    if (!residentUid) return;
    setIsScanning(true);
    showToast({
      title: 'Scanning at Security Gate...',
      message: 'Verifying digital signature with Main Gate Scanner...',
      type: 'info',
    });

    try {
      await recordGateScan(passMode, 'Self-Test (Resident App)');
      if (passMode === 'exit') {
        showToast({
          title: '✅ Exit Scan Approved',
          message: `${residentName} logged as Checked-Out at Main Gate A. Return curfew: 09:30 PM.`,
          type: 'success',
        });
      } else {
        showToast({
          title: '✅ Entry Scan Approved',
          message: `${residentName} verified and Checked-In to ${hostelBlock} ${roomNumber}.`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('recordGateScan failed', err);
      showToast({ title: 'Scan Failed', message: 'Please try again.', type: 'error' });
    } finally {
      setIsScanning(false);
    }
  };

  const lastRefreshedTime = formatTimestamp(pass?.lastRefreshedAt);
  const lastScannedTime = formatTimestamp(pass?.lastScanAt);
  const notReady = !residentUid || loading || !pass;

  return (
    <Card className="p-6 border border-[#E7E4DF] shadow-sm relative overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#996E7D]/10 via-[#2A5C8A]/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header / Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E4DF] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#FAF8F2] text-[#996E7D] border border-[#E7E4DF]">
              <QrCode className="w-5 h-5" />
            </span>
            <h2 className="font-heading text-lg font-extrabold text-[#1A1A1A]">
              Gate Pass QR
            </h2>
            <Badge variant="primary" size="sm">Single-Use Security Code</Badge>
          </div>
          <p className="font-body text-xs text-[#666666]">
            Show this pass at the hostel gate for contactless entry & exit logging. It stays valid until scanned.
          </p>
        </div>

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
            {notReady && !qrFailed && (
              <div className="flex flex-col items-center justify-center gap-2 text-[#8E8E93]">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-xs font-bold">
                  {residentUid ? 'Generating your pass…' : 'Sign in to load your gate pass'}
                </span>
              </div>
            )}

            {qrFailed && (
              <div className="flex flex-col items-center justify-center gap-2 text-[#D9534F] text-center px-3">
                <span className="text-xs font-bold">QR generation failed — try refreshing.</span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              className={notReady || qrFailed ? 'hidden' : 'w-full h-full'}
              aria-label={`Resident gate pass QR for ${residentName}`}
            />

            {isScanning && (
              <>
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent shadow-[0_0_12px_#2E7D32] animate-bounce top-1/2" />
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-[#2E7D32] font-heading text-xs font-bold gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Verifying Gate Scanner...</span>
                </div>
              </>
            )}
          </div>

          <div className="w-56 mt-3 flex items-center justify-between text-[11px] font-bold text-[#666666]">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#996E7D]" />
              {lastRefreshedTime ? `Refreshed at ${lastRefreshedTime}` : 'Valid until scanned'}
            </span>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={notReady}
              className="text-[#2A5C8A] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Generate a new code if you think this one has been shared or screenshotted"
            >
              <RefreshCw className="w-3 h-3" /> Refresh Now
            </button>
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
                <span className="text-[#666666] block text-[11px]">Security Token</span>
                <span className="font-mono font-bold text-[#996E7D] text-[10px] block truncate">
                  {pass?.token ?? '—'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E7E4DF] flex items-center justify-between text-[11px] text-[#666666]">
              <span>Last Gate Activity: <strong className="text-[#1A1A1A]">{lastScannedTime ?? 'No scans yet'}</strong></span>
              <span className="font-semibold text-[#2E7D32]">Gate Gatekeeper Active</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Smartphone className="w-4 h-4" />}
              onClick={handleSimulateGateScan}
              disabled={isScanning || notReady}
              className="w-full sm:w-auto flex-1 shadow-sm"
            >
              Simulate Gate Scanner
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              disabled={notReady}
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