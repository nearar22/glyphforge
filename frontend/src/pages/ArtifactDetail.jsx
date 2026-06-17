import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ScrollText, Copy, Zap, Sparkles, Trash2 } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import GenomeScorePanel from '../components/genome/GenomeScorePanel.jsx';
import { Btn, Panel, Chip, EmptyState } from '../components/ui/primitives.jsx';
import GenLayerProofBadge from '../components/ui/GenLayerProofBadge.jsx';
import { fetchGenome } from '../lib/contract.js';
import { getArchived, saveToArchive, removeFromArchive } from '../lib/archive.js';
import { loreFor } from '../data/archetypes.js';
import { genomeStatus, statusTone, severityColor } from '../utils/formatters.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function ArtifactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [genome, setGenome] = useState(getArchived(id));
  const [loading, setLoading] = useState(!getArchived(id));

  useEffect(() => {
    let alive = true;
    fetchGenome(id)
      .then((g) => {
        if (!alive) return;
        const local = getArchived(id);
        const merged = { ...local, ...g, txHash: local?.txHash || g.txHash || '' };
        setGenome(merged);
        saveToArchive(merged, merged.txHash);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (!genome && !loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={Sparkles}
          title="Genome not found"
          message="This artifact is not on-chain or in your archive."
          action={<Btn onClick={() => navigate('/archive')}>Back to archive</Btn>}
        />
      </div>
    );
  }
  if (!genome) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-mist">Loading artifact...</div>;
  }

  const lore = loreFor(genome.archetype);
  const status = genomeStatus(genome);

  function remove() {
    removeFromArchive(genome.id);
    toast.info('Removed from local archive');
    navigate('/archive');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-mist transition-colors hover:text-ether"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> back
      </button>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* glyph + identity */}
        <div className="space-y-4">
          <Panel glow bodyClassName="flex flex-col items-center py-8">
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
              <GlyphCore seed={genome.visualSeed} size={300} />
            </motion.div>
            <h1 className="mt-4 font-display text-2xl font-bold text-ether">{genome.protocolName}</h1>
            <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: lore.color }}>
              {genome.archetype}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Chip tone={statusTone(status)} filled>{status}</Chip>
              <GenLayerProofBadge txHash={genome.txHash} />
            </div>
            {genome.secondaryTraits?.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {genome.secondaryTraits.map((t) => (
                  <span key={t} className="rounded-md border border-violet/40 bg-violet/12 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-mist">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Panel>

          <Panel label="genome scores">
            <GenomeScorePanel scores={genome.scores} />
          </Panel>

          <div className="flex gap-2">
            <Btn variant="ghost" icon={ScrollText} full onClick={() => navigate(`/genome/${genome.id}/constitution`)}>
              Open Constitution
            </Btn>
            <Btn variant="ghost" icon={Trash2} onClick={remove}>
              Remove
            </Btn>
          </div>
        </div>

        {/* meta */}
        <div className="space-y-4">
          {genome.constitution?.mission && (
            <Panel label="mission">
              <p className="text-sm leading-relaxed text-ether">{genome.constitution.mission}</p>
            </Panel>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Panel label="core values">
              <ul className="space-y-1.5">
                {genome.values.map((v) => (
                  <li key={v} className="flex items-center gap-2 text-sm text-mist">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> {v}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel label="hard rules">
              <ul className="space-y-1.5">
                {genome.rules.length === 0 && <li className="text-sm text-mist">None declared</li>}
                {genome.rules.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-mist">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {r}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Panel label="incentives">
              <div className="flex flex-wrap gap-1.5">
                {genome.incentives.map((v) => (
                  <span key={v} className="rounded-md border border-emerald/30 bg-emerald/10 px-2 py-0.5 text-xs text-emerald">{v}</span>
                ))}
              </div>
            </Panel>
            <Panel label="taboos">
              <div className="flex flex-wrap gap-1.5">
                {genome.taboos.map((v) => (
                  <span key={v} className="rounded-md border border-crimson/30 bg-crimson/10 px-2 py-0.5 text-xs text-crimson">{v}</span>
                ))}
              </div>
            </Panel>
          </div>

          <Panel label="tension rifts" title={<span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-gold" /> Detected by the jury</span>}>
            {genome.tensions.length === 0 ? (
              <p className="text-sm text-mist">No tensions detected. The identity reads as coherent.</p>
            ) : (
              <div className="space-y-3">
                {genome.tensions.map((t, i) => (
                  <div key={i} className="rounded-xl border border-line bg-void/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display text-sm font-semibold text-ether">{t.name}</h4>
                      <Chip tone={severityColor(t.severity)} filled>{t.severity}</Chip>
                    </div>
                    {t.reason && <p className="mt-1 text-sm text-mist">{t.reason}</p>}
                    {t.resolution && (
                      <p className="mt-1.5 text-sm text-emerald/90">
                        <span className="rune-label text-emerald">resolution </span>
                        {t.resolution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
