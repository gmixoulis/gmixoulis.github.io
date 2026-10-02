/* The stage: an iridescent 2×2×2 "genesis" block on a glossy floor under a light beam, hash-linked to a short
   chain of smaller blocks that a pulse travels along. Techniques: instanced RoundedBox cubelets with a custom
   thin-film interference shader (optical path difference → per-channel cosine, the usual Airy-style
   approximation), procedural softbox environment (a dark stage, or a white studio with black flags in the light
   theme), seam glow from an inner core, mirrored instanced draw for the floor reflection, additive volumetric
   beam and dust, UnrealBloom (dark theme only). Loaded by main.ts after first paint. */
import {
  AdditiveBlending, BackSide, BufferAttribute, BufferGeometry, Color, CylinderGeometry, DoubleSide, Group, HalfFloatType,
  InstancedBufferAttribute, InstancedMesh, Matrix4, Mesh, PerspectiveCamera, PlaneGeometry, Points, Quaternion, Scene,
  ShaderMaterial, SphereGeometry, Vector2, Vector3, WebGLRenderTarget, WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { Stage } from './main';

export function run(S: Stage, cv: HTMLCanvasElement) {
  const root = document.documentElement;
  const coarse = matchMedia('(pointer:coarse)').matches;
  let mob = innerWidth < 860, W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, mob || coarse ? 1.5 : 2);
  const renderer = new WebGLRenderer({ canvas: cv, antialias: false, powerPreference: 'high-performance' });
  const scene = new Scene(), cam = new PerspectiveCamera(30, 1, 0.1, 100);
  const U = { uTime: { value: 0 }, uHue: { value: 0 }, uCore: { value: 0.5 }, uBeam: { value: 0 }, uDim: { value: 1 }, uChain: { value: 1 }, uP: { value: 0 },
    uLight: { value: 0 }, uL: { value: new Vector3(0, 1, 1) }, uB: { value: new Vector3() }, uBg: { value: new Vector3() }, uPR: { value: dpr } };

  const ENV = `
  vec3 env(vec3 R){
    float a=atan(R.x,R.z);
    float top=smoothstep(.5,1.,R.y)*2.4*uBeam;
    float s1=exp(-pow((a+1.95)*3.,2.))*smoothstep(-.15,.5,R.y)*1.25;
    float s2=exp(-pow((a-1.25)*4.2,2.))*smoothstep(-.25,.6,R.y)*.8;
    float s3=exp(-pow((a-2.9)*2.6,2.))*smoothstep(.0,.7,R.y)*.35;
    float hz=exp(-pow(R.y*7.,2.))*.1;
    float sky=smoothstep(-.05,.9,R.y)*.12*(.4+.6*uBeam);
    return vec3(top+s1+s2+s3+hz+sky);
  }
  vec3 envL(vec3 R){
    float a=atan(R.x,R.z);
    float band=smoothstep(-.3,.05,R.y)*smoothstep(.8,.35,R.y);
    float dome=.5+1.7*smoothstep(.15,.95,R.y);
    float box=exp(-pow((a-.55)*2.6,2.))*smoothstep(.12,.4,R.y)*smoothstep(.95,.62,R.y)*1.5;
    float f1=exp(-pow((a+1.95)*2.4,2.))*band,f2=exp(-pow((a-1.9)*3.,2.))*band*.8;
    float fl=smoothstep(.02,-.4,R.y);float hz=exp(-pow(R.y*6.,2.));
    return vec3((dome+box)*(1.-.9*f1)*(1.-.8*f2)*(1.-.55*fl)*(1.-.3*hz));
  }`;
  /* fade(): dimming toward the background also flattens the highlights (aerial perspective), so a block set back
     behind the text stays a soft shape instead of bright glints */
  const COMMON = `uniform float uTime,uHue,uCore,uBeam,uDim,uChain,uP,uLight;uniform vec3 uL,uB,uBg;
  vec3 fade(vec3 o,float d){vec3 e=o-uBg;return uBg+e*d/(1.+abs(e)*(1.-d)*mix(12.,1.5,uLight));}`;
  const cubeVS = `attribute vec3 aSgn;attribute float aG;varying vec3 vW,vN,vO,vS;varying float vG;
  void main(){vec4 w=modelMatrix*instanceMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal);vO=position;vS=aSgn;vG=aG;gl_Position=projectionMatrix*viewMatrix*w;}`;
  const cubeFS = COMMON + `varying vec3 vW,vN,vO,vS;varying float vG;` + ENV + `
  vec3 film(float c,float d){float ct=sqrt(max(0.,1.-(1.-c*c)/2.1));float o=2.9*d*ct;return .5+.5*cos(6.2831*o/vec3(.65,.53,.45));}
  void main(){
    vec3 N=normalize(vN),V=normalize(cameraPosition-vW);float c=clamp(dot(N,V),0.,1.);vec3 R=reflect(-V,N);
    vec3 a=abs(vO)*2.;float mid=max(min(a.x,a.y),min(max(a.x,a.y),a.z));float edge=smoothstep(.8,.97,mid);
    float th=.42+.09*sin(dot(vO+vS*.5,vec3(2.1,1.7,2.6))+uTime*.12)+.05*sin(vW.y*2.6+uTime*.2)+uHue*.22;
    vec3 fc=film(c,th);fc=mix(vec3(dot(fc,vec3(.333))),fc,.85);
    float F=.04+.96*pow(1.-c,5.);
    vec3 Hh=normalize(uL+V);float nh=max(dot(N,Hh),0.);vec3 sp=(pow(nh,300.)*2.4+pow(nh,26.)*.07)*mix(vec3(1.),fc,.45);
    vec3 g3=exp(-(.5+vO*vS)*17.);vec3 dc=vW-uB;float g=min(g3.x+g3.y+g3.z,1.3)*(.25+exp(-dot(dc,dc)*1.1))*(1.+vG*5.);
    vec3 gc=mix(vec3(.06,.58,1.),vec3(.62,.24,1.),.5+.5*sin(dot(vW,vec3(.9,.6,.4))+uHue*4.));
    vec3 cd=vec3(.007,.007,.009)+env(R)*fc*(.1+.9*F)*1.25+sp+edge*(.04+.3*F+vG*.6)*fc+gc*g*uCore*.5;
    vec3 cl=vec3(.02,.021,.026)+envL(R)*mix(vec3(1.),fc,.2+.45*F)*(.22+.78*F)*1.3+sp+edge*(.08+.25*F)*fc*.5;
    vec3 o=mix(1.-exp(-cd*1.15),1.-exp(-cl*1.15),uLight);
    o=mix(o,gc*.8,uLight*min(g*uCore*.45,.75));
    #ifdef REFL
    o=mix(uBg,o,exp(-max(-vW.y,0.)*.85)*.5);
    #endif
    #ifdef CHAIN
    float dm=uDim*uChain;
    #else
    float dm=uDim;
    #endif
    gl_FragColor=vec4(fade(o,dm),1.);
  }`;
  const mk = (vs: string, fs: string, o: object = {}) => new ShaderMaterial({ uniforms: U, vertexShader: vs, fragmentShader: fs, ...o });
  const geo = new RoundedBoxGeometry(1, 1, 1, mob ? 3 : 5, 0.1);
  const sg = new Float32Array(24);
  for (let i = 0; i < 8; i++) { sg[i * 3] = i & 1 ? 1 : -1; sg[i * 3 + 1] = i & 2 ? 1 : -1; sg[i * 3 + 2] = i & 4 ? 1 : -1; }
  /* the chain has room for 6 blocks, one per role in Experience; elsewhere only the first 4 are drawn */
  const NC = 6, cgeo = geo.clone(), csg = new Float32Array(NC * 24);
  for (let k = 0; k < NC * 8; k++) csg.set(sg.subarray((k % 8) * 3, (k % 8) * 3 + 3), k * 3);
  geo.setAttribute('aSgn', new InstancedBufferAttribute(sg, 3)); geo.setAttribute('aG', new InstancedBufferAttribute(new Float32Array(8), 1));
  const aG = new InstancedBufferAttribute(new Float32Array(NC * 8), 1);
  cgeo.setAttribute('aSgn', new InstancedBufferAttribute(csg, 3)); cgeo.setAttribute('aG', aG);
  const cubes = new InstancedMesh(geo, mk(cubeVS, cubeFS), 8);
  const cubesR = new InstancedMesh(geo, mk(cubeVS, cubeFS, { defines: { REFL: 1 } }), 8);
  cubesR.instanceMatrix = cubes.instanceMatrix;
  const chain = new InstancedMesh(cgeo, mk(cubeVS, cubeFS, { defines: { CHAIN: 1 } }), NC * 8);
  const chainR = new InstancedMesh(cgeo, mk(cubeVS, cubeFS, { defines: { CHAIN: 1, REFL: 1 } }), NC * 8);
  chainR.instanceMatrix = chain.instanceMatrix;
  const coreVS = `varying vec3 vW,vN;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
  const coreFS = COMMON + `uniform float uF;varying vec3 vW,vN;void main(){float c=abs(dot(normalize(vN),normalize(cameraPosition-vW)));float k=pow(1.-c,1.5);
    vec3 o=1.-exp(-mix(vec3(.55,.85,1.)*1.4,vec3(.7,.35,1.),k)*uCore*.8*uF);
    o=mix(o,mix(vec3(.2,.42,.95),vec3(.5,.26,.92),k)*(.55+.45*uF),uLight);gl_FragColor=vec4(fade(o,uDim),1.);}`;
  const coreGeo = new RoundedBoxGeometry(0.62, 0.62, 0.62, 3, 0.12);
  const core = new Mesh(coreGeo, new ShaderMaterial({ uniforms: { ...U, uF: { value: 1 } }, vertexShader: coreVS, fragmentShader: coreFS }));
  const coreR = new Mesh(coreGeo, new ShaderMaterial({ uniforms: { ...U, uF: { value: 0.3 } }, vertexShader: coreVS, fragmentShader: coreFS }));
  /* hash-links: thin tubes from each block to the next; uv.y runs from the older block to the newer one */
  const lgeo = new CylinderGeometry(1, 1, 1, 6, 1, true); lgeo.translate(0, 0.5, 0);
  lgeo.setAttribute('aK', new InstancedBufferAttribute(new Float32Array([0, 1, 2, 3, 4, 5]), 1));
  const links = new InstancedMesh(lgeo, mk(`attribute float aK;varying float vY,vK;void main(){vY=uv.y;vK=aK;gl_Position=projectionMatrix*viewMatrix*modelMatrix*instanceMatrix*vec4(position,1.);}`,
    COMMON + `varying float vY,vK;void main(){float u=uP-vK;float p=exp(-pow((vY-u)*5.,2.))*step(-.3,u)*step(u,1.3);
      vec3 o=mix(1.-exp(-(vec3(.2,.26,.46)*.5+vec3(.55,.9,1.)*p*2.2)),mix(vec3(.5,.52,.6),vec3(.16,.28,.9),p),uLight);
      gl_FragColor=vec4(fade(o,uDim*uChain),1.);}`), NC);
  for (const m of [cubes, cubesR, chain, chainR, links]) m.frustumCulled = false;
  const block = new Group(), blockR = new Group(), mirror = new Group();
  block.add(cubes, core); blockR.add(cubesR, coreR); mirror.scale.y = -1; mirror.add(blockR, chainR); scene.add(block, chain, links, mirror);

  const sky = new Mesh(new SphereGeometry(48, 24, 12), mk(
    `varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    COMMON + `varying vec3 vW;void main(){vec3 d=normalize(vW-cameraPosition);
      float h=exp(-pow(d.x*2.2,2.))*smoothstep(-.1,.6,d.y)*.004*uBeam*uDim*(1.-uLight);
      gl_FragColor=vec4(uBg+vec3(h*.8,h*.85,h),1.);}`, { side: BackSide, depthWrite: false }));
  sky.renderOrder = -1; scene.add(sky);
  const floor = new Mesh(new PlaneGeometry(60, 60), mk(
    `varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    COMMON + `varying vec3 vW;void main(){vec2 d=vW.xz-uB.xz;float r2=dot(d,d);float near=smoothstep(3.6,1.,uB.y);
      float pool=exp(-r2*.085)*uBeam;float sh=1.-.8*exp(-r2*.8)*near;
      vec3 dk=uBg+1.-exp(-(vec3(.042,.044,.054)*pool*sh+vec3(.25,.35,.7)*exp(-r2*.45)*uCore*.025)*uDim);
      vec3 lt=uBg*(1.-(.2*exp(-r2*.7)*near+.05*exp(-r2*.12))*uDim);
      gl_FragColor=vec4(mix(dk,lt,uLight),.8);}`, { transparent: true, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.renderOrder = 1; scene.add(floor);

  const beam = new Mesh(new CylinderGeometry(0.5, 1.75, 11, 64, 1, true), mk(
    `varying vec3 vW,vN;varying float vY;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);vY=uv.y;gl_Position=projectionMatrix*viewMatrix*w;}`,
    COMMON + `varying vec3 vW,vN;varying float vY;void main(){float f=abs(dot(normalize(vN),normalize(cameraPosition-vW)));
      float an=atan(vW.z-uB.z,vW.x-uB.x);
      float a=pow(f,2.6)*smoothstep(0.,.3,vY)*(.25+.75*vY)*(.72+.28*sin(an*7.+uTime*.25)*sin(an*3.-uTime*.17));
      gl_FragColor=vec4(vec3(.72,.8,1.)*a*uBeam*uDim*.032,1.);}`,
    { transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide }));
  beam.position.y = 5.5; beam.renderOrder = 2; scene.add(beam);

  const N = mob || coarse ? 140 : 360, pp = new Float32Array(N * 3), pr = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const y = Math.random() * 9, rad = (2.1 - y * 0.13) * Math.sqrt(Math.random()), an = Math.random() * 6.283;
    pp.set([Math.cos(an) * rad, y, Math.sin(an) * rad], i * 3); pr.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const dg = new BufferGeometry(); dg.setAttribute('position', new BufferAttribute(pp, 3)); dg.setAttribute('aR', new BufferAttribute(pr, 4));
  const dust = new Points(dg, mk(
    COMMON + `uniform float uPR;attribute vec4 aR;varying float vA;void main(){vec3 p=position;p.y=mod(p.y+uTime*(.04+.07*aR.x),9.)+.15;
      p.x+=sin(uTime*.3+aR.y*6.28)*.12;p.z+=cos(uTime*.25+aR.z*6.28)*.12;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      gl_PointSize=(1.+aR.w*2.2)*uPR*(9./-mv.z);float tw=.5+.5*sin(uTime*(1.+aR.x*2.)+aR.y*20.);
      vA=tw*uBeam*uDim*smoothstep(9.,6.,p.y)*smoothstep(.15,1.,p.y)*max(0.,1.-length(p.xz)/2.3);}`,
    `varying float vA;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(vec3(.85,.9,1.)*smoothstep(.5,0.,d)*vA*.8,1.);}`,
    { transparent: true, depthWrite: false, blending: AdditiveBlending }));
  dust.renderOrder = 3; scene.add(dust);

  const rt = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: dpr >= 2 || mob ? 0 : 4 });
  const composer = new EffectComposer(renderer, rt);
  const bloom = new UnrealBloomPass(new Vector2(256, 256), 0.7, 0.45, 0.32);
  composer.addPass(new RenderPass(scene, cam)); composer.addPass(bloom); composer.addPass(new OutputPass());

  /* scene states per section: ox, oy (screen offset as a share of the viewport), dist, elevation, yaw, tiltX, tiltZ,
     explode, lift, hue, beam, core, dim, chain, chain side (1 recedes right, -1 left). The block never leaves:
     front stagings frame it in their [data-stage] box (hero, skills, research, contact); text-heavy sections put
     it behind the text, further back and dimmer, on the side with less text (dims checked by
     scripts/ideas-qa/legibility.cjs; keep them there when tuning). */
  const KD = [
    [0, 0.195, 13, 0.2, 0, 0, 0, 0, 1.3, 0, 1, 0.8, 1, 1, 1], // hero: genesis block + chain, centred
    [0.4, 0.08, 11, 0.3, 0.8, 0.3, 0.2, 0.3, 1.8, 0.15, 0.2, 0.6, 0.3, 0.4, 1], // about: at the right edge by the quotes; comes apart as you read
    [0.25, 0, 11, 0.3, 1.9, 0.12, -0.14, 0.14, 1.6, 0.32, 0.45, 0.95, 1, 0.35, 1], // soft skills: inside its bento tile
    [0.46, 0.5, 13, 0.2, 2.3, 0.1, -0.1, 0.2, 1.6, 0.4, 0.2, 0.9, 0.22, 1, -1], // experience: low right, a chain block per role
    [-0.3, 0, 14, 0.6, 2.7, 0, 0, 0.15, 1.8, 0.5, 0.6, 1, 1, 0, -1], // research: sticky, left of the papers
    [-0.42, 0.48, 12, 0.5, 3.4, 0.3, 0.2, 0.1, 1.5, 0.68, 0.2, 0.8, 0.22, 0.3, 1], // certificates: left edge under the rail, a face at a time
    [0.42, 0.42, 16, 0.5, 4.1, 0.1, -0.2, 0.12, 1.5, 0.82, 0.2, 0.8, 0.3, 0.3, -1], // projects: low and far back, right
    [-0.4, 0.48, 16, 0.3, 5, 0, 0, 0.3, 1.6, 0.9, 0.3, 0.9, 0.26, 0.3, 1], // activities: drifts along the bottom, left
    [-0.44, 0.5, 17, 0.2, 5.6, 0, 0, 0.35, 1.6, 0.95, 0.4, 1, 0.2, 0.5, 1], // linkedin: left edge under the text column, rising
    [0, 0.52, 16, 0.16, 6.28, 0, 0, 0.4, 1.6, 1, 0.6, 1, 1, 1, 1], // contact: genesis + chain again, rising into its box
  ];
  const NS = KD.length - 1, IDS = ['top', 'about', 'skills', 'work', 'research', 'certificates', 'projects', 'activities', 'linkedin', 'contact'];
  const SEC = IDS.map((id) => document.getElementById(id)), roles = [...document.querySelectorAll<HTMLElement>('#work .blk')];
  /* chain block offsets from the genesis block (x, y, z, scale): receding to one side and back; steeper on phones */
  const CHD = [[2.7, -0.35, -1.3, 0.42], [4.5, -0.55, -3.1, 0.34], [6, -0.7, -5.1, 0.28], [7.3, -0.8, -7.3, 0.23], [8.4, -0.88, -9.6, 0.2], [9.3, -0.94, -12, 0.17]];
  const CHM = [[1.7, -0.35, -2, 0.42], [2.6, -0.55, -4.6, 0.34], [3.2, -0.7, -7.3, 0.28], [3.6, -0.8, -10.2, 0.23], [3.9, -0.88, -13.2, 0.2], [4.1, -0.94, -16.3, 0.17]];
  const anc: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>('[data-stage]').forEach((el) => (anc[+el.dataset.stage!] = el));
  const anchor = (i: number) => {
    const el = anc[i]; if (!el || !el.offsetHeight) return null; const r = el.getBoundingClientRect();
    return { ox: (r.left + r.width / 2) / W - 0.5, oy: (r.top + r.height / 2) / H - 0.5,
      d: Math.min(45, Math.max(9, (4.94 * H) / (0.8 * r.height), (5.41 * H) / Math.min(0.8 * r.width, (mob ? 0.56 : 0.4) * W))) };
  };
  const smoothstep = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  /* a section's state: on phones smaller, dimmer and at an edge, except where the content is full-width opaque
     cards (the roles, the LinkedIn frame): there it sits where it can still show, larger behind the roles (seen
     in the gaps, right of the "prev" labels) and above the frame. A front staging sits in its box, lit, while the
     box is near the middle of the screen, and waits set back at its own row's place as the box scrolls away. */
  const PH: Record<number, number[]> = { 3: [0.3, 0.25, 11, 0.17], 8: [0.3, -0.12, 19, 0.19] }; // ox, oy, dist, dim
  const row = (k: number) => {
    const r = KD[k].slice(), a = anchor(k), front = r[12], ph = PH[k];
    if (a) r[12] = 0.12;
    if (mob && ph) [r[0], r[1], r[2], r[12]] = ph;
    else if (mob) { r[0] = Math.sign(r[0]) * 0.34; r[2] *= 1.3; r[12] *= 0.6; }
    if (a) { const w = 1 - (mob ? smoothstep(0.2, 0.45, Math.abs(a.oy)) : smoothstep(0.42, 0.78, Math.abs(a.oy))); r[0] += (a.ox - r[0]) * w; r[1] += (a.oy - r[1]) * w; r[2] += (a.d - r[2]) * w; r[12] += (front - r[12]) * w; }
    return r;
  };
  /* where the reading is inside section k: 0 as it starts to enter, 1 once the next one has taken over */
  const inside = (k: number) => {
    if (S.reduced) return 0.5;
    const r = SEC[k]!.getBoundingClientRect(); return Math.max(0, Math.min(1, (0.96 * H - r.top) / (r.height + 0.6 * H)));
  };
  let lit = 0, wE = 0;
  const sample = (t: number) => {
    const x = Math.max(0, Math.min(NS, t)), i = Math.min(NS - 1, Math.floor(x)); let f = x - i; f = f * f * (3 - 2 * f);
    const A = row(i), B = row(i + 1), o = A.map((v, j) => v + (B[j] - v) * f), w = (k: number) => (k === i ? 1 - f : k === i + 1 ? f : 0);
    /* between stagings it moves set back, behind whatever text it crosses: it leaves a lit staging quickly, reaches
       the next one late, and dips a little on the way */
    const g = B[12] < A[12] ? 1 - (1 - f) ** 3 : f ** 5;
    o[12] = (A[12] + (B[12] - A[12]) * g) * (1 - 0.3 * Math.sin(Math.PI * f));
    /* motion inside the sections, scrubbed by scroll: bumps that are 0 at both ends, and turns that only add up */
    const u = IDS.map((_, k) => (k && k < NS ? inside(k) : 0)), turn = (k: number, n: number) => { const s = u[k] * n, j = Math.floor(s); return j + smoothstep(0.25, 0.75, s - j); };
    o[7] += w(1) * 1.5 * Math.sin(Math.PI * u[1]); // about: comes apart into its 8 cubes as you read, then back together
    // it turns as you read: a little in each section, and in certificates a face (a quarter turn) at a time
    o[4] += u[1] * 0.6 + u[2] * 0.8 + u[3] * 0.5 + u[4] * 1.4 + (turn(5, 3) * Math.PI) / 2 + u[6] * 0.6 + u[7] * 0.6;
    o[5] += w(5) * 0.14 * Math.sin(Math.PI * u[5] * 3); // the faces tip toward the light like pages
    o[0] += (w(6) + w(7)) * 0.07 * Math.sin(Math.PI * 2 * (u[6] + u[7])); // projects, activities: a slow sway along the bottom
    o[1] -= w(8) * 0.18 * Math.sin((Math.PI / 2) * u[8]); // linkedin: rises toward the contact staging
    /* experience: one chain block lights as each role crosses the reading line */
    wE = w(3); lit = S.reduced ? NC : roles.reduce((n, el) => { const r = el.getBoundingClientRect(); return n + Math.max(0, Math.min(1, (0.62 * H - r.top) / r.height)); }, 0);
    return o;
  };
  let tS = S.reduced ? Math.round(S.t) : S.t;

  const m4 = new Matrix4(), q = new Quaternion(), q2 = new Quaternion(), ax = new Vector3(), p3 = new Vector3(), one = new Vector3(1, 1, 1),
    sc = new Vector3(), dv = new Vector3(), Y = new Vector3(0, 1, 0), L = new Vector3(), G0 = new Vector3(), P = Array.from({ length: NC }, () => new Vector3());
  let px = 0, py = 0;
  function resize() {
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || (w === W && Math.abs(h - H) < 80 && W)) return;
    W = w; H = h; mob = W < 860;
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false); composer.setPixelRatio(dpr); composer.setSize(W, H);
    U.uPR.value = dpr; cam.aspect = W / H;
  }
  function update(dt: number, time: number) {
    const io = S.reduced ? 0 : Math.pow(Math.max(0, 1 - time / 2.1), 3);
    /* reduced motion: one still frame per section, no easing between them */
    tS = S.reduced ? Math.round(S.t) : tS + (S.t - tS) * (1 - Math.exp(-dt * 3.2));
    const cur = sample(tS); if (S.reduced) { cur[7] = Math.max(cur[7], 0.3); cur[11] += 0.3; cur[4] += 0.5; }
    const [ox, oy, d, el, ry, rx, rz, ex, lift, hue, bm, cr, dim, chn, side] = cur;
    const e = ex + io * 2.2, spin = io * 2.4;
    for (let i = 0; i < 8; i++) {
      ax.set(sg[i * 3], sg[i * 3 + 1], sg[i * 3 + 2]);
      p3.copy(ax).multiplyScalar(0.518 + e * 0.34 + io * (i % 3) * 0.25);
      q.setFromAxisAngle(ax.normalize(), e * 0.2 + spin * (i % 2 ? 1 : -1) * 0.5);
      cubes.setMatrixAt(i, m4.compose(p3, q, one));
    }
    cubes.instanceMatrix.needsUpdate = true;
    const bob = S.reduced ? 0 : Math.sin(time * 0.9) * 0.05, y = lift + bob;
    block.position.set(0, y, 0);
    block.rotation.set(rx, ry + (S.reduced ? 0 : time * 0.14) + spin * 0.4, rz, 'YXZ');
    blockR.position.copy(block.position); blockR.quaternion.copy(block.quaternion);
    U.uB.value.set(0, y, 0);
    /* the chain: blocks hang behind the genesis block; a pulse leaves it every few seconds and lights each block it
       reaches. In Experience the pulse follows the reading instead: each role read lights (and past the 4th, adds) a block. */
    const tp = S.reduced ? 2.35 : ((time * 0.4) % 6) - 0.5, up = tp + (lit - tp) * wE, on = chn * dim > 0.004;
    const nb = Math.min(NC, Math.ceil(4 + Math.max(0, lit - 3) * wE - 0.001));
    U.uP.value = up; U.uChain.value = chn; chain.visible = chainR.visible = links.visible = on;
    if (on) {
      const CH = mob ? CHM : CHD; G0.set(0, y, 0);
      chain.count = chainR.count = nb * 8; links.count = nb;
      for (let c = 0; c < nb; c++) {
        const [cx, cy, cz, cs] = CH[c], s = cs * (c < 4 ? 1 : Math.max(0.001, Math.min(1, (lit - c + 1) * wE)));
        const gl = Math.exp(-Math.pow((tp - c - 1) * 2.5, 2)) * (1 - wE) + Math.max(0, Math.min(1, lit - c)) * wE * 0.8;
        P[c].set(cx * side, y + cy + (S.reduced ? 0 : Math.sin(time * 0.8 + c * 1.7) * 0.04), cz);
        q2.setFromAxisAngle(Y, c * 0.9 + (S.reduced ? 0 : time * 0.06));
        for (let i = 0; i < 8; i++) {
          p3.set(sg[i * 3], sg[i * 3 + 1], sg[i * 3 + 2]).multiplyScalar(0.54 * s).applyQuaternion(q2).add(P[c]);
          chain.setMatrixAt(c * 8 + i, m4.compose(p3, q2, sc.setScalar(s))); aG.array[c * 8 + i] = gl;
        }
        const a = c ? P[c - 1] : G0; dv.subVectors(P[c], a); const len = dv.length();
        links.setMatrixAt(c, m4.compose(a, q.setFromUnitVectors(Y, dv.divideScalar(len)), sc.set(0.011, len, 0.011)));
      }
      chain.instanceMatrix.needsUpdate = links.instanceMatrix.needsUpdate = aG.needsUpdate = true;
    }
    cam.position.set(0, y + Math.sin(el) * d, Math.cos(el) * d); cam.lookAt(0, y, 0);
    cam.setViewOffset(W, H, -ox * W, -oy * H, W, H);
    const beamOn = S.reduced ? 1 : Math.min(1, Math.max(0, (time - 0.15) / 1.3));
    const flash = S.reduced ? 0 : Math.exp(-Math.pow((time - 1.75) * 3.2, 2)) * 1.6;
    U.uTime.value = S.reduced ? 3 : time; U.uHue.value = hue; U.uBeam.value = bm * beamOn * beamOn; U.uCore.value = cr + flash; U.uDim.value = dim;
    bloom.strength = 0.7 * dim * dim; // behind the text: less glow as well as less light
    if (S.pointer) { px += (S.px - px) * (1 - Math.exp(-dt * 5)); py += (S.py - py) * (1 - Math.exp(-dt * 5)); }
    else if (!S.reduced) { px = Math.sin(time * 0.23) * 0.6; py = Math.cos(time * 0.17) * 0.3 - 0.2; }
    L.set(-0.3 + px * 1.3, 0.85 - py * 0.8, 0.9).normalize(); U.uL.value.copy(L);
    return dim;
  }

  addEventListener('resize', resize); resize();
  let t0 = performance.now(), last = t0, frames = 0, slow = 0, raf = 0, dark = 0, paused = false;
  /* when the block is fully faded out, stop drawing until it returns */
  const draw = (now: number) => {
    const dt = Math.min(0.25, (now - last) / 1000); last = now;
    const dim = update(dt, (now - t0) / 1000); dark = dim < 0.002 ? dark + 1 : 0; if (dark < 3) composer.render(dt);
  };
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop); const dt = now - last; draw(now);
    if (++frames > 40 && frames < 160) { slow += dt; if (frames === 159 && slow / 119 > 30 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); W = 0; resize(); } }
  };
  /* reduced motion has no loop: a still frame is drawn when the scroll position, size or theme changes */
  const still = () => { if (!raf && !paused) raf = requestAnimationFrame(() => { raf = 0; draw(t0 + 3000); }); };
  const start = () => {
    cancelAnimationFrame(raf); raf = 0; if (paused) return; resize();
    if (S.reduced) still(); else if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  /* the light theme re-lights the scene: white studio, black flags, soft contact shadow, no bloom, beam or dust */
  const BG = [new Color('#0a0a0b'), new Color('#edeef1')];
  const relight = () => {
    const l = root.dataset.theme === 'light' ? 1 : 0;
    U.uLight.value = l; U.uBg.value.set(BG[l].r, BG[l].g, BG[l].b); renderer.setClearColor(BG[l], 1);
    bloom.enabled = !l; beam.visible = dust.visible = !l; dark = 0;
    if (S.reduced) still();
  };
  addEventListener('gm-theme', relight);
  relight();
  if (S.reduced) { addEventListener('resize', still); addEventListener('scroll', still, { passive: true }); }
  document.addEventListener('visibilitychange', start);
  start();
  requestAnimationFrame(() => cv.classList.add('on'));
  /* easy read mode (main.ts) pauses the stage: the loop stops and the GL state is kept for when it is turned off */
  return (p: boolean) => { paused = p; start(); };
}
