import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
await page.goto('http://localhost:4321/play/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await new Promise(r => setTimeout(r, 3500));
const res = await page.evaluate(() => {
  const layer = document.getElementById('layer-horizontal-3'); const L = layer.getBoundingClientRect();
  const items = [];
  for (const e of layer.querySelectorAll('*')) { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); if (r.width < 8 || r.height < 8 || cs.display === 'none' || cs.visibility === 'hidden') continue; if (r.width > 6000) continue; // skip ground/sea-floor spanning layers
    const hasBg = cs.backgroundImage !== 'none' || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'); const hasText = e.childElementCount === 0 && e.textContent.trim().length > 0;
    if (!hasBg && !hasText && e.tagName !== 'IMG') continue;
    items.push({ id: e.id || e.className.split(' ')[0], x: Math.round(r.left - L.left), w: Math.round(r.width), y: Math.round(r.top - L.top), h: Math.round(r.height) }); }
  items.sort((a, b) => a.x - b.x);
  // merge coverage on x
  const iv = []; for (const it of items) { if (it.w > 3000) continue; const s = it.x, e = it.x + it.w; if (iv.length && s <= iv[iv.length - 1][1] + 40) iv[iv.length - 1][1] = Math.max(iv[iv.length - 1][1], e); else iv.push([s, e]); }
  const gaps = []; for (let i = 1; i < iv.length; i++) { const g = iv[i][0] - iv[i - 1][1]; if (g >= 350) gaps.push({ from: iv[i - 1][1], to: iv[i][0], gap: g, before: items.filter(t => t.x + t.w <= iv[i - 1][1] + 1 && t.x + t.w >= iv[i - 1][1] - 300).map(t => t.id).slice(-3), after: items.filter(t => t.x >= iv[i][0] - 1 && t.x <= iv[i][0] + 300).map(t => t.id).slice(0, 3) }); }
  return { layerW: Math.round(L.width), count: items.length, gaps, wide: items.filter(t => t.w > 3000).map(t => `${t.id}@${t.x}+${t.w}`) };
});
console.log(JSON.stringify(res, null, 1)); await browser.close();
