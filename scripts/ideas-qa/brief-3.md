# Round-3 brief (tech and craft baseline for all WebGL rounds)

## Tech (single self-contained HTML file)
- three.js via importmap from jsdelivr, pinned (verified URLs):
  - `https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js`
  - `https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/` (addons)
  - GSAP 3.12.5 + ScrollTrigger: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`, `…/ScrollTrigger.min.js`
  - Lenis: `https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js`
  - Physics: `https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js`
- Raw WebGL/GLSL is fine. Write your own shaders. If you adapt a known technique, write the code
  yourself and credit the technique in a comment.
- Google Fonts are fine (banned voices as in brief.md). No external assets beyond brief.md's list.
  Procedural everything else.

## Craft
- Colour, light and glow are allowed when they come from the scene. Commit to a sophisticated palette.
- Micro-interactions and states are polished, and every detail is intentional.
- **Performance:** cap DPR at 2 (1.5 on mobile), pause rendering when hidden or off-screen, target
  60 fps on a laptop, and use lighter settings on mobile.
- **Fallbacks:** reduced motion → a still, beautiful frame and readable content. No WebGL → a static
  fallback and the page still works.
- **Accessibility:** canvas `aria-hidden="true"`, all text is real HTML (selectable), visible focus, AA contrast.
- **Pointer:** it may affect the scene LOCALLY. It must NEVER tilt, orbit or follow the camera
  (that caused George nausea).
