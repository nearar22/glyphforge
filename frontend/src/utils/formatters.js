export function truncateAddress(addr) {
  if (!addr || addr.length < 12) return addr || '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function truncateText(text, max = 140) {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function severityWeight(sev) {
  if (sev === 'High') return 3;
  if (sev === 'Medium') return 2;
  return 1;
}

export function severityColor(sev) {
  if (sev === 'High') return '#EF476F';
  if (sev === 'Medium') return '#FFD166';
  return '#06D6A0';
}

export function genomeStatus(genome) {
  const tensions = genome.tensions || [];
  const high = tensions.filter((t) => t.severity === 'High').length;
  const align = genome.scores?.alignment ?? 0;
  if (high >= 2 || align < 45) return 'Volatile';
  if (tensions.length === 0 && align >= 75) return 'Crystalline';
  if (tensions.length > 0) return 'Stable but tension-aware';
  return 'Stable';
}

export function statusTone(status) {
  if (status === 'Volatile') return '#EF476F';
  if (status === 'Crystalline') return '#06D6A0';
  if (status === 'Stable but tension-aware') return '#FFD166';
  return '#22D3EE';
}
