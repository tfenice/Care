# Care Voice Guide

Care is a companion, not a coach. It witnesses without judging, reflects without labeling, and accompanies without directing. Every word in the product should feel like it came from the same quiet, unhurried presence.

---

## Who Care Is

Care is a companion that sits with you. It does not fix you, teach you, or tell you what to do. It notices what you bring and reflects it back gently.

| Care is | Care is not |
|---|---|
| A witness | A therapist |
| A companion | A coach |
| Gentle and unhurried | Motivational or aspirational |
| Curious and observant | Analytical or clinical |
| Present | Prescriptive |

---

## The Three Core Principles

**1. Notice, don't judge.**
Care describes what it sees. It does not evaluate it as good or bad, successful or failed.

> ✓ "สัปดาห์นี้คุณกลับมาฟังใจตัวเองทุกวันเลยนะ"
> ✗ "คุณทำได้ดีมาก! เยี่ยมมาก!"

**2. Accompany, don't instruct.**
Care never tells the user what to do next. It opens space; the user decides what to do with it.

> ✓ "เขียนสิ่งที่นึกขึ้นมาก็ได้"
> ✗ "ลองเขียนสิ่งที่นึกขึ้นมาหลังอ่าน"

**3. Reflect, don't diagnose.**
Care can name patterns it has noticed, but never assigns meaning to them.

> ✓ "ช่วงนี้คุณมักรู้สึก 'เหนื่อย' เกี่ยวกับเรื่อง 'การงาน'"
> ✗ "คุณกำลังประสบกับความเครียดจากการทำงาน"

---

## Words to Avoid

| Word / Phrase | Why | Instead |
|---|---|---|
| กรุณา | Too formal, robotic — sounds like a government form | Just state the action, or drop it |
| ลอง (as instruction) | Prescriptive: "try doing X" — Care doesn't assign tasks | Drop "ลอง"; state the option softly |
| เกิดข้อผิดพลาด | Cold, system-speak | มีบางอย่างผิดพลาด |
| กรุณาลองใหม่อีกครั้ง | Double-formal and robotic | ลองอีกครั้งได้นะ |
| ฟีเจอร์ (in user-facing copy) | Engineering jargon | เร็วๆ นี้ / ยังไม่พร้อมใช้งาน |
| เวอร์ชันถัดไป | Sounds like a product roadmap, not a companion | เร็วๆ นี้ |
| กำลังพัฒนา | Engineering-speak | เร็วๆ นี้ |
| tracking, analytics (in Thai sentences) | English tech words break Care's warmth | การติดตามข้อมูล |
| คุณทำได้ดีมาก | Overly congratulatory, coach-voice | Notice the fact without praising it |
| ต้องการ (as imperative) | Can feel demanding | อยากจะ / สามารถ |
| Care บอกว่า | "Care says" sounds like a robot reporting | Care สังเกตเห็น |

---

## Phrases That Define Care

These are expressions that have been validated as distinctly Care-voice. Use them; protect them.

| Phrase | Where it works |
|---|---|
| ขอบคุณที่กลับมาฟังใจตัวเองวันนี้ | After any act of reflection (journal save, checkin) |
| ไม่ต้องสมบูรณ์แบบ | Invitation to write, to check in — anywhere perfectionism might block |
| แค่ที่คุณยังกลับมาก็สำคัญแล้ว | Low-streak or absence state — acknowledges return without punishing absence |
| Care สังเกตเห็น | Header for anything Care has noticed/extracted about the user |
| ฟังใจตัวเอง | Core concept — listening to oneself. Use freely. |
| ไม่ต้องรีบหาคำตอบ | On confusion, uncertainty — the feeling of สับสน |
| อยู่ตรงนี้ด้วยกัน | Implicit — Care is present with you, not ahead of you |
| ไม่จำเป็นต้องรู้คำตอบ | Pair with "วันนี้คุณไม่จำเป็นต้องรีบ" on the pause/breathe screen |

---

## UI Writing Guidelines

### Headings
- Short (≤ 5 words in Thai) and personal — speak directly to the user
- Avoid category labels that could be database fields: "ประวัติ" (history) is fine; "บันทึกข้อมูล" (data record) is not
- Prefer questions or open statements over commands: "คุณอยากบอกอะไรกับตัวเองบ้าง" over "เขียนบันทึกของคุณ"

### Button Labels
- Primary CTA: state what happens next, not what the user must do
  - ✓ "เปิดการ์ดวันนี้" (open today's card)
  - ✗ "กดเพื่อรับการ์ด" (press to receive a card)
- Save/submit: `บันทึก` is acceptable and honest; do not over-explain
- Loading/pending: keep it brief; `กำลังมา...` is warmer than `กำลังเตรียม...` or `กำลังโหลด...`

### Error States
- Acknowledge gently; do not alarm
- ✓ `มีบางอย่างผิดพลาด ลองอีกครั้งได้นะ`
- ✗ `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง`

### Success States
- Witness the act, don't celebrate it
- ✓ `ขอบคุณที่กลับมาฟังใจตัวเองวันนี้`
- ✗ `บันทึกสำเร็จแล้ว! ยอดเยี่ยม`

### Empty States
- Empty does not mean failure — it means the beginning
- Never instruct the user to fill the empty state
- ✓ "เมื่อคุณกลับมาบ่อยขึ้น Care จะเริ่มสังเกตเห็น"
- ✗ "เขียนบันทึกและเช็คอินต่อไปเรื่อยๆ เพื่อดูข้อมูล"
- Offer one gentle link to get started; don't list steps

### Placeholders (form fields)
- Invite, don't prompt with a task
- ✓ "มีอะไรอยากเล่าไหม" — invites, opens space
- ✓ "เขียนได้เลย ไม่ต้องสมบูรณ์แบบ" — removes the barrier to starting
- ✗ "เขียนอธิบายความรู้สึกของคุณ" — assigns a task

### Section Headers (small uppercase)
- Keep to 1–3 words
- "Care สังเกตเห็น" is the canonical header for anything Care has derived
- "Care บอกว่า" violates this — rewrite to "Care สังเกตเห็น"

### Placeholder Features (not yet built)
- ✓ "เร็วๆ นี้" — implies Care is on a journey with the user
- ✗ "ฟีเจอร์นี้กำลังพัฒนา" — breaks the companion illusion
- ✗ "เวอร์ชันถัดไป" — sounds like a product announcement

---

## Tone by Screen Context

| Screen | Mood | Notes |
|---|---|---|
| `/login` | Warm, welcoming | First impression. Avoid urgency. |
| `/checkin` | Open, non-pressuring | The user is reporting how they feel. Don't make it a test. |
| `/cards` (pause) | Still, spacious | The pause screen should feel like exhaling. |
| `/cards` (card) | Gentle, reflective | The card is an offering, not a lesson. |
| `/journal` | Quiet, personal | This is the most private space. Nothing instructional. |
| `/history` | Factual, respectful | These are real days the user showed up. Honor them plainly. |
| `/growth` | Observational | Show the pattern; don't judge the pace. |
| `/memory` | Curious, soft | Care noticed something; the user can take it or leave it. |
| `/profile` | Grounded, clear | Account details. Keep language neutral and precise. |
| `/settings` | Transparent, calm | Privacy and control. Speak plainly. |

---

## Thai Language Notes

- **Mixed-language labels**: "Streak" as a standalone UI label (section header) is acceptable — it's brief and understood by the target audience. Do not embed English words in Thai sentences: "ไม่มีการ tracking" → "ไม่มีการติดตามข้อมูล"
- **นะ / นะคะ**: Adding `นะ` softens a statement without making it formal. Use it on gentle guidance, not on error messages where it can feel passive-aggressive.
- **เรา (we/us)**: Care speaks as a presence, not a person. Using "เรา" (we) when referring to Care/the product is appropriate: "เราส่งลิงก์ไปแล้ว". Do not use "ฉัน" (I).
- **คุณ (you)**: Always use คุณ for the user. Never ท่าน (too formal) or เธอ (informal/gendered).
- **ไม่จำเป็นต้อง vs ไม่ต้อง**: Both are acceptable. ไม่จำเป็นต้อง is slightly more gentle.
