import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const [tag = 'trace', from = '0', to = '99999', width = '1000', height = '600'] = process.argv.slice(2);
const dir = path.resolve('scripts/play-qa/out', tag);
fs.mkdirSync(dir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: +width, height: +height });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:4321/play/', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.flags?.preloadShiftUpDone && window.scrollState?.canScrollOrSwipe);
  await new Promise(r => setTimeout(r, 1400));
  await page.evaluate(() => {
    window.qaFrames = [];
    window.qaCalls = [];
    for (const name of ['shiftAleToGroundLevel', 'shiftAleToSeaFloor', 'aleHandsUp']) {
      const original = window[name];
      window[name] = function (...args) { qaCalls.push({ name, y: scrollY, t: performance.now() }); return original.apply(this, args); };
    }
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    };
    function sample(t) {
      const a = document.getElementById('ale-container'), rocket = document.getElementById('rocket');
      qaFrames.push({ t, y: scrollY, movement: scrollState.layersMovement, canMove: scrollState.canScrollOrSwipe,
        swimming: ale.isSwimming, jumping: ale.isJumping, falling: ale.isFalling,
        frame: -parseFloat(aleFramesDiv.style.left || '0') / 200,
        row: -parseFloat(aleFramesDiv.style.top || '0') / 200,
        ale: rect(a), inner: rect(aleDiv), ladder: rect(document.querySelector('.ladder')),
        layerTop: document.getElementById('layer-horizontal-3').offsetTop,
        rocket: rect(rocket), seated: a.classList.contains('in-rocket'), boarding: a.classList.contains('boarding'), flying: rocket.classList.contains('flying'),
        glassClip: getComputedStyle(a).clipPath, headClip: getComputedStyle(aleDiv).clipPath,
        flameOpacity: +getComputedStyle(document.getElementById('rocket-flame')).opacity,
        plates: [...document.querySelectorAll('.experience-text-container')].map(el => ({ ...rect(el), ribbon: rect(el.querySelector('.ribbon-container')) })),
        links: rect(document.getElementById('links-container')), contact: rect(document.getElementById('contact-box')), button: rect(document.getElementById('contact-button')) });
      window.qaRaf = requestAnimationFrame(sample);
    }
    qaRaf = requestAnimationFrame(sample);
  });
  await page.keyboard.down('ArrowRight');
  let still = 0, previous = -1, i = 0;
  const started = Date.now();
  while (Date.now() - started < 100000) {
    await new Promise(r => setTimeout(r, 90));
    const y = await page.evaluate(() => scrollY);
    if (y >= +from && y <= +to) await page.screenshot({ path: path.join(dir, `f${String(i++).padStart(4, '0')}_${y}.png`) });
    still = Math.abs(y - previous) < 1 ? still + 1 : 0;
    previous = y;
    if (y > +to || still > 35) break;
  }
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 1000));
  const trace = await page.evaluate(async () => {
    cancelAnimationFrame(qaRaf);
    const layer = document.getElementById('layer-horizontal-3');
    const origin = layer.getBoundingClientRect().left;
    const selectors = '#splash-container, #gate-1, #gate-2, #gate-3, #gate-4, #title-about, #plants-container, .elevation, .building, #title-skills, .algae-a, .algae-b, .coral, .coral-big, .skill-measurement, #fish-text-container, #crab-text-container, #turtle-text-container, .ladder, #xray-machine, #title-experience, .experience-text-container, #robot, #squid, #alien, #control-tower, #launch-ramp, .education-text-container, #education-station';
    const features = [...layer.querySelectorAll(selectors + ', .fish, .crab, .turtle, .skill-measurement-header')].map(el => {
      const r = el.getBoundingClientRect();
      return { id: el.id || el.className, start: r.left - origin, end: r.right - origin, width: r.width };
    }).filter(f => f.width > 0).sort((a, b) => a.start - b.start);
    const img = new Image();
    img.src = '/play/image/layers/rocket-sprite.png';
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
    const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
    const rocket = document.getElementById('rocket').getBoundingClientRect();
    const ribbon = [...document.querySelectorAll('#links-top, #links-middle, #links-bottom')].map(el => el.getBoundingClientRect());
    let ribbonRocketPixels = 0;
    for (let y = 0; y < 464; y++) for (let x = 0; x < 338; x++) {
      if (pixels[((y + 470) * img.width + x) * 4 + 3] < 128) continue;
      if (ribbon.some(r => rocket.x + x >= r.left && rocket.x + x < r.right && rocket.y + y >= r.top && rocket.y + y < r.bottom)) ribbonRocketPixels++;
    }
    return { frames: qaFrames, calls: qaCalls, features, worldWidth: layer.offsetWidth, ribbonRocketPixels };
  });
  fs.writeFileSync(path.join(dir, 'trace.json'), JSON.stringify({ ...trace, errors }));
  const paused = trace.frames.filter(f => !f.canMove);
  console.log(JSON.stringify({ dir, screenshots: i, frames: trace.frames.length, lastScroll: previous, errors, calls: trace.calls,
    paused: paused.length ? { ms: paused.at(-1).t - paused[0].t, y: [paused[0].y, paused.at(-1).y], frames: [...new Set(paused.map(f => f.frame))] } : null }));
} finally { await browser.close(); }
