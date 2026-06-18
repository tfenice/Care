// Emotional Window system — editorial SVG compositions for 4 cards.
//
// The Emotional Window occupies the upper zone of the card (viewBox 0 0 300 160).
// It is NOT a watermark. It is a dedicated visual space — the emotional entrance.
//
// Design grammar:
//   viewBox  0 0 300 160 — landscape window coordinate space
//   Palette  #2C2416 (near-black) · #8B6F4E (care brown) · #C9A97A (sand)
//   Principle: abstract, spacious, contemplative, asymmetric where appropriate
//   Text lives below the window. Illustration supports — never dominates.

import type { ReactNode } from 'react'

type IllustrationFn = () => ReactNode

export const CARD_ILLUSTRATIONS: Record<string, IllustrationFn> = {

  // A-05 วันนี้ก็พอแล้ว — Today is enough
  // A circle that has arrived at rest. Off-center, low in the frame.
  // Bleeds below the window edge — the day continues, quietly, past the frame.
  // Asymmetry: settled to the left, as if drifting there after a long day.
  'A-05': () => (
    <>
      {/* Outer echo — very faint sand ring, bleeds off left + bottom */}
      <circle
        cx="118" cy="148" r="118"
        stroke="#C9A97A"
        strokeWidth="0.5"
        strokeOpacity="0.06"
      />
      {/* The circle — the day, arrived */}
      <circle
        cx="118" cy="112" r="76"
        stroke="#8B6F4E"
        strokeWidth="0.75"
        strokeOpacity="0.19"
      />
      {/* Ground line — where it settles */}
      <line
        x1="0" y1="144" x2="300" y2="144"
        stroke="#2C2416"
        strokeWidth="0.7"
        strokeOpacity="0.15"
        strokeLinecap="round"
      />
      {/* Secondary line — A-05 signature element, quieter echo */}
      <line
        x1="58" y1="153" x2="208" y2="153"
        stroke="#2C2416"
        strokeWidth="0.55"
        strokeOpacity="0.08"
        strokeLinecap="round"
      />
    </>
  ),

  // P-10 ไม่ต้องทำอะไร — You don't need to do anything
  // Concentric rings expanding from the right — arriving from off-frame.
  // No center dot. The center is already complete; it does not need to be marked.
  // Asymmetry: origin is at right edge; rings expand leftward into the window.
  'P-10': () => (
    <>
      {/* Outermost trace — barely perceptible */}
      <circle
        cx="248" cy="74" r="190"
        stroke="#C9A97A"
        strokeWidth="0.35"
        strokeOpacity="0.04"
      />
      {/* Outer ring */}
      <circle
        cx="248" cy="74" r="148"
        stroke="#8B6F4E"
        strokeWidth="0.42"
        strokeOpacity="0.07"
      />
      {/* Primary ring — the main form */}
      <circle
        cx="248" cy="74" r="106"
        stroke="#8B6F4E"
        strokeWidth="0.55"
        strokeOpacity="0.13"
      />
      {/* Inner ring */}
      <circle
        cx="248" cy="74" r="66"
        stroke="#8B6F4E"
        strokeWidth="0.45"
        strokeOpacity="0.09"
      />
      {/* Innermost suggestion */}
      <circle
        cx="248" cy="74" r="32"
        stroke="#8B6F4E"
        strokeWidth="0.35"
        strokeOpacity="0.06"
      />
    </>
  ),

  // H-04 เมล็ดที่ยังไม่งอก — The seed not yet sprouted
  // The window IS the empty sky above the ground.
  // The composition's power is in what isn't there — the vast empty space above the horizon.
  // The seed exists at the very edge of the frame, barely visible.
  'H-04': () => (
    <>
      {/* The ground — divides sky from soil */}
      <line
        x1="18" y1="106" x2="282" y2="106"
        stroke="#2C2416"
        strokeWidth="0.85"
        strokeOpacity="0.21"
        strokeLinecap="round"
      />
      {/* Seed oval — below the ground, partially visible, asymmetric left */}
      <ellipse
        cx="144" cy="136" rx="14" ry="9"
        stroke="#8B6F4E"
        strokeWidth="0.65"
        strokeOpacity="0.20"
      />
      {/* Upward tendril — working toward the surface, stops short */}
      <path
        d="M 144 127 Q 144 118 145 110"
        fill="none"
        stroke="#8B6F4E"
        strokeWidth="0.48"
        strokeOpacity="0.13"
        strokeLinecap="round"
      />
      {/* Root hint — goes below, clips at frame bottom */}
      <path
        d="M 144 145 Q 145 154 142 164"
        fill="none"
        stroke="#8B6F4E"
        strokeWidth="0.38"
        strokeOpacity="0.09"
        strokeLinecap="round"
      />
    </>
  ),

  // G-03 การเติบโตที่มองไม่เห็น — Invisible growth
  // Ground near the bottom of the window. The stem is almost nothing.
  // The root system exists below — in the space of words. The window shows the visible (almost nothing).
  // Asymmetry: stem is right of center, as if leaning toward light.
  'G-03': () => (
    <>
      {/* Ground line */}
      <line
        x1="18" y1="126" x2="282" y2="126"
        stroke="#2C2416"
        strokeWidth="0.7"
        strokeOpacity="0.17"
        strokeLinecap="round"
      />
      {/* The visible stem — barely anything — right of center */}
      <line
        x1="163" y1="126" x2="163" y2="56"
        stroke="#8B6F4E"
        strokeWidth="0.62"
        strokeOpacity="0.20"
        strokeLinecap="round"
      />
      {/* Stem ghost — very faint echo behind the stem */}
      <line
        x1="163" y1="126" x2="163" y2="74"
        stroke="#C9A97A"
        strokeWidth="1.4"
        strokeOpacity="0.06"
        strokeLinecap="round"
      />
      {/* Main shoot — curving left from stem tip */}
      <path
        d="M 163 56 C 159 47 150 44 142 42"
        fill="none"
        stroke="#8B6F4E"
        strokeWidth="0.5"
        strokeOpacity="0.15"
        strokeLinecap="round"
      />
      {/* Smaller secondary shoot — curves right, lower */}
      <path
        d="M 163 80 C 166 73 172 70 178 69"
        fill="none"
        stroke="#8B6F4E"
        strokeWidth="0.38"
        strokeOpacity="0.10"
        strokeLinecap="round"
      />
    </>
  ),
}

export function hasIllustration(code: string | null | undefined): boolean {
  return !!code && code in CARD_ILLUSTRATIONS
}
