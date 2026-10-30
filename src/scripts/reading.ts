export const initReading = (): void => {
    const bar = document.querySelector<HTMLElement>("[data-progress]");
    const toTop = document.querySelector<HTMLElement>("[data-to-top]");
    // The progress tracks the article content (one `.prose` per layout), not
    // the whole page: the hero, pager and footer are excluded.
    const target = document.querySelector<HTMLElement>(".prose");
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    let start = 0;
    let max = 1;
    let lastHeight = -1;
    let queued = false;
    const measure = (): void => {
        const height = document.documentElement.scrollHeight;
        if (height === lastHeight) return;
        lastHeight = height;
        const articleMax = target
            ? target.offsetHeight - window.innerHeight
            : -1;
        if (articleMax >= 1) {
            start = window.scrollY + (target?.getBoundingClientRect().top ?? 0);
            max = articleMax;
        } else {
            // Shorter than the viewport (teasers): fall back to the document.
            start = 0;
            max = Math.max(1, height - window.innerHeight);
        }
    };
    const update = (): void => {
        queued = false;
        const ratio = Math.min(
            1,
            Math.max(0, (window.scrollY - start) / max),
        );
        if (bar) bar.style.transform = `scaleX(${ratio})`;
        if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    const schedule = (): void => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
    };
    const remeasure = (): void => {
        measure();
        schedule();
    };
    const copyFallback = (text: string): boolean => {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch {
            ok = false;
        }
        area.remove();
        return ok;
    };
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("load", remeasure);
    window.addEventListener("pageshow", remeasure);
    window.addEventListener("hashchange", remeasure);
    // Content keeps changing height after `load` (async mermaid diagrams,
    // lazy images, <details>, font swap): re-measure whenever body resizes.
    if (typeof ResizeObserver === "function") {
        const observer = new ResizeObserver(remeasure);
        observer.observe(document.body);
    }
    toTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    document.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return;
        const code = pre.querySelector("code");
        if (!code) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.textContent = "Copier";
        btn.setAttribute("aria-label", "Copier le bloc de code");
        btn.addEventListener("click", async () => {
            const text = code.textContent ?? "";
            let ok = false;
            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(text);
                    ok = true;
                }
            } catch {
                ok = false;
            }
            if (!ok) ok = copyFallback(text);
            btn.textContent = ok ? "Copié" : "Échec";
            if (ok) btn.setAttribute("data-copied", "true");
            window.setTimeout(() => {
                btn.textContent = "Copier";
                btn.removeAttribute("data-copied");
            }, 1600);
        });
        pre.appendChild(btn);
    });
};
