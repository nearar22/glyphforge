import { ShieldCheck, ExternalLink } from 'lucide-react';
import { EXPLORER } from '../../lib/contract.js';
import { truncateAddress } from '../../utils/formatters.js';

// Shows the on-chain proof for a forged genome: a link to the transaction that
// sealed it under GenLayer consensus.
export default function GenLayerProofBadge({ txHash, compact }) {
  if (!txHash) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-line-bright px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-mist">
        <ShieldCheck className="h-3 w-3" /> local draft
      </span>
    );
  }
  return (
    <a
      href={`${EXPLORER}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/40 bg-emerald/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-emerald transition-colors hover:bg-emerald/20"
    >
      <ShieldCheck className="h-3 w-3" />
      {compact ? 'proof' : 'sealed on genlayer'}
      {!compact && <span className="text-mist">{truncateAddress(txHash)}</span>}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
