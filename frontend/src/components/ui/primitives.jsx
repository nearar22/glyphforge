import { motion } from 'framer-motion';
import { classNames } from '../../utils/formatters.js';

export function Btn({ children, variant = 'primary', type = 'button', disabled, onClick, icon: Icon, full, className = '' }) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={classNames('btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', full && 'w-full', className)}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </motion.button>
  );
}

export function Panel({ label, title, action, children, glow, className = '', bodyClassName = '' }) {
  return (
    <section className={classNames('glass', glow && 'glass-glow', className)}>
      {(label || title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {label && <p className="rune-label">{label}</p>}
            {title && <h2 className="mt-1 truncate font-display text-base font-semibold text-ether">{title}</h2>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={classNames('px-5 py-5', bodyClassName)}>{children}</div>
    </section>
  );
}

export function Meter({ value, label, tone = '#22D3EE', sub }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-center justify-between">
        {label && <span className="rune-label">{label}</span>}
        <span className="font-mono text-xs text-ether">{Math.round(pct)}{sub}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ultraviolet/60">
        <motion.div
          className="h-full rounded-full"
          style={{ background: tone, boxShadow: `0 0 12px ${tone}` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {Icon && (
        <div className="relative rounded-2xl border border-line-bright bg-ultraviolet/40 p-4 text-mist">
          <Icon className="h-7 w-7" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan animate-pulse-core" />
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-ether">{title}</h3>
      {message && <p className="max-w-sm text-sm text-mist">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '', height = 16 }) {
  return (
    <div
      className={classNames('rounded-lg', className)}
      style={{
        height,
        background: 'linear-gradient(90deg, rgba(51,32,90,0.4) 25%, rgba(74,46,128,0.6) 50%, rgba(51,32,90,0.4) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2.4s linear infinite',
      }}
    />
  );
}

export function Chip({ children, tone = '#A78BC0', filled }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]"
      style={{
        borderColor: `${tone}66`,
        color: tone,
        background: filled ? `${tone}1a` : 'transparent',
      }}
    >
      {children}
    </span>
  );
}
