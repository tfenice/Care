# Memory Timeline — Product Thinking

Care's memory function is not yet built beyond the current `/memory` page.
This document explores what memory should mean in Care before any implementation begins.

---

## The Core Question

What does a person actually want when they look back?

Not data. Not a summary. Not proof of progress.

They want to recognize themselves — to find the thread that connects who they were in a hard month to who they are now. Memory in Care exists to make that thread visible, quietly, without interpretation, without judgment about where the thread should have led.

---

## 1. History, Collection, and Memory — The Distinction

These three are related but serve fundamentally different purposes. Conflating them is the source of most memory-feature mistakes.

### History

History is the complete factual record. It answers: *what happened, on which day?*

A check-in occurred on Thursday. A journal was written on Saturday. A card was drawn on Monday. History is chronological, raw, and uninterpreted. Its value is accuracy and completeness. It is for the user who wants to orient themselves in time — "when was that period?"

**Care's current `/history` route** is a 30-day check-in grid. This is history: factual, time-ordered, not curated.

### Collection

Collection is the catalog of cards encountered. It answers: *which cards have come to me?*

Collection is organized by card identity, not time. A card appears once in the collection regardless of how many times it has been drawn — it exists as an artifact with its own identity. The collection is a museum, not a timeline. The user browses by category and card code, not by date.

**Care's current `/collection` route** is collection: an archive of 40 cards with seen/unseen state.

### Memory

Memory is the meaning layer. It answers: *who was I during that time, and who am I becoming?*

Memory is selective. The mind does not remember everything with equal weight. A memory worth surfacing is not just an old entry — it is a moment that carries resonance across time. Memory is curated, not chronological. It privileges significance over recency, and continuity over completeness.

**Care's current `/memory` route** is a beginning: theme extraction, mood patterns, synthesis. But it is not yet Memory as described here. It is more like an analysis of recent history. True memory in Care should feel like finding an old letter in a drawer, not receiving a report.

---

## 2. How Care Should Present Old Moments

**The dominant failure mode:** presenting old entries as data with the date as the headline.

> "On March 14, you wrote: ..."

This is wrong. When you find an old letter in a drawer, you recognize the feeling before you register the date. The emotional weather of a moment is primary. The date is context, not a headline.

**The right order:**

1. The emotional weather first — what was happening in that period (card category, mood pattern)
2. The content — what was actually written or drawn
3. The date as quiet supporting context, small and secondary

**The right framing:**

Old moments should feel discovered, not delivered. The difference:

> ✗ "Here is a journal entry from 3 months ago."

> ✓ A journal appears, quiet and still, dated in small muted text. The entry is there. Care is not announcing it; it is simply present.

Old moments should be presented as witnesses, not as evidence. They do not prove anything. They do not indicate what the user should think or feel about their past self. They are simply: *this was here*.

---

## 3. What Makes a Memory Worth Resurfacing

Not every entry belongs in memory. The decision to surface something should be earned. These are the conditions that make a moment worth bringing back.

### Temporal distance

At minimum 60–90 days should have passed. Recent entries lack the distance required for perspective — they are too close to current experience to feel like "then." Memory requires a gap. The gap is what makes recognition possible.

### Thematic resonance with now

If the user draws a "hope" card today and drew one 8 months ago, there may be something worth seeing in that continuity. Not as progress — not "you've grown in your relationship with hope" — but as recognition: *this category has visited you before, at a different moment*.

### Contrast

A moment from a clearly different chapter. The difficulty of a period that has visibly ended. Not surfaced to say "look how far you've come," but simply to say: *you were there, and now you are here*. The user decides what that means.

### Repetition with variation

The same card drawn three or four times across a year — each encounter in different circumstances. Seeing the encounters together reveals something about the card's relationship with the user that no single encounter could. The meaning of A-05 in March is not the same as A-05 in October.

### First encounters

A card's first arrival is an event. It came to the user at a specific moment, when a specific thing was happening in their life. The first encounter is worth marking differently from subsequent ones.

### What does NOT make something worth resurfacing

- **Completeness.** Not everything deserves a second visit just because the algorithm hasn't touched it.
- **Recency.** Last week is not yet memory.
- **Frequency.** The most-drawn card is not necessarily the most meaningful.
- **Positivity bias.** Surfacing only "good" moments falsifies the archive. A hard chapter's honesty is part of the record. Not every memory should feel like a gift.
- **System convenience.** Memory should never be surfaced because the system needs to fill a screen.

---

## 4. How Cards and Journals Connect

Cards and journals are currently separate records. But they are experientially related: a card arrives, and then something is written. The temporal proximity is the natural connective tissue.

The connection should never feel mechanical. Avoid:

> "This journal entry is tagged with card A-05 (การยอมรับ)."

Prefer the felt connection — presenting them together without labeling the relationship, letting the user make the association.

**Three modes of connection:**

**Same-day companions.** A journal entry written on the same day a card was drawn. The most natural and reliable link. These belong together. When surfacing the card encounter, show the journal entry from that day alongside it — quietly, without commentary. Two things that were present on the same day.

**Category-period companions.** A sustained stretch of time when the user drew many cards from the same category. Journal entries written during that period belong to that chapter thematically, even if no specific card-journal link exists. A period of acceptance cards and the writing from that period share something.

**Explicit resonance.** The user writes directly about a card in their journal. This is meaningful and rare. It cannot be detected without text analysis (which Care deliberately avoids), but it can be honored: if a user references a card title in their journal, a future implementation could detect that substring.

**The principle:** the card and the journal are not linked by a database foreign key. They are linked by having been present in the same life at the same time. Treat them as companions, not as tagged records.

---

## 5. Chapters, Not Entries

Life does not happen entry-by-entry. It happens in seasons.

The user who looks back at Care's data is not looking for individual days. They are looking for chapters: "when I was going through that thing," "the spring I came back to this," "before and after."

The challenge is defining a chapter without asking the user to define it.

### Natural chapter boundaries — recognizable from data

**Engagement gaps.** The user stopped checking in for two or more weeks, then returned. That gap is a natural dividing line between chapters. What happened before the gap is a chapter. Return is the beginning of a new one.

**Dominant mood shifts.** A sustained period of เหนื่อย (tired/exhausted) followed by a shift to สบายดี. The shift is a chapter transition. The chapter doesn't have a name — it has a weather pattern.

**Card category shifts.** If the user drew mostly acceptance cards for five weeks, then began drawing growth cards, something changed in their orientation. The shift is chapter-worthy.

**Calendar rhythm.** Quarters and seasons carry cultural weight. Three months is a natural human arc. Offering a chapter view at roughly those intervals respects the rhythm without forcing it.

### What a chapter view contains

A chapter is not a complete log. It is a felt summary:

- The dominant card category during that period (without a count)
- The dominant mood during that period (the most frequent, not a graph)
- One or two journal entries from that period — not the longest, not the "best," but the ones that feel representative, selected by heuristic (first entry of the period, longest entry, or an entry from the chapter's middle)
- The date range, small and secondary

A chapter should be readable in 60 seconds.

### What Care does not do

Care does not define the chapter for the user. It does not say: "Your Acceptance Chapter." It presents the pattern and lets the user recognize — or not recognize — something in it. A chapter remains unnamed unless the user chooses to name it. Care never asks for names.

---

## 6. What Should Never Be Shown

**Streak numbers in memory context.** A streak is an engagement metric. It should not become the unit of a life chapter. "This was your 45-day streak period" is the wrong frame for memory. What matters is what the user was experiencing during that time, not how consistently they opened the app.

**Deleted entries.** Deletion is an act of self-editing. It is permanent and must be respected. A deleted journal entry is gone. It does not appear in memory, in chapter views, or in any analysis derived from it. The deletion is the user's final word on that entry.

**Mood data stripped of context.** A single day of เหนื่อย without surrounding days is an incomplete picture. A moment of low mood, presented alone, can feel like an accusation: *you were tired that day*. Mood data should appear only as pattern — never as an isolated point.

**Absence as failure.** Gaps in the record are not failures. The user was not here during that gap, and that is their own. Care does not show "X days missed" in any memory context. The absence is acknowledged only by what surrounds it — the chapter before the gap, the return after it.

**Comparisons with a baseline.** "You're less engaged than last month." "This month has been quieter than before." These are judgments. Memory is not a coach. Care does not measure the user against a prior version of themselves and find them wanting.

**Future-directed pressure.** Memory is backwards-facing. "Based on your patterns, you might want to..." is not memory — it is instruction. Care does not use memory as a reason to tell the user what to do.

**Any suggestion of what the user "should feel" about their past.** The past belongs to the user. Care presents it. The user interprets it.

---

## 7. Emotional Risks

These are real. Any implementation must hold them seriously.

### Retriggering

A journal entry from a genuinely painful period, resurfaced without warning, can reopen something the user has moved through or is still carrying. The system cannot know how processed a memory is. It does not know whether the user is ready to revisit a hard chapter.

**Mitigation:** Memory should require intent. It should not surface proactively without some form of user choice — navigating to a memory section, choosing to look back. Unsolicited surfacing (a notification, an "on this day" popup) is the highest-risk form.

### Regression narrative

If the user is in a difficult period now and Care surfaces a time of greater wellbeing, the implicit comparison can be: *I used to be better at this*. Memory should not communicate — even accidentally — that the user has regressed.

**Mitigation:** Never frame memory as "then vs. now." Present the past moment as a past moment, not as evidence of where the user once was that they are no longer.

### Surveillance discomfort

If Care surfaces something unexpectedly accurate — "I noticed that around this time, things felt heavy" — it can feel intrusive rather than caring. The accuracy is not the problem. The feeling of being watched by a system that knows too much is the problem.

**Mitigation:** Care surfaces patterns, not insights. "During this period, many of the cards you drew were about acceptance" is a pattern. "It seems like you were struggling with something" is an insight. Care only speaks to the first.

### Memory as performance

Once users know their entries may be resurfaced, they may begin writing for an imagined future self or an implied audience — tidying up the prose, making the meaning more legible, avoiding the raw and formless. This corrupts the journal as a private space.

**Mitigation:** Never tell the user which entries will be surfaced. Never surface entries too soon (within 60 days). Never frame memory surfacing as a reward for "good" entries. The journal should remain a private space that just happens to also be archival.

### The "On This Day" trap

Facebook's "On This Day" feature is frequently unwelcome because it resurfaces without asking whether the user wants to go back there. A breakup anniversary. A period of illness. A photo with someone no longer present. The feature does not know the weight of what it is showing.

**Mitigation:** Memory in Care should never fire unexpectedly. No notifications, no homepage insertions, no "today, X years ago" frames. Memory is a place the user visits. It does not come to the user.

### Selective memory bias

What Care surfaces shapes what the user remembers about their past. If the algorithm privileges positive moments, the user's sense of their own history becomes more optimistic than it was. If it privileges difficult ones, the opposite. There is no neutral selection.

**Mitigation:** Prefer presenting full chapter periods over selecting individual "memorable" moments. A chapter contains what was there — the mix, not the highlight. Surface the representative, not the extreme.

---

## 8. Future Implementation Ideas

These are directions, not decisions. None are committed.

### The Quiet Archive

A space the user can enter intentionally — never surfaced proactively — to navigate their own history without Care directing them. Navigation by time (scroll), by card category (filter), or by mood (filter). Care presents; the user chooses what to look at.

The quiet archive is the opposite of a recommendation engine. It is a library. The user knows where things are and goes looking for them.

### Chapter View

Instead of a day-by-day log, a chapter-by-chapter view. Each chapter defined by natural data patterns (mood shift, engagement gap, card category shift). Each chapter shows: dominant card category (one word), dominant mood (one word), and one or two journal entries from the period. Date range in small secondary text.

Chapters should be browseable, not announced. The user scrolls through them like turning pages, not receiving reports.

### The Card's Second Visit

When a card is drawn for the second or third time, a brief trace of the first encounter could appear — not the content of the first encounter, but a quiet acknowledgment: "This card has been to you before." No date. No link to the original. Just the recognition that it came once, and it has come again.

The user can choose to visit the collection to find out when.

### Same-Day Companions

For any card in the collection that has been seen, display: the card face (via CardFace) and, if one exists, the journal entry written on the same day, shown simply and without commentary. The day is presented as a unit — card and words, together.

This requires no new data structure — only temporal proximity between reading_history.read_at and journal_entries.created_at.

### Annual Letter

At the end of a calendar year (or on a user's one-year anniversary), offer a single optional reflection composed from the year's patterns. Opt-in only — never sent without the user choosing to receive it.

Not a report. A letter. One paragraph. Something like: *"This year, many of the cards that came to you were about growth. The entry you wrote in September was one of the longest."* Nothing more. The user decides what to do with it.

### Chapter Naming

Optional, never prompted. If the user wants to name a period, they can. The name appears when that chapter surfaces. But Care never requests a name, never shows unnamed chapters differently from named ones, and never uses the name to analyze or categorize the user.

---

## The Test

Before any memory feature is built or shown, ask:

1. Does this feel like finding a letter in a drawer, or like receiving a report?
2. Does this require the user's intent to surface, or does it arrive uninvited?
3. Does this present a pattern, or does it draw a conclusion?
4. If the user is in a hard place today, could this make it harder?
5. Does this respect that the past belongs to the user — not to Care?

If the answer to question 1 is "report," 2 is "uninvited," 3 is "conclusion," 4 is "yes," or 5 is "no" — the feature is not ready.
