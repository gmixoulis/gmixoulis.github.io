// Usage: [SETTLE=ms FRAME=ms] node check.cjs <slug>
// Loads public/drafts/ideas/<slug>.html via file:// (WebGL via SwiftShader), checks overflow / h1 /
// broken images / console errors at desktop-light, desktop-dark, mobile-light, and writes scroll-frame
// contact sheets to $TMPDIR-independent scratch: ~/.cache/ideas-qa/<slug>-<mode>.png
const puppeteer = require('/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/node_modules/puppeteer-core');
const { execFileSync } = require('child_process');
const path = require('path'); const fs = require('fs'); const os = require('os');
const slug = process.argv[2];
const file = `/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/public/drafts/ideas/${slug}.html`;
const QA = path.join(os.homedir(), '.cache', 'ideas-qa'); fs.mkdirSync(QA, { recursive: true });
(async () => {
  if (!fs.existsSync(file)) { console.log('MISSING', file); process.exit(1); }
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
    args: ['--hide-scrollbars', '--allow-file-access-from-files', '--ignore-gpu-blocklist', '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const report = {};
  for (const [mode, w, h, scheme] of [['desktop-light', 1440, 900, 'light'], ['desktop-dark', 1440, 900, 'dark'], ['mobile-light', 390, 844, 'light']]) {
    const p = await b.newPage(); const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('requestfailed', r => errors.push('failed: ' + r.url().slice(-80)));
    await p.setViewport({ width: w, height: h });
    await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
    await p.goto('file://' + file, { waitUntil: 'load', timeout: 240000 });
    await p.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, +(process.env.SETTLE || 900)));
    const frames = []; let y = 0, i = 0;
    while (i < 12) {
      await p.evaluate(v => scrollTo(0, v), y); await new Promise(r => setTimeout(r, +(process.env.FRAME || 450)));
      const f = path.join(QA, `${slug}-${mode}-${String(i).padStart(2, '0')}.png`); await p.screenshot({ path: f }); frames.push(f); i++;
      const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      if (y >= max) break; y = Math.min(y + Math.round(h * 0.85), max);
    }
    report[mode] = await p.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      h1: document.querySelectorAll('h1').length,
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
      imgsNoAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
      height: document.documentElement.scrollHeight,
    }));
    report[mode].errors = errors; report[mode].frames = frames.length;
    const cols = w > 800 ? 3 : 6;
    execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs=sys.argv[2:]; cols=int(sys.argv[1]); ims=[Image.open(f).convert('RGB') for f in fs]
sc=0.4 if ims[0].width>800 else 0.6; w,h=int(ims[0].width*sc),int(ims[0].height*sc); rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(cols*w+(cols+1)*8,rows*h+(rows+1)*8),(120,120,120))
for k,im in enumerate(ims): s.paste(im.resize((w,h)),(8+(k%cols)*(w+8),8+(k//cols)*(h+8)))
s.save('${path.join(QA, slug + '-' + mode + '.png')}')`, String(cols), ...frames]);
    await p.close();
  }
  await b.close();
  console.log(JSON.stringify(report, null, 1));
  console.log('Contact sheets:', ['desktop-light', 'desktop-dark', 'mobile-light'].map(m => path.join(QA, `${slug}-${m}.png`)).join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
