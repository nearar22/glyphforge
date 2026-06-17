import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { classNames } from '../../utils/formatters.js';

export const FORGE_STEPS = [
  { path: '/forge', label: 'Chamber' },
  { path: '/forge/values', label: 'Value Orbit' },
  { path: '/forge/rules', label: 'Rule Rings' },
  { path: '/forge/incentives', label: 'Incentives' },
  { path: '/forge/tension', label: 'Tension Rift' },
  { path: '/forge/reveal', label: 'Forge' },
];

// Horizontal ritual progress rail with luminous connectors.
export default function StepNavigator() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = Math.max(
    0,
    FORGE_STEPS.findIndex((s) => s.path === pathname)
  );

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {FORGE_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.path} className="flex shrink-0 items-center">
            <button
              onClick={() => i <= current && navigate(step.path)}
              disabled={i > current}
              className={classNames(
                'flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors',
                active ? 'text-cyan' : done ? 'text-mist hover:text-ether' : 'text-mist/40'
              )}
            >
              <span
                className={classNames(
                  'flex h-5 w-5 items-center justify-center rounded-full border text-[0.58rem]',
                  active
                    ? 'border-cyan bg-cyan/15 text-cyan'
                    : done
                      ? 'border-emerald/50 bg-emerald/15 text-emerald'
                      : 'border-line-bright text-mist/50'
                )}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
              {active && (
                <motion.span layoutId="step-dot" className="h-1 w-1 rounded-full bg-cyan" />
              )}
            </button>
            {i < FORGE_STEPS.length - 1 && (
              <span
                className={classNames(
                  'mx-0.5 h-px w-4 sm:w-6',
                  done ? 'bg-emerald/50' : 'bg-line-bright'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
