import { profile } from '@/data/profile';

export type Station = {
  id: string;
  x: number; // world px from left
  label: string;
  title: string;
  body: string;
  hue: 'sky' | 'sun' | 'mint' | 'coral' | 'ink';
};

/** World width in px — scroll maps onto this. */
export const WORLD_W = 5200;
export const GROUND_Y = 78; // % from top of stage for feet

export const stations: Station[] = [
  {
    id: 'start',
    x: 120,
    label: 'LEVEL 1',
    title: `It's-a me, ${profile.short}!`,
    body: profile.thesis,
    hue: 'sky',
  },
  {
    id: 'about',
    x: 720,
    label: 'ABOUT',
    title: profile.location,
    body: profile.about,
    hue: 'mint',
  },
  ...profile.education.map((e, i) => ({
    id: `edu-${i}`,
    x: 1300 + i * 420,
    label: 'ACADEMY',
    title: e.title,
    body: `${e.org} · ${e.when}${e.note ? `\n${e.note}` : ''}`,
    hue: 'sun' as const,
  })),
  ...profile.experience.map((e, i) => ({
    id: `job-${i}`,
    x: 2200 + i * 480,
    label: 'WORK',
    title: e.title,
    body: `${e.org} · ${e.when}\n${e.body}`,
    hue: 'coral' as const,
  })),
  {
    id: 'awards',
    x: 4200,
    label: 'TROPHIES',
    title: 'Highlights',
    body: profile.awards.map((a) => `${a.title} — ${a.org} (${a.when})`).join('\n'),
    hue: 'sun',
  },
  {
    id: 'skills',
    x: 4600,
    label: 'SKILLS',
    title: 'Stack & focus',
    body: profile.roles.join(' · '),
    hue: 'mint',
  },
  {
    id: 'contact',
    x: 5000,
    label: 'GOAL',
    title: 'Say hello',
    body: `${profile.email}\n${profile.socials.map((s) => s.label).join(' · ')}`,
    hue: 'ink',
  },
];

export const socials = profile.socials;
export const email = profile.email;
export const displayName = profile.name;
export const shortName = profile.short;
