# Care Paper Language System

**Version 1.0 — Foundation**

> Every screen in Care should feel like it comes from the same notebook.

---

## 1. Material Philosophy

Care is built on paper. Not paper as metaphor or texture filter — but as a founding material decision. The product lives in the same aesthetic space as a Midori MD Notebook, a handwritten letter on washi, or a well-thumbed Traveler's Notebook. Quiet. Personal. Slightly imperfect.

This matters because Care is a product about inner experience. The material should support that — unhurried, warm, substantive. No glass morphism. No Material Design elevation. No "modern UI" that feels like an app. Something that could have been printed.

### What the paper is not

- **Not vintage**: We are not nostalgic. The paper is warm, not retro.
- **Not textured for texture's sake**: Grain and fibres exist to soften — not to show off.
- **Not uniform**: A page has zones — lighter at the top, deeper in the shadow. Paper is dimensional.
- **Not loud**: The paper background must never compete with the card's words.

### The core constraint

If you removed every piece of UI chrome — buttons, icons, nav — the page should still look like it belongs to the same object. That object is a notebook someone carries with them.

---

## 2. Visual Grammar

### 2.1 Paper tones

Care uses three paper tones that recur across every surface:

| Token | Hex | Role |
|---|---|---|
| `--paper-1` | `#F7F0E6` | Warm ivory — surface highlight zone (top of card, page bg) |
| `--paper-2` | `#EDE0CC` | Natural paper — mid-zone body |
| `--paper-3` | `#E3D1B5` | Aged paper — deep zone, card back shadow gradient |
| `--paper-back-1` | `#F7F1E8` | Card back highlight |
| `--paper-back-2` | `#EDE0CC` | Card back body |
| `--paper-back-3` | `#E4D5BC` | Card back shadow end |

Paper tones are always used in gradient form — from lighter to warmer. Never flat fills.

**Standard card face gradient:**
```css
background: linear-gradient(160deg, var(--paper-1) 0%, rgba(237,224,204,0.9) 100%);
```

**Card back gradient:**
```css
background: linear-gradient(168deg, var(--paper-back-1) 0%, var(--paper-back-2) 55%, var(--paper-back-3) 100%);
```

### 2.2 Paper grain

All card surfaces carry a dot grain — washi-inspired, not noise. The grain is subtle: visible if you look, invisible if you don't.

| Token | Value | Role |
|---|---|---|
| `--grain-color` | `rgba(139,111,78, 0.09)` | Warm dot fill |
| `--grain-size` | `5px` | Repeat interval |
| `--grain-dot` | `0.5px` | Dot radius |

**Application pattern (React JSX):**
```jsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: `radial-gradient(circle, var(--grain-color) var(--grain-dot), transparent var(--grain-dot))`,
    backgroundSize: `var(--grain-size) var(--grain-size)`,
  }}
/>
```

Do not apply grain to:
- Page backgrounds (only card surfaces)
- Buttons
- Navigation

### 2.3 Borders

Three border weights, all in warm amber, used for different structural roles:

| Token | Value | Used for |
|---|---|---|
| `--paper-border` | `rgba(201,169,122, 0.22)` | Outer card border |
| `--paper-border-inner` | `rgba(201,169,122, 0.18)` | Inner decorative frame |
| `--paper-border-soft` | `rgba(201,169,122, 0.10)` | Section dividers, Emotional Window separator |
| `--paper-border-faint` | `rgba(201,169,122, 0.06)` | Barely-there structural marks |

### 2.4 Shadows

Shadows are never black. They are warm brown — as if cast by paper onto paper.

| Token | Value | Used for |
|---|---|---|
| `--paper-shadow-lift` | `0 16px 48px rgba(80,52,20,0.12), 0 2px 8px rgba(80,52,20,0.06), inset 0 1px 0 rgba(255,255,255,0.52)` | Cards in reveal/hero state |
| `--paper-shadow-rest` | `0 4px 18px rgba(80,52,20,0.10), inset 0 1px 0 rgba(255,255,255,0.45)` | Cards in collection, secondary state |
| `--paper-shadow-page` | `0 8px 32px rgba(80,52,20,0.08), 0 1px 4px rgba(80,52,20,0.04)` | Page containers, panels |

The `inset 0 1px 0 rgba(255,255,255,0.52)` highlight on lift creates a soft letterpress impression — light striking the top edge of a raised surface.

### 2.5 Radius

| Token | Value | Used for |
|---|---|---|
| `--paper-radius-card` | `1.5rem` (24px) | Card face, card back |
| `--paper-radius-inner` | `1.25rem` (20px) | Inner frame within cards |
| `--paper-radius-soft` | `1rem` (16px) | Inputs, UI elements |
| `--paper-radius-pill` | `9999px` | Category pills, tags |

### 2.6 Imperfection principle

The paper material tolerates — welcomes — subtle imperfection:
- Pre-computed washi fibres in CardBack (not random at runtime)
- Asymmetric illustration compositions in the Emotional Window
- Slightly loose letter-tracking on headings (not tight grid-perfect)
- Borders at non-round opacities (0.18, 0.22) rather than clean 20%

These decisions are deliberate. They are not bugs. Do not "clean them up."

---

## 3. Interaction Grammar

Surfaces behave like paper objects — they have physical weight, absorb ink, and rest in place.

### 3.1 Opening

When a surface appears, it **settles** — a short drift from above, decelerating naturally.

- Use: `care-paper-settle` for page-level containers
- Use: `care-card-in` for cards
- Never: zoom in from small, pop from nothing, spring back

### 3.2 Disappearing

When a surface leaves, it **dissolves** — fades without moving.

- Use: CSS `transition: opacity var(--dur-brief) var(--ease-dissolve)`
- Never: slide out, shrink, fly off

### 3.3 Text appearing

When body text or prose reveals, it **absorbs** — a pure opacity fade, no transform.

- Use: `care-ink-in` or CSS `transition: opacity var(--dur-ink) var(--ease-ink)`
- Never: slide up, fade+slide, or appear instantly

### 3.4 Interactive feedback

Buttons and tappable elements give **micro feedback** — very brief, no movement.

- Use: `transition: opacity var(--dur-micro)` on hover/active
- The paper does not jump when touched

### 3.5 Never

- **Spring / overshoot / bounce**: values like `cubic-bezier(0.34, 1.1, 0.64, 1)` are removed from this system. Overshoot belongs to a different material language.
- **Scale transforms on cards**: card faces do not scale up/down interactively. They are physical objects.
- **Parallax**: this is a paper notebook, not a website.
- **Shimmer / skeleton loaders**: use paper-appropriate loading states (opacity pulse at low amplitude).

---

## 4. Typography Rules

### 4.1 Letter tracking

Three tracking registers, all defined as tokens:

| Token | Value | Register |
|---|---|---|
| `--track-word` | `0.01em` | Body text — natural reading |
| `--track-mark` | `0.20em` | Category labels, section headers, code stamps |
| `--track-stamp` | `0.28em` | Letterpress marks, `care` on card back, metadata |

High tracking is used sparingly and only for small-scale type (≤ 11px). It is not a default typographic personality — it is a marking convention.

### 4.2 Ink levels

Ink is never pure black. All text sits on a warm paper surface and inherits warmth.

| Token | Value | Register |
|---|---|---|
| `--ink-1` | `#1E1F1C` | Primary body — cards, main prose |
| `--ink-2` | `rgba(30,31,28, 0.72)` | Supporting text — reflections, labels |
| `--ink-3` | `rgba(30,31,28, 0.45)` | Tertiary — captions, metadata |
| `--ink-4` | `rgba(30,31,28, 0.20)` | Trace — barely-there marks |
| `--ink-brown` | `#8B6F4E` | Warm brown — category names, headings |
| `--ink-muted` | `#6D735B` | Muted sage — secondary prose |
| `--ink-copper` | `rgba(139,111,78, 0.55)` | Antique copper — decorative elements |

### 4.3 Font weight

- Card titles: `font-weight: 300` (light) — soft, not commanding
- Body text: `font-weight: 300`
- Category labels, section marks: `font-weight: 300` with tracked spacing
- `font-weight: 600` reserved for page headings — used sparingly

### 4.4 Text rendering

All surfaces enable antialiasing:
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

This is already applied in the `body` rule.

### 4.5 SVG typography

When text appears inside SVG (CardBack `care` wordmark):
- Use `letterSpacing="2.4"` as SVG attribute (scales with coordinate system)
- Do NOT use CSS `letter-spacing: 2.4px` inside SVG (stays fixed in device pixels)
- Use `filter: drop-shadow(...)` not SVG `<filter>` (avoids ID collision across instances)

---

## 5. Motion Rules

### 5.1 Easing curves

| Token | Curve | Named metaphor |
|---|---|---|
| `--ease-settle` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Ink settling onto paper |
| `--ease-ink` | `cubic-bezier(0.16, 1.00, 0.30, 1.00)` | Ink absorbing — fast initial, very slow tail |
| `--ease-dissolve` | `cubic-bezier(0.55, 0.00, 1.00, 0.45)` | Paper fading — fast initial decay |
| `--ease-drift` | `cubic-bezier(0.36, 0.07, 0.19, 0.97)` | Paper weight — deliberate physical movement |

### 5.2 Durations

| Token | Value | Use |
|---|---|---|
| `--dur-micro` | `0.15s` | Hover, tap feedback |
| `--dur-brief` | `0.28s` | Small state transitions |
| `--dur-settle` | `0.55s` | Element appearances, card in |
| `--dur-page` | `0.80s` | Page enter, surface changes |
| `--dur-ink` | `1.00s` | Text/prose appearing |
| `--dur-slow` | `1.40s` | Meditation animations, card back breathe |

### 5.3 Named animations

| Class | Keyframe | Duration | Curve | Description |
|---|---|---|---|---|
| `.care-card-in` | `care-card-in` | `--dur-settle` | `--ease-settle` | Card settling from above |
| `.care-section-in` | `care-section-in` | `--dur-settle` | `--ease-ink` | Section fading + tiny drift |
| `.care-back-breathe` | `care-back-breathe` | 2.5s | ease-in-out | Deck breathes while idle |
| `.care-ink-in` | `care-ink-in` | `--dur-ink` | `--ease-ink` | Pure opacity — ink absorbing |
| `.care-paper-settle` | `care-paper-settle` | `--dur-page` | `--ease-settle` | Gentle 6px settle |
| `.care-page-enter` | `care-page-enter` | `--dur-page` | `--ease-settle` | Page-level 10px settle |

### 5.4 Reduced motion

All animation-based reveals must check `prefers-reduced-motion`. When reduced motion is enabled:
- Skip all transforms (use opacity only or instant)
- Duration for opacity transitions: `var(--dur-brief)` maximum

```ts
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

This is already applied in `CardAnimation.tsx`. All new animated components must follow this pattern.

---

## 6. Paper Tokens Reference

Complete list of all CSS custom properties in the Paper Language System, defined in `:root`.

```css
/* Paper tones */
--paper-1:          #F7F0E6
--paper-2:          #EDE0CC
--paper-3:          #E3D1B5
--paper-back-1:     #F7F1E8
--paper-back-2:     #EDE0CC
--paper-back-3:     #E4D5BC

/* Grain */
--grain-color:      rgba(139,111,78, 0.09)
--grain-size:       5px
--grain-dot:        0.5px

/* Borders */
--paper-border:         rgba(201,169,122, 0.22)
--paper-border-inner:   rgba(201,169,122, 0.18)
--paper-border-soft:    rgba(201,169,122, 0.10)
--paper-border-faint:   rgba(201,169,122, 0.06)

/* Radius */
--paper-radius-card:    1.5rem
--paper-radius-inner:   1.25rem
--paper-radius-soft:    1rem
--paper-radius-pill:    9999px

/* Shadows */
--paper-shadow-lift:    0 16px 48px rgba(80,52,20,0.12), 0 2px 8px rgba(80,52,20,0.06), inset 0 1px 0 rgba(255,255,255,0.52)
--paper-shadow-rest:    0 4px 18px rgba(80,52,20,0.10), inset 0 1px 0 rgba(255,255,255,0.45)
--paper-shadow-page:    0 8px 32px rgba(80,52,20,0.08), 0 1px 4px rgba(80,52,20,0.04)

/* Ink */
--ink-1:            #1E1F1C
--ink-2:            rgba(30,31,28, 0.72)
--ink-3:            rgba(30,31,28, 0.45)
--ink-4:            rgba(30,31,28, 0.20)
--ink-brown:        #8B6F4E
--ink-muted:        #6D735B
--ink-copper:       rgba(139,111,78, 0.55)

/* Easing */
--ease-settle:      cubic-bezier(0.25, 0.46, 0.45, 0.94)
--ease-ink:         cubic-bezier(0.16, 1.00, 0.30, 1.00)
--ease-dissolve:    cubic-bezier(0.55, 0.00, 1.00, 0.45)
--ease-drift:       cubic-bezier(0.36, 0.07, 0.19, 0.97)

/* Duration */
--dur-micro:        0.15s
--dur-brief:        0.28s
--dur-settle:       0.55s
--dur-page:         0.80s
--dur-ink:          1.00s
--dur-slow:         1.40s

/* Tracking */
--track-word:       0.01em
--track-mark:       0.20em
--track-stamp:      0.28em
```

---

## 7. Examples

### 7.1 Card face — material composition

```jsx
<div
  className="relative overflow-hidden"
  style={{
    borderRadius: 'var(--paper-radius-card)',
    background: `linear-gradient(160deg, var(--paper-1) 0%, rgba(237,224,204,0.9) 100%)`,
    boxShadow: 'var(--paper-shadow-lift)',
    border: '1px solid var(--paper-border)',
  }}
>
  {/* Grain layer */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, var(--grain-color) var(--grain-dot), transparent var(--grain-dot))`,
      backgroundSize: `var(--grain-size) var(--grain-size)`,
    }}
  />
  {/* Content */}
</div>
```

### 7.2 Section appearing — ink absorption

```jsx
// Prose text appearing with pure opacity — no transform
<p
  style={{
    opacity: revealed ? 1 : 0,
    transition: `opacity var(--dur-ink) var(--ease-ink)`,
  }}
>
  {text}
</p>
```

### 7.3 Category label — stamp register

```jsx
<p
  className="text-xs font-light"
  style={{
    letterSpacing: 'var(--track-mark)',
    color: 'var(--ink-brown)',
    textTransform: 'uppercase',
  }}
>
  {category}
</p>
```

### 7.4 Section divider — paper border

```jsx
<div
  style={{
    borderTop: '1px solid var(--paper-border-soft)',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
  }}
/>
```

### 7.5 Page entering — paper settle

```jsx
// Page-level container
<div className="care-page-enter">
  {children}
</div>
```

---

## 8. Future Expansion

### 8.1 Component migration plan

The following components currently use hardcoded values that should migrate to paper tokens. This is non-breaking — components render correctly now. Migration is aesthetic cleanup.

| Component | Hardcoded values to migrate |
|---|---|
| `components/care/CardFace.tsx` | paper gradient, grain, shadow, inner border, Emotional Window separator |
| `components/care/CardBack.tsx` | background gradient, box-shadow, outer border |
| `components/care/CardReveal.tsx` | same as CardFace |
| `components/care/SecondPage.tsx` | previous encounter border, section dividers |
| `components/ui/PrimaryButton.tsx` | hover transitions → `--ease-settle`, `--dur-micro` |
| `app/(app)/checkin/page.tsx` | mood button borders, background tokens |
| `app/(app)/journal/page.tsx` | page shadow, section dividers |

Migration approach: one component at a time. Confirm lint/build after each. Do not migrate in bulk.

### 8.2 Grain variations

The current grain is a dot pattern. CardBack uses pre-computed horizontal fibres (washi texture). Future surfaces may benefit from:
- **Fibre grain** (CardBack style) — for large field surfaces like a journal full-bleed
- **Cross-hatch** — for the check-in background if it ever gets a texture layer

These would be new utility classes, not replacements.

### 8.3 Dark / night mode

Care does not have a dark mode yet. When it does, the paper system should translate to:
- `--paper-1` → `#1E1B17` (ink-stained paper, very dark)
- `--paper-2` → `#252019`
- `--paper-3` → `#2C261E`
- `--ink-1` → `#F0E8DB` (faded ivory on dark ground)

The paper metaphor holds in reverse — pressed ink (dark) on a field of night paper. Do not go to flat black; retain warmth.

### 8.4 Print stylesheet

Because Care's aesthetic is close to print, a `@media print` version is a natural fit. Cards would render beautifully as physical objects. Not a current priority, but the token system makes it tractable:
- Paper tones map to CMYK values
- Shadows drop to border-only
- Animations obviously do not apply

### 8.5 Animation library expansion

Current animations serve the card and second page. Future phases may need:
- `care-drawer-in` — bottom sheet / drawer entering from bottom
- `care-toast-land` — notification landing (pure ink-in, no bounce)
- `care-loader-breathe` — loading state at very low amplitude (not skeleton)

All future animations must be authored with `var(--ease-*)` and `var(--dur-*)` tokens. No hardcoded easing or duration values in component files.
