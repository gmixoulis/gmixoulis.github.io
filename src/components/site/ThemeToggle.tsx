'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Theme = 'system' | 'light' | 'dark';
const STORAGE_KEY = 'gm-theme';

function resolve(theme: Theme): 'light' | 'dark' {
  if (theme === 'light') return 'light';
  if (theme === 'dark') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function apply(theme: Theme) {
  const mode = resolve(theme);
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.style.colorScheme = mode;
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>('system');

  React.useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
    setTheme(saved);
    apply(saved);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const current =
        (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
      if (current === 'system') apply('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const cycle = () => {
    const order: Theme[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
    apply(next);
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={cycle}
      aria-label={`Color theme: ${theme}. Click to cycle.`}
      className="rounded-none"
      title={`Theme: ${theme}`}
    >
      <Icon className="size-4" />
    </Button>
  );
}
