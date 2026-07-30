import { UserRole } from '../utils/constants/roles';

export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

// 'superadmin' is intentionally NOT part of UserRole in roles.ts — that role
// is never selectable at signup (RoleSelectionScreen only offers the 4
// self-service roles). SuperAdmin accounts are seeded manually straight into
// Firestore/Firebase Auth, so we widen the type here rather than in roles.ts,
// to keep UserRole itself accurate for every signup-facing screen.
export type ProfileRole = UserRole | 'superadmin';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  role: ProfileRole;

  // Hostel / admin fields (from SignupHostelScreen)
  hostelBlock: string;
  floorNumber: string;
  roomNumber: string;
  emergencyName: string;
  emergencyNumber: string;

  // Approval workflow
  status: ApprovalStatus;   // 'approved' immediately for residents
  isAdmin: boolean;         // true only for superadmin accounts (seeded manually)

  createdAt: string;        // ISO timestamp
  updatedAt: string;
}

// Payload shape used when writing a brand-new user doc at signup time
export type NewUserProfile = Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>;

// NOTE: whether a role requires SuperAdmin approval lives in a single place —
// ROLES[role].requiresApproval in utils/constants/roles.ts. authService.signUp
// reads it to set `status: 'pending' | 'approved'` at account creation time.
// Don't duplicate that check here or in App.tsx; just trust profile.status.