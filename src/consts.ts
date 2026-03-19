// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Epitexam";
export const SITE_DESCRIPTION =
  "Portfolio de Epitexam - Développeur passionné par les technologies et l'innovation. Découvrez mes projets et articles dans domaine du développement logiciel.";
export const GITHUB_URL = "https://github.com/epitexam";
export const ALT_DESCRIPTION =
  "Vue en contre-plongée de plusieurs immeubles de bureaux imposants plongés dans l'obscurité";

type ToolLevel = "mastered" | "practiced" | "exploring";

interface Tool {
  icon: string;
  name: string;
  description: string;
  link?: string;
  level?: ToolLevel;
}

export const SECTIONS: {
  title: string;
  tools: Tool[];
}[] = [
    {
      title: "Langages",
      tools: [
        {
          icon: "JS",
          name: "JavaScript / TypeScript",
          level: "mastered",
          description:
            "Mon terrain de jeu principal pour le web, aussi bien en front-end qu'en full-stack. TypeScript apporte la rigueur nécessaire pour garder un code solide sans perdre la souplesse du JavaScript.",
        },
        {
          icon: "C",
          name: "C",
          level: "practiced",
          description:
            "Utilisé pour des projets embarqués, notamment un driver ESP32H2 connecté à un capteur de CO₂. J'aime le côté brut du C, quand il faut vraiment parler directement à la machine.",
        },
        {
          icon: "C++",
          name: "C++",
          level: "practiced",
          description:
            "Employé sur quelques applications expérimentales, notamment avec wxWidgets. Puissant et exigeant, parfait pour comprendre la mécanique derrière les abstractions modernes.",
        },
        {
          icon: "Asm",
          name: "Assembleur (6502 / x64)",
          level: "practiced",
          description:
            "Un trip purement technique : écrire de l'assembleur permet de voir comment tout fonctionne, bit par bit. C'est un peu comme démonter un moteur juste pour comprendre comment il tourne. (Merci aux cours de Gustavo Pezzi)",
        },
        {
          icon: "Go",
          name: "Go",
          level: "exploring",
          description:
            "Actuellement utilisé sur quelques side-projects orientés microservices. J'expérimente encore le langage et j'apprends progressivement son écosystème.",
        },
        {
          icon: "E",
          name: "Erlang",
          level: "exploring",
          description:
            "J'ai commencé à apprendre Erlang en découvrant que Discord utilise la BEAM (via Elixir) pour sa messagerie temps réel. L'approche orientée concurrence est très différente des stacks web classiques.",
        },
        {
          icon: "L",
          name: "Lua",
          level: "practiced",
          description:
            "Un langage simple, léger et très flexible. Je l'utilise principalement pour expérimenter rapidement des idées ou prototyper des mécaniques de jeu.",
        },
      ],
    },
    {
      title: "Frameworks & Bibliothèques",
      tools: [
        {
          icon: "R",
          name: "React",
          level: "mastered",
          description:
            "Le framework que j'utilise le plus sérieusement côté front-end. J'apprécie sa logique déclarative et la manière dont il structure les projets.",
        },
        {
          icon: "A",
          name: "Astro",
          level: "practiced",
          description:
            "Celui qui fait tourner ce site. Rapide, simple et flexible : parfait pour un portfolio ou un site statique moderne.",
        },
        {
          icon: "Nx",
          name: "Next.js",
          level: "practiced",
          description:
            "Utilisé pour le rendu côté serveur et les déploiements modernes. C'est un outil très complet pour lier le front-end et le back-end avec React.",
        },
        {
          icon: "Ns",
          name: "NestJS",
          level: "practiced",
          description:
            "Mon framework de référence pour bâtir des API backend structurées et évolutives. J'apprécie son architecture qui facilite la maintenance sur le long terme.",
        },
        {
          icon: "S",
          name: "Svelte",
          level: "mastered",
          description:
            "Testé sur quelques projets : très fluide, sans virtual DOM, et particulièrement agréable à utiliser.",
        },
        {
          icon: "So",
          name: "Solid.js",
          level: "exploring",
          description:
            "Un framework que j'ai exploré par curiosité technique. Sa gestion granulaire de la réactivité est vraiment impressionnante.",
        },
        {
          icon: "T",
          name: "Tailwind CSS",
          level: "mastered",
          description:
            "Mon outil principal pour le styling : rapide, flexible et très efficace pour construire des interfaces modernes, même si un peu de CSS pur reste parfois nécessaire.",
        },
        {
          icon: "L2D",
          name: "LÖVE2D",
          level: "exploring",
          description:
            "Framework de jeu basé sur Lua que j'ai utilisé pour développer un petit prototype. Très agréable pour expérimenter rapidement des mécaniques de gameplay.",
        },
        {
          icon: "F",
          name: "Fastify",
          level: "mastered",
          description:
            "Une alternative à Express que je privilégie pour sa rapidité et son système de plugins. C'est mon outil de référence pour construire des API performantes avec une excellente gestion du typage.",
        }
      ],
    },
    {
      title: "Systèmes & Environnements",
      tools: [
        {
          icon: "L",
          name: "Linux",
          level: "practiced",
          description:
            "J'utilise régulièrement Fedora et Arch Linux. J'apprécie leur philosophie et le contrôle qu'elles offrent sur l'environnement système. WSL reste une solution pratique dans certains contextes.",
        },
        {
          icon: "D",
          name: "Docker",
          level: "practiced",
          description:
            "Utilisé pour isoler et gérer les environnements de développement. Très utile pour garder des setups reproductibles lorsque plusieurs technologies sont impliquées.",
        },
        {
          icon: "CICD",
          name: "CI/CD",
          level: "practiced",
          description:
            "J'intègre l'automatisation dans mes projets via des workflows GitHub Actions : tests, build et déploiement pour garder des projets fiables et reproductibles.",
        },
      ],
    },
    {
      title: "Collaboration & Versioning",
      tools: [
        {
          icon: "G",
          name: "Git",
          level: "practiced",
          description:
            "Gestion de version au cœur de mon workflow. J'essaie de garder des commits clairs, des branches propres et un historique lisible.",
        },
        {
          icon: "GH",
          name: "GitHub / GitLab / Gitea",
          level: "practiced",
          description:
            "Plateformes que j'utilise pour héberger mes projets, gérer les pull requests et connecter mes pipelines CI/CD.",
        },
      ],
    },
    {
      title: "Outils de développement",
      tools: [
        {
          icon: "V",
          name: "Visual Studio Code",
          level: "practiced",
          description:
            "Mon éditeur principal. Configuration minimaliste, zéro extension : juste l'essentiel pour rester rapide et concentré.",
        },
        {
          icon: "Z",
          name: "Zed",
          level: "practiced",
          description:
            "Un éditeur de code moderne, extrêmement rapide et pensé pour la collaboration. Léger, réactif et très agréable à utiliser.",
        },
      ],
    },
    {
      title: "Autres",
      tools: [
        {
          icon: "G",
          name: "Godot",
          level: "exploring",
          description:
            "Moteur de jeu open-source que j'utilise aussi pour expérimenter des applications mobiles et des prototypes interactifs.",
        },
      ]
    }
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
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/ss_fbd29930bbad721ce251391d5ec622917b416aed.1920x1080.jpg",
    imageAlt: "Vue isométrique de Revachol dans Disco Elysium",
    developer: "ZA/UM",
    publisher: "ZA/UM",
    engine: "Unity",
    releaseDate: "2019-10-15",
    genre: "RPG / Detective",
    platforms: ["PC", "Mac", "PS4", "PS5", "Xbox", "Switch"],
    storeUrl:
      "https://store.steampowered.com/app/632470/Disco_Elysium__The_Final_Cut/",
    playtime: "30h-50h",
    description:
      "Incarnez un détective amnésique dans une ville en proie au chaos. Un RPG révolutionnaire sans combat traditionnel, où vos compétences sont vos véritables armes.",
    summary:
      "Une expérience narrative unique. Le meilleur système de dialogues jamais créé dans un jeu vidéo.",
    pros: [
      "Écriture exceptionnelle",
      "Système de compétences génial",
      "Direction artistique sublime",
      "Humour noir percutant",
    ],
    cons: ["Pas de combat classique", "Rythme parfois contemplatif"],
    linux:
      "Support natif Linux. Parfois des bugs audio mineurs, réglés avec Proton-GE.",
    rankingReason:
      "L'écriture est d'une qualité littéraire rare. Une œuvre d'art qui traite le joueur comme un adulte intelligent.",
    tags: ["rpg", "story-rich", "choices-matter", "detective"],
  },
  {
    rank: 2,
    title: "No Man's Sky",
    slug: "no-mans-sky",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/275850/47005e90c31a62121610cbf29ce3dcc3c49dfa96/ss_47005e90c31a62121610cbf29ce3dcc3c49dfa96.1920x1080.jpg?t=1765800348",
    imageAlt: "Exploration planétaire dans No Man's Sky",
    developer: "Hello Games",
    publisher: "Hello Games",
    engine: "Havoc",
    releaseDate: "2016-08-12",
    genre: "Open World / Survival / Exploration",
    platforms: ["PC", "PS4", "PS5", "Xbox", "Switch", "Mac"],
    storeUrl: "https://store.steampowered.com/app/275850/No_Mans_Sky/",
    playtime: "+100h",
    description:
      "Un jeu d'exploration et de survie se déroulant dans un univers infini généré de manière procédurale. Explorez des planètes uniques et des formes de vie inconnues.",
    summary:
      "La plus grande rédemption de l'histoire du jeu vidéo. Un univers entier à portée de main.",
    pros: [
      "Contenu titanesque et gratuit",
      "Liberté totale",
      "Magnifique en VR",
      "Mises à jour constantes",
    ],
    cons: [
      "Boucle de gameplay répétitive",
      "Inventaire parfois lourd à gérer",
      "Vieux bugs toujours présents",
    ],
    linux:
      "Fonctionne parfaitement via Proton. Support VR excellent sous Linux.",
    rankingReason:
      "Pour son ambition démesurée enfin accomplie et sa capacité à offrir un sentiment d'émerveillement constant.",
    tags: ["open-world", "space", "exploration", "survival"],
  },
  {
    rank: 3,
    title: "Foxhole",
    slug: "foxhole",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/505460/ss_0f46a6eb53224036d4e67c896ee87f5e364f34a4.1920x1080.jpg",
    imageAlt: "Soldats et logistique sur le champ de bataille de Foxhole",
    developer: "Siege Camp",
    publisher: "Siege Camp",
    engine: "Unreal Engine 4",
    releaseDate: "2022-09-28",
    genre: "Massively Multiplayer / Wargame / Logistics",
    platforms: ["PC"],
    storeUrl: "https://store.steampowered.com/app/505460/Foxhole/",
    playtime: "+200h",
    description:
      "Foxhole est un jeu massivement multijoueur où chaque soldat est un joueur. La guerre est persistante et chaque aspect, de la fabrication des balles au front, dépend des joueurs.",
    summary:
      "Une simulation de guerre totale où la logistique est aussi importante que le combat.",
    pros: [
      "Échelle de conflit incroyable",
      "Coopération indispensable",
      "Économie gérée par les joueurs",
      "Super communauté",
    ],
    cons: ["Très chronophage", "Courbe d'apprentissage abrupte"],
    linux:
      "Support Gold via Proton. Pas de version native mais tourne parfaitement.",
    rankingReason:
      "Il n'existe aucun autre jeu capable de simuler une telle coordination entre des milliers de joueurs simultanément.",
    tags: ["war", "multiplayer", "logistics", "strategy"],
  },
  {
    rank: 4,
    title: "Counter-Strike 2",
    slug: "counter-strike-2",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_ef82850f036dac5772cb07dbc2d1116ea13eb163.1920x1080.jpg?t=1749053861",
    imageAlt: "Action de tir tactique dans Counter-Strike 2",
    developer: "Valve",
    publisher: "Valve",
    engine: "Source 2",
    releaseDate: "2023-09-27",
    genre: "FPS / Competitive",
    platforms: ["PC", "Linux"],
    storeUrl: "https://store.steampowered.com/app/730/CounterStrike_2/",
    playtime: "Illimité",
    description:
      "Le successeur de CS:GO. Un jeu de tir tactique à la première personne qui définit les standards de l'e-sport depuis plus de deux décennies.",
    summary: "Le roi du FPS compétitif, modernisé sur un nouveau moteur.",
    pros: ["Gameplay ultra-précis", "Physique des fumigènes"],
    cons: ["Problèmes de triche", "Moins de cartes que CS:GO au lancement"],
    linux: "Support natif Linux par Valve. Performance excellente.",
    rankingReason:
      "Indétrônable dans sa catégorie, c'est la pureté absolue du skill et de la tactique en équipe.",
    tags: ["fps", "competitive", "shooter", "multiplayer"],
  },
  {
    rank: 5,
    title: "Shadow Gambit: The Cursed Crew",
    slug: "shadow-gambit",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1545560/ss_ce45a6e3761279a809fd7db91c9e948e1ab78b08.1920x1080.jpg?t=1769171508",
    imageAlt: "Pirates fantômes en mission d'infiltration",
    developer: "Mimimi Games",
    publisher: "Mimimi Games",
    engine: "Unity",
    releaseDate: "2023-08-17",
    genre: "Stealth / Strategy / Real-time Tactics",
    platforms: ["PC", "PS5", "Xbox Series"],
    storeUrl:
      "https://store.steampowered.com/app/1545560/Shadow_Gambit_The_Cursed_Crew/",
    playtime: "25h-40h",
    description:
      "Rejoignez un navire fantôme et rassemblez un équipage de pirates maudits. Utilisez des pouvoirs magiques pour infiltrer les forteresses de l'Inquisition.",
    summary:
      "Le summum du genre infiltration tactique par les maîtres du genre.",
    pros: [
      "Liberté d'approche totale",
      "Personnages hauts en couleur",
      "Mécanique de save intégrée au lore",
    ],
    cons: [
      "Le dernier jeu du studio Mimimi",
      "Peut sembler répétitif sur la fin",
    ],
    linux: "Fonctionne impeccablement avec Proton (Platinum).",
    rankingReason:
      "Une lettre d'adieu parfaite pour Mimimi Games, sublimant la formule de Desperados et Shadow Tactics.",
    tags: ["stealth", "tactical", "pirates", "strategy"],
  },
  {
    rank: 6,
    title: "Intravenous",
    slug: "intravenous",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1486630/ss_3b8b9b535a4c883bad2ab47f50453a815ee651fe.1920x1080.jpg?t=1757946721",
    imageAlt: "Infiltration en vue de dessus dans Intravenous",
    developer: "Explosive Dinosaurs",
    publisher: "Explosive Dinosaurs",
    engine: "Love2D",
    releaseDate: "2021-07-26",
    genre: "Stealth / Top-Down Shooter",
    platforms: ["PC"],
    storeUrl: "https://store.steampowered.com/app/1486630/Intravenous/",
    playtime: "10h-15h",
    description:
      "Un hommage brutal aux premiers Splinter Cell. Infiltrez-vous dans l'ombre ou déclenchez un carnage dans ce jeu d'action tactique exigeant.",
    summary: "Un mélange parfait entre Hotline Miami et Splinter Cell.",
    pros: [
      "IA très réactive",
      "Gestion de la lumière et du bruit poussée",
      "Grande rejouabilité",
    ],
    cons: ["Expérience assez courte"],
    linux: "Très stable via Proton.",
    rankingReason:
      "Pour son respect des mécaniques de furtivité hardcore qui se font rares aujourd'hui.",
    tags: ["stealth", "tactical", "hardcore", "action"],
  },
  {
    rank: 7,
    title: "Hades",
    slug: "hades",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/ss_5e52844b891b54608eb51a850d6b53313eeed0f7.1920x1080.jpg?t=1758127023",
    imageAlt: "Zagreus combattant dans les enfers",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    engine: "The Forge (Interne)",
    releaseDate: "2020-09-17",
    genre: "Roguelike / Action / Hack and Slash",
    platforms: ["PC", "Mac", "PS4", "PS5", "Xbox", "Switch", "iOS"],
    storeUrl: "https://store.steampowered.com/app/1145360/Hades/",
    playtime: "40h-100h",
    description:
      "Défiez le dieu des morts et frayez-vous un chemin hors des Enfers dans ce rogue-like dungeon crawler récompensé à de multiples reprises.",
    summary: "Le jeu qui a réconcilié tout le monde avec le genre Roguelite.",
    pros: [
      "Narration parfaitement intégrée à la mort",
      "Direction artistique et musique incroyables",
      "Combat dynamique",
    ],
    cons: ["L'aspect grind pour voir la vraie fin"],
    linux:
      "Support exceptionnel via Proton, fonctionne mieux que sur Windows pour certains.",
    rankingReason:
      "Une perfection de design où chaque mort fait avancer l'histoire. Un chef-d'œuvre de Supergiant Games.",
    tags: ["roguelike", "action", "mythology", "hack-and-slash"],
  },
];

export const EDUCATION = [
  {
    period: "2023",
    title: "Cursus Ingénieur",
    subtitle: "Software Engineer Web / Mobile - Bachelor",
    description:
      "Formation supérieure orientées vers le développement web, mobile et bas niveau. Ce cursus m'a permis d'acquérir des bases solides en architecture logicielle et d'adopter les bonnes pratiques de programmation.",
  },
];

export const SITE_THEME_COLOR = "rgb(9, 9, 9)";

export const EXPERIENCES = [
  {
    period: "SEPT 2024 - DÉC 2025",
    title: "Développeur Fullstack",
    context: "Startup SaaS B2C (Plateforme de services)",
    description: "Audit et refonte technique d'un SaaS avec dette technique majeure. Optimisation des performances (-40% de chargement) via SQL et cache Redis. Conseil stratégique sur l'architecture et mise en place de CI/CD.",
    tags: ["Bun", "TypeScript", "PostgreSQL", "Redis", "Docker"],
  },
  {
    period: "JUIN 2023 - AOÛT 2024",
    title: "Développeur Fullstack",
    context: "EdTech (Plateforme e-learning pour développeurs)",
    description: "Développement avec approche SSR (AdonisJS + Inertia.js). Refonte backend avec architecture robuste (ORM, middlewares custom). Déploiement international (EN, ESP, GER) avec gestion multi-fuseaux horaires.",
    tags: ["AdonisJS", "React", "InertiaJS", "Node.js", "PostgreSQL"],
  },
  {
    period: "JANV. 2022 - JUIL. 2022",
    title: "Développeur Fullstack",
    context: "IoT & Audio (Solutions professionnelles)",
    description: "Développement d'une API REST sécurisée (JWT) et refonte front-end React avec optimisation avancée (hooks, mémoïsation). Création d'une application desktop Electron pour gestion d'imprimantes (système CUPS).",
    tags: ["React", "TypeScript", "Express", "Electron", "MongoDB"],
  },
  {
    period: "MAI 2020 - SEPT. 2020",
    title: "Développeur Fullstack",
    context: "Secteur Médical (Gestion de données patients)",
    description: "Conception d'une API Express pour la gestion sécurisée de données de santé avec authentification JWT. Développement d'une application desktop Electron pour usage hors-ligne sur sites médicaux.",
    tags: ["Node.js", "Express", "Electron", "PostgreSQL"],
  },
];

export const EXPERTISE = [
  {
    title: "Backend & Architecture",
    description:
      "Conception d'APIs robustes et scalables avec Node.js et Go, maîtrise des architectures modulaires, microservices et patterns avancés (DDD, hexagonale).",
  },
  {
    title: "Frontend Engineering",
    description:
      "Développement d'interfaces modernes avec React et Svelte. Attention particulière portée à la performance, à l'accessibilité et aux Core Web Vitals.",
  },
  {
    title: "Databases & Performance",
    description:
      "Travail avec bases SQL (PostgreSQL) et NoSQL (MongoDB). Optimisation de requêtes, gestion du cache avec Redis et conception de modèles de données efficaces.",
  },
  {
    title: "DevOps & Infrastructure",
    description:
      "Automatisation des déploiements via CI/CD, conteneurisation avec Docker et gestion d'environnements Linux pour des applications fiables et reproductibles.",
  },
  {
    title: "IoT & Systèmes Bas Niveau",
    description:
      "Développement bas niveau en C et expérimentation avec des objets connectés (ESP32, Arduino). Intégration de capteurs et communication avec des systèmes embarqués.",
  },
  {
    title: "Qualité & Sécurité",
    description:
      "Implémentation d'authentification sécurisée (JWT, OAuth2), gestion des rôles (RBAC) et mise en place de tests automatisés pour garantir la fiabilité des applications.",
  },
];

export const ABOUT_ME = [
  "Développeur Fullstack avec 3 ans d'expérience, je m'attache à concevoir des applications fiables et performantes, en appliquant des principes d'architecture solides comme les architectures hexagonales et le DDD.",
  "Mon travail s'appuie sur TypeScript et Node.js au quotidien, complétés par Linux et Docker pour assurer des déploiements stables et efficaces.",
  "J'interviens aussi bien sur l'architecture backend que sur la réactivité des interfaces, avec une attention particulière portée à la qualité du code et à l'automatisation des tests."
];

export const TAB_SHORT: Record<string, string> = {
  "Langages": "Langages",
  "Frameworks & Bibliothèques": "Frameworks",
  "Systèmes & Environnements": "Systèmes",
  "Collaboration & Versioning": "Collab",
  "Outils de développement": "Outils",
};

export const ABOUT_META_DESCRIPTION =
  "Découvrez le parcours d'Epitexam, développeur Full-Stack (Web, Backend, Embarqué). 3 ans d'expérience en SaaS, EdTech et optimisation de performances.";

export const TOOLS_META_DESCRIPTION =
  "Stack technique d'epitexam : TypeScript, React, Node.js, PostgreSQL, Docker. Langages, frameworks et environnements utilisés en production.";

export const WHAT_I_LOOK_FOR = [
  "Je souhaite rejoindre une équipe structurée, où la qualité technique est au cœur des projets.",
  "Bien que je sois intéressé par différents secteurs, ce qui me motive le plus, ce sont les défis techniques concrets et les projets ambitieux, où chaque décision a un impact réel.",
  "Un rythme hybride avec quelques jours de télétravail me convient, combinant concentration individuelle et travail collaboratif."
];

export const EXCLUDED_REPOS = [
  "exercise",
  "tutorial",
  "test",
  "practice",
  "workshop",
  "epitexam.github.io",
];