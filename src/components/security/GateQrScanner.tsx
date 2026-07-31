// src/components/security/GateQrScanner.tsx
//
// Real camera-based QR scanner for the Security "Gate Pass QR Scanner" screen.
// Uses html5-qrcode, which wraps getUserMedia + a decode loop + torch/camera
// switching. There is no separate "request permission" step like Expo's
// Camera.requestPermissionsAsync() — calling Html5Qrcode.getCameras() (below)
// is itself what triggers the browser's native camera permission prompt.
//
// npm install html5-qrcode
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export interface GateQrScannerHandle {
  /** Toggle the torch/flashlight on the active camera track (Android Chrome only — no-op/throws elsewhere). */
  toggleTorch: () => Promise<void>;
  /** Stop the current camera and start the next available one (rear <-> front). */
  switchCamera: () => Promise<void>;
}

interface GateQrScannerProps {
  /** Called with the raw decoded text every time a QR code is read. */
  onDecode: (decodedText: string) => void;
  /** Called with a human-readable message on camera/permission errors. */
  onError?: (message: string) => void;
  /** Called once we know whether the active camera track supports torch. */
  onTorchSupportChange?: (supported: boolean) => void;
  /** Pause scanning (e.g. while a result confirmation modal is open) without tearing down the camera. */
  paused?: boolean;
}

const REGION_ID = 'gate-qr-reader-region';

const GateQrScanner = forwardRef<GateQrScannerHandle, GateQrScannerProps>(
  ({ onDecode, onError, onTorchSupportChange, paused }, ref) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const camerasRef = useRef<{ id: string; label: string }[]>([]);
    const camIndexRef = useRef(0);
    const torchOnRef = useRef(false);
    const [permissionState, setPermissionState] = useState<
      'idle' | 'requesting' | 'granted' | 'denied'
    >('idle');

    async function startCamera(cameraId: string) {
      const inst = scannerRef.current;
      if (!inst) return;

      await inst.start(
        cameraId,
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.333 },
        (decodedText) => onDecode(decodedText),
        () => {
          /* per-frame "no QR found" — expected on almost every frame, ignore */
        }
      );

      try {
        const caps = inst.getRunningTrackCapabilities?.();
        onTorchSupportChange?.(!!caps && 'torch' in caps);
      } catch {
        onTorchSupportChange?.(false);
      }
    }

    useEffect(() => {
      let cancelled = false;
      const instance = new Html5Qrcode(REGION_ID, { verbose: false } as any);
      scannerRef.current = instance;

      (async () => {
        setPermissionState('requesting');
        try {
          // This call is what triggers the browser's native camera permission prompt.
          const cameras = await Html5Qrcode.getCameras();
          if (cancelled) return;

          if (!cameras.length) {
            setPermissionState('denied');
            onError?.('No camera found on this device.');
            return;
          }

          camerasRef.current = cameras;
          const rearIndex = cameras.findIndex((c) => /back|rear|environment/i.test(c.label));
          camIndexRef.current = rearIndex >= 0 ? rearIndex : 0;

          await startCamera(camerasRef.current[camIndexRef.current].id);
          if (cancelled) return;
          setPermissionState('granted');
        } catch (err: any) {
          if (cancelled) return;
          setPermissionState('denied');
          onError?.(
            err?.name === 'NotAllowedError'
              ? 'Camera permission denied. Enable camera access for this site in your browser settings and reload.'
              : 'Could not access the camera. Make sure no other app is using it, then retry.'
          );
        }
      })();

      return () => {
        cancelled = true;
        const inst = scannerRef.current;
        if (inst) {
          // Html5Qrcode.getState(): 1 = NOT_STARTED, 2 = PAUSED, 3 = SCANNING.
          // Calling stop() while NOT_STARTED throws synchronously (not a
          // rejected promise), which is what was crashing the component on
          // fast unmounts / slow camera permission prompts (very common on
          // mobile, where the browser's permission dialog can take a while
          // to resolve and the user may navigate away before start() ever
          // finishes). Only stop if it's actually running or paused.
          const state = inst.getState?.();
          if (state === 2 || state === 3) {
            inst
              .stop()
              .then(() => inst.clear())
              .catch(() => {
                /* already stopped mid-flight — safe to ignore */
              });
          } else {
            // Never started (or already stopped) — nothing to tear down,
            // but still clear the DOM region html5-qrcode injected into.
            try {
              inst.clear();
            } catch {
              /* ignore */
            }
          }
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const inst = scannerRef.current;
      if (!inst || permissionState !== 'granted') return;
      try {
        if (paused) {
          inst.pause(true);
        } else {
          inst.resume();
        }
      } catch {
        /* scanner not in a running state yet — ignore */
      }
    }, [paused, permissionState]);

    useImperativeHandle(ref, () => ({
      async toggleTorch() {
        const inst = scannerRef.current;
        if (!inst) return;
        const next = !torchOnRef.current;
        await inst.applyVideoConstraints({
          advanced: [{ torch: next } as any],
        });
        torchOnRef.current = next;
      },
      async switchCamera() {
        const inst = scannerRef.current;
        const cameras = camerasRef.current;
        if (!inst || cameras.length < 2) {
          throw new Error('Only one camera available');
        }
        await inst.stop();
        torchOnRef.current = false;
        camIndexRef.current = (camIndexRef.current + 1) % cameras.length;
        await startCamera(cameras[camIndexRef.current].id);
      },
    }));

    return (
      <div className="relative w-full h-full">
        <div
          id={REGION_ID}
          className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_video]:rounded-2xl"
        />

        {permissionState === 'requesting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
            <p className="text-xs text-white/80 font-mono px-4 text-center">
              Requesting camera access…
            </p>
          </div>
        )}

        {permissionState === 'denied' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl p-4 text-center">
            <p className="text-xs text-white/80 font-mono">
              Camera unavailable. Check your browser's site permissions, or use manual pass entry instead.
            </p>
          </div>
        )}
      </div>
    );
  }
);

GateQrScanner.displayName = 'GateQrScanner';

export default GateQrScanner;