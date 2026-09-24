import puppeteer from 'puppeteer-core'; import fs from 'node:fs'; import path from 'node:path';
const S = path.resolve(process.argv[2]); const W = +(process.argv[3]||1000), H = +(process.argv[4]||600); const FROM = +(process.argv[5]||0), TO = +(process.argv[6]||1e9), TAG = process.argv[7]||"loop"; const dir = `${S}/${TAG}`; fs.mkdirSync(dir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage(); await page.setViewport({ width: W, height: H });
const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0,160))); page.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,160)); });
await page.goto('http://localhost:4321/play/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await new Promise(r => setTimeout(r, 3500)); await page.mouse.click(500, 400);
const frames = []; let i = 0, last = -1, still = 0;
await page.keyboard.down('ArrowRight');
while (i < 400) {
  await new Promise(r => setTimeout(r, 450));
  const y = await page.evaluate(() => scrollY);
  if (y >= FROM) { const p = `${dir}/L${String(i).padStart(3,"0")}_${y}.png`; await page.screenshot({ path: p }); frames.push(p); } i++; if (y > TO) break;
  if (Math.abs(y - last) < 2) { still++; if (still >= 9) break; } else still = 0; last = y;
}
await page.keyboard.up('ArrowRight');
// contact sheets: 3 x 4 frames per sheet
const per = 12, cols = 3, tw = 600, th = Math.round(600 * H / W); const sheets = [];
for (let s = 0; s * per < frames.length; s++) {
  const chunk = frames.slice(s * per, (s + 1) * per);
  const html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:4px;width:${cols*tw+8}px">` + chunk.map(f => `<div style="position:relative"><img src="file://${f}" width="${tw}" height="${th}" style="display:block"><span style="position:absolute;left:4px;top:4px;background:#000c;color:#fff;font:bold 18px monospace;padding:2px 6px">${f.split('/').pop().replace('.png','')}</span></div>`).join('') + '</body>';
  const hp = `${dir}/sheet${s}.html`; fs.writeFileSync(hp, html);
  const sp = await browser.newPage(); await sp.setViewport({ width: cols * tw + 8, height: Math.ceil(chunk.length / cols) * (th + 4) }); await sp.goto('file://' + hp); await new Promise(r => setTimeout(r, 400));
  const out = `${dir}/sheet${s}.png`; await sp.screenshot({ path: out, fullPage: true }); sheets.push(out); await sp.close();
}
console.log(JSON.stringify({ frames: frames.length, lastScroll: last, sheets: sheets.length, errors: errs.slice(0, 5) }));
await browser.close();
