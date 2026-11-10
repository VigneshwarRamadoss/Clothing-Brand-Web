# ASTRA footer: Antigravity prompt (paste everything below the line)

Copy into the repo first, from `astra-footer-kit.zip` → `footer/`: `PosterFooter.jsx`, `poster-footer.css`, and `layout.example.jsx` for the Inter setup. **No images.** The footer is pure CSS. Reference: `renders/footer-1440.png`, `renders/footer-390.png`, `renders/footer-interactions.mp4`.

---

Replace the ASTRA footer with a quiet, premium, Pranav-style footer: dark teal info layer, a fading hairline bar, and a luminous teal glow rising from the bottom edge. Do not commit or push. Show me the diff and wait for my OK. Read `AGENTS.md` first. This Next.js 16 has breaking changes, so check `node_modules/next/dist/docs/` before touching next/font.

**Structure:**
- **Background:** `#0d252b` (dark teal) with a static SVG film-grain layer (`.pf-grain`, opacity .03) over everything to stop banding.
- **Info layer** on one 12-column grid with a 40px column gap (32px on mobile), `--pf-gutter: clamp(24px, 6vw, 96px)` margins, and 136px top padding on desktop (96px on mobile). All layout spacing is on an 8px rhythm.
  - Cols 1–4: the wordmark and tagline, then (row 2) the Drop alerts form plus the Shop button.
  - Cols 7–12: Shop, Info and Follow, each exactly 2 grid columns. Follow has Instagram, X (each with a small ↗ glyph) and Pitch cut.
  - Mobile stacks it all: brand, 2-up links, Follow, the form, the bar.
- **Hairline bar:**
  - Left: "© 2026 ASTRA. All rights reserved." plus a meta item "Chennai, IN · HH:MM IST". It's live local time (`Intl.DateTimeFormat`, `timeZone: "Asia/Kolkata"`, 24h, updated every 15s, rendered after mount; tabular numerals).
  - Right: @astra.caps · Concept by The Dot ↗ · Back to top ↑.
  - The hairline above it is a gradient that fades out at both ends (transparent → line 14% … 86% → transparent).
- **Glow** (`.pf-glow`, absolutely positioned at the bottom; height = glow band + 240px, so it starts faintly behind the bar):
  - **Core:** a wide elliptical `radial-gradient` rising from the bottom centre. It starts at `#3fa3b8` (.9) at the base and runs through `#2a88a1` in many eased stops down to 0, fading up into `#0d252b`. The ellipse is 72% wide on desktop and 120% on mobile.
  - **Wash:** a second, wider and lower ellipse (`#2a88a1`, .3 → 0).
  - **Sweep:** a faint mist highlight off-centre at x 70% (`.pf-glow-sweep`, .07 → 0).
  - **Band height:** below the bar it's `clamp(160px, 22vh, 220px)` on desktop and 168px on mobile, set by `.pf-glow-space`. The footer ends at the bottom of the glow, about 850px at 1440 × 900.
- No images, no ticker, no Anton, no lime in the footer.

**Typography (Inter only, via next/font with `axes: ["opsz"]`):**
- **Font features:** `font-optical-sizing: auto` and tabular numerals (`tnum`) across the footer.
- **Wordmark:** "✳ ASTRA", 32px/500, with `font-variation-settings: "opsz" 32` (the Inter Display cut) and −.02em tracking.
- **Tagline:** 16px with `text-wrap: balance`.
- **Headings:** 13px/500, uppercase, +.08em tracking, with a 24px tick under each that fades out to the right.
- **Links:** 17px in sentence case, line-height 1.9 for an airy rhythm.
- **Bar:** 14px.

**Colour:**
- Headings, wordmark and button are `#d6e4e6` (mist). Links and body are `#8fa8ac` (muted, ≥5.3:1 everywhere, including the bar over the glow's tail).
- Hairlines are `rgb(214 228 230 / .18)`. The glow uses `#2a88a1` and `#3fa3b8`.
- No other colours.

**Detailing:** custom arrow glyphs (`Arrow`: hairline 1.25 stroke, round caps, small open head) in three forms: → for the email submit and the CTA, ↗ for external links, ↑ for Back to top.

**Interactions** (framer-motion only, no new deps; transform and opacity only; restrained, nothing bouncy):
1. **Reveal** fires once with `whileInView` on `.pf-content` (`amount: 0.35`), in order: the hairline draws first (`scaleX` 0→1 from the left, 0.9s), then the wordmark, then the tagline, then the columns left to right, then the form. Items are 0.09s apart and each fades in while rising 9px over 0.7s, ease `[0.22, 1, 0.36, 1]`.
2. **Light on dark paint:** a 720px radial highlight (~4% mist) trails the cursor across the info layer (`.pf-light`, a transform-only spring: stiffness 40, damping 26, mass 1.2). It fades in on enter and out on leave. Desktop only, when `(hover: hover) and (pointer: fine)`.
3. **Links:** the vertical text roll (muted → mist, 0.4s) happens together with a 1px underline drawn from the left (`scaleX`, 0.4s, `[0.22, 1, 0.36, 1]`). ↗ glyphs nudge diagonally by 2px.
4. **Button:** the outlined mist pill fills smoothly to solid mist with dark text (0.5s), and its → nudges 4px.
5. **Email:** a resting hairline that fades out at its end. On focus, a brighter mist underline extends across from the left (0.6s). The submit → nudges on hover.
6. **Glow breathing:** the core drifts very slowly (16s, scale 1 → 1.04/1.06, opacity .92 → 1, alternate) and the sweep drifts ±2% over 20s.
7. **Back to top** smooth-scrolls to the top (`auto` under reduced motion).

Reduced motion shows the final state: no reveal, line draw, breathing, cursor light or transitions. The JS passes static styles, and CSS `!important` rules in the `prefers-reduced-motion` block back it up. Keep both.

**Steps:**
1. **Component:** create `app/poster-footer.jsx` from `PosterFooter.jsx`, unchanged. Delete any `public/footer/` images from earlier versions.
2. **app/experience.jsx:** add `import { PosterFooter } from "./poster-footer";`, delete `function Footer() { ... }` and replace `<Footer />` with `<PosterFooter />`. Keep `Asterisk`, `Icon` and `MagneticLink`, because the hero uses them.
3. **app/globals.css:** paste `poster-footer.css` at the END. Delete the old footer rules: `.site-footer`, `.footer-cta*`, `.footer-mark`, `.footer-bar*`, `.instagram*`, and the `.footer-cta h2` half of the shared `.drop-heading h2, .footer-cta h2` rule. It's plain CSS, so `@import "tailwindcss" source(none)` doesn't matter.
4. **app/layout.jsx:** `import { Inter } from "next/font/google"; const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", axes: ["opsz"] });` and `<html lang="en" className={inter.variable}>`.

**Acceptance:**
- `npm run build` passes, then check with `npm run preview`.
- 1440 × 900: the footer is about 850px tall, ending about 200px below the bar. The glow is luminous at the base and fades up with no banding (grain on). The bar text stays ≥ 4.5:1.
- 390 and 375 wide: the footer is about 1320px tall. No horizontal overflow, and every tap target is ≥ 44px.
- The time reads the current IST time. Reduced motion renders the final state with no breathing.
- Interactions match `footer-interactions.mp4`.
