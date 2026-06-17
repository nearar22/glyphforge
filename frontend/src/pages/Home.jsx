import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, GitBranch, Zap, ShieldCheck, ArrowRight, Sparkles, Layers } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import { Btn, Panel, Chip } from '../components/ui/primitives.jsx';
import { fetchStats } from '../lib/contract.js';
import { ARCHETYPE_LORE } from '../data/archetypes.js';

const FLOAT_WORDS = ['Privacy', 'Governance', 'Incentives', 'Taboos', 'Decentralization', 'Trust', 'Resilience'];

const STEPS = [
  { n: '01', t: 'Name the protocol', d: 'Open the forge chamber and declare an identity and mission.' },
  { n: '02', t: 'Choose values', d: 'Pull luminous value nodes into orbit around the core.' },
  { n: '03', t: 'Bind rules', d: 'Set hard rules as rings: soft principles to sacred constraints.' },
  { n: '04', t: 'Expose contradictions', d: 'A rift opens where principles pull against each other.' },
  { n: '05', t: 'Forge the genome', d: 'A GenLayer jury classifies and seals the artifact on-chain.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div>
      {/* hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Chip tone="#22D3EE" filled>
              <Sparkles className="h-3 w-3" /> protocol dna composer
            </Chip>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight text-ether sm:text-6xl">
              Forge the DNA
              <br />
              of a{' '}
              <span
                className="bg-gradient-to-r from-cyan via-violet to-ritual bg-clip-text text-transparent"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                protocol
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist">
              GlyphForge transforms values, governance rules, incentives and taboos into a living
              protocol genome: a symbolic artifact that reveals alignment, contradictions and
              identity, classified and sealed under GenLayer consensus.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn icon={Hexagon} onClick={() => navigate('/forge')}>
                Enter Forge Chamber
              </Btn>
              <Btn variant="ghost" icon={Layers} onClick={() => navigate('/archive')}>
                View Demo Genome
              </Btn>
            </div>
            {stats && (
              <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mist">
                <span className="text-cyan">{stats.genomes}</span> genome{stats.genomes === 1 ? '' : 's'} forged on Bradbury
              </p>
            )}
          </motion.div>

          {/* central glyph + floating words */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative mx-auto flex h-[360px] w-full max-w-md items-center justify-center"
          >
            <div className="animate-portal-open">
              <GlyphCore seed={{ primaryHue: 276, secondaryHue: 190, ringCount: 5, orbitCount: 8, riftIntensity: 30, glyphComplexity: 78 }} size={340} />
            </div>
            {FLOAT_WORDS.map((w, i) => {
              const angle = (i / FLOAT_WORDS.length) * Math.PI * 2;
              const radius = 168;
              return (
                <span
                  key={w}
                  className="absolute font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist/70 animate-float-rune"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                    top: `calc(50% + ${Math.sin(angle) * radius * 0.8}px)`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* what is a protocol genome */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { icon: GitBranch, t: 'Values become structure', d: 'Each value orbits the core as a living satellite; dominant values pull closer.' },
            { icon: ShieldCheck, t: 'Rules become rings', d: 'Hard rules ring the glyph as boundaries, from soft principles to sacred constraints.' },
            { icon: Zap, t: 'Tensions become rifts', d: 'Where principles contradict, a rift tears the artifact and is named honestly.' },
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Panel className="h-full">
                <c.icon className="h-6 w-6 text-cyan" />
                <h3 className="mt-3 font-display text-lg font-semibold text-ether">{c.t}</h3>
                <p className="mt-1.5 text-sm leading-snug text-mist">{c.d}</p>
              </Panel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="rune-label">the ritual</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ether">How GlyphForge works</h2>
        <div className="mt-8 space-y-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-5 rounded-2xl border border-line bg-void/40 p-5"
            >
              <span className="font-display text-2xl font-bold text-violet">{s.n}</span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ether">{s.t}</h3>
                <p className="mt-0.5 text-sm text-mist">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* archetypes */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="rune-label">the six archetypes</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ether">What a genome can become</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(ARCHETYPE_LORE).map(([name, lore], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass overflow-hidden p-5"
            >
              <div className="flex items-center gap-3">
                <GlyphCore
                  seed={{ primaryHue: lore.hue, secondaryHue: (lore.hue + 180) % 360, ringCount: 3, orbitCount: 4, riftIntensity: 0, glyphComplexity: 55 }}
                  size={56}
                  animate={false}
                />
                <h3 className="font-display text-base font-semibold" style={{ color: lore.color }}>
                  {name}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-snug text-mist">{lore.essence}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* powered by genlayer */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Panel glow className="text-center" bodyClassName="py-10">
          <ShieldCheck className="mx-auto h-8 w-8 text-emerald" />
          <h2 className="mt-4 font-display text-2xl font-bold text-ether">Powered by GenLayer consensus</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-mist">
            The forging is not a private server call. A GenLayer leader proposes the genome and
            independent validators each re-run the analysis, agreeing on the dominant archetype and
            the genome scores within tolerance before the artifact is sealed on-chain.
          </p>
          <div className="mt-6 flex justify-center">
            <Btn icon={ArrowRight} onClick={() => navigate('/forge')}>
              Begin the forge
            </Btn>
          </div>
        </Panel>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist/60">
            GlyphForge / values become structure, rules become glyphs
          </p>
        </div>
      </footer>
    </div>
  );
}
