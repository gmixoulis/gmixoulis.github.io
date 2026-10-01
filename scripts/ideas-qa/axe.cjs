// Usage: node scripts/ideas-qa/axe.cjs [baseURL]
// Runs axe-core on /, /garden/ and /garden/one-stroke/ × {light,dark} × {normal,easy} × {1440,390}.
// Prints a JSON summary of violations per URL/mode/theme/width. Exits 1 on any serious or critical violation.
const puppeteer = require('/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/node_modules/puppeteer-core');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4321';
const URLS = ['/', '/garden/', '/garden/one-stroke/'];
const THEMES = ['light', 'dark'];
const READS = [{ key: 'normal', qs: '' }, { key: 'easy', qs: '?read=easy' }];
const WIDTHS = [1440, 390];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const AXE = path.join(__dirname, '..', '..', 'node_modules', 'axe-core', 'axe.min.js');

(async () => {
  const b = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox'],
  });
  const results = [];
  let seriousCritical = 0;

  for (const url of URLS) {
    for (const theme of THEMES) {
      for (const { key, qs } of READS) {
        for (const width of WIDTHS) {
          const p = await b.newPage();
          // axe.min.js is injected as an inline <script>, which the strict CSP would block; bypass it for the audit.
          await p.setBypassCSP(true);
          await p.setViewport({ width, height: width > 800 ? 900 : 844 });
          await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
          const target = `${BASE}${url}${qs}`;
          await p.goto(target, { waitUntil: 'load', timeout: 60000 });
          await new Promise((r) => setTimeout(r, 1500));
          // Walk the page so scroll-triggered reveals reach their final visible state before axe runs.
          await p.evaluate(async () => {
            const step = innerHeight * 0.8;
            for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
              scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 40));
            }
            scrollTo(0, 0);
          });
          await new Promise((r) => setTimeout(r, 900));
          await p.addScriptTag({ path: AXE });
          const res = await p.evaluate(async (tags) => {
            const r = await window.axe.run(document, { runOnly: { type: 'tag', values: tags } });
            return r.violations.map((v) => ({
              id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length,
              targets: v.nodes.slice(0, 5).map((n) => n.target),
            }));
          }, TAGS);
          const bad = res.filter((v) => v.impact === 'serious' || v.impact === 'critical');
          seriousCritical += bad.length;
          results.push({ url, theme, read: key, width, violations: res, seriousOrCritical: bad.length });
          console.log(JSON.stringify(results[results.length - 1]));
          await p.close();
        }
      }
    }
  }

  await b.close();
  console.log('\nSUMMARY');
  console.log(JSON.stringify({
    combos: results.length,
    withViolations: results.filter((r) => r.violations.length).length,
    seriousOrCritical: seriousCritical,
  }, null, 1));
  process.exit(seriousCritical ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
