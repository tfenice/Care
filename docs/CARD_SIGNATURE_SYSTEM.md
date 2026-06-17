# Care Card Signature System

A system for making individual cards recognizable, memorable, and distinct.

No illustrations. No implementation. Design language only.

---

## 1. The Problem

Cards are currently remembered by their text.

"I got one about letting go."
"There was one about breathing."

This is content memory, not card memory. It is the same as remembering a book
by its summary rather than its cover. The user did not yet form a relationship
with *the card itself* — only with what it said.

**The goal is object memory:**

"I remember that card — the one with the arc. The light one."
"A-06. I've gotten that one twice."

This shift — from content memory to card memory — is what makes a card feel like
something you received, not just something you read.

---

## 2. Signature Philosophy

A card signature is the thing that makes it recognizable before you read it.

It is not the title. It is not the body text. It is not the category color.

A signature is the combination of:

1. **A fixed mark** — the symbol or motif unique to this card
2. **A variation within a grammar** — the way this card's mark differs from its siblings

The signature system works across two levels simultaneously:

- **Category level**: Acceptance cards always feel like Acceptance. The visual grammar is shared.
- **Card level**: A-01 is distinct from A-02 within that grammar. The mark is individual.

### The analogy

A tarot deck has 78 cards. You can identify The Moon at a glance — not because you
read the text at the bottom, but because you recognize the image.

Care is not tarot. But the mechanism is identical: visual distinctness at card level
creates the sense that each draw was *a particular thing*, not a random draw.

### What a signature is not

- A card number rendered large (that is a label, not a signature)
- A color (category already owns color — the signature is within that color)
- An abstract texture that varies randomly
- A complex illustration (that is the Illustration Language's territory)

---

## 3. The Signature Grammar

Each card has three signature components:

### 3A. Category Mark
The base form shared by all cards in the category.
Already defined in `card-symbols.tsx`:
- Acceptance: circle + ground line
- Presence: dot + ring
- Hope: arc + horizon
- Growth: branching stem

The category mark is the *family resemblance* — the thing that says "you are in Acceptance territory."

### 3B. Card Variation
Within the category mark, each card has one small, fixed variation.

**Variations are drawn from four techniques:**

1. **Scale shift** — the base form is larger or smaller within the same frame
2. **Weight shift** — the stroke is heavier, lighter, or partial
3. **Position shift** — the base form sits differently: offset, near-edge, or low/high
4. **Element addition** — one small additional mark (a second line, a faint echo, a dot) that completes the card's meaning without adding complexity

Each variation expresses the card's specific theme within the category's grammar.
A card about "things beyond our control" (A-07) has a different variation
than a card about "I am only human" (A-04) — even though both are Acceptance cards.

### 3C. Card Code
The alphanumeric identifier: A-01, P-03, H-07, G-10.
Small, bottom-positioned, typeset. Not a signature element itself — but the anchor
that allows a user to *name* what they recognized.

"I remember A-06" is the completion of the recognition.
The code gives language to the visual memory.

---

## 4. Category Signature Systems

### Acceptance (การยอมรับ) — A

**Category mark:** Open circle + horizontal ground line
The circle rests on the line. The grammar is: *settling*, *weight finding its place*.

**Signature grammar for A-cards:**

Variations move along two dimensions:
- **Circle size**: smaller circle = the thing being held is small / larger circle = the weight is heavy
- **Circle position relative to line**: circle resting on the line = acceptance / circle below the line = submersion, difficulty / circle above with gap = not yet landed

**Visual language:**
Horizontal energy. Low center of gravity. No upward reach.
An A-card never has a mark that points upward or opens toward the sky.

---

### Presence (ความใจจดจ่อ) — P

**Category mark:** Central dot + surrounding ring
The dot is the attention. The ring is the boundary of the now.

**Signature grammar for P-cards:**

Variations move along two dimensions:
- **Ring count**: one ring = simple, clear moment / two rings = expanding attention / no outer ring, dot only = total focus collapsed to a point
- **Dot offset**: centered dot = present, stable / slightly off-center dot = the mind returning, not quite there yet

**Visual language:**
Radial energy. Everything refers to the center.
A P-card never has marks that pull toward an edge or that open into space.
The grammar is *inward*.

---

### Hope (ความหวัง) — H

**Category mark:** Rising arc + horizon line
The arc emerges above the line. The grammar is: *something appearing*, *the first light*.

**Signature grammar for H-cards:**

Variations move along two dimensions:
- **Arc rise**: low arc barely above the horizon = tentative possibility / high arc = more certain hope / arc on the horizon line = the exact moment of emergence
- **Arc completeness**: full semicircle = a whole possibility / partial arc = still becoming / arc broken in the middle = hope interrupted, then resumed

**Visual language:**
Upward energy. Open space above the mark.
An H-card's top half is always less dense than its bottom half — there is room above.

---

### Growth (การเติบโต) — G

**Category mark:** Branching stem with two forks
The vertical line forks. The grammar is: *complexity from a single origin*, *becoming more than one thing*.

**Signature grammar for G-cards:**

Variations move along two dimensions:
- **Branch asymmetry**: heavily asymmetric = unexpected growth / near-symmetric = intentional development / only one branch = the beginning of divergence
- **Branch length**: short branches = recent growth / long branches that approach the frame edge = growth that has been happening for a while

**Visual language:**
Vertical energy with lateral reach.
A G-card's mark always has a vertical axis. It does not rest; it extends.

---

## 5. Individual Card Signatures

All 40 cards, with their specific variation within the category grammar.
Each description defines one unique mark — not an illustration, but a signature.

---

### Acceptance (A) — circle + ground line grammar

| Card | Title (short) | Circle size | Position | Additional element | Signature character |
|------|--------------|-------------|----------|-------------------|---------------------|
| A-01 | สิ่งที่วางไม่ลง | Medium | Resting on line, centered | None | The standard settling — the card that grounds the whole category |
| A-02 | ความรู้สึกมีที่ทาง | Large | Resting on line, filling the frame | None | A fuller weight — the circle nearly touches the frame sides, contained but not small |
| A-03 | ไม่ต้องรู้คำตอบ | Small | Hovering above line — small gap | None | The circle hasn't landed yet. Still in the air. The gap is the unanswered question |
| A-04 | ฉันแค่มนุษย์ | Medium | Resting on line, slightly left of center | None | Ordinary positioning — the slight offset is the imperfection of being human |
| A-05 | วันนี้พอแล้ว | Small | Resting on line, centered | A second, shorter ground line below the first — a double floor | Two ground lines: the first day, and the fact that the day was enough |
| A-06 | เจ็บปวดไม่ใช่ล้มเหลว | Medium | Resting on line, but line is slightly curved (bent, not straight) | None | The ground itself bends — but holds. The circle rests on a curved line that doesn't break |
| A-07 | นอกเหนืออำนาจ | Large | Resting on line, touching edges of frame | Ground line extends to frame edges and fades at both ends | The circle is as wide as the frame. The horizon extends beyond. The boundary is the world. |
| A-08 | ความไม่แน่นอน | Medium | Resting on line, but circle is drawn with a thin, broken stroke — incomplete | None | The circle is not fully closed. A short gap at the top. The form is almost complete, not quite. |
| A-09 | รักตัวเองวันที่ยาก | Small | Resting on line, centered | A second concentric circle — a thin outer ring, like a holding vessel | Two forms: the small circle and the ring that holds it. Protected. |
| A-10 | ไม่ต้องรู้สึกดี | Medium | Below the ground line — sunk slightly into it | None | The circle dips below the line. Not fallen — just not above. The line crosses through the upper arc. |

---

### Presence (P) — central dot + ring grammar

| Card | Title (short) | Ring form | Dot | Additional element | Signature character |
|------|--------------|-----------|-----|--------------------|---------------------|
| P-01 | ลมหายใจตอนนี้ | One ring, complete circle | Centered | None | The simplest form. Full ring, centered dot. This is presence itself. |
| P-02 | ร่างกายรู้ก่อน | One ring, slightly oval rather than perfect circle | Centered | None | The ring is organic, not mechanical — the body's awareness is imperfect but real |
| P-03 | ช่วงเวลาไม่กลับมา | One ring, complete | Centered | A short tangent line exiting the ring at an angle — the moment leaving | The ring is complete. One line exits it. The moment passes, irrecoverably. |
| P-04 | ฟังเสียง | Two concentric rings (the inner tight, the outer loose) | Centered | None | Sound as expanding rings. The dot at center is the source. |
| P-05 | ความคิดไม่จริงเสมอ | One ring, large, near the frame edge | Dot is off-center, toward the near-edge | None | The ring is drifting — not centered in the frame. The dot is not at the ring's center either. Both slightly displaced. |
| P-06 | สัมผัสสิ่งที่อยู่ตรงหน้า | No ring — dot only, but very large | One large dot, fills most of the frame | None | Pure focus. The ring has dissolved. Only the point remains, expanded to fill attention. |
| P-07 | ช้าลงได้ทุกเมื่อ | One ring, complete | Centered | None, but vast empty space around the entire mark — mark is very small in frame | The mark is small. The space is the signature. Slowing down is making room. |
| P-08 | ปัจจุบันคือบ้าน | One ring, complete | Centered | A very faint second ring, larger, suggested (nearly invisible) — the outer world | Inner ring clear. Outer ring barely there. Home is here, not there. |
| P-09 | แสงในห้องนี้ | One ring, arc only — the right half of the circle, the left half absent | Dot off-center, toward the present arc | None | Half a ring. The light only illuminates one side. The rest is shadow, and that is enough. |
| P-10 | ไม่ต้องทำอะไร | One ring, very faint, stroke weight nearly zero | No dot — empty center | None | The presence is the absence. Dot missing. Ring barely there. The card about not doing shows almost nothing. |

---

### Hope (H) — arc + horizon grammar

| Card | Title (short) | Arc rise | Arc completeness | Horizon | Signature character |
|------|--------------|----------|-----------------|---------|---------------------|
| H-01 | แสงเล็กๆ ก็ส่องได้ | Very low — barely above the horizon | Complete semicircle | Present, clear | A small arc, complete. The first light above the line. Low but whole. |
| H-02 | วันพรุ่งนี้เปิดอยู่ | Medium rise | Arc is open at the top — not a closed semicircle, the two ends extend beyond the horizon rather than meeting | Present | An arc that opens outward. Its two ends extend into the future. Not a dome — an opening. |
| H-03 | พูดกับตัวเองอ่อนโยน | Low | Complete semicircle | Horizon slightly curved, gentle | Soft horizon — not a rigid line but a gentle curve. The arc rests in something yielding. |
| H-04 | เมล็ดที่ยังไม่งอก | No arc visible above horizon | Horizon only — arc implied below it as a downward curve, a seed form | Present, strong | The arc is inverted — below the horizon, becoming a root. Hope not yet expressed. The first card in the deck without anything above the line. |
| H-05 | มีคนที่อยากเห็นคุณดี | Medium rise | Complete semicircle | No visible horizon — the arc floats | Arc without ground. Something above, nothing to explain it. A light with no surface to cast from. |
| H-06 | ความกล้าหาญที่ไม่เห็น | High rise | Complete semicircle | Present, but faint | Arc rises high. Horizon faint, almost gone. The courage is in going beyond what the ground can confirm. |
| H-07 | รอคุณอยู่ข้างหน้า | Medium rise | Arc is partial — left side only, the right side continues off-frame | Present | Half-arc. The curve enters from the left and exits the frame on the right. Destination unseen. |
| H-08 | เปลี่ยนแปลงเสมอไป | Very low — just cresting the horizon | Complete, but thin stroked | Present, clear | The thinnest possible arc, just above the line. Change is here, barely begun. |
| H-09 | ก้าวถัดไปพอแล้ว | Low | Small arc, centered | Present | One small arc in the middle of the frame. Nothing around it. One step. |
| H-10 | ผ่านมาได้ทุกครั้ง | High rise | Complete semicircle, heavier stroke weight | Present, strong | The heaviest arc in the H-deck. Has risen before. Has done this. |

---

### Growth (G) — branching stem grammar

| Card | Title (short) | Asymmetry | Branch length | Root element | Signature character |
|------|--------------|-----------|---------------|-------------|---------------------|
| G-01 | เดินมาไกล | Strongly asymmetric — one long branch, one short | Long branches reaching the frame edge | None | The longest branches of any G-card. Distance is already traveled. |
| G-02 | ผิดพลาดสอนได้ | Near-symmetric | Medium | Stem shows one interruption — a small notch or break in the vertical, then continues | The stem has a mark on it. A moment of difficulty that didn't stop the growth. |
| G-03 | เติบโตที่มองไม่เห็น | Symmetric | Short above, long below — the root visible as downward branches | Downward branching visible | The stem extends both upward and downward. The underground growth is as large as the visible growth. |
| G-04 | ลองอีกครั้ง | Near-symmetric | Short | Stem appears to fork from a point that is not the base — a new fork above the first | A second fork above the original. The second attempt. The growth that came from trying again. |
| G-05 | แข็งแกร่งที่ยังไม่รู้ | Strongly asymmetric | One long branch, one absent — only the stem and one branch | None | One branch only. The second has not appeared yet. The strength is in what has already grown, not what's missing. |
| G-06 | ขอบคุณตัวเอง | Symmetric | Short, even, tidy | None | The tidiest G-card. Both branches equal in length and angle. A moment of balance within the self. |
| G-07 | บทเรียนที่เจ็บปวดทิ้งไว้ | Asymmetric | Long on one side | Stem is thicker than standard — heavier stroke weight | The stem is the signature element: thicker, more established. It has grown through something. |
| G-08 | ฉันในวันนี้ | Near-symmetric | Medium | None — but the stem base is split: two roots diverging at the bottom | The stem begins from two points that merge upward. The past has more than one origin. |
| G-09 | ก้าวเล็กๆ สำคัญ | Symmetric | Very short — new growth just beginning | None — but there are three forks, not two, each with tiny extensions | Three forks, each small. More branching than any other G-card. Many small steps. |
| G-10 | กำลังเรียนรู้ | Asymmetric | One branch at the top only — the stem is not finished | Stem line ends without connecting — bottom is open | The stem doesn't reach the ground. Still becoming. The line ends in space. |

---

## 6. The Recognition Test

A user can recognize a card without reading the title when:

1. They see the **category mark** and know the emotional territory (Acceptance, Presence, Hope, Growth)
2. They see the **specific variation** and remember the card's particular gesture
3. They see the **card code** and can name what they recognized

**The test protocol:**

Show a user the mark without the text.
Ask: "Does this feel familiar?"
If yes: "Can you say what it's about — even in one word?"

That is recognition. Not recall of content — recognition of *the card itself*.

**How to build this over time:**

Recognition builds through repetition and distinctness.
A card drawn twice is more recognizable than a card drawn once.
But a card with a strong, distinct signature can be remembered after a single draw.

The strongest signatures are:
- The ones that break a pattern in the grammar (P-10 has no dot; G-10 has no ground)
- The ones that are counterintuitive (H-04 has the arc below the horizon)
- The ones that feel *right* when you understand the card's meaning

---

## 7. Relationship to the Illustration Language

This signature system and the Illustration Language (`CARD_ILLUSTRATION_LANGUAGE.md`)
operate at different scales.

| | Signature System | Illustration Language |
|--|-----------------|----------------------|
| **What it is** | A mark. A variation within a grammar. | An image. A symbolic object. |
| **Where it lives** | On the card itself — small, persistent | A dedicated visual field on the card |
| **When it works** | Immediately, before reading | After pausing with the image |
| **How it's recognized** | Pattern within a system | Object and composition |

They are designed to work together:
The signature tells you *which card*.
The illustration tells you *what the card holds*.

A user who has seen A-06 before will recognize the bent ground line immediately.
Then they see the bent reed above it.
Then they read about pain that isn't failure.

The signature arrives first. It is the doorway.

---

## 8. Risks

### Legibility risk
Very fine mark variations (a gap in a circle, a missing branch tip) may not be legible
at the sizes where the card code appears. The signature marks described here
assume adequate rendering size — at minimum 48px for the card signature zone.
At smaller sizes (deck thumbnails), the category mark only should be shown —
not the individual variation.

### Over-complexity risk
If the grammar is extended by future card additions, new variations must stay within
the existing dimensions (scale, weight, position, element addition).
Adding a fifth dimension of variation creates ambiguity.
The four dimensions are sufficient for 40 cards and would support up to ~80.

### Memorability risk
Recognition builds through repetition. Users who draw the same card twice
will recognize it faster than users who draw 10 different cards.
For private beta (3 users), low repetition means lower recognition rates.
This is expected — the system is designed for a deck that grows familiar over months.

### Implementation risk
The variations described here (broken stroke, faint echo ring, stem notch) require
precise SVG implementation to distinguish clearly from simpler marks.
Implementation should treat each of the 40 signatures as a unique SVG file
or component, not a parameterized output of the base symbol.

---

## 9. Recommended Next Evolution

After the signature system is implemented:

1. **Card log view** — a grid of drawn cards, showing signatures only (no text). Users see their history as a collection of marks, not a list of titles.

2. **Draw notification** — "You've received A-06 again." The card has a name now. The repetition is meaningful.

3. **Completion tracking** — "You've seen 7 of 10 Acceptance cards." The deck becomes something to complete, not just to draw from.

4. **Physical output** — the signature system was designed to be printable. A postcard with the mark and code at the bottom is the natural physical artifact.

---

*This document defines the signature language only.*
*It has no implementation dependencies and does not require database changes.*
*The system is ready to be built when the team chooses to implement it.*
