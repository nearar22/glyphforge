import { createContext, useContext, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Sparkles };
const TONE = {
  success: 'border-emerald/40 text-emerald',
  error: 'border-crimson/40 text-crimson',
  info: 'border-cyan/40 text-cyan',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, kind = 'info', meta) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((t) => [...t, { id, message, kind, meta }]);
      setTimeout(() => dismiss(id), 5600);
    },
    [dismiss]
  );

  const api = {
    success: (m, meta) => push(m, 'success', meta),
    error: (m, meta) => push(m, 'error', meta),
    info: (m, meta) => push(m, 'info', meta),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[min(92vw,380px)] flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.kind] || Sparkles;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className={`glass pointer-events-auto flex items-start gap-3 border px-4 py-3.5 ${TONE[t.kind]}`}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-ether">{t.message}</p>
                  {t.meta && <p className="rune-label mt-1 truncate normal-case tracking-normal">{t.meta}</p>}
                </div>
                <button onClick={() => dismiss(t.id)} className="text-mist transition-colors hover:text-ether" aria-label="Dismiss">
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
