/* Header behaviour on every page: the theme toggle and the compact menu.
   Theme: one localStorage key, 'gm-theme' ('light' | 'dark' | 'system'; anything else counts as 'system').
   BaseLayout's inline bootstrap applies it before first paint; this keeps html.dark (garden CSS),
   html[data-theme] (homepage CSS) and the toggle in sync, follows the OS until the visitor picks a theme,
   and fires a 'gm-theme' event so the stages can swap (the cube in dark, the shore in light). */
type Theme = 'light' | 'dark';
const KEY = 'gm-theme';
const root = document.documentElement;
const tb = document.getElementById('theme');
const meta = document.querySelector('meta[name="theme-color"]');
const os = (): Theme => (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
const saved = (): Theme | null => {
  try { const t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch { return null; }
};

const setTheme = (t: Theme) => {
  const next = t === 'dark' ? 'light' : 'dark';
  root.classList.toggle('dark', t === 'dark');
  root.dataset.theme = t;
  root.style.colorScheme = t;
  const label = tb?.querySelector('span');
  if (label) label.textContent = next === 'light' ? 'Light' : 'Dark';
  tb?.setAttribute('aria-label', `Switch to ${next} theme`);
  meta?.setAttribute('content', t === 'dark' ? '#0a0a0b' : '#faf6ee');
  dispatchEvent(new Event('gm-theme'));
};
/* A click switches behind a veil (never on load or an OS change). To light: a sand veil falls, a sun rises on it,
   the theme swaps underneath, then the page opens from the sun's centre. To dark: a night veil rises, the sun sets,
   the veil lifts. Web Animations only; reduced motion swaps at once. Styles in Nav.astro (.veil). */
let busy = false;
const veil = async (t: Theme) => {
  let swapped = false;
  const swap = () => { swapped = true; setTheme(t); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();
  busy = true;
  const v = document.createElement('div'), sun = document.createElement('i'), E = 'cubic-bezier(.7,0,.25,1)';
  v.className = t === 'light' ? 'veil' : 'veil up'; v.setAttribute('aria-hidden', 'true'); v.append(sun); document.body.append(v);
  try {
    const cover = v.animate([{ transform: `translateY(${t === 'light' ? -101 : 101}%)` }, { transform: 'none' }], { duration: 650, easing: E, fill: 'forwards' });
    const s = t === 'light'
      ? sun.animate([{ transform: 'translate(-50%,32vh) scale(.5)', opacity: 0 }, { transform: 'translate(-50%,-50%)', opacity: 1 }],
        { delay: 380, duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' })
      : sun.animate([{ transform: 'translate(-50%,-50%)', opacity: 0 }, { transform: 'translate(-50%,-50%)', opacity: 1, offset: 0.25 },
        { transform: 'translate(-50%,34vh) scale(.62)', opacity: 0, filter: 'hue-rotate(-18deg) saturate(1.5) brightness(.7)' }],
        { delay: 250, duration: 1200, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' });
    await cover.finished; swap(); await s.finished;
    if (t === 'light') {
      await v.animate([{}, {}], { duration: 220 }).finished; // the held beat
      v.classList.add('iris');
      const r = Math.hypot(innerWidth, innerHeight) / 2 + 40;
      sun.animate([{ transform: 'translate(-50%,-50%)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(7)', opacity: 0 }],
        { duration: 760, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
      await v.animate([{ '--iris': '0px' }, { '--iris': `${r}px` }], { duration: 760, easing: 'cubic-bezier(.55,0,.8,.2)', fill: 'forwards' }).finished;
    } else await v.animate([{ transform: 'none' }, { transform: 'translateY(-101%)' }], { duration: 650, easing: E, fill: 'forwards' }).finished;
  } catch {
    if (!swapped) swap();
  } finally {
    v.remove(); busy = false;
  }
};
tb?.addEventListener('click', () => {
  if (busy) return;
  const t: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(KEY, t); } catch {}
  veil(t);
});
matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (!saved()) setTheme(os()); });
setTheme(saved() ?? os());
/* Menu (below 1180px): toggles the section list; Escape closes it and returns focus. */
const nav = document.getElementById('nav');
const menu = nav?.querySelector<HTMLButtonElement>('.menu');
if (nav && menu) {
  menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.focus();
    }
  });
}
