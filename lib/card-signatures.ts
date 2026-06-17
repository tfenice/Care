// Signature shape definitions for all 40 Care cards.
// viewBox is 0 0 32 32 for every signature.
// All shapes use currentColor; the consumer sets color via CSS.

export interface Opts {
  sw?: number  // strokeWidth (default 1.5)
  op?: number  // opacity
  d?:  string  // strokeDasharray
  f?:  boolean // filled circle (fill="currentColor", no stroke)
}

export interface SCircle  { t: 'c'; cx: number; cy: number; r:  number;                      opts?: Opts }
export interface SEllipse { t: 'e'; cx: number; cy: number; rx: number; ry: number;           opts?: Opts }
export interface SLine    { t: 'l'; x1: number; y1: number; x2: number; y2: number;           opts?: Opts }
export interface SPath    { t: 'p'; d: string;                                                 opts?: Opts }
export type Shape = SCircle | SEllipse | SLine | SPath

const c = (cx: number, cy: number, r:  number,               opts?: Opts): SCircle   => ({ t: 'c', cx, cy, r,     opts })
const e = (cx: number, cy: number, rx: number, ry: number,   opts?: Opts): SEllipse  => ({ t: 'e', cx, cy, rx, ry, opts })
const l = (x1: number, y1: number, x2: number, y2: number,   opts?: Opts): SLine    => ({ t: 'l', x1, y1, x2, y2, opts })
const p = (d: string,                                         opts?: Opts): SPath    => ({ t: 'p', d,              opts })

export const CARD_SIGNATURES: Record<string, Shape[]> = {

  // ── Acceptance (A) — circle + ground line ──────────────────────────────────
  // Circle settles toward or onto a horizontal ground.

  'A-01': [c(16,15,9), l(4,24,28,24)],
  // Standard: medium circle resting on line, centered.

  'A-02': [c(16,12,12), l(2,24,30,24)],
  // Large: circle fills the frame, line extends edge-to-edge.

  'A-03': [c(16,12,7), l(5,24,27,24)],
  // Hover: small circle above line with a visible gap.

  'A-04': [c(13,15,9), l(2,24,28,24)],
  // Offset: circle slightly left — the imperfection of being human.

  'A-05': [c(16,17,7), l(4,24,28,24), l(10,27,22,27)],
  // Double floor: small circle + two ground lines.

  'A-06': [c(16,15,9), p('M 3 26 Q 16 22 29 26')],
  // Curved: circle rests on a gently bent ground.

  'A-07': [c(16,12,12), l(0,24,32,24,{op:0.5})],
  // Wide: large circle, full-width fading line.

  'A-08': [p('M 19.1 6.5 A 9 9 0 1 1 12.9 6.5'), l(4,24,28,24)],
  // Open: circle with gap at top — the form almost complete.

  'A-09': [c(16,17,7), c(16,17,11,{sw:0.75,op:0.45}), l(4,24,28,24)],
  // Held: small circle inside a thin outer ring — protected warmth.

  'A-10': [c(16,26,9), l(3,20,29,20)],
  // Submerged: circle mostly below line — permission to be incomplete.

  // ── Presence (P) — dot + ring ─────────────────────────────────────────────
  // Centered point within a ring boundary — the self attending.

  'P-01': [c(16,16,10), c(16,16,2.5,{f:true})],
  // Standard: full ring, centered dot. Presence itself.

  'P-02': [e(16,16,10,8), c(16,16,2.5,{f:true})],
  // Oval: ring slightly imperfect — the body's awareness.

  'P-03': [c(16,16,10), c(16,16,2.5,{f:true}), l(23,9,29,3)],
  // Exit: ring + dot + tangent line leaving — the moment passing.

  'P-04': [c(16,16,11), c(16,16,6,{sw:1}), c(16,16,2.5,{f:true})],
  // Rings: two concentric rings — sound expanding from a center.

  'P-05': [c(22,16,10), c(21,16,2.5,{f:true})],
  // Drift: ring shifted toward right edge — the wandering thought.

  'P-06': [c(16,16,8,{f:true})],
  // Point: large filled dot only, no ring — pure focus.

  'P-07': [c(16,16,4), c(16,16,1.2,{f:true})],
  // Quiet: very small ring + dot — permission to stop.

  'P-08': [c(16,16,9), c(16,16,13,{sw:0.6,op:0.3}), c(16,16,2.5,{f:true})],
  // Echo: ring + faint outer echo — home is here, not there.

  'P-09': [p('M 16 6 A 10 10 0 0 1 16 26'), c(18,16,2.5,{f:true})],
  // Half: right semicircle — light on one side only.

  'P-10': [c(16,16,10,{sw:0.4,op:0.2})],
  // Empty: barely-there ring, no dot — doing nothing.

  // ── Hope (H) — arc + horizon ──────────────────────────────────────────────
  // Arc rises above (or below for H-04) a horizontal horizon line.

  'H-01': [l(3,22,29,22), p('M 7 22 A 9 2 0 0 0 25 22')],
  // Barely: very flat arc just above horizon — the first light.

  'H-02': [l(4,22,28,22), p('M 5 26 A 11 11 0 0 0 27 26')],
  // Open: arc endpoints dip below horizon — opens outward, not closed.

  'H-03': [p('M 3 24 Q 16 22 29 24'), p('M 8 22 A 8 5 0 0 0 24 22')],
  // Soft: curved horizon, low arc — speak to yourself gently.

  'H-04': [l(2,18,30,18,{sw:2}), p('M 9 18 A 7 7 0 0 1 23 18')],
  // Seed: strong horizon, inverted arc below it — hope not yet expressed.

  'H-05': [p('M 7 20 A 9 9 0 0 0 25 20')],
  // Float: arc with no horizon — warmth from a distance.

  'H-06': [l(4,24,28,24,{op:0.35}), p('M 7 24 A 9 9 0 0 0 25 24')],
  // High: full semicircle, faint horizon — courage no one sees.

  'H-07': [l(4,22,28,22), p('M 7 22 A 14 12 0 0 0 30 8')],
  // Leaving: arc curves up and exits top-right — things still waiting.

  'H-08': [l(4,22,28,22), p('M 7 22 A 9 1.5 0 0 0 25 22',{sw:0.75})],
  // Thin: barely-cresting arc — change barely begun.

  'H-09': [l(4,22,28,22), p('M 10 22 A 6 4 0 0 0 22 22')],
  // Small: small centered arc — one step is enough.

  'H-10': [l(3,22,29,22,{sw:2}), p('M 7 22 A 9 9 0 0 0 25 22',{sw:2})],
  // Heavy: full semicircle, heavier strokes — you've made it through before.

  // ── Growth (G) — branching stem ───────────────────────────────────────────
  // Vertical stem with branches — origin expanding upward.

  'G-01': [l(16,28,16,8), l(16,17,30,7), l(16,14,10,8)],
  // Far: long branch to frame edge — you've come a long way.

  'G-02': [l(16,28,16,18), l(13,17,19,17), l(16,15,16,8), l(16,20,9,13), l(16,14,23,8)],
  // Notch: stem with a small horizontal mark — the mistake that taught.

  'G-03': [l(16,20,16,8), l(16,13,9,7), l(16,13,23,7), l(16,20,16,25), l(16,23,9,29), l(16,23,23,29)],
  // Roots: growth visible above and below — invisible growth.

  'G-04': [l(16,28,16,20), l(16,24,10,18), l(16,24,22,18), l(16,20,16,10), l(16,14,10,8), l(16,14,22,8)],
  // Double: two fork levels — try again.

  'G-05': [l(16,28,16,8), l(16,18,27,9)],
  // One: stem + single branch — strength not yet fully known.

  'G-06': [l(16,26,16,12), l(16,18,9,12), l(16,18,23,12)],
  // Even: symmetric short equal branches — thank yourself.

  'G-07': [l(16,28,16,8,{sw:2}), l(16,20,6,10), l(16,15,21,9)],
  // Heavy: thicker stem, asymmetric — the lesson pain left.

  'G-08': [l(16,20,16,8), l(16,14,10,8), l(16,14,22,8), l(16,20,10,28), l(16,20,22,28)],
  // Split: two roots at base — origins plural, growth singular.

  'G-09': [
    l(16,28,16,8),
    l(16,23,11,18), l(16,23,21,18),
    l(11,18,9,15),  l(21,18,23,15),
    l(16,17,11,12), l(16,17,21,12),
    l(16,11,13,7),  l(16,11,19,7),
  ],
  // Three: three fork levels + tiny extensions — small steps matter.

  'G-10': [l(16,22,16,9), l(16,13,9,7)],
  // Open: stem doesn't reach ground, one branch at top — still learning.
}
