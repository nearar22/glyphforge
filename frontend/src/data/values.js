// The value vocabulary the Value Orbit offers. Each carries a short gloss used
// in tooltips and a hue offset so its orbiting node tints distinctly.

export const VALUES = [
  { key: 'Decentralization', gloss: 'No single point of control' },
  { key: 'Privacy', gloss: 'User data stays the user\'s' },
  { key: 'Speed', gloss: 'Fast execution and finality' },
  { key: 'Security', gloss: 'Hardened against attack' },
  { key: 'Transparency', gloss: 'Open, auditable decisions' },
  { key: 'Public Goods', gloss: 'Funds the commons' },
  { key: 'User Ownership', gloss: 'Users hold their assets and identity' },
  { key: 'Sustainability', gloss: 'Durable over the long run' },
  { key: 'Open Participation', gloss: 'Anyone can take part' },
  { key: 'Permissionless Innovation', gloss: 'Build without gatekeepers' },
  { key: 'Builder Focus', gloss: 'Optimized for those who build' },
  { key: 'Neutrality', gloss: 'No favored actors' },
  { key: 'Community Control', gloss: 'The community steers' },
  { key: 'Compliance', gloss: 'Works within regulation' },
  { key: 'Economic Efficiency', gloss: 'Capital and fees optimized' },
  { key: 'Censorship Resistance', gloss: 'Cannot be silenced' },
];

export const PRESET_RULES = [
  'No emergency powers without sunset clauses',
  'No hidden fees',
  'No governance changes without public review',
  'No user data used without consent',
  'No treasury movement without public disclosure',
  'No closed validator set after mainnet',
  'No protocol upgrades without audit',
  'No arbitrary blacklisting',
  'No reward cuts without a transition plan',
];

export const RULE_WEIGHTS = ['Soft Principle', 'Strong Rule', 'Sacred Constraint'];

export const INCENTIVES = [
  'Long-term contribution',
  'Liquidity',
  'Governance participation',
  'Code contributions',
  'Community moderation',
  'Educational content',
  'Public goods',
  'Security research',
  'Ecosystem growth',
  'User retention',
  'Builder adoption',
];

export const TABOOS = [
  'Centralized control',
  'Extractive tokenomics',
  'Closed decision-making',
  'Hidden governance changes',
  'Mercenary capital',
  'Opaque treasuries',
  'Unilateral upgrades',
  'Data harvesting',
];

export const ECOSYSTEMS = [
  'DAO',
  'DeFi Protocol',
  'AI Network',
  'Public Goods',
  'Social Protocol',
  'GameFi',
  'Infrastructure',
  'Custom',
];

export const MATURITIES = ['Concept', 'Testnet', 'Mainnet', 'Mature Protocol'];
