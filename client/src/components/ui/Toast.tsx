/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

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
      {/* On mobile: above the bottom nav (bottom-20). On desktop: bottom-4 right-4 */}
      <div className="fixed bottom-20 left-4 right-4 z-[100] space-y-2 lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-sm lg:w-full pointer-events-none">
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
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const config: Record<ToastType, { icon: string; bg: string; iconBg: string; border: string }> = {
    success: {
      icon: "✓",
      bg: "bg-white",
      iconBg: "bg-emerald-500",
      border: "border-l-emerald-500",
    },
    error: {
      icon: "✕",
      bg: "bg-white",
      iconBg: "bg-red-500",
      border: "border-l-red-500",
    },
    info: {
      icon: "i",
      bg: "bg-white",
      iconBg: "bg-blue-500",
      border: "border-l-blue-500",
    },
    warning: {
      icon: "!",
      bg: "bg-white",
      iconBg: "bg-amber-500",
      border: "border-l-amber-500",
    },
  };

  const c = config[toast.type];

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
        border border-surface-100 border-l-4 ${c.border}
        ${c.bg} shadow-elevated toast-enter
      `}
    >
      <span
        className={`flex-shrink-0 w-6 h-6 rounded-full ${c.iconBg} text-white text-xs flex items-center justify-center font-bold`}
      >
        {c.icon}
      </span>
      <p className="text-sm font-medium text-surface-900 flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={onRemove}
        className="text-surface-400 hover:text-surface-600 transition-colors cursor-pointer flex-shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
