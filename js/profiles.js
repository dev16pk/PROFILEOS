/* ============================================
   profiles.js — Profile Data Store
   All profile data keyed by slug
   ============================================ */

const PROFILES = {
  general: {
    id: 'general',
    name: 'General Industry',
    icon: 'fa-briefcase',
    badge: 'Live',
    badgeClass: 'live',
    tagline: 'Fullstack Developer · AI Architect · SAP Solutions SME',
    wallpaper: 'linear-gradient(135deg,#0a0e17 0%,#111827 50%,#0a0e17 100%)',

    /* —— About —— */
    about: {
      name: 'Devyani P. Kumar',
      title: 'Senior Developer @ Deloitte',
      summary: 'Fullstack developer, AI architect, and SAP solutions SME with 5.5 years of experience at Deloitte. Promoted 3 times (Analyst → Developer → Senior Developer). Delivered 6+ SAP CPQ enterprise engagements, 3 major GenAI projects (one sold to Disney/ESPN/BioMarin), and several community/social-impact builds.',
      attributes: [
        { key: 'LVL', val: '28', desc: 'Level' },
        { key: 'EXP', val: '5.5yr', desc: 'Experience' },
        { key: 'RANK', val: 'Sr Dev', desc: 'Deloitte' },
        { key: 'PROMO', val: '3', desc: 'Promotions' },
        { key: 'PROJ', val: '14+', desc: 'Projects' },
        { key: 'CLASS', val: 'Arch', desc: 'Architect' }
      ]
    },

    /* —— Stats —— */
    stats: [
      { name: 'SAP CPQ', value: 95, color: 'blue', icon: 'fa-cogs' },
      { name: 'GenAI / LLM', value: 90, color: 'pink', icon: 'fa-brain' },
      { name: 'Backend', value: 88, color: 'green', icon: 'fa-server' },
      { name: 'Frontend', value: 82, color: 'gold', icon: 'fa-laptop-code' },
      { name: 'Cloud / AWS', value: 85, color: 'blue', icon: 'fa-cloud' },
      { name: 'Game Dev', value: 75, color: 'pink', icon: 'fa-gamepad' }
    ],

    /* —— Skill Tree —— */
    skills: [
      {
        branch: 'SAP & Enterprise',
        hdrClass: 'ent',
        icon: 'fa-building',
        nodes: [
          { name: 'SAP CPQ', pips: 5 },
          { name: 'SAP CPI / S4', pips: 4 },
          { name: 'SAP VCPS / BTP', pips: 4 },
          { name: 'SAP AI Core', pips: 3 },
          { name: 'Salesforce', pips: 3 },
          { name: 'PriceFx', pips: 3 }
        ]
      },
      {
        branch: 'AI & Machine Learning',
        hdrClass: 'ai',
        icon: 'fa-robot',
        nodes: [
          { name: 'LangChain / LangGraph', pips: 5 },
          { name: 'AWS Bedrock / RAG', pips: 5 },
          { name: 'GPT-4 / Gemini / Watson', pips: 4 },
          { name: 'TensorFlow / Keras', pips: 3 },
          { name: 'MCP / Agentic', pips: 4 },
          { name: 'NLP / Voice AI', pips: 3 }
        ]
      },
      {
        branch: 'Fullstack Dev',
        hdrClass: 'fs',
        icon: 'fa-code',
        nodes: [
          { name: 'Python / IronPython', pips: 5 },
          { name: 'Next.js / React / TS', pips: 4 },
          { name: 'GraphQL / REST APIs', pips: 4 },
          { name: 'FastAPI / .NET', pips: 4 },
          { name: 'PostgreSQL / Redis', pips: 4 },
          { name: 'TailwindCSS', pips: 3 }
        ]
      },
      {
        branch: 'Cloud & Infra',
        hdrClass: 'cloud',
        icon: 'fa-cloud',
        nodes: [
          { name: 'AWS (Bedrock, Lambda)', pips: 4 },
          { name: 'Docker / Containers', pips: 3 },
          { name: 'CI/CD Pipelines', pips: 3 },
          { name: 'Microservices', pips: 4 }
        ]
      },
      {
        branch: 'Game & Creative',
        hdrClass: 'gd',
        icon: 'fa-gamepad',
        nodes: [
          { name: 'Panda3D / PyOpenGL', pips: 4 },
          { name: '2D/3D Game Design', pips: 4 },
          { name: 'AR / VR Dev', pips: 3 },
          { name: 'IoT / HW Integration', pips: 3 }
        ]
      }
    ],

    /* —— Quests (Projects) —— */
    questTabs: ['SAP CPQ', 'GenAI', 'Impact', 'College'],
    quests: {
      'SAP CPQ': [
        { title: 'IBMSW', status: 'done', icon: 'fa-check-circle', desc: '2.5-year full quote-to-cash: CPI/S4/VCPS integration, CPQ+Commerce, Watson AI chatbot, approval automation.', tags: ['CPQ','CPI','S4','Watson','GraphQL'], bar: 100, barColor: 'green' },
        { title: 'HPI', status: 'done', icon: 'fa-check-circle', desc: '1.5 years: Multi-country pricing engine, ETO profiling, microservice APIs for global markets.', tags: ['CPQ','Microservices','Pricing'], bar: 100, barColor: 'green' },
        { title: 'IBMHW', status: 'done', icon: 'fa-check-circle', desc: '1 year: 3D/AR product views, Watson automation, GraphQL microservices, ML proficiency scoring.', tags: ['CPQ','AR/3D','Watson','ML','GraphQL'], bar: 100, barColor: 'green' },
        { title: 'KONIKA MINOLTA', status: 'done', icon: 'fa-check-circle', desc: '9 months: Ticketing, reporting dashboards, product automation, sales onboarding.', tags: ['CPQ','Automation','Reporting'], bar: 100, barColor: 'green' },
        { title: 'FARO', status: 'done', icon: 'fa-check-circle', desc: '6 months: Approval rules, pricing engine, warranty management, dynamic discounting.', tags: ['CPQ','Pricing','Warranty'], bar: 100, barColor: 'green' },
        { title: 'ROGERS', status: 'done', icon: 'fa-check-circle', desc: '2 months: Product portfolio generation from CSV automation.', tags: ['CPQ','CSV','Automation'], bar: 100, barColor: 'green' },
        { title: 'DTNA', status: 'done', icon: 'fa-check-circle', desc: '2 months: PriceFx integration with CPQ systems.', tags: ['CPQ','PriceFx'], bar: 100, barColor: 'green' },
        { title: 'Kelloggs', status: 'done', icon: 'fa-check-circle', desc: 'Salesforce storefront development for consumer goods.', tags: ['Salesforce','Commerce'], bar: 100, barColor: 'green' }
      ],
      'GenAI': [
        { title: 'AI ADVANTAGE', status: 'done', icon: 'fa-check-circle', desc: 'Contract data extraction with AWS Strand Agents, RAG/MCP, LangChain/LangGraph. Sold to Disney, ESPN, BioMarin.', tags: ['AWS','RAG','MCP','LangChain','LangGraph'], bar: 100, barColor: 'green' },
        { title: 'SANOFI', status: 'done', icon: 'fa-check-circle', desc: 'Full automation pipeline for client delivery (requirements → pre-prod-go-live). Converted to Deloitte internal use.', tags: ['Automation','Pipeline','GenAI'], bar: 100, barColor: 'green' },
        { title: 'PMI SMT', status: 'done', icon: 'fa-check-circle', desc: 'Gemini-powered executive mentorship app with voice sensitivity and user profiling.', tags: ['Gemini','Voice AI','Profiling'], bar: 100, barColor: 'green' },
        { title: 'AMAN Security Device', status: 'done', icon: 'fa-check-circle', desc: 'Crowd scanning for concealed weapons/threats with threat-level calculation, deployed for BSF battalion 98 across 16 schools after the 2023 Nuh Haryana attacks.', tags: ['Computer Vision','IoT','Security'], bar: 100, barColor: 'green' }
      ],
      'Impact': [
        { title: 'Explainosphere', status: 'done', icon: 'fa-check-circle', desc: 'Universal curiosity learning platform built with FastAPI, Next.js, GPT-4, PostgreSQL, Redis.', tags: ['FastAPI','Next.js','GPT-4','PostgreSQL'], bar: 100, barColor: 'green' },
        { title: 'E-MedicalHELP', status: 'done', icon: 'fa-check-circle', desc: 'Centralized emergency medical system with NLP voice processing and hospital alignment.', tags: ['NLP','Healthcare','Emergency'], bar: 100, barColor: 'green' },
        { title: 'Navgyan Parishad NGO', status: 'done', icon: 'fa-check-circle', desc: 'Education curriculum improvement initiative through NGO collaboration.', tags: ['Education','NGO'], bar: 100, barColor: 'green' },
        { title: 'AM&C Community Apps', status: 'done', icon: 'fa-check-circle', desc: 'End-to-end dashboards, 2D games (Android/iOS), AR/VR apps for Gurgaon AM&C events.', tags: ['Mobile','AR/VR','Games'], bar: 100, barColor: 'green' }
      ],
      'College': [
        { title: 'MCOACH', status: 'done', icon: 'fa-check-circle', desc: 'Knowledge ontology system using OwlReady2 and Keras for adaptive learning.', tags: ['OwlReady2','Keras','Ontology'], bar: 100, barColor: 'green' },
        { title: 'CUBE DEALT', status: 'done', icon: 'fa-check-circle', desc: "Rubik's Cube optimizer using TensorFlow and evolutionary algorithms.", tags: ['TensorFlow','Evolutionary','3D'], bar: 100, barColor: 'green' },
        { title: 'CRASH SAVERS', status: 'done', icon: 'fa-check-circle', desc: 'Smart road safety system combining IoT sensors with holographic projection.', tags: ['IoT','Holograms','Safety'], bar: 100, barColor: 'green' }
      ]
    },

    /* —— Achievements —— */
    achievements: [
      { title: 'Triple Promotion', desc: 'Analyst → Developer → Senior Developer at Deloitte', icon: 'fa-arrow-up', rarity: 'legendary', unlocked: true },
      { title: 'Disney Deal', desc: 'AI Advantage sold to Disney, ESPN & BioMarin', icon: 'fa-star', rarity: 'legendary', unlocked: true },
      { title: 'TCS DISQ 17th', desc: '17th rank in India at TCS Nashik DISQ', icon: 'fa-trophy', rarity: 'epic', unlocked: true },
      { title: 'Security Guardian', desc: 'AMAN device deployed for BSF battalion & 16 schools', icon: 'fa-shield-alt', rarity: 'epic', unlocked: true },
      { title: 'Enterprise Veteran', desc: '8 SAP CPQ projects across global brands', icon: 'fa-building', rarity: 'epic', unlocked: true },
      { title: 'AI Pioneer', desc: '3 major GenAI projects + multiple POCs', icon: 'fa-brain', rarity: 'rare', unlocked: true },
      { title: 'Community Builder', desc: 'AM&C event apps, SAP CX trainings, R1 recruitment', icon: 'fa-users', rarity: 'rare', unlocked: true },
      { title: 'Game Developer', desc: '5+ year game-dev portfolio (Panda3D, PyOpenGL)', icon: 'fa-gamepad', rarity: 'rare', unlocked: true },
      { title: 'Full Stack Ace', desc: 'Frontend + Backend + AI + Cloud mastery', icon: 'fa-layer-group', rarity: 'rare', unlocked: true },
      { title: 'Social Impact', desc: 'Explainosphere, E-MedicalHELP, Navgyan Parishad', icon: 'fa-heart', rarity: 'rare', unlocked: true }
    ],

    /* —— Inventory —— */
    inventory: [
      { name: 'Python', icon: 'fa-python', brand: true, rarity: 'legendary' },
      { name: 'SAP CPQ', icon: 'fa-cogs', rarity: 'legendary' },
      { name: 'AWS Bedrock', icon: 'fa-aws', brand: true, rarity: 'epic' },
      { name: 'LangChain', icon: 'fa-link', rarity: 'epic' },
      { name: 'Next.js', icon: 'fa-react', brand: true, rarity: 'epic' },
      { name: 'GPT-4', icon: 'fa-brain', rarity: 'epic' },
      { name: 'Gemini', icon: 'fa-gem', rarity: 'epic' },
      { name: 'TensorFlow', icon: 'fa-project-diagram', rarity: 'rare' },
      { name: 'GraphQL', icon: 'fa-project-diagram', rarity: 'rare' },
      { name: 'PostgreSQL', icon: 'fa-database', rarity: 'rare' },
      { name: 'FastAPI', icon: 'fa-bolt', rarity: 'rare' },
      { name: 'TypeScript', icon: 'fa-code', rarity: 'rare' },
      { name: 'Redis', icon: 'fa-memory', rarity: 'rare' },
      { name: 'Docker', icon: 'fa-docker', brand: true, rarity: 'rare' },
      { name: 'IoT', icon: 'fa-microchip', rarity: 'rare' },
      { name: 'Panda3D', icon: 'fa-cube', rarity: 'rare' }
    ],

    /* —— Desktop icons —— */
    desktopIcons: [
      { id: 'about', label: 'About Me', icon: 'fa-user-astronaut', color: '#6366f1' },
      { id: 'skills', label: 'Skill Tree', icon: 'fa-sitemap', color: '#06b6d4' },
      { id: 'quests', label: 'Quest Log', icon: 'fa-scroll', color: '#22c55e' },
      { id: 'achievements', label: 'Achievements', icon: 'fa-trophy', color: '#f59e0b' },
      { id: 'inventory', label: 'Inventory', icon: 'fa-boxes-stacked', color: '#8b5cf6' },
      { id: 'terminal', label: 'Terminal', icon: 'fa-terminal', color: '#22c55e' }
    ]
  },

  gaming: {
    id: 'gaming',
    name: 'Gaming Profile',
    icon: 'fa-gamepad',
    badge: 'Coming Soon',
    badgeClass: 'soon',
    tagline: 'Game Developer · 5-year portfolio · Panda3D / PyOpenGL',
    wallpaper: 'linear-gradient(135deg,#0a0e17 0%,#1a0a2e 50%,#0a0e17 100%)',
    comingSoon: true,
    teaser: 'Panda3D, PyOpenGL, 2D/3D game design, open-source modding, AR/VR — full gaming portfolio coming soon!'
  },

  speedcubing: {
    id: 'speedcubing',
    name: 'Speedcubing',
    icon: 'fa-cube',
    badge: 'Coming Soon',
    badgeClass: 'soon',
    tagline: "Rubik's Cube enthusiast · CUBE DEALT optimizer",
    wallpaper: 'linear-gradient(135deg,#0a0e17 0%,#0a1e17 50%,#0a0e17 100%)',
    comingSoon: true,
    teaser: "Speedcubing journey, CUBE DEALT optimizer (TensorFlow + evolutionary algorithms), competition records, and solver tools — coming soon!"
  }
};

/* Ordered list for selector */
const PROFILE_ORDER = ['general', 'gaming', 'speedcubing'];
