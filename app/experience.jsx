"use client";

import { useEffect, useRef, useState } from "react";
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

const chapters = [
  { name: "Direction", code: "[ 01 / DIRECTION ]", num: "01", lines: ["FIND YOUR", "NORTH."], detail: "Every route starts with something to steer by. Ours sits on the front panel.", product: products[2] },
  { name: "After dark", code: "[ 02 / AFTER DARK ]", num: "02", lines: ["THE CITY", "AFTER 11."], detail: "Empty streets, last trains, the long way home. That’s when the good stuff happens.", product: products[0] },
  { name: "Constant", code: "[ 03 / CONSTANT ]", num: "03", lines: ["SAME CAP.", "EVERY DAY."], detail: "No noise, no logo shouting. Just the one you reach for every morning.", product: products[1] },
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
      >
        {paused ? "▶" : "Ⅱ"}
      </button>
    </section>
  );
}

function Story() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const railFill = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = latest < 0.34 ? 0 : latest < 0.67 ? 1 : 2;
    setActive((prev) => (prev === next ? prev : next));
  });

  const activeChapter = chapters[active];

  return (
    <section
      ref={sectionRef}
      id="story"
      className={
        reduceMotion
          ? "story story-static"
          : "story min-[800px]:h-[300svh]"
      }
      aria-label="The star you navigate by"
    >
      {/* Semantic Stacked View for Mobile (<800px), Reduced Motion, and Screen Readers / Keyboard */}
      <div className={reduceMotion ? "story-stack" : "story-stack min-[800px]:sr-only"}>
        <div className="story-stack-header">
          <span className="eyebrow">[ FIELD NOTES ]</span>
          <ol className="story-stack-steps" aria-label="Chapters">
            {chapters.map((item, idx) => (
              <li key={item.name}>
                <span>0{idx + 1}</span> {item.name}
              </li>
            ))}
          </ol>
        </div>
        {chapters.map((chapter) => (
          <article key={chapter.name} className="story-stack-card">
            <div className="story-stack-top">
              <p className="eyebrow">{chapter.code}</p>
              <span className="chapter-index">[ {chapter.num} / 03 ]</span>
            </div>
            <div className="story-stack-body">
              <div className="story-stack-copy">
                <RevealLines lines={chapter.lines} as="h2" className="display story-heading" />
                <p className="chapter-detail">{chapter.detail}</p>
              </div>
              <div className="story-stack-cap">
                <CapImage product={chapter.product} loading="lazy" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pinned Desktop Stage (>=800px & prefers-reduced-motion: no-preference) */}
      {!reduceMotion && (
        <div
          className="story-pinned hidden min-[800px]:grid overflow-clip"
          aria-hidden="true"
        >
          <div className="story-pinned-frame">
            <aside className="story-rail">
              <span className="eyebrow">[ FIELD NOTES ]</span>
              <div className="story-rail-track-wrap">
                <div className="story-rail-track">
                  <m.div
                    className="story-rail-fill"
                    style={{ scaleY: railFill, transformOrigin: "top" }}
                  />
                </div>
                <ol className="chapter-steps">
                  {chapters.map((item, step) => (
                    <li
                      key={item.name}
                      className={step === active ? "is-active" : undefined}
                    >
                      <span>0{step + 1}</span> {item.name}
                    </li>
                  ))}
                </ol>
              </div>
              <span className="chapter-index">[ 0{active + 1} / 03 ]</span>
            </aside>

            <div className="story-stage-main">
              <div className="story-giant-num" aria-hidden="true">
                <div className="story-giant-num-mask">
                  <m.div
                    className="story-giant-num-strip"
                    animate={{ y: `-${active * (100 / 3)}%` }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {chapters.map((item) => (
                      <span key={item.num}>{item.num}</span>
                    ))}
                  </m.div>
                </div>
              </div>

              <div className="story-stage-copy">
                <AnimatePresence mode="popLayout">
                  <m.div
                    key={activeChapter.name}
                    className="story-chapter-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="eyebrow">{activeChapter.code}</p>
                    <div className="display story-heading">
                      {activeChapter.lines.map((line, idx) => (
                        <span key={line} className="reveal-mask block overflow-clip">
                          <m.span
                            className="block origin-bottom-left"
                            initial={{ y: "110%", rotate: 3 }}
                            animate={{ y: 0, rotate: 0 }}
                            exit={{ y: "-105%", rotate: -2 }}
                            transition={{
                              duration: 0.75,
                              ease: [0.16, 1, 0.3, 1],
                              delay: idx * 0.08,
                            }}
                          >
                            {line}
                          </m.span>
                        </span>
                      ))}
                    </div>
                    <m.p
                      className="chapter-detail"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {activeChapter.detail}
                    </m.p>
                  </m.div>
                </AnimatePresence>
              </div>

              <div className="story-stage-visual">
                <div className="chapter-watermark">
                  <Asterisk />
                </div>
                <AnimatePresence mode="popLayout">
                  <m.div
                    key={activeChapter.product.id}
                    className="story-cap-wrap"
                    initial={{ opacity: 0, rotate: -14, scale: 0.86, y: 24 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                    exit={{ opacity: 0, rotate: 12, scale: 0.9, y: -24 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CapImage product={activeChapter.product} loading="lazy" />
                    <span className="story-cap-label eyebrow">
                      [ {activeChapter.product.name} / {activeChapter.product.color} ]
                    </span>
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <button className="product-button" type="button" aria-haspopup="dialog" aria-label={`View ${product.name}, $40`} onClick={() => open(product)} onPointerMove={tilt} onPointerLeave={reset}>
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
              <form method="dialog"><button className="dialog-back" type="submit">Back to the drop <Icon kind="right" size={17} /></button></form>
            </div>
            <form method="dialog"><button className="dialog-close" type="submit" autoFocus aria-label="Close product"><Icon kind="close" /></button></form>
          </div>
        )}
      </dialog>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div>
          <p className="eyebrow">[ ASTRA / DROP 001 ]</p>
          <RevealLines lines={["WEAR IT", "OUT."]} as="h2" className="display" />
        </div>
        <MagneticLink href="#drop">Explore the caps</MagneticLink>
        <Asterisk className="footer-mark" />
      </div>
      <div className="footer-bar">
        <a className="wordmark" href="/" aria-label="ASTRA home"><Asterisk />ASTRA</a>
        <a className="instagram" href="#">@astra.caps <Icon size={16} /></a>
        <span>[ Concept by The Dot — thedotco.in ]</span>
      </div>
    </footer>
  );
}

export function Experience() {
  return (
    <LazyMotion features={domAnimation}>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Marquee />
        <Story />
        <ProductRail />
      </main>
      <Footer />
    </LazyMotion>
  );
}
