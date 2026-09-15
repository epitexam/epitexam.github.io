/**
 * hero-canvas — Dotted planet & starfield canvas animation.
 *
 * Responsive: runs on all screens. Below laptop (< 1024px) we switch to a
 * "compact" staging: single smaller planet pinned top-right away from text,
 * bigger dots, tilted ring, no second planet. On phones (< 768px) quality
 * is also scaled down (capped DPR, fewer stars). Mouse parallax needs a
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

type RingPoint = { baseT: number; rad: number; alpha: number };

type Star = {
    x: number;
    y: number;
    a: number;
    speed: number;
    phase: number;
};

export const initHeroCanvas = (): (() => void) | undefined => {
    const canvas = document.getElementById(
        "am-canvas",
    ) as HTMLCanvasElement | null;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !hero || !ctx) return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const staticMode = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    /** Read the current text color from the CSS `--text` custom property. */
    const getTextColor = (): RGB => {
        const style = getComputedStyle(document.documentElement);
        const textRgb = style.getPropertyValue("--text").trim();
        if (textRgb) {
            const [r, g, b] = textRgb
                .split(",")
                .map((v) => parseInt(v.trim(), 10));
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
        }
        return { r: 237, g: 237, b: 237 };
    };

    const isLightMode = () =>
        window.matchMedia("(prefers-color-scheme: light)").matches;

    /**
     * Generate an off-screen canvas that renders a sphere made of
     * individual dotted points (a la "planet" look).
     * The offscreen canvas is rendered at device-pixel scale (dpr) so
     * dots stay crisp after the main ctx.setTransform(dpr,...).
     */
    const generateSphereCanvas = (
        radius: number,
        light: number[],
        color: RGB,
        alphaBoost: number,
        density = 1,
        dotPx = 2.2,
        dprScale = 1,
    ): HTMLCanvasElement => {
        const padding = radius * 0.35;
        const size = Math.ceil(radius * 2 + padding * 2);
        const sphereCanvas = document.createElement("canvas");
        sphereCanvas.width = Math.ceil(size * dprScale);
        sphereCanvas.height = Math.ceil(size * dprScale);
        const sphereCtx = sphereCanvas.getContext("2d")!;
        sphereCtx.scale(dprScale, dprScale);
        const centerX = size / 2;
        const centerY = size / 2;

        const dotCount = Math.floor(radius * radius * 0.15 * density);
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

            let alpha =
                (0.04 + 0.5 * lum * lum * (0.3 + 0.7 * rim)) * alphaBoost;
            if (alpha < 0.06) continue;
            if (alpha > 1) alpha = 1;

            sphereCtx.fillStyle = `rgba(${color.r},${color.g},${color.b},${alpha})`;
            sphereCtx.fillRect(centerX + x, centerY + y, dotPx, dotPx);
        }
        return sphereCanvas;
    };
    /** Generate the dotted points that form a planet's ring. */
    const generateRingData = (
        radius: number,
        alphaBoost: number,
        density = 1,
        spread: [number, number] = [1.35, 0.3],
    ): RingPoint[] => {
        const points: RingPoint[] = [];
        const dotCount = Math.floor(radius * 3 * density);
        for (let i = 0; i < dotCount; i++) {
            let ringAlpha = (0.08 + Math.random() * 0.35) * alphaBoost;
            if (ringAlpha > 1) ringAlpha = 1;
            points.push({
                baseT: Math.random() * Math.PI * 2,
                // Rings stay near their planet; wider spread on compact
                // layouts so the ellipse reads on narrow screens.
                rad: radius * (spread[0] + Math.random() * spread[1]),
                alpha: ringAlpha,
            });
        }
        return points;
    };

    /** Draw a ring of dotted points with a simple 3-D tilt projection. */
    const drawRing = (
        points: RingPoint[],
        centerX: number,
        centerY: number,
        radius: number,
        tilt: number,
        rotationSpeed: number,
        time: number,
        color: RGB,
        renderBack: boolean,
        dotPx = 2.0,
    ) => {
        const sinTilt = Math.sin(tilt);
        const cosTilt = Math.cos(tilt);

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const angle = point.baseT + time * rotationSpeed;

            const x = Math.cos(angle) * point.rad;
            const z = Math.sin(angle) * point.rad;

            const projectedY = -z * sinTilt;
            const depthZ = z * cosTilt;

            if (renderBack) {
                if (depthZ >= 0) continue;
                if (x * x + projectedY * projectedY < radius * radius)
                    continue;
            } else {
                if (depthZ < 0) continue;
            }

            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${point.alpha})`;
            ctx.fillRect(centerX + x, centerY + projectedY, dotPx, dotPx);
        }
    };

    let w = 0,
        h = 0,
        dpr = 1;
    let color: RGB = { r: 237, g: 237, b: 237 };
    let isLight = false;
    let alphaBoost = 1;
    let stars: Star[] = [];
    let starPx = 1;

    let sphere1Canvas: HTMLCanvasElement | null = null;
    let rings1Data: RingPoint[] = [];
    let sphere2Canvas: HTMLCanvasElement | null = null;
    let rings2Data: RingPoint[] = [];
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

    const setupScene = () => {
        w = hero.clientWidth;
        h = hero.clientHeight;
        // Le hero peut ne pas être mis en page encore (w/h à 0) si
        // setupScene tourne avant le layout : on réessaie plus tard.
        if (w <= 0 || h <= 0 || !Number.isFinite(w) || !Number.isFinite(h)) {
            sceneReady = false;
            return false;
        }
        // Compact = tout ce qui est plus petit qu'un laptop : mobile + tablette.
        isCompactLayout = w < 1024;
        isMobileLayout = w < 768;

        // Mobile: capped DPR. Compact garde un alpha lisible (0.9) au lieu
        // de 0.65 qui rendait les points illisibles.
        dpr = Math.min(
            isMobileLayout ? 1.5 : 2,
            window.devicePixelRatio || 1,
        );
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        color = getTextColor();
        isLight = isLightMode();
        alphaBoost = (isLight ? 2.2 : 1) * (isCompactLayout ? 0.9 : 1);

        // Dots plus gros sur petit écran : lisibles sans augmenter le count.
        sphereDotPx = isCompactLayout ? 3.0 : 2.2;
        ringDotPx = isCompactLayout ? 2.6 : 2.0;
        starPx = isCompactLayout ? 1.6 : 1;
        ringTilt1 = isCompactLayout ? -0.42 : -0.25;
        ringTilt2 = -0.22;

        stars = [];
        const starCount = Math.floor(
            (w * h) / (isCompactLayout ? 24000 : 12000),
        );
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                a: isLight
                    ? 0.1 + Math.random() * 0.2
                    : 0.05 + Math.random() * 0.25,
                speed: 0.5 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2,
            });
        }

        const m = Math.min(w, h);

        // Planet 1 — sur compact : petite, calée en haut-droite hors du texte.
        // Math.min(w*0.52, h*0.22) garantit qu'elle ne recouvre pas le titre.
        const r1 = isCompactLayout
            ? Math.min(w * 0.52, h * 0.22, 220)
            : m * 0.7;
        sphere1Canvas = generateSphereCanvas(
            r1,
            [-0.55, -0.35],
            color,
            alphaBoost,
            isCompactLayout ? 0.8 : 1,
            sphereDotPx,
            dpr,
        );
        rings1Data = generateRingData(
            r1,
            alphaBoost,
            isCompactLayout ? 0.9 : 1,
            isCompactLayout ? [1.45, 0.4] : [1.35, 0.3],
        );

        // Planet 2 — désactivée sur compact : deux sphères énormes qui se
        // chevauchent = illisible sur 390–820px de large.
        if (isCompactLayout) {
            sphere2Canvas = null;
            rings2Data = [];
        } else {
            const r2 = m * 0.5;
            sphere2Canvas = generateSphereCanvas(
                r2,
                [0.55, -0.4],
                color,
                alphaBoost,
                1,
                sphereDotPx,
                dpr,
            );
            rings2Data = generateRingData(r2, alphaBoost, 1);
        }

        startTime = performance.now();
        sceneReady = true;
        return true;
    };
    const drawSphere = (
        img: HTMLCanvasElement | null,
        cx: number,
        cy: number,
    ) => {
        if (!img || !img.width || !img.height) return;
        // img est en pixels device (size*dpr), on le redessine à sa taille CSS.
        const dw = img.width / dpr;
        const dh = img.height / dpr;
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
    };
    const drawFrame = (time: number) => {
        // La boucle peut démarrer (IntersectionObserver / visibilitychange)
        // avant que setupScene ait tourné via requestIdleCallback :
        // on ignore les frames tant que la scène n'est pas prête.
        if (!sceneReady || !sphere1Canvas) return;
        const relativeTime = time - startTime;
        ctx.clearRect(0, 0, w, h);

        const px = (mouseX - w / 2) / w;
        const py = (mouseY - h / 2) / h;

        // --- Background stars (with subtle twinkling) ---
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const twinkle =
                0.5 +
                0.5 *
                    Math.sin(
                        relativeTime * 0.001 * star.speed + star.phase,
                    );
            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${star.a * twinkle})`;
            ctx.fillRect(star.x - px * 10, star.y - py * 10, starPx, starPx);
        }

        // --- Planet 1 ---
        // Desktop : bord droit à mi-hauteur. Compact : haut-droite, au-dessus
        // du titre, pour libérer la zone de lecture.
        const p1X =
            (isCompactLayout ? w * 0.82 : w * 1.0) -
            px * 40 +
            Math.sin(relativeTime / 3000) * 8;
        const p1Y =
            (isCompactLayout ? h * 0.2 : h * 0.4) -
            py * 40 +
            Math.cos(relativeTime / 3000) * 8;
        const r1 = isCompactLayout
            ? Math.min(w * 0.52, h * 0.22, 220)
            : Math.min(w, h) * 0.7;

        drawRing(
            rings1Data,
            p1X,
            p1Y,
            r1,
            ringTilt1,
            0.00008,
            relativeTime,
            color,
            true,
            ringDotPx,
        );
        drawSphere(sphere1Canvas, p1X, p1Y);
        drawRing(
            rings1Data,
            p1X,
            p1Y,
            r1,
            ringTilt1,
            0.00008,
            relativeTime,
            color,
            false,
            ringDotPx,
        );

        // --- Planet 2 (desktop uniquement) ---
        if (sphere2Canvas) {
            const p2X =
                w * -0.02 - px * 25 + Math.sin(relativeTime / 4000 + 1) * 6;
            const p2Y =
                h * 0.74 - py * 25 + Math.cos(relativeTime / 4000 + 1) * 6;
            const r2 = Math.min(w, h) * 0.5;

            drawRing(
                rings2Data,
                p2X,
                p2Y,
                r2,
                ringTilt2,
                -0.00012,
                relativeTime,
                color,
                true,
                ringDotPx,
            );
            drawSphere(sphere2Canvas, p2X, p2Y);
            drawRing(
                rings2Data,
                p2X,
                p2Y,
                r2,
                ringTilt2,
                -0.00012,
                relativeTime,
                color,
                false,
                ringDotPx,
            );
        }

        // Smooth mouse-parallax interpolation
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
    };

    const loop = (time: number) => {
        animFrame = 0;
        drawFrame(time);
        animFrame = requestAnimationFrame(loop);
    };

    const play = () => {
        if (staticMode || animFrame || !inView || document.hidden) return;
        if (!sceneReady) return;
        animFrame = requestAnimationFrame(loop);
    };

    const pause = () => {
        cancelAnimationFrame(animFrame);
        animFrame = 0;
    };

    const startAnimation = () => {
        pause();
        const ok = setupScene();
        if (!ok) {
            // Hero pas encore mis en page : on réessaie à la prochaine frame.
            requestAnimationFrame(startAnimation);
            return;
        }
        if (staticMode) {
            // Reduced motion: single static frame, no loop.
            drawFrame(performance.now());
        } else {
            play();
        }
    };

    let resizeTimeout: number;
    const debouncedDraw = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(startAnimation, 150);
    };

    const onMouseMove = (e: MouseEvent) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    };

    const onThemeChange = () => startAnimation();

    window.addEventListener("resize", debouncedDraw);
    // Mouse parallax needs a fine pointer; skip on touch.
    if (hasFinePointer) window.addEventListener("mousemove", onMouseMove);
    const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
    themeMedia.addEventListener("change", onThemeChange);

    // Pause when the hero leaves the viewport (battery).
    const viewObserver = new IntersectionObserver(
        (entries) => {
            inView = entries[0]?.isIntersecting ?? true;
            if (inView) play();
            else pause();
        },
        { threshold: 0 },
    );
    viewObserver.observe(hero);

    const onVisibilityChange = () => {
        if (document.hidden) pause();
        else play();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(startAnimation, {
            timeout: 300,
        });
    } else {
        requestAnimationFrame(startAnimation);
    }

    return () => {
        pause();
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", debouncedDraw);
        window.removeEventListener("mousemove", onMouseMove);
        themeMedia.removeEventListener("change", onThemeChange);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        viewObserver.disconnect();
    };
};


