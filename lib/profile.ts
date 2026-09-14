// Structured version of the base CV. Edit this file directly to keep your
// profile up to date — the CV/cover-letter generator reads from here and
// tailors the output to each job offer.

export type SkillCategory = {
  name: string;
  keywords: string[]; // used to match against job stack text
  items: string[];
};

export type Experience = {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
};

export type Project = {
  name: string;
  url: string;
  stack: string[];
  description: string;
};

export type Education = {
  school: string;
  location: string;
  period: string;
  degree: string;
};

export const profile = {
  fullName: "Déo-Gratias Freddy AKOUTA",
  title: "Développeur Full-Stack Web/Mobile",
  email: "akoutadeo@gmail.com",
  phone: "+229 97668292",
  location: "Fidjrossè Akogbato, Cotonou, Bénin",
  portfolio: "https://freddydev.vercel.app",
  linkedin: "https://linkedin.com/in/deo-akouta-a44a1823b",
  summary:
    "Développeur Full-Stack Web et Mobile passionné, avec plus de 4 ans d'expérience concrète dans la conception, le développement et la maintenance de solutions numériques robustes. À l'aise aussi bien sur le frontend que le backend, avec une expertise croissante en développement Blockchain (smart contracts, applications décentralisées) et en Intelligence Artificielle (intégration de modèles, API propulsées par l'IA). Engagé à livrer un code propre et évolutif, et à approfondir continuellement ses compétences techniques pour répondre aux exigences du secteur numérique.",
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "Intermédiaire" },
    { name: "Fon", level: "Langue maternelle" },
  ],
  skills: [
    {
      name: "Web & Mobile",
      keywords: [
        "html",
        "css",
        "bootstrap",
        "javascript",
        "typescript",
        "php",
        "mysql",
        "prisma",
        "laravel",
        "django",
        "fastapi",
        "react",
        "next",
        "angular",
        "flutter",
        "react native",
        "wordpress",
        "node",
        "express",
        "vue",
      ],
      items: [
        "HTML5 / CSS3 / Bootstrap",
        "JavaScript / TypeScript",
        "PHP / MySQL / Prisma",
        "Laravel / Django / FastAPI",
        "React.js / Next.js / Angular.js",
        "Flutter / React Native",
        "WordPress",
      ],
    },
    {
      name: "Blockchain",
      keywords: [
        "solidity",
        "vyper",
        "rust",
        "solana",
        "ethereum",
        "polygon",
        "bnb",
        "web3",
        "ethers",
        "hardhat",
        "truffle",
        "ipfs",
        "defi",
        "nft",
        "dapp",
        "blockchain",
        "smart contract",
      ],
      items: [
        "Solidity / Vyper / Rust (Solana)",
        "Ethereum / Polygon / BNB Chain",
        "Web3.js / Ethers.js",
        "Hardhat / Truffle",
        "IPFS / Stockage décentralisé",
        "Développement DeFi & NFT / DApps",
      ],
    },
    {
      name: "Intelligence Artificielle",
      keywords: [
        "python",
        "numpy",
        "pandas",
        "scikit",
        "tensorflow",
        "pytorch",
        "openai",
        "llm",
        "prompt",
        "chatbot",
        "ai",
        "ia",
        "machine learning",
        "ml",
      ],
      items: [
        "Python (NumPy, Pandas, Scikit-learn)",
        "TensorFlow / PyTorch (bases)",
        "API OpenAI / Intégration LLM",
        "Prompt Engineering",
        "Développement de chatbots IA",
      ],
    },
  ] satisfies SkillCategory[],
  experience: [
    {
      company: "EIG Bénin",
      role: "Formateur en développement Web/Mobile",
      location: "Aibatin, Cotonou",
      period: "2023 — Aujourd'hui",
      description:
        "Conçoit et anime des programmes de formation en développement web et mobile pour des étudiants et jeunes professionnels. Encadre les apprenants sur des projets concrets avec des technologies modernes. A introduit des modules blockchain et IA pour renforcer la pertinence du programme.",
    },
    {
      company: "Digital Future Lab",
      role: "Développeur Web/Mobile",
      location: "Agla, Cotonou",
      period: "Août 2024 — Décembre 2024",
      description:
        "A conçu et développé des applications web et mobiles pour divers clients. A conseillé sur les stratégies de transformation numérique et accompagné les équipes dans l'adoption de pratiques de développement modernes, y compris des workflows assistés par IA.",
    },
    {
      company: "Nextmux",
      role: "Développeur Back-End Web",
      location: "Sicèkodji, Cotonou",
      period: "Mars 2022 — Juillet 2024",
      description:
        "A développé et maintenu des systèmes back-end évolutifs avec PHP/Laravel et Node.js. A implémenté des API RESTful pour les frontends web et mobile. A contribué à l'écosystème produit de Nextmux (Maboutique.bj, invest.bj, educax.app, siliconvalley.africa). A collaboré avec des équipes pluridisciplinaires pour livrer un logiciel de qualité dans les délais.",
    },
    {
      company: "Expert IT Lab",
      role: "Stagiaire en développement Web",
      location: "Sicèkodji, Cotonou",
      period: "Octobre 2021 — Janvier 2022",
      description:
        "A effectué un stage académique et professionnel chez Expert IT Lab, une agence numérique. A développé et maintenu des applications web, contribué à des projets clients, et acquis une expérience concrète des méthodes de travail agiles.",
    },
  ] satisfies Experience[],
  projects: [
    {
      name: "Nextmux",
      url: "https://nextmux.net",
      stack: ["Next.js", "Laravel", "Infrastructure", "Cybersécurité"],
      description:
        "Entreprise d'ingénierie numérique proposant des plateformes, infrastructures, solutions data, IA et cybersécurité au Bénin et à l'international. A contribué à l'écosystème produit incluant Maboutique.bj, invest.bj, educax.app et siliconvalley.africa.",
    },
    {
      name: "ACRALYA",
      url: "https://acralya.com",
      stack: ["Next.js", "SaaS", "Téléconsultation"],
      description:
        "Plateforme de santé pour le Bénin et l'Afrique permettant aux patients de rechercher des professionnels de santé, prendre rendez-vous en ligne et accéder à la téléconsultation. A développé des fonctionnalités évolutives de gestion d'agenda pour praticiens et établissements.",
    },
    {
      name: "Makena",
      url: "https://makena.pro",
      stack: ["React", "Mobile", "Mapbox"],
      description:
        "Plateforme mobile et web mettant en relation les clients avec des professionnels de l'automobile au Bénin, avec géolocalisation en temps réel. A développé l'application côté client ainsi que l'interface de gestion professionnelle.",
    },
    {
      name: "Réussir à tout prix",
      url: "https://reussiratoutprix.com",
      stack: ["WordPress", "PHP", "E-learning"],
      description:
        "Plateforme d'entrepreneuriat et d'investissement proposant des formations en ligne en business, immobilier et marché boursier BRVM. A conçu et personnalisé l'ensemble du site WordPress/PHP.",
    },
    {
      name: "NKC Consulting Group",
      url: "https://nkccg.com",
      stack: ["PHP", "Bootstrap"],
      description:
        "Site institutionnel pour un cabinet de conseil au service des administrations publiques, entreprises, ONG et organisations internationales.",
    },
    {
      name: "EIG Ambassadeur",
      url: "https://ambassadeur.partnext.org",
      stack: ["Next.js", "React"],
      description:
        "Plateforme de parrainage et d'ambassadeurs pour EIG Bénin : génération de codes de parrainage uniques, suivi des inscriptions, gestion de commissions par paliers, tableau de bord en temps réel.",
    },
  ] satisfies Project[],
  education: [
    {
      school: "Université d'Abomey-Calavi (UAC)",
      location: "Cotonou, Bénin",
      period: "2017 — 2019",
      degree: "Licence 3 — Physique & Chimie",
    },
    {
      school: "EIG Bénin — Formation en développement Web & Mobile",
      location: "Aibatin, Cotonou",
      period: "Janvier 2020 — Septembre 2021",
      degree:
        "Programme de formation professionnelle en développement d'applications web et mobiles full-stack.",
    },
  ] satisfies Education[],
};

export type Profile = typeof profile;
