/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon, ShieldCheckIcon } from "../Icons";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  addToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-4 right-4 z-[100] space-y-2 sm:bottom-5 sm:left-auto sm:right-5 sm:w-full sm:max-w-sm">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4500);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const config: Record<
    ToastType,
    { label: string; icon: typeof CheckCircleIcon; iconClass: string; bg: string }
  > = {
    success: {
      label: "Done",
      icon: CheckCircleIcon,
      iconClass: "text-primary-700",
      bg: "bg-primary-50",
    },
    error: {
      label: "Couldn’t do that",
      icon: AlertTriangleIcon,
      iconClass: "text-danger-600",
      bg: "bg-danger-50",
    },
    info: {
      label: "Update",
      icon: ClockIcon,
      iconClass: "text-info-600",
      bg: "bg-info-50",
    },
    warning: {
      label: "Heads up",
      icon: ShieldCheckIcon,
      iconClass: "text-warning-600",
      bg: "bg-warning-50",
    },
  };

  const c = config[toast.type];
  const Icon = c.icon;

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-surface-200 bg-white px-3.5 py-3 shadow-elevated toast-enter"
      role="status"
    >
      <span className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${c.bg}`}>
        <Icon size={17} className={c.iconClass} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-bold text-surface-500">{c.label}</p>
        <p className="mt-0.5 text-[13px] font-semibold leading-snug text-surface-900">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="-mr-1 flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-800"
        aria-label="Dismiss notification"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
