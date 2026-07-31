// src/components/dashboard/VisitorQRCode.tsx
//
// Renders a real, scannable QR code for a visitor gate pass. Encodes
// { passId, token } rather than plain visitor details — the QR is just an
// opaque reference. The security scanner looks the passId up in Firestore
// and checks the token server-side, so a photographed/forwarded QR can be
// revoked or expired centrally instead of being a permanently-valid credential.
//
// npm install qrcode
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface VisitorQRCodeProps {
  passId: string;
  token: string;
  size?: number;
  className?: string;
}

const VisitorQRCode: React.FC<VisitorQRCodeProps> = ({ passId, token, size = 128, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    setFailed(false);
    const payload = JSON.stringify({ passId, token });
    QRCode.toCanvas(canvasRef.current, payload, { width: size, margin: 1 }, (err) => {
      if (err) {
        console.error('QR generation failed', err);
        setFailed(true);
      }
    });
  }, [passId, token, size]);

  if (failed) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        role="img"
        aria-label="QR code generation failed"
      >
        <span className="text-[10px] text-[#D9534F]">QR generation failed — retry</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      aria-label={`QR gate pass ${passId}`}
    />
  );
};

export default VisitorQRCode;