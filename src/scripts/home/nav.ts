/* Header behaviour on every page: the theme toggle and the compact menu.
   Theme: one localStorage key, 'gm-theme' ('light' | 'dark' | 'system'; anything else counts as 'system').
   BaseLayout's inline bootstrap applies it before first paint; this keeps html.dark (garden CSS),
   html[data-theme] (homepage CSS) and the toggle in sync, follows the OS until the visitor picks a theme,
   and fires a 'gm-theme' event so the stages can swap (the cube in dark, the shore in light). */
import { veil } from './veil';

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
/* A click switches behind the day/night turn (veil.ts); never on load or an OS change. Reduced motion swaps at once,
   and if the animation fails the theme still swaps. */
let busy = false;
const turn = async (t: Theme) => {
  let swapped = false;
  const swap = () => { swapped = true; setTheme(t); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();
  busy = true;
  try { await veil(t, swap); } catch { if (!swapped) swap(); } finally { busy = false; }
};
tb?.addEventListener('click', () => {
  if (busy) return;
  const t: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(KEY, t); } catch {}
  turn(t);
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
