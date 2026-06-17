// Pre-written demo protocol identities. These seed the Forge Chamber so a
// visitor can forge a real on-chain genome in one click. AstraDAO is the
// mandatory headline demo.

export const DEMO_GENOMES = [
  {
    id: 'astradao',
    protocolName: 'AstraDAO',
    ecosystem: 'DAO',
    expectedArchetype: 'Sovereign Commons',
    mission: 'Coordinate open, privacy-preserving public goods funding.',
    values: ['Decentralization', 'Privacy', 'Open Participation', 'Public Goods', 'Community Control'],
    rules: [
      'No emergency powers without sunset clauses',
      'No treasury movement without public disclosure',
      'No user data used without consent',
    ],
    incentives: ['Long-term contribution', 'Public goods', 'Code contributions', 'Educational content'],
    taboos: ['Centralized control', 'Hidden governance changes', 'Extractive tokenomics'],
  },
  {
    id: 'voidcredit',
    protocolName: 'VoidCredit',
    ecosystem: 'DeFi Protocol',
    expectedArchetype: 'Efficient Machine',
    mission: 'Provide capital-efficient under-collateralized credit with fast settlement.',
    values: ['Economic Efficiency', 'Speed', 'Security', 'Compliance'],
    rules: ['No protocol upgrades without audit', 'No hidden fees'],
    incentives: ['Liquidity', 'Ecosystem growth', 'User retention'],
    taboos: ['Opaque treasuries', 'Extractive tokenomics'],
  },
  {
    id: 'lumamesh',
    protocolName: 'LumaMesh',
    ecosystem: 'Social Protocol',
    expectedArchetype: 'Privacy Citadel',
    mission: 'A social graph where users own their identity and nothing leaks without consent.',
    values: ['Privacy', 'User Ownership', 'Censorship Resistance', 'Decentralization'],
    rules: ['No user data used without consent', 'No arbitrary blacklisting'],
    incentives: ['Community moderation', 'User retention', 'Educational content'],
    taboos: ['Data harvesting', 'Centralized control'],
  },
  {
    id: 'orbitcommons',
    protocolName: 'OrbitCommons',
    ecosystem: 'Public Goods',
    expectedArchetype: 'Sovereign Commons',
    mission: 'Fund and steward shared infrastructure as a member-governed commons.',
    values: ['Public Goods', 'Community Control', 'Transparency', 'Open Participation'],
    rules: ['No governance changes without public review', 'No treasury movement without public disclosure'],
    incentives: ['Public goods', 'Long-term contribution', 'Governance participation'],
    taboos: ['Closed decision-making', 'Opaque treasuries'],
  },
  {
    id: 'signalforge',
    protocolName: 'SignalForge',
    ecosystem: 'AI Network',
    expectedArchetype: 'Builder Gravity',
    mission: 'An open network of AI agents funded to build and ship public tooling.',
    values: ['Builder Focus', 'Permissionless Innovation', 'Open Participation', 'Public Goods'],
    rules: ['No protocol upgrades without audit', 'No closed validator set after mainnet'],
    incentives: ['Code contributions', 'Builder adoption', 'Ecosystem growth', 'Security research'],
    taboos: ['Closed decision-making', 'Centralized control'],
  },
];

export function findDemo(id) {
  return DEMO_GENOMES.find((d) => d.id === id) || null;
}
