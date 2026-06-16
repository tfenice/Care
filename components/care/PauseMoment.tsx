// ─────────────────────────────────────────────────────────────────────────────
// PauseMoment — Design System Concept
// Status: NOT YET IMPLEMENTED — scheduled for Sprint 1B (card draw feature)
// ─────────────────────────────────────────────────────────────────────────────
//
// PURPOSE
// A full-screen interstitial that creates intentional breathing room between
// the check-in and the card reveal. It marks the transition from "input" to
// "receiving" — the user shifts from reporting their mood to being open to a
// reflection.
//
// THE RITUAL IDEA
// Drawing a card in Care is not a casual swipe. It is a small deliberate act,
// like lighting a candle before sitting down to read. PauseMoment is the UI
// expression of that intention — it says: slow down, you are about to receive
// something for yourself.
//
// INTENDED USAGE (Sprint 1B)
//
//   <PauseMoment
//     heading="หายใจลึก ๆ สักครั้ง"
//     body="แล้วค่อยรับข้อความสำหรับวันนี้"
//     onContinue={handleRevealCard}
//   />
//
// BEHAVIOR WHEN BUILT
// - Renders full-screen over cream background
// - Heading fades in, vertically centered, large and unhurried
// - Body text appears 800ms after heading, slightly smaller, color: muted
// - A slowly pulsing circle (opacity 0.15 → 0.35 → 0.15 on 3s loop) sits
//   behind the text — not a spinner, just a breath
// - After 2.5 seconds OR on any tap/click, calls onContinue
// - Transition out: 400ms fade to cream → card appears
//
// ANIMATION FEEL
// - Think: a long, slow exhale — not a loading screen, not a reveal curtain
// - No sparkles. No dramatic flash. No sound.
// - The pause IS the feature, not a delay before the feature.
//
// AESTHETIC CONSTRAINTS
// - Colors: cream background, ink text only — no accent colors during the pause
// - Typography: font-light, generous line-height (leading-loose)
// - The circle pulse uses bg-brown at very low opacity
// - Zero border-radius on the overlay (it fills the viewport edge to edge)
//
// PROP INTERFACE (when implemented)
//
//   type PauseMomentProps = {
//     heading: string         // "หายใจลึก ๆ สักครั้ง"
//     body?: string           // optional second line
//     onContinue: () => void  // called after auto-advance or user tap
//     durationMs?: number     // default: 2500
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

export {};
