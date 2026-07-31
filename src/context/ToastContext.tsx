import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'success', duration = 4000 }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type, duration };

    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Global Top-Right Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[16px] border shadow-xl transition-all duration-300 transform translate-y-0 animate-slideUp ${
                isSuccess
                  ? 'bg-white border-[#4CAF50]/40 text-[#1A1A1A] ring-1 ring-[#4CAF50]/20'
                  : isError
                  ? 'bg-white border-[#D9534F]/40 text-[#1A1A1A] ring-1 ring-[#D9534F]/20'
                  : 'bg-white border-[#996E7D]/40 text-[#1A1A1A] ring-1 ring-[#996E7D]/20'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  isSuccess
                    ? 'bg-[#E8F5E9] text-[#2E7D32]'
                    : isError
                    ? 'bg-[#FDF2F2] text-[#D9534F]'
                    : 'bg-[#F5EFF2] text-[#996E7D]'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                {isError && <AlertCircle className="w-5 h-5" />}
                {!isSuccess && !isError && <Sparkles className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="font-heading text-xs font-bold text-[#1A1A1A] tracking-tight">
                    {toast.title}
                  </h4>
                )}
                <p className="font-body text-xs text-[#555555] leading-snug mt-0.5">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-[#8E8E93] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] transition-colors shrink-0"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
