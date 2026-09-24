'use client';

import type { ReactNode } from 'react';
import { Code2, Link2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { profile } from '@/data/profile';

const iconFor: Record<string, ReactNode> = {
  LinkedIn: <Link2 className="size-4" />,
  GitHub: <Code2 className="size-4" />,
  Scholar: <GraduationCap className="size-4" />,
};

export function ContactSection() {
  const year = new Date().getFullYear();
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid gap-10 border-t border-foreground/15 pt-10 lg:grid-cols-12">
        <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase lg:col-span-4">
          Contact
        </h2>
        <div className="space-y-8 lg:col-span-8">
          <p className="max-w-[28ch] text-3xl font-semibold tracking-tight sm:text-4xl">
            Available for Web3 product work and research collaboration.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-none px-5">
              <a href={`mailto:${profile.email}`}>Email</a>
            </Button>
            {profile.socials.slice(0, 3).map((s) => (
              <Button
                key={s.label}
                asChild
                variant="outline"
                size="lg"
                className="rounded-none border-foreground/30 px-5"
              >
                <a href={s.href} target="_blank" rel="noreferrer">
                  {iconFor[s.label]}
                  {s.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-20 flex flex-col gap-2 border-t border-foreground/15 pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Thessaloniki / Remote</span>
          <a
            href="/play/"
            className="text-muted-foreground/70 underline-offset-2 transition-colors hover:text-foreground hover:underline"
            title="Ledger Run — experimental platformer resume"
          >
            Play
          </a>
        </p>
      </footer>
    </section>
  );
}
