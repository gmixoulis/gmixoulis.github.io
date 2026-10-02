// Usage: [THEME=dark|light] [VP=1440x900] [STEPS=60] [SETTLE=ms] [UP=1] [REDUCED=1] [OUT=dir] node legibility.cjs <url>
// Measures text contrast against the real pixels behind it (the WebGL stage included) at STEPS even scroll stops.
// At each stop: a normal screenshot (saved to OUT as a frame, then a 6-per-row contact sheet), then one with all
// text made transparent. For every visible text element, the background is the pixels under its line boxes; the
// contrast is taken against the 5th and the 95th luminance percentile (whichever is worse) and must be >= 4.5:1,
// or >= 3:1 for large text (24px, or 18.66px bold). A failure is re-measured with the canvas hidden: if it fails
// without the stage too, it's listed as pre-existing (not the stage's doing). Exits 1 on any stage-caused failure;
// always prints the worst 5 of the rest. Page errors fail the run too. Also reports, per stop, the share of the
// screen where the stage is visible (see stageVisiblePct).
const puppeteer = require('puppeteer-core');
const zlib = require('zlib'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const url = process.argv[2];
if (!url) { console.error('usage: legibility.cjs <url>'); process.exit(2); }
const [W, H] = (process.env.VP || '1440x900').split('x').map(Number), STEPS = +(process.env.STEPS || 60);
const SETTLE = +(process.env.SETTLE || 2200), OUT = process.env.OUT, THEME = process.env.THEME || 'dark';

/* Chrome's PNG screenshots: 8-bit RGB(A), not interlaced */
function png(buf) {
  let p = 8, w = 0, h = 0, bpp = 4; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); bpp = d[9] === 6 ? 4 : 3; } else if (type === 'IDAT') idat.push(d);
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat)), st = w * bpp, px = Buffer.alloc(h * st);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (st + 1)], s = y * (st + 1) + 1, o = y * st;
    for (let x = 0; x < st; x++) {
      const a = x >= bpp ? px[o + x - bpp] : 0, b = y ? px[o + x - st] : 0, c = x >= bpp && y ? px[o + x - st - bpp] : 0;
      let v = raw[s + x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[o + x] = v & 255;
    }
  }
  return { w, h, bpp, px };
}
const lin = (c) => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/* in the page: every visible text element, its line boxes (clipped to the viewport, below a fixed header) and colours */
function collect() {
  const navB = (() => { const n = document.querySelector('header .nav, .nav'); return n && getComputedStyle(n).position === 'fixed' ? n.getBoundingClientRect().bottom : 0; })();
  const shown = (el) => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.99) return false; } return true; };
  const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const map = new Map(), tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    const el = n.parentElement;
    if (!n.data.trim() || !el || el.closest('svg,script,style,noscript,dialog:not([open]),.sr')) continue;
    const top = el.closest('header') ? 0 : navB, r = document.createRange(); r.selectNodeContents(n);
    const rs = [...r.getClientRects()].map((q) => [Math.max(0, q.left), Math.max(top, q.top), Math.min(innerWidth, q.right), Math.min(innerHeight, q.bottom)])
      .filter(([l, t, rr, b]) => rr - l > 2 && b - t > 2);
    if (rs.length) (map.get(el) || map.set(el, []).get(el)).push(...rs);
  }
  /* text in ::before/::after (e.g. the "prev" labels between roles): the pseudo box from its computed position */
  for (const el of document.querySelectorAll('main *')) for (const ps of ['::before', '::after']) {
    const cs = getComputedStyle(el, ps), txt = /^"(.*)"$/.exec(cs.content);
    if (!txt || !txt[1].trim() || cs.display === 'none' || cs.position !== 'absolute') continue;
    const pr = el.getBoundingClientRect(), w = parseFloat(cs.width), h = parseFloat(cs.height);
    const l = pr.left + (cs.left !== 'auto' ? parseFloat(cs.left) : pr.width - parseFloat(cs.right) - w);
    const t = cs.top !== 'auto' ? pr.top + parseFloat(cs.top) : pr.bottom - parseFloat(cs.bottom) - h;
    const q = [Math.max(0, l), Math.max(navB, t), Math.min(innerWidth, l + w), Math.min(innerHeight, t + h)];
    if (q[2] - q[0] > 2 && q[3] - q[1] > 2 && shown(el)) map.set({ pel: el, ps, cs, txt: txt[1] }, [q]);
  }
  const out = [];
  for (const [k, rects] of map) {
    const el = k.pel || k, cs = k.cs || getComputedStyle(el);
    if (!k.pel && !shown(el)) continue;
    let colors = [rgb(cs.color)];
    if (colors[0].length > 3 && colors[0][3] === 0) {
      let g = el; while (g && !/text/.test(getComputedStyle(g).backgroundClip + getComputedStyle(g).webkitBackgroundClip)) g = g.parentElement;
      if (!g) continue;
      g.setAttribute('data-lgclip', '');
      colors = (getComputedStyle(g).backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(rgb);
    }
    const fs = parseFloat(cs.fontSize), fw = +cs.fontWeight;
    const name = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].join('.') : '') + (k.ps || '');
    out.push({ name, text: (k.txt || el.textContent).trim().replace(/\s+/g, ' ').slice(0, 44), colors, large: fs >= 24 || (fs >= 18.66 && fw >= 700), rects });
  }
  return out;
}
const HIDE = `*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}[data-lgclip]{visibility:hidden!important}`;

(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
    args: ['--hide-scrollbars', '--ignore-gpu-blocklist', '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage(), errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.setViewport({ width: W, height: H });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: THEME }, { name: 'prefers-reduced-motion', value: process.env.REDUCED ? 'reduce' : 'no-preference' }]);
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 3500));
  const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let stops = Array.from({ length: STEPS }, (_, i) => Math.round((max * i) / (STEPS - 1)));
  if (process.env.UP) stops = stops.reverse();
  if (OUT) fs.mkdirSync(OUT, { recursive: true });
  const all = [], fails = [], pre = [], frames = [], visible = [];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const raf2 = () => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  for (let i = 0; i < stops.length; i++) {
    await p.evaluate((y) => scrollTo(0, y), stops[i]);
    await sleep(i ? SETTLE : SETTLE * 2);
    const shot = await p.screenshot();
    if (OUT) { const f = path.join(OUT, `f${String(i).padStart(2, '0')}.png`); fs.writeFileSync(f, shot); frames.push(f); }
    const els = await p.evaluate(collect);
    await p.evaluate((css) => { const s = new CSSStyleSheet(); s.replaceSync(css); document.adoptedStyleSheets = [...document.adoptedStyleSheets, s]; }, HIDE);
    await raf2();
    const bg = png(Buffer.from(await p.screenshot()));
    const measure = (img, e) => {
      const L = [];
      for (const [l, t, r, bt] of e.rects) for (let y = Math.floor(t); y < Math.ceil(bt) && y < img.h; y++) for (let x = Math.floor(l); x < Math.ceil(r) && x < img.w; x++) {
        const o = (y * img.w + x) * img.bpp; L.push(lum(img.px[o], img.px[o + 1], img.px[o + 2]));
      }
      if (!L.length) return null;
      L.sort((a, c) => a - c);
      const p5 = L[Math.floor(L.length * 0.05)], p95 = L[Math.min(L.length - 1, Math.floor(L.length * 0.95))];
      return Math.min(...e.colors.map(([r, g, bl]) => { const t = lum(r, g, bl); return Math.min(ratio(t, p5), ratio(t, p95)); }));
    };
    const bad = [];
    for (const e of els) {
      const cr = measure(bg, e); if (cr === null) continue;
      const rec = { stop: i, y: stops[i], el: e.name, text: e.text, ratio: +cr.toFixed(2), need: e.large ? 3 : 4.5 };
      all.push(rec); if (cr < rec.need) bad.push([e, rec]);
    }
    /* the same frame with the canvas hidden: how much of the screen the stage shows (pixels it changes by >= 6/255
       in luma), and whether a failure is the stage's doing: one that stays (within 10%) without it is listed as
       pre-existing and doesn't fail the run */
    await p.evaluate(() => { const s = new CSSStyleSheet(); s.replaceSync('#gl{visibility:hidden!important}'); document.adoptedStyleSheets = [...document.adoptedStyleSheets, s]; });
    await raf2();
    const nogl = png(Buffer.from(await p.screenshot()));
    await p.evaluate(() => { document.adoptedStyleSheets = document.adoptedStyleSheets.slice(0, -1); });
    let seen = 0;
    for (let o = 0; o < bg.px.length; o += bg.bpp) {
      const y1 = 0.2126 * bg.px[o] + 0.7152 * bg.px[o + 1] + 0.0722 * bg.px[o + 2], y0 = 0.2126 * nogl.px[o] + 0.7152 * nogl.px[o + 1] + 0.0722 * nogl.px[o + 2];
      if (Math.abs(y1 - y0) >= 6) seen++;
    }
    const stage = +((100 * seen) / (bg.w * bg.h)).toFixed(2); visible.push(stage);
    for (const [e, rec] of bad) { const c0 = measure(nogl, e); (c0 !== null && c0 < rec.need && rec.ratio > c0 * 0.9 ? pre : fails).push({ ...rec, withoutStage: c0 && +c0.toFixed(2) }); }
    await p.evaluate(() => { document.adoptedStyleSheets = document.adoptedStyleSheets.slice(0, -1); document.querySelectorAll('[data-lgclip]').forEach((e) => e.removeAttribute('data-lgclip')); });
    process.stdout.write(`stop ${i} y=${stops[i]} stage=${visible[i]}% elements=${els.length} fails=${fails.filter((f) => f.stop === i).length} preexisting=${pre.filter((f) => f.stop === i).length}\n`);
  }
  await b.close();
  if (OUT && frames.length) {
    const sheet = path.join(OUT, '..', path.basename(OUT) + '-sheet.png');
    execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs=sys.argv[1:]; ims=[Image.open(f).convert('RGB') for f in fs]; cols=6
sc=0.2 if ims[0].width>800 else 0.4; w,h=int(ims[0].width*sc),int(ims[0].height*sc); rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(cols*w+(cols+1)*6,rows*h+(rows+1)*6),(120,120,120))
for k,im in enumerate(ims): s.paste(im.resize((w,h)),(6+(k%cols)*(w+6),6+(k//cols)*(h+6)))
s.save('${sheet}')`, ...frames]);
    console.log('sheet:', sheet);
  }
  const worst = [...all].filter((r) => !pre.some((q) => q.stop === r.stop && q.el === r.el && q.text === r.text)).sort((a, c) => a.ratio / a.need - c.ratio / c.need).slice(0, 5);
  console.log(JSON.stringify({ url, theme: THEME, vp: `${W}x${H}`, up: !!process.env.UP, reduced: !!process.env.REDUCED, measured: all.length, errors, stageVisiblePct: { min: Math.min(...visible), perStop: visible }, failures: fails.length, worst5: worst, fails: fails.slice(0, 40), preexisting: pre }, null, 1));
  process.exit(fails.length || errors.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
