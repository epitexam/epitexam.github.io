// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Epitexam';
export const SITE_DESCRIPTION = 'Mon carnet de bord : entre lignes de code et vie de tous les jours.';
export const GITHUB_URL = 'https://github.com/epitexam';
export const ALT_DESCRIPTION = "Scène emblématique du film Ghost in the Shell montrant la construction d'un corps cybernétique, avec les sections du visage et du crâne s'emboîtant sur une structure robotique."

export const SECTIONS : { title: string, tools: { icon: string, name: string, description: string }[] }[] = [
    {
        title: "Langages informatiques",
        tools: [
            {
                icon: "JS",
                name: "JavaScript / TypeScript",
                description:
                    "Mon terrain de jeu principal pour le web — front ou full-stack. TypeScript apporte la rigueur qu’il faut pour garder le code solide sans perdre la souplesse du JS.",
            },
            {
                icon: "C",
                name: "C",
                description:
                    "Utilisé pour des projets embarqués, notamment un driver ESP32H2 connecté à un capteur de CO₂. J’aime le côté brut du C, quand il faut vraiment parler à la machine.",
            },
            {
                icon: "C++",
                name: "C++",
                description:
                    "Employé sur quelques applis expérimentales, notamment avec wxWidgets. Puissant, exigeant — parfait pour comprendre la mécanique derrière les abstractions modernes.",
            },
            {
                icon: "Asm",
                name: "Assembleur (6502 / x64)",
                description:
                    "Un trip purement technique : écrire de l’assembleur aide à voir comment tout fonctionne, bit par bit. C’est comme démonter un moteur juste pour le plaisir. (Merci aux cours de Gustavo Pezzi)",
            },
            {
                icon: "Go",
                name: "Go",
                description: "Acuellement sur des side-projets microservices, j’apprends encore et j’expérimente activement le langage Go.",
            },
            {
                icon: "Py",
                name: "Python",
                description:
                    "Je m’en sers pour automatiser, écrire des scripts ou tester des idées vite fait. Un bon compagnon de route pour le prototypage.",
            },
            {
                icon: "E",
                name: "Erlang",
                description:
                    "Langage que j’explore actuellement. J’aime sa vision de la concurrence et sa robustesse — c’est un vrai changement de paradigme par rapport au reste.",
            },
            {
                icon: "L",
                name: "Lua / LÖVE2D",
                description:
                    "J’ai codé un petit jeu avec LÖVE2D. Lua est léger, fun et parfait pour expérimenter rapidement des mécaniques de gameplay.",
            },

            {
                icon: "G",
                name: "Godot",
                description:
                    "À la base, c’est pour faire des jeux, mais j’en ai tellement eu marre d’Android Studio que je me suis mis à faire des applis mobiles avec.",
            },
        ],
    },
    {
        title: "Frameworks & Bibliothèques",
        tools: [
            {
                icon: "R",
                name: "React",
                description:
                    "Le framework que j’utilise le plus sérieusement pour le front. J’aime sa logique déclarative et la façon dont il structure les projets.",
            },
            {
                icon: "A",
                name: "Astro",
                description:
                    "Celui qui fait tourner ce site. Rapide, simple et flexible : un vrai bonheur pour un portfolio ou un site statique moderne.",
            },
            {
                icon: "V",
                name: "Vue.js",
                description:
                    "J’apprécie son équilibre entre simplicité et puissance. C’est un framework que j’ai utilisé sur plusieurs petits projets d’expérimentation.",
            },
            {
                icon: "N",
                name: "Next.js",
                description:
                    "Exploré pour comprendre le rendu côté serveur et les déploiements modernes. Très complet, idéal pour le full-stack React.",
            },
            {
                icon: "S",
                name: "Svelte",
                description:
                    "Testé sur quelques projets : ultra fluide, sans virtual DOM, et très agréable à utiliser.",
            },
            {
                icon: "So",
                name: "Solid.js",
                description:
                    "Un framework que j’ai creusé par curiosité technique. Sa gestion granulaire de la réactivité est franchement impressionnante.",
            },
            {
                icon: "T",
                name: "Tailwind CSS",
                description:
                    "Mon outil de prédilection pour le style : efficace et flexible, même si un peu de CSS pur reste parfois indispensable.",
            },
        ],
    },
    {
        title: "Systèmes & Environnements",
        tools: [
            {
                icon: "L",
                name: "Linux (Fedora / Arch / WSL)",
                description:
                    "J’utilise Fedora et Arch Linux régulièrement. J’aime le côté rolling release et le contrôle total qu’elles offrent. WSL reste une solution de secours pratique.",
            },
            {
                icon: "D",
                name: "Docker",
                description:
                    "Pour isoler et gérer mes environnements. Idéal pour garder les devs reproductibles, surtout quand je bosse sur plusieurs technos à la fois.",
            },
            {
                icon: "CICD",
                name: "CI/CD",
                description:
                    "J’intègre l’automatisation dans mes projets via des workflows GitHub Actions — tests, build, et déploiement. Ça rend le tout propre et prévisible.",
            },
        ],
    },
    {
        title: "Collaboration & API",
        tools: [
            {
                icon: "G",
                name: "Git & GitHub / Gitlab (Parfois Gitea)",
                description:
                    "Je garde mes dépôts propres, mes commits clairs, et j’automatise ce qui peut l’être. Le tout branché sur des pipelines CI/CD.",
            },
            {
                icon: "P",
                name: "Postman",
                description:
                    "Mon outil de référence pour tester et documenter les API. Simple, pratique, efficace — rien à redire.",
            },
        ],
    },
    {
        title: "Outils de développement",
        tools: [
            {
                icon: "V",
                name: "Visual Studio Code",
                description:
                    "Mon éditeur principal. Configuration minimaliste, zéro extension, juste l’essentiel. Rapide et sans distractions.",
            },
            {
                icon: "Vim",
                name: "Vim",
                description:
                    "J’y touche quand il faut, mais j’en sors dès que possible.",
            },
        ],
    },
];

export const TECH_STACK: string[] = [
    "ElectronJS",
    "Tauri",
    "React",
    "Next.js",
    "Preact",
    "Astro",
    "TailwindCSS",
    "Typescript",
    "Javascript",
    "Redux",
    "Jest",
    "Cypress",
    "Lua",
    "Node.js",
    "Nest",
    "Fastify",
    "Elysia",
    "Express.js",
    "Bun",
    "Python",
    "C",
    "C++",
    "Godot",
    "Postgres",
    "MongoDB",
    "MariaDB",
    "Prisma",
    "Redis",
    "Docker",
    "Podman",
    "Linux",
    "Windows 💀",
    "Debian",
    "Ubuntu",
    "Fedora",
    "Arch linux",
    "Asm 6502 / x64",
    "Arduino",
    "Raspberry",
    "ESP32",
] as const;