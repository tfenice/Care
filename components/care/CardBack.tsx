// CardBack — Japanese Letterpress Edition V2
//
// Design language: Midori MD / Traveler's Notebook.
// "A handwritten letter waiting to be opened."
//
// Material: Paper Language tokens throughout — no hardcoded colors.
// viewBox="0 0 66 100" — scales cleanly to sm (56×88) and lg (208×312).
// preserveAspectRatio="xMidYMid slice" — always fills container.
// No SVG <filter> IDs — uses CSS drop-shadow() to avoid collisions.
// No Math.random() — washi fibres are pre-computed for SSR safety.

// ── Pre-computed washi fibre data ──────────────────────────────────────────────
// [y, x1, x2, opacity, dasharray]
const FIBRES: [number, number, number, number, string][] = [
  [  6,  2, 44, 0.055, '14 7'],
  [  9,  0, 66, 0.030, '20 11'],
  [ 12,  8, 60, 0.060, '12 6'],
  [ 16,  0, 52, 0.045, '18 9'],
  [ 20,  4, 66, 0.050, '16 7'],
  [ 24,  0, 38, 0.038, '10 6'],
  [ 27, 14, 66, 0.062, '14 5'],
  [ 31,  0, 58, 0.048, '20 8'],
  [ 34,  6, 50, 0.058, '12 7'],
  [ 38,  0, 66, 0.035, '18 10'],
  [ 42,  2, 62, 0.052, '16 6'],
  [ 46,  0, 46, 0.044, '14 8'],
  [ 50, 10, 66, 0.060, '12 5'],
  [ 54,  0, 54, 0.048, '20 9'],
  [ 58,  4, 66, 0.038, '16 7'],
  [ 61,  0, 42, 0.062, '14 6'],
  [ 65,  8, 66, 0.044, '18 8'],
  [ 68,  0, 60, 0.054, '12 6'],
  [ 72,  2, 66, 0.038, '20 10'],
  [ 76,  0, 50, 0.058, '16 7'],
  [ 80,  6, 64, 0.048, '14 6'],
  [ 84,  0, 66, 0.036, '18 9'],
  [ 88,  4, 56, 0.054, '12 5'],
  [ 92,  0, 66, 0.030, '20 11'],
  [ 96,  8, 60, 0.044, '14 7'],
]

// ── Letterpress registration mark ─────────────────────────────────────────────
function RegistrationMark({ cx, cy }: { cx: number; cy: number }) {
  const r = 1.6
  const arm = 2.8
  const op = 0.16
  const sw = 0.28
  const col = '#7D6248'
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} stroke={col} strokeWidth={sw} strokeOpacity={op} />
      <line x1={cx - arm} y1={cy} x2={cx + arm} y2={cy} stroke={col} strokeWidth={sw} strokeOpacity={op} />
      <line x1={cx} y1={cy - arm} x2={cx} y2={cy + arm} stroke={col} strokeWidth={sw} strokeOpacity={op} />
    </g>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  className?: string
  size?: 'sm' | 'lg'
  animate?: boolean
}

export default function CardBack({ className = '', size = 'sm', animate = false }: Props) {
  const axisColor   = 'rgba(125,98,72,0.12)'
  const markerColor = 'rgba(125,98,72,0.22)'
  const cornerColor = 'rgba(125,98,72,0.16)'
  const axisWidth   = 0.5
  const cornerWidth = 0.65

  const diamond = (cy: number) =>
    `M 33 ${cy - 2.8} L 35.2 ${cy} L 33 ${cy + 2.8} L 30.8 ${cy} Z`

  return (
    <div
      className={`relative overflow-hidden select-none ${animate ? 'care-back-breathe' : ''} ${className}`}
      style={{
        background: 'linear-gradient(168deg, var(--paper-back-1) 0%, var(--paper-back-2) 55%, var(--paper-back-3) 100%)',
        boxShadow: size === 'lg' ? 'var(--paper-shadow-lift)' : 'var(--paper-shadow-rest)',
        border: '1px solid var(--paper-border)',
        borderRadius: size === 'lg' ? 'var(--paper-radius-card)' : 'var(--paper-radius-soft)',
      }}
    >
      <svg
        viewBox="0 0 66 100"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        {/* ── Washi paper fibres ──────────────────────────────────────────── */}
        {FIBRES.map(([y, x1, x2, op, dash], i) => (
          <line
            key={i}
            x1={x1} y1={y} x2={x2} y2={y}
            stroke="#B8956A"
            strokeWidth="0.15"
            strokeOpacity={op}
            strokeDasharray={dash}
            strokeLinecap="round"
          />
        ))}

        {/* ── Stationery corner brackets ──────────────────────────────────── */}
        <path d="M 13 5 L 5 5 L 5 13"   stroke={cornerColor} strokeWidth={cornerWidth} strokeLinecap="square" />
        <path d="M 53 5 L 61 5 L 61 13"  stroke={cornerColor} strokeWidth={cornerWidth} strokeLinecap="square" />
        <path d="M 13 95 L 5 95 L 5 87"  stroke={cornerColor} strokeWidth={cornerWidth} strokeLinecap="square" />
        <path d="M 53 95 L 61 95 L 61 87" stroke={cornerColor} strokeWidth={cornerWidth} strokeLinecap="square" />

        {/* ── Letterpress registration marks ──────────────────────────────── */}
        <RegistrationMark cx={9}  cy={9} />
        <RegistrationMark cx={57} cy={9} />
        <RegistrationMark cx={9}  cy={91} />
        <RegistrationMark cx={57} cy={91} />

        {/* ── Vertical axis — old Japanese correspondence ─────────────────── */}
        <circle cx="33" cy="13" r="1.1" fill={markerColor} />
        <line x1="33" y1="14.2" x2="33" y2="32" stroke={axisColor} strokeWidth={axisWidth} />
        <path d={diamond(35)} fill="none" stroke={markerColor} strokeWidth="0.42" />
        <line x1="33" y1="38" x2="33" y2="44" stroke={axisColor} strokeWidth={axisWidth} />

        {/* ── "care" — embossed letterpress ────────────────────────────────── */}
        <text
          x="33"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7.5"
          fontWeight="300"
          letterSpacing="2.4"
          fill="rgba(85,60,32,0.70)"
          style={{
            fontFamily: 'var(--font-sarabun), Georgia, serif',
            filter: 'drop-shadow(0.22px 0.42px 0.28px rgba(45,25,8,0.26))',
          }}
        >
          care
        </text>

        <line x1="33" y1="56" x2="33" y2="62" stroke={axisColor} strokeWidth={axisWidth} />
        <path d={diamond(65)} fill="none" stroke={markerColor} strokeWidth="0.42" />
        <line x1="33" y1="68" x2="33" y2="86" stroke={axisColor} strokeWidth={axisWidth} />
        <circle cx="33" cy="87" r="1.1" fill={markerColor} />
      </svg>
    </div>
  )
}
