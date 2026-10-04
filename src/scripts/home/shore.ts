/* The light theme's stage (plan 011): a calm Aegean shore. One WebGL 1 fullscreen triangle draws sand everywhere and,
   only around the four [data-stage] slots, clear turquoise water with sunlight caustics (warped Voronoi edges, two
   layers, brighter where they cross); the hero and Contact slots also get a golden sun glint broken by the ripples.
   An olive tree leans over the page corners: two canvas-2D layers of swaying branches, multiplied over the page as
   soft blue shade (CSS), shown only while the hero or Contact is on screen. The shade also goes to the shader as a
   mask, so the caustics and glints exist only in the sunlit gaps. Nothing moves behind body text. Loaded by main.ts
   the first time the page is light; it draws nothing while the page is dark. */
import type { Stage } from './main';

const FS = `precision highp float;
uniform vec2 uRes;uniform float uDpr,uTime,uScroll;uniform vec3 uBg;
uniform vec4 uRect[4];uniform float uOn[4],uK[4],uSun[4];uniform sampler2D uShade;
float sdRR(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 hash2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float voro(vec2 x,float t){vec2 n=floor(x),f=fract(x);float m1=8.,m2=8.;
  for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=hash2(n+g);o=.5+.42*sin(t+6.2831*o);vec2 r=g+o-f;float d=dot(r,r);
    if(d<m1){m2=m1;m1=d;}else if(d<m2){m2=d;}}
  return sqrt(m2)-sqrt(m1);}
float caus(vec2 P,float t){vec2 w=P+1.1*vec2(vn(P*.9+t*.3)-.5,vn(P*.9-t*.27+7.)-.5);w+=.35*vec2(vn(w*2.3-t*.4)-.5,vn(w*2.3+t*.35+3.)-.5);
  return pow(1.-smoothstep(0.,.11,voro(w,t)),2.6);}
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uDpr;
  float focus=0.;
  for(int i=0;i<4;i++){if(uOn[i]<.5)continue;vec4 r=uRect[i];
    focus=max(focus,(1.-smoothstep(-60.,320.,sdRR(p-r.xy-r.zw*.5,r.zw*.5+40.,64.)))*uK[i]);}
  vec3 o=uBg*(.988+.024*vn((p+vec2(0.,uScroll))*.45));
  if(focus>.001){
    float t=uTime*.3;vec2 P=(p+vec2(0.,uScroll*.35))/170.;
    float lit=1.-smoothstep(.04,.55,texture2D(uShade,p*uDpr/uRes).a);
    float c1=caus(P,t),c2=caus(P*1.37+vec2(3.1,1.7),t*1.15+1.),C=min(c1*.5+c2*.35+c1*c2*1.6,1.3)*lit;
    o*=mix(vec3(1.),vec3(.74,.91,.97),.7*focus);
    o+=C*focus*focus*vec3(1.,.95,.8)*.225;
    for(int i=0;i<4;i++){if(uOn[i]<.5||uSun[i]<=0.)continue;vec4 r=uRect[i];float R=uSun[i]*r.w;
      vec2 q=p-r.xy-r.zw*.5+R*.24*vec2(vn(p*.016+t*1.4)-.5,vn(p*.016-t*1.2+3.)-.5)*2.;
      float l=length(q*vec2(1.,1.3)),sh=.35+.65*lit;
      float disc=(1.-smoothstep(R*.55,R,l))*(.25+1.6*C)+(1.-smoothstep(0.,R*.45,l))*.9;
      o=mix(o,vec3(1.,.80,.36),exp(-pow(l/(R*2.6),2.))*.62*sh);
      o=mix(o,vec3(1.,.93,.66),exp(-pow(l/(R*1.15),2.))*.7*sh);
      o=mix(o,vec3(1.,.995,.97),clamp(disc,0.,1.)*(.25+.75*lit));}
  }
  o+=(hash(p+fract(uTime))-.5)/255.;
  gl_FragColor=vec4(clamp(o,0.,1.),1.);
}`;

/* slot strength by [data-stage] id: the hero and Contact get full water and a sun glint (radius as a share of the
   slot's height); the Skills tile and Research only a faint wash */
const SLOT = (id: number) => (id === 0 || id === 9 ? { k: 1, sun: id ? 0.26 : 0.3 } : { k: 0.45, sun: 0 });

/* olive branches: x, y (viewport share), heading (rad, 0 = right, y down), length (width share), layer (0 far, 1 near), bend */
const BRANCHES = [[1.03, -0.05, 2.45, 0.42, 1, 0.5], [-0.04, -0.06, 0.62, 0.36, 1, -0.45], [1.04, 0.32, 2.95, 0.28, 0, -0.35]];
const SCALE = 0.5; // the shade is drawn at half resolution and blurred anyway
type Leaf = { s: number; side: number; L: number; W: number; a: number; ph: number };
type Branch = { len: number; ph: number; leaves: Leaf[]; twigs: { s: number; side: number; a: number; b: Branch }[] };

function olive(layers: HTMLCanvasElement[]) {
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const make = (len: number, depth: number): Branch => {
    const b: Branch = { len, ph: rnd() * 6.28, leaves: [], twigs: [] }, n = Math.floor(len / 22);
    for (let i = 2; i <= n; i++) b.leaves.push({ s: i / n, side: i % 2 ? 1 : -1, L: 40 + rnd() * 28, W: 6.5 + rnd() * 4.5, a: 0.45 + rnd() * 0.5, ph: rnd() * 6.28 });
    if (!depth) for (const s of [0.32, 0.55, 0.74]) b.twigs.push({ s, side: rnd() < 0.5 ? 1 : -1, a: 0.5 + rnd() * 0.4, b: make(len * (0.32 + rnd() * 0.2), 1) });
    return b;
  };
  const leaf = (c: CanvasRenderingContext2D, x: number, y: number, ang: number, len: number, wid: number) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), P = (u: number, v: number): [number, number] => [x + ca * u - sa * v, y + sa * u + ca * v];
    c.beginPath(); c.moveTo(...P(0, 0));
    c.bezierCurveTo(...P(len * 0.25, wid), ...P(len * 0.7, wid * 0.85), ...P(len, 0));
    c.bezierCurveTo(...P(len * 0.7, -wid * 0.85), ...P(len * 0.25, -wid), ...P(0, 0)); c.fill();
  };
  const branch = (c: CanvasRenderingContext2D, b: Branch, x: number, y: number, h: number, bend: number, t: number, w0: number) => {
    const steps = 24, ds = b.len / steps;
    const sway = 0.05 * Math.sin(t * 0.55 + b.ph) + 0.025 * Math.sin(t * 1.7 + b.ph * 2) * (0.6 + 0.4 * Math.sin(t * 0.21));
    const pts: number[][] = [];
    for (let i = 0; i <= steps; i++) { const a = h + bend * (i / steps) + sway * (0.3 + i / steps); pts.push([x, y, a]); x += Math.cos(a) * ds; y += Math.sin(a) * ds; }
    c.lineCap = 'round';
    for (let i = 0; i < steps; i++) { c.lineWidth = w0 * (1 - (i / steps) * 0.8); c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i + 1][0], pts[i + 1][1]); c.stroke(); }
    const at = (s: number) => pts[Math.min(steps, Math.round(s * steps))];
    for (const f of b.leaves) { const [lx, ly, a] = at(f.s); leaf(c, lx, ly, a + f.side * (f.a + 0.13 * Math.sin(t * 2.1 + f.ph)), f.L * SCALE * 2, f.W * SCALE); }
    for (const tw of b.twigs) { const [lx, ly, a] = at(tw.s); branch(c, tw.b, lx, ly, a + tw.side * tw.a, -tw.side * 0.3, t, w0 * 0.55); }
  };
  let trees: Branch[] = [], W = 0, H = 0, blank = false;
  const mask = document.createElement('canvas');
  return {
    mask,
    /* v = 0 (no hero or Contact on screen): the layers are invisible, so only make sure the mask is empty */
    draw(t: number, vw: number, vh: number, v: number) {
      if (!v && blank && vw === W && vh === H) return;
      blank = !v;
      if (vw !== W || vh !== H) {
        W = vw; H = vh; seed = 11;
        for (const c of [...layers, mask]) { c.width = Math.round(W * SCALE); c.height = Math.round(H * SCALE); }
        trees = BRANCHES.map((b) => make(b[3] * W * SCALE, 0));
      }
      const m = mask.getContext('2d')!; m.clearRect(0, 0, mask.width, mask.height);
      if (!v) return;
      layers.forEach((cv, layer) => {
        const c = cv.getContext('2d')!; c.clearRect(0, 0, cv.width, cv.height);
        c.fillStyle = c.strokeStyle = 'rgb(62,82,112)';
        BRANCHES.forEach(([x, y, h, , l, bend], i) => { if (l === layer) branch(c, trees[i], x * cv.width, y * cv.height, h, bend, t * (layer ? 1 : 0.8), layer ? 3.2 : 4.5); });
      });
      /* the shader's mask: both layers, blurred like their CSS (Safari ignores ctx.filter: a slightly crisper mask) */
      m.filter = 'blur(4px)'; m.drawImage(layers[0], 0, 0); m.filter = 'blur(1.5px)'; m.drawImage(layers[1], 0, 0); m.filter = 'none';
    },
  };
}

export function run(S: Stage, cv: HTMLCanvasElement) {
  const root = document.documentElement;
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false });
  if (!gl) throw new Error('no webgl');
  const sh = (type: number, src: string) => {
    const o = gl.createShader(type)!; gl.shaderSource(o, src); gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || 'shader');
    return o;
  };
  const pr = gl.createProgram()!;
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['uRes', 'uDpr', 'uTime', 'uScroll', 'uBg', 'uRect', 'uOn', 'uK', 'uSun', 'uShade'].map((n) => [n, gl.getUniformLocation(pr, n)]));
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  gl.uniform1i(U.uShade, 0);

  const layers = [...document.querySelectorAll<HTMLCanvasElement>('.olive')];
  const shade = olive(layers);
  const slots = [...document.querySelectorAll<HTMLElement>('[data-stage]')].slice(0, 4);
  const hero = document.querySelector('.hero'), contact = document.getElementById('contact');
  const dpr = Math.min(devicePixelRatio || 1, matchMedia('(pointer:coarse)').matches ? 1 : 1.5);
  const t0 = performance.now();
  let bg = [1, 1, 1], raf = 0, idle = false, lastKey = '';
  const readBg = () => { const h = getComputedStyle(root).getPropertyValue('--bg').trim().slice(1); bg = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (root.dataset.theme !== 'light') { lastKey = ''; idle = false; return; }
    const vw = innerWidth, vh = innerHeight;
    if (cv.width !== Math.round(vw * dpr) || cv.height !== Math.round(vh * dpr)) { cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); gl.viewport(0, 0, cv.width, cv.height); }
    const R: number[] = [], On: number[] = [], K: number[] = [], Sun: number[] = [];
    let any = false;
    for (const el of slots) {
      const r = el.getBoundingClientRect(), s = SLOT(+el.dataset.stage!), on = r.height > 0 && r.bottom > -320 && r.top < vh + 320;
      any ||= on; R.push(r.left, r.top, r.width, r.height); On.push(+on); K.push(s.k); Sun.push(s.sun);
    }
    while (On.length < 4) { R.push(0, 0, 0, 0); On.push(0); K.push(0); Sun.push(0); }
    /* the shade shows while the hero or Contact is on screen */
    const h = hero?.getBoundingClientRect(), c = contact?.getBoundingClientRect();
    const v = Math.max(h ? Math.min(1, Math.max(0, h.bottom / vh)) : 0, c ? Math.min(1, Math.max(0, (vh - c.top) / vh)) : 0) ** 2;
    layers[0].style.opacity = String(0.18 * v); layers[1].style.opacity = String(0.22 * v);
    /* nothing on screen: one plain frame, then rest. Reduced motion: draw only when the layout moved. */
    const key = `${scrollY}|${vw}|${vh}`;
    if (!any && !v) { if (idle) return; idle = true; } else idle = false;
    if (S.reduced && key === lastKey) return;
    lastKey = key;
    const t = S.reduced ? 4 : (now - t0) / 1000;
    shade.draw(t, vw, vh, v);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, shade.mask);
    gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uDpr, dpr); gl.uniform1f(U.uTime, t); gl.uniform1f(U.uScroll, scrollY);
    gl.uniform3f(U.uBg, bg[0], bg[1], bg[2]);
    gl.uniform4fv(U.uRect, R); gl.uniform1fv(U.uOn, On); gl.uniform1fv(U.uK, K); gl.uniform1fv(U.uSun, Sun);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  readBg(); addEventListener('gm-theme', () => { readBg(); lastKey = ''; });
  raf = requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) { lastKey = ''; raf = requestAnimationFrame(frame); } });
  requestAnimationFrame(() => cv.classList.add('on'));
}
