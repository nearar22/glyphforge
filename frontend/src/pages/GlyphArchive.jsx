import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, Search, RefreshCw, Archive as ArchiveIcon } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import { Btn, Panel, EmptyState, Skeleton, Chip } from '../components/ui/primitives.jsx';
import GenLayerProofBadge from '../components/ui/GenLayerProofBadge.jsx';
import { fetchGenomes } from '../lib/contract.js';
import { listArchive, saveToArchive } from '../lib/archive.js';
import { ARCHETYPES } from '../lib/contract.js';
import { loreFor } from '../data/archetypes.js';
import { genomeStatus, statusTone, classNames } from '../utils/formatters.js';

export default function GlyphArchive() {
  const navigate = useNavigate();
  const [genomes, setGenomes] = useState(listArchive());
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [archFilter, setArchFilter] = useState('all');

  async function load() {
    setLoading(true);
    try {
      const chain = await fetchGenomes(0);
      chain.forEach((g) => saveToArchive(g, ''));
      // merge chain + local, dedup by id, chain wins
      const local = listArchive();
      const map = new Map();
      for (const g of local) map.set(g.id, g);
      for (const g of chain) map.set(g.id, { ...map.get(g.id), ...g });
      setGenomes(Array.from(map.values()).sort((a, b) => (b.seq || 0) - (a.seq || 0)));
    } catch {
      setGenomes(listArchive());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      genomes.filter((g) => {
        const mq =
          !query ||
          g.protocolName?.toLowerCase().includes(query.toLowerCase()) ||
          g.archetype?.toLowerCase().includes(query.toLowerCase());
        const ma = archFilter === 'all' || g.archetype === archFilter;
        return mq && ma;
      }),
    [genomes, query, archFilter]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rune-label">glyph archive</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ether">Sealed genomes</h1>
          <p className="mt-1 text-sm text-mist">Every forged protocol genome, read live from the chain.</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" icon={RefreshCw} onClick={load}>Refresh</Btn>
          <Btn icon={Hexagon} onClick={() => navigate('/forge')}>Forge new</Btn>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by protocol or archetype"
            className="field pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', ...ARCHETYPES].map((a) => (
            <button
              key={a}
              onClick={() => setArchFilter(a)}
              className={classNames(
                'shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors',
                archFilter === a ? 'border-cyan bg-cyan/12 text-cyan' : 'border-line-bright text-mist hover:text-ether'
              )}
            >
              {a === 'all' ? 'all' : a.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {loading && genomes.length === 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Panel key={i}>
              <Skeleton height={120} className="mb-3" />
              <Skeleton height={18} className="mb-2" />
              <Skeleton height={14} />
            </Panel>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <Panel>
            <EmptyState
              icon={ArchiveIcon}
              title="No genomes yet"
              message="Forge a protocol identity and its sealed genome will appear here as a relic."
              action={<Btn icon={Hexagon} onClick={() => navigate('/forge')}>Enter the forge</Btn>}
            />
          </Panel>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g, i) => {
            const lore = loreFor(g.archetype);
            const status = genomeStatus(g);
            return (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/genome/${g.id}`)}
                className="glass group overflow-hidden p-5 text-left transition-all hover:glass-glow"
              >
                <div className="flex items-center justify-center py-2">
                  <GlyphCore seed={g.visualSeed} size={130} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-ether">{g.protocolName}</h3>
                  <GenLayerProofBadge txHash={g.txHash} compact />
                </div>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em]" style={{ color: lore.color }}>
                  {g.archetype || 'Unclassified'}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <span className="font-mono text-[0.6rem] text-mist">align {g.scores?.alignment ?? 0}</span>
                  <Chip tone={statusTone(status)}>{status.split(' ')[0]}</Chip>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
