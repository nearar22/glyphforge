import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

export const CONTRACT_ADDRESS = '0x8F68d783cd3434A07bA32aAf97728D2A3707914B';
export const DEPLOY_TX = '0x25fe472f68d588e043f1e617c23ee70f6c02ee292f14a6e39269cf2a4e3b5d5d';
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const NETWORK_NAME = 'Bradbury';
export const CHAIN_ID = 4221;

export const ARCHETYPES = [
  'Sovereign Commons',
  'Privacy Citadel',
  'Builder Gravity',
  'Efficient Machine',
  'Guardian Network',
  'Open Frontier',
];

export const DIMENSIONS = [
  { key: 'alignment', label: 'Alignment' },
  { key: 'resilience', label: 'Resilience' },
  { key: 'sustainability', label: 'Sustainability' },
  { key: 'governanceComplexity', label: 'Governance Load' },
  { key: 'decentralizationPressure', label: 'Decentralization' },
];

export const readClient = createClient({ chain: testnetBradbury });

export const makeWalletClient = (account) =>
  createClient({ chain: testnetBradbury, account });

export async function withRpcRetry(fn, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 2500 * 2 ** i));
    }
  }
  throw last;
}

function asNumber(v) {
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'number') return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function asString(v) {
  return v === undefined || v === null ? '' : String(v);
}

function pick(obj, key) {
  if (obj instanceof Map) return obj.get(key);
  if (obj && typeof obj === 'object') return obj[key];
  return undefined;
}

function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v instanceof Map) return Array.from(v.values());
  return [];
}

function normScores(raw) {
  const out = {};
  for (const d of DIMENSIONS) out[d.key] = asNumber(pick(raw, d.key));
  return out;
}

function normTensions(raw) {
  return asArray(raw).map((t) => ({
    name: asString(pick(t, 'name')),
    severity: asString(pick(t, 'severity')) || 'Medium',
    reason: asString(pick(t, 'reason')),
    resolution: asString(pick(t, 'resolution')),
  }));
}

function normVisualSeed(raw) {
  return {
    primaryHue: asNumber(pick(raw, 'primaryHue')) || 276,
    secondaryHue: asNumber(pick(raw, 'secondaryHue')) || 96,
    ringCount: asNumber(pick(raw, 'ringCount')) || 4,
    orbitCount: asNumber(pick(raw, 'orbitCount')) || 5,
    riftIntensity: asNumber(pick(raw, 'riftIntensity')),
    glyphComplexity: asNumber(pick(raw, 'glyphComplexity')) || 50,
  };
}

function normConstitution(raw) {
  return {
    mission: asString(pick(raw, 'mission')),
    coreValues: asArray(pick(raw, 'coreValues')).map(asString),
    nonNegotiableRules: asArray(pick(raw, 'nonNegotiableRules')).map(asString),
    forbiddenBehaviors: asArray(pick(raw, 'forbiddenBehaviors')).map(asString),
    publicPledge: asString(pick(raw, 'publicPledge')),
  };
}

export function normGenome(raw) {
  return {
    id: asString(pick(raw, 'id')),
    protocolName: asString(pick(raw, 'protocolName')),
    ecosystem: asString(pick(raw, 'ecosystem')),
    archetype: asString(pick(raw, 'archetype')),
    secondaryTraits: asArray(pick(raw, 'secondaryTraits')).map(asString),
    values: asArray(pick(raw, 'values')).map(asString),
    rules: asArray(pick(raw, 'rules')).map(asString),
    incentives: asArray(pick(raw, 'incentives')).map(asString),
    taboos: asArray(pick(raw, 'taboos')).map(asString),
    scores: normScores(pick(raw, 'scores')),
    tensions: normTensions(pick(raw, 'tensions')),
    constitution: normConstitution(pick(raw, 'constitution')),
    visualSeed: normVisualSeed(pick(raw, 'visualSeed')),
    forger: asString(pick(raw, 'forger')),
    seq: asNumber(pick(raw, 'seq')),
  };
}

async function readView(functionName, args = []) {
  return withRpcRetry(() =>
    readClient.readContract({ address: CONTRACT_ADDRESS, functionName, args })
  );
}

export async function fetchStats() {
  const raw = await readView('get_stats');
  return { genomes: asNumber(pick(raw, 'genomes')) };
}

export async function fetchGenomes(start = 0) {
  const raw = await readView('get_genomes', [start]);
  return asArray(raw).map(normGenome);
}

export async function fetchGenome(id) {
  const raw = await readView('get_genome', [id]);
  return normGenome(raw);
}
