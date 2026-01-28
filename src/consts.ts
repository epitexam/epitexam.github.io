// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Epitexam';
export const SITE_DESCRIPTION = 'Portfolio de Epitexam - Développeur passionné par les technologies et l\'innovation. Découvrez mes projets et articles dans domaine du développement logiciel.';
export const GITHUB_URL = 'https://github.com/epitexam';
export const ALT_DESCRIPTION = "Vue en contre-plongée de plusieurs immeubles de bureaux imposants plongés dans l'obscurité"

export const SECTIONS: { title: string, tools: { icon: string, name: string, description: string, link?: string }[] }[] = [
    {
        title: "Langages informatiques",
        tools: [
            {
                icon: "JS",
                name: "JavaScript / TypeScript",
                description:
                    "Mon terrain de jeu principal pour le web — front ou full-stack. TypeScript apporte la rigueur qu'il faut pour garder le code solide sans perdre la souplesse du JS.",
                link: "https://www.typescriptlang.org/",
            },
            {
                icon: "C",
                name: "C",
                description:
                    "Utilisé pour des projets embarqués, notamment un driver ESP32H2 connecté à un capteur de CO₂. J'aime le côté brut du C, quand il faut vraiment parler à la machine.",
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
                    "Un trip purement technique : écrire de l'assembleur aide à voir comment tout fonctionne, bit par bit. C'est comme démonter un moteur juste pour le plaisir. (Merci aux cours de Gustavo Pezzi)",
                link: "https://www.nasm.us/",
            },
            {
                icon: "Go",
                name: "Go",
                description: "Acuellement sur des side-projets microservices, j'apprends encore et j'expérimente activement le langage Go.",
                link: "https://go.dev/",
            },
            {
                icon: "Py",
                name: "Python",
                description:
                    "Je m'en sers pour automatiser, écrire des scripts ou tester des idées vite fait. Un bon compagnon de route pour le prototypage.",
                link: "https://www.python.org/",
            },
            {
                icon: "E",
                name: "Erlang",
                description:
                    "Langage que j'explore actuellement. J'aime sa vision de la concurrence et sa robustesse — c'est un vrai changement de paradigme par rapport au reste.",
                link: "https://www.erlang.org/",
            },
            {
                icon: "L",
                name: "Lua / LÖVE2D",
                description:
                    "J'ai codé un petit jeu avec LÖVE2D. Lua est léger, fun et parfait pour expérimenter rapidement des mécaniques de gameplay.",
                link: "https://love2d.org/",
            },
            {
                icon: "G",
                name: "Godot",
                description:
                    "À la base, c'est pour faire des jeux, mais j'en ai tellement eu marre d'Android Studio que je me suis mis à faire des applis mobiles avec.",
                link: "https://godotengine.org/",
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
                    "Le framework que j'utilise le plus sérieusement pour le front. J'aime sa logique déclarative et la façon dont il structure les projets.",
                link: "https://react.dev/",
            },
            {
                icon: "A",
                name: "Astro",
                description:
                    "Celui qui fait tourner ce site. Rapide, simple et flexible : un vrai bonheur pour un portfolio ou un site statique moderne.",
                link: "https://astro.build/",
            },
            {
                icon: "V",
                name: "Vue.js",
                description:
                    "J'apprécie son équilibre entre simplicité et puissance. C'est un framework que j'ai utilisé sur plusieurs petits projets d'expérimentation.",
                link: "https://vuejs.org/",
            },
            {
                icon: "N",
                name: "Next.js",
                description:
                    "Exploré pour comprendre le rendu côté serveur et les déploiements modernes. Très complet, idéal pour le full-stack React.",
                link: "https://nextjs.org/",
            },
            {
                icon: "S",
                name: "Svelte",
                description:
                    "Testé sur quelques projets : ultra fluide, sans virtual DOM, et très agréable à utiliser.",
                link: "https://svelte.dev/",
            },
            {
                icon: "So",
                name: "Solid.js",
                description:
                    "Un framework que j'ai creusé par curiosité technique. Sa gestion granulaire de la réactivité est franchement impressionnante.",
                link: "https://www.solidjs.com/",
            },
            {
                icon: "T",
                name: "Tailwind CSS",
                description:
                    "Mon outil de prédilection pour le style : efficace et flexible, même si un peu de CSS pur reste parfois indispensable.",
                link: "https://tailwindcss.com/",
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
                    "J'utilise Fedora et Arch Linux régulièrement. J'aime le côté rolling release et le contrôle total qu'elles offrent. WSL reste une solution de secours pratique.",
                link: "https://archlinux.org/",
            },
            {
                icon: "D",
                name: "Docker",
                description:
                    "Pour isoler et gérer mes environnements. Idéal pour garder les devs reproductibles, surtout quand je bosse sur plusieurs technos à la fois.",
                link: "https://www.docker.com/",
            },
            {
                icon: "CICD",
                name: "CI/CD",
                description:
                    "J'intègre l'automatisation dans mes projets via des workflows GitHub Actions — tests, build, et déploiement. Ça rend le tout propre et prévisible.",
                link: "https://docs.github.com/en/actions",
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
                    "Je garde mes dépôts propres, mes commits clairs, et j'automatise ce qui peut l'être. Le tout branché sur des pipelines CI/CD.",
                link: "https://github.com/",
            },
            {
                icon: "P",
                name: "Postman",
                description:
                    "Mon outil de référence pour tester et documenter les API. Simple, pratique, efficace — rien à redire.",
                link: "https://www.postman.com/",
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
                    "Mon éditeur principal. Configuration minimaliste, zéro extension, juste l'essentiel. Rapide et sans distractions.",
                link: "https://code.visualstudio.com/",
            },
            {
                icon: "Vim",
                name: "Vim",
                description:
                    "J'y touche quand il faut, mais j'en sors dès que possible.",
                link: "https://www.vim.org/",
            },
        ],
    },
];

export const TECH_CATEGORIES = [
    {
        label: "Web",
        items: [
            "Typescript",
            "Javascript",
            "React",
            "Next.js",
            "Astro",
            "Node.js",
            "Bun"
        ],
    },
    {
        label: "Bas Niveau & IoT",
        items: ["C", "C++", "Asm", "Arduino", "ESP32", "Raspberry"],
    },
    {
        label: "Infrastructure",
        items: ["Docker", "Linux", "Python", "Postgres"],
    },
];