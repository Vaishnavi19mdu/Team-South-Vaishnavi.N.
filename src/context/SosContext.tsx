import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  createSOSAlert,
  resolveSOSAlert,
  dispatchSOSAlert,
  listenToActiveSOSAlerts,
  listenToAllSOSHistory,
  SOSAlertDoc,
  SOSLocationMode,
} from '../services/sosService';
import { useToast } from './ToastContext';

interface TriggerSOSPayload {
  studentUid: string;
  studentName: string;
  rollNo?: string;
  phone: string;
  hostelBlock: string;
  floor?: string;
  room: string;
  locationMode: SOSLocationMode;
  locationNote?: string;
  emergencyType: string;
  description?: string;
}

interface SosContextType {
  activeAlerts: SOSAlertDoc[];
  allAlerts: SOSAlertDoc[];
  triggerSOS: (payload: TriggerSOSPayload) => Promise<string>;
  markResolved: (alertId: string, resolvedByName: string) => Promise<void>;
  markDispatched: (alertId: string) => Promise<void>;
  isBuzzerMuted: boolean;
  setIsBuzzerMuted: (muted: boolean) => void;
}

const SosContext = createContext<SosContextType | undefined>(undefined);

// Swap this for your own hosted alert tone (drop an mp3 in /public/sounds/)
const ALERT_SOUND_URL = '/sounds/sos-alert.mp3';

interface SosProviderProps {
  children: React.ReactNode;
  /**
   * 'warden' | 'security' → mounts the buzzer + urgent toast on new alerts.
   * 'resident' → still gets live activeAlerts (e.g. "your SOS is being handled")
   * but stays silent, since residents shouldn't hear every campus-wide siren.
   */
  listenerRole?: 'warden' | 'security' | 'resident';
}

export const SosProvider: React.FC<SosProviderProps> = ({ children, listenerRole = 'resident' }) => {
  const { showToast } = useToast();
  const [activeAlerts, setActiveAlerts] = useState<SOSAlertDoc[]>([]);
  const [allAlerts, setAllAlerts] = useState<SOSAlertDoc[]>([]);
  const [isBuzzerMuted, setIsBuzzerMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(ALERT_SOUND_URL);
    audioRef.current.loop = false;
  }, []);

  const playBuzzer = useCallback(() => {
    if (isBuzzerMuted) return;
    audioRef.current?.play().catch(() => {
      // Browsers block autoplay until the user has interacted with the page
      // at least once — expected on first load, resolves after any click.
    });
  }, [isBuzzerMuted]);

  // Live subscription — drives the buzzer for Warden/Security
  useEffect(() => {
    const unsubscribe = listenToActiveSOSAlerts((alerts, hasNewAlert) => {
      setActiveAlerts(alerts);

      if (hasNewAlert && (listenerRole === 'warden' || listenerRole === 'security')) {
        playBuzzer();
        const latest = alerts[0];
        showToast({
          title: '🚨 EMERGENCY SOS RECEIVED',
          message: latest
            ? `${latest.studentName} — ${latest.hostelBlock}, ${latest.room}`
            : 'New emergency alert received.',
          type: 'error',
          duration: 8000,
        });
      }
    });

    return () => unsubscribe();
  }, [listenerRole, playBuzzer, showToast]);

  // Full history (for SOS analytics/timeline sections)
  useEffect(() => {
    const unsubscribe = listenToAllSOSHistory(setAllAlerts);
    return () => unsubscribe();
  }, []);

  const triggerSOS = useCallback(async (payload: TriggerSOSPayload) => {
    return createSOSAlert(payload);
  }, []);

  const markResolved = useCallback(async (alertId: string, resolvedByName: string) => {
    await resolveSOSAlert(alertId, resolvedByName);
  }, []);

  const markDispatched = useCallback(async (alertId: string) => {
    await dispatchSOSAlert(alertId);
  }, []);

  return (
    <SosContext.Provider
      value={{
        activeAlerts,
        allAlerts,
        triggerSOS,
        markResolved,
        markDispatched,
        isBuzzerMuted,
        setIsBuzzerMuted,
      }}
    >
      {children}
    </SosContext.Provider>
  );
};

export const useSos = () => {
  const context = useContext(SosContext);
  if (!context) {
    throw new Error('useSos must be used within a SosProvider');
  }
  return context;
};

export default SosProvider;