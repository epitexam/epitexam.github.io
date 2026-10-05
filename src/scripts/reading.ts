export const initReading = (): void => {
    const bar = document.querySelector<HTMLElement>("[data-progress]");
    const toTop = document.querySelector<HTMLElement>("[data-to-top]");
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    let max = 1;
    let queued = false;
    const measure = (): void => {
        max = Math.max(
            1,
            document.documentElement.scrollHeight - window.innerHeight,
        );
    };
    const update = (): void => {
        queued = false;
        const ratio = Math.min(1, Math.max(0, window.scrollY / max));
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
