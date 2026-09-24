'use client';

import * as React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/button';
import { profile } from '@/data/profile';

export function HeroTurbo() {
  const reduce = useReducedMotion();
  const section = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end start'],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section
      id="top"
      ref={section}
      className="relative border-b border-foreground/15 pt-16"
    >
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl lg:grid-cols-12">
        <div className="flex flex-col justify-end px-4 py-16 sm:px-6 lg:col-span-5 lg:py-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
              {profile.location}
            </p>

            <h1 className="font-display text-[clamp(2.75rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              George
              <br />
              Michoulis
            </h1>

            <p className="max-w-[36ch] text-[1.05rem] leading-relaxed text-muted-foreground">
              {profile.thesis}
            </p>

            <dl className="grid gap-3 border-t border-foreground/15 pt-6 font-mono text-xs sm:text-[0.8rem]">
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted-foreground">Focus</dt>
                <dd>Web3 · ML on graphs · full-stack</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted-foreground">Now</dt>
                <dd>Cyberscope by TAC</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted-foreground">Prior</dt>
                <dd>DeepMind Scholar · AUTH</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="rounded-none px-5">
                <a href="#contact">Contact</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none border-foreground/30 px-5"
              >
                <a href="#work">Experience</a>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="relative border-t border-foreground/15 lg:col-span-7 lg:border-t-0 lg:border-l">
          <motion.div
            className="absolute inset-0"
            style={reduce ? undefined : { y: figureY }}
          >
            <img
              src="/img/ui/hero-graph.png"
              alt=""
              className="h-full min-h-[50vh] w-full object-cover object-center lg:min-h-full"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent lg:from-background/80" />
          <p className="absolute bottom-4 left-4 font-mono text-[0.65rem] tracking-wide text-background/80 mix-blend-difference uppercase lg:text-foreground/50">
            Fig. 1 — Graph structure (schematic)
          </p>
        </div>
      </div>
    </section>
  );
}
