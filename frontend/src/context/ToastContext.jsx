import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'success', duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast({ message: msg, type: 'success', duration: dur }),
    error: (msg, dur) => addToast({ message: msg, type: 'error', duration: dur }),
    info: (msg, dur) => addToast({ message: msg, type: 'info', duration: dur }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto relative overflow-hidden rounded-2xl border border-border/20 bg-surface/95 text-fg p-3.5 shadow-elevated backdrop-blur-xl animate-fade-in-up flex items-start gap-3"
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-brand" />}
            </div>

            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-muted hover:text-fg transition p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Bottom Progress Bar */}
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-brand"
              style={{
                width: '100%',
                animation: `shimmer ${t.duration}ms linear forwards`,
              }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      success: (msg) => console.log('[Toast Success]:', msg),
      error: (msg) => console.error('[Toast Error]:', msg),
      info: (msg) => console.log('[Toast Info]:', msg),
    };
  }
  return context;
}
