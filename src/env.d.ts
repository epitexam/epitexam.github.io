/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly WS_API_URL?: string;
    readonly PUBLIC_FORMSPREE_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}