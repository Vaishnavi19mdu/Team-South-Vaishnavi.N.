import {
  collection, query, where, orderBy, onSnapshot,
  doc, updateDoc, Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase'; // <-- point this at your actual Firebase init

export interface NotificationDoc {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
  createdAt: Timestamp;
}

export function subscribeToUserNotifications(
  userId: string,
  callback: (notifs: NotificationDoc[]) => void
) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NotificationDoc, 'id'>) })))
  );
}

export async function markNotificationRead(notifId: string) {
  await updateDoc(doc(db, 'notifications', notifId), { read: true });
}