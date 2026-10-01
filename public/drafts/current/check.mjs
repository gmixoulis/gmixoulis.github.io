// With the Astro preview running: node public/drafts/current/check.mjs
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const output = await mkdtemp(join(tmpdir(), 'current-draft-'));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, userDataDir: join(output, 'chrome') });
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
try {
 for (const [mode, width, height] of [['desktop',1440,1000],['laptop',1024,768],['tablet',768,1024],['mobile',390,844],['small',320,700],['reduced',1440,1000],['nojs',1440,1000]]) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setCacheEnabled(false);
  await page.setViewport({width,height});
  if(mode === 'nojs') await page.setJavaScriptEnabled(false);
  if(mode === 'reduced') await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  const response = await page.goto('http://127.0.0.1:4321/drafts/current/index.html',{waitUntil:'networkidle0'});
  check(response.ok(),`${mode}: HTTP ${response.status()}`);
  await page.evaluate(()=>document.fonts.ready);
  if(mode !== 'nojs') await new Promise(resolve=>setTimeout(resolve,1300));
  const pageInfo = await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth>innerWidth+1,
   headings:document.querySelectorAll('h1').length,
   images:[...document.images].filter(image=>image.loading!=='lazy').every(image=>image.complete&&image.naturalWidth>0),
   fragments:[...document.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.hash.slice(1))),
   wide:document.documentElement.classList.contains('wide-motion')
  }));
  check(!pageInfo.overflow&&pageInfo.headings===1&&pageInfo.images&&pageInfo.fragments,`${mode}: layout/assets/anchors ${JSON.stringify(pageInfo)}`);
  await page.screenshot({path:join(output,`${mode}-hero.png`)});
  if(pageInfo.wide){
   for(const [step,progress] of [[0,.07],[1,.48],[2,.91]]){
    await page.evaluate(progress=>{const section=document.querySelector('.journey-scroll');scrollTo(0,scrollY+section.getBoundingClientRect().top+progress*(section.offsetHeight-innerHeight));},progress);
    await settle(page);
    const card = await page.evaluate(step=>{
     const all=[...document.querySelectorAll('.chapter')];const el=all[step];const rect=el.getBoundingClientRect();const foot=el.querySelector('.card-foot').getBoundingClientRect();
     return {active:!el.inert,opacity:getComputedStyle(el).opacity,inertCount:all.filter(c=>c.inert).length,clipped:foot.bottom>rect.bottom-8,offscreen:rect.left< -1||rect.right>innerWidth+1||rect.top< -1||rect.bottom>innerHeight+1};
    },step);
    check(card.active&&Number(card.opacity)>.99&&card.inertCount===2&&!card.clipped&&!card.offscreen,`${mode}/card${step}: ${JSON.stringify(card)}`);
    if(mode==='desktop')await page.screenshot({path:join(output,`desktop-card-${step}.png`)});
   }
   await page.click('[data-step="0"]');
   await page.waitForFunction(()=>document.querySelector('[data-step="0"]').hasAttribute('aria-current'));
   await page.click('.ambience-button');
   check(await page.$eval('.scene-ambient',el=>getComputedStyle(el).animationPlayState==='paused'),`${mode}: ambience did not pause`);
   await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
   await settle(page);
   check(await page.evaluate(()=>!document.documentElement.classList.contains('wide-motion')&&[...document.querySelectorAll('.chapter')].every(el=>!el.inert&&getComputedStyle(el).opacity==='1')),`${mode}: live reduced motion failed`);
  }else{
   check(await page.evaluate(()=>[...document.querySelectorAll('.chapter')].every(el=>!el.inert&&getComputedStyle(el).opacity==='1')),`${mode}: cards not readable`);
  }
  await page.evaluate(()=>document.querySelector('#contact').scrollIntoView());
  if(mode!=='nojs'){ await settle(page); await page.$eval('.contact-image img', image=>image.decode()); }
  check(await page.evaluate(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0)),`${mode}: lazy image failed to load`);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${mode}: overflow at contact`);
  if(mode==='mobile'||mode==='desktop')await page.screenshot({path:join(output,`${mode}-contact.png`)});
  check(!errors.length,`${mode}: runtime errors ${errors.join('; ')}`);
  console.log(mode,JSON.stringify(pageInfo));
  await page.close();
 }
}finally{await browser.close();}
await writeFile(join(output,'results.json'),JSON.stringify({failures,output},null,2));
console.log(JSON.stringify({failures,output},null,2));
assert.equal(failures.length,0,'Current draft checks failed');
