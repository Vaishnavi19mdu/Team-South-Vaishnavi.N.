import React from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  X,
  FileText,
  Building,
  Shield,
  Wrench,
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { WorkPass, TimelineStep } from '../../context/WorkPassContext';

interface ComplaintTimelineModalProps {
  pass: WorkPass;
  onClose: () => void;
}

export const ComplaintTimelineModal: React.FC<ComplaintTimelineModalProps> = ({
  pass,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-xl w-full p-6 space-y-5 border border-[#E7E4DF] shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#996E7D] uppercase">
                Interactive Audit Trail
              </span>
              <Badge variant="secondary" size="sm">
                {pass.complaintId}
              </Badge>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
              Complaint & Work Pass Timeline
            </h3>
            <p className="font-body text-xs text-[#666666]">
              {pass.complaintTitle} • {pass.room}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#FAF8F2] text-[#666666] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUMMARY CARD */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E7E4DF] grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#8E8E93] text-[10px] block uppercase font-bold">Technician</span>
            <strong className="text-[#1A1A1A]">{pass.employeeName}</strong> ({pass.employeeId})
          </div>
          <div>
            <span className="text-[#8E8E93] text-[10px] block uppercase font-bold">Work Pass Status</span>
            <strong className="text-[#2E7D32]">{pass.status}</strong> ({pass.id})
          </div>
        </div>

        {/* STEP TIMELINE LIST */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E4DF]">
          {pass.timeline.map((step, idx) => (
            <div key={step.id} className="relative flex items-start justify-between gap-4">
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-all ${
                  step.completed
                    ? 'border-[#2E7D32] text-[#2E7D32] shadow-xs'
                    : idx === pass.timeline.findIndex((s) => !s.completed)
                    ? 'border-[#996E7D] text-[#996E7D] animate-pulse'
                    : 'border-[#CCCCCC] text-[#CCCCCC]'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 fill-[#2E7D32] text-white" />
                ) : (
                  <Circle className="w-3 h-3 fill-current" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <h4
                  className={`font-heading text-xs font-bold ${
                    step.completed
                      ? 'text-[#1A1A1A]'
                      : idx === pass.timeline.findIndex((s) => !s.completed)
                      ? 'text-[#996E7D]'
                      : 'text-[#8E8E93]'
                  }`}
                >
                  Step {step.id}: {step.label}
                </h4>
                {step.completed ? (
                  <p className="text-[11px] text-[#2E7D32] font-semibold mt-0.5">
                    Completed ✓ {step.time ? `(${step.time})` : ''}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#8E8E93] mt-0.5">Pending Action...</p>
                )}
              </div>

              {step.time && (
                <span className="text-[10px] font-mono text-[#8E8E93] shrink-0 bg-[#FAF8F2] px-2 py-0.5 rounded-md border border-[#E7E4DF]">
                  {step.time}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#E7E4DF] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold hover:bg-[#333333] transition-colors"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintTimelineModal;
