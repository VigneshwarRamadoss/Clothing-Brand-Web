import { chromium } from "playwright-core";
import fs from "fs";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--hide-scrollbars"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: "/tmp/shot/vid", size: { width: 1440, height: 900 } } });
const p = await ctx.newPage();
const t0 = Date.now();
await p.goto("http://127.0.0.1:4175/", { waitUntil: "networkidle" });
await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
const top = await p.evaluate(() => document.querySelector(".pf").getBoundingClientRect().top + scrollY);
const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
await p.evaluate((y) => scrollTo(0, y), top - 900 + 60);  // start: footer just peeking in
await p.waitForTimeout(700);
const start = (Date.now() - t0) / 1000 - 0.3;
await p.mouse.move(720, 450);
// slow scroll down through the footer (~5.5s), eased
const fH = await p.evaluate(() => document.querySelector(".pf").offsetHeight);
const yEnd = H; // footer ends the page: scroll to the very bottom
const y0 = top - 840, steps = 100;
for (let i = 1; i <= steps; i++) { const t = i / steps, e = t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; await p.evaluate((y) => scrollTo(0, y), y0 + (yEnd - y0) * e); await p.waitForTimeout(50); }
await p.waitForTimeout(600);
// cursor over the cap: locate cap centre in viewport
// slow mouse pass across the info layer (faint light on dark paint)
const ib = await p.locator(".pf-content").boundingBox();
for (const [fx, fy] of [[.12, .3], [.5, .2], [.86, .45], [.55, .62]]) { await p.mouse.move(ib.x + ib.width * fx, ib.y + ib.height * fy, { steps: 34 }); await p.waitForTimeout(120); }
for (const name of ["Nightshift", "Instagram"]) {
  const l = p.locator(".pf-link", { hasText: name }).first(); const bb = await l.boundingBox();
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 18 }); await p.waitForTimeout(650);
}
const cta = await p.locator(".pf-cta").boundingBox();
await p.mouse.move(cta.x + cta.width / 2, cta.y + cta.height / 2, { steps: 18 }); await p.waitForTimeout(1400);
const end = (Date.now() - t0) / 1000;
const v = p.video(); await ctx.close(); const path = await v.path(); await b.close();
fs.writeFileSync("/tmp/shot/vid/meta.json", JSON.stringify({ path, start, end }));
console.log(path, start, end);
