// src/hooks/useResidentGatePass.ts
//
// Real-time Firestore-backed gate pass for a RESIDENT's own entry/exit QR
// (as opposed to VisitorPassContext, which is for guests). Same pattern:
// one doc per resident in `residentGatePasses`, live-synced with onSnapshot,
// plus a shared `entryLogs` collection so Security's dashboard sees scans
// the instant they happen.
//
// ASSUMPTION: imports `db` from '../config/firebase', matching
// VisitorPassContext.tsx. Adjust if your Firebase init lives elsewhere.
//
// npm install nanoid   (already a dependency of VisitorPassContext)
import { useCallback, useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '../config/firebase'; // <-- ADJUST to your actual Firebase init file path

export type GateDirection = 'entry' | 'exit';
export type CampusStatus = 'inside' | 'outside';

export interface ResidentGatePassRecord {
  residentUid: string;
  token: string;
  campusStatus: CampusStatus;
  lastRefreshedAt?: any; // Firestore Timestamp
  lastScanAt?: any; // Firestore Timestamp
  lastScanDirection?: GateDirection;
  lastScanBy?: string;
}

const PASSES_COLLECTION = 'residentGatePasses';
const LOGS_COLLECTION = 'entryLogs';

export function useResidentGatePass(residentUid: string | undefined) {
  const [pass, setPass] = useState<ResidentGatePassRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to this resident's single pass doc. Creates it on first use
  // (idempotent — checks existence first so we never clobber a live token).
  useEffect(() => {
    if (!residentUid) {
      setPass(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = doc(db, PASSES_COLLECTION, residentUid);

    (async () => {
      try {
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            residentUid,
            token: nanoid(16),
            campusStatus: 'inside',
            lastRefreshedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error('ensure resident gate pass failed', err);
      }
    })();

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setPass(snap.exists() ? (snap.data() as ResidentGatePassRecord) : null);
        setLoading(false);
      },
      (err) => {
        console.error('residentGatePasses onSnapshot error', err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [residentUid]);

  // Resident-initiated: "I think this was screenshotted, give me a new code."
  const refreshToken = useCallback(async () => {
    if (!residentUid) return;
    await updateDoc(doc(db, PASSES_COLLECTION, residentUid), {
      token: nanoid(16),
      lastRefreshedAt: serverTimestamp(),
    });
  }, [residentUid]);

  // Called once an actual scan/verification happens (Security's scanner, or
  // the in-app "Simulate Gate Scanner" dev button below). Flips campusStatus,
  // rotates the token so the same QR image can't be replayed for a second
  // entry/exit, and writes to the shared entryLogs collection so Security's
  // dashboard updates live too.
  const recordGateScan = useCallback(
    async (direction: GateDirection, officer: string, gate: string = 'Main Hostel Gate') => {
      if (!residentUid) return;
      const nextStatus: CampusStatus = direction === 'exit' ? 'outside' : 'inside';

      await updateDoc(doc(db, PASSES_COLLECTION, residentUid), {
        campusStatus: nextStatus,
        lastScanAt: serverTimestamp(),
        lastScanDirection: direction,
        lastScanBy: officer,
        token: nanoid(16),
      });

      await addDoc(collection(db, LOGS_COLLECTION), {
        residentUid,
        gate,
        direction,
        status: nextStatus === 'inside' ? 'Inside' : 'Outside',
        verifiedBy: officer,
        entryTime: serverTimestamp(),
      });
    },
    [residentUid]
  );

  return { pass, loading, refreshToken, recordGateScan };
}