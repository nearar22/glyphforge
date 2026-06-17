import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus, Trash2, Lock, Shield, Feather } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import StepNavigator from '../components/forge/StepNavigator.jsx';
import { Btn, Panel } from '../components/ui/primitives.jsx';
import { useForgeDraft } from '../forge/ForgeContext.jsx';
import { PRESET_RULES, RULE_WEIGHTS } from '../data/values.js';
import { classNames } from '../utils/formatters.js';

const WEIGHT_ICON = { 'Soft Principle': Feather, 'Strong Rule': Shield, 'Sacred Constraint': Lock };
const WEIGHT_TONE = { 'Soft Principle': '#A78BC0', 'Strong Rule': '#22D3EE', 'Sacred Constraint': '#FFD166' };

export default function RuleRings() {
  const navigate = useNavigate();
  const { draft, update } = useForgeDraft();
  const [custom, setCustom] = useState('');

  const rules = draft.rules;

  function addRule(text, weight = 'Strong Rule') {
    const t = text.trim();
    if (!t || rules.some((r) => r.text === t)) return;
    update({ rules: [...rules, { text: t, weight }] });
  }
  function removeRule(text) {
    update({ rules: rules.filter((r) => r.text !== text) });
  }
  function cycleWeight(text) {
    update({
      rules: rules.map((r) => {
        if (r.text !== text) return r;
        const i = RULE_WEIGHTS.indexOf(r.weight);
        return { ...r, weight: RULE_WEIGHTS[(i + 1) % RULE_WEIGHTS.length] };
      }),
    });
  }

  const seed = {
    primaryHue: 276,
    secondaryHue: 190,
    ringCount: Math.max(3, Math.min(8, rules.length + 2)),
    orbitCount: Math.max(3, draft.values.length),
    riftIntensity: 0,
    glyphComplexity: Math.min(100, 30 + (draft.values.length + rules.length) * 6),
  };

  const available = PRESET_RULES.filter((p) => !rules.some((r) => r.text === p));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <StepNavigator />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="rune-label">rule rings</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ether">Bind the hard rules</h1>
          <p className="mt-2 max-w-lg text-sm text-mist">
            Each rule becomes a ring around the glyph. Tap a rule's weight to cycle from soft
            principle to sacred constraint.
          </p>

          {/* selected rules */}
          <div className="mt-6 space-y-2">
            {rules.length === 0 && (
              <p className="rounded-xl border border-dashed border-line-bright px-4 py-6 text-center text-sm text-mist">
                No rules bound yet. Add presets or write your own below.
              </p>
            )}
            {rules.map((r, i) => {
              const Icon = WEIGHT_ICON[r.weight];
              const tone = WEIGHT_TONE[r.weight];
              return (
                <motion.div
                  key={r.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 rounded-xl border border-line bg-void/40 px-3 py-2.5"
                >
                  <button
                    onClick={() => cycleWeight(r.text)}
                    className="flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.12em]"
                    style={{ borderColor: `${tone}66`, color: tone, background: `${tone}14` }}
                  >
                    <Icon className="h-3 w-3" />
                    {r.weight.split(' ')[0]}
                  </button>
                  <span className="min-w-0 flex-1 truncate text-sm text-ether">{r.text}</span>
                  <button onClick={() => removeRule(r.text)} className="text-mist transition-colors hover:text-crimson">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* custom input */}
          <div className="mt-4 flex gap-2">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addRule(custom);
                  setCustom('');
                }
              }}
              placeholder="Write a custom rule and press enter"
              className="field"
              maxLength={120}
            />
            <Btn
              variant="ghost"
              icon={Plus}
              onClick={() => {
                addRule(custom);
                setCustom('');
              }}
            >
              Add
            </Btn>
          </div>

          {/* presets */}
          {available.length > 0 && (
            <div className="mt-4">
              <p className="rune-label mb-2">preset rules</p>
              <div className="flex flex-wrap gap-2">
                {available.map((p) => (
                  <button
                    key={p}
                    onClick={() => addRule(p)}
                    className="rounded-full border border-line-bright px-3 py-1.5 text-xs text-mist transition-colors hover:border-violet hover:text-ether"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Btn variant="ghost" icon={ArrowLeft} onClick={() => navigate('/forge/values')}>
              Back
            </Btn>
            <Btn icon={ArrowRight} onClick={() => navigate('/forge/incentives')}>
              Continue to Incentives
            </Btn>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Panel label="rings binding" glow bodyClassName="flex flex-col items-center py-8">
            <GlyphCore seed={seed} size={280} />
            <p className="rune-label mt-4">{rules.length} ring{rules.length === 1 ? '' : 's'} bound</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
