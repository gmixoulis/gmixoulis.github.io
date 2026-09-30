// Usage: node scripts/ideas-qa/page-check.cjs <url> [<url> ...]
// Loads each URL in headless Chrome and reports console errors, CSP violations, failed requests,
// horizontal overflow and h1 count. Exits 1 if any page has a CSP violation, a console error, a failed
// same-origin request, overflow, or h1 count != 1.
const puppeteer = require('/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/node_modules/puppeteer-core');
(async () => {
  const urls = process.argv.slice(2);
  if (!urls.length) { console.error('usage: page-check.cjs <url>...'); process.exit(2); }
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  let failed = false;
  for (const url of urls) {
    for (const [mode, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      const p = await b.newPage(); const errors = [], csp = [], reqFail = [];
      await p.evaluateOnNewDocument(() => document.addEventListener('securitypolicyviolation',
        e => console.error('CSP ' + e.violatedDirective + ' ' + (e.blockedURI || 'inline'))));
      p.on('console', m => { if (m.type() === 'error') (m.text().startsWith('CSP ') ? csp : errors).push(m.text()); });
      p.on('pageerror', e => errors.push(e.message));
      p.on('requestfailed', r => { if (r.url().startsWith(new URL(url).origin)) reqFail.push(r.url()); });
      await p.setViewport({ width: w, height: h });
      const res = await p.goto(url, { waitUntil: 'load', timeout: 60000 });
      await new Promise(r => setTimeout(r, 1200));
      const info = await p.evaluate(() => ({
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
        h1: document.querySelectorAll('h1').length,
        cspMeta: !!document.querySelector('meta[http-equiv="content-security-policy" i]'),
      }));
      const bad = res.status() >= 400 || csp.length || errors.length || reqFail.length || info.overflowX || info.h1 !== 1;
      if (bad) failed = true;
      console.log(JSON.stringify({ url, mode, status: res.status(), ...info, csp, errors, reqFail, ok: !bad }));
      await p.close();
    }
  }
  await b.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
