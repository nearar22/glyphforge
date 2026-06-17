import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus, Check } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import StepNavigator from '../components/forge/StepNavigator.jsx';
import { Btn, Panel } from '../components/ui/primitives.jsx';
import { useForgeDraft } from '../forge/ForgeContext.jsx';
import { VALUES } from '../data/values.js';
import { classNames } from '../utils/formatters.js';

export default function ValueOrbit() {
  const navigate = useNavigate();
  const { draft, update } = useForgeDraft();

  function toggle(v) {
    const has = draft.values.includes(v);
    update({ values: has ? draft.values.filter((x) => x !== v) : [...draft.values, v] });
  }

  const seed = {
    primaryHue: 276,
    secondaryHue: 190,
    ringCount: 3,
    orbitCount: Math.max(3, draft.values.length),
    riftIntensity: 0,
    glyphComplexity: Math.min(100, 30 + draft.values.length * 8),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <StepNavigator />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="rune-label">value orbit</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ether">Choose the values</h1>
          <p className="mt-2 max-w-lg text-sm text-mist">
            Pull values into orbit. Each becomes a satellite around the core. Selected
            <span className="text-cyan"> {draft.values.length}</span>.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {VALUES.map((v, i) => {
              const active = draft.values.includes(v.key);
              return (
                <motion.button
                  key={v.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => toggle(v.key)}
                  title={v.gloss}
                  className={classNames(
                    'group flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all',
                    active
                      ? 'border-cyan bg-cyan/15 text-cyan'
                      : 'border-line-bright text-mist hover:border-violet hover:text-ether'
                  )}
                >
                  <span
                    className={classNames(
                      'flex h-4 w-4 items-center justify-center rounded-full border',
                      active ? 'border-cyan bg-cyan text-abyss' : 'border-line-bright'
                    )}
                  >
                    {active ? <Check className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5 opacity-50" />}
                  </span>
                  {v.key}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            <Btn variant="ghost" icon={ArrowLeft} onClick={() => navigate('/forge')}>
              Back
            </Btn>
            <Btn icon={ArrowRight} onClick={() => navigate('/forge/rules')} disabled={draft.values.length === 0}>
              Continue to Rule Rings
            </Btn>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Panel label="orbit forming" glow bodyClassName="flex flex-col items-center py-8">
            <GlyphCore seed={seed} size={280} />
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {draft.values.map((v) => (
                <span key={v} className="rounded-md border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-cyan">
                  {v}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
