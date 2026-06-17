// Local archive of forged genomes. The chain is the source of truth, but we
// also cache each genome the user forges in localStorage so the Glyph Archive
// loads instantly and works offline. The detail page reconciles with chain.

const KEY = 'glyphforge.archive.v1';
const SETTINGS_KEY = 'glyphforge.settings.v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function listArchive() {
  return read().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
}

export function getArchived(id) {
  return read().find((g) => g.id === id) || null;
}

export function saveToArchive(genome, txHash) {
  const list = read();
  const record = { ...genome, txHash: txHash || genome.txHash || '', savedAt: Date.now() };
  const idx = list.findIndex((g) => g.id === genome.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...record };
  else list.unshift(record);
  write(list);
  return record;
}

export function removeFromArchive(id) {
  write(read().filter((g) => g.id !== id));
}

export function clearArchive() {
  write([]);
}

const DEFAULT_SETTINGS = {
  animationIntensity: 'full', // full | calm | reduced
  visualDensity: 'comfortable', // comfortable | dense
  theme: 'abyss', // abyss | solar | emerald | crimson
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
