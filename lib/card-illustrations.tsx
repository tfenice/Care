// Emotional Window — Living Library Edition (V3)
//
// Part of the Care Living Library illustration system.
// Full art direction: docs/LIVING_LIBRARY_ART_DIRECTION.md
//
// Coordinate space: viewBox 0 0 300 160 (landscape, upper 35% of card)
// Palette: #2C2416 (near-black) · #8B6F4E (care brown) · #C9A97A (sand)
//
// Four illustration layers per card:
//   1. Primary Subject  — what this card is about
//   2. Environment      — ground, air, water, distance, time
//   3. Construction     — editorial marks, letterpress geometry, botanical notation
//   4. Memory           — ONE hidden detail, nearly invisible, discovered over time
//
// Opacity strategy:
//   0.18–0.22  primary forms  — visible but quiet
//   0.09–0.16  secondary      — felt more than seen
//   0.03–0.08  atmosphere     — barely there
//   0.02–0.05  memory layer   — discovered only after looking many times

import type { ReactNode } from 'react'

type IllustrationFn = () => ReactNode

export const CARD_ILLUSTRATIONS: Record<string, IllustrationFn> = {

  // ── A-05 วันนี้ก็พอแล้ว — Today is enough ────────────────────────────────────
  //
  // Concept: a stone that has landed. Not rising, not striving — arrived.
  // The circle is a geological body: it has sediment layers inside, gravity
  // pulling it to ground, and an atmospheric echo of what it once was.
  //
  // Category language: Ground · Stone · Gravity · Sediment · Soft horizon
  //
  // The circle meets the ground at x≈49 and x≈187 (computed from cx=118, cy=112, r=76, y=144).
  // Construction marks at those tangent points reference the letterpress tradition
  // of marking where geometry was measured.
  //
  'A-05': () => (
    <>
      {/* ── Atmosphere ──────────────────────────────────────────────── */}

      {/* Distant horizon — the softest register, the day extends beyond */}
      <line
        x1="0" y1="148" x2="300" y2="148"
        stroke="#C9A97A" strokeWidth="0.38" strokeOpacity="0.05"
        strokeDasharray="9 13" strokeLinecap="round"
      />
      {/* Second horizon layer — even further, barely perceptible */}
      <line
        x1="0" y1="155" x2="300" y2="155"
        stroke="#C9A97A" strokeWidth="0.28" strokeOpacity="0.03"
        strokeDasharray="5 16" strokeLinecap="round"
      />

      {/* ── The day ─────────────────────────────────────────────────── */}

      {/* Outer echo — faint memory of how large the day felt at its start */}
      <circle
        cx="118" cy="148" r="118"
        stroke="#C9A97A" strokeWidth="0.5" strokeOpacity="0.06"
      />

      {/* Geological strata — lower arc only, inside the circle.
          Sediment layers: the stone has depth, the day has weight. */}
      <path
        d="M 60 134 A 66 66 0 0 0 176 134"
        fill="none" stroke="#8B6F4E" strokeWidth="0.33" strokeOpacity="0.08"
        strokeLinecap="round"
      />
      <path
        d="M 80 140 A 46 46 0 0 0 156 140"
        fill="none" stroke="#8B6F4E" strokeWidth="0.28" strokeOpacity="0.05"
        strokeLinecap="round"
      />

      {/* The main circle — the day, arrived at rest */}
      <circle
        cx="118" cy="112" r="76"
        stroke="#8B6F4E" strokeWidth="0.75" strokeOpacity="0.19"
      />

      {/* ── Ground ──────────────────────────────────────────────────── */}

      {/* Ground line — where the day settles */}
      <line
        x1="0" y1="144" x2="300" y2="144"
        stroke="#2C2416" strokeWidth="0.7" strokeOpacity="0.15"
        strokeLinecap="round"
      />

      {/* Plumb line — gravity, from circle center to ground.
          Marks that this stone fell here intentionally. */}
      <line
        x1="118" y1="112" x2="118" y2="144"
        stroke="#2C2416" strokeWidth="0.26" strokeOpacity="0.06"
        strokeDasharray="1.5 3" strokeLinecap="round"
      />

      {/* Construction marks — where circle meets ground.
          Letterpress measurement: the geometer checked this. */}
      <line
        x1="49" y1="141" x2="49" y2="147"
        stroke="#2C2416" strokeWidth="0.38" strokeOpacity="0.10"
        strokeLinecap="round"
      />
      <line
        x1="187" y1="141" x2="187" y2="147"
        stroke="#2C2416" strokeWidth="0.38" strokeOpacity="0.10"
        strokeLinecap="round"
      />

      {/* Second ground register — earth has depth, the second layer below */}
      <line
        x1="58" y1="153" x2="208" y2="153"
        stroke="#2C2416" strokeWidth="0.55" strokeOpacity="0.08"
        strokeLinecap="round"
      />

      {/* ── Memory layer ─────────────────────────────────────────────── */}
      {/* The zenith mark — a geometer once measured this circle's highest point.
          The stone was studied. Its height was known. The measurement remains,
          nearly erased, at the top of the arc where the eye rarely goes.
          cx=118, cy=36 (= cy_circle − r = 112 − 76) */}
      <line
        x1="115" y1="36" x2="121" y2="36"
        stroke="#2C2416" strokeWidth="0.25" strokeOpacity="0.05"
        strokeLinecap="round"
      />
      <line
        x1="118" y1="33" x2="118" y2="39"
        stroke="#2C2416" strokeWidth="0.25" strokeOpacity="0.05"
        strokeLinecap="round"
      />
    </>
  ),

  // ── P-10 ไม่ต้องทำอะไร — You don't need to do anything ──────────────────────
  //
  // Concept: still water after something landed. The rings expand outward
  // from the right edge — from beyond the frame, something arrived, and
  // the water is remembering it. The center is marked but not emphasized:
  // the point of stillness is complete without being declared.
  //
  // Category language: Breath · Still water · Ripples · Balance · Centre · Attention
  //
  // Origin: cx=248, cy=74 (just inside right edge)
  // Undisturbed surface: the horizontal at y=74, left of where the rings reach (x<58)
  //
  'P-10': () => (
    <>
      {/* ── Breath / air ────────────────────────────────────────────── */}

      {/* Wind lines — air crossing the surface before the rings arrive.
          Broken quality: the breath isn't steady, it drifts. */}
      <line
        x1="0" y1="28" x2="130" y2="28"
        stroke="#C9A97A" strokeWidth="0.30" strokeOpacity="0.05"
        strokeDasharray="18 8 4 8" strokeLinecap="round"
      />
      <line
        x1="0" y1="40" x2="90" y2="40"
        stroke="#C9A97A" strokeWidth="0.25" strokeOpacity="0.04"
        strokeDasharray="12 10" strokeLinecap="round"
      />

      {/* Undisturbed water surface — the still part, before the rings */}
      <line
        x1="0" y1="74" x2="54" y2="74"
        stroke="#C9A97A" strokeWidth="0.28" strokeOpacity="0.04"
        strokeLinecap="round"
      />

      {/* ── Ripples ─────────────────────────────────────────────────── */}

      {/* Outermost trace — the ripple that has nearly faded */}
      <circle
        cx="248" cy="74" r="190"
        stroke="#C9A97A" strokeWidth="0.35" strokeOpacity="0.04"
      />
      {/* Outer ring */}
      <circle
        cx="248" cy="74" r="148"
        stroke="#8B6F4E" strokeWidth="0.42" strokeOpacity="0.07"
      />
      {/* Primary ring — the main form. Nearly complete, one ink break.
          Circumference ≈ 666; dasharray 655+18=673 → visible gap ≈ 11 units */}
      <circle
        cx="248" cy="74" r="106"
        stroke="#8B6F4E" strokeWidth="0.55" strokeOpacity="0.13"
        strokeDasharray="655 18"
      />
      {/* Inner ring */}
      <circle
        cx="248" cy="74" r="66"
        stroke="#8B6F4E" strokeWidth="0.45" strokeOpacity="0.09"
      />
      {/* Innermost suggestion — the ring closest to stillness */}
      <circle
        cx="248" cy="74" r="32"
        stroke="#8B6F4E" strokeWidth="0.35" strokeOpacity="0.07"
      />

      {/* ── Still point ─────────────────────────────────────────────── */}

      {/* Construction crosshair — the origin marked, not celebrated.
          Letterpress register: the geometer found the center. */}
      <line
        x1="243" y1="74" x2="253" y2="74"
        stroke="#2C2416" strokeWidth="0.30" strokeOpacity="0.11"
        strokeLinecap="round"
      />
      <line
        x1="248" y1="69" x2="248" y2="79"
        stroke="#2C2416" strokeWidth="0.30" strokeOpacity="0.11"
        strokeLinecap="round"
      />

      {/* Inner stillness ring — the smallest, the nearest to center.
          Not a dot: the center doesn't need to be filled. */}
      <circle
        cx="248" cy="74" r="9"
        stroke="#8B6F4E" strokeWidth="0.28" strokeOpacity="0.08"
      />

      {/* ── Memory layer ─────────────────────────────────────────────── */}
      {/* The origin drop — the specific point that fell and caused all the rings.
          Presence is not the absence of disturbance. It is attention to what broke
          the stillness. Rendered as a filled point beneath the crosshair.
          Found only by someone who follows the rings inward past everything. */}
      <circle cx="248" cy="74" r="1.8" fill="#8B6F4E" fillOpacity="0.06" />
    </>
  ),

  // ── H-04 เมล็ดที่ยังไม่งอก — The seed not yet sprouted ──────────────────────
  //
  // Concept: a geological cross-section of morning earth. The sky above the
  // ground is atmospheric — it has depth and light angle. Below, the seed
  // has internal structure: outer coat, embryo within, the first tendril
  // reaching (but not arriving), a nascent bud at its tip, and roots
  // beginning to map the soil.
  //
  // Category language: Morning · Distance · Sky · Light · Horizon · Air · Emergence
  //
  // Ground: y=106. Sky zone: y=0–106. Earth zone: y=106–160.
  // Morning light angle: line from upper-right (260,18) to lower-left (42,96).
  //
  'H-04': () => (
    <>
      {/* ── Sky / atmosphere ────────────────────────────────────────── */}

      {/* Upper atmosphere — the distant horizon layer, barely visible */}
      <line
        x1="22" y1="54" x2="278" y2="54"
        stroke="#C9A97A" strokeWidth="0.28" strokeOpacity="0.04"
        strokeDasharray="35 15 5 15" strokeLinecap="round"
      />

      {/* Morning light — oblique angle, the sun is low and to the right.
          This line doesn't describe light; it describes the quality of it. */}
      <line
        x1="260" y1="18" x2="42" y2="96"
        stroke="#C9A97A" strokeWidth="0.22" strokeOpacity="0.03"
        strokeLinecap="round"
      />

      {/* ── Ground / earth ──────────────────────────────────────────── */}

      {/* Main horizon — the division between visible and hidden */}
      <line
        x1="18" y1="106" x2="282" y2="106"
        stroke="#2C2416" strokeWidth="0.85" strokeOpacity="0.21"
        strokeLinecap="round"
      />

      {/* Soil stratification — first layer below surface.
          Earth is not uniform; it has memory in its layers. */}
      <line
        x1="35" y1="117" x2="255" y2="117"
        stroke="#2C2416" strokeWidth="0.35" strokeOpacity="0.07"
        strokeDasharray="8 6" strokeLinecap="round"
      />
      {/* Second soil layer — deeper, denser, nearer the seed */}
      <line
        x1="55" y1="128" x2="225" y2="128"
        stroke="#2C2416" strokeWidth="0.28" strokeOpacity="0.05"
        strokeDasharray="6 9" strokeLinecap="round"
      />

      {/* ── Seed ────────────────────────────────────────────────────── */}

      {/* Outer seed coat — the visible form */}
      <ellipse
        cx="144" cy="136" rx="14" ry="9"
        stroke="#8B6F4E" strokeWidth="0.65" strokeOpacity="0.20"
      />
      {/* Inner structure — the embryo, the axis of growth within.
          Not visible to the eye, but present. */}
      <ellipse
        cx="144" cy="136" rx="8" ry="5"
        stroke="#8B6F4E" strokeWidth="0.30" strokeOpacity="0.09"
      />

      {/* ── Emergence ───────────────────────────────────────────────── */}

      {/* Upward tendril — working toward the surface, stops before ground */}
      <path
        d="M 144 127 Q 143 118 144 110"
        fill="none" stroke="#8B6F4E" strokeWidth="0.48" strokeOpacity="0.13"
        strokeLinecap="round"
      />
      {/* Nascent bud — the first hint of leaves, at the tendril tip.
          Not yet open. Just the suggestion of what will be. */}
      <path
        d="M 144 110 L 141 107"
        fill="none" stroke="#8B6F4E" strokeWidth="0.32" strokeOpacity="0.09"
        strokeLinecap="round"
      />
      <path
        d="M 144 110 L 147 107"
        fill="none" stroke="#8B6F4E" strokeWidth="0.32" strokeOpacity="0.09"
        strokeLinecap="round"
      />

      {/* ── Roots ───────────────────────────────────────────────────── */}

      {/* Tap root — going deeper, seeking water */}
      <path
        d="M 144 145 Q 144 154 142 160"
        fill="none" stroke="#8B6F4E" strokeWidth="0.38" strokeOpacity="0.09"
        strokeLinecap="round"
      />
      {/* Left lateral — the root system spreads to explore */}
      <path
        d="M 144 149 Q 137 155 131 158"
        fill="none" stroke="#8B6F4E" strokeWidth="0.28" strokeOpacity="0.07"
        strokeLinecap="round"
      />
      {/* Right lateral */}
      <path
        d="M 144 149 Q 151 155 157 157"
        fill="none" stroke="#8B6F4E" strokeWidth="0.28" strokeOpacity="0.07"
        strokeLinecap="round"
      />

      {/* ── Memory layer ─────────────────────────────────────────────── */}
      {/* The sky beyond the sky — there is always more distance than the eye reaches.
          A second, nearly invisible horizon at y=8, above the atmosphere line at y=54.
          Hope does not stop at the visible horizon. There is another beyond it.
          Found only by someone who lets their gaze travel all the way to the top. */}
      <line
        x1="40" y1="8" x2="260" y2="8"
        stroke="#C9A97A" strokeWidth="0.22" strokeOpacity="0.025"
        strokeDasharray="40 20" strokeLinecap="round"
      />
    </>
  ),

  // ── G-03 การเติบโตที่มองไม่เห็น — Invisible growth ─────────────────────────
  //
  // Concept: a plant in cross-section. Above ground: a stem with growth joints,
  // two shoots, one bud forming. Below ground (visible in the window's lower
  // 34 units): the beginning of a root system that implies much more below.
  // The stem has a very slight organic curve — it grew, it was not drawn.
  //
  // Category language: Roots · Branches · Organic rhythm · Unfinished movement
  //
  // Stem: organic path from ground (163,126) to tip (163,56).
  // Joints at y=100 (lower) and y=74 (upper) — the bamboo logic of growth.
  // Root zone: y=126 to y=160 (34 units visible).
  //
  'G-03': () => (
    <>
      {/* ── Ground ──────────────────────────────────────────────────── */}

      <line
        x1="18" y1="126" x2="282" y2="126"
        stroke="#2C2416" strokeWidth="0.7" strokeOpacity="0.17"
        strokeLinecap="round"
      />

      {/* ── Stem ────────────────────────────────────────────────────── */}

      {/* Ghost of stem volume — the thickness the plant remembers */}
      <line
        x1="163" y1="126" x2="163" y2="56"
        stroke="#C9A97A" strokeWidth="1.4" strokeOpacity="0.06"
        strokeLinecap="round"
      />

      {/* The stem — very slightly curved, as a real plant growing toward light.
          Control point at (162,91) creates a near-imperceptible lean leftward. */}
      <path
        d="M 163 126 Q 162 91 163 56"
        fill="none" stroke="#8B6F4E" strokeWidth="0.62" strokeOpacity="0.20"
        strokeLinecap="round"
      />

      {/* Growth nodes — the joints where the plant paused and redirected.
          Upper node is fainter: it is older, more established. */}
      <line
        x1="160" y1="100" x2="166" y2="100"
        stroke="#8B6F4E" strokeWidth="0.38" strokeOpacity="0.12"
        strokeLinecap="round"
      />
      <line
        x1="160" y1="74" x2="166" y2="74"
        stroke="#8B6F4E" strokeWidth="0.30" strokeOpacity="0.09"
        strokeLinecap="round"
      />

      {/* ── Shoots ──────────────────────────────────────────────────── */}

      {/* Main shoot — from tip, curving left toward the light */}
      <path
        d="M 163 56 C 159 47 150 44 142 42"
        fill="none" stroke="#8B6F4E" strokeWidth="0.50" strokeOpacity="0.15"
        strokeLinecap="round"
      />

      {/* Bud at main shoot tip — the unfinished movement, the becoming.
          A closed curve suggesting a leaf not yet open. */}
      <path
        d="M 142 42 C 139 39 140 37 142 37 C 144 37 145 39 142 42"
        fill="none" stroke="#8B6F4E" strokeWidth="0.30" strokeOpacity="0.10"
        strokeLinecap="round"
      />

      {/* Secondary shoot — from lower node, curves right */}
      <path
        d="M 163 80 C 166 73 172 70 178 69"
        fill="none" stroke="#8B6F4E" strokeWidth="0.38" strokeOpacity="0.10"
        strokeLinecap="round"
      />

      {/* Third shoot — from lowest node, very subtle, opposite direction.
          The plant explored several paths. */}
      <path
        d="M 163 100 C 160 95 155 92 150 91"
        fill="none" stroke="#8B6F4E" strokeWidth="0.28" strokeOpacity="0.07"
        strokeLinecap="round"
      />

      {/* ── Root system (visible in window) ────────────────────────── */}

      {/* Tap root — the primary vertical descent */}
      <line
        x1="163" y1="126" x2="163" y2="155"
        stroke="#8B6F4E" strokeWidth="0.45" strokeOpacity="0.12"
        strokeLinecap="round"
      />

      {/* First lateral roots — the system begins to spread */}
      <path
        d="M 163 139 Q 154 147 147 153"
        fill="none" stroke="#8B6F4E" strokeWidth="0.30" strokeOpacity="0.09"
        strokeLinecap="round"
      />
      <path
        d="M 163 139 Q 172 147 179 152"
        fill="none" stroke="#8B6F4E" strokeWidth="0.30" strokeOpacity="0.09"
        strokeLinecap="round"
      />

      {/* Deep root suggestions — barely perceptible at frame edge.
          The system extends far beyond what the window can show. */}
      <path
        d="M 147 153 Q 134 159 122 160"
        fill="none" stroke="#8B6F4E" strokeWidth="0.20" strokeOpacity="0.05"
        strokeLinecap="round"
      />
      <path
        d="M 179 152 Q 192 158 204 160"
        fill="none" stroke="#8B6F4E" strokeWidth="0.20" strokeOpacity="0.05"
        strokeLinecap="round"
      />

      {/* ── Memory layer ─────────────────────────────────────────────── */}
      {/* The distant light — a faint circle in the upper-left corner.
          Growth has a direction even when we don't know what we're growing toward.
          The shoot curves left; the stem leans left; and far above, in the empty
          sky opposite the stem, something waits. Found by looking past the bud,
          into space the plant has not yet reached. */}
      <circle
        cx="48" cy="22" r="9"
        stroke="#C9A97A" strokeWidth="0.28" strokeOpacity="0.04"
      />
    </>
  ),
}

export function hasIllustration(code: string | null | undefined): boolean {
  return !!code && code in CARD_ILLUSTRATIONS
}
