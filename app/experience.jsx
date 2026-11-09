"use client";

import { useEffect, useRef, useState } from "react";


const products = [
  { id: "integrity", name: "Integrity", color: "Washed black", alt: "Black cap with ivory Integrity embroidery", tone: "black", detail: "Washed black with quiet ivory embroidery. The cap you leave by the door." },
  { id: "only-pans", name: "Only Pans", color: "Bone", alt: "Bone cap with dark Only Pans embroidery", tone: "bone", detail: "Bone cotton with a skillet stitch. A small joke for people paying attention." },
  { id: "classic-blue", name: "Classic Blue", color: "Royal blue", alt: "Royal blue cap with an ivory raccoon emblem", tone: "blue", detail: "A clean hit of royal blue with the raccoon mark up front." },
];

const chapters = [
  { name: "Scrappy", code: "01 / INSTINCT", lines: ["MAKE DO.", "MAKE IT YOURS."], detail: "The trash panda works with what’s around. It gets a little roughed up and figures it out anyway." },
  { name: "Street-smart", code: "02 / TERRITORY", lines: ["KNOW THE", "BACK WAY."], detail: "Back alleys, late walks, a shortcut that becomes the long way home. That’s where the good stuff happens." },
  { name: "Unbothered", code: "03 / ATTITUDE", lines: ["KEEP IT ON.", "KEEP MOVING."], detail: "The raccoon never needed an audience. Put on the cap you reach for every day and get on with yours." },
];

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

function Raccoon({ className }) {
  return (
    <svg className={className} viewBox="0 0 128 102" fill="none" aria-hidden="true">
      <path d="M11 37 13 7l31 12 20-5 20 5 31-12 2 30 10 16-14 24-29 9-20 14-20-14-29-9L1 53z" fill="currentColor" />
      <path d="m23 30 1-12 15 7zm82 0-1-12-15 7zM9 51l20-15 26 8 9 15 9-15 26-8 20 15-13 17-28 5-14-9-14 9-28-5z" fill="#141411" />
      <path d="m29 49 19 3 4 8-16-2zm70 0-19 3-4 8 16-2z" fill="currentColor" />
      <path d="M57 76h14l-7 7z" fill="#141411" />
    </svg>
  );
}

function CapImage({ product, hero, ...props }) {
  const image = <img src={`/caps/${product.id}.webp`} alt={product.alt} width="1000" height="650" draggable="false" {...props} />;
  return hero ? <picture><source media="(max-width: 620px)" srcSet="/caps/integrity-mobile.webp" />{image}</picture> : image;
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
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (min-width: 800px) and (prefers-reduced-motion: no-preference)").matches) return;
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
  const [replay, setReplay] = useState(0);

  return (
    <section className={`hero ${pitch ? "hero-pitch" : ""}`} aria-labelledby="hero-heading">
      <div key={replay} className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker"><span className="signal" /> DROP 001 <span className="slash">/</span> EVERYDAY CAPS</p>
          <h1 id="hero-heading" className="hero-title">
            <span className="headline-mask"><span>LESS NOISE.</span></span>
            <span className="headline-mask accent"><span>MORE YOU.</span></span>
          </h1>
          <p className="hero-description">Three everyday caps inspired by a city survivor. Pick the one you’ll wear out.</p>
          <div className="hero-cta">
            <MagneticLink href={pitch ? "/#drop" : "#drop"}>Shop the drop</MagneticLink>
            <span className="hero-price">$40 EACH</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-grid" aria-hidden="true" />
          <span className="art-label"><span>FIG. 01</span> / INTEGRITY</span>
          <span className="art-corner" aria-hidden="true">+</span>
          <span className="art-big" aria-hidden="true">01</span>
          <div className="art-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="cap-shadow" aria-hidden="true" />
          <div className="cap-parallax">
            <div className="cap-drop"><CapImage hero product={products[0]} className="hero-cap" fetchPriority="high" /></div>
          </div>
          <div className="raccoon-stamp" aria-hidden="true"><Raccoon /><span>AFTER DARK</span></div>
          <span className="asset-label">PLACEHOLDER RENDER</span>
          <span className="art-index" aria-hidden="true">[ 001–003 ]</span>
        </div>
      </div>
      <div className="hero-strip">
        <span><Asterisk /> MADE TO BE WORN.</span>
        {pitch ? <span className="strip-middle">12 SEC / PITCH CUT</span> : <a href="#story" className="strip-middle">SCROLL TO EXPLORE <Icon kind="down" size={14} /></a>}
        <button type="button" onClick={() => setReplay((value) => value + 1)} aria-label="Replay hero"><Icon kind="replay" size={15} /> REPLAY INTRO</button>
      </div>
    </section>
  );
}

function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="marquee" aria-label="Made to be worn">
      <div className={`marquee-track ${paused ? "paused" : ""}`} aria-hidden="true">
        {[0, 1].map((group) => (
          <div className="marquee-group" key={group}>
            {[0, 1, 2, 3].map((item) => <span key={item}>MADE TO BE WORN <Asterisk /></span>)}
          </div>
        ))}
      </div>
      <button type="button" className="marquee-pause" onClick={() => setPaused(!paused)} aria-label={paused ? "Play marquee" : "Pause marquee"}>{paused ? "▶" : "Ⅱ"}</button>
    </section>
  );
}

function Story() {
  const storyRef = useRef(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        import("framer-motion/dom/mini").then(({ animate }) => {
          if (!entry.target.isConnected || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const desktop = matchMedia("(min-width: 800px)").matches;
          entry.target.querySelectorAll(".chapter-mask > span").forEach((line, index) => {
            const keyframes = desktop ? { transform: ["translateY(64%)", "translateY(0)"], opacity: [0.45, 1] } : { opacity: [0.55, 1] };
            animate(line, keyframes, { duration: desktop ? 0.55 : 0.28, delay: index * 0.11, ease: [0.19, 1, 0.22, 1] });
          });
        }).catch(() => {});
      }
    }, { threshold: 0.55 });
    storyRef.current.querySelectorAll("h2").forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={storyRef} id="story" className="story" aria-label="The trash panda story">
      {chapters.map((chapter, index) => (
        <article key={chapter.name} className={`chapter chapter-${index + 1}`}>
          <div className="chapter-stage">
            <div className="chapter-frame">
              <div className="chapter-side">
                <span className="eyebrow"><span className="signal" /> FIELD NOTES</span>
                <ol className="chapter-steps" aria-label="Chapters">
                  {chapters.map((item, step) => <li key={item.name} aria-current={step === index ? "step" : undefined}><span>0{step + 1}</span> {item.name}</li>)}
                </ol>
                <span className="chapter-index">0{index + 1} / 03</span>
              </div>
              <div className="chapter-content">
                <div className="chapter-watermark" aria-hidden="true"><Raccoon /></div>
                <div className="chapter-text">
                  <p className="eyebrow">{chapter.code}</p>
                  <h2 className="display">
                    {chapter.lines.map((line) => (
                      <span key={line} className="chapter-mask">
                        <span>{line}</span>
                      </span>
                    ))}
                  </h2>
                  <p className="chapter-detail">{chapter.detail}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function ProductCard({ product, index, open }) {
  function tilt(event) {
    if (event.pointerType !== "mouse" || !matchMedia("(hover: hover) and (min-width: 800px) and (prefers-reduced-motion: no-preference)").matches) return;
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
          <span className="product-number">0{index + 1} / 03</span>
          <div className="product-tilt"><CapImage product={product} loading="lazy" /></div>
          <span className="asset-label">PLACEHOLDER RENDER</span>
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
        <div><p className="eyebrow"><span className="signal" /> THE FIRST RELEASE</p><h2 className="display">DROP 001<span>.</span></h2></div>
        <p className="drop-summary">Three caps. <strong>$40 each.</strong></p>
      </div>
      <ul className="product-grid">
        {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} open={setActive} />)}
      </ul>
      <dialog ref={dialogRef} className="product-dialog" aria-labelledby="product-title" onClose={() => setActive(null)} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        {active && (
          <div className="product-dialog-inner">
            <div className={`dialog-image tone-${active.tone}`}><CapImage product={active} /><span className="asset-label">PLACEHOLDER RENDER</span></div>
            <div className="dialog-copy">
              <p className="eyebrow">DROP 001 / {active.color}</p>
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
        <div><p className="eyebrow"><span className="signal" /> ASTRA / DROP 001</p><h2 className="display">MADE TO<br />BE WORN<span>.</span></h2></div>
        <MagneticLink href="#drop">Explore the caps</MagneticLink>
        <Raccoon className="footer-raccoon" />
      </div>
      <div className="footer-bar">
        <a className="wordmark" href="/" aria-label="ASTRA home"><Asterisk />ASTRA</a>
        <a className="instagram" href="https://www.instagram.com/trshpnda.streetwear/" target="_blank" rel="noreferrer">@trshpnda.streetwear <Icon size={16} /></a>
        <span>ASTRA / CONCEPT PREVIEW</span>
      </div>
    </footer>
  );
}

export function Experience() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Story />
        <ProductRail />
        <Marquee />
      </main>
      <Footer />
    </>
  );
}
