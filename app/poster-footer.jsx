"use client";
// ASTRA footer: Pranav structure. Quiet info on dark teal, a fading hairline bar, then a pure-CSS
// luminous teal glow rising from the bottom edge (no images). The footer ends shortly after the bar.
// Replaces `function Footer()` in app/experience.jsx. Styles: poster-footer.css. Images: public/footer/.
import { useEffect, useRef, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, m, useSpring, useMotionValue, useReducedMotion } from "framer-motion";

const COLUMNS = [
  { title: "Shop", links: [["Drop 001", "#drop"], ["Nightshift", "#drop"], ["Chalk", "#drop"], ["Signal", "#drop"]] },
  { title: "Info", links: [["Field notes", "#story"], ["Sizing", "#"], ["Shipping", "#"], ["Returns", "#"]] },
  { title: "Follow", links: [["Instagram", "#", true], ["X", "#", true], ["Pitch cut", "/pitch/"]] },
];

// Choreography: hairline (0) → wordmark (1) → tagline (2) → columns left→right (3,4,5) → form (6).
const EASE = [0.22, 1, 0.36, 1];
const item = {
  hidden: { opacity: 0, y: 9 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.18 + i * 0.09 } }),
};
const line = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } } };

function Star({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 0v40M0 20h40M6 6l28 28M34 6 6 34" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}

// Refined arrow glyphs: hairline shaft, small open head (1.25 stroke, round caps).
function Arrow({ dir = "right", className = "pf-arrow" }) {
  const d = { right: "M3.5 12h16M14.5 6.5 20 12l-5.5 5.5", up: "M12 20V4.5M6.5 10 12 4.5l5.5 5.5", out: "M7 17 17 7M9 7h8v8" }[dir];
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}

function RollLink({ href, children, external, className = "pf-link" }) {
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      <span className="pf-roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
      {external && <Arrow dir="out" className="pf-arrow pf-arrow-out" />}
    </a>
  );
}

// Live local time for the bar meta (Asia/Kolkata). Rendered after mount to avoid a hydration mismatch.
function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <time className="pf-time" suppressHydrationWarning>{t || "--:--"}</time>;
}

export function PosterFooter({ shopHref = "#drop" }) {
  const reduce = useReducedMotion();

  // Light on dark paint: a faint radial highlight trails the cursor across the info layer (fine pointer only).
  const contentRef = useRef(null);
  const lx = useMotionValue(0), ly = useMotionValue(0), lo = useMotionValue(0);
  const sx = useSpring(lx, { stiffness: 40, damping: 26, mass: 1.2 });
  const sy = useSpring(ly, { stiffness: 40, damping: 26, mass: 1.2 });
  const so = useSpring(lo, { stiffness: 60, damping: 30 });
  useEffect(() => {
    const el = contentRef.current;
    if (!el || reduce || !window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1100px)").matches) return;
    const move = (e) => { const r = el.getBoundingClientRect(); lx.set(e.clientX - r.left); ly.set(e.clientY - r.top); lo.set(1); };
    const leave = () => lo.set(0);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [reduce, lx, ly, lo]);

  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <footer className="pf">
          {/* luminous teal glow rising from the bottom edge: pure CSS, slow breathing drift */}
          <div className="pf-glow" aria-hidden="true"><span className="pf-glow-core" /><span className="pf-glow-sweep" /></div>

          <m.div ref={contentRef} className="pf-content" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
            <m.div className="pf-light" aria-hidden="true" style={{ x: sx, y: sy, opacity: so }} />
            <div className="pf-info">
              <div className="pf-brand">
                <m.a variants={item} custom={1} className="pf-wordmark" href="/" aria-label="ASTRA home"><Star className="pf-mark" />ASTRA</m.a>
                <m.p variants={item} custom={2} className="pf-tagline">Three everyday caps for people who move after dark. Made to be worn out.</m.p>
              </div>

              <nav className="pf-cols" aria-label="Footer">
                {COLUMNS.map((col, i) => (
                  <m.div variants={item} custom={3 + i} key={col.title} className="pf-col">
                    <h3 className="pf-col-title">{col.title}</h3>
                    <ul>{col.links.map(([label, href, ext]) => <li key={label}><RollLink href={href} external={ext}>{label}</RollLink></li>)}</ul>
                  </m.div>
                ))}
              </nav>

              <m.div variants={item} custom={6} className="pf-side">
                <form className="pf-alerts" onSubmit={(e) => e.preventDefault()}>
                  <h3 className="pf-col-title" id="pf-alerts-title">Drop alerts</h3>
                  <p className="pf-help">One email when Drop 002 lands.</p>
                  <div className="pf-field">
                    <label htmlFor="pf-email" className="pf-sr">Email address</label>
                    <input id="pf-email" type="email" placeholder="Your email" autoComplete="email" aria-describedby="pf-alerts-title" />
                    <button type="submit" aria-label="Get drop alerts">
                      <Arrow />
                    </button>
                  </div>
                </form>
                <a className="pf-cta" href={shopHref}><span>Shop Drop 001 · $40</span><Arrow /></a>
              </m.div>
            </div>

            <div className="pf-bar">
              <m.span className="pf-bar-line" aria-hidden="true" variants={line} />
              <span className="pf-bar-start">
                <span>© 2026 ASTRA. All rights reserved.</span>
                <span className="pf-meta">Chennai, IN · <LocalTime /> IST</span>
              </span>
              <span className="pf-bar-end">
                <a href="#">@astra.caps</a>
                <a href="https://thedotco.in" target="_blank" rel="noreferrer">Concept by The Dot<Arrow dir="out" className="pf-arrow pf-arrow-out" /></a>
                <button type="button" onClick={toTop}>Back to top<Arrow dir="up" className="pf-arrow pf-arrow-up" /></button>
              </span>
            </div>
          </m.div>
          <div className="pf-glow-space" aria-hidden="true" />
          <div className="pf-grain" aria-hidden="true" />
        </footer>
      </MotionConfig>
    </LazyMotion>
  );
}
