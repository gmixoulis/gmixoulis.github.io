import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const S = process.argv[2]; const marks = process.argv.slice(3).map(Number);
fs.mkdirSync(S, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-first-run','--window-size=900,635'] });
const page = await browser.newPage(); await page.setViewport({ width: 900, height: 635 });
await page.goto('http://localhost:4321/play/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await new Promise(r => setTimeout(r, 4000)); await page.mouse.click(500, 400);
// simulate real play: hold ArrowRight (patches use hold-to-move via scrollBy per frame)
await page.keyboard.down('ArrowRight');
const out = [];
for (const m of marks) {
  for (let guard = 0; guard < 4000; guard++) {
    const y = await page.evaluate(() => scrollY);
    if (y >= m) break;
    await new Promise(r => setTimeout(r, 30));
  }
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 900));
  const y = await page.evaluate(() => scrollY);
  await page.screenshot({ path: `${S}/w${m}.png` }); out.push(`${m}->${y}`);
  await page.keyboard.down('ArrowRight');
}
await page.keyboard.up('ArrowRight');
console.log(JSON.stringify(out)); await browser.close();
