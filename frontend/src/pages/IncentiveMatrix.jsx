import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Ban } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import StepNavigator from '../components/forge/StepNavigator.jsx';
import { Btn, Panel } from '../components/ui/primitives.jsx';
import { useForgeDraft } from '../forge/ForgeContext.jsx';
import { INCENTIVES, TABOOS } from '../data/values.js';
import { classNames } from '../utils/formatters.js';

export default function IncentiveMatrix() {
  const navigate = useNavigate();
  const { draft, update } = useForgeDraft();

  function toggleIncentive(v) {
    const has = draft.incentives.includes(v);
    update({ incentives: has ? draft.incentives.filter((x) => x !== v) : [...draft.incentives, v] });
  }
  function toggleTaboo(v) {
    const has = draft.taboos.includes(v);
    update({ taboos: has ? draft.taboos.filter((x) => x !== v) : [...draft.taboos, v] });
  }

  const seed = {
    primaryHue: 276,
    secondaryHue: 190,
    ringCount: Math.max(3, Math.min(8, draft.rules.length + 2)),
    orbitCount: Math.max(3, draft.values.length),
    riftIntensity: 0,
    glyphComplexity: Math.min(100, 30 + (draft.values.length + draft.rules.length + draft.incentives.length) * 5),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <StepNavigator />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="rune-label">incentive matrix</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ether">What it rewards, what it forbids</h1>
          <p className="mt-2 max-w-lg text-sm text-mist">
            Incentives feed the glyph as energy streams. Taboos are the behaviors the protocol
            refuses. Both shape how the genome reads.
          </p>

          <div className="mt-6">
            <p className="rune-label mb-2 text-cyan">incentives</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {INCENTIVES.map((v, i) => {
                const active = draft.incentives.includes(v);
                return (
                  <motion.button
                    key={v}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => toggleIncentive(v)}
                    className={classNames(
                      'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-all',
                      active ? 'border-emerald bg-emerald/12 text-emerald' : 'border-line-bright text-mist hover:text-ether'
                    )}
                  >
                    {active && <Check className="h-3 w-3 shrink-0" />}
                    {v}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="rune-label mb-2 text-crimson">taboos</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TABOOS.map((v, i) => {
                const active = draft.taboos.includes(v);
                return (
                  <motion.button
                    key={v}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => toggleTaboo(v)}
                    className={classNames(
                      'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-all',
                      active ? 'border-crimson bg-crimson/12 text-crimson' : 'border-line-bright text-mist hover:text-ether'
                    )}
                  >
                    {active && <Ban className="h-3 w-3 shrink-0" />}
                    {v}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Btn variant="ghost" icon={ArrowLeft} onClick={() => navigate('/forge/rules')}>
              Back
            </Btn>
            <Btn icon={ArrowRight} onClick={() => navigate('/forge/tension')}>
              Continue to Tension Rift
            </Btn>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Panel label="streams feeding" glow bodyClassName="flex flex-col items-center py-8">
            <GlyphCore seed={seed} size={280} />
            <div className="mt-4 grid w-full grid-cols-2 gap-3 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-emerald">{draft.incentives.length}</p>
                <p className="rune-label">incentives</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-crimson">{draft.taboos.length}</p>
                <p className="rune-label">taboos</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
