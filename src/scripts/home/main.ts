/* Homepage behaviour: smooth scroll, section state, reveals, the certificate rail and dialog, copy email,
   the lazy LinkedIn embed, and the WebGL stage (loaded after first paint). The theme toggle and menu live in nav.ts. */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Shared with the stage: scroll progress (0 = hero … 9 = contact) and the pointer, in -1..1. */
export type Stage = { t: number; px: number; py: number; pointer: boolean; reduced: boolean };
const root = document.documentElement;
const S: Stage = { t: 0, px: 0, py: 0, pointer: false, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
const reduce = S.reduced;
const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

/* the stage: after first paint, so the h1 stays the LCP (even the WebGL 2 probe waits: a first GL context can
   take seconds on slow devices); no WebGL 2 shows the CSS fallback */
(async () => {
  try {
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    // Easy read hides the stage: don't create a GL context until the mode is turned off
    const easy = () => root.dataset.read === 'easy';
    if (easy()) await new Promise<void>((r) => { const f = () => { if (!easy()) { document.removeEventListener('gm:read', f); r(); } }; document.addEventListener('gm:read', f); });
    if (!document.createElement('canvas').getContext('webgl2')) throw new Error('no webgl2');
    (await import('./scene')).run(S, $<HTMLCanvasElement>('#gl'));
  } catch (e) {
    root.classList.add('no-gl');
    console.warn('Stage fallback:', (e as Error).message);
  }
})();

/* Lenis smooth scroll: off in easy read (and for reduced motion). Toggled by the 'gm:read' event from nav.ts;
   the easy-read CSS also forces scroll-behavior:auto and hides the WebGL stage. */
const isRead = () => root.getAttribute('data-read') === 'easy';
let lenis: Lenis | null = null;
let raf: ((t: number) => void) | null = null;
const makeLenis = () => {
  if (reduce || isRead() || lenis) return;
  const l = new Lenis({ duration: 1.15 });
  l.on('scroll', ScrollTrigger.update);
  raf = (t) => l.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  lenis = l;
};
const killLenis = () => {
  if (!lenis) return;
  lenis.destroy();
  if (raf) gsap.ticker.remove(raf);
  raf = null;
  lenis = null;
};
makeLenis();
document.addEventListener('gm:read', () => (isRead() ? killLenis() : makeLenis()));
/* in-page anchors: smooth via Lenis, then move focus for keyboard users */
const nav = $('#nav'), menu = $('.menu'), menuLabel = $('.menu span');
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest?.('a[href^="#"]');
  if (!a) return;
  const el = document.getElementById(a.getAttribute('href')!.slice(1));
  if (!el) return;
  e.preventDefault();
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView();
  el.focus({ preventScroll: true });
});

/* pointer: moves the specular light on the block and the spotlight on cards, never the camera */
addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  S.pointer = true; S.px = (e.clientX / innerWidth) * 2 - 1; S.py = (e.clientY / innerHeight) * 2 - 1;
  const sp = (e.target as Element).closest?.<HTMLElement>('.spot');
  if (sp) {
    const r = sp.getBoundingClientRect();
    sp.style.setProperty('--mx', e.clientX - r.left + 'px');
    sp.style.setProperty('--my', e.clientY - r.top + 'px');
  }
}, { passive: true });
if (!reduce && matchMedia('(pointer:fine)').matches) $$('.mag').forEach((b) => {
  b.addEventListener('pointermove', (e) => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.32}px)`;
  });
  b.addEventListener('pointerleave', () => (b.style.transform = ''));
});

/* the benchmarking GIF loops; show its first frame only */
$$<HTMLImageElement>('img[data-freeze]').forEach((i) => {
  const f = () => {
    const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight;
    c.getContext('2d')!.drawImage(i, 0, 0);
    c.setAttribute('role', 'img'); c.setAttribute('aria-label', i.alt); i.replaceWith(c);
  };
  if (i.complete && i.naturalWidth) f(); else i.addEventListener('load', f, { once: true });
});

/* certificate rail: native scroll + snap, mouse drag, buttons, progress */
const rail = $('#rail'), bar = $('#rbar'), prev = $<HTMLButtonElement>('#prev'), next = $<HTMLButtonElement>('#next');
const step = () => (rail.querySelector<HTMLElement>('.card')!.offsetWidth + 16) * (innerWidth < 700 ? 1 : 2);
prev.onclick = () => rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' });
next.onclick = () => rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' });
const upd = () => {
  const m = rail.scrollWidth - rail.clientWidth, p = m > 0 ? rail.scrollLeft / m : 1;
  bar.style.transform = `scaleX(${0.12 + p * 0.88})`; prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft > m - 4;
};
rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
let drag: { x: number; l: number; moved: boolean } | null = null;
rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button) return; drag = { x: e.clientX, l: rail.scrollLeft, moved: false }; });
addEventListener('pointermove', (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 5 && !drag.moved) { drag.moved = true; rail.classList.add('drag'); }
  if (drag.moved) rail.scrollLeft = drag.l - dx;
});
addEventListener('pointerup', () => { if (!drag) return; drag = null; requestAnimationFrame(() => rail.classList.remove('drag')); });
rail.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });

/* all certificates (the list is static HTML; its images load when the dialog opens) */
const dlg = $<HTMLDialogElement>('#dlg');
$('#seeall').onclick = () => dlg.showModal();
$('#dlg-x').onclick = () => dlg.close();
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

/* copy email */
$('#copy').onclick = async () => {
  const b = $('#copy span'), mail = $('.mail a');
  try { await navigator.clipboard.writeText(mail.textContent ?? ''); b.textContent = 'Copied'; $('#live').textContent = 'Email address copied'; }
  catch { const r = document.createRange(); r.selectNodeContents(mail); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); b.textContent = 'Selected'; }
  setTimeout(() => (b.textContent = 'Copy email'), 1800);
};

/* LinkedIn: the third-party iframe is created only when its section comes near */
const feed = $('#feed');
const liFail = () => { feed.dataset.state = 'failed'; feed.querySelector('iframe')?.remove(); };
new IntersectionObserver((es, o) => {
  if (!es[0].isIntersecting) return;
  o.disconnect();
  if (!navigator.onLine) return liFail();
  feed.dataset.state = 'loading';
  const f = document.createElement('iframe'), t = setTimeout(liFail, 15000);
  f.title = 'George Michoulis on LinkedIn: latest posts'; f.loading = 'lazy'; f.referrerPolicy = 'strict-origin-when-cross-origin';
  f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
  f.addEventListener('load', () => { clearTimeout(t); if (feed.dataset.state === 'loading') feed.dataset.state = 'ready'; }, { once: true });
  f.src = feed.dataset.src!;
  feed.append(f);
}, { rootMargin: '900px 0px' }).observe(feed);

/* nav state */
const secs = ['top', 'about', 'skills', 'work', 'research', 'certificates', 'projects', 'activities', 'linkedin', 'contact'].map((id) => document.getElementById(id)!);
const links = $$<HTMLAnchorElement>('.links a[href^="#"]'), ind = $('.ind');
const setActive = (i: number) => {
  let on: HTMLAnchorElement | null = null;
  links.forEach((a) => {
    const m = a.hash === '#' + secs[i].id;
    a.classList.toggle('on', m);
    if (m) { a.setAttribute('aria-current', 'true'); on = a; } else a.removeAttribute('aria-current');
  });
  const a = on as HTMLAnchorElement | null;
  if (a && a.offsetWidth) {
    ind.style.width = a.offsetWidth - 18 + 'px';
    ind.style.transform = `translateX(${(a.parentNode as HTMLElement).offsetLeft + 9}px)`;
    ind.style.opacity = '1';
  } else ind.style.opacity = '0';
  menuLabel.textContent = a && innerWidth <= 1180 ? a.textContent : 'Menu';
};
const onScroll = () => nav.classList.toggle('scrolled', scrollY > innerHeight * 0.45);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

gsap.registerPlugin(ScrollTrigger);
/* scene progress: 0 = hero … 9 = contact; each section eases the stage into its own state as it enters */
const prog = secs.map(() => 0);
secs.forEach((s, i) => {
  if (i) ScrollTrigger.create({ trigger: s, start: 'top 96%', end: 'top 36%', onUpdate: (st) => { prog[i] = st.progress; S.t = prog.reduce((a, b) => a + b, 0); } });
  ScrollTrigger.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: (st) => { if (st.isActive) setActive(i); } });
});
$$('.blk').forEach((r) => ScrollTrigger.create({ trigger: r, start: 'top 60%', end: 'bottom 60%', toggleClass: { targets: r, className: 'on' } }));
gsap.fromTo('.chain-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.chain', start: 'top 60%', end: 'bottom 60%', scrub: 0.5 } });

if (!reduce && !isRead()) {
  gsap.timeline({ delay: 0.1, defaults: { ease: 'expo.out', duration: 1.4 } })
    .from('.h1 .w>span', { yPercent: 108, stagger: 0.09 })
    .from('.latest', { y: 12, opacity: 0, duration: 1 }, 0.15)
    .from('.lede,.ctas', { y: 18, opacity: 0, stagger: 0.08, duration: 1.2 }, 0.35)
    .from('.nav', { opacity: 0, duration: 1.1 }, 0.6);
  gsap.set('[data-rv]', { opacity: 0, y: 24 });
  ScrollTrigger.batch('[data-rv]', { start: 'top 90%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out', overwrite: true }) });
}
addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
