// Usage: node thumbs.cjs slug1 slug2 ...  → public/drafts/ideas/thumbs/<slug>.png (hero frame, 720x450)
const puppeteer = require('/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/node_modules/puppeteer-core');
const { execFileSync } = require('child_process');
const D = '/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/public/drafts/ideas';
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
    args: ['--hide-scrollbars', '--allow-file-access-from-files', '--ignore-gpu-blocklist', '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const slug of process.argv.slice(2)) {
    const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
    try {
      await p.goto(`file://${D}/${slug}.html`, { waitUntil: 'load', timeout: 120000 });
      await new Promise(r => setTimeout(r, 6000));
      const raw = `${D}/thumbs/${slug}.full.png`; await p.screenshot({ path: raw });
      execFileSync('python3', ['-c', `from PIL import Image;Image.open('${raw}').convert('RGB').resize((720,450)).save('${D}/thumbs/${slug}.png',optimize=True)`]);
      require('fs').unlinkSync(raw); console.log('ok', slug);
    } catch (e) { console.log('FAIL', slug, e.message.slice(0, 80)); }
    await p.close();
  }
  await b.close();
})();
