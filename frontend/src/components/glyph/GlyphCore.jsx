import { useMemo } from 'react';
import { buildGlyph, hsl } from '../../utils/glyphGenerator.js';

// The signature procedural artifact. Renders a living protocol glyph from a
// visual seed: concentric animated rule rings, orbiting value satellites,
// radial spokes, a central star sigil, and a tension rift when present.
export default function GlyphCore({ seed, size = 280, animate = true, showRift = true }) {
  const g = useMemo(() => buildGlyph(seed), [seed]);
  const primary = hsl(g.primaryHue, 80, 62);
  const secondary = hsl(g.secondaryHue, 85, 64);
  const faint = hsl(g.primaryHue, 70, 60, 0.18);

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="overflow-visible">
      <defs>
        <radialGradient id={`core-${g.primaryHue}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={hsl(g.primaryHue, 90, 70, 0.5)} />
          <stop offset="70%" stopColor={hsl(g.primaryHue, 80, 50, 0.12)} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="glyph-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={g.cx} cy={g.cy} r="92" fill={`url(#core-${g.primaryHue})`} />

      {/* rule rings */}
      {g.rings.map((ring, i) => (
        <circle
          key={`ring-${i}`}
          cx={g.cx}
          cy={g.cy}
          r={ring.r}
          fill="none"
          stroke={hsl(ring.hue, 80, 62, 0.55)}
          strokeWidth={ring.dash > 3 ? 1.4 : 0.7}
          strokeDasharray={`${ring.dash} ${ring.dash + 2}`}
          style={
            animate
              ? {
                  transformOrigin: 'center',
                  animation: `${ring.reverse ? 'glyph-spin-rev' : 'glyph-spin'} ${ring.speed}s linear infinite`,
                }
              : undefined
          }
        />
      ))}

      {/* radial spokes */}
      <g stroke={faint} strokeWidth="0.6">
        {g.spokes.map((s, i) => (
          <line key={`spoke-${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
      </g>

      {/* orbiting value satellites */}
      <g style={animate ? { transformOrigin: 'center', animation: 'glyph-spin 24s linear infinite' } : undefined}>
        {g.orbits.map((o, i) => (
          <g key={`orbit-${i}`}>
            <circle cx={g.cx} cy={g.cy} r={o.radius} fill="none" stroke={faint} strokeWidth="0.4" />
            <circle
              cx={o.x}
              cy={o.y}
              r={o.size}
              fill={hsl(o.hue, 85, 66)}
              filter="url(#glyph-glow)"
            />
          </g>
        ))}
      </g>

      {/* tension rift */}
      {showRift && g.rift > 0 && (
        <g style={animate ? { transformOrigin: 'center', animation: 'rift 4s ease-in-out infinite' } : undefined}>
          <path
            d={`M ${g.cx} ${g.cy - 70} Q ${g.cx + 8 + g.rift / 6} ${g.cy} ${g.cx} ${g.cy + 70}`}
            fill="none"
            stroke={hsl(348, 90, 64, Math.min(0.85, 0.3 + g.rift / 140))}
            strokeWidth={0.8 + g.rift / 40}
            filter="url(#glyph-glow)"
          />
        </g>
      )}

      {/* central sigil */}
      <path
        d={g.sigil}
        fill={hsl(g.primaryHue, 70, 30, 0.6)}
        stroke={primary}
        strokeWidth="1.2"
        filter="url(#glyph-glow)"
        style={animate ? { transformOrigin: 'center', animation: 'pulse-core 3.2s ease-in-out infinite' } : undefined}
      />
      <circle cx={g.cx} cy={g.cy} r="3.4" fill={secondary} filter="url(#glyph-glow)" />
    </svg>
  );
}
