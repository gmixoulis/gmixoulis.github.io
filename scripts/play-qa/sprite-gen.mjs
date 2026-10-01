// sprite-gen.mjs — acceptance A: recolor ale-shave-slides.png -> george-slides.png
//   - dark hair cap + beard, ink shirt #1a2332, coral #e85d4c cape/shorts/shoes
//   - cream "G" on the chest of upright frames (0,1,2,6,7,8) only
//   - rotated swim frames (3,4,5) keep their mark recoloured coral, no added cream
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const S = process.argv[2];                 // artifact dir (grid + metrics)
const OUT = '/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/public/play/image/ale/';
const SOURCE = '/play/image/ale/ale-shave-slides.png';

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
try {
  const page = await browser.newPage();
  await page.goto('http://localhost:4321/play/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));

  const res = await page.evaluate((source) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
      const FW = 200, FH = 200;
      const INK = [26, 35, 50], ACCENT = [232, 93, 76], PAPER = [255, 248, 239];
      const HAIR = [56, 38, 28], BEARD = [74, 52, 40];
      const isUpright = fx => fx !== 3 && fx !== 4 && fx !== 5;
      const W = img.width, H = img.height;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const id = x.getImageData(0, 0, W, H); const d = id.data;
      const at = (px, py) => { const i = (py * W + px) * 4; return [d[i], d[i + 1], d[i + 2], d[i + 3]]; };
      const set = (px, py, rgb) => { const i = (py * W + px) * 4; d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = 255; };
      const near = (p, q, t = 6) => Math.abs(p[0] - q[0]) <= t && Math.abs(p[1] - q[1]) <= t && Math.abs(p[2] - q[2]) <= t;
      const isSkin = p => p[3] > 128 && p[0] > 235 && p[1] > 180 && p[1] < 215 && p[2] > 118 && p[2] < 152;
      const isRed = p => p[3] > 128 && near(p, [231, 39, 31], 10);
      const isNavy = p => p[3] > 128 && near(p, [26, 47, 72], 8);
      const isBlond = p => p[3] > 128 && !isSkin(p) && p[0] > 200 && p[1] > 150 && p[1] < 200 && p[2] < 150;
      const isHead = p => isSkin(p) || isBlond(p);
      const isPaper = p => p[3] > 128 && near(p, PAPER, 6);

      const log = [];
      const COLS = W / FW, ROWS = H / FH;

      for (let fy = 0; fy < ROWS; fy++) for (let fx = 0; fx < COLS; fx++) {
        const ox = fx * FW, oy = fy * FH;

        // --- head: largest skin/blond component -> hair cap + beard ---
        const seen = new Uint8Array(FW * FH); let best = null;
        for (let py = 0; py < FH; py++) for (let px = 0; px < FW; px++) {
          if (seen[py * FW + px] || !isHead(at(ox + px, oy + py))) continue;
          const q = [[px, py]]; seen[py * FW + px] = 1; const pts = [];
          while (q.length) { const [ux, uy] = q.pop(); pts.push([ux, uy]); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = ux + dx, ny = uy + dy; if (nx < 0 || ny < 0 || nx >= FW || ny >= FH || seen[ny * FW + nx]) continue; if (!isHead(at(ox + nx, oy + ny))) continue; seen[ny * FW + nx] = 1; q.push([nx, ny]); } }
          if (!best || pts.length > best.length) best = pts;
        }
        if (best) {
          let y0 = 1e9, y1 = -1; for (const [, py] of best) { y0 = Math.min(y0, py); y1 = Math.max(y1, py); }
          const hTot = y1 - y0 + 1, cut = y0 + Math.round(hTot * 0.5);
          let x0 = 1e9, x1 = -1; for (const [px, py] of best) if (py <= cut) { x0 = Math.min(x0, px); x1 = Math.max(x1, px); }
          const w = x1 - x0 + 1, cx = (x0 + x1) / 2, h = Math.min(hTot, Math.round(w * 1.15)), hy1 = y0 + h - 1;
          for (const [px, py] of best) { if (py > hy1) continue; const u = Math.abs((px - cx) / (w / 2)); const hairline = y0 + h * (0.30 + 0.10 * u * u); const side = u > 0.80 && py < y0 + h * 0.62; const beardline = y0 + h * (0.73 + 0.10 * (1 - u)); if (py < hairline || side) set(ox + px, oy + py, HAIR); else if (py > beardline) set(ox + px, oy + py, BEARD); }
          for (let py = Math.max(0, y0 - 14); py < y0 + h * 0.4; py++) for (let px = Math.max(0, x0 - 6); px <= Math.min(FW - 1, x1 + 6); px++) if (isBlond(at(ox + px, oy + py))) set(ox + px, oy + py, HAIR);
        }

        // --- letter C -> cream G: upright frames only (strict detection) ---
        let letter = null;
        if (isUpright(fx)) {
          const seenR = new Uint8Array(FW * FH);
          for (let py = 0; py < FH; py++) for (let px = 0; px < FW; px++) {
            if (seenR[py * FW + px] || !isRed(at(ox + px, oy + py))) continue;
            const q = [[px, py]]; seenR[py * FW + px] = 1; const pts = [];
            while (q.length) { const [ux, uy] = q.pop(); pts.push([ux, uy]); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = ux + dx, ny = uy + dy; if (nx < 0 || ny < 0 || nx >= FW || ny >= FH || seenR[ny * FW + nx]) continue; if (!isRed(at(ox + nx, oy + ny))) continue; seenR[ny * FW + nx] = 1; q.push([nx, ny]); } }
            if (pts.length < 120 || pts.length > 1200) continue;
            let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1; for (const [ux, uy] of pts) { bx0 = Math.min(bx0, ux); by0 = Math.min(by0, uy); bx1 = Math.max(bx1, ux); by1 = Math.max(by1, uy); }
            let ring = 0, navy = 0; for (let ry = by0 - 3; ry <= by1 + 3; ry++) for (let rx = bx0 - 3; rx <= bx1 + 3; rx++) { if (rx >= bx0 - 1 && rx <= bx1 + 1 && ry >= by0 - 1 && ry <= by1 + 1) continue; if (rx < 0 || ry < 0 || rx >= FW || ry >= FH) continue; ring++; if (isNavy(at(ox + rx, oy + ry))) navy++; }
            const bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
            const letterLike = pts.length >= 300 && pts.length <= 750 && bw >= 12 && bw <= 44 && bh >= 12 && bh <= 44;
            const score = navy / ring >= 0.55 && letterLike ? 2 : 0; // strict: only a real C enclosed by shirt navy
            if (score && (!letter || score > letter.score || (score === letter.score && pts.length > letter.length))) { letter = pts; letter.score = score; }
          }
        }
        if (letter) {
          const n = letter.length; let mx = 0, my = 0; for (const [ux, uy] of letter) { mx += ux; my += uy; } mx /= n; my /= n;
          let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1; for (const [ux, uy] of letter) { bx0 = Math.min(bx0, ux); by0 = Math.min(by0, uy); bx1 = Math.max(bx1, ux); by1 = Math.max(by1, uy); }
          const bcx = (bx0 + bx1) / 2, bcy = (by0 + by1) / 2;
          let ux = bcx - mx, uy = bcy - my; const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
          let vx = -uy, vy = ux; if (vy < 0) { vx = -vx; vy = -vy; }
          let umax = -1e9, vmax = -1e9; for (const [px, py] of letter) { const du = (px - bcx) * ux + (py - bcy) * uy, dv = (px - bcx) * vx + (py - bcy) * vy; umax = Math.max(umax, du); vmax = Math.max(vmax, dv); }
          let run = 0, inRun = false; for (let k = 0; k <= Math.ceil(umax) + 2; k++) { const px = Math.round(bcx - ux * k), py = Math.round(bcy - uy * k); const red = px >= 0 && py >= 0 && px < FW && py < FH && isRed(at(ox + px, oy + py)); if (red) { run++; inRun = true; } else if (inRun) break; }
          const t = Math.max(3, run);
          const paintable = p => isNavy(p) || isRed(p);
          for (const [px, py] of letter) set(ox + px, oy + py, PAPER);
          for (let py = by0 - 4; py <= by1 + 4; py++) for (let px = bx0 - 4; px <= bx1 + 4; px++) { if (px < 0 || py < 0 || px >= FW || py >= FH) continue; const du = (px - bcx) * ux + (py - bcy) * uy, dv = (px - bcx) * vx + (py - bcy) * vy; const bar = du >= -0.5 && du <= umax && Math.abs(dv) <= t / 2; const stub = du >= umax - t && du <= umax && dv >= 0 && dv <= vmax; if ((bar || stub) && paintable(at(ox + px, oy + py))) set(ox + px, oy + py, PAPER); }
          log.push({ frame: `${fx},${fy}`, letter: 'G', letterPx: n, t, bbox: [bx0, by0, bx1, by1] });
        } else {
          log.push({ frame: `${fx},${fy}`, letter: isUpright(fx) ? 'not found' : 'skipped (rotated)' });
        }
      }

      // pass 2: global palette (shirt navy -> ink, red -> coral)
      for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 128) continue; const p = [d[i], d[i + 1], d[i + 2], 255]; if (isNavy(p)) { d[i] = INK[0]; d[i + 1] = INK[1]; d[i + 2] = INK[2]; } else if (isRed(p)) { d[i] = ACCENT[0]; d[i + 1] = ACCENT[1]; d[i + 2] = ACCENT[2]; } }
      x.putImageData(id, 0, 0);

      // --- pixel assertion: cream on every upright chest, none in swim frames ---
      const checks = []; let ok = true;
      for (let fy = 0; fy < ROWS; fy++) for (let fx = 0; fx < COLS; fx++) {
        let cream = 0;
        for (let py = 0; py < FH; py++) for (let px = 0; px < FW; px++) if (isPaper(at(fx * FW + px, fy * FH + py))) cream++;
        const upright = isUpright(fx);
        const pass = upright ? cream >= 100 : cream === 0;
        if (!pass) ok = false;
        checks.push({ fx, fy, upright, cream, pass });
      }

      // --- preview: all 18 frames, labelled ---
      const g = document.createElement('canvas'); g.width = 1800; g.height = 900;
      const gx = g.getContext('2d'); gx.imageSmoothingEnabled = false;
      gx.fillStyle = '#9ab'; gx.fillRect(0, 0, 1800, 900);
      let k = 0;
      for (let fy = 0; fy < ROWS; fy++) for (let fx = 0; fx < COLS; fx++) {
        const cx = (k % 6) * 300, cy = Math.floor(k / 6) * 300;
        gx.drawImage(c, fx * FW, fy * FH, FW, FH, cx, cy, 300, 300);
        gx.fillStyle = 'rgba(0,0,0,0.55)'; gx.fillRect(cx, cy, 300, 36);
        gx.fillStyle = '#fff'; gx.font = '20px sans-serif';
        gx.fillText(`F${fx} R${fy} ${isUpright(fx) ? 'UPRIGHT' : 'SWIM'}`, cx + 8, cy + 26);
        k++;
      }

      resolve({ sheet: c.toDataURL('image/png'), grid: g.toDataURL('image/png'), log, assert: { ok, checks } });
      } catch (error) { reject(error); }
    };
    img.onerror = () => reject(new Error('image load failed: ' + source));
    img.src = source;
  }), SOURCE);

  fs.mkdirSync(S, { recursive: true });
  fs.writeFileSync(`${S}/george-grid.png`, Buffer.from(res.grid.split(',')[1], 'base64'));
  fs.writeFileSync(`${S}/george-metrics.json`, JSON.stringify({ source: SOURCE, out: OUT + 'george-slides.png', frames: res.log, assertion: res.assert }, null, 2));

  console.log(JSON.stringify(res.log, null, 2));
  console.log('upright frames without letter:', res.log.filter(l => l.letter === 'not found').length);
  console.log('rotated frames skipped:', res.log.filter(l => l.letter === 'skipped (rotated)').length);
  console.log('assertion:', res.assert.ok ? 'PASS' : 'FAIL');
  for (const chk of res.assert.checks) console.log(`  F${chk.fx} R${chk.fy} ${chk.upright ? 'UPRIGHT' : 'SWIM   '} cream=${chk.cream} ${chk.pass ? 'ok' : 'FAIL'}`);
  if (!res.assert.ok) throw new Error('Sprite pixel checks failed; existing asset preserved');
  fs.writeFileSync(OUT + 'george-slides.png', Buffer.from(res.sheet.split(',')[1], 'base64'));
} finally {
  await browser.close();
}
