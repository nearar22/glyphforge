// Archetype lore: how each kind of protocol genome reads, its signature hue,
// and the values that pull toward it. Used for the result page and demo cards.

export const ARCHETYPE_LORE = {
  'Sovereign Commons': {
    hue: 152,
    color: '#06D6A0',
    essence: 'A self-governing commons that answers to its participants, not a core.',
    pulls: ['Decentralization', 'Public Goods', 'Community Control', 'Open Participation'],
  },
  'Privacy Citadel': {
    hue: 276,
    color: '#6D28D9',
    essence: 'A fortress for user sovereignty where data and identity stay sealed.',
    pulls: ['Privacy', 'User Ownership', 'Censorship Resistance'],
  },
  'Builder Gravity': {
    hue: 41,
    color: '#FFD166',
    essence: 'A field that bends builders inward with grants, tooling, and growth.',
    pulls: ['Builder Focus', 'Public Goods', 'Code contributions'],
  },
  'Efficient Machine': {
    hue: 190,
    color: '#22D3EE',
    essence: 'A tuned engine optimized for throughput, cost, and execution.',
    pulls: ['Economic Efficiency', 'Speed', 'Security'],
  },
  'Guardian Network': {
    hue: 222,
    color: '#5B8DEF',
    essence: 'A vigilant lattice built to resist capture and survive shocks.',
    pulls: ['Security', 'Transparency', 'Neutrality'],
  },
  'Open Frontier': {
    hue: 326,
    color: '#F72585',
    essence: 'An unbounded frontier rewarding permissionless experimentation.',
    pulls: ['Permissionless Innovation', 'Open Participation', 'Speed'],
  },
};

export function loreFor(archetype) {
  return (
    ARCHETYPE_LORE[archetype] || {
      hue: 276,
      color: '#6D28D9',
      essence: 'A protocol identity composed of layered principles.',
      pulls: [],
    }
  );
}
