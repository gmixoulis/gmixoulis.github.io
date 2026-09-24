import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
await page.goto('http://localhost:4321/play/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await new Promise(r => setTimeout(r, 3500));
console.log(JSON.stringify(await page.evaluate(() => {
  const st = document.getElementById('container').getBoundingClientRect();
  return { stageH: Math.round(st.height), pageH: document.documentElement.scrollHeight, plates: [...document.querySelectorAll('.experience-text-container')].map(p => { const r = p.getBoundingClientRect(); const t = p.querySelector('.experience-text-b'); const rb = p.querySelector('.ribbon-container').getBoundingClientRect(); return { id: p.id, plateTopFromStageTop: Math.round(r.top - st.top), plateH: Math.round(r.height), titleLines: Math.round(t.offsetHeight / 38), ribbonTopFromStageTop: Math.round(rb.top - st.top), ribbonW: Math.round(rb.width) }; }) };
})));
await browser.close();
