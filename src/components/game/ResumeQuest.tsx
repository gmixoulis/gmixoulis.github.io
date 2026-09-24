'use client';

import * as React from 'react';
import {
  WORLD_W,
  stations,
  socials,
  email,
  displayName,
  shortName,
  type Station,
} from '@/data/game-world';

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

function nearestStation(worldX: number): Station {
  let best = stations[0];
  let bestD = Infinity;
  for (const s of stations) {
    const d = Math.abs(s.x - worldX);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}

export function ResumeQuest() {
  const reduce = usePrefersReducedMotion();
  const [progress, setProgress] = React.useState(0);
  const [vw, setVw] = React.useState(1200);
  const [walking, setWalking] = React.useState(false);
  const [face, setFace] = React.useState(1);
  const walkTimer = React.useRef(0);
  const prevProgress = React.useRef(0);

  const maxCam = Math.max(0, WORLD_W - vw);
  const cam = progress * maxCam;
  const focusX = cam + vw * 0.28;
  const active = nearestStation(focusX);
  const charScreenX = vw * 0.28;

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max <= 0 ? 0 : clamp(window.scrollY / max, 0, 1);
      if (next > prevProgress.current + 0.0005) setFace(1);
      if (next < prevProgress.current - 0.0005) setFace(-1);
      prevProgress.current = next;
      setProgress(next);
      setWalking(true);
      window.clearTimeout(walkTimer.current);
      walkTimer.current = window.setTimeout(() => setWalking(false), 160);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const step = window.innerHeight * 0.38;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        window.scrollBy({ top: step, behavior: reduce ? 'auto' : 'smooth' });
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        window.scrollBy({ top: -step, behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reduce]);

  return (
    <div className="lr-root">
      <div
        className="lr-spacer"
        style={{ height: `${Math.max(stations.length * 85, 600)}vh` }}
        aria-hidden="true"
      />

      <div className="lr-stage">
        <header className="lr-hud">
          <a href="/">← Site</a>
          <span className="lr-hud-title">{displayName}</span>
          <span className="lr-hud-lvl">{active.label}</span>
        </header>

        <div className="lr-sky" />
        <div
          className="lr-parallax lr-hills"
          style={{
            transform: reduce ? undefined : `translate3d(${-cam * 0.35}px,0,0)`,
          }}
        />

        <div
          className="lr-world"
          style={{
            width: WORLD_W,
            transform: `translate3d(${-Math.round(cam)}px,0,0)`,
          }}
        >
          <div className="lr-ground" />
          {stations.map((s) => (
            <article
              key={s.id}
              className={`lr-station lr-station--${s.hue} ${active.id === s.id ? 'is-active' : ''}`}
              style={{ left: s.x }}
            >
              <p className="lr-station-label">{s.label}</p>
              <h2>{s.title}</h2>
              <p className="lr-station-body">{s.body}</p>
              {s.id === 'contact' ? (
                <div className="lr-contact">
                  <a href={`mailto:${email}`}>{email}</a>
                  <div className="lr-socials">
                    {socials.map((g) => (
                      <a key={g.href} href={g.href} target="_blank" rel="noreferrer">
                        {g.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}

          <div className="lr-prop lr-bush" style={{ left: 480 }} />
          <div className="lr-prop lr-bush" style={{ left: 1100 }} />
          <div className="lr-prop lr-block" style={{ left: 1600 }} />
          <div className="lr-prop lr-block" style={{ left: 1680 }} />
          <div className="lr-prop lr-pipe" style={{ left: 2800 }} />
          <div className="lr-prop lr-flag" style={{ left: 5050 }} />
        </div>

        <div
          className={`lr-hero ${walking ? 'is-walk' : ''} ${face < 0 ? 'is-left' : ''}`}
          style={{ left: charScreenX }}
          aria-hidden="true"
        >
          <div className="lr-hero-body" />
          <div className="lr-hero-head" title={shortName} />
        </div>

        <p className="lr-hint">
          Scroll · ↓ / → — walk {shortName} through the resume
        </p>
      </div>
    </div>
  );
}
