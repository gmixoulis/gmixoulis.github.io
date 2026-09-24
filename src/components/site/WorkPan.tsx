'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import { profile } from '@/data/profile';

gsap.registerPlugin(ScrollTrigger);

export function WorkPan() {
  const reduce = useReducedMotion();
  const wrap = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = () =>
        Math.max(0, track.current!.scrollWidth - window.innerWidth);
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="work" className="border-y border-foreground/15">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid gap-4 border-t border-foreground/15 pt-10 lg:grid-cols-12">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase lg:col-span-4">
            Experience
          </h2>
          <p className="max-w-[40ch] text-muted-foreground lg:col-span-8">
            Product, research, and teaching roles across Web3 and data systems.
          </p>
        </div>
      </div>

      <div ref={wrap} className="mt-12">
        <div
          ref={track}
          className={`flex ${reduce ? 'flex-col px-4 pb-16 sm:px-6' : 'h-[min(100dvh,40rem)] items-stretch'}`}
        >
          {profile.experience.map((job, i) => (
            <article
              key={job.title + job.org}
              className={`${reduce ? 'w-full border-t' : 'flex w-[min(92vw,34rem)] shrink-0 flex-col border-l'} border-foreground/15 bg-background px-6 py-10 sm:px-10`}
            >
              <p className="font-mono text-[0.7rem] text-muted-foreground">
                {String(i + 1).padStart(2, '0')} / {job.when}
              </p>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                {job.title}
              </h3>
              <p className="mt-2 font-mono text-sm text-primary">{job.org}</p>
              <p className="mt-8 max-w-[36ch] flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {job.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
