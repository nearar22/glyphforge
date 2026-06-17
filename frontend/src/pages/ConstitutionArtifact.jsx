import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Download, ScrollText } from 'lucide-react';
import { Btn, Panel, EmptyState } from '../components/ui/primitives.jsx';
import { fetchGenome } from '../lib/contract.js';
import { getArchived } from '../lib/archive.js';
import { useToast } from '../components/ui/Toast.jsx';

// Floating constitutional tablets made of light.
function Tablet({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 120, damping: 18 }}
      className="glass relative overflow-hidden p-6"
      style={{ boxShadow: '0 0 50px -24px rgba(109,40,217,0.5), inset 0 1px 0 rgba(167,139,220,0.12)' }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      <p className="rune-label text-cyan">{title}</p>
      <div className="mt-3">{children}</div>
    </motion.div>
  );
}

export default function ConstitutionArtifact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [genome, setGenome] = useState(getArchived(id));

  useEffect(() => {
    fetchGenome(id).then((g) => {
      const local = getArchived(id);
      setGenome({ ...local, ...g });
    }).catch(() => {});
  }, [id]);

  if (!genome) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={ScrollText} title="Constitution unavailable" message="This genome could not be loaded." action={<Btn onClick={() => navigate('/archive')}>Back to archive</Btn>} />
      </div>
    );
  }

  const c = genome.constitution || {};

  const fullText = buildText(genome, c);

  function copyText() {
    navigator.clipboard?.writeText(fullText);
    toast.success('Constitution copied');
  }
  function exportJson() {
    const blob = new Blob([JSON.stringify(genome, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${genome.protocolName || 'genome'}-constitution.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.info('Exported JSON');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate(`/genome/${id}`)}
        className="mb-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-mist transition-colors hover:text-ether"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> back to artifact
      </button>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rune-label">constitution artifact</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ether">{genome.protocolName}</h1>
          <p className="mt-1 text-sm text-mist">A constitution composed from the forged genome.</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" icon={Copy} onClick={copyText}>Copy</Btn>
          <Btn variant="ghost" icon={Download} onClick={exportJson}>Export JSON</Btn>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {c.mission && (
          <Tablet title="Mission">
            <p className="text-base leading-relaxed text-ether">{c.mission}</p>
          </Tablet>
        )}
        <Tablet title="Core Values" delay={0.05}>
          <div className="flex flex-wrap gap-2">
            {(c.coreValues?.length ? c.coreValues : genome.values).map((v) => (
              <span key={v} className="rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-cyan">{v}</span>
            ))}
          </div>
        </Tablet>
        <Tablet title="Non-negotiable Rules" delay={0.1}>
          <ul className="space-y-2">
            {(c.nonNegotiableRules?.length ? c.nonNegotiableRules : genome.rules).map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-ether">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {r}
              </li>
            ))}
            {(!c.nonNegotiableRules?.length && genome.rules.length === 0) && (
              <li className="text-sm text-mist">No hard rules declared.</li>
            )}
          </ul>
        </Tablet>
        <Tablet title="Forbidden Behaviors" delay={0.15}>
          <div className="flex flex-wrap gap-2">
            {(c.forbiddenBehaviors?.length ? c.forbiddenBehaviors : genome.taboos).map((v) => (
              <span key={v} className="rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1 text-sm text-crimson">{v}</span>
            ))}
          </div>
        </Tablet>
        {c.publicPledge && (
          <Tablet title="Public Pledge" delay={0.2}>
            <p className="text-base italic leading-relaxed text-ether">{c.publicPledge}</p>
          </Tablet>
        )}
      </div>
    </div>
  );
}

function buildText(genome, c) {
  const lines = [];
  lines.push(`${genome.protocolName} Constitution`);
  lines.push(`Archetype: ${genome.archetype}`);
  lines.push('');
  if (c.mission) lines.push(`Mission: ${c.mission}`, '');
  lines.push('Core Values:');
  (c.coreValues?.length ? c.coreValues : genome.values).forEach((v) => lines.push(`- ${v}`));
  lines.push('', 'Non-negotiable Rules:');
  (c.nonNegotiableRules?.length ? c.nonNegotiableRules : genome.rules).forEach((r) => lines.push(`- ${r}`));
  lines.push('', 'Forbidden Behaviors:');
  (c.forbiddenBehaviors?.length ? c.forbiddenBehaviors : genome.taboos).forEach((v) => lines.push(`- ${v}`));
  if (c.publicPledge) lines.push('', `Public Pledge: ${c.publicPledge}`);
  return lines.join('\n');
}
