import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile, ApprovalStatus } from '../types/auth';

const USERS_COLLECTION = 'users';

/**
 * Live-subscribes to all users with status 'pending'.
 * Call the returned unsubscribe function on unmount.
 */
export function subscribeToPendingUsers(
  onChange: (users: UserProfile[]) => void
): Unsubscribe {
  const q = query(collection(db, USERS_COLLECTION), where('status', '==', 'pending'));

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        uid: d.id,
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? '',
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? '',
      } as UserProfile;
    });
    onChange(users);
  });
}

async function setUserStatus(uid: string, status: ApprovalStatus): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export const approveUser = (uid: string) => setUserStatus(uid, 'approved');
export const rejectUser = (uid: string) => setUserStatus(uid, 'rejected');