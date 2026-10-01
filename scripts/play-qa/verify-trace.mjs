import fs from 'node:fs';
import assert from 'node:assert/strict';
const trace = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const frames = trace.frames, last = frames.at(-1);
assert.deepEqual(trace.errors, []);
assert(last.y >= 24000 && last.movement === 'not moving 2', 'Reach contact');
const pauses = [];
for (const f of frames) {
  if (f.canMove) continue;
  if (!pauses.length || f.t - pauses.at(-1).at(-1).t > 100) pauses.push([]);
  pauses.at(-1).push(f);
}
const climb = pauses.find(p => !p[0].boarding);
assert(climb, 'Climb must fire');
const climbMs = climb.at(-1).t - climb[0].t;
assert(climbMs >= 1200 && climbMs <= 1600, 'Climb duration');
assert.equal(new Set(climb.map(f => f.y)).size, 1, 'Scrolling pauses on ladder');
assert.deepEqual([...new Set(climb.map(f => f.frame))].sort(), [6, 7]);
const ladderError = Math.max(...climb.map(f => Math.abs(f.inner.x + 99 - f.ladder.x - f.ladder.w / 2)));
assert(ladderError <= 10, 'Ale must be between the rails');
assert(last.y > climb[0].y + 1000, 'Held key resumes after climb');
assert.deepEqual([...new Set(frames.filter(f => f.y > 200 && f.y < 3000).map(f => f.frame))].sort(), [1, 2]);
const boarding = frames.filter(f => f.boarding);
assert(boarding.length > 5 && new Set(boarding.map(f => f.y)).size === 1, 'Boarding glides while scrolling pauses');
const headError = f => Math.hypot(f.inner.x + 102 - f.rocket.x - 166, f.inner.y + 76 - f.rocket.y - 201);
assert(Math.max(...boarding.map(headError)) > 100, 'Boarding must animate from ground height');
const seated = frames.filter(f => f.seated && !f.boarding);
const seatError = Math.max(...seated.map(headError));
assert(seatError < 1, 'Head stays centred in porthole');
assert(seated.every(f => f.glassClip === 'circle(81px at 166px 201px)' && f.headClip === 'circle(36px at 102px 76px)' && f.inner.h === 108), 'Glass and head masks stay applied');
assert(frames.some(f => f.flying && f.flameOpacity > 0.9), 'Visible exhaust during flight');
assert(!last.flying && last.flameOpacity === 0 && last.seated, 'Land with flame off and Ale seated');
assert(trace.calls.some(c => c.name === 'aleHandsUp'), 'Wave at contact');
assert.equal(trace.ribbonRocketPixels, 0, 'Social ribbon must clear every opaque rocket pixel');
assert(last.contact.x + last.contact.w < last.links.x && last.button.x + last.button.w < last.links.x, 'Social ribbon clears form and button');
const ribbonClearance = [0, 1, 2].map(i => {
  const settled = frames.filter(f => f.movement === 'horizontal' && f.plates[i].x + f.plates[i].w > 0 && f.plates[i].x < 900 && Math.abs(f.plates[i].y - (635 * 0.8 - 150 - f.plates[i].h)) < 0.5);
  assert(settled.length, `Plate ${i + 1} must settle during play`);
  return Math.min(...settled.map(f => f.plates[i].ribbon.y));
});
assert(Math.min(...ribbonClearance) >= 0, 'LEVEL 3 ribbons clear the top at 900×635');
let end = 0;
const gaps = [];
for (const f of trace.features) {
  if (f.start > end) gaps.push({ from: end, to: f.start, size: f.start - end });
  end = Math.max(end, f.end);
}
if (end < trace.worldWidth) gaps.push({ from: end, to: trace.worldWidth, size: trace.worldWidth - end });
const maxGap = Math.max(...gaps.map(g => g.size));
assert(maxGap <= 600, 'No world gap over 600px between landmarks, skills, animals, or platforms');
const report = { status: 'PASS', frames: frames.length, lastScroll: last.y, consoleErrors: 0, climbMs, ladderError, seatError, ribbonRocketPixels: trace.ribbonRocketPixels, ribbonClearance, maxGap };
fs.writeFileSync(process.argv[2].replace('trace.json', 'verification.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
