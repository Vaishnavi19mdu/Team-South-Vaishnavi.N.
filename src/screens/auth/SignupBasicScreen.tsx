import React, { useState } from 'react';
import { UserRole, ROLES } from '../../utils/constants/roles';
import { ArrowLeft, ChevronLeft, ArrowRight, User, Mail, Phone, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Dropdown from '../../components/common/Dropdown';
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import { isValidEmail, isValidPhone } from '../../utils/helpers/validators';

export interface SignupBasicData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

export interface SignupBasicScreenProps {
  onNavigate: (route: string) => void;
  selectedRole: UserRole;
  initialData: SignupBasicData;
  onNext: (data: SignupBasicData) => void;
}

export const SignupBasicScreen: React.FC<SignupBasicScreenProps> = ({
  onNavigate,
  selectedRole,
  initialData,
  onNext,
}) => {
  const roleConfig = ROLES[selectedRole || 'resident'];

  const [formData, setFormData] = useState<SignupBasicData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupBasicData, string>>>({});

  const calculateAge = (dobString: string): number | null => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const calculatedAge = calculateAge(formData.dob);

  const handleChange = (field: keyof SignupBasicData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof SignupBasicData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender selection is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FAF8F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('role-selection')}
            className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm font-semibold text-[#666666] hover:text-[#996E7D] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Change Role ({roleConfig.title})
          </button>

          <Logo variant="navbar" size="sm" />
        </div>

        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#666666] mb-2">
            <span>Step 2 of 3: Personal Information</span>
            <span className="text-[#996E7D]">66% Completed</span>
          </div>
          <div className="w-full h-2 bg-[#E7E4DF] rounded-full overflow-hidden">
            <div className="h-full bg-[#996E7D] w-2/3 transition-all duration-300 rounded-full" />
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)]">
          <div className="mb-6 pb-4 border-b border-[#E7E4DF]">
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1A1A1A]">
              Personal Details
            </h1>
            <p className="font-body text-xs text-[#666666] mt-1">
              Creating account for <span className="font-bold text-[#996E7D]">{roleConfig.title} ({roleConfig.subtitle})</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Name Fields (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                leftIcon={<User className="w-4 h-4 text-[#8E8E93]" />}
                required
              />

              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
            </div>

            {/* Email Field */}
            <Input
              label="College / Official Email"
              type="email"
              placeholder="Enter your college email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-[#8E8E93]" />}
              required
            />

            {/* Phone Number Field */}
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter mobile number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              leftIcon={<Phone className="w-4 h-4 text-[#8E8E93]" />}
              required
            />

            {/* DOB & Gender (2 Columns) with Age Auto-Calculation Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-body text-xs sm:text-sm font-medium text-[#1A1A1A]">
                    Date of Birth <span className="text-[#D9534F]">*</span>
                  </label>
                  {calculatedAge !== null && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#996E7D]/10 text-[#996E7D] border border-[#996E7D]/20">
                      {calculatedAge} {calculatedAge === 1 ? 'Year' : 'Years'}
                    </span>
                  )}
                </div>
                <DatePicker
                  value={formData.dob}
                  onChangeDate={(date) => handleChange('dob', date)}
                  error={errors.dob}
                  required
                />
              </div>

              <Dropdown
                label="Gender"
                value={formData.gender}
                onChange={(val) => handleChange('gender', val)}
                error={errors.gender}
                placeholder="Select Gender"
                options={[
                  { label: 'Female', value: 'female' },
                  { label: 'Male', value: 'male' },
                  { label: 'Non-Binary', value: 'non-binary' },
                  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
                ]}
                required
              />
            </div>

            {/* Passwords (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                required
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Action CTAs */}
            <div className="pt-4 border-t border-[#E7E4DF] flex items-center justify-between gap-4 mt-2">
              <Button
                type="button"
                variant="text"
                onClick={() => onNavigate('role-selection')}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="px-8"
              >
                Next: Hostel Details
              </Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
};

export default SignupBasicScreen;
