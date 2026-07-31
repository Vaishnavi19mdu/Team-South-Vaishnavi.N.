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

  // ==================== Resident-only ====================
  // Populated only when role === 'resident'. Do not read these for staff
  // roles — they simply won't be set.
  hostelBlock?: string;
  floorNumber?: string;
  roomNumber?: string;

  // ==================== Warden-only ====================
  assignedBlock?: string;   // primary block they administer
  officeLocation?: string; // cabin / office code, not a dorm room

  // ==================== Maintenance-only ====================
  department?: 'Electrical' | 'Plumbing' | 'Carpentry' | 'General' | 'Housekeeping';
  assignedZone?: string;    // a hostel block slug, or 'all' for campus-wide
  shift?: 'Morning' | 'Evening' | 'On-call';

  // ==================== Security-only ====================
  assignedGate?: string;
  badgeNumber?: string;
  // note: security also uses `shift`, but with different values —
  // see SecurityShift below and how SignupHostelScreen assigns it.

  // ==================== Shared across warden / maintenance / security ====================
  employeeId?: string;

  // ==================== Common to every role ====================
  emergencyName: string;
  emergencyNumber: string;

  // Approval workflow
  status: ApprovalStatus;   // 'approved' immediately for resident & maintenance
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