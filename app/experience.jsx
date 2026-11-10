"use client";

import { useEffect, useRef, useState } from "react";
import { FieldNotes } from "./field-notes";
import { PosterFooter } from "./poster-footer";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  animate,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const products = [
  { id: "nightshift", name: "Nightshift", color: "Washed black", alt: "Washed black cap with a small ivory eight-point star embroidery", tone: "black", detail: "Washed black with a quiet ivory star up front. The cap you leave by the door." },
  { id: "chalk", name: "Chalk", color: "Bone", alt: "Bone cap with a small dark ASTRA wordmark embroidery", tone: "bone", detail: "Bone cotton twill with a clean dark wordmark stitched across the crown." },
  { id: "signal", name: "Signal", color: "Royal blue", alt: "Royal blue cap with an ivory eight-point star emblem", tone: "blue", detail: "A clean hit of royal blue with the compass star mark up front." },
];


const marqueeItems = [
  "WEAR IT OUT",
  "DROP 001",
  "3 CAPS",
  "$40",
  "AFTER 11",
];

function wrapRange(min, max, v) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function Icon({ kind = "diagonal", size = 20 }) {
  const paths = {
    diagonal: "M5 19 19 5M7 5h12v12",
    down: "M12 4v15m-6-6 6 6 6-6",
    right: "M4 12h15m-6-6 6 6-6 6",
    replay: "M4 11a8 8 0 1 1 2 6m-2-6V5m0 6h6",
    close: "m6 6 12 12M18 6 6 18",
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={paths[kind]} /></svg>;
}

function Asterisk({ className }) {
  return <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true"><path d="M20 0v40M0 20h40M6 6l28 28M34 6 6 34" stroke="currentColor" strokeWidth="4.6" /></svg>;
}

function CapImage({ product, hero, ...props }) {
  const image = <img src={`/caps/${product.id}.webp`} alt={product.alt} width="1000" height="650" draggable="false" {...props} />;
  return hero ? <picture><source media="(max-width: 620px)" srcSet="/caps/nightshift-mobile.webp" />{image}</picture> : image;
}

export function RevealLines({ lines, as: Tag = "h2", delay = 0, className = "display", id }) {
  const reduceMotion = useReducedMotion();

  return (
    <Tag id={id} className={className}>
      {lines.map((line, index) => (
        <span key={line} className="reveal-mask block overflow-clip">
          {reduceMotion ? (
            <span className="block">{line}</span>
          ) : (
            <m.span
              className="block origin-bottom-left"
              initial={{ y: "110%", rotate: 3 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + index * 0.08,
              }}
            >
              {line}
            </m.span>
          )}
        </span>
      ))}
    </Tag>
  );
}

export function SiteHeader({ pitch = false }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="ASTRA home"><Asterisk />ASTRA</a>
        <nav aria-label="Main navigation" className="header-nav">
          <a href={pitch ? "/#drop" : "#drop"}>The drop</a>
          <a href={pitch ? "/#story" : "#story"}>Field notes</a>
        </nav>
        <a className="header-action" href={pitch ? "/" : "/pitch/"}>
          {pitch ? "Back to site" : "Play intro"}<Icon kind={pitch ? "right" : "diagonal"} size={15} />
        </a>
      </header>
    </>
  );
}

function MagneticLink({ href, children }) {
  function move(event) {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 800px) and (prefers-reduced-motion: no-preference)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pull-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`);
    event.currentTarget.style.setProperty("--pull-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.22}px`);
  }

  function reset(event) {
    event.currentTarget.style.removeProperty("--pull-x");
    event.currentTarget.style.removeProperty("--pull-y");
  }

  return <a href={href} className="shop-link" onPointerMove={move} onPointerLeave={reset}><span>{children}<Icon /></span></a>;
}

export function Hero({ pitch = false }) {
  const sectionRef = useRef(null);
  const [replay, setReplay] = useState(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const pitchProgress = useMotionValue(0);
  const progress = pitch ? pitchProgress : smoothScroll;

  useEffect(() => {
    if (!pitch || reduceMotion) return;
    pitchProgress.set(0);
    const controls = animate(pitchProgress, [0, 0.5, 1], {
      duration: 12,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [pitch, replay, reduceMotion, pitchProgress]);

  const capRotate = useTransform(progress, [0, 0.5, 1], [-18, 0, 14]);
  const capScale = useTransform(progress, [0, 0.5, 1], [0.85, 1.12, 0.72]);
  const capY = useTransform(progress, [0, 1], ["0%", "-18%"]);
  const lateX = useTransform(progress, [0, 1], ["0%", "-40%"]);
  const shiftX = useTransform(progress, [0, 1], ["0%", "40%"]);
  const stampRotate = useTransform(progress, [0, 1], [0, 180]);
  const copyOpacity = useTransform(progress, [0.15, 0.3], [0, 1]);
  const copyY = useTransform(progress, [0.15, 0.3], [24, 0]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const tiltRotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 15,
  });
  const tiltRotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 150,
    damping: 15,
  });
  const wordParallaxX = useSpring(useTransform(pointerX, [-0.5, 0.5], [12, -12]), {
    stiffness: 150,
    damping: 15,
  });
  const wordParallaxY = useSpring(useTransform(pointerY, [-0.5, 0.5], [12, -12]), {
    stiffness: 150,
    damping: 15,
  });

  function handlePointerMove(event) {
    if (
      reduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 800px)").matches
    ) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const sectionClasses = reduceMotion
    ? "hero h-auto"
    : pitch
      ? "hero hero-pitch"
      : "hero h-[160svh] min-[800px]:h-[240svh]";

  const stageClasses = reduceMotion
    ? "hero-stage relative h-auto overflow-clip"
    : "hero-stage is-pinned overflow-clip";

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        className={sectionClasses}
        aria-labelledby="hero-heading"
      >
        <div
          key={replay}
          className={stageClasses}
          style={{ perspective: "1000px" }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="hero-stage-inner">
            <div className="hero-top-bar">
              <p className="eyebrow hero-kicker">[ DROP 001 ] <span className="slash">/</span> [ 03 CAPS ]</p>
              <span className="art-index" aria-hidden="true">[ 001–003 ]</span>
            </div>

            <div className="hero-backdrop" aria-hidden="true">
              <div className="art-grid" />
              <m.div
                className="hero-words"
                style={reduceMotion ? undefined : { x: wordParallaxX, y: wordParallaxY }}
              >
                <div className="hero-word-row hero-word-late">
                  <span className="headline-mask">
                    <span className="hero-word-rise">
                      <m.span
                        className="hero-mega-word"
                        style={reduceMotion ? undefined : { x: lateX }}
                      >
                        LATE
                      </m.span>
                    </span>
                  </span>
                </div>
                <div className="hero-word-row hero-word-shift">
                  <span className="headline-mask accent">
                    <span className="hero-word-rise">
                      <m.span
                        className="hero-mega-word"
                        style={reduceMotion ? undefined : { x: shiftX }}
                      >
                        SHIFT
                      </m.span>
                    </span>
                  </span>
                </div>
              </m.div>
            </div>

            <div className="hero-centerpiece">
              <div className="cap-shadow" aria-hidden="true" />
              <m.div
                className="hero-cap-tilt"
                style={
                  reduceMotion
                    ? undefined
                    : {
                        rotateX: tiltRotateX,
                        rotateY: tiltRotateY,
                        transformStyle: "preserve-3d",
                      }
                }
              >
                <m.div
                  className="hero-cap-motion"
                  style={
                    reduceMotion
                      ? undefined
                      : {
                          rotate: capRotate,
                          scale: capScale,
                          y: capY,
                        }
                  }
                >
                  <div className="cap-drop">
                    <CapImage hero product={products[0]} className="hero-cap" fetchPriority="high" />
                  </div>
                </m.div>
              </m.div>

              <div className="mark-stamp-wrap" aria-hidden="true">
                <m.div
                  className="mark-stamp"
                  style={reduceMotion ? undefined : { rotate: stampRotate }}
                >
                  <Asterisk />
                  <span>AFTER DARK</span>
                </m.div>
              </div>
            </div>

            <m.div
              className="hero-foreground"
              style={
                reduceMotion
                  ? undefined
                  : {
                      opacity: copyOpacity,
                      y: copyY,
                    }
              }
            >
              <div className="hero-copy">
                <h1 id="hero-heading" className="sr-only">
                  Built for the late shift.
                </h1>
                <p className="hero-description">
                  Three everyday caps for people who move after dark. Pick the one you’ll wear out.
                </p>
                <div className="hero-cta">
                  <MagneticLink href={pitch ? "/#drop" : "#drop"}>Shop the drop — $40</MagneticLink>
                </div>
              </div>
            </m.div>

            <div className="hero-strip">
              <span><Asterisk /> [ WEAR IT OUT ]</span>
              {pitch ? (
                <span className="strip-middle">[ 12 SEC / PITCH CUT ]</span>
              ) : (
                <a href="#story" className="strip-middle">
                  [ SCROLL TO EXPLORE ] <Icon kind="down" size={14} />
                </a>
              )}
              <button
                type="button"
                onClick={() => setReplay((value) => value + 1)}
                aria-label="Replay hero"
                suppressHydrationWarning
              >
                <Icon kind="replay" size={15} /> [ REPLAY INTRO ]
              </button>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

function MarqueeRow({ baseVelocity = -4, paused, focusPaused }) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3.5], {
    clamp: false,
  });
  const skewX = useTransform(
    smoothVelocity,
    [-1200, 0, 1200],
    baseVelocity < 0 ? [-6, 0, 6] : [6, 0, -6]
  );
  const x = useTransform(baseX, (v) => `${wrapRange(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || paused || focusPaused) return;
    const dt = Math.min(delta, 64) / 1000;
    const speedMultiplier = 1 + Math.min(Math.abs(velocityFactor.get()), 4);
    const moveBy = baseVelocity * speedMultiplier * dt;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="marquee-row">
      <m.div
        className="marquee-track"
        style={reduceMotion ? undefined : { x, skewX }}
      >
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {[0, 1].map((repeat) =>
              marqueeItems.map((item) => (
                <span key={`${copy}-${repeat}-${item}`}>
                  {item} <Asterisk />
                </span>
              ))
            )}
          </div>
        ))}
      </m.div>
    </div>
  );
}

function Marquee() {
  const [paused, setPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);

  return (
    <section
      className="marquee"
      aria-label="Wear it out"
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusPaused(false);
        }
      }}
    >
      <div className="marquee-rows" aria-hidden="true">
        <MarqueeRow baseVelocity={-4.2} paused={paused} focusPaused={focusPaused} />
        <MarqueeRow baseVelocity={4.2} paused={paused} focusPaused={focusPaused} />
      </div>
      <button
        type="button"
        className="marquee-pause"
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? "Play marquee" : "Pause marquee"}
        suppressHydrationWarning
      >
        {paused ? "▶" : "Ⅱ"}
      </button>
    </section>
  );
}


function ProductCard({ product, index, open }) {
  function tilt(event) {
    if (event.pointerType !== "mouse" || !matchMedia("(hover: hover) and (pointer: fine) and (min-width: 800px) and (prefers-reduced-motion: no-preference)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 15}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 18}deg`);
  }

  function reset(event) {
    event.currentTarget.style.removeProperty("--tilt-x");
    event.currentTarget.style.removeProperty("--tilt-y");
  }

  return (
    <li className="product">
      <button className="product-button" type="button" aria-haspopup="dialog" aria-label={`View ${product.name}, $40`} onClick={() => open(product)} onPointerMove={tilt} onPointerLeave={reset} suppressHydrationWarning>
        <div className={`product-art tone-${product.tone}`}>
          <span className="product-number">[ 0{index + 1} / 03 ]</span>
          <div className="product-tilt"><CapImage product={product} loading="lazy" /></div>
          <span className="product-open"><Icon kind="diagonal" size={18} /></span>
        </div>
        <div className="product-meta">
          <div><h3>{product.name}</h3><p>{product.color}</p></div>
          <span>$40</span>
        </div>
      </button>
    </li>
  );
}

function ProductRail() {
  const dialogRef = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (active && !dialogRef.current.open) dialogRef.current.showModal();
  }, [active]);

  return (
    <section id="drop" className="drop">
      <div className="drop-heading">
        <div>
          <p className="eyebrow">[ THE FIRST RELEASE ]</p>
          <RevealLines lines={["DROP 001."]} as="h2" className="display" />
        </div>
        <p className="drop-summary">Three caps. <strong>$40 each.</strong></p>
      </div>
      <ul className="product-grid">
        {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} open={setActive} />)}
      </ul>
      <dialog ref={dialogRef} className="product-dialog" aria-labelledby="product-title" onClose={() => setActive(null)} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        {active && (
          <div className="product-dialog-inner">
            <div className={`dialog-image tone-${active.tone}`}><CapImage product={active} /></div>
            <div className="dialog-copy">
              <p className="eyebrow">[ DROP 001 / {active.color} ]</p>
              <h2 id="product-title" className="display">{active.name}</h2>
              <p>{active.detail}</p>
              <strong>$40</strong>
              <form method="dialog"><button className="dialog-back" type="submit" suppressHydrationWarning>Back to the drop <Icon kind="right" size={17} /></button></form>
            </div>
            <form method="dialog"><button className="dialog-close" type="submit" autoFocus aria-label="Close product" suppressHydrationWarning><Icon kind="close" /></button></form>
          </div>
        )}
      </dialog>
    </section>
  );
}

export function Experience() {
  return (
    <LazyMotion features={domAnimation}>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Marquee />
        <FieldNotes />
        <ProductRail />
      </main>
      <PosterFooter />
    </LazyMotion>
  );
}
