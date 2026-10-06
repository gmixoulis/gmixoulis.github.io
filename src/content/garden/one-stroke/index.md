---
title: One stroke, no corrections
date: 2026-09-01
description: What drawing an ensō in one stroke taught me about shipping code. Don't go back over the thin part, leave the gap, and call it done.
tags: [craft]
cover: ./enso.png
coverAlt: "A single brushed ensō circle in black sumi ink, left open where the brush ran dry."
kanji: 円
---

An ensō is drawn in a single breath. You do not go back over the thin part.
The dry gaps where the brush ran out of ink are the point.

Most of my worst code came from going back over the thin part.

```ts
// leave the gap
export const draw = (brush: Brush) => brush.stroke({ passes: 1 });
```

The circle is closed or it is not. Either way it is done.
