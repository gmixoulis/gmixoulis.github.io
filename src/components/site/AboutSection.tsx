'use client';

import { motion, useReducedMotion } from 'motion/react';
import { profile } from '@/data/profile';

export function AboutSection() {
  const reduce = useReducedMotion();
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid gap-12 border-t border-foreground/15 pt-10 lg:grid-cols-12 lg:gap-8">
        <motion.div
          className="lg:col-span-4"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            About
          </h2>
        </motion.div>
        <motion.div
          className="space-y-8 lg:col-span-8"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: reduce ? 0 : 0.05 }}
        >
          <p className="max-w-[58ch] text-lg leading-relaxed">{profile.about}</p>
          <ul className="grid gap-6 sm:grid-cols-3">
            {profile.pillars.map((p) => (
              <li key={p.title} className="border-t border-foreground/15 pt-4">
                <h3 className="font-mono text-xs tracking-wide uppercase">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="grid gap-10 border-t border-foreground/15 pt-8 sm:grid-cols-2">
            <div>
              <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                Education
              </h3>
              <ul className="mt-4 space-y-5">
                {profile.education.map((e) => (
                  <li key={e.title}>
                    <p className="font-mono text-[0.7rem] text-primary">{e.when}</p>
                    <p className="mt-1 font-medium">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.org}</p>
                    <p className="text-sm text-muted-foreground">{e.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                Awards
              </h3>
              <ul className="mt-4 space-y-5">
                {profile.awards.map((a) => (
                  <li key={a.title}>
                    <p className="font-mono text-[0.7rem] text-primary">{a.when}</p>
                    <p className="mt-1 font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.org}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
