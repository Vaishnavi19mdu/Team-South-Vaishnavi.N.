import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase'; // adjust if your init file differs

export interface PendingUserDoc {
  id: string;
  email: string;
  displayName?: string;
  role: 'warden' | 'maintenance' | 'security';
  hostelBlock?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}

const USERS_COLLECTION = 'users';
const NOTIFICATIONS_COLLECTION = 'notifications';

export function subscribeToPendingUsers(
  callback: (users: PendingUserDoc[]) => void
) {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<PendingUserDoc, 'id'>),
    }));
    callback(users);
  });
}

// Approves the user AND writes their in-app notification in one go —
// no Cloud Function needed, it all happens right here client-side.
export async function approveUserRequest(req: PendingUserDoc, approvedBy: string) {
  await updateDoc(doc(db, USERS_COLLECTION, req.id), {
    status: 'approved',
    approvedBy,
    approvedAt: serverTimestamp(),
  });

  await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
    userId: req.id,
    title: 'Account Approved ✅',
    message: `Your ${req.role} account has been approved. You can now sign in.`,
    type: 'success',
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function rejectUserRequest(
  req: PendingUserDoc,
  rejectedBy: string,
  reason?: string
) {
  await updateDoc(doc(db, USERS_COLLECTION, req.id), {
    status: 'rejected',
    rejectedBy,
    rejectedAt: serverTimestamp(),
    rejectionReason: reason ?? null,
  });

  await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
    userId: req.id,
    title: 'Account Request Rejected',
    message: reason
      ? `Your ${req.role} account request was declined. Reason: ${reason}`
      : `Your ${req.role} account request was declined.`,
    type: 'error',
    read: false,
    createdAt: serverTimestamp(),
  });
}

export function formatRequestTimestamp(ts: Timestamp | undefined): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}