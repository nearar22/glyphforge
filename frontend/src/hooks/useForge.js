import { useCallback, useRef, useState } from 'react';
import { makeWalletClient, CONTRACT_ADDRESS } from '../lib/contract.js';
import { pollUntilDecided } from '../lib/tx.js';

const INITIAL = {
  phase: 'idle', // idle | wallet | submitted | consensus | confirmed | error
  hash: null,
  liveStatus: '',
  draft: null,
  error: null,
  finalStatus: null,
};

function friendlyError(e) {
  const s = String(e);
  if (/user rejected|denied/i.test(s)) return 'You declined the signature request.';
  if (/LackOfFundForMaxFee|insufficient/i.test(s))
    return 'Wallet balance is below the AI-write fee reserve. Claim test GEN and retry.';
  if (/rate limit|429/i.test(s)) return 'The network is busy. Wait a moment and retry.';
  return 'The forge could not complete. Please retry.';
}

export function useForge(onConfirmed) {
  const [state, setState] = useState(INITIAL);
  const busy = useRef(false);

  const reset = useCallback(() => {
    busy.current = false;
    setState(INITIAL);
  }, []);

  const forge = useCallback(
    async (account, args) => {
      if (busy.current) return false;
      busy.current = true;
      setState({ ...INITIAL, phase: 'wallet' });
      try {
        const client = makeWalletClient(account);
        const hash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'forge_genome',
          args,
          value: 0n,
        });
        setState((s) => ({ ...s, phase: 'consensus', hash }));
        const { status, draft } = await pollUntilDecided(client, hash, (liveStatus, d) =>
          setState((s) => ({ ...s, liveStatus, draft: d ?? s.draft }))
        );
        if (status === 'ACCEPTED' || status === 'FINALIZED') {
          setState((s) => ({ ...s, phase: 'confirmed', finalStatus: status, draft: draft ?? s.draft }));
          onConfirmed?.(hash);
          busy.current = false;
          return true;
        }
        setState((s) => ({
          ...s,
          phase: 'error',
          finalStatus: status,
          error:
            status === 'UNDETERMINED'
              ? 'Validators could not agree on this genome. Refine the identity and retry.'
              : status === 'CANCELED'
                ? 'The forge was canceled by the network.'
                : 'The forge did not settle in time. Check the explorer.',
        }));
        busy.current = false;
        return false;
      } catch (e) {
        setState((s) => ({ ...s, phase: 'error', error: friendlyError(e) }));
        busy.current = false;
        return false;
      }
    },
    [onConfirmed]
  );

  return { state, forge, reset };
}
