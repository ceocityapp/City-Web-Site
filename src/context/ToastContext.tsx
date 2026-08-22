"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (t: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "bg-primary text-white border-primary/20",
  error: "bg-destructive text-white border-destructive/20",
  warning: "bg-amber-500 text-white border-amber-300",
  info: "bg-foreground text-white border-foreground/20",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      // Limit to 4 visible toasts — drop oldest if exceeded
      const next = [...prev, { ...t, id }];
      return next.length > 4 ? next.slice(-4) : next;
    });
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const success = useCallback((title: string, description?: string) =>
    toast({ type: "success", title, description }), [toast]);
  const error = useCallback((title: string, description?: string) =>
    toast({ type: "error", title, description }), [toast]);
  const warning = useCallback((title: string, description?: string) =>
    toast({ type: "warning", title, description }), [toast]);
  const info = useCallback((title: string, description?: string) =>
    toast({ type: "info", title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              role={t.type === "error" ? "alert" : "status"}
              aria-live={t.type === "error" ? "assertive" : "polite"}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[280px] max-w-sm animate-in slide-in-from-bottom-4 fade-in ${colors[t.type]}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{t.title}</p>
                {t.description && <p className="text-xs opacity-90 mt-0.5">{t.description}</p>}
              </div>
              <button onClick={() => remove(t.id)} aria-label="Cerrar notificación" className="opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
