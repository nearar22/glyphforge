import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, ArrowLeft, Wallet, AlertCircle, ArrowRight } from 'lucide-react';
import GlyphCore from '../components/glyph/GlyphCore.jsx';
import StepNavigator from '../components/forge/StepNavigator.jsx';
import LoadingForge from '../components/forge/LoadingForge.jsx';
import { Btn, Panel, Chip } from '../components/ui/primitives.jsx';
import { useForgeDraft } from '../forge/ForgeContext.jsx';
import { useWallet } from '../hooks/useWallet.js';
import { useForge } from '../hooks/useForge.js';
import { fetchStats, fetchGenomes } from '../lib/contract.js';
import { saveToArchive } from '../lib/archive.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function GenomeReveal() {
  const navigate = useNavigate();
  const toast = useToast();
  const { draft, toArgs, reset } = useForgeDraft();
  const wallet = useWallet();
  const [forgedId, setForgedId] = useState(null);

  const { state, forge } = useForge(async () => {
    // After consensus accepts, read back the newest genome and archive it.
    try {
      const stats = await fetchStats();
      const page = await fetchGenomes(0);
      const newest = page[0];
      if (newest) {
        saveToArchive(newest, state.hash);
        setForgedId(newest.id);
      }
      toast.success('Genome sealed on GenLayer', `${stats.genomes} forged`);
    } catch {
      toast.info('Genome forged. Open the archive to view it.');
    }
  });

  const seed = {
    primaryHue: 276,
    secondaryHue: 190,
    ringCount: Math.max(3, Math.min(8, draft.rules.length + 2)),
    orbitCount: Math.max(3, draft.values.length),
    riftIntensity: 20,
    glyphComplexity: Math.min(100, 30 + (draft.values.length + draft.rules.length) * 6),
  };

  async function runForge() {
    if (!wallet.address) {
      toast.error('Connect a wallet to forge on-chain');
      return;
    }
    await forge(wallet.address, toArgs());
  }

  const busy = state.phase === 'wallet' || state.phase === 'consensus';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <StepNavigator />

      <div className="mt-6">
        {state.phase === 'idle' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="rune-label">forge</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-ether">Forge the protocol genome</h1>
              <p className="mt-2 max-w-lg text-sm text-mist">
                This sends the identity to the GlyphForge contract. A GenLayer jury classifies the
                archetype, detects tensions, scores the genome, and seals the artifact on-chain.
                Forging is free, you only pay network fees.
              </p>

              <Panel className="mt-6" label="identity summary">
                <dl className="space-y-2 text-sm">
                  <Row k="Protocol" v={draft.protocolName || 'Unnamed'} />
                  <Row k="Ecosystem" v={`${draft.ecosystem} / ${draft.maturity}`} />
                  <Row k="Values" v={`${draft.values.length} selected`} />
                  <Row k="Rules" v={`${draft.rules.length} bound`} />
                  <Row k="Incentives" v={`${draft.incentives.length} streams`} />
                  <Row k="Taboos" v={`${draft.taboos.length} forbidden`} />
                </dl>
              </Panel>

              {!wallet.address ? (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/8 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-gold" />
                  <span className="text-sm text-mist">Connect a wallet to forge on-chain.</span>
                </div>
              ) : !wallet.onRightChain ? (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/8 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-gold" />
                  <span className="text-sm text-mist">Switch your wallet to Bradbury to forge.</span>
                </div>
              ) : null}

              <div className="mt-6 flex gap-3">
                <Btn variant="ghost" icon={ArrowLeft} onClick={() => navigate('/forge/tension')}>
                  Back
                </Btn>
                <Btn icon={wallet.address ? Hexagon : Wallet} onClick={wallet.address ? runForge : wallet.connect} disabled={draft.values.length === 0}>
                  {wallet.address ? 'Forge Genome' : 'Connect to Forge'}
                </Btn>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <Panel label="ready to forge" glow bodyClassName="flex flex-col items-center py-8">
                <GlyphCore seed={seed} size={280} />
                <p className="mt-4 font-display text-lg font-semibold text-ether">{draft.protocolName || 'Unnamed'}</p>
              </Panel>
            </div>
          </div>
        )}

        {busy && (
          <Panel label="forging" title="Sealing under consensus" glow>
            <LoadingForge liveStatus={state.liveStatus} draft={state.draft} seed={seed} />
          </Panel>
        )}

        {state.phase === 'confirmed' && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <Panel glow bodyClassName="flex flex-col items-center py-10 text-center">
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <GlyphCore seed={seed} size={300} />
              </motion.div>
              <Chip tone="#06D6A0" filled>
                genome forged and sealed
              </Chip>
              <h1 className="mt-4 font-display text-3xl font-bold text-ether">{draft.protocolName}</h1>
              <p className="mt-2 max-w-md text-sm text-mist">
                The artifact is now on-chain under GenLayer consensus. Open it to read the archetype,
                tensions, scores, and constitution.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Btn
                  icon={ArrowRight}
                  onClick={() => {
                    reset();
                    navigate(forgedId ? `/genome/${forgedId}` : '/archive');
                  }}
                >
                  Reveal the artifact
                </Btn>
                <Btn variant="ghost" onClick={() => { reset(); navigate('/forge'); }}>
                  Forge another
                </Btn>
              </div>
            </Panel>
          </motion.div>
        )}

        {state.phase === 'error' && (
          <Panel glow bodyClassName="flex flex-col items-center py-10 text-center">
            <AlertCircle className="h-8 w-8 text-crimson" />
            <h2 className="mt-3 font-display text-xl font-semibold text-ether">The forge did not settle</h2>
            <p className="mt-2 max-w-md text-sm text-mist">{state.error}</p>
            <div className="mt-6 flex gap-3">
              <Btn icon={Hexagon} onClick={runForge}>Retry forge</Btn>
              <Btn variant="ghost" onClick={() => navigate('/forge/tension')}>Back</Btn>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between border-b border-line/60 pb-1.5 last:border-0">
      <dt className="rune-label">{k}</dt>
      <dd className="text-ether">{v}</dd>
    </div>
  );
}
