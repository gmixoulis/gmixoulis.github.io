// Usage: node scripts/ideas-qa/contrast.cjs [baseURL]
// Loads /, /garden/ and /garden/one-stroke/ with ?read=easy in light and dark, then computes the contrast
// ratio of every visible text token against its effective background. Fails if any pair is < 7:1 (AAA).
const puppeteer = require('/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/node_modules/puppeteer-core');

const BASE = process.argv[2] || 'http://localhost:4321';
const URLS = ['/', '/garden/', '/garden/one-stroke/'];
const THEMES = ['light', 'dark'];
const MIN = 7;

(async () => {
  const b = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox'],
  });
  const all = [];
  let below = 0;

  for (const url of URLS) {
    for (const theme of THEMES) {
      const p = await b.newPage();
      await p.setViewport({ width: 1440, height: 900 });
      await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
      await p.goto(`${BASE}${url}?read=easy`, { waitUntil: 'load', timeout: 60000 });
      await new Promise((r) => setTimeout(r, 1500));
      const pairs = await p.evaluate(() => {
        const lum = (c) => {
          const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const ratio = (fg, bg) => {
          const l1 = lum(fg), l2 = lum(bg);
          const [a, c] = l1 > l2 ? [l1, l2] : [l2, l1];
          return (a + 0.05) / (c + 0.05);
        };
        const bgOf = (el) => {
          for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
            const s = getComputedStyle(n);
            if (s.display === 'none' || s.visibility === 'hidden') return null;
            const c = s.backgroundColor;
            if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
          }
          return getComputedStyle(document.body).backgroundColor;
        };
        const visible = (el) => {
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden') return false;
          if (parseFloat(s.opacity) === 0) return false;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return false;
          return true;
        };
        const out = [];
        const walk = (el) => {
          for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              const t = node.textContent.replace(/\s+/g, ' ').trim();
              if (t && visible(el)) {
                const fg = getComputedStyle(el).color;
                if (fg && !fg.startsWith('rgba(0, 0, 0, 0)') && fg !== 'transparent') {
                  const bg = bgOf(el);
                  out.push({ text: t.slice(0, 60), fg, bg, ratio: +ratio(fg, bg).toFixed(2) });
                }
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              walk(node);
            }
          }
        };
        walk(document.body);
        return out;
      });
      const low = pairs.filter((x) => x.ratio < MIN);
      below += low.length;
      all.push({ url, theme, tokens: pairs.length, minRatio: pairs.length ? Math.min(...pairs.map((x) => x.ratio)) : null, below7: low });
      console.log(JSON.stringify({ url, theme, tokens: pairs.length, minRatio: all[all.length - 1].minRatio, offenders: low.length }));
      if (low.length) console.log(JSON.stringify(low.slice(0, 20), null, 1));
      await p.close();
    }
  }

  await b.close();
  console.log('\nSUMMARY');
  console.log(JSON.stringify({ pages: all.length, tokensBelow7: below }, null, 1));
  process.exit(below ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
