const STATUS_NAME = {
  '1': 'PENDING', '2': 'PROPOSING', '3': 'COMMITTING', '4': 'REVEALING',
  '5': 'ACCEPTED', '6': 'UNDETERMINED', '7': 'FINALIZED', '8': 'CANCELED',
  '12': 'VALIDATORS_TIMEOUT', '13': 'LEADER_TIMEOUT', '14': 'ACTIVATED',
};

export const statusName = (s) => STATUS_NAME[String(s)] ?? String(s).toUpperCase();

const TERMINAL = new Set(['ACCEPTED', 'FINALIZED', 'UNDETERMINED', 'CANCELED']);

function pick(obj, key) {
  if (obj instanceof Map) return obj.get(key);
  if (obj && typeof obj === 'object') return obj[key];
  return undefined;
}

// Peek at the leader's draft genome while consensus is still deliberating.
export function extractLeaderDraft(tx) {
  try {
    const receipts = pick(pick(tx, 'consensus_data'), 'leader_receipt');
    const first = Array.isArray(receipts) ? receipts[0] : receipts;
    const b64 = pick(pick(first, 'eq_outputs'), '0');
    if (typeof b64 !== 'string' || b64.length === 0) return null;
    const text = atob(b64);
    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] !== '{') continue;
      try {
        const obj = JSON.parse(text.slice(i));
        if (obj && typeof obj === 'object' && 'archetypeAffinity' in obj) {
          return obj;
        }
      } catch {
        /* keep scanning */
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function pollUntilDecided(client, hash, onUpdate) {
  let draft = null;
  for (let i = 0; i < 160; i++) {
    const tx = await client.getTransaction({ hash }).catch(() => null);
    const status = statusName(tx ? tx.status : 'PENDING');
    draft = (tx && extractLeaderDraft(tx)) ?? draft;
    onUpdate?.(status, draft);
    if (TERMINAL.has(status)) return { status, draft };
    await new Promise((r) => setTimeout(r, 8000));
  }
  return { status: 'TIMEOUT', draft };
}

export function dominantFromAffinity(affinity, archetypes) {
  let best = archetypes[0];
  let bestVal = -1;
  for (const a of archetypes) {
    const v = Number(pick(affinity, a) ?? -1);
    if (v > bestVal) {
      bestVal = v;
      best = a;
    }
  }
  return best;
}
