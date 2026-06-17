import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlyphCore from '../glyph/GlyphCore.jsx';
import { statusName } from '../../lib/tx.js';

const PHASES = [
  'Submitting to the forge',
  'Leader interpreting principles',
  'Validators re-running the analysis',
  'Reaching consensus on the archetype',
  'Sealing the artifact on-chain',
];

// The ritual loading state shown while the genome forges under consensus.
export default function LoadingForge({ liveStatus, draft, seed }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => Math.min(p + 1, PHASES.length - 1)), 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <motion.div
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="relative"
      >
        <GlyphCore seed={{ ...seed, riftIntensity: 30 }} size={300} />
        <div className="pointer-events-none absolute inset-0 animate-pulse-core rounded-full" style={{ boxShadow: '0 0 80px -10px rgba(34,211,238,0.5)' }} />
      </motion.div>

      <div className="w-full max-w-sm space-y-2">
        {PHASES.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full transition-colors ${
                i < phase ? 'bg-emerald' : i === phase ? 'bg-cyan animate-pulse-core' : 'bg-line-bright'
              }`}
            />
            <span className={`font-mono text-xs transition-colors ${i <= phase ? 'text-ether' : 'text-mist/40'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {liveStatus && (
        <p className="rune-label">network status / {statusName(liveStatus)}</p>
      )}

      {draft && draft.archetypeAffinity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-cyan/30 bg-cyan/8 px-4 py-3 text-center"
        >
          <p className="rune-label text-cyan">leader draft, sealing under consensus</p>
          <p className="mt-1 text-sm text-ether">
            The jury is converging on this genome. The final result is read from the chain once
            consensus accepts it.
          </p>
        </motion.div>
      )}
    </div>
  );
}
