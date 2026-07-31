// src/context/VisitorPassContext.tsx
//
// Live Firestore-backed source of truth for visitor gate passes + entry logs.
// Consumed by both ResidentDashboard (generate + view own passes) and
// SecurityDashboard (scan, approve/reject, check-in/check-out).
//
// ASSUMPTION: this imports `db` from '../firebase'. Adjust that single import
// line below to match wherever your app actually initializes Firestore
// (e.g. '../lib/firebase', '../config/firebase', etc).
//
// npm install nanoid
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '../config/firebase'; // <-- ADJUST to your actual Firebase init file path
export type VisitorPassStatus =
  | 'pending'
  | 'approved'
  | 'checked_in'
  | 'checked_out'
  | 'rejected'
  | 'cancelled'
  | 'expired';

export interface VisitorPassRecord {
  passId: string;
  token: string;
  residentUid: string;
  residentName: string;
  block: string;
  room: string;
  guestName: string;
  relation: string;
  scheduledLabel: string;
  status: VisitorPassStatus;
  createdAt?: any;
  checkInAt?: any;
  checkInBy?: string;
  checkOutAt?: any;
  checkOutBy?: string;
}

interface CreateVisitorPassInput {
  residentUid: string;
  residentName: string;
  block: string;
  room: string;
  guestName: string;
  relation: string;
  scheduledLabel?: string;
}

interface VisitorPassContextValue {
  /** Live list of all visitor passes (most-recent-first, capped). Filter client-side by residentUid, status, etc. */
  passes: VisitorPassRecord[];
  loading: boolean;
  createVisitorPass: (input: CreateVisitorPassInput) => Promise<VisitorPassRecord>;
  cancelVisitorPass: (passId: string) => Promise<void>;
  /**
   * Looks a pass up from scanned/typed text. Accepts either a JSON QR payload
   * ({ passId, token }) or a plain pass code typed manually. Returns null if
   * not found, or if a token was present but didn't match (tampered/forged QR).
   */
  lookupByScan: (scannedText: string) => Promise<VisitorPassRecord | null>;
  approveVisitorPass: (passId: string) => Promise<void>;
  rejectVisitorPass: (passId: string, officer: string) => Promise<void>;
  checkInVisitorPass: (passId: string, officer: string, gate?: string) => Promise<void>;
  checkOutVisitorPass: (passId: string, officer: string) => Promise<void>;
}

const VisitorPassContext = createContext<VisitorPassContextValue | undefined>(undefined);

const PASSES_COLLECTION = 'visitorPasses';
const LOGS_COLLECTION = 'entryLogs';

export const VisitorPassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passes, setPasses] = useState<VisitorPassRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, PASSES_COLLECTION), orderBy('createdAt', 'desc'), limit(200));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPasses(
          snapshot.docs.map((d) => ({ passId: d.id, ...(d.data() as Omit<VisitorPassRecord, 'passId'>) }))
        );
        setLoading(false);
      },
      (err) => {
        console.error('visitorPasses onSnapshot error', err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const createVisitorPass = useCallback<VisitorPassContextValue['createVisitorPass']>(async (input) => {
    const passId = `PV-${Math.floor(1000 + Math.random() * 9000)}`;
    const token = nanoid(16);
    const record: Omit<VisitorPassRecord, 'createdAt'> = {
      passId,
      token,
      residentUid: input.residentUid,
      residentName: input.residentName,
      block: input.block,
      room: input.room,
      guestName: input.guestName,
      relation: input.relation,
      scheduledLabel: input.scheduledLabel || 'Today, Soon',
      status: 'pending',
    };
    await setDoc(doc(db, PASSES_COLLECTION, passId), { ...record, createdAt: serverTimestamp() });
    return record as VisitorPassRecord;
  }, []);

  const cancelVisitorPass = useCallback(async (passId: string) => {
    await updateDoc(doc(db, PASSES_COLLECTION, passId), { status: 'cancelled' });
  }, []);

  const lookupByScan = useCallback<VisitorPassContextValue['lookupByScan']>(async (scannedText) => {
    let passId = scannedText.trim();
    let token: string | undefined;

    try {
      const parsed = JSON.parse(scannedText);
      if (parsed && parsed.passId) {
        passId = String(parsed.passId);
        token = parsed.token ? String(parsed.token) : undefined;
      }
    } catch {
      // Not JSON — treat as a plain pass code (manual entry, or a simple text QR).
    }

    const snap = await getDoc(doc(db, PASSES_COLLECTION, passId.toUpperCase()));
    if (!snap.exists()) return null;

    const data = snap.data() as Omit<VisitorPassRecord, 'passId'>;
    if (token && data.token !== token) {
      // Pass ID matched but the embedded token didn't — likely a forged/edited QR.
      return null;
    }
    return { passId: snap.id, ...data };
  }, []);

  const approveVisitorPass = useCallback(async (passId: string) => {
    await updateDoc(doc(db, PASSES_COLLECTION, passId), { status: 'approved' });
  }, []);

  const rejectVisitorPass = useCallback(async (passId: string, officer: string) => {
    await updateDoc(doc(db, PASSES_COLLECTION, passId), { status: 'rejected' });
    await addDoc(collection(db, LOGS_COLLECTION), {
      passId,
      status: 'Rejected',
      verifiedBy: officer,
      entryTime: serverTimestamp(),
    });
  }, []);

  const checkInVisitorPass = useCallback(
    async (passId: string, officer: string, gate: string = 'Main Hostel Gate') => {
      await updateDoc(doc(db, PASSES_COLLECTION, passId), {
        status: 'checked_in',
        checkInAt: serverTimestamp(),
        checkInBy: officer,
      });
      await addDoc(collection(db, LOGS_COLLECTION), {
        passId,
        gate,
        status: 'Inside',
        verifiedBy: officer,
        entryTime: serverTimestamp(),
      });
    },
    []
  );

  const checkOutVisitorPass = useCallback(async (passId: string, officer: string) => {
    await updateDoc(doc(db, PASSES_COLLECTION, passId), {
      status: 'checked_out',
      checkOutAt: serverTimestamp(),
      checkOutBy: officer,
    });
  }, []);

  return (
    <VisitorPassContext.Provider
      value={{
        passes,
        loading,
        createVisitorPass,
        cancelVisitorPass,
        lookupByScan,
        approveVisitorPass,
        rejectVisitorPass,
        checkInVisitorPass,
        checkOutVisitorPass,
      }}
    >
      {children}
    </VisitorPassContext.Provider>
  );
};

export function useVisitorPass(): VisitorPassContextValue {
  const ctx = useContext(VisitorPassContext);
  if (!ctx) {
    throw new Error('useVisitorPass must be used within a VisitorPassProvider');
  }
  return ctx;
}