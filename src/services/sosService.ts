import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
export type SOSLocationMode = 'room' | 'manual';
export type SOSPriority = 'Critical' | 'High' | 'Medium';
export type SOSStatus = 'Active' | 'Dispatched' | 'Resolved';

export interface SOSAlertDoc {
  id: string;
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
  priority: SOSPriority;
  status: SOSStatus;
  createdAt: Timestamp | null;
  resolvedAt?: Timestamp | null;
  resolvedBy?: string;
}

const SOS_COLLECTION = 'sosAlerts';

/**
 * Called from the Resident SOS modal. Writes one alert doc.
 * Warden/Security dashboards pick it up instantly via the listener below.
 */
export const createSOSAlert = async (payload: {
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
  priority?: SOSPriority;
}): Promise<string> => {
  const docRef = await addDoc(collection(db, SOS_COLLECTION), {
    ...payload,
    priority: payload.priority || 'Critical',
    status: 'Active' as SOSStatus,
    createdAt: serverTimestamp(),
    resolvedAt: null,
    resolvedBy: null,
  });
  return docRef.id;
};

export const resolveSOSAlert = async (alertId: string, resolvedByName: string) => {
  await updateDoc(doc(db, SOS_COLLECTION, alertId), {
    status: 'Resolved' as SOSStatus,
    resolvedAt: serverTimestamp(),
    resolvedBy: resolvedByName,
  });
};

export const dispatchSOSAlert = async (alertId: string) => {
  await updateDoc(doc(db, SOS_COLLECTION, alertId), {
    status: 'Dispatched' as SOSStatus,
  });
};

/**
 * Real-time listener for currently open alerts (Active or Dispatched).
 * `hasNewAlert` is true only when a genuinely NEW doc was added in this
 * snapshot (not on initial page load) — that's the buzzer trigger signal.
 */
export const listenToActiveSOSAlerts = (
  onChange: (alerts: SOSAlertDoc[], hasNewAlert: boolean) => void
) => {
  const q = query(
    collection(db, SOS_COLLECTION),
    where('status', 'in', ['Active', 'Dispatched']),
    orderBy('createdAt', 'desc')
  );

  let isFirstLoad = true;

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const alerts: SOSAlertDoc[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<SOSAlertDoc, 'id'>),
    }));

    const hasNewAlert =
      !isFirstLoad && snapshot.docChanges().some((change) => change.type === 'added');

    isFirstLoad = false;
    onChange(alerts, hasNewAlert);
  });

  return unsubscribe;
};

/** Full history (Active + Dispatched + Resolved) for analytics/timeline views. */
export const listenToAllSOSHistory = (onChange: (alerts: SOSAlertDoc[]) => void) => {
  const q = query(collection(db, SOS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    onChange(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SOSAlertDoc, 'id'>) })));
  });
};