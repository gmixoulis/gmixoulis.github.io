import fs from 'node:fs';
import assert from 'node:assert/strict';
const file = 'public/play/dist/animation.min.js';
const source = fs.readFileSync(file, 'utf8');
const before = 'function animateAlien(){$(alienDiv).stop().animate({left:"450px"},300,()=>';
const after = 'function animateAlien(){$(alienDiv).stop().animate({left:[450,"easeOutCubic"]},700,()=>';
assert.equal(source.split(before).length - 1, 1, 'Expected exactly one alien entrance');
fs.copyFileSync(file, 'scripts/play-qa/out/animation.min.js.bak-alien-easing');
fs.writeFileSync(file, source.replace(before, after));
