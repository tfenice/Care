# Card System — Architecture Reference

**The card is not a UI component. It is the physical manifestation of one chapter in the Living Library.**

Every design decision in this document flows from that premise.

---

## Component Hierarchy

```
ChapterCard                   ← the canonical chapter object (default export)
├── CardPaper                 ← paper material wrapper (named export)
│   ├── grain overlay         ← always present on any paper surface
│   └── inner editorial frame ← stationery border spanning full card face
└── EditorialWindow           ← visual zone, 192px (named export)
    ├── CardIllustration      ← V3 Living Library illustration (if exists)
    └── CardSignature         ← identity mark / watermark fallback
```

`CardBack` is a sibling object — the reverse face of the card.
It belongs to a different moment in the ritual (before the chapter is revealed).

---

## Single Responsibilities

| Component | Responsibility | What it must NOT do |
|---|---|---|
| `ChapterCard` | Compose the complete chapter object | Animate itself, fetch data, manage state |
| `CardPaper` | Paper material: background, grain, border, radius, shadow | Know anything about chapter content |
| `EditorialWindow` | Host the visual: illustration or signature fallback, 192px | Render typography, manage animation |
| `CardIllustration` | Render a V3 SVG illustration by chapter code | Fall back, render non-SVG |
| `CardSignature` | Render the identity mark or watermark | Show chapter content |
| `CardBack` | Render the card reverse face | Know anything about chapter content |
| `CardReveal` | Orchestrate the reveal ritual (back → fade → face) | Define card layout or content |

---

## Rendering Pipeline

### /cards — Drawing a card

```
CardDeck → CardBack (sm, fan of 7)
     ↓ user taps
CardReveal → CardBack (lg, animate=true)   ← waiting phase
          → CardBack (lg, opacity:0)        ← fading phase
          → ChapterCard (care-card-in)       ← revealed
          → PrimaryButton (care-section-in, 550ms delay)
```

### /cards/second — The continuation

```
SecondPage
  └── CardPaper (page shadow)
        └── EditorialWindow (showFloor=false)  ← same illustration as ChapterCard
  └── origin story text (opacity fade, 1.2s)
  └── reflection + CTA (opacity fade, 2.2s)
```

### /collection/[cardId] — Archive view

```
CollectionCardPage
  └── ChapterCard (static, no animation)
  └── encounter metadata
```

### /preview — Visual specification

```
PreviewPage
  └── ChapterCard × 4   (01 — all categories)
  └── CardBack × 3      (02 — lg, lg+animate, sm×7)
  └── EditorialWindow × 4 (03 — standalone, wrapped in CardPaper)
```

---

## Token Hierarchy

Every visual value must flow through the Paper Language System. No hardcoded colors, sizes, or shadows.

```
Paper Language tokens (globals.css :root)
  └── Paper tones      --paper-1/2/3, --paper-back-1/2/3
  └── Grain            --grain-color, --grain-size, --grain-dot
  └── Borders          --paper-border, --paper-border-inner, --paper-border-soft
  └── Radius           --paper-radius-card, --paper-radius-inner
  └── Shadows          --paper-shadow-lift, --paper-shadow-rest, --paper-shadow-page
  └── Ink              --ink-1/2/3/4, --ink-brown, --ink-muted, --ink-copper
  └── Motion           --ease-settle/ink/dissolve/drift, --dur-micro/brief/settle/page/ink/slow
  └── Tracking         --track-word, --track-mark, --track-stamp
      └── Category tokens (lib/card-tokens.ts)
          └── getCategoryToken(categoryName)
              └── CategoryToken { slug, code, color, rgb, feeling }
                  └── categoryPillStyle(token)
                  └── categoryAccentStyle(token)
                      └── ChapterCard, CardReveal, SecondPage, preview
```

---

## Animation Boundaries

**The card is a static object. Motion belongs to the world around it.**

| Context | Who animates | How |
|---|---|---|
| Card arrival on reveal | `CardReveal` | `className="care-card-in"` passed to `ChapterCard` |
| CTA appearance | `CardReveal` | `care-section-in` + `animationDelay: '550ms'` |
| Card back breathing | `CardReveal` | `animate` prop on `CardBack` |
| Back fade-out | `CardReveal` | inline `opacity` transition |
| Page entrance | page component | `care-page-enter` on wrapper |
| Illustration settle | `SecondPage` | JS `opacity` transition (1.2s phase) |

**Never put animation logic inside `ChapterCard`.**
The `animated` prop that existed on `CardFace` has been intentionally removed.

### Animation classes

```css
.care-card-in      /* whole card arrives: translateY(18px) → 0, scale(0.97→1) */
.care-section-in   /* element arrives: translateY(8px) → 0 */
.care-ink-in       /* opacity only: pure ink absorbing into paper */
.care-paper-settle /* page-weight settle: translateY(6px) → 0 */
.care-page-enter   /* page-level: translateY(10px) → 0 */
.care-back-breathe /* infinite breathing: scale(1 → 1.012) */
```

All animations are cancelled by `prefers-reduced-motion: reduce` (globals.css).

---

## Illustration Boundaries

One pipeline. One format. No exceptions.

```
lib/card-illustrations.tsx   ← source of truth (V3, Living Library grammar)
  └── CARD_ILLUSTRATIONS: Record<string, () => JSX.Element>
  └── hasIllustration(code): boolean
      └── components/care/CardIllustration.tsx   ← thin wrapper
          └── <svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid slice">
              └── EditorialWindow (inside ChapterCard)
              └── EditorialWindow (standalone in SecondPage via CardPaper)
              └── /preview (via EditorialWindow in spec page)
```

**Laws:**
- SVG only — no raster assets, no external images
- No solid fills — all stroke-only in illustration paths
- No pure black (#000000) or pure white (#FFFFFF) in illustration paths
- Four-layer grammar: Primary Subject (0.18–0.22 opacity), Environment (0.09–0.16), Construction (0.03–0.08), Memory Layer (0.02–0.05)
- Fall back to `CardSignature` when no illustration exists for a code
- Never render the fallback alongside the illustration

---

## Extension Rules

### Adding a new illustration

1. Add the render function to `lib/card-illustrations.tsx` under the chapter code (e.g., `'A-09'`)
2. Follow the V3 four-layer grammar — see `docs/CARD_ILLUSTRATION_LANGUAGE.md`
3. Nothing else needs to change. `hasIllustration()` detects it automatically.

### Adding a new chapter category

1. Add the token to `CATEGORY_TOKENS` in `lib/card-tokens.ts`
2. Add the CSS variable to `globals.css` `@theme` and `:root`
3. Add a symbol to `components/care/card-symbols.tsx`
4. The card system picks it up automatically via `getCategoryToken()`

### Adding a new render surface

If a new page needs to show a full chapter card: import `ChapterCard`.
If it needs just the visual zone: import `CardPaper` + `EditorialWindow`.
Never inline the paper material or illustration logic directly in the page.

---

## Deletion Rules

A component may be deleted when:
1. No file in `/app` or `/components` imports it
2. It has been replaced by a named canonical component in this document
3. It does not appear in `/preview` (the visual specification)

Verify with: `grep -r "ComponentName" app components`

**Already deleted:**
- `CardFace.tsx` → replaced by `ChapterCard`
- `CardAnimation.tsx` → replaced by `CardIllustration` in `EditorialWindow`
- `sp-*` CSS keyframes → violated no-overshoot rule

---

## The One Question

Before changing anything in the card system, ask:

> Does this deepen the relationship with the reader, or does it merely add functionality?

If the answer is "merely adds functionality" — do not add it.
