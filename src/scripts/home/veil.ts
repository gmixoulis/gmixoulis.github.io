/* The theme switch as a day/night turn (plan 012), played only on a toggle click (nav.ts). A veil covers the page in
   the current sky (clear Aegean blue by day, stars by night); the body in it (sun by day, moon by night) sets on an arc to the left while the sky turns through
   dusk or dawn, the other body rises on an arc from the right, holds, and the page opens from its centre. The theme
   swaps underneath once the veil has covered the page. Web Animations only; styles in Nav.astro (.veil). */
type Theme = 'light' | 'dark';

const DAY = '#faf6ee', NIGHT = '#0a0a0b';
const E = 'cubic-bezier(.7,0,.25,1)';

/* stars on the night sky: fixed positions, two sizes */
const STARS = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 37.7) % 100, y = (i * 61.3 + (i % 7) * 9) % 100, r = i % 9 ? 1 : 1.6;
  return `radial-gradient(${r}px ${r}px at ${x.toFixed(1)}% ${y.toFixed(1)}%,rgba(255,255,255,${i % 3 ? 0.55 : 0.9}),transparent)`;
}).join(',');

/* the full moon, drawn once (seeded, so it is the same moon every time): highlands with mottling and regolith speckle,
   the maria in roughly their real places (Procellarum, Imbrium, Serenitatis, Tranquillitatis, Crisium, Fecunditatis,
   Nectaris, Nubium, Humorum, Frigoris), craters as bowls lit from the right, the ray craters (Tycho, Copernicus,
   Kepler, Aristarchus), limb darkening */
let moonCv: HTMLCanvasElement | null = null;
function moon() {
  if (moonCv) return moonCv;
  const S = 512, R = S / 2, c = document.createElement('canvas'), g = c.getContext('2d')!;
  c.width = c.height = S; c.className = 'moon';
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  g.save(); g.beginPath(); g.arc(R, R, R, 0, 7); g.clip();
  g.fillStyle = '#d4d7de'; g.fillRect(0, 0, S, S);
  g.filter = 'blur(14px)';
  for (let i = 0; i < 40; i++) {
    g.fillStyle = rnd() < 0.5 ? `rgba(255,255,255,${0.05 + rnd() * 0.06})` : `rgba(70,76,96,${0.04 + rnd() * 0.05})`;
    g.beginPath(); g.arc(rnd() * S, rnd() * S, S * (0.04 + rnd() * 0.1), 0, 7); g.fill();
  }
  g.filter = 'none';
  for (let i = 0; i < 12000; i++) { const a = rnd() * 0.07; g.fillStyle = rnd() < 0.5 ? `rgba(255,255,255,${a})` : `rgba(60,64,82,${a})`; g.fillRect(rnd() * S, rnd() * S, 1.2, 1.2); }
  const maria = [[-0.55, 0, 0.32, 0.5], [-0.3, -0.38, 0.27, 0.24], [0.12, -0.38, 0.16, 0.15], [0.27, -0.06, 0.2, 0.17], [0.62, -0.28, 0.1, 0.13],
    [0.55, 0.13, 0.12, 0.14], [0.36, 0.27, 0.08, 0.08], [-0.18, 0.36, 0.16, 0.12], [-0.48, 0.38, 0.09, 0.09], [-0.1, -0.68, 0.38, 0.07], [-0.75, -0.2, 0.12, 0.25]];
  g.filter = 'blur(7px)';
  for (const [x, y, rx, ry] of maria) for (let k = 0; k < 16; k++) {
    g.fillStyle = `rgba(86,92,114,${0.09 + rnd() * 0.07})`; g.beginPath();
    g.ellipse(R + (x + (rnd() - 0.5) * rx * 0.9) * R, R + (y + (rnd() - 0.5) * ry * 0.9) * R, rx * R * (0.4 + rnd() * 0.45), ry * R * (0.4 + rnd() * 0.45), rnd() * 3, 0, 7);
    g.fill();
  }
  g.filter = 'none';
  for (let i = 0; i < 140; i++) {
    const a = rnd() * 6.283, d = Math.sqrt(rnd()) * 0.94, r = rnd() ** 3 * S * 0.05 + S * 0.004;
    g.save(); g.translate(R + Math.cos(a) * d * R, R + Math.sin(a) * d * R);
    g.rotate(a); g.scale(1 - d * d * 0.55, 1); g.rotate(-a); // foreshortened toward the limb; the light stays from the right
    const bowl = g.createLinearGradient(-r, 0, r, 0);
    bowl.addColorStop(0, 'rgba(255,255,255,.26)'); bowl.addColorStop(0.42, 'rgba(255,255,255,0)'); bowl.addColorStop(0.58, 'rgba(34,38,56,0)'); bowl.addColorStop(1, 'rgba(34,38,56,.42)');
    g.fillStyle = bowl; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
    g.lineWidth = Math.max(0.7, r * 0.12); g.strokeStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.arc(0, 0, r * 1.04, -1.1, 1.1); g.stroke();
    g.restore();
  }
  for (const [x, y, len, n] of [[-0.1, 0.66, 0.7, 18], [-0.3, -0.12, 0.34, 12], [-0.55, -0.08, 0.2, 9], [-0.68, -0.27, 0.12, 6]]) {
    const cx = R + x * R, cy = R + y * R;
    g.filter = 'blur(1.5px)';
    for (let k = 0; k < n; k++) {
      const a = rnd() * 6.283, L = len * R * (0.4 + rnd() * 0.8), ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L, ray = g.createLinearGradient(cx, cy, ex, ey);
      ray.addColorStop(0, 'rgba(255,255,255,.16)'); ray.addColorStop(1, 'rgba(255,255,255,0)');
      g.strokeStyle = ray; g.lineWidth = 2 + rnd() * 4; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ex, ey); g.stroke();
    }
    g.filter = 'none';
    const spot = g.createRadialGradient(cx, cy, 0, cx, cy, S * 0.013);
    spot.addColorStop(0, 'rgba(255,255,255,.55)'); spot.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = spot; g.beginPath(); g.arc(cx, cy, S * 0.013, 0, 7); g.fill();
  }
  const limb = g.createRadialGradient(R * 0.94, R * 0.9, R * 0.2, R, R, R);
  limb.addColorStop(0, 'rgba(255,255,255,0)'); limb.addColorStop(0.78, 'rgba(30,34,52,.07)'); limb.addColorStop(1, 'rgba(18,22,40,.42)');
  g.fillStyle = limb; g.fillRect(0, 0, S, S); g.restore();
  return (moonCv = c);
}

/* an arc across the sky, in degrees: +80 rises low on the right, 0 is the centre, -80 sets low on the left */
const arc = (a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => {
  const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180, x = 62 * Math.sin(a), y = 62 - 62 * Math.cos(a);
  return { transform: `translate(calc(-50% + ${x.toFixed(2)}vh),calc(-50% + ${y.toFixed(2)}vh))` };
});

export async function veil(t: Theme, swap: () => void) {
  const toDark = t === 'dark', F = { fill: 'forwards' as const };
  const v = document.createElement('div'), sun = document.createElement('i'), day = document.createElement('s'), sky = document.createElement('u'), glow = document.createElement('em'), m = moon();
  v.className = toDark ? 'veil up' : 'veil'; v.setAttribute('aria-hidden', 'true'); v.style.background = toDark ? DAY : NIGHT;
  sky.style.backgroundImage = STARS; (toDark ? day : sky).style.opacity = '1'; // the blue day sky, or the stars, are up when it starts
  v.append(day, sky, glow, sun, m); document.body.append(v);
  const [setter, riser] = toDark ? [sun, m] : [m, sun];
  try {
    const cover = v.animate([{ transform: `translateY(${toDark ? 101 : -101}%)` }, { transform: 'none' }], { duration: 800, easing: E, ...F });
    setter.animate([{ opacity: 0 }, { opacity: 1 }], { delay: 300, duration: 450, ...F });
    await cover.finished; swap();
    const turn = toDark ? [DAY, '#f2b48a', '#8f5d6c', '#2a2442', NIGHT] : [NIGHT, '#2a2442', '#a8707e', '#f2b48a', DAY];
    v.animate(turn.map((c) => ({ backgroundColor: c })), { delay: 150, duration: 1600, easing: 'ease-in-out', ...F });
    glow.animate([{ opacity: 0 }, { opacity: 0.9 }, { opacity: 0 }], { delay: 150, duration: 1600, ...F });
    day.animate(toDark ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }], { delay: toDark ? 150 : 1150, duration: toDark ? 900 : 700, ...F });
    sky.animate(toDark ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], { delay: toDark ? 900 : 100, duration: 1000, ...F });
    setter.animate(arc(0, -80), { duration: 1250, easing: 'cubic-bezier(.45,0,.75,.6)', ...F });
    setter.animate([{ opacity: 1, filter: 'none' },
      { opacity: 1, filter: toDark ? 'hue-rotate(-15deg) saturate(1.5) brightness(.85)' : 'brightness(.85)', offset: 0.7 },
      { opacity: 0, filter: toDark ? 'hue-rotate(-24deg) saturate(1.7) brightness(.65)' : 'brightness(.7)' }], { duration: 1250, ...F });
    const rise = riser.animate(arc(80, 0), { delay: 800, duration: 1300, easing: 'cubic-bezier(.2,.7,.3,1)', ...F });
    riser.animate([{ opacity: 0, filter: toDark ? 'brightness(.7)' : 'hue-rotate(-14deg) saturate(1.4) brightness(.8)' },
      { opacity: 1, filter: toDark ? 'brightness(.9)' : 'hue-rotate(-6deg) saturate(1.15) brightness(.92)', offset: 0.3 },
      { opacity: 1, filter: 'none' }], { delay: 800, duration: 1300, ...F });
    await rise.finished;
    await riser.animate([{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: 'translate(-50%,-50%) scale(1.03)' }, { transform: 'translate(-50%,-50%) scale(1)' }], { duration: 300 }).finished;
    v.classList.add('iris');
    const r = Math.hypot(innerWidth, innerHeight) / 2 + 40;
    riser.animate([{ transform: 'translate(-50%,-50%)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(6)', opacity: 0 }], { duration: 950, easing: 'cubic-bezier(.5,0,.75,0)', ...F });
    await v.animate([{ '--iris': '0px' }, { '--iris': `${r}px` }], { duration: 950, easing: 'cubic-bezier(.55,0,.8,.2)', ...F }).finished;
  } finally {
    v.getAnimations({ subtree: true }).forEach((a) => a.cancel()); // the moon canvas is reused next time
    v.remove();
  }
}
