// Local, heuristic contradiction preview shown BEFORE the on-chain forge.
// This is advisory only: the authoritative tensions are detected by the
// GenLayer jury when the genome is forged. This just lets the rift visual
// react live while the user composes.

const PAIRS = [
  { a: ['Speed'], b: ['Transparency', 'Public Goods'], name: 'Speed vs Public Review', sev: 'Medium', reason: 'Fast execution can outrun the public review the identity also wants.' },
  { a: ['Privacy'], b: ['Transparency'], name: 'Privacy vs Full Transparency', sev: 'High', reason: 'Strong privacy and full transparency pull in opposite directions.' },
  { a: ['Compliance'], b: ['Censorship Resistance'], name: 'Compliance vs Censorship Resistance', sev: 'High', reason: 'Regulatory compliance can require controls that resistance forbids.' },
  { a: ['Open Participation'], b: ['Security'], name: 'Open Participation vs Security', sev: 'Medium', reason: 'Permissionless entry widens the attack surface security must hold.' },
  { a: ['Economic Efficiency'], b: ['Public Goods'], name: 'Efficiency vs Public Goods', sev: 'Medium', reason: 'Pure efficiency can starve public goods that are not directly profitable.' },
  { a: ['Builder Focus'], b: ['Community Control'], name: 'Builder Focus vs Community Control', sev: 'Low', reason: 'Optimizing for builders can concentrate influence away from the community.' },
];

const INCENTIVE_PAIRS = [
  { inc: ['Liquidity'], val: ['Sustainability'], name: 'Aggressive Rewards vs Sustainability', sev: 'Medium', reason: 'Heavy liquidity rewards can attract mercenary capital that undermines durability.' },
  { inc: ['Liquidity'], val: ['Open Participation'], name: 'Open Participation vs Mercenary Capital', sev: 'Medium', reason: 'Open access plus aggressive rewards can invite extractive participation.' },
];

export function previewTensions(values, incentives) {
  const v = new Set(values);
  const inc = new Set(incentives);
  const out = [];
  for (const p of PAIRS) {
    if (p.a.some((x) => v.has(x)) && p.b.some((x) => v.has(x))) {
      out.push({ name: p.name, severity: p.sev, reason: p.reason });
    }
  }
  for (const p of INCENTIVE_PAIRS) {
    if (p.inc.some((x) => inc.has(x)) && p.val.some((x) => v.has(x))) {
      out.push({ name: p.name, severity: p.sev, reason: p.reason });
    }
  }
  return out;
}

export function riftFromTensions(tensions) {
  let r = 0;
  for (const t of tensions) {
    r += t.severity === 'High' ? 34 : t.severity === 'Medium' ? 20 : 10;
  }
  return Math.min(100, r);
}
