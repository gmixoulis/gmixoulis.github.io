'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/site/ThemeToggle';

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#work', label: 'Work' },
  { href: '/#proof', label: 'Proof' },
  { href: '/#writing', label: 'Papers' },
  { href: '/#contact', label: 'Contact' },
  { href: '/garden/', label: 'Garden' },
];

/** Secondary experiment — kept out of the primary section anchors. */
const playLink = { href: '/play/', label: 'Play' };

export function SiteNav() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled
          ? 'border-foreground/15 bg-background'
          : 'border-transparent bg-background/90'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="/#top" className="font-mono text-xs tracking-wide uppercase">
          G. Michoulis
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href={playLink.href}
            className="font-mono text-xs text-muted-foreground/70 uppercase transition-colors hover:text-foreground"
            title="Ledger Run — experimental platformer resume"
          >
            {playLink.label}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden rounded-none sm:inline-flex">
            <a href="/#contact">Contact</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-none md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,18rem)] rounded-none">
              <SheetHeader>
                <SheetTitle className="font-mono text-sm uppercase">Index</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4 border-t border-foreground/15 pt-6">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="font-mono text-sm uppercase"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={playLink.href}
                  className="font-mono text-sm text-muted-foreground uppercase"
                  title="Ledger Run — experimental platformer resume"
                  onClick={() => setOpen(false)}
                >
                  {playLink.label}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
