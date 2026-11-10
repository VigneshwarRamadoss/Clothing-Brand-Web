# ASTRA · Field Notes redesign: Antigravity prompt (paste everything below the line)

Copy into the repo first, from `astra-fieldnotes-kit.zip` → `fieldnotes/`: `FieldNotes.jsx` and `field-notes.css`. It uses the existing assets `/caps/signal.webp`, `/caps/nightshift.webp`, `/caps/chalk.webp` and `/grain.webp`. No new images and no new font families. Reference renders: `renders/fieldnotes-before-1440.png` (current), `renders/fieldnotes-1440.png` and `renders/fieldnotes-1440-ch2.png` (desktop), `renders/fieldnotes-390.png` (mobile), `renders/fieldnotes-interactions.mp4`.

---

Redesign the "Field notes" section (`#story`). Do not commit or push. Show me the diff and wait for my OK. Read `AGENTS.md` first.

**What's wrong now:**
- The left rail is an empty column: the label at the top, a tiny underlined list in the middle, the counter at the bottom.
- The olive grain box reads as a placeholder card.
- The big asterisk "starburst" is clumsy and low-contrast.
- The copy is disconnected from the headline.

**Direction:** quiet confidence. Use the header's grid (`--gutter`), a 12-column grid with 24px gaps and an 8px rhythm. Keep the existing tokens: `--background`, `--ink`, `--muted` and `--line`; Anton (`.display`) for headlines; `--mono` for labels; body in `var(--font-inter, Arial)`. Each chapter carries its cap's colourway as soft light. Use fading hairlines and fine grain, with no halos, no boxes and no giant shapes.

**Structure:**
- **Desktop (≥960px):** `.fn-track` is 330svh tall. `.fn-sticky` is sticky, 100svh, on a 12-column grid.
  - **Index** (cols 1–3), one grouped block:
    - The label "✳ Field notes" (mono 12px, .14em).
    - A numbered chapter list: mono numbers, 18px names, 56px rows. Each row has a 1px track whose ink fill grows with that chapter's scroll progress. Rows are buttons that smooth-scroll to their chapter.
    - The counter "01 / 03", where the current number rolls (tabular numerals).
  - **Chapters:** all three are stacked in one grid cell (cols 4–12, a 9-column subgrid).
    - **Copy** (sub-cols 1–5):
      - Eyebrow "— 01 — Direction": mono, with a 24px fading rule.
      - Headline: Anton, `clamp(4.5rem, 8.8vw, 9.5rem)`, line-height .94. Each line sits in an overflow mask.
      - Body copy: 17px/1.6 in `#d6d7ca` (12.9:1), max 34ch.
    - **Figure** (sub-cols 6–9, stage 118% wide, pulled 12% left):
      - A thin North-star line mark behind the cap (1px non-scaling strokes: ring, N–S and E–W axes, faint diagonals, a slim compass needle, a small "N"). It's 20% ink and rotates to each chapter's bearing (0°, −28°, 16°).
      - The cap (`/caps/*.webp`) on a real contact shadow (a dark radial core plus a faint tinted floor light).
      - Caption under a fading hairline: the cap name (15px ink) and a mono note (12px muted).
  - **Tinted light** (`.fn-light`): a full-stage radial behind the figure in the cap's colourway. Signal `56 96 214`, Nightshift `122 160 178`, Chalk `222 204 168`, at .3 → 0 across eased stops. Grain on top at .05. A fading hairline marks the section top.
- **Mobile (<960px):**
  - Index row: "✳ Field notes" on the left, "Three notes" on the right, over a fading hairline.
  - Then three stacked chapters, each: figure (with light), caption, eyebrow, headline at `clamp(3.5rem, 17vw, 5.5rem)`, copy. 96px between chapters.

**Chapters:**

| # | Name | Headline | Cap | Note |
|---|------|----------|-----|------|
| 01 | Direction | FIND YOUR / NORTH. | Signal | Royal blue twill · compass star |
| 02 | After dark | THE CITY / AFTER 11. | Nightshift | Washed black · ivory star |
| 03 | Constant | SAME CAP. / EVERY DAY. | Chalk | Bone cotton · dark wordmark |

Keep the existing body copy.

**Motion** (framer-motion, no new deps; transform and opacity only):
- **Desktop.** The active chapter comes from `useScroll` on `.fn-track` (`["start start", "end end"]`) and is set with `useMotionValueEvent`. Chapters carry `data-state` = on, past or next, and CSS runs an ordered change:
  - The outgoing cap and mark clear in .28s. The incoming light fades over 1.1s.
  - The incoming mark rotates to its bearing (from .2s). The cap fades in and settles 16px (.3s delay), with its shadow widening.
  - Then the eyebrow (.16s), the headline lines masked up in order (.22s + .08s each), the copy (.44s) and the caption (.5s). Ease `[0.22, 1, 0.36, 1]`.
  - Past chapters' lines exit upward and next chapters' lines wait below, so headlines never cross-fade into mush. Caps never double-expose.
  - Within its chapter the cap drifts ±26px (parallax, spring-smoothed). The index fills track progress.
- **Mobile.** Each chapter reveals once with the same ordered sequence when it's in view (IntersectionObserver, threshold .2).
- **Reduced motion.** Read it from `matchMedia` after mount; do not use `useReducedMotion` in render, because it causes a hydration mismatch that leaves `data-state` stuck.
  - Mobile shows everything statically.
  - Desktop swaps chapters instantly: no transitions, parallax, rolls or fills.
- Without JS, all chapters are visible (states only apply under `.fn[data-ready]`).

**Steps:**
1. **Component:** add `app/field-notes.jsx` (from `FieldNotes.jsx`, unchanged).
2. **app/experience.jsx:**
   - Add `import { FieldNotes } from "./field-notes";`.
   - Delete `const chapters = [...]` and `function Story() { ... }`.
   - Replace `<Story />` with `<FieldNotes />`.
   - Keep the header link `#story`, since the section keeps `id="story"`.
3. **app/globals.css:**
   - Paste `field-notes.css` before the footer block, or at the end.
   - Delete the old rules: `.story`, `.chapter*`, `.chapter-watermark*`, the `.chapter-content::after` grain selector (remove it from the shared `.hero-art::after, …` rule), the chapter lines in the `min-width: 800px` and `max-width: 799px` media blocks, and `.chapter*` in the reduced-motion block.
4. **app/layout.jsx:** if Inter is not loaded yet, add it via next/font as `--font-inter` (as in the footer kit). The section falls back to Arial without it.

**Acceptance:**
- `npm run build` passes.
- **1440 × 900:** the index is one grouped block. Chapters change in order with no overlap or ghosting. The light tint matches each cap, the cap sits on its shadow, and the headline never touches the cap.
- **390:** three clean stacked chapters, no horizontal overflow.
- **Contrast:** muted text ≥ 7:1 and body copy ≥ 11:1 over the tinted light.
- Reduced motion behaves as described above.
- The index buttons are keyboard-focusable on desktop.
