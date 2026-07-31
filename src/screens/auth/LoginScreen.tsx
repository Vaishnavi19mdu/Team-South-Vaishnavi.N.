import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Divider from '../../components/common/Divider';
import Logo from '../../components/common/Logo';
import Snackbar from '../../components/common/Snackbar';
import { isValidEmail } from '../../utils/helpers/validators';
import { useAuth } from '../../context/AuthContext';
import { logInWithGoogle } from '../../services/authService';
import { UserProfile } from '../../types/auth';

export interface LoginScreenProps {
  onNavigate: (route: string) => void;
  onLoginSuccess?: (email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'info' as 'success' | 'error' | 'info' });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Decides where a signed-in profile should land, based on real
  // Firestore data (not email keyword guessing).
  const routeForProfile = (profile: UserProfile): string => {
    if (profile.status === 'rejected') return 'login';
    if (profile.status === 'pending') return 'pending-approval';
    if (profile.isAdmin) return 'superadmin-dashboard';
    return `${profile.role}-dashboard`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!email) {
      setEmailError('Please enter your email address');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const profile = await login(email, password);
      onLoginSuccess?.(email);

      if (profile.status === 'rejected') {
        setSnackbar({
          isOpen: true,
          message: 'Your account request was not approved. Contact the campus IT helpdesk for details.',
          type: 'error',
        });
        return;
      }

      setSnackbar({
        isOpen: true,
        message: 'Successfully authenticated. Welcome back to Project Vaigai!',
        type: 'success',
      });
      onNavigate(routeForProfile(profile));
    } catch (err: any) {
      setPasswordError('Incorrect email or password');
      setSnackbar({
        isOpen: true,
        message: err?.message ?? 'Could not sign in. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { profile } = await logInWithGoogle();

      if (!profile) {
        // First-time Google sign-in: no Firestore profile yet, so this
        // person still needs to pick a role and finish onboarding.
        setSnackbar({
          isOpen: true,
          message: 'Almost there — pick a role to finish setting up your account.',
          type: 'info',
        });
        onNavigate('role-selection');
        return;
      }

      if (profile.status === 'rejected') {
        setSnackbar({
          isOpen: true,
          message: 'Your account request was not approved. Contact the campus IT helpdesk for details.',
          type: 'error',
        });
        return;
      }

      setSnackbar({
        isOpen: true,
        message: 'Google Single Sign-On successful.',
        type: 'success',
      });
      onLoginSuccess?.(profile.email);
      onNavigate(routeForProfile(profile));
    } catch (err: any) {
      setSnackbar({
        isOpen: true,
        message: err?.message ?? 'Google sign-in failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      setSnackbar({
        isOpen: true,
        message: 'Please enter a valid college email address.',
        type: 'error',
      });
      return;
    }
    setShowForgotModal(false);
    setSnackbar({
      isOpen: true,
      message: `Password reset instructions sent to ${forgotEmail}`,
      type: 'success',
    });
    setForgotEmail('');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FAF8F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        
        {/* Minimal Top Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#996E7D] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
        </div>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 cursor-pointer" onClick={() => onNavigate('landing')}>
            <Logo variant="navbar" size="lg" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Sign In to Project Vaigai
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#666666] mt-1.5">
            Centralized Smart Hostel Operations & Emergency Platform
          </p>
        </div>

        {/* Centered Login Card */}
        <Card className="shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] border border-[#E7E4DF]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <Input
              label="College Email Address"
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              leftIcon={<Mail className="w-5 h-5 text-[#8E8E93]" />}
              required
            />

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-body text-xs sm:text-sm font-medium text-[#1A1A1A]">
                  Password <span className="text-[#D9534F]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-body text-xs font-semibold text-[#996E7D] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <PasswordInput
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                error={passwordError}
                required
              />
            </div>

            {/* Primary Sign In Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <Divider text="OR" />

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="google"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={isLoading}
            leftIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            }
          >
            Continue with Google
          </Button>

          {/* Footer Toggle */}
          <div className="mt-6 pt-5 border-t border-[#E7E4DF] text-center">
            <p className="font-body text-xs sm:text-sm text-[#666666]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('role-selection')}
                className="font-semibold text-[#996E7D] hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>
        </Card>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-xs text-[#8E8E93]">
          <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
          <span>Protected by Campus Single-Sign-On Security</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-[20px] max-w-sm w-full p-6 shadow-2xl border border-[#E7E4DF] animate-in zoom-in-95 duration-200">
            <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-2">
              Reset Password
            </h3>
            <p className="font-body text-xs text-[#666666] mb-4">
              Enter your registered college email address to receive a secure reset link.
            </p>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="college.email@college.edu"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-[#8E8E93]" />}
                required
              />

              <div className="flex items-center justify-end gap-3 mt-2">
                <Button
                  type="button"
                  variant="text"
                  size="sm"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snackbar Feedback */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
};

export default LoginScreen;