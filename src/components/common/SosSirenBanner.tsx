import React, { useEffect, useState } from 'react';
import { AlertTriangle, VolumeX } from 'lucide-react';
import { onSosSirenChange, stopSosSiren } from '../../utils/sosSiren';

/**
 * Drop <SosSirenBanner /> once near the bottom of any dashboard's root div.
 * It renders nothing until a siren is actually playing (in this tab), then
 * shows a floating "Stop" control — usable by whoever is looking at that
 * screen (resident, warden, or security).
 */
export const SosSirenBanner: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return onSosSirenChange(setIsPlaying);
  }, []);

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-[#D9534F] text-white rounded-full shadow-2xl pl-4 pr-2 py-2 flex items-center gap-3 animate-pulse">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-xs font-bold whitespace-nowrap">SOS siren playing</span>
      </div>
      <button
        type="button"
        onClick={stopSosSiren}
        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0"
      >
        <VolumeX className="w-3.5 h-3.5" />
        Stop
      </button>
    </div>
  );
};

export default SosSirenBanner;