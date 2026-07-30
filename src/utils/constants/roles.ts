export type UserRole = 'resident' | 'warden' | 'maintenance' | 'security';

export interface RoleConfig {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  requiresApproval: boolean;
  accentColor: string;
}

export const ROLES: Record<UserRole, RoleConfig> = {
  resident: {
    id: 'resident',
    title: 'Resident',
    subtitle: 'Hostel Student',
    description: 'Access complaint tracking, QR visitor passes, emergency SOS, and hostel announcements.',
    iconName: 'User',
    requiresApproval: false, // Residents don't require admin approval in flow logic
    accentColor: '#996E7D',
  },
  warden: {
    id: 'warden',
    title: 'Warden / Admin',
    subtitle: 'Hostel Administrator',
    description: 'Review and assign complaints, approve visitor logs, post official notices, and manage block operations.',
    iconName: 'ShieldCheck',
    requiresApproval: true,
    accentColor: '#2A5C8A',
  },
  maintenance: {
    id: 'maintenance',
    title: 'Maintenance Staff',
    subtitle: 'Electrician, Plumber, Carpenter, Technician',
    description: 'Receive real-time work orders, update repair statuses, and manage equipment inventory.',
    iconName: 'Wrench',
    requiresApproval: true,
    accentColor: '#D97706',
  },
  security: {
    id: 'security',
    title: 'Security Personnel',
    subtitle: 'Hostel Security',
    description: 'Scan visitor QR codes, verify night entry/exit logs, and receive instant emergency SOS alerts.',
    iconName: 'ShieldAlert',
    requiresApproval: true,
    accentColor: '#059669',
  },
};

export default ROLES;
