'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import type { Publication } from '@/data/profile';

type Cert = { src: string; title: string; kind: string };
type Project = { src: string; host: string };

export function ProofSection({
  certs,
  projects,
}: {
  certs: Cert[];
  projects: Project[];
}) {
  const reduce = useReducedMotion();
  const [pubs, setPubs] = React.useState<Publication[]>([]);

  React.useEffect(() => {
    fetch('/publications.json')
      .then((r) => r.json())
      .then((d: Publication[]) => setPubs(d.slice(0, 8)))
      .catch(() => setPubs([]));
  }, []);

  return (
    <section id="proof" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid gap-4 border-t border-foreground/15 pt-10 lg:grid-cols-12">
        <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase lg:col-span-4">
          Proof
        </h2>
        <p className="font-mono text-xs text-muted-foreground lg:col-span-8">
          {certs.length} credentials · {projects.length} shipped sites
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-px bg-foreground/15 sm:grid-cols-3 lg:grid-cols-4">
        {certs.slice(0, 12).map((c, i) => (
          <motion.a
            key={c.src}
            href={c.src}
            target="_blank"
            rel="noreferrer"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: reduce ? 0 : (i % 8) * 0.03, duration: 0.35 }}
            className="group bg-background"
          >
            <div className="aspect-[4/3] overflow-hidden border border-transparent">
              <img
                src={c.src}
                alt={c.title}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
              />
            </div>
            <div className="space-y-1 border-t border-foreground/10 p-3">
              <p className="font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">
                {c.kind}
              </p>
              <p className="line-clamp-2 text-xs leading-snug">{c.title}</p>
            </div>
          </motion.a>
        ))}
      </div>

      <h3 className="mt-20 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
        Web apps
      </h3>
      <ul className="mt-6 divide-y divide-foreground/15 border-y border-foreground/15">
        {projects.map((p) => (
          <li key={p.host}>
            <a
              href={`https://${p.host}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 py-4 transition-colors hover:bg-muted/40"
            >
              <img
                src={p.src}
                alt=""
                loading="lazy"
                className="size-14 shrink-0 object-cover grayscale sm:size-16"
              />
              <span className="flex-1 font-mono text-sm">{p.host}</span>
              <ExternalLink className="size-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>

      <div id="writing" className="mt-20">
        <h3 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          Selected papers
        </h3>
        <ol className="mt-6 divide-y divide-foreground/15 border-y border-foreground/15">
          {pubs.map((pub, i) => (
            <li
              key={pub.link ?? pub.title}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="flex gap-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-mono text-[0.7rem] text-primary">{pub.year}</p>
                  <p className="mt-1 max-w-3xl text-sm leading-snug sm:text-base">
                    {pub.title}
                  </p>
                </div>
              </div>
              {pub.link ? (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Open
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
