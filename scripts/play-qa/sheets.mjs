import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = path.resolve(process.argv[2]);
const files = fs.readdirSync(dir).filter(f => /^[fwL].*\.png$/.test(f)).sort();
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1808, height: 1500 });
  for (let i = 0; i < files.length; i += 12) {
    const html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(3,600px);gap:4px">${files.slice(i, i + 12).map(f => `<div><div style="color:white;font:20px monospace">${f}</div><img width="600" style="display:block" src="${pathToFileURL(path.join(dir, f))}"></div>`).join('')}</body>`;
    const source = path.join(dir, `sheet${i / 12}.html`);
    fs.writeFileSync(source, html);
    await page.goto(pathToFileURL(source).href);
    await page.waitForFunction(() => [...document.images].every(img => img.complete));
    await page.screenshot({ path: path.join(dir, `sheet${i / 12}.png`), fullPage: true });
  }
  console.log(`${files.length} frames, ${Math.ceil(files.length / 12)} sheets: ${dir}`);
} finally { await browser.close(); }
