import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Zap, ShieldCheck } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import StepNavigator from '../components/forge/StepNavigator.jsx';
import { Btn, Panel, Chip } from '../components/ui/primitives.jsx';
import { useForgeDraft } from '../forge/ForgeContext.jsx';
import { previewTensions, riftFromTensions } from '../utils/contradictionPreview.js';
import { severityColor } from '../utils/formatters.js';

export default function TensionRift() {
  const navigate = useNavigate();
  const { draft } = useForgeDraft();

  const tensions = previewTensions(draft.values, draft.incentives);
  const rift = riftFromTensions(tensions);

  const seed = {
    primaryHue: 276,
    secondaryHue: 190,
    ringCount: Math.max(3, Math.min(8, draft.rules.length + 2)),
    orbitCount: Math.max(3, draft.values.length),
    riftIntensity: rift,
    glyphComplexity: Math.min(100, 30 + (draft.values.length + draft.rules.length) * 6),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <StepNavigator />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="rune-label">tension rift</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ether">Where principles pull apart</h1>
          <p className="mt-2 max-w-lg text-sm text-mist">
            This is a live preview from your selections. The authoritative tensions are detected by
            the GenLayer jury when you forge.
          </p>

          <div className="mt-6 space-y-3">
            {tensions.length === 0 ? (
              <Panel bodyClassName="flex flex-col items-center gap-2 py-10 text-center">
                <ShieldCheck className="h-7 w-7 text-emerald" />
                <h3 className="font-display text-lg font-semibold text-ether">No obvious rifts</h3>
                <p className="max-w-sm text-sm text-mist">
                  Your selections look internally coherent so far. The jury may still surface
                  subtler tensions when it forges the genome.
                </p>
              </Panel>
            ) : (
              tensions.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-line bg-void/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-base font-semibold text-ether">{t.name}</h3>
                    <Chip tone={severityColor(t.severity)} filled>
                      {t.severity}
                    </Chip>
                  </div>
                  <p className="mt-1.5 text-sm text-mist">{t.reason}</p>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <Btn variant="ghost" icon={ArrowLeft} onClick={() => navigate('/forge/incentives')}>
              Back
            </Btn>
            <Btn icon={ArrowRight} onClick={() => navigate('/forge/reveal')}>
              Forge the Genome
            </Btn>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Panel label="rift forming" glow bodyClassName="flex flex-col items-center py-8">
            <GlyphCore seed={seed} size={280} />
            <div className="mt-4 flex items-center gap-2">
              <Zap className="h-4 w-4" style={{ color: rift > 50 ? '#EF476F' : '#FFD166' }} />
              <span className="rune-label">rift intensity {rift}</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
