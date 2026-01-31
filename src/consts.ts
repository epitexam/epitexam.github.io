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

interface Game {
    rank: number;
    title: string;
    slug: string;
    image: string;
    imageAlt: string;
    developer: string;
    publisher?: string;
    engine?: string;
    releaseDate: string;
    genre: string;
    platforms: string[];
    storeUrl?: string;
    playtime?: string;
    description: string;
    summary: string;
    pros: string[];
    cons: string[];
    linux: string;
    rankingReason: string;
    tags?: string[];
}

export const GAMES: Game[] = [
    {
        rank: 1,
        title: "Disco Elysium - The Final Cut",
        slug: "disco-elysium",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/ss_fbd29930bbad721ce251391d5ec622917b416aed.1920x1080.jpg",
        imageAlt: "Vue isométrique de Revachol dans Disco Elysium",
        developer: "ZA/UM",
        publisher: "ZA/UM",
        engine: "Unity",
        releaseDate: "2019-10-15",
        genre: "RPG / Detective",
        platforms: ["PC", "Mac", "PS4", "PS5", "Xbox", "Switch"],
        storeUrl: "https://store.steampowered.com/app/632470/Disco_Elysium__The_Final_Cut/",
        playtime: "30h-50h",
        description: "Incarnez un détective amnésique dans une ville en proie au chaos. Un RPG révolutionnaire sans combat traditionnel, où vos compétences sont vos véritables armes.",
        summary: "Une expérience narrative unique. Le meilleur système de dialogues jamais créé dans un jeu vidéo.",
        pros: ["Écriture exceptionnelle", "Système de compétences génial", "Direction artistique sublime", "Humour noir percutant"],
        cons: ["Pas de combat classique", "Rythme parfois contemplatif"],
        linux: "Support natif Linux. Parfois des bugs audio mineurs, réglés avec Proton-GE.",
        rankingReason: "L'écriture est d'une qualité littéraire rare. Une œuvre d'art qui traite le joueur comme un adulte intelligent.",
        tags: ["rpg", "story-rich", "choices-matter", "detective"]
    },
    {
        rank: 2,
        title: "No Man's Sky",
        slug: "no-mans-sky",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/275850/47005e90c31a62121610cbf29ce3dcc3c49dfa96/ss_47005e90c31a62121610cbf29ce3dcc3c49dfa96.1920x1080.jpg?t=1765800348",
        imageAlt: "Exploration planétaire dans No Man's Sky",
        developer: "Hello Games",
        publisher: "Hello Games",
        engine: "Voxel Engine (Propriétaire)",
        releaseDate: "2016-08-12",
        genre: "Open World / Survival / Exploration",
        platforms: ["PC", "PS4", "PS5", "Xbox", "Switch", "Mac"],
        storeUrl: "https://store.steampowered.com/app/275850/No_Mans_Sky/",
        playtime: "+100h",
        description: "Un jeu d'exploration et de survie se déroulant dans un univers infini généré de manière procédurale. Explorez des planètes uniques et des formes de vie inconnues.",
        summary: "La plus grande rédemption de l'histoire du jeu vidéo. Un univers entier à portée de main.",
        pros: ["Contenu titanesque et gratuit", "Liberté totale", "Magnifique en VR", "Mises à jour constantes"],
        cons: ["Boucle de gameplay répétitive", "Inventaire parfois lourd à gérer", "Vieux bugs toujours présents"],
        linux: "Fonctionne parfaitement via Proton. Support VR excellent sous Linux.",
        rankingReason: "Pour son ambition démesurée enfin accomplie et sa capacité à offrir un sentiment d'émerveillement constant.",
        tags: ["open-world", "space", "exploration", "survival"]
    },
    {
        rank: 3,
        title: "Foxhole",
        slug: "foxhole",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/505460/ss_0f46a6eb53224036d4e67c896ee87f5e364f34a4.1920x1080.jpg",
        imageAlt: "Soldats et logistique sur le champ de bataille de Foxhole",
        developer: "Siege Camp",
        publisher: "Siege Camp",
        engine: "Unreal Engine 4",
        releaseDate: "2022-09-28",
        genre: "Massively Multiplayer / Wargame / Logistics",
        platforms: ["PC"],
        storeUrl: "https://store.steampowered.com/app/505460/Foxhole/",
        playtime: "+200h",
        description: "Foxhole est un jeu massivement multijoueur où chaque soldat est un joueur. La guerre est persistante et chaque aspect, de la fabrication des balles au front, dépend des joueurs.",
        summary: "Une simulation de guerre totale où la logistique est aussi importante que le combat.",
        pros: ["Échelle de conflit incroyable", "Coopération indispensable", "Économie gérée par les joueurs", "Super communauté"],
        cons: ["Très chronophage", "Courbe d'apprentissage abrupte"],
        linux: "Support Gold via Proton. Pas de version native mais tourne parfaitement.",
        rankingReason: "Il n'existe aucun autre jeu capable de simuler une telle coordination entre des milliers de joueurs simultanément.",
        tags: ["war", "multiplayer", "logistics", "strategy"]
    },
    {
        rank: 4,
        title: "Counter-Strike 2",
        slug: "counter-strike-2",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_ef82850f036dac5772cb07dbc2d1116ea13eb163.1920x1080.jpg?t=1749053861",
        imageAlt: "Action de tir tactique dans Counter-Strike 2",
        developer: "Valve",
        publisher: "Valve",
        engine: "Source 2",
        releaseDate: "2023-09-27",
        genre: "FPS / Competitive",
        platforms: ["PC", "Linux"],
        storeUrl: "https://store.steampowered.com/app/730/CounterStrike_2/",
        playtime: "Illimité",
        description: "Le successeur de CS:GO. Un jeu de tir tactique à la première personne qui définit les standards de l'e-sport depuis plus de deux décennies.",
        summary: "Le roi du FPS compétitif, modernisé sur un nouveau moteur.",
        pros: ["Gameplay ultra-précis", "Physique des fumigènes"],
        cons: ["Problèmes de triche", "Moins de cartes que CS:GO au lancement"],
        linux: "Support natif Linux par Valve. Performance excellente.",
        rankingReason: "Indétrônable dans sa catégorie, c'est la pureté absolue du skill et de la tactique en équipe.",
        tags: ["fps", "competitive", "shooter", "multiplayer"]
    },
    {
        rank: 5,
        title: "Shadow Gambit: The Cursed Crew",
        slug: "shadow-gambit",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1545560/ss_ce45a6e3761279a809fd7db91c9e948e1ab78b08.1920x1080.jpg?t=1769171508",
        imageAlt: "Pirates fantômes en mission d'infiltration",
        developer: "Mimimi Games",
        publisher: "Mimimi Games",
        engine: "Unity",
        releaseDate: "2023-08-17",
        genre: "Stealth / Strategy / Real-time Tactics",
        platforms: ["PC", "PS5", "Xbox Series"],
        storeUrl: "https://store.steampowered.com/app/1545560/Shadow_Gambit_The_Cursed_Crew/",
        playtime: "25h-40h",
        description: "Rejoignez un navire fantôme et rassemblez un équipage de pirates maudits. Utilisez des pouvoirs magiques pour infiltrer les forteresses de l'Inquisition.",
        summary: "Le summum du genre infiltration tactique par les maîtres du genre.",
        pros: ["Liberté d'approche totale", "Personnages hauts en couleur", "Mécanique de save intégrée au lore"],
        cons: ["Le dernier jeu du studio Mimimi", "Peut sembler répétitif sur la fin"],
        linux: "Fonctionne impeccablement avec Proton (Platinum).",
        rankingReason: "Une lettre d'adieu parfaite pour Mimimi Games, sublimant la formule de Desperados et Shadow Tactics.",
        tags: ["stealth", "tactical", "pirates", "strategy"]
    },
    {
        rank: 6,
        title: "Intravenous",
        slug: "intravenous",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1486630/ss_3b8b9b535a4c883bad2ab47f50453a815ee651fe.1920x1080.jpg?t=1757946721",
        imageAlt: "Infiltration en vue de dessus dans Intravenous",
        developer: "Explosive Dinosaurs",
        publisher: "Explosive Dinosaurs",
        engine: "Love2D",
        releaseDate: "2021-07-26",
        genre: "Stealth / Top-Down Shooter",
        platforms: ["PC"],
        storeUrl: "https://store.steampowered.com/app/1486630/Intravenous/",
        playtime: "10h-15h",
        description: "Un hommage brutal aux premiers Splinter Cell. Infiltrez-vous dans l'ombre ou déclenchez un carnage dans ce jeu d'action tactique exigeant.",
        summary: "Un mélange parfait entre Hotline Miami et Splinter Cell.",
        pros: ["IA très réactive", "Gestion de la lumière et du bruit poussée", "Grande rejouabilité"],
        cons: ["Expérience assez courte"],
        linux: "Très stable via Proton.",
        rankingReason: "Pour son respect des mécaniques de furtivité hardcore qui se font rares aujourd'hui.",
        tags: ["stealth", "tactical", "hardcore", "action"]
    },
    {
        rank: 7,
        title: "Hades",
        slug: "hades",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/ss_5e52844b891b54608eb51a850d6b53313eeed0f7.1920x1080.jpg?t=1758127023",
        imageAlt: "Zagreus combattant dans les enfers",
        developer: "Supergiant Games",
        publisher: "Supergiant Games",
        engine: "The Forge (Interne)",
        releaseDate: "2020-09-17",
        genre: "Roguelike / Action / Hack and Slash",
        platforms: ["PC", "Mac", "PS4", "PS5", "Xbox", "Switch", "iOS"],
        storeUrl: "https://store.steampowered.com/app/1145360/Hades/",
        playtime: "40h-100h",
        description: "Défiez le dieu des morts et frayez-vous un chemin hors des Enfers dans ce rogue-like dungeon crawler récompensé à de multiples reprises.",
        summary: "Le jeu qui a réconcilié tout le monde avec le genre Roguelite.",
        pros: ["Narration parfaitement intégrée à la mort", "Direction artistique et musique incroyables", "Combat dynamique"],
        cons: ["L'aspect grind pour voir la vraie fin",],
        linux: "Support exceptionnel via Proton, fonctionne mieux que sur Windows pour certains.",
        rankingReason: "Une perfection de design où chaque mort fait avancer l'histoire. Un chef-d'œuvre de Supergiant Games.",
        tags: ["roguelike", "action", "mythology", "hack-and-slash"]
    }
];