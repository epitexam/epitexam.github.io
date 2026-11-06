/**
 * hero-canvas — Dotted planet & starfield canvas animation.
 *
 * Responsive: runs on all screens. Below laptop (< 1024px) we switch to a
 * "compact" staging: single smaller planet pinned top-right away from text,
 * bigger dots, tilted ring, no second planet. On phones (< 768px) we render
 * a single static frame (no rAF loop) with capped DPR. Mouse parallax needs
 * a fine pointer and hover support. Renders a single static frame under
 * `prefers-reduced-motion`, and pauses offscreen or in hidden tabs.
 *
 * Expects a `<canvas id="am-canvas">` element in the DOM whose parent
 * element acts as the full-size hero container. The function returns a
 * cleanup callback that removes all listeners and cancels the animation
 * frame, so it can be safely destroyed before an Astro page swap.
 *
 * Performance architecture (v2 — see "Design notes" at the bottom):
 *
 * - Stars: pre-rendered once per setup into an offscreen layer and blitted
 *   with ONE drawImage per frame (parallax = layer offset). Only a handful
 *   of "twinklers" keep a per-star animation. Removes up to ~500 fillRect
 *   and ~500 globalAlpha changes per frame.
 *
 * - Planet spheres: still pre-rendered offscreen at device-pixel scale,
 *   but now cached by (radius bucket, color, theme, layout, dpr). Resizes
 *   that land in the same radius bucket reuse the sprite instead of
 *   re-plotting ~18k dots (width-only drags used to regenerate everything).
 *
 * - Rings: per-dot rendering kept ON PURPOSE. A "rotating sprite" ring
 *   (1 drawImage instead of ~1600 fillRects) was evaluated and rejected
 *   for two mathematical reasons — see the design notes.
 *
 * - Scene rebuilds are deferred while the tab is hidden, and the animation
 *   phase (startTime) survives resize/theme rebuilds so the rings no
 *   longer visibly "jump" when the theme toggles.
 *
 * Usage (Astro, with View Transitions / <ClientRouter />):
 *
 *   import { initHeroCanvas } from "~/scripts/hero-canvas";
 *
 *   let cleanup: (() => void) | undefined;
 *   const start = () => { cleanup = initHeroCanvas(); };
 *   const stop = () => { cleanup?.(); cleanup = undefined; };
 *
 *   document.addEventListener("astro:page-load", start);
 *   document.addEventListener("astro:before-swap", stop);
 *
 * `astro:page-load` fires on the initial load AND after every swap, so the
 * hero restarts when navigating back to a page that contains it. Without
 * <ClientRouter />, a single `initHeroCanvas()` call is enough (full page
 * loads tear everything down anyway).
 */

type RGB = { r: number; g: number; b: number };

/** 2D light direction of the planet (non-zero vector). */
type LightDir = readonly [number, number];

type RingPoint = { baseT: number; rad: number; alpha: number };

/** Projected ring positions, computed once per frame then reused
 *  by both passes (back + front): halves the cos/sin work. */
type RingLayout = { x: Float32Array; y: Float32Array; depth: Float32Array };

/** A ring: alpha-sorted points + reusable projection buffers + the
 *  tilt trig and angular speed precomputed at setup. */
type RingData = {
  points: RingPoint[];
  layout: RingLayout;
  sinTilt: number;
  cosTilt: number;
  speed: number;
};

type Star = {
  x: number;
  y: number;
  a: number;
  speed: number;
  phase: number;
};

/** Minimal typing for requestIdleCallback (missing from some lib.dom). */
interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
}
interface WindowWithIdleCallback {
  readonly requestIdleCallback?: (
    callback: (deadline: IdleDeadline) => void,
    options?: { timeout: number },
  ) => number;
  readonly cancelIdleCallback?: (handle: number) => void;
}

/** Defensive caps: bound memory/CPU on exotic viewports
 *  (extreme zoom, 8K, mis-sized hero). Invisible to the naked eye. */
const MAX_PLANET_RADIUS = 640;
const MAX_STARS = 500;
const MAX_CANVAS_BACKING = 4096;
/** Retry budget when the hero is never laid out
 *  (e.g. `display: none`): avoids an infinite rAF loop. */
const MAX_START_ATTEMPTS = 90;

/** Radius quantization (px) for the sphere-sprite cache: resizes that land
 *  in the same bucket reuse the cached sprite instead of re-plotting its
 *  ~18k dots. 16px steps are invisible while dragging a window. */
const RADIUS_BUCKET_STEP = 16;
/** Sprite-cache ceiling, in canvases: one live scene (2 spheres) is enough
 *  for the resize win. A theme flip rebuilds once (~30ms) instead of
 *  hoarding a second full-color set — peak memory stays identical to v1. */
const MAX_SPRITE_CACHE = 2;
/** Parallax slack for the star layer: stars shift by px*10 with
 *  px ∈ [−0.5, 0.5], so ±5px + margin. */
const STAR_MARGIN = 16;
/** Stars that keep an individual twinkle animation on top of the layer. */
const MAX_TWINKLERS = 48;
/** Base alpha for layer-baked stars. The old per-star twinkle averaged
 *  0.5·a over time; 0.6 reads slightly brighter to compensate for the
 *  lost shimmer. Tune to taste. */
const STATIC_STAR_ALPHA = 0.6;
/** Ring angular speeds (rad/ms) — same values as before the refactor. */
const RING1_SPEED = 0.00008;
const RING2_SPEED = -0.00012;

/**
 * Alpha quantization step (5%). Visually invisible (±0.025), but it lets
 * the sphere side reuse a handful of `fillStyle` strings instead of
 * allocating one per dot, and the ring side (alpha-sorted) touch
 * `globalAlpha` only once per bucket instead of once per dot —
 * state changes are expensive.
 */
const ALPHA_STEP = 0.05;
const quantizeAlpha = (a: number): number => {
  if (!Number.isFinite(a)) return 1;
  const q = Math.min(1, Math.max(0, Math.round(a / ALPHA_STEP) * ALPHA_STEP));
  // Avoid float dust (0.30000000000000004) in rgba strings.
  return Math.round(q * 1000) / 1000;
};

export const initHeroCanvas = (): (() => void) | undefined => {
  // instanceof narrowing: safe even if another element bears this id.
  const el = document.getElementById("am-canvas");
  const hero = el?.parentElement;
  if (!(el instanceof HTMLCanvasElement) || !hero) return;
  const canvas = el;
  // getContext may return null (lost/unavailable context).
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Parallax only makes sense with a real pointer you can hover with
  // (skips touch AND pen-only devices).
  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const staticMode = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /** Fallback color when `--text` is missing or invalid. */
  const FALLBACK_TEXT: RGB = { r: 237, g: 237, b: 237 };

  /**
   * Read the text color from the CSS `--text` custom property.
   * Hardened: exact 3-channel format, integers clamped to 0–255. Without
   * this, an invalid value yields a silently ignored canvas `fillStyle`
   * (invisible planets/rings, mute bug).
   */
  const getTextColor = (): RGB => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--text")
      .trim();
    const parts = raw.split(",");
    if (parts.length !== 3) return { ...FALLBACK_TEXT };
    const channels: number[] = [];
    for (const part of parts) {
      const v = Number.parseInt(part.trim(), 10);
      if (!Number.isInteger(v)) return { ...FALLBACK_TEXT };
      channels.push(Math.min(255, Math.max(0, v)));
    }
    const [r, g, b] = channels;
    if (r === undefined || g === undefined || b === undefined) {
      return { ...FALLBACK_TEXT };
    }
    return { r, g, b };
  };

  const isLightMode = (): boolean => {
    const themed = document.documentElement.getAttribute("data-theme");
    if (themed === "light") return true;
    if (themed === "dark") return false;
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  };

  /** Hardened devicePixelRatio: some embeds/iframes report 0/NaN. */
  const getDevicePixelRatio = (): number => {
    const raw = window.devicePixelRatio;
    return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? raw : 1;
  };

  /**
   * Generate an off-screen canvas that renders a sphere made of
   * individual dotted points (a la "planet" look).
   * The offscreen canvas is rendered at device-pixel scale (dpr) so
   * dots stay crisp after the main ctx.setTransform(dpr,...).
   */
  const generateSphereCanvas = (
    radius: number,
    light: LightDir,
    color: RGB,
    alphaBoost: number,
    density = 1,
    dotPx = 2.2,
    dprScale = 1,
  ): HTMLCanvasElement | null => {
    if (!Number.isFinite(radius) || radius <= 0) return null;
    // Minimal padding: dots fit within [−r−dotPx, r+dotPx].
    const padding = dotPx + 2;
    const size = Math.ceil(radius * 2 + padding * 2);
    const sphereCanvas = document.createElement("canvas");
    sphereCanvas.width = Math.ceil(size * dprScale);
    sphereCanvas.height = Math.ceil(size * dprScale);
    const sphereCtx = sphereCanvas.getContext("2d");
    if (!sphereCtx) return null;
    sphereCtx.scale(dprScale, dprScale);
    const centerX = size / 2;
    const centerY = size / 2;

    const dotCount = Math.floor(radius * radius * 0.05 * density);
    // A dozen alpha buckets → a dozen fillStyle strings
    // instead of one per dot (14k allocs on large screens).
    const fillCache = new Map<number, string>();
    const fillFor = (a: number): string => {
      let s = fillCache.get(a);
      if (!s) {
        s = `rgba(${color.r},${color.g},${color.b},${a})`;
        fillCache.set(a, s);
      }
      return s;
    };
    for (let i = 0; i < dotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dotRadius = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(angle) * dotRadius;
      const y = Math.sin(angle) * dotRadius;
      const lum = Math.max(
        0,
        (x / radius) * light[0] + (y / radius) * light[1],
      );
      const rim = 1 - Math.sqrt(Math.max(0, 1 - (dotRadius / radius) ** 2));

      // Directional shading: low but visible "ambient" floor
      // (~0.2), peak at 1.0 on the lit side → ~5x ratio, 3D relief
      // stays crisp in light and dark mode.
      const ambient = 0.13;
      const diffuse = 0.9;
      const alpha = quantizeAlpha(
        (ambient + diffuse * lum * lum * (0.35 + 0.65 * rim)) * alphaBoost,
      );
      if (alpha < 0.08) continue;

      sphereCtx.fillStyle = fillFor(alpha);
      sphereCtx.fillRect(centerX + x, centerY + y, dotPx, dotPx);
    }
    return sphereCanvas;
  };

  /** Generate the dotted points that form a planet's ring.
   *  Alpha-quantized then alpha-sorted: the draw pass touches
   *  `globalAlpha` once per bucket (~12 changes instead of ~1500). */
  const generateRingData = (
    radius: number,
    alphaBoost: number,
    density = 1,
    spread: readonly [number, number] = [1.35, 0.3],
  ): RingPoint[] => {
    const points: RingPoint[] = [];
    const dotCount = Math.floor(radius * 3 * density);
    for (let i = 0; i < dotCount; i++) {
      points.push({
        baseT: Math.random() * Math.PI * 2,
        // Rings stay near their planet; wider spread on compact
        // layouts so the ellipse reads on narrow screens.
        rad: radius * (spread[0] + Math.random() * spread[1]),
        alpha: quantizeAlpha((0.3 + Math.random() * 0.45) * alphaBoost),
      });
    }
    points.sort((a, b) => a.alpha - b.alpha);
    return points;
  };

  /** Bundle a ring's data with its projection buffers and the
   *  tilt/speed values precomputed once (v1 re-derived sin/cos of
   *  the tilt on every frame for no reason). */
  const makeRing = (
    radius: number,
    tilt: number,
    speed: number,
    alphaBoost: number,
    density: number,
    spread: readonly [number, number],
  ): RingData => {
    const points = generateRingData(radius, alphaBoost, density, spread);
    return {
      points,
      layout: {
        x: new Float32Array(points.length),
        y: new Float32Array(points.length),
        depth: new Float32Array(points.length),
      },
      sinTilt: Math.sin(tilt),
      cosTilt: Math.cos(tilt),
      speed,
    };
  };

  /** Project the ring once per frame (1 sin/cos pair per dot).
   *  The result is re-read by the back and front passes. */
  const layoutRing = (ring: RingData, time: number): void => {
    const { points, layout, sinTilt, cosTilt, speed } = ring;
    const rot = time * speed;
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const angle = point.baseT + rot;
      const z = Math.sin(angle) * point.rad;
      layout.x[i] = Math.cos(angle) * point.rad;
      layout.y[i] = -z * sinTilt;
      layout.depth[i] = z * cosTilt;
    }
  };

  /** Draw one ring pass from the precomputed layout.
   *  Single fillStyle, globalAlpha mutated only on bucket change
   *  (sorted points): zero string allocs per frame. */
  const drawRingPass = (
    ring: RingData,
    centerX: number,
    centerY: number,
    radius: number,
    renderBack: boolean,
    dotPx = 2.0,
  ): void => {
    const { points, layout } = ring;
    const r2 = radius * radius;
    ctx.fillStyle = flatFill;
    let lastAlpha = -1;
    for (let i = 0; i < points.length; i++) {
      const depthZ = layout.depth[i];
      if (renderBack) {
        if (depthZ >= 0) continue;
        const x = layout.x[i];
        const y = layout.y[i];
        if (x * x + y * y < r2) continue;
      } else {
        if (depthZ < 0) continue;
      }
      const a = points[i].alpha;
      if (a !== lastAlpha) {
        ctx.globalAlpha = a;
        lastAlpha = a;
      }
      ctx.fillRect(centerX + layout.x[i], centerY + layout.y[i], dotPx, dotPx);
    }
    ctx.globalAlpha = 1;
  };

  let w = 0,
    h = 0,
    dpr = 1;
  let color: RGB = { r: 237, g: 237, b: 237 };
  /** Preallocated solid fillStyle (zero template strings per frame). */
  let flatFill = "rgb(237,237,237)";
  let isLight = false;
  let alphaBoost = 1;
  /** Static star field, pre-rendered once per setup at 1× (dots are
   *  ~1px; the dpr blit keeps them soft and dim — matching the original
   *  look) and blitted in one call per frame. */
  let starLayer: HTMLCanvasElement | null = null;
  /** The few stars that keep a live twinkle on top of the layer. */
  let twinklers: Star[] = [];
  let starPx = 1;

  let sphere1Canvas: HTMLCanvasElement | null = null;
  let rings1: RingData | null = null;
  let radius1 = 0;
  let sphere2Canvas: HTMLCanvasElement | null = null;
  let rings2: RingData | null = null;
  let radius2 = 0;
  let sceneReady = false;

  /**
   * Sphere-sprite cache. Key covers everything the sprite bakes in:
   * which planet (light direction/density), quantized radius, color,
   * theme (alphaBoost), layout (dot size/boost) and dpr (crispness).
   * Bounded to MAX_SPRITE_CACHE canvases (cleared when full), so peak
   * memory stays identical to the uncached version.
   */
  const spriteCache = new Map<string, HTMLCanvasElement>();
  const spriteKey = (kind: string, bucket: number): string =>
    `${kind}:${bucket}:${color.r},${color.g},${color.b}:${isLight ? 1 : 0}:${isCompactLayout ? 1 : 0}:${dpr}`;
  const cachedCanvas = (
    key: string,
    make: () => HTMLCanvasElement | null,
  ): HTMLCanvasElement | null => {
    const hit = spriteCache.get(key);
    if (hit) return hit;
    const made = make();
    // Don't cache failures: the setup retry loop must be able to
    // try again (e.g. transient null getContext).
    if (!made) return null;
    if (spriteCache.size >= MAX_SPRITE_CACHE) spriteCache.clear();
    spriteCache.set(key, made);
    return made;
  };
  /** Quantize a planet radius UP to a bucket boundary so nearby
   *  viewport sizes share one cached sprite. */
  const bucketRadius = (r: number): number =>
    Math.max(
      RADIUS_BUCKET_STEP,
      Math.ceil(r / RADIUS_BUCKET_STEP) * RADIUS_BUCKET_STEP,
    );

  /**
   * Bake the static star field into an offscreen layer (one fillRect
   * per star, ONCE per setup instead of every frame) and pick the
   * subset of stars that keeps an individual twinkle animation.
   * Rebuilding is cheap (~1ms), so no caching needed here.
   */
  const buildStarLayer = (): void => {
    twinklers = [];
    const layer = document.createElement("canvas");
    layer.width = Math.ceil(w + STAR_MARGIN * 2);
    layer.height = Math.ceil(h + STAR_MARGIN * 2);
    const g = layer.getContext("2d");
    if (!g) {
      starLayer = null;
      return;
    }
    const starCount = Math.min(
      MAX_STARS,
      Math.floor((w * h) / (isCompactLayout ? 36000 : 24000)),
    );
    const twinklerCount = Math.min(MAX_TWINKLERS, Math.floor(starCount / 2));
    g.fillStyle = flatFill;
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const a = isLight
        ? 0.14 + Math.random() * 0.28
        : 0.12 + Math.random() * 0.33;
      if (i < twinklerCount) {
        twinklers.push({
          x,
          y,
          a,
          speed: 0.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
        });
      } else {
        g.globalAlpha = a * STATIC_STAR_ALPHA;
        g.fillRect(STAR_MARGIN + x, STAR_MARGIN + y, starPx, starPx);
      }
    }
    g.globalAlpha = 1;
    starLayer = layer;
  };

  let animFrame = 0;
  let inView = true;
  let isCompactLayout = false;
  let isMobileLayout = false;
  let sphereDotPx = 2.2;
  let ringDotPx = 2.0;
  let ringTilt1 = -0.25;
  let ringTilt2 = -0.22;
  let targetMouseX = 0,
    targetMouseY = 0;
  let mouseX = 0,
    mouseY = 0;
  /** Animation epoch. Set ONCE on the first successful setup and never
   *  reset afterwards: resize/theme rebuilds keep the ring rotation and
   *  planet drift phases continuous (v1 reset it in setupScene, which
   *  made the rings visibly "jump" on every theme toggle). */
  let startTime = 0;

  const setupScene = (): boolean => {
    const rect = hero.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    // The hero may not be laid out yet (w/h at 0) when
    // setupScene runs before layout: retry later.
    if (w <= 0 || h <= 0 || !Number.isFinite(w) || !Number.isFinite(h)) {
      sceneReady = false;
      return false;
    }
    // Compact = anything smaller than a laptop: mobile + tablet.
    isCompactLayout = w < 1024;
    isMobileLayout = w < 768;

    // Capped DPR: 1 on mobile (one static frame anyway),
    // 1.5 on desktop — 2x doubled the fillRect/drawImage cost.
    dpr = Math.min(isMobileLayout ? 1 : 1.5, getDevicePixelRatio());
    // Absolute backing-store cap: some browsers refuse
    // (blank canvas) beyond their limits. Mapping preserved via
    // setTransform, just slightly softer in that extreme case.
    canvas.width = Math.max(
      1,
      Math.min(MAX_CANVAS_BACKING, Math.round(w * dpr)),
    );
    canvas.height = Math.max(
      1,
      Math.min(MAX_CANVAS_BACKING, Math.round(h * dpr)),
    );
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    color = getTextColor();
    isLight = isLightMode();
    flatFill = `rgb(${color.r},${color.g},${color.b})`;
    // Text/background contrast is already strong in both themes:
    // boost mostly dark mode (light dots on black need more perceived
    // opacity) and compact (a small planet needs more presence).
    alphaBoost = (isLight ? 1.5 : 1.7) * (isCompactLayout ? 1.15 : 1);

    // Bigger dots on small screens: readable without raising the count.
    sphereDotPx = isCompactLayout ? 3.0 : 2.2;
    ringDotPx = isCompactLayout ? 2.6 : 2.0;
    starPx = isCompactLayout ? 1.6 : 1;
    ringTilt1 = isCompactLayout ? -0.42 : -0.25;
    ringTilt2 = -0.22;

    // Star field: one layer blit + a few live twinklers per frame.
    buildStarLayer();

    const m = Math.min(w, h);

    // Planet 1 — on compact: small, pinned top-right away from text.
    // Math.min(w*0.52, h*0.22) keeps it clear of the title.
    // Memory cap on very large viewports. The radius is quantized to
    // RADIUS_BUCKET_STEP so the sphere sprite cache survives most
    // resize drags (width-only resizes don't change min(w,h) at all).
    radius1 = bucketRadius(
      Math.min(
        isCompactLayout ? Math.min(w * 0.52, h * 0.22, 220) : m * 0.7,
        MAX_PLANET_RADIUS,
      ),
    );
    sphere1Canvas = cachedCanvas(spriteKey("sphere1", radius1), () =>
      generateSphereCanvas(
        radius1,
        [-0.55, -0.35],
        color,
        alphaBoost,
        isCompactLayout ? 1.1 : 0.9,
        sphereDotPx,
        dpr,
      ),
    );
    if (!sphere1Canvas) {
      sceneReady = false;
      return false;
    }
    rings1 = makeRing(
      radius1,
      ringTilt1,
      RING1_SPEED,
      alphaBoost,
      isCompactLayout ? 1.1 : 0.9,
      isCompactLayout ? [1.45, 0.4] : [1.35, 0.3],
    );

    // Planet 2 — disabled on compact: two huge overlapping
    // spheres = unreadable at 390–820px wide.
    if (isCompactLayout) {
      sphere2Canvas = null;
      rings2 = null;
      radius2 = 0;
    } else {
      radius2 = bucketRadius(Math.min(m * 0.5, MAX_PLANET_RADIUS));
      sphere2Canvas = cachedCanvas(spriteKey("sphere2", radius2), () =>
        generateSphereCanvas(
          radius2,
          [0.55, -0.4],
          color,
          alphaBoost,
          0.9,
          sphereDotPx,
          dpr,
        ),
      );
      // Planet 2 is optional: its absence doesn't block the scene.
      rings2 = sphere2Canvas
        ? makeRing(
            radius2,
            ringTilt2,
            RING2_SPEED,
            alphaBoost,
            0.9,
            [1.35, 0.3],
          )
        : null;
    }

    // Set once — see the `startTime` declaration comment.
    if (startTime === 0) startTime = performance.now();
    sceneReady = true;
    return true;
  };

  /** Blit of the pre-rendered planet sprite (100% dots, no outline). */
  const drawSphere = (
    img: HTMLCanvasElement | null,
    cx: number,
    cy: number,
  ): void => {
    if (!img || !img.width || !img.height) return;
    // img is in device pixels (size*dpr); redraw it at its CSS size.
    const dw = img.width / dpr;
    const dh = img.height / dpr;
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
  };

  const drawFrame = (time: number): void => {
    // The loop may start (IntersectionObserver / visibilitychange)
    // before setupScene ran via requestIdleCallback:
    // ignore frames until the scene is ready.
    if (!sceneReady || !sphere1Canvas || !rings1) return;
    const relativeTime = time - startTime;
    ctx.clearRect(0, 0, w, h);

    const px = (mouseX - w / 2) / w;
    const py = (mouseY - h / 2) / h;

    // --- Background stars ---
    // One blit for the whole static field (parallax = layer offset,
    // exactly the uniform −px*10/−py*10 shift every star had in v1),
    // plus a handful of individually twinkling stars on top.
    if (starLayer) {
      ctx.drawImage(starLayer, -STAR_MARGIN - px * 10, -STAR_MARGIN - py * 10);
    }
    if (twinklers.length > 0) {
      ctx.fillStyle = flatFill;
      for (let i = 0; i < twinklers.length; i++) {
        const star = twinklers[i];
        const twinkle =
          0.5 + 0.5 * Math.sin(relativeTime * 0.001 * star.speed + star.phase);
        ctx.globalAlpha = star.a * twinkle;
        ctx.fillRect(star.x - px * 10, star.y - py * 10, starPx, starPx);
      }
      ctx.globalAlpha = 1;
    }

    // --- Planet 1 ---
    // Desktop: right edge at mid-height. Compact: top-right, above
    // the title, to keep the reading area clear.
    const p1X =
      (isCompactLayout ? w * 0.82 : w * 1.0) -
      px * 40 +
      Math.sin(relativeTime / 3000) * 8;
    const p1Y =
      (isCompactLayout ? h * 0.2 : h * 0.4) -
      py * 40 +
      Math.cos(relativeTime / 3000) * 8;

    // Single projection per frame, reused by both passes.
    layoutRing(rings1, relativeTime);
    drawRingPass(rings1, p1X, p1Y, radius1, true, ringDotPx);
    drawSphere(sphere1Canvas, p1X, p1Y);
    drawRingPass(rings1, p1X, p1Y, radius1, false, ringDotPx);

    // --- Planet 2 (desktop only) ---
    if (sphere2Canvas && rings2) {
      const p2X = w * -0.02 - px * 25 + Math.sin(relativeTime / 4000 + 1) * 6;
      const p2Y = h * 0.74 - py * 25 + Math.cos(relativeTime / 4000 + 1) * 6;

      layoutRing(rings2, relativeTime);
      drawRingPass(rings2, p2X, p2Y, radius2, true, ringDotPx);
      drawSphere(sphere2Canvas, p2X, p2Y);
      drawRingPass(rings2, p2X, p2Y, radius2, false, ringDotPx);
    }

    // Smooth mouse-parallax interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
  };

  let lastFrameTime = 0;
  /** true after cleanup: no pending callback may restart
   *  the animation (Astro page-swap on a detached canvas). */
  let disposed = false;
  let startAttempts = 0;
  /** A rebuild was requested while the tab was hidden: run it on the
   *  next visibilitychange instead of burning CPU into a hidden tab. */
  let pendingSetup = false;
  const loop = (time: number): void => {
    animFrame = 0;
    if (disposed) return;
    // Throttle ~30fps: halves main-thread work,
    // imperceptible for a star/planet backdrop.
    if (time - lastFrameTime >= 33) {
      lastFrameTime = time;
      drawFrame(time);
    }
    animFrame = requestAnimationFrame(loop);
  };

  const play = (): void => {
    // Mobile (<768px): single static frame, never a loop.
    if (
      disposed ||
      staticMode ||
      isMobileLayout ||
      animFrame ||
      !inView ||
      document.hidden
    )
      return;
    if (!sceneReady) return;
    lastFrameTime = 0;
    animFrame = requestAnimationFrame(loop);
  };

  const pause = (): void => {
    cancelAnimationFrame(animFrame);
    animFrame = 0;
  };

  const startAnimation = (): void => {
    if (disposed) return;
    // Hidden tab: the rebuild can wait (scene rebuilds re-plot ~18k
    // dots per sphere when the radius bucket changes).
    if (document.hidden) {
      pendingSetup = true;
      return;
    }
    pause();
    const ok = setupScene();
    if (!ok) {
      // Hero not laid out yet: retry on the next frame,
      // with a budget (avoids an infinite rAF loop when layout fails).
      startAttempts += 1;
      if (startAttempts <= MAX_START_ATTEMPTS) {
        requestAnimationFrame(startAnimation);
      }
      return;
    }
    startAttempts = 0;
    if (staticMode || isMobileLayout) {
      // Reduced motion or mobile: single static frame, no loop.
      drawFrame(performance.now());
    } else {
      play();
    }
  };

  // `window.setTimeout` (DOM) returns a number, unlike Node's
  // setTimeout which may pollute type resolution.
  let resizeTimeout: number | undefined;
  const debouncedDraw = (): void => {
    if (resizeTimeout !== undefined) clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(startAnimation, 150);
  };

  const onMouseMove = (e: MouseEvent): void => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  };

  const onThemeChange = (): void => {
    startAnimation();
  };

  /**
   * Listen to a MediaQueryList with a Safari < 14 fallback (addListener).
   * Returns an unsubscribe function for cleanup.
   */
  const listenMediaQuery = (
    mql: MediaQueryList,
    fn: () => void,
  ): (() => void) => {
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", fn);
      return () => {
        mql.removeEventListener("change", fn);
      };
    }
    const legacy = mql as MediaQueryList & {
      addListener?: (fn: () => void) => void;
      removeListener?: (fn: () => void) => void;
    };
    legacy.addListener?.(fn);
    return () => {
      legacy.removeListener?.(fn);
    };
  };

  /**
   * Schedule startup during main-thread idle, typed without `any`
   * (requestIdleCallback is missing from some lib.dom).
   */
  const scheduleIdle = (cb: () => void, timeoutMs: number): void => {
    const w: WindowWithIdleCallback = window;
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(() => cb(), { timeout: timeoutMs });
    } else {
      window.setTimeout(cb, 100);
    }
  };

  window.addEventListener("resize", debouncedDraw);
  // Mouse parallax needs a hover-capable fine pointer; skip on touch.
  if (hasFinePointer) {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
  }
  const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
  const unlistenTheme = listenMediaQuery(themeMedia, onThemeChange);
  window.addEventListener("theme-change", onThemeChange);

  // Pause when the hero leaves the viewport (battery).
  // Guard for browsers without IntersectionObserver: stay visible.
  let viewObserver: IntersectionObserver | undefined;
  if (typeof IntersectionObserver === "function") {
    viewObserver = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) play();
        else pause();
      },
      { threshold: 0 },
    );
    viewObserver.observe(hero);
  }

  const onVisibilityChange = (): void => {
    if (document.hidden) {
      pause();
    } else if (pendingSetup) {
      // A resize/theme change happened while hidden: rebuild now.
      pendingSetup = false;
      startAnimation();
    } else {
      play();
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  const scheduleStart = (): void => {
    requestAnimationFrame(() => {
      if (disposed) return;
      scheduleIdle(() => {
        if (!disposed) startAnimation();
      }, 1500);
    });
  };
  if (document.readyState === "complete") {
    scheduleStart();
  } else {
    window.addEventListener("load", scheduleStart, { once: true });
  }

  return () => {
    disposed = true;
    pause();
    if (resizeTimeout !== undefined) clearTimeout(resizeTimeout);
    window.removeEventListener("resize", debouncedDraw);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("theme-change", onThemeChange);
    unlistenTheme();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    viewObserver?.disconnect();
  };
};

/*
 * Design notes — why the rings stayed per-dot (v2 refactor)
 *
 * A pre-rendered "ring sprite" (one drawImage per pass instead of ~1600
 * fillRects) was evaluated and rejected for two reasons:
 *
 * 1. Dot shape. The ring projection is
 *        (x, y) = (cos θ · rad, −sin θ · rad · sinTilt)
 *    i.e. a circle of dots rotated by θ = baseT + rot, then squashed
 *    vertically by sinTilt ≈ 0.25. Blitting a sprite with
 *    translate → scale(1, s) → rotate reproduces the dot POSITIONS
 *    exactly — but the non-uniform scale also squashes every 2px dot
 *    into a 2px × 0.5px sliver: the dotted ring turns into streaks.
 *    Pre-compensating is impossible because the required per-dot shape
 *    depends on the per-frame rotation angle.
 *
 * 2. Depth split. Which dots pass in FRONT of the planet is decided in
 *    SCREEN space (depth = sin θ · rad · cosTilt ≥ 0, a fixed half-plane),
 *    while a sprite's two halves rotate with it. (Fixable with a
 *    screen-space half-plane clip — but reason 1 still stands.)
 *
 * The per-dot pass is already close to optimal for Canvas2D: positions
 * project once per frame into reusable Float32Arrays, points are
 * alpha-sorted so `globalAlpha` changes ~12 times per pass instead of
 * once per dot, and there is a single fillStyle. ~3.2k small fillRects
 * at 30fps costs a few ms per frame on desktop and pauses offscreen and
 * in hidden tabs. If that ever becomes the site's bottleneck, the next
 * step is OffscreenCanvas in a Web Worker (Safari 16.4+), not sprites.
 */
