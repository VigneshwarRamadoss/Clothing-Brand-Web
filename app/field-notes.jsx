"use client";
// ASTRA · Field Notes. One composed index + one sticky stage (desktop), three chapters driven by scroll.
// Each chapter carries its cap's colourway as a soft tinted light; the cap sits on a real contact shadow
// in front of a thin North-star line mark. Mobile (<960px): composed stacked chapters, revealed in view.
// Replaces `function Story()` in app/experience.jsx. Styles: field-notes.css. Images: existing /caps/*.webp.
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

const CHAPTERS = [
  { name: "Direction", lines: ["FIND YOUR", "NORTH."], detail: "Every route starts with something to steer by. Ours sits on the front panel.",
    cap: "signal", capName: "Signal", capNote: "Royal blue twill · compass star", alt: "Royal blue cap with an ivory eight-point star emblem", tint: "56 96 214", bearing: 0 },
  { name: "After dark", lines: ["THE CITY", "AFTER 11."], detail: "Empty streets, last trains, the long way home. That’s when the good stuff happens.",
    cap: "nightshift", capName: "Nightshift", capNote: "Washed black · ivory star", alt: "Washed black cap with a small ivory eight-point star embroidery", tint: "122 160 178", bearing: -28 },
  { name: "Constant", lines: ["SAME CAP.", "EVERY DAY."], detail: "No noise, no logo shouting. Just the one you reach for every morning.",
    cap: "chalk", capName: "Chalk", capNote: "Bone cotton · dark wordmark", alt: "Bone cap with a small dark ASTRA wordmark embroidery", tint: "222 204 168", bearing: 16 },
];
const pad = (n) => String(n).padStart(2, "0");

// Thin, precise North-star line mark (1px, non-scaling). Rotates to each chapter's bearing.
function NorthMark() {
  return (
    <svg className="fn-north" viewBox="0 0 240 240" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <circle cx="120" cy="120" r="84" opacity=".5" vectorEffect="non-scaling-stroke" />
        <path d="M120 8v224M28 120h184" vectorEffect="non-scaling-stroke" />
        <path d="M86 86l68 68M154 86l-68 68" opacity=".55" vectorEffect="non-scaling-stroke" />
        <path d="M120 52l9 68-9 68-9-68z" vectorEffect="non-scaling-stroke" />
      </g>
      <text x="120" y="4" textAnchor="middle" dominantBaseline="hanging" className="fn-north-n">N</text>
    </svg>
  );
}

function Star({ className }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" /></svg>;
}

function Fill({ p, i }) {
  const s = useTransform(p, [i / 3, (i + 1) / 3], [0, 1], { clamp: true });
  return <m.span className="fn-fill" style={{ scaleX: s }} />;
}

function Chapter({ c, i, state, p, still }) {
  const y = useTransform(p, [i / 3 - 0.12, (i + 1) / 3 + 0.12], [26, -26]);   // slight cap parallax inside its chapter
  return (
    <article className="fn-chapter" data-state={state} style={{ "--tint": c.tint }} aria-labelledby={`fn-h-${i}`}>
      <div className="fn-light" aria-hidden="true" />
      <div className="fn-copy">
        <p className="fn-eyebrow"><span className="fn-eyebrow-rule" aria-hidden="true" />{pad(i + 1)} — {c.name}</p>
        <h2 id={`fn-h-${i}`} className="display fn-title">
          {c.lines.map((line, k) => <span key={line} className="fn-mask"><span style={{ "--k": k }}>{line}</span></span>)}
        </h2>
        <p className="fn-detail">{c.detail}</p>
      </div>
      <figure className="fn-figure">
        <div className="fn-stage">
          <div className="fn-bearing" style={{ "--bearing": `${c.bearing}deg` }}><NorthMark /></div>
          <m.div className="fn-cap" style={still ? undefined : { y }}>
            <span className="fn-shadow" aria-hidden="true" />
            <img src={`/caps/${c.cap}.webp`} alt={c.alt} width="1000" height="650" loading="lazy" decoding="async" draggable="false" />
          </m.div>
        </div>
        <figcaption className="fn-caption"><span>{c.capName}</span><span>{c.capNote}</span></figcaption>
      </figure>
    </article>
  );
}

export function FieldNotes() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  // Reduced motion is read after mount (not via useReducedMotion) so the first client render matches the
  // static HTML; otherwise React keeps the server's data-state attributes after a hydration mismatch.
  const [reduce, setReduce] = useState(false);
  const [desk, setDesk] = useState(false);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState([false, false, false]);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.max(0, Math.min(2, Math.floor(v * 3 + 0.02)))));

  useEffect(() => {
    const mq = matchMedia("(min-width: 960px)"), rm = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => { setDesk(mq.matches); setReduce(rm.matches); };
    on(); mq.addEventListener("change", on); rm.addEventListener("change", on);
    sectionRef.current?.setAttribute("data-ready", "");
    return () => { mq.removeEventListener("change", on); rm.removeEventListener("change", on); };
  }, []);

  // Mobile: reveal each chapter once when it is really in view.
  useEffect(() => {
    if (desk) return;
    if (reduce || !("IntersectionObserver" in window)) { setSeen([true, true, true]); return; }
    const els = sectionRef.current?.querySelectorAll(".fn-chapter") || [];
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = [...els].indexOf(e.target);
      setSeen((s) => (s[i] ? s : s.map((v, k) => (k === i ? true : v))));
      io.unobserve(e.target);
    }), { threshold: 0.2, rootMargin: "0px 0px -12% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [desk, reduce]);

  const go = (i) => {
    const el = trackRef.current; if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY, len = el.offsetHeight - innerHeight;
    scrollTo({ top: top + len * ((i + 0.3) / 3), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={sectionRef} id="story" className="fn" aria-label="Field notes: the star you navigate by">
        <div ref={trackRef} className="fn-track">
          <div className="fn-sticky">
            <span className="fn-grain" aria-hidden="true" />
            <nav className="fn-index" aria-label="Field notes chapters">
              <p className="fn-label"><Star className="fn-label-star" />Field notes</p>
              <ol className="fn-list">
                {CHAPTERS.map((c, i) => (
                  <li key={c.name} aria-current={desk && i === active ? "step" : undefined}>
                    <button type="button" onClick={() => go(i)} tabIndex={desk ? 0 : -1} suppressHydrationWarning>
                      <span className="fn-num">{pad(i + 1)}</span><span className="fn-name">{c.name}</span>
                    </button>
                    <span className="fn-track-line" aria-hidden="true">{desk && !reduce ? <Fill p={p} i={i} /> : <span className="fn-fill fn-fill-static" />}</span>
                  </li>
                ))}
              </ol>
              <p className="fn-counter" aria-live="polite">
                <span className="fn-roll" aria-hidden="true"><span style={{ "--i": desk ? active : 0 }}>{CHAPTERS.map((_, i) => <span key={i}>{pad(i + 1)}</span>)}</span></span>
                <span className="fn-sr">Chapter {desk ? active + 1 : 1} of 3</span>
                <span className="fn-of">/ 03</span>
                <span className="fn-count-m">Three notes</span>
              </p>
            </nav>
            <div className="fn-chapters">
              {CHAPTERS.map((c, i) => {
                const state = desk ? (i === active ? "on" : i < active ? "past" : "next") : (seen[i] || reduce ? "on" : "next");
                return <Chapter key={c.name} c={c} i={i} p={p} still={reduce || !desk} state={state} />;
              })}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
