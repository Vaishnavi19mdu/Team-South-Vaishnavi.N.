import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserRole, ROLES } from '../utils/constants/roles';
import { SignupBasicData } from '../screens/auth/SignupBasicScreen';
import { SignupHostelData } from '../screens/auth/SignupHostelScreen';
import { UserProfile } from '../types/auth';

const USERS_COLLECTION = 'users';

/**
 * Creates the Firebase Auth account AND the Firestore profile document
 * in one call. Called from SignupHostelScreen's onCompleteSignup.
 */
export async function signUp(
  role: UserRole,
  basicData: SignupBasicData,
  hostelData: SignupHostelData
): Promise<UserProfile> {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    basicData.email,
    basicData.password
  );

  const requiresApproval = ROLES[role].requiresApproval;

  const profile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
    uid: user.uid,
    firstName: basicData.firstName,
    lastName: basicData.lastName,
    email: basicData.email,
    phone: basicData.phone,
    dob: basicData.dob,
    gender: basicData.gender,
    role,
    hostelBlock: hostelData.hostelBlock,
    floorNumber: hostelData.floorNumber,
    roomNumber: hostelData.roomNumber,
    emergencyName: hostelData.emergencyName,
    emergencyNumber: hostelData.emergencyNumber,
    status: requiresApproval ? 'pending' : 'approved',
    isAdmin: false,
  };

  await setDoc(doc(db, USERS_COLLECTION, user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...profile, createdAt: '', updatedAt: '' } as UserProfile;
}

export async function logIn(email: string, password: string): Promise<UserProfile> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(user.uid);
  if (!profile) {
    throw new Error('No profile found for this account. Contact support.');
  }
  return profile;
}

export async function logInWithGoogle(): Promise<{ user: FirebaseUser; profile: UserProfile | null }> {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  const profile = await getUserProfile(user.uid);
  // profile === null means this Google account has no signup record yet —
  // route them to role-selection to finish onboarding.
  return { user, profile };
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    uid,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? '',
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? '',
  } as UserProfile;
}

/** True if this profile is allowed to log in and use the app right now. */
export function isProfileActive(profile: UserProfile): boolean {
  return profile.status === 'approved';
}