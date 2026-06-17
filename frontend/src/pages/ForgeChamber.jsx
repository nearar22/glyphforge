import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, FlaskConical } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import StepNavigator from '../components/forge/StepNavigator.jsx';
import { Btn, Panel } from '../components/ui/primitives.jsx';
import { useForgeDraft } from '../forge/ForgeContext.jsx';
import { ECOSYSTEMS, MATURITIES } from '../data/values.js';
import { DEMO_GENOMES } from '../data/demoGenomes.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function ForgeChamber() {
  const navigate = useNavigate();
  const toast = useToast();
  const { draft, update, loadDemo } = useForgeDraft();

  // The glyph reacts live to what has been declared so far.
  const seed = {
    primaryHue: 276,
    secondaryHue: 190,
    ringCount: 3,
    orbitCount: Math.max(3, draft.values.length || 3),
    riftIntensity: 0,
    glyphComplexity: Math.min(100, draft.protocolName.length * 4 + draft.mission.length / 3 + 25),
  };

  const canContinue = draft.protocolName.trim().length >= 2;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <StepNavigator />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="rune-label">forge chamber</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ether">Name the protocol</h1>
          <p className="mt-2 max-w-lg text-sm text-mist">
            Declare the identity you are about to forge. The glyph beside you stirs as you type.
          </p>

          <div className="mt-6 space-y-5">
            <Panel label="identity">
              <div className="space-y-4">
                <div>
                  <label className="rune-label mb-1.5 block">protocol name</label>
                  <input
                    value={draft.protocolName}
                    onChange={(e) => update({ protocolName: e.target.value })}
                    placeholder="e.g. AstraDAO"
                    className="field"
                    maxLength={60}
                  />
                </div>
                <div>
                  <label className="rune-label mb-1.5 block">short mission</label>
                  <textarea
                    value={draft.mission}
                    onChange={(e) => update({ mission: e.target.value })}
                    rows={3}
                    placeholder="What does this protocol exist to do?"
                    className="field resize-none"
                    maxLength={400}
                  />
                </div>
              </div>
            </Panel>

            <Panel label="context">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="rune-label mb-1.5 block">ecosystem type</label>
                  <select value={draft.ecosystem} onChange={(e) => update({ ecosystem: e.target.value })} className="field">
                    {ECOSYSTEMS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="rune-label mb-1.5 block">maturity</label>
                  <select value={draft.maturity} onChange={(e) => update({ maturity: e.target.value })} className="field">
                    {MATURITIES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Panel>

            <div className="flex flex-wrap gap-3">
              <Btn icon={ArrowRight} onClick={() => navigate('/forge/values')} disabled={!canContinue}>
                Continue to Value Orbit
              </Btn>
            </div>

            <Panel label="quick start" title="Load a demo protocol">
              <div className="grid gap-2 sm:grid-cols-2">
                {DEMO_GENOMES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      loadDemo(d);
                      toast.info(`Loaded ${d.protocolName}`);
                    }}
                    className="rounded-xl border border-line-bright bg-ultraviolet/30 p-3 text-left transition-colors hover:border-cyan/50"
                  >
                    <p className="font-display text-sm font-semibold text-ether">{d.protocolName}</p>
                    <p className="rune-label mt-1 normal-case tracking-normal text-mist">{d.ecosystem}</p>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* live glyph */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Panel label="living artifact" glow bodyClassName="flex flex-col items-center py-8">
            <motion.div
              key={draft.values.length}
              animate={{ scale: [0.98, 1] }}
              transition={{ duration: 0.4 }}
            >
              <GlyphCore seed={seed} size={300} />
            </motion.div>
            <p className="mt-4 text-center font-display text-lg font-semibold text-ether">
              {draft.protocolName || 'Unnamed protocol'}
            </p>
            <p className="rune-label mt-1">{draft.ecosystem} / {draft.maturity}</p>
            <div className="mt-4 flex items-center gap-2 text-mist">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs">The glyph grows as you compose the identity.</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
