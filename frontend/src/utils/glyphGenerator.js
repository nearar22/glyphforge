// Procedural glyph geometry. Given a visual seed (from the contract or a live
// preview) it produces deterministic SVG path data for the protocol glyph:
// concentric rule rings, orbiting value satellites, radial spokes, and a rift
// vector. Pure math, no randomness, so the same genome always renders the same.

function hueToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x) => Math.round(255 * x);
  return `rgb(${to(f(0))}, ${to(f(8))}, ${to(f(4))})`;
}

export function hsl(h, s, l, a = 1) {
  if (a === 1) return hueToRgb(((h % 360) + 360) % 360, s, l);
  const base = hueToRgb(((h % 360) + 360) % 360, s, l);
  return base.replace('rgb(', 'rgba(').replace(')', `, ${a})`);
}

export function buildGlyph(seed) {
  const {
    primaryHue = 276,
    secondaryHue = 96,
    ringCount = 4,
    orbitCount = 5,
    riftIntensity = 0,
    glyphComplexity = 50,
  } = seed || {};

  const cx = 100;
  const cy = 100;

  const rings = [];
  for (let i = 0; i < ringCount; i++) {
    const r = 26 + i * (62 / Math.max(1, ringCount));
    rings.push({
      r,
      hue: i % 2 === 0 ? primaryHue : secondaryHue,
      dash: 2 + (i % 3),
      speed: 30 + i * 8,
      reverse: i % 2 === 1,
    });
  }

  const orbits = [];
  for (let i = 0; i < orbitCount; i++) {
    const angle = (i / orbitCount) * Math.PI * 2;
    const radius = 44 + (i % 3) * 16;
    orbits.push({
      angle,
      radius,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      hue: i % 2 === 0 ? secondaryHue : primaryHue,
      size: 2.4 + (i % 3) * 0.7,
      speed: 16 + (i % 4) * 6,
    });
  }

  // Radial spokes scale with glyph complexity.
  const spokeCount = Math.max(6, Math.min(18, Math.round(glyphComplexity / 6)));
  const spokes = [];
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const inner = 14;
    const outer = 22 + (glyphComplexity / 100) * 10;
    spokes.push({
      x1: cx + Math.cos(angle) * inner,
      y1: cy + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * outer,
      y2: cy + Math.sin(angle) * outer,
    });
  }

  // Central sigil: a star polygon whose points scale with complexity.
  const points = Math.max(3, Math.min(8, Math.round(3 + glyphComplexity / 25)));
  const sigil = starPath(cx, cy, 16, 7, points);

  return {
    cx,
    cy,
    primaryHue,
    secondaryHue,
    rings,
    orbits,
    spokes,
    sigil,
    rift: riftIntensity,
  };
}

function starPath(cx, cy, outer, inner, points) {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}
