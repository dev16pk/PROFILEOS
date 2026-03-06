/* ============================================
   profiles.js — Profile Data Store
   All profile data keyed by slug
   ============================================ */

const PROFILES = {
  general: {
    id: 'general',
    name: 'Crate',
    icon: 'fa-briefcase',
    badge: 'Live',
    badgeClass: 'live',
    tagline: 'Fullstack Developer · AI Architect · SAP Solutions SME',
    wallpaper: 'linear-gradient(135deg,#0a0e17 0%,#111827 50%,#0a0e17 100%)',

    /* —— About —— */
    about: {
      name: 'Devyani P. Kumar',
      title: 'Senior Developer',
      summary: 'Fullstack engineer and AI architect specializing in enterprise SAP CPQ, generative AI (RAG, agentic workflows, LLMs), and cloud-native systems on AWS. Experienced in building end-to-end solutions across pricing engines, contract intelligence, and conversational AI. Open-source contributor with a background in game development and community-impact projects.',
      attributes: [
        { key: 'LVL', val: '26', desc: 'Level' },
        { key: 'EXP', val: '5.5yr', desc: 'Experience' },
        { key: 'RANK', val: 'Sr Dev', desc: 'Deloitte' },
        { key: 'PROMO', val: '2', desc: 'Promotions' },
        { key: 'PROJ', val: '14+', desc: 'Projects' },
        { key: 'CLASS', val: 'Arch', desc: 'Architect' }
      ]
    },

    /* —— Stats —— */
    stats: [
      { name: 'SAP Solutions', value: 95, color: 'blue', icon: 'fa-gears', projects: ['IBMSW', 'HPI', 'IBMHW', 'KONIKA MINOLTA', 'FARO', 'ROGERS', 'DTNA', 'Kelloggs'] },
      { name: 'GenAI & LLMs', value: 90, color: 'pink', icon: 'fa-brain', projects: ['AI ADVANTAGE', 'SANOFI', 'PMI SMT', 'Explainosphere'] },
      { name: 'Backend Systems', value: 88, color: 'green', icon: 'devicon-python-plain', projects: ['AI ADVANTAGE', 'SANOFI', 'IBMSW', 'HPI', 'E-MedicalHELP'] },
      { name: 'Game & Creative', value: 86, color: 'pink', icon: 'fa-gamepad', projects: ['AM&C Community Apps', 'CUBE DEALT', 'IBMHW 3D/AR'] },
      { name: 'Cloud & DevOps', value: 85, color: 'blue', icon: 'devicon-amazonwebservices-plain-wordmark', projects: ['AI ADVANTAGE', 'SANOFI', 'HPI', 'Explainosphere'] },
      { name: 'Frontend & UI', value: 82, color: 'gold', icon: 'devicon-react-original', projects: ['Explainosphere', 'IBMSW Commerce', 'Kelloggs', 'PMI SMT'] }
    ],

    /* —— Skill Tree —— */
    skills: [
      {
        branch: 'SAP & Enterprise',
        hdrClass: 'ent',
        icon: 'fa-building',
        nodes: [
          { name: 'SAP CPQ', pips: 5, icon: 'fa-gears' },
          { name: 'SAP CPI / S4 HANA', pips: 4, icon: 'fa-right-left' },
          { name: 'SAP BTP / Commerce', pips: 4, icon: 'fa-cubes' },
          { name: 'SAP AI Core', pips: 2, icon: 'fa-microchip' },
          { name: 'Salesforce', pips: 3, icon: 'devicon-salesforce-plain' }
        ]
      },
      {
        branch: 'AI & GenAI',
        hdrClass: 'ai',
        icon: 'fa-robot',
        nodes: [
          { name: 'LangChain / LangGraph', pips: 5, icon: 'fa-link-slash' },
          { name: 'RAG / AWS Bedrock', pips: 5, icon: 'devicon-amazonwebservices-plain-wordmark' },
          { name: 'LLMs (GPT-4, Gemini, Watson)', pips: 4, icon: 'fa-wand-magic-sparkles' },
          { name: 'Agentic AI / MCP', pips: 4, icon: 'fa-diagram-project' },
          { name: 'NLP / Voice AI', pips: 3, icon: 'fa-comments' },
          { name: 'TensorFlow / Keras', pips: 3, icon: 'devicon-tensorflow-original' },
          { name: 'Model Finetuning', pips: 4, icon: 'fa-sliders' }
        ]
      },
      {
        branch: 'DSA & ML',
        hdrClass: 'dsa',
        icon: 'fa-chart-line',
        nodes: [
          { name: 'Data Structures & Algorithms', pips: 4, icon: 'fa-project-diagram' },
          { name: 'Dynamic Programming', pips: 4, icon: 'fa-table-cells' },
          { name: 'Genetic Algorithms', pips: 4, icon: 'fa-dna' },
          { name: 'Knowledge Ontology', pips: 4, icon: 'fa-network-wired' },
          { name: 'Cognitive Computing', pips: 3, icon: 'fa-head-side-virus' },
          { name: 'ML Pipelines', pips: 4, icon: 'fa-chart-line' },
          { name: 'Evolutionary Algorithms', pips: 3, icon: 'fa-seedling' }
        ]
      },
      {
        branch: 'Fullstack Dev',
        hdrClass: 'fs',
        icon: 'fa-code',
        nodes: [
          { name: 'Python', pips: 5, icon: 'devicon-python-plain' },
          { name: 'IronPython', pips: 4, icon: 'devicon-python-plain' },
          { name: 'Next.js / React / TS', pips: 4, icon: 'devicon-nextjs-plain' },
          { name: 'GraphQL / REST APIs', pips: 4, icon: 'devicon-graphql-plain' },
          { name: 'FastAPI / .NET', pips: 4, icon: 'devicon-fastapi-plain' },
          { name: 'PostgreSQL / Redis', pips: 4, icon: 'devicon-postgresql-plain' },
          { name: 'TailwindCSS', pips: 3, icon: 'devicon-tailwindcss-original' }
        ]
      },
      {
        branch: 'Cloud & DevOps',
        hdrClass: 'cloud',
        icon: 'devicon-amazonwebservices-plain-wordmark',
        nodes: [
          { name: 'AWS (Lambda, S3, EC2)', pips: 4, icon: 'devicon-amazonwebservices-plain-wordmark' },
          { name: 'Microservices', pips: 4, icon: 'fa-cubes' },
          { name: 'Docker / Containers', pips: 3, icon: 'devicon-docker-plain' },
          { name: 'CI/CD Pipelines', pips: 3, icon: 'fa-arrows-spin' }
        ]
      },
      {
        branch: 'Game & Creative',
        hdrClass: 'gd',
        icon: 'fa-gamepad',
        nodes: [
          { name: 'Panda3D / PyOpenGL', pips: 5, icon: 'devicon-opengl-plain' },
          { name: '2D/3D Game Development', pips: 5, icon: 'fa-dice-d20' },
          { name: 'Game Jams and Bug Bounty Hunting', pips: 4, icon: 'fa-trophy' },
          { name: 'Game Modding', pips: 4, icon: 'fa-wrench' },
          { name: 'AR / VR Dev', pips: 3, icon: 'fa-vr-cardboard' },
          { name: 'IoT / HW Integration', pips: 3, icon: 'devicon-arduino-plain' }
        ]
      }
    ],

    /* —— Quests (Projects) —— */
    questTabs: ['SAP Products', 'GenAI', 'Impact', 'College'],
    quests: {
      'SAP Products': [
        { title: 'HPI', date: '2024 – 2025', status: 'done', icon: 'fa-print', logo: 'assets/logos/hpi.png', desc: '1.5 years: Multi-country pricing engine, ETO product profiling, microservice APIs for global markets.', tags: ['CPQ','Microservices','Pricing'], bar: 100, barColor: 'green',
          role: 'Senior Developer',
          timeline: [
            { phase: 'Requirements & Scoping', detail: 'Analyzed multi-country pricing rules across EMEA, APAC, and Americas regions' },
            { phase: 'ETO Profiling Engine', detail: 'Built Engineer-to-Order profiling system for custom product configurations' },
            { phase: 'Microservice APIs', detail: 'Designed and deployed .NET/REST microservices for regional pricing and tax calculation' },
            { phase: 'UAT & Deployment', detail: 'Led user acceptance testing with global HP Inc. pricing teams and production rollout' }
          ]
        },
        { title: 'IBMHW', date: '2023 – 2024', status: 'done', icon: 'fa-desktop', logo: 'assets/logos/ibm.png', desc: '1 year: 3D/AR product views, WatsonX automation, GraphQL microservices, probabilistic custom solutions, ML proficiency scoring.', tags: ['CPQ','AR/3D','WatsonX','ML','GraphQL','Deterministic Math'], bar: 100, barColor: 'green',
          role: 'Developer',
          timeline: [
            { phase: '3D/AR Product Views', detail: 'Integrated 3D and AR visualization for IBM Hardware product catalog' },
            { phase: 'WatsonX Automation', detail: 'Automated product recommendation and configuration using WatsonX AI' },
            { phase: 'GraphQL Microservices', detail: 'Built GraphQL API layer for cross-system data aggregation' },
            { phase: 'ML Proficiency Scoring', detail: 'Developed ML model for sales rep proficiency scoring and training recommendations after exploring determinstic mathematical functions for hardware slotting in server configurations' }
          ]
        },
        { title: 'FARO', date: '2022', status: 'done', icon: 'fa-crosshairs', logo: 'assets/logos/faro.png', desc: '6 months: Approval rules, pricing engine, warranty management, dynamic discounting.', tags: ['CPQ','Pricing','Warranty'], bar: 100, barColor: 'green',
          role: 'Developer',
          timeline: [
            { phase: 'Approval Rules Engine', detail: 'Configured multi-tier approval workflows with role-based escalation' },
            { phase: 'Pricing Engine', detail: 'Built dynamic pricing engine with volume-based and contract-based discounting' },
            { phase: 'Warranty Management', detail: 'Implemented warranty plan selection and extended warranty pricing logic' },
            { phase: 'Go-Live', detail: 'Production deployment and handover to FARO internal teams' }
          ]
        },
        { title: 'IBMSW', date: '2021 – 2023', status: 'done', icon: 'fa-server', logo: 'assets/logos/ibm.png', desc: '2.5-year: Full quote-to-cash, Third Party Integration, CPQ+Commerce, WatsonX AI chatbot, approval automation.', tags: ['CPQ','WatsonX','GraphQL'], bar: 100, barColor: 'green',
          role: 'Lead Developer',
          timeline: [
            { phase: 'Discovery & Architecture', detail: 'Mapped IBM Software quote-to-cash flow; designed CPI/S4 HANA integration blueprint' },
            { phase: 'CPQ + Commerce Build', detail: 'Built CPQ pricing engine with Commerce Cloud storefront and VCPS variant config' },
            { phase: 'WatsonX AI Chatbot', detail: 'Developed Watson-powered chatbot for guided selling and product recommendation' },
            { phase: 'Approval Automation', detail: 'Implemented multi-level approval workflows with dynamic discount thresholds' },
            { phase: 'Go-Live & Hypercare', detail: 'Production rollout for IBM global teams; provided 3-month hypercare support' }
          ]
        },
        { title: 'KONIKA MINOLTA', date: '2021 – 2022', status: 'done', icon: 'fa-camera', logo: 'assets/logos/km.jpg', desc: '9 months: Ticketing, reporting dashboards, product automation, sales onboarding, integration with S4/HANA, CPI and VCPS.', tags: ['CPQ','Automation','Reporting', 'CPI', 'VCPS'], bar: 100, barColor: 'green',
          role: 'Developer',
          timeline: [
            { phase: 'Ticketing System', detail: 'Built internal ticketing module for sales and support workflow management' },
            { phase: 'Reporting Dashboards', detail: 'Created real-time analytics dashboards for quote performance and pipeline tracking' },
            { phase: 'Product Automation', detail: 'Automated product catalog updates and pricing rule propagation' },
            { phase: 'Sales Onboarding', detail: 'Designed guided onboarding flows for new sales representatives and integrations with VCPS/CPI and S4/HANA' }
          ]
        },
        { title: 'ROGERS', date: '2021', status: 'done', icon: 'fa-tower-cell', logo: 'assets/logos/rogers.png', desc: '2 months: Product portfolio generation from CSV automation.', tags: ['CPQ','CSV','Automation'], bar: 100, barColor: 'green',
          role: 'Developer',
          timeline: [
            { phase: 'CSV Parsing Engine', detail: 'Built automated CSV ingestion pipeline for Rogers telecom product catalog' },
            { phase: 'Portfolio Generation', detail: 'Automated product portfolio creation with validation and error handling' },
            { phase: 'Delivery', detail: 'Deployed automation and documented the pipeline for Rogers team handoff' }
          ]
        },
        { title: 'DTNA', date: '2021', status: 'done', icon: 'fa-truck', logo: 'assets/logos/dtna.webp', desc: '2 months: PriceFx integration with CPQ systems.', tags: ['CPQ','PriceFx'], bar: 100, barColor: 'green',
          role: 'Developer',
          timeline: [
            { phase: 'Integration Design', detail: 'Mapped PriceFx pricing model to CPQ data schema for DTNA truck configurator' },
            { phase: 'API Development', detail: 'Built bi-directional API bridge between PriceFx and SAP CPQ' },
            { phase: 'Testing & Handoff', detail: 'End-to-end integration testing and production deployment' }
          ]
        },
        { title: 'Kelloggs', date: '2020', status: 'done', icon: 'fa-wheat-awn', logo: 'assets/logos/kelloggs.png', desc: 'Salesforce storefront development for consumer goods.', tags: ['Salesforce','Commerce'], bar: 100, barColor: 'green',
          role: 'Developer',
          timeline: [
            { phase: 'Storefront Setup', detail: 'Configured Salesforce Commerce Cloud storefront for Kelloggs consumer goods' },
            { phase: 'Product Catalog', detail: 'Built product catalog with category hierarchy and promotional pricing' },
            { phase: 'Deployment', detail: 'Storefront go-live and handover to Kelloggs digital team' }
          ]
        }
      ],
      'GenAI': [
        { title: 'PMI SMT', date: '2026', status: 'ongoing', icon: 'fa-gem', logo: 'assets/logos/pmi.png', desc: 'Gemini-powered executive mentorship app with voice sensitivity and user profiling.', tags: ['Gemini','Voice AI','Profiling'], bar: 55, barColor: 'blue',
          role: 'Lead Fullstack Developer',
          timeline: [
            { phase: 'User Profiling System', detail: 'Built executive profiling engine capturing leadership style and growth areas' },
            { phase: 'Gemini LLM Integration', detail: 'Connected Gemini API for context-aware mentorship guidance and feedback' },
            { phase: 'Voice Sensitivity', detail: 'Implemented voice-based interaction with tone and sentiment analysis' },
            { phase: 'Pilot Launch', detail: 'Deployed pilot with PMI executive cohort and gathered feedback for iteration' }
          ]
        },
        { title: 'AI ADVANTAGE', date: '2025 – 2026', status: 'ongoing', icon: 'fa-wand-magic-sparkles', logo: 'assets/logos/deloitte.png', desc: 'Contract data extraction with AWS Strand Agents, RAG/MCP, LangChain/LangGraph. Sold to Disney, ESPN, BioMarin.', tags: ['AWS','RAG','MCP','LangChain','LangGraph'], bar: 85, barColor: 'blue',
          role: 'AI Architect/Agent Developer',
          timeline: [
            { phase: 'Architecture & POC', detail: 'Designed agentic RAG architecture using AWS Strand Agents and LangChain/LangGraph' },
            { phase: 'Contract Extraction Pipeline', detail: 'Built intelligent document parsing with MCP-based multi-agent orchestration' },
            { phase: 'Enterprise Clients', detail: 'Productionized for Disney, ESPN, and BioMarin — handling real contract workflows' },
            { phase: 'Scale & Optimization', detail: 'Optimized retrieval latency and token costs for enterprise-scale ingestion' }
          ]
        },
        { title: 'SANOFI', date: '2025', status: 'done', icon: 'fa-flask-vial', logo: 'assets/logos/sanofi.png', desc: 'Full automation pipeline for client delivery (requirements → pre-prod-go-live). Converted to Deloitte internal use.', tags: ['Automation','Pipeline','GenAI'], bar: 100, barColor: 'green',
          role: 'Lead Developer',
          timeline: [
            { phase: 'Pipeline Design', detail: 'Designed end-to-end automation pipeline from requirements gathering to deployment' },
            { phase: 'GenAI Integration', detail: 'Integrated LLM-driven document analysis and automated code generation' },
            { phase: 'Pre-Prod & Go-Live', detail: 'Automated staging, validation, and production promotion workflows' },
            { phase: 'Deloitte Internal Adoption', detail: 'Pipeline converted to Deloitte internal accelerator for client delivery' }
          ]
        }
      ],
      'Impact': [
        { title: 'AM&C Community Apps', date: '2025 - 2026', status: 'ongoing', icon: 'fa-mobile-screen-button', logo: 'assets/logos/deloitte.png', desc: 'End-to-end dashboards, 2D games (Android/iOS), AR/VR apps for Gurgaon AM&C events.', tags: ['Mobile','AR/VR','Games'], bar: 68, barColor: 'blue',
          role: 'Fullstack Developer',
          timeline: [
            { phase: 'Event Dashboards', detail: 'Built real-time dashboards for AM&C community event management' },
            { phase: '2D Games (Android/iOS)', detail: 'Developed cross-platform 2D games for community engagement at events' },
            { phase: 'AR/VR Experiences', detail: 'Created AR/VR interactive experiences for Gurgaon AM&C showcases' }
          ]
        },
        { title: 'Explainosphere', date: '2024', status: 'done', icon: 'fa-lightbulb', logo: 'assets/logos/explainosphere.png', desc: 'Universal learning platform built with FastAPI, Next.js, GPT-4, PostgreSQL, Redis.', tags: ['FastAPI','Next.js','GPT-4','PostgreSQL'], bar: 100, barColor: 'green',
          role: 'Fullstack Developer',
          timeline: [
            { phase: 'Platform Architecture', detail: 'Designed curiosity-driven learning platform with FastAPI backend and Next.js frontend' },
            { phase: 'GPT-4 Integration', detail: 'Built GPT-4 powered explanation engine for any topic at any complexity level' },
            { phase: 'Data Layer', detail: 'Implemented PostgreSQL + Redis for content caching and user session management' },
            { phase: 'Launch', detail: 'Deployed as open-access learning platform' }
          ]
        },
        { title: 'AMAN', date: '2023 – 2025', status: 'done', icon: 'fa-shield-halved', logo: 'assets/logos/aman.png', desc: 'Crowd-scanning system for concealed weapons with threat-level calculation. Tested and launched with BSF battalion 98 support, who arranged real-time and fictional threat simulations. Built in response to the 2023 Nuh Haryana attacks.', tags: ['Computer Vision','IoT','Security'], bar: 100, barColor: 'green',
          role: 'Creator & Lead Engineer',
          timeline: [
            { phase: 'Research & Motivation', detail: 'Initiated project in response to 2023 Nuh Haryana attacks — threat detection gap analysis' },
            { phase: 'Hardware + CV Build', detail: 'Built crowd-scanning device with computer vision for concealed weapon detection' },
            { phase: 'Threat-Level Algorithm', detail: 'Developed real-time threat-level calculation engine with multi-sensor fusion' },
            { phase: 'BSF Field Testing', detail: 'Tested and launched with BSF battalion 98 — real-time and fictional threat simulations' }
          ]
        },
        { title: 'E-MedicalHELP', date: '2023', status: 'done', icon: 'fa-hospital', logo: 'assets/logos/emedichelp.png', desc: 'Centralized emergency medical system with NLP voice processing, IoT device integrations and hospital alignment.', tags: ['IoT', 'NLP','Healthcare','Emergency', 'Data Analytics'], bar: 100, barColor: 'green',
          role: 'Lead Developer & Data Analyst',
          timeline: [
            { phase: 'System Design', detail: 'Architected centralized emergency medical response system' },
            { phase: 'NLP Voice Processing', detail: 'Built voice-based triage system using NLP for emergency symptom extraction' },
            { phase: 'Hospital Alignment', detail: 'Integrated nearest-hospital matching with real-time bed availability' },
            { phase: 'Deployment', detail: 'Deployed for emergency response demonstration and testing' }
          ]
        },
        { title: 'Navgyan Niyojan', date: '2020 – 2026', status: 'ongoing', icon: 'fa-graduation-cap', logo: 'assets/logos/navgyan.png', desc: 'Education curriculum improvement initiative through NGO collaboration.', tags: ['Education','NGO'], bar: 60, barColor: 'gold',
          role: 'Volunteer Developer',
          timeline: [
            { phase: 'Curriculum Analysis', detail: 'Collaborated with NGO to assess gaps in existing education curriculum' },
            { phase: 'Platform Development', detail: 'Built digital tools for curriculum tracking and improvement suggestions' },
            { phase: 'Community Rollout', detail: 'Deployed for community schools and gathered teacher feedback' }
          ]
        }
      ],
      'College': [
        { title: 'CUBE DEALT', date: '2019 - 2026', status: 'ongoing', icon: 'fa-cube', logo: 'assets/logos/cube.png', desc: "Rubik's Cube optimizer using TensorFlow and evolutionary algorithms.", tags: ['TensorFlow','Evolutionary','3D'], bar: 72, barColor: 'gold',
          role: 'Fullstack Solo Developer',
          timeline: [
            { phase: 'Algorithm Research', detail: 'Researched evolutionary algorithms and genetic search for cube state optimization' },
            { phase: 'TensorFlow Model', detail: 'Trained TensorFlow model for cube-state prediction and move sequence optimization' },
            { phase: '3D Visualization', detail: 'Built 3D Rubik\'s Cube visualizer with real-time solve animations, now extending to other dimensions 4x4, 7x7, mirror cube and pyramid cube' }
          ]
        },
        { title: 'MCOACH', date: '2019 - 2020', status: 'done', icon: 'fa-brain', logo: 'assets/logos/mcoach.png', desc: 'Knowledge ontology system using OwlReady2 and Keras for adaptive learning.', tags: ['OwlReady2','Keras','Ontology'], bar: 100, barColor: 'green',
          role: 'Fullstack Solo Developer',
          timeline: [
            { phase: 'Ontology Design', detail: 'Designed knowledge ontology graph using OwlReady2 for subject mapping' },
            { phase: 'Adaptive Learning Engine', detail: 'Built Keras-based model for personalized learning path recommendations' },
            { phase: 'Evaluation & Thesis', detail: 'Evaluated with test cohorts and published findings as college thesis' }
          ]
        },
        { title: 'CRASH SAVERS', date: '2018', status: 'done', icon: 'fa-road', logo: 'assets/logos/irsc.png', desc: 'Smart road safety system combining IoT sensors with holographic projection with association to IRSC (Indian Road Safety Campaign)', tags: ['IoT','Holograms','Safety'], bar: 100, barColor: 'green',
          role: 'Application Developer',
          timeline: [
            { phase: 'IoT Sensor Array', detail: 'Designed multi-sensor detection system for road hazard identification' },
            { phase: 'Holographic Projection', detail: 'Integrated holographic warning projection for real-time driver alerts' },
            { phase: 'Field Testing', detail: 'Tested prototype on simulated road conditions with live sensor data' }
          ]
        }
      ]
    },

    /* —— Achievements —— */
    achievements: [
      { title: 'Double Promotion', desc: '🚀 Joined as Analyst (2020), promoted to Consultant (2022), then Senior Consultant (2025) — speedrun the corporate ladder at Deloitte', icon: 'fa-arrow-up', rarity: 'legendary', unlocked: true },
      { title: 'Enterprise Architect', desc: '🏛️ Shipped 8 SAP product implementations for Deloitte clients worldwide — from IBM to DTNA to HPI', icon: 'fa-building', rarity: 'legendary', unlocked: true },
      { title: 'TCS DISQ Finalist', desc: '🏅 Ranked 17th nationally in TCS Digital Callforsolutions 2022 — outlasted thousands of competitors', icon: 'fa-trophy', rarity: 'epic', unlocked: true },
      { title: 'Security Guardian', desc: '🛡️ Built & field-tested AMAN threat-detection system with BSF battalion 98 — real crowds, real simulations, real impact', icon: 'fa-shield-alt', rarity: 'epic', unlocked: true },
      { title: 'AI Innovator', desc: '🧠 Architected production GenAI systems — RAG pipelines, agentic workflows & LLMs humming at enterprise scale', icon: 'fa-brain', rarity: 'epic', unlocked: true },
      { title: 'Fullstack Engineer', desc: '⚡ Mastered the full stack — frontend, backend, cloud & data layers all in the toolkit', icon: 'fa-layer-group', rarity: 'elite', unlocked: true },
      { title: 'Game Dev Veteran', desc: '🎮 Won game jams, raised COVID housing funds through online gaming, certified by Gaming Monk & modded high-spec games for low-end systems at OceanOfGames', icon: 'fa-gamepad', rarity: 'elite', unlocked: true },
      { title: 'Community Champion', desc: '🤝 Built AM&C community event apps, led SAP CX training sessions & helped onboard new talent into the firm', icon: 'fa-users', rarity: 'elite', unlocked: true },
      { title: 'Social Impact Hero', desc: '💛 Launched platforms serving education, healthcare & social good — code that actually makes a difference', icon: 'fa-heart', rarity: 'elite', unlocked: true }
    ],

    /* —— Inventory —— */
    inventory: [
      { name: 'Python', icon: 'devicon-python-plain', rarity: 'legendary' },
      { name: 'SAP CPQ', icon: 'fa-gears', rarity: 'legendary' },
      { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark', rarity: 'legendary' },
      { name: 'LangChain', icon: 'fa-link-slash', rarity: 'epic' },
      { name: 'LangGraph', icon: 'fa-diagram-project', rarity: 'epic' },
      { name: 'Next.js', icon: 'devicon-nextjs-plain', rarity: 'epic' },
      { name: 'GPT-4', icon: 'fa-wand-magic-sparkles', rarity: 'epic' },
      { name: 'Gemini', icon: 'fa-gem', rarity: 'epic' },
      { name: 'TensorFlow', icon: 'devicon-tensorflow-original', rarity: 'epic' },
      { name: 'GraphQL', icon: 'devicon-graphql-plain', rarity: 'epic' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', rarity: 'epic' },
      { name: 'FastAPI', icon: 'devicon-fastapi-plain', rarity: 'epic' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain', rarity: 'epic' },
      { name: 'Redis', icon: 'devicon-redis-plain', rarity: 'epic' },
      { name: 'Docker', icon: 'devicon-docker-plain', rarity: 'epic' },
      { name: 'React', icon: 'devicon-react-original', rarity: 'epic' },
      { name: '.NET', icon: 'devicon-dotnetcore-plain', rarity: 'epic' },
      { name: 'IronPython', icon: 'devicon-python-plain', rarity: 'epic' },
      { name: 'IBM WatsonX', icon: 'fa-robot', rarity: 'epic' },
      { name: 'Panda3D', icon: 'devicon-opengl-plain', rarity: 'epic' },
      { name: 'SAP BTP', icon: 'fa-cubes', rarity: 'epic' },
      { name: 'Salesforce', icon: 'devicon-salesforce-plain', rarity: 'elite' },
      { name: 'TailwindCSS', icon: 'devicon-tailwindcss-original', rarity: 'elite' }
    ],

    /* —— Desktop icons —— */
    desktopIcons: [
      { id: 'skills', label: 'Skill Tree', icon: 'fa-sitemap', color: '#06b6d4' },
      { id: 'quests', label: 'Quest Log', icon: 'fa-scroll', color: '#22c55e' },
      { id: 'achievements', label: 'Achievements', icon: 'fa-trophy', color: '#f59e0b' },
      { id: 'inventory', label: 'Inventory', icon: 'fa-boxes-stacked', color: '#8b5cf6' },
      { id: 'chat', label: 'Ask Me', icon: 'fa-comments', color: '#ec4899' },
      { id: 'skytiles', label: 'Sky Tiles', icon: 'fa-jedi', img: 'assets/skytiles.png', color: 'skytiles-icon' }
    ],

    cardDeloitte: true
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
