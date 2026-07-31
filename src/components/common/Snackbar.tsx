import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface SnackbarProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  isOpen: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  type = 'info',
  message,
  isOpen,
  onClose,
  autoHideDuration = 4000,
}) => {
  useEffect(() => {
    if (isOpen && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoHideDuration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      bg: 'bg-[#E8F5E9] border-[#4CAF50]/30 text-[#2E7D32]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />,
    },
    error: {
      bg: 'bg-[#FDF2F2] border-[#D9534F]/30 text-[#C62828]',
      icon: <AlertCircle className="w-5 h-5 text-[#D9534F]" />,
    },
    info: {
      bg: 'bg-[#F0F4F8] border-[#9EB8D2]/30 text-[#2A5C8A]',
      icon: <Info className="w-5 h-5 text-[#9EB8D2]" />,
    },
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-[12px] border shadow-lg ${typeConfig.bg}`}>
        <span className="shrink-0 mt-0.5">{typeConfig.icon}</span>
        <div className="flex-1 text-sm font-medium leading-snug">{message}</div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-current opacity-70" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
