/**
 * mermaid-loader — lazy Mermaid rendering for article pages.
 *
 * Only runs on BlogPost / ProjectPost layouts. Exits immediately (zero cost)
 * when the page contains no diagram. Otherwise waits for an idle slot, then
 * renders once the first diagram is near the viewport, so the heavy `mermaid`
 * chunk (~1 Mo) is downloaded, parsed and executed only where needed.
 *
 * Handles both `<pre class="mermaid">` (astro-mermaid output) and vanilla
 * `<pre data-language="mermaid">` code blocks.
 */
export const initMermaid = (): void => {
    const blocks = Array.from(
        document.querySelectorAll<HTMLElement>(
            'pre.mermaid, pre[data-language="mermaid"]',
        ),
    ).filter((el) => !el.hasAttribute("data-processed"));
    if (blocks.length === 0) return;

    let rendered = false;
    const render = async () => {
        if (rendered) return;
        rendered = true;
        try {
            const { default: mermaid } = await import("mermaid");
            // Config identique à l'ancienne intégration astro-mermaid :
            // - htmlLabels: false -> labels en texte SVG (mesurés au plus
            //   juste ; en mode HTML les polices forcées par le CSS du site
            //   débordaient des boîtes).
            mermaid.initialize({
                startOnLoad: false,
                theme: "dark",
                themeVariables: {
                    fontFamily: "sans-serif",
                    background: "transparent",
                    primaryColor: "transparent",
                    primaryTextColor: "rgb(232, 232, 234)",
                    primaryBorderColor: "rgba(232, 232, 234, 0.11)",
                    lineColor: "rgba(232, 232, 234, 0.30)",
                },
                flowchart: {
                    htmlLabels: false,
                    useMaxWidth: true,
                    nodeSpacing: 60,
                    rankSpacing: 80,
                    padding: 20,
                },
            });
            for (const block of blocks) {
                const source = block.textContent ?? "";
                if (!source.trim()) continue;
                const id =
                    "mermaid-" + Math.random().toString(36).slice(2, 11);
                try {
                    const { svg } = await mermaid.render(id, source);
                    // NOTE: ne pas faire de getElementById(id)?.remove() ici :
                    // la racine <svg> générée porte elle-même cet id, et
                    // mermaid nettoie déjà son propre conteneur temporaire.
                    block.innerHTML = svg;
                    block.classList.add("mermaid");
                    // Nettoie les restes Shiki (fond/bordures inline) pour ne
                    // garder que le style .mermaid du site.
                    block.classList.remove("astro-code", "css-variables");
                    block.removeAttribute("style");
                    block.removeAttribute("tabindex");
                    block.setAttribute("data-processed", "true");
                } catch (err) {
                    console.error(
                        "[mermaid] rendering error:",
                        err,
                    );
                }
            }
        } catch (err) {
            console.error("[mermaid] failed to load:", err);
        }
    };

    const schedule = (cb: () => void) => {
        if ("requestIdleCallback" in window) {
            (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(cb, { timeout: 2000 });
        } else {
            window.setTimeout(cb, 1);
        }
    };

    schedule(() => {
        const first = blocks[0];
        if (!("IntersectionObserver" in window)) {
            void render();
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        io.disconnect();
                        void render();
                        break;
                    }
                }
            },
            { rootMargin: "600px 0px" },
        );
        io.observe(first);
    });
};
