import React from 'react';
import { ShieldAlert, ArrowLeft, ChevronLeft, Clock, CheckCircle2, Building, Mail } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import Badge from '../../components/common/Badge';

export interface PendingApprovalScreenProps {
  onNavigate: (route: string) => void;
  userRole?: string;
  userEmail?: string;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  onNavigate,
  userRole = 'Warden / Staff',
  userEmail = 'staff.member@college.edu',
}) => {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FAF8F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg text-center">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm font-semibold text-[#666666] hover:text-[#996E7D] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </button>
        </div>

        <div className="flex justify-center mb-6 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo variant="navbar" size="lg" />
        </div>

        <Card className="shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] border border-[#E7E4DF] p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#F4B400]" />

          <div className="my-6 relative inline-flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#FFF8E1] border-2 border-[#F4B400]/40 flex items-center justify-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-[#F4B400] text-white flex items-center justify-center shadow-md">
                <Clock className="w-8 h-8" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-[#E7E4DF] shadow-xs">
              <ShieldAlert className="w-5 h-5 text-[#D97706]" />
            </div>
          </div>

          <div className="mb-4">
            <Badge variant="warning" size="md">
              <Clock className="w-3.5 h-3.5 mr-1" /> Request Under Review
            </Badge>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mb-3">
            Account Pending Verification
          </h1>

          <div className="space-y-3 font-body text-sm sm:text-base text-[#666666] leading-relaxed max-w-md mx-auto mb-8">
            <p className="font-semibold text-[#1A1A1A]">
              Your account has been created successfully.
            </p>
            <p>
              Your request has been sent to the Super Administrator for verification to ensure staff authorization across hostel blocks.
            </p>
            <p className="text-xs text-[#8E8E93]">
              You will be notified via email once your account has been approved by campus security administration.
            </p>
          </div>

          <div className="bg-[#FAF8F2] p-4 rounded-[12px] border border-[#E7E4DF] text-left text-xs mb-8 space-y-2">
            <div className="flex items-center justify-between text-[#666666]">
              <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-[#996E7D]" /> Requested Role:</span>
              <span className="font-bold text-[#1A1A1A] capitalize">{userRole}</span>
            </div>
            <div className="flex items-center justify-between text-[#666666]">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#2A5C8A]" /> Notification Email:</span>
              <span className="font-mono text-[#1A1A1A]">{userEmail}</span>
            </div>
            <div className="flex items-center justify-between text-[#666666]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" /> Submission Status:</span>
              <span className="font-semibold text-[#4CAF50]">Logged in Vaigai Queue</span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => onNavigate('login')}
            className="py-3"
          >
            Return to Login
          </Button>
        </Card>

        <p className="font-body text-xs text-[#8E8E93] mt-6">
          Need urgent authorization? Contact campus IT helpdesk at <span className="underline">support@college.edu</span>
        </p>
      </div>
    </div>
  );
};

export default PendingApprovalScreen;