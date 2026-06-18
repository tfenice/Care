# Hero Illustration Prototype

Prototype illustrations for 4 cards only. All other cards continue to use
the CardSignature watermark system.

---

## Visual Language

### What these are not

These are not icons. Not decorative borders. Not background patterns.
They are visual poems — the same kind of image you might find pressed inside
a letter, or printed lightly on quality writing paper. They carry meaning
without carrying content.

### Palette

Three values only:

| Name       | Hex       | Use                                            |
|------------|-----------|------------------------------------------------|
| Near-black | `#2C2416` | Ground lines, structural horizon marks         |
| Care brown | `#8B6F4E` | Primary illustration forms, roots, circles     |
| Sand       | `#C9A97A` | Echo traces, outer rings, the barely-there     |

No category colors appear in the illustrations. The illustration layer exists
outside the category identity system — it belongs to the specific card, not
the family.

### Opacity strategy

Each SVG element carries its own `strokeOpacity`. There is no parent opacity
wrapper. This gives precise control:

- `strokeOpacity 0.20–0.24` — primary forms (visible but quiet)
- `strokeOpacity 0.10–0.16` — secondary elements (felt more than seen)
- `strokeOpacity 0.04–0.09` — echo traces (barely there)

The compound effect is that the illustration reads as atmospheric.
At arm's length it disappears. Up close it is present.

### Placement

All illustrations use `viewBox="0 0 300 500"` — a portrait coordinate space
roughly matching card proportions. They are rendered as `position: absolute`,
`width: 100%`, `height: 100%` with `preserveAspectRatio="xMidYMid slice"`.

The card's `overflow-hidden` clips anything that extends beyond the card edge.
Deep roots and outer rings extending past the frame are intentional — they
suggest continuation beyond what is visible.

### Layer order

```
1. Paper grain       absolute, full-bleed, background
2. Inner frame       absolute, inset-2, structural
3. Illustration      absolute, full-card — only for the 4 prototype cards
   OR                (for all other cards)
   Signature mark    absolute, centered, opacity 0.06 via color wrapper
4. Card content      relative, text on top of everything
```

---

## Cards

### A-05 — วันนี้ก็พอแล้ว (Today is enough)

**Concept:** A circle that has arrived. The day is complete without needing
to rise further. The circle in the upper half of the card rests on a ground
line — it is not striving, not balanced, just landed. A second shorter line
below it (the A-05 signature element) gives the ground a second register,
as though the earth has depth.

A very faint echo circle (radius 148, sand color) surrounds the whole
composition — the feeling of something that once extended further and has
now quieted.

**Visual weight:** Upper 48% of card. The lower body text area is clear.

**Readability:** The circle (strokeOpacity 0.20) is the only element with
any presence. It sits behind the category pill and title. Both remain fully
legible — the circle feels like a watermark that happens to be larger than usual.

**Elements:**
```
Echo circle    cx=150 cy=148 r=148   sand, 0.07 opacity
Main circle    cx=150 cy=148 r=90    care brown, 0.20 opacity
Ground line    y=238 x: 28→272       near-black, 0.18 opacity
Second line    y=262 x: 90→210       near-black, 0.10 opacity
```

---

### P-10 — ไม่ต้องทำอะไร (You don't need to do anything)

**Concept:** Vastness around a still center. Four concentric rings expanding
outward from the card's midpoint — but no dot at the center. The text lives
inside the innermost ring. The dot that is usually the mark of Presence
(the self, attending) is absent here, because the card says: you don't need
to be anything right now.

The outer rings extend beyond the card edges, clipped by `overflow-hidden`.
What remains visible is only part of a larger quiet.

**Visual weight:** Centered vertically, spanning most of the card height.
Because the rings are centered at y=250 (midcard) with radii 85–200, they
permeate the entire text area. This is intentional — the rings don't avoid
the text, they surround it.

**Readability:** The elements are at strokeOpacity 0.04–0.15, significantly
lower than A-05. At this density, four concentric rings do not compete with
text. They create a quiet field around the words.

**Elements:**
```
Outer trace    cx=150 cy=250 r=200   sand, 0.04 opacity
Second ring    cx=150 cy=250 r=162   care brown, 0.08 opacity
Primary ring   cx=150 cy=250 r=128   care brown, 0.15 opacity
Inner faint    cx=150 cy=250 r=85    care brown, 0.06 opacity
```

---

### H-04 — เมล็ดที่ยังไม่งอก (The seed not yet sprouted)

**Concept:** A cross-section of earth. The ground line divides what is visible
from what is not. Above: empty air — the hope that hasn't arrived. Below:
a seed with the first tentative root movements, and one upward tendril that
reaches toward the surface but stops 32 units short of the ground line.

The seed is not dormant. It is working. The emptiness above the ground is
not absence — it is waiting.

**Visual weight:** Ground line at y=210 (42% down). The seed and roots occupy
the lower 58% of the card. The upper 42% (above the ground line) is empty —
no illustration elements, just paper and text.

**Placement recommendation:** The category pill and title appear above y=210.
The body text occupies roughly y=260–380. The seed oval (y=290–310) and
roots (y=310–400) sit behind body text. Opacity must be lower here — and at
strokeOpacity 0.08–0.24, even the seed oval is subtle enough that text
printed over it at normal weight remains readable.

**Readability risk:** The highest-opacity element (seed ellipse, 0.24) is
at y=300, which is inside the body text zone. This is the one element to
watch in practice — if the card body is a single long sentence that happens
to break at y=300, the seed might show faint coincidence with a letter
descender. Acceptable for a prototype; in production, consider reducing
the seed's strokeOpacity to 0.16.

**Elements:**
```
Ground line    y=210 x: 18→282       near-black, 0.22 opacity  stroke 0.85
Seed ellipse   cx=150 cy=300 r:15×10 care brown, 0.24 opacity
Root (center)  M 150 310 Q … 360     care brown, 0.18 opacity
Root (right)   M 150 310 Q … 354     care brown, 0.14 opacity
Root (left)    M 150 310 Q … 346     care brown, 0.14 opacity
Fine tips ×3   extensions             care brown, 0.08–0.09 opacity
Upward reach   M 150 290 Q … 242     care brown, 0.16 opacity  (stops at y=242)
```

---

### G-03 — การเติบโตที่มองไม่เห็น (Invisible growth)

**Concept:** What is visible above the ground is almost nothing — a thin
stem and one small shoot. What is real below the ground is vast: three tiers
of branching roots plus a deep tap root, spreading wider at each level and
growing more faint as they descend. The final deep laterals (y=368–458) are
barely perceptible at strokeOpacity 0.06.

This is the visual argument of the card: the growth you cannot see is larger
than the growth you can. The illustration proves it geometrically.

**Visual weight:** Ground line at y=200 (40% down). Stem and shoot above
(y=148–200) are in the title area — very subtle. The root system below
(y=200–458) occupies most of the card and permeates all text zones.

**Placement recommendation:** The root system's three tiers are designed
at decreasing opacity (0.11 → 0.08 → 0.06), so the lower text zones
(reflection prompt, footer) coincide with the finest, most faint roots.
The first branching (y=248–296) at 0.14 opacity falls behind body text.
At this opacity level the roots are present but do not compete.

**Readability:** Of the four illustrations, G-03 has the most SVG elements
(16+ lines). The cumulative visual weight in the body text zone (y=200–380)
could register as subtle noise at large sizes. If this becomes a concern
in production, the second-tier roots (0.11) can be reduced to 0.07.

**Elements:**
```
Ground line    y=200 x: 18→282          near-black, 0.18 opacity
Stem           (150,200)→(150,148)       care brown, 0.20 opacity
Shoot          M 150 148 C … 134        care brown, 0.15 opacity
Tap root       (150,200)→(150,290)      care brown, 0.16 opacity
1st tier ×2    (150,248)→(108,296) etc  care brown, 0.14 opacity each
2nd tier ×4    extensions               care brown, 0.11 opacity each
3rd tier ×6    fine tips                care brown, 0.08 opacity each
Tap continues  (150,290)→(150,416)      care brown, 0.09 opacity
Deep laterals  (150,368)→(85,458) etc   care brown, 0.06 opacity each
```

---

## What is NOT implemented

36 cards continue to use the CardSignature watermark system. The illustration
layer is additive — `CardFace` and `CardReveal` check `hasIllustration(code)`
before rendering; if false, the existing signature watermark at 0.06 opacity
is shown unchanged.

No existing behavior is changed for non-prototype cards.

---

## Implementation files

| File | Role |
|---|---|
| `lib/card-illustrations.tsx` | 4 render functions returning SVG group elements |
| `components/care/CardIllustration.tsx` | Full-card SVG wrapper with slice scaling |
| `components/care/CardFace.tsx` | Conditionally renders illustration or watermark |
| `components/care/CardReveal.tsx` | Same |

---

## Future considerations

- The prototype uses `strokeOpacity` for all opacity control. A future pass
  could add subtle fill areas (very faint `fillOpacity="0.02"`) to create
  depth in the seed (H-04) and root space (G-03).
- The root system in G-03 could be rendered with organic variation using
  cubic bezier curves instead of straight lines — more hand-drawn, less
  geometric.
- P-10's rings could use `strokeDasharray` to create a very subtle broken
  quality — as though the rings are fading in and out of presence.
- If any of these 4 cards is later given a different sort_order in the database,
  the code key in `CARD_ILLUSTRATIONS` must be updated to match.
