/**
 * hero-canvas — Dotted planet & starfield canvas animation.
 *
 * Responsive: runs on all screens. Below laptop (< 1024px) we switch to a
 * "compact" staging: single smaller planet pinned top-right away from text,
 * bigger dots, tilted ring, no second planet. On phones (< 768px) we render
 * a single static frame (no rAF loop) with capped DPR. Mouse parallax needs a
 * fine pointer. Renders a single static frame under
 * `prefers-reduced-motion`, and pauses offscreen or in hidden tabs.
 *
 * Expects a `<canvas id="am-canvas">` element in the DOM whose parent
 * element acts as the full-size hero container. The function returns a
 * cleanup callback that removes all listeners and cancels the animation
 * frame, so it can be safely destroyed before an Astro page swap.
 *
 * Usage (inside an Astro <script> or onReady callback):
 *
 *   import { initHeroCanvas } from "~/scripts/hero-canvas";
 *
 *   const cleanup = initHeroCanvas();
 *
 *   document.addEventListener("astro:before-swap", () => {
 *     if (cleanup) cleanup();
 *   });
 */

type RGB = { r: number; g: number; b: number };

/** 2D light direction of the planet (non-zero vector). */
type LightDir = readonly [number, number];

type RingPoint = { baseT: number; rad: number; alpha: number };

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

/** Projected ring positions, computed once per frame then reused
 *  by both passes (back + front): halves the cos/sin work. */
type RingLayout = { x: Float32Array; y: Float32Array; depth: Float32Array };

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

type Star = {
    x: number;
    y: number;
    a: number;
    speed: number;
    phase: number;
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

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
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

    const isLightMode = (): boolean =>
        window.matchMedia("(prefers-color-scheme: light)").matches;

    /** Hardened devicePixelRatio: some embeds/iframes report 0/NaN. */
    const getDevicePixelRatio = (): number => {
        const raw = window.devicePixelRatio;
        return typeof raw === "number" && Number.isFinite(raw) && raw > 0
            ? raw
            : 1;
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
        // Before: radius*0.35 → ~2.7r-sided canvas (e.g. ~20MB at dpr 1.5
        // for r=560). Now ~2r: −45% memory and per-frame blit pixels,
        // pixel-identical rendering (transparent borders anyway).
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
            const rim =
                1 - Math.sqrt(Math.max(0, 1 - (dotRadius / radius) ** 2));

            // Directional shading: low but visible "ambient" floor
            // (~0.2: no longer discards the shadowed half as before with
            // base 0.04 + cutoff 0.06), peak at 1.0 on the lit side → ~5x
            // ratio, 3D relief stays crisp in light and dark mode.
            const ambient = 0.13;
            const diffuse = 0.9;
            const alpha = quantizeAlpha(
                (ambient +
                    diffuse * lum * lum * (0.35 + 0.65 * rim)) *
                    alphaBoost,
            );
            if (alpha < 0.08) continue;

            sphereCtx.fillStyle = fillFor(alpha);
            sphereCtx.fillRect(centerX + x, centerY + y, dotPx, dotPx);
        }
        return sphereCanvas;
    };
    /** Generate the dotted points that form a planet's ring. */
    const generateRingData = (
        radius: number,
        alphaBoost: number,
        density = 1,
        spread: readonly [number, number] = [1.35, 0.3],
    ): RingPoint[] => {
        const points: RingPoint[] = [];
        const dotCount = Math.floor(radius * 3 * density);
        for (let i = 0; i < dotCount; i++) {
            // Raised floor: the ring must read on dull screens.
            // Quantized + sorted alpha: the draw pass touches
            // `globalAlpha` once per bucket (~12 changes instead of ~1500).
            points.push({
                baseT: Math.random() * Math.PI * 2,
                // Rings stay near their planet; wider spread on compact
                // layouts so the ellipse reads on narrow screens.
                rad: radius * (spread[0] + Math.random() * spread[1]),
                alpha: quantizeAlpha(
                    (0.3 + Math.random() * 0.45) * alphaBoost,
                ),
            });
        }
        points.sort((a, b) => a.alpha - b.alpha);
        return points;
    };

    /** Project the ring once per frame (1x cos/sin per dot).
     * The result is re-read by the back/front passes. */
    const layoutRing = (
        points: readonly RingPoint[],
        tilt: number,
        rotationSpeed: number,
        time: number,
        layout: RingLayout,
    ): void => {
        const sinTilt = Math.sin(tilt);
        const cosTilt = Math.cos(tilt);
        const rot = time * rotationSpeed;
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
     * Single fillStyle, globalAlpha mutated only on bucket change
     * (sorted points): zero string allocs per frame. */
    const drawRingPass = (
        points: readonly RingPoint[],
        layout: RingLayout,
        centerX: number,
        centerY: number,
        radius: number,
        renderBack: boolean,
        dotPx = 2.0,
    ): void => {
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
    let stars: Star[] = [];
    let starPx = 1;

    let sphere1Canvas: HTMLCanvasElement | null = null;
    let rings1Data: RingPoint[] = [];
    let rings1Layout: RingLayout = {
        x: new Float32Array(0),
        y: new Float32Array(0),
        depth: new Float32Array(0),
    };
    let sphere2Canvas: HTMLCanvasElement | null = null;
    let rings2Data: RingPoint[] = [];
    let rings2Layout: RingLayout = {
        x: new Float32Array(0),
        y: new Float32Array(0),
        depth: new Float32Array(0),
    };
    let sceneReady = false;

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
        dpr = Math.min(
            isMobileLayout ? 1 : 1.5,
            getDevicePixelRatio(),
        );
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
        // opacity) and compact (a small planet needs more presence,
        // not less as before with x0.9).
        alphaBoost = (isLight ? 1.5 : 1.7) * (isCompactLayout ? 1.15 : 1);

        // Bigger dots on small screens: readable without raising the count.
        sphereDotPx = isCompactLayout ? 3.0 : 2.2;
        ringDotPx = isCompactLayout ? 2.6 : 2.0;
        starPx = isCompactLayout ? 1.6 : 1;
        ringTilt1 = isCompactLayout ? -0.42 : -0.25;
        ringTilt2 = -0.22;

        stars = [];
        const starCount = Math.min(
            MAX_STARS,
            Math.floor((w * h) / (isCompactLayout ? 36000 : 24000)),
        );
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                a: isLight
                    ? 0.14 + Math.random() * 0.28
                    : 0.12 + Math.random() * 0.33,
                speed: 0.5 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2,
            });
        }

        const m = Math.min(w, h);

        // Planet 1 — on compact: small, pinned top-right away from text.
        // Math.min(w*0.52, h*0.22) keeps it clear of the title.
        // Memory cap on very large viewports (no practical rendering change:
        // the planet already overflows the hero by far).
        const r1 = Math.min(
            isCompactLayout
                ? Math.min(w * 0.52, h * 0.22, 220)
                : m * 0.7,
            MAX_PLANET_RADIUS,
        );
        sphere1Canvas = generateSphereCanvas(
            r1,
            [-0.55, -0.35],
            color,
            alphaBoost,
            isCompactLayout ? 1.1 : 0.9,
            sphereDotPx,
            dpr,
        );
        if (!sphere1Canvas) {
            sceneReady = false;
            return false;
        }
        rings1Data = generateRingData(
            r1,
            alphaBoost,
            isCompactLayout ? 1.1 : 0.9,
            isCompactLayout ? [1.45, 0.4] : [1.35, 0.3],
        );
        rings1Layout = {
            x: new Float32Array(rings1Data.length),
            y: new Float32Array(rings1Data.length),
            depth: new Float32Array(rings1Data.length),
        };

        // Planet 2 — disabled on compact: two huge overlapping
        // spheres = unreadable at 390–820px wide.
        if (isCompactLayout) {
            sphere2Canvas = null;
            rings2Data = [];
            rings2Layout = {
                x: new Float32Array(0),
                y: new Float32Array(0),
                depth: new Float32Array(0),
            };
        } else {
            const r2 = Math.min(m * 0.5, MAX_PLANET_RADIUS);
            sphere2Canvas = generateSphereCanvas(
                r2,
                [0.55, -0.4],
                color,
                alphaBoost,
                0.9,
                sphereDotPx,
                dpr,
            );
            // Planet 2 is optional: its absence doesn't block the scene.
            if (!sphere2Canvas) {
                rings2Data = [];
                rings2Layout = {
                    x: new Float32Array(0),
                    y: new Float32Array(0),
                    depth: new Float32Array(0),
                };
            } else {
                rings2Data = generateRingData(r2, alphaBoost, 0.9);
                rings2Layout = {
                    x: new Float32Array(rings2Data.length),
                    y: new Float32Array(rings2Data.length),
                    depth: new Float32Array(rings2Data.length),
                };
            }
        }

        startTime = performance.now();
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
        if (!sceneReady || !sphere1Canvas) return;
        const relativeTime = time - startTime;
        ctx.clearRect(0, 0, w, h);

        const px = (mouseX - w / 2) / w;
        const py = (mouseY - h / 2) / h;

        // --- Background stars (with subtle twinkling) ---
        // Single preallocated fillStyle + globalAlpha: zero allocs/frame.
        ctx.fillStyle = flatFill;
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const twinkle =
                0.5 +
                0.5 *
                    Math.sin(
                        relativeTime * 0.001 * star.speed + star.phase,
                    );
            ctx.globalAlpha = star.a * twinkle;
            ctx.fillRect(star.x - px * 10, star.y - py * 10, starPx, starPx);
        }
        ctx.globalAlpha = 1;

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
        const r1 = Math.min(
            isCompactLayout
                ? Math.min(w * 0.52, h * 0.22, 220)
                : Math.min(w, h) * 0.7,
            MAX_PLANET_RADIUS,
        );

        // Single projection per frame, reused by both passes.
        layoutRing(rings1Data, ringTilt1, 0.00008, relativeTime, rings1Layout);
        drawRingPass(
            rings1Data,
            rings1Layout,
            p1X,
            p1Y,
            r1,
            true,
            ringDotPx,
        );
        drawSphere(sphere1Canvas, p1X, p1Y);
        drawRingPass(
            rings1Data,
            rings1Layout,
            p1X,
            p1Y,
            r1,
            false,
            ringDotPx,
        );

        // --- Planet 2 (desktop only) ---
        if (sphere2Canvas) {
            const p2X =
                w * -0.02 - px * 25 + Math.sin(relativeTime / 4000 + 1) * 6;
            const p2Y =
                h * 0.74 - py * 25 + Math.cos(relativeTime / 4000 + 1) * 6;
            const r2 = Math.min(Math.min(w, h) * 0.5, MAX_PLANET_RADIUS);

            layoutRing(
                rings2Data,
                ringTilt2,
                -0.00012,
                relativeTime,
                rings2Layout,
            );
            drawRingPass(
                rings2Data,
                rings2Layout,
                p2X,
                p2Y,
                r2,
                true,
                ringDotPx,
            );
            drawSphere(sphere2Canvas, p2X, p2Y);
            drawRingPass(
                rings2Data,
                rings2Layout,
                p2X,
                p2Y,
                r2,
                false,
                ringDotPx,
            );
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
        if (disposed || staticMode || isMobileLayout || animFrame || !inView || document.hidden) return;
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
    // Mouse parallax needs a fine pointer; skip on touch.
    if (hasFinePointer) {
        window.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
    const unlistenTheme = listenMediaQuery(themeMedia, onThemeChange);

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
        if (document.hidden) pause();
        else play();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    const scheduleStart = (): void => {
        requestAnimationFrame(() => {
            if (disposed) return;
            scheduleIdle(
                () => {
                    if (!disposed) startAnimation();
                },
                1500,
            );
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
        unlistenTheme();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        viewObserver?.disconnect();
    };
};


