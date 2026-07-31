import React, { useState } from 'react';
import { UserRole, ROLES } from '../../utils/constants/roles';
import {
  ChevronLeft,
  Building2,
  PhoneCall,
  UserCheck,
  Shield,
  CheckCircle2,
  Wrench,
  DoorOpen,
  IdCard,
  Clock,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import Snackbar from '../../components/common/Snackbar';
import { SignupBasicData } from './SignupBasicScreen';
import { isValidPhone } from '../../utils/helpers/validators';

export interface SignupHostelData {
  // Resident-only
  hostelBlock?: string;
  floorNumber?: string;
  roomNumber?: string;

  // Warden-only
  assignedBlock?: string;
  officeLocation?: string;

  // Maintenance-only
  department?: string;
  assignedZone?: string;

  // Security-only
  assignedGate?: string;
  badgeNumber?: string;

  // Shared: maintenance + security shift, warden/maintenance/security employeeId
  shift?: string;
  employeeId?: string;

  // Common to every role
  emergencyName: string;
  emergencyNumber: string;
}

export interface SignupHostelScreenProps {
  onNavigate: (route: string) => void;
  selectedRole: UserRole;
  basicData: SignupBasicData;
  onCompleteSignup: (role: UserRole, hostelData: SignupHostelData) => void;
}

// Kept in sync with the 7-hostel roster used in SuperAdminDashboard.tsx's
// `hostelDataList` (Vaigai, Cauvery, Thamirabarani, Bhavani, Palar, Amaravathi, Pothigai).
// value = lowercase slug used as the Firestore field value; label = what's shown here.
const HOSTEL_BLOCK_OPTIONS = [
  { label: 'Vaigai Hostel (Boys • 9 Floors)', value: 'vaigai' },
  { label: 'Cauvery Hostel (Girls • 9 Floors)', value: 'cauvery' },
  { label: 'Thamirabarani Hostel (Boys • 5 Floors)', value: 'thamirabarani' },
  { label: 'Bhavani Hostel (Boys • 3 Floors)', value: 'bhavani' },
  { label: 'Palar Hostel (Boys • 5 Floors)', value: 'palar' },
  { label: 'Amaravathi Hostel (Girls • 8 Floors)', value: 'amaravathi' },
  { label: 'Pothigai Hostel (Boys • 12 Floors)', value: 'pothigai' },
];

// Maintenance often covers more than one block, so give them a campus-wide option.
const MAINTENANCE_ZONE_OPTIONS = [
  { label: 'All Blocks (Campus-wide)', value: 'all' },
  ...HOSTEL_BLOCK_OPTIONS,
];

const DEPARTMENT_OPTIONS = [
  { label: 'Electrical', value: 'Electrical' },
  { label: 'Plumbing', value: 'Plumbing' },
  { label: 'Carpentry', value: 'Carpentry' },
  { label: 'General Maintenance', value: 'General' },
  { label: 'Housekeeping', value: 'Housekeeping' },
];

const MAINTENANCE_SHIFT_OPTIONS = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Evening', value: 'Evening' },
  { label: 'On-call', value: 'On-call' },
];

const SECURITY_SHIFT_OPTIONS = [
  { label: 'Day Shift', value: 'Day' },
  { label: 'Night Shift', value: 'Night' },
  { label: 'Rotating', value: 'Rotating' },
];

const initialFormData: SignupHostelData = {
  hostelBlock: '',
  floorNumber: '',
  roomNumber: '',
  assignedBlock: '',
  officeLocation: '',
  department: '',
  assignedZone: '',
  assignedGate: '',
  badgeNumber: '',
  shift: '',
  employeeId: '',
  emergencyName: '',
  emergencyNumber: '',
};

export const SignupHostelScreen: React.FC<SignupHostelScreenProps> = ({
  onNavigate,
  selectedRole,
  basicData,
  onCompleteSignup,
}) => {
  const roleConfig = ROLES[selectedRole || 'resident'];
  const role = selectedRole || 'resident';

  const [formData, setFormData] = useState<SignupHostelData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupHostelData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  const handleChange = (field: keyof SignupHostelData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof SignupHostelData, string>> = {};

    // ---- Role-specific required fields ----
    if (role === 'resident') {
      if (!formData.hostelBlock) newErrors.hostelBlock = 'Please select a hostel block';
      if (!formData.floorNumber?.trim()) newErrors.floorNumber = 'Floor number is required';
      if (!formData.roomNumber?.trim()) newErrors.roomNumber = 'Room number is required';
    }

    if (role === 'warden') {
      if (!formData.assignedBlock) newErrors.assignedBlock = 'Please select the block you administer';
      if (!formData.officeLocation?.trim()) newErrors.officeLocation = 'Office / cabin location is required';
      if (!formData.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required';
    }

    if (role === 'maintenance') {
      if (!formData.department) newErrors.department = 'Please select your department';
      if (!formData.assignedZone) newErrors.assignedZone = 'Please select your assigned zone';
      if (!formData.shift) newErrors.shift = 'Please select a shift';
      if (!formData.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required';
    }

    if (role === 'security') {
      if (!formData.assignedGate?.trim()) newErrors.assignedGate = 'Assigned gate / post is required';
      if (!formData.shift) newErrors.shift = 'Please select a shift';
      if (!formData.badgeNumber?.trim()) newErrors.badgeNumber = 'Badge number is required';
      if (!formData.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required';
    }

    // ---- Common to every role ----
    if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
    if (!formData.emergencyNumber) {
      newErrors.emergencyNumber = 'Emergency contact number is required';
    } else if (!isValidPhone(formData.emergencyNumber)) {
      newErrors.emergencyNumber = 'Enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // NOTE: this setTimeout was standing in for a real network call.
    // Once Firebase is wired, onCompleteSignup (passed down from App.tsx)
    // now calls the real signUp() service and returns a Promise, so this
    // artificial delay can be removed — isLoading is driven by that await instead.
    setTimeout(() => {
      setIsLoading(false);
      onCompleteSignup(role, formData);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FAF8F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl">

        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('signup-step-1')}
            className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm font-semibold text-[#666666] hover:text-[#996E7D] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Step 1
          </button>

          <Logo variant="navbar" size="sm" />
        </div>

        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#666666] mb-2">
            <span>Step 3 of 3: {role === 'resident' ? 'Hostel Assignment' : 'Role Assignment'}</span>
            <span className="text-[#996E7D]">100% Completed</span>
          </div>
          <div className="w-full h-2 bg-[#E7E4DF] rounded-full overflow-hidden">
            <div className="h-full bg-[#996E7D] w-full transition-all duration-300 rounded-full" />
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)]">
          <div className="mb-6 pb-4 border-b border-[#E7E4DF]">
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1A1A1A]">
              {role === 'resident' ? 'Hostel & Emergency Details' : 'Assignment & Emergency Details'}
            </h1>
            <p className="font-body text-xs text-[#666666] mt-1">
              Finalizing registration for <span className="font-bold text-[#1A1A1A]">{basicData.firstName || 'User'} {basicData.lastName}</span> ({roleConfig.title})
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* ==================== RESIDENT ==================== */}
            {role === 'resident' && (
              <>
                <Dropdown
                  label="Hostel Block"
                  value={formData.hostelBlock}
                  onChange={(val) => handleChange('hostelBlock', val)}
                  error={errors.hostelBlock}
                  placeholder="Select Hostel Block"
                  leftIcon={<Building2 className="w-4 h-4 text-[#8E8E93]" />}
                  options={HOSTEL_BLOCK_OPTIONS}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Floor Number"
                    placeholder="Enter floor number"
                    value={formData.floorNumber}
                    onChange={(e) => handleChange('floorNumber', e.target.value)}
                    error={errors.floorNumber}
                    required
                  />
                  <Input
                    label="Room Number"
                    placeholder="Enter room number"
                    value={formData.roomNumber}
                    onChange={(e) => handleChange('roomNumber', e.target.value)}
                    error={errors.roomNumber}
                    required
                  />
                </div>
              </>
            )}

            {/* ==================== WARDEN ==================== */}
            {role === 'warden' && (
              <>
                <Dropdown
                  label="Block You Administer"
                  value={formData.assignedBlock}
                  onChange={(val) => handleChange('assignedBlock', val)}
                  error={errors.assignedBlock}
                  placeholder="Select Hostel Block"
                  leftIcon={<Building2 className="w-4 h-4 text-[#8E8E93]" />}
                  options={HOSTEL_BLOCK_OPTIONS}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Office / Cabin Location"
                    placeholder="e.g. Ground Floor, Warden Office"
                    value={formData.officeLocation}
                    onChange={(e) => handleChange('officeLocation', e.target.value)}
                    error={errors.officeLocation}
                    leftIcon={<DoorOpen className="w-4 h-4 text-[#8E8E93]" />}
                    required
                  />
                  <Input
                    label="Employee ID"
                    placeholder="Enter staff employee ID"
                    value={formData.employeeId}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    error={errors.employeeId}
                    leftIcon={<IdCard className="w-4 h-4 text-[#8E8E93]" />}
                    required
                  />
                </div>
              </>
            )}

            {/* ==================== MAINTENANCE ==================== */}
            {role === 'maintenance' && (
              <>
                <Dropdown
                  label="Department"
                  value={formData.department}
                  onChange={(val) => handleChange('department', val)}
                  error={errors.department}
                  placeholder="Select your specialization"
                  leftIcon={<Wrench className="w-4 h-4 text-[#8E8E93]" />}
                  options={DEPARTMENT_OPTIONS}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Dropdown
                    label="Assigned Zone"
                    value={formData.assignedZone}
                    onChange={(val) => handleChange('assignedZone', val)}
                    error={errors.assignedZone}
                    placeholder="Select block or campus-wide"
                    leftIcon={<Building2 className="w-4 h-4 text-[#8E8E93]" />}
                    options={MAINTENANCE_ZONE_OPTIONS}
                    required
                  />
                  <Dropdown
                    label="Shift"
                    value={formData.shift}
                    onChange={(val) => handleChange('shift', val)}
                    error={errors.shift}
                    placeholder="Select shift"
                    leftIcon={<Clock className="w-4 h-4 text-[#8E8E93]" />}
                    options={MAINTENANCE_SHIFT_OPTIONS}
                    required
                  />
                </div>
                <Input
                  label="Employee ID"
                  placeholder="Enter staff employee ID"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  error={errors.employeeId}
                  leftIcon={<IdCard className="w-4 h-4 text-[#8E8E93]" />}
                  required
                />
              </>
            )}

            {/* ==================== SECURITY ==================== */}
            {role === 'security' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Assigned Gate / Post"
                    placeholder="e.g. Main Gate, Block C Entry"
                    value={formData.assignedGate}
                    onChange={(e) => handleChange('assignedGate', e.target.value)}
                    error={errors.assignedGate}
                    leftIcon={<DoorOpen className="w-4 h-4 text-[#8E8E93]" />}
                    required
                  />
                  <Dropdown
                    label="Shift"
                    value={formData.shift}
                    onChange={(val) => handleChange('shift', val)}
                    error={errors.shift}
                    placeholder="Select shift"
                    leftIcon={<Clock className="w-4 h-4 text-[#8E8E93]" />}
                    options={SECURITY_SHIFT_OPTIONS}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Badge Number"
                    placeholder="Enter badge number"
                    value={formData.badgeNumber}
                    onChange={(e) => handleChange('badgeNumber', e.target.value)}
                    error={errors.badgeNumber}
                    required
                  />
                  <Input
                    label="Employee ID"
                    placeholder="Enter staff employee ID"
                    value={formData.employeeId}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    error={errors.employeeId}
                    leftIcon={<IdCard className="w-4 h-4 text-[#8E8E93]" />}
                    required
                  />
                </div>
              </>
            )}

            {/* Emergency Contact Header */}
            <div className="pt-2">
              <label className="font-heading text-xs font-bold text-[#996E7D] uppercase tracking-wider block mb-1">
                Emergency Contact Details
              </label>
              <p className="font-body text-xs text-[#666666] mb-3">
                Used for instant safety broadcasts during Emergency SOS triggers.
              </p>
            </div>

            {/* Emergency Contact Name & Phone (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Name"
                placeholder="Enter contact name"
                value={formData.emergencyName}
                onChange={(e) => handleChange('emergencyName', e.target.value)}
                error={errors.emergencyName}
                leftIcon={<UserCheck className="w-4 h-4 text-[#8E8E93]" />}
                required
              />

              <Input
                label="Contact Phone Number"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.emergencyNumber}
                onChange={(e) => handleChange('emergencyNumber', e.target.value)}
                error={errors.emergencyNumber}
                leftIcon={<PhoneCall className="w-4 h-4 text-[#8E8E93]" />}
                required
              />
            </div>

            {/* Role Verification Notice */}
            <div className="bg-[#FAF8F2] border border-[#E7E4DF] p-3.5 rounded-[12px] flex items-start gap-3 my-2">
              <Shield className="w-5 h-5 text-[#996E7D] shrink-0 mt-0.5" />
              <div className="text-xs text-[#666666] leading-relaxed">
                {roleConfig.requiresApproval ? (
                  <p>
                    <strong className="text-[#1A1A1A]">Administrative Verification:</strong> As a {roleConfig.title}, your account will be placed in <span className="text-[#D97706] font-semibold">Pending Approval</span> mode until verified by the Super Admin.
                  </p>
                ) : (
                  <p>
                    <strong className="text-[#1A1A1A]">Fast-Track Activation:</strong> Your {roleConfig.title.toLowerCase()} account is instantly created and activated upon submission.
                  </p>
                )}
              </div>
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              rightIcon={<CheckCircle2 className="w-5 h-5" />}
              className="mt-2"
            >
              Create Account
            </Button>

          </form>
        </Card>

      </div>

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
};

export default SignupHostelScreen;