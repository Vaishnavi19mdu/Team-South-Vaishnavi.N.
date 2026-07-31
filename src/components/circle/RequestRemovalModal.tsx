import React, { useState } from 'react';
import { ShieldAlert, X, Send, AlertTriangle } from 'lucide-react';
import { useCircle, ModerationRequest } from '../../context/CircleContext';
import { useToast } from '../../context/ToastContext';

interface RequestRemovalModalProps {
  postId: string;
  postHostel: string;
  requestingWardenName: string;
  requestingWardenHostel: string;
  onClose: () => void;
}

export const RequestRemovalModal: React.FC<RequestRemovalModalProps> = ({
  postId,
  postHostel,
  requestingWardenName,
  requestingWardenHostel,
  onClose,
}) => {
  const { submitRemovalRequest } = useCircle();
  const { showToast } = useToast();

  const [reason, setReason] = useState<ModerationRequest['reason']>('Spam');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRemovalRequest(
      postId,
      reason,
      notes,
      requestingWardenName,
      requestingWardenHostel
    );

    showToast({
      title: 'Removal Request Submitted',
      message: `Your removal request for this ${postHostel} post has been sent to the ${postHostel} Warden for review.`,
      type: 'info',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] border border-[#E7E4DF] shadow-2xl max-w-md w-full p-6 relative animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[#E7E4DF]">
          <div className="w-10 h-10 rounded-full bg-[#FEF9E7] text-[#D97706] flex items-center justify-center border border-[#D97706]/20 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
              Request Post Removal
            </h3>
            <p className="font-body text-xs text-[#8E8E93]">
              Cross-Hostel Moderation Workflow
            </p>
          </div>
        </div>

        <div className="my-4 p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] text-xs font-body text-[#666666] space-y-1">
          <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
            Hostel Authority Boundary
          </p>
          <p>
            This post belongs to a resident of <span className="font-bold text-[#1A1A1A]">{postHostel}</span>. As a <span className="font-bold text-[#2A5C8A]">{requestingWardenHostel}</span> Warden, direct deletion is prohibited. Your request will be routed to the assigned <span className="font-bold text-[#1A1A1A]">{postHostel} Warden</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
          <div>
            <label className="font-bold text-[#1A1A1A] block mb-1">
              Primary Reason for Removal <span className="text-[#D9534F]">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ModerationRequest['reason'])}
              className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-white text-[#1A1A1A] font-medium outline-none"
            >
              <option value="Spam">Spam or Unsolicited Commercial Ad</option>
              <option value="Harassment">Harassment or Offensive Conduct</option>
              <option value="False Information">False Information or Panic Rumors</option>
              <option value="Inappropriate Content">Inappropriate Content or Policy Breach</option>
              <option value="Other">Other Policy Violation</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#1A1A1A] block mb-1">
              Additional Notes for {postHostel} Warden
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide context or specific violation details..."
              className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-[#1A1A1A] font-body outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E7E4DF] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E7E4DF] font-bold text-[#666666] hover:bg-[#FAF8F2] hover:text-[#1A1A1A] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#2A5C8A] text-white font-bold hover:bg-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestRemovalModal;
