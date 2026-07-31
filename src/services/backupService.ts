// src/services/backupService.ts
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase'; // <-- point this at your actual Firebase init

export interface BackupSnapshotDoc {
  id: string;
  label: string;
  type: string;
  status: 'Healthy' | 'Failed' | 'In Progress';
  size: string;
  duration: string;
  triggeredBy: string;
  createdAt: Timestamp;
}

const BACKUPS_COLLECTION = 'backups';

export async function createBackupSnapshot(data: {
  label: string;
  type: string;
  status: string;
  size: string;
  duration: string;
  triggeredBy: string;
}): Promise<void> {
  await addDoc(collection(db, BACKUPS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToBackups(
  callback: (backups: BackupSnapshotDoc[]) => void
): () => void {
  const q = query(collection(db, BACKUPS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BackupSnapshotDoc))
    );
  });
}

export function formatBackupTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return 'Just now';
  return ts.toDate().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}