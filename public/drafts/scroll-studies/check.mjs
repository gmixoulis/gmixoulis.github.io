// Run with the Astro preview active: node public/drafts/scroll-studies/check.mjs
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const base = 'http://127.0.0.1:4321/drafts/scroll-studies/';
const files = ['index', 'paper-strata', 'deep-field', 'terrarium', 'concrete-light', 'slate-kinetic', 'sumi-cinema'];
const output = await mkdtemp(join(tmpdir(), 'resume-drafts-qa-'));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, userDataDir: join(output, 'chrome') });
const failures = [], reports = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
try {
  for (const name of files) {
    for (const mode of ['desktop', 'mobile', 'reduced', 'nojs']) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setCacheEnabled(false);
      await page.setViewport(mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
      if (mode === 'nojs') await page.setJavaScriptEnabled(false);
      if (mode === 'reduced') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      const response = await page.goto(`${base}${name}.html`, { waitUntil: 'networkidle0' });
      if (mode !== 'nojs') await settle(page);
      check(response.ok(), `${name}/${mode}: HTTP ${response.status()}`);
      const info = await page.evaluate(() => {
        const missing = [...document.querySelectorAll('a[href^="#"]')].filter(a => !a.hash || !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.getAttribute('href'));
        const labels = [...document.querySelectorAll('[aria-labelledby]')].flatMap(el => el.getAttribute('aria-labelledby').split(/\s+/).filter(id => !document.getElementById(id)));
        const images = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src'));
        const hidden = [...document.querySelectorAll('h1,h2,h3,p')].filter(el => {
          if (el.closest('[aria-hidden="true"]')) return false;
          for (let ancestor = el; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return true;
          }
          return false;
        }).map(el => el.textContent.trim());
        return { h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, missing, labels, images, hidden, email: !!document.querySelector('a[href="mailto:gmixoulis@gmail.com"]') };
      });
      check(info.h1 === 1 && info.main === 1, `${name}/${mode}: missing or duplicate landmarks`);
      check(info.scrollWidth <= info.width + 1, `${name}/${mode}: horizontal overflow`);
      check(!info.missing.length && !info.labels.length && !info.images.length, `${name}/${mode}: broken links, labels, or images ${JSON.stringify(info)}`);
      check(name === 'index' || info.email, `${name}/${mode}: no email link`);
      if (mode === 'nojs' || mode === 'reduced') check(!info.hidden.length, `${name}/${mode}: hidden content`);
      if (mode === 'desktop' || mode === 'mobile') await page.screenshot({ path: join(output, `${name}-${mode}.png`) });
      if (name !== 'index' && mode === 'desktop') {
        const original = await page.$eval('[data-parallax], [data-parallax-x]', el => ({ transform: getComputedStyle(el).transform, translate: getComputedStyle(el).translate }));
        await page.evaluate(() => scrollTo(0, 350));
        await settle(page);
        const moved = await page.$eval('[data-parallax], [data-parallax-x]', el => ({ transform: getComputedStyle(el).transform, translate: getComputedStyle(el).translate }));
        check(original.transform === moved.transform, `${name}: authored transform overwritten`);
        check(original.translate !== moved.translate, `${name}: parallax did not move`);
        await page.evaluate(() => dispatchEvent(new Event('scroll')));
        await settle(page);
        const repeated = await page.$eval('[data-parallax], [data-parallax-x]', el => getComputedStyle(el).translate);
        check(moved.translate === repeated, `${name}: motion drifts at identical scroll position`);
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        await settle(page);
        const stopped = await page.$eval('[data-parallax], [data-parallax-x]', el => ({ transform: getComputedStyle(el).transform, translate: getComputedStyle(el).translate }));
        check(stopped.transform === original.transform, `${name}: reduced motion breaks authored layout`);
        check(stopped.translate === 'none' || /^0px( 0px)?$/.test(stopped.translate), `${name}: reduced motion did not clear translation`);
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
        await settle(page);
      }
      if (name === 'concrete-light') {
        const active = await page.$eval('.film', el => el.getAttribute('data-filmstrip') === 'on');
        check(active === (mode === 'desktop'), `${name}/${mode}: incorrect horizontal-scroll mode`);
        if (active) {
          for (const end of [false, true]) {
            await page.evaluate(end => {
              const section = document.querySelector('.film');
              const top = section.getBoundingClientRect().top + scrollY;
              scrollTo(0, end ? top + section.offsetHeight - innerHeight : top + section.querySelector('.head').offsetHeight);
            }, end);
            await settle(page);
            const state = await page.evaluate(() => {
              const track = document.querySelector('.film-track');
              const last = track.lastElementChild.getBoundingClientRect();
              return { x: new DOMMatrixReadOnly(getComputedStyle(track).transform).m41, lastRight: last.right, width: innerWidth };
            });
            check(end ? state.lastRight <= state.width + 2 : Math.abs(state.x) < 2, `${name}: incorrect filmstrip ${end ? 'end' : 'start'}`);
          }
        }
      }
      check(!errors.length, `${name}/${mode}: ${errors.join('; ')}`);
      reports.push({ name, mode, ...info, errors });
      console.log(`${name.padEnd(16)} ${mode.padEnd(7)} ${info.width}/${info.scrollWidth}px`);
      await page.close();
    }
  }
} finally { await browser.close(); }
await writeFile(join(output, 'report.json'), JSON.stringify({ reports, failures }, null, 2));
console.log(JSON.stringify({ checks: reports.length, failures, output }, null, 2));
assert.equal(failures.length, 0, 'Draft browser checks failed');
