/* ============================================
   chat.js — Smart Profile Chatbot
   Answers questions about Devyani using profile data
   No API key needed — runs 100% client-side
   ============================================ */

const Chat = (() => {
  /* ── Knowledge Base ── */
  const KB = {
    name: 'Devyani P. Kumar',
    age: '26',
    role: 'Senior Developer at Deloitte',
    experience: '5.5 years at Deloitte (joined Sept 2020)',
    promotions: 'Promoted twice: Analyst (Sept 2020) → Consultant/Developer (2022) → Senior Consultant/Senior Developer (2025)',
    education: 'BTech Computer Science with specialisation in Cognitive Computing',
    location: 'India',
    company: 'Deloitte',
    phone: '+(91) 7014405433',
    email: 'dev16pk@gmail.com',

    bio: `Devyani P. Kumar is a 26-year-old Senior Developer at Deloitte with 5.5 years of experience. She holds a BTech in Computer Science with specialisation in Cognitive Computing. She specializes in SAP CPQ solutions, GenAI/LLM architectures, and fullstack development. She has been promoted twice — Analyst (2020) → Consultant (2022) → Senior Consultant (2025). She has delivered 14+ projects across enterprise SAP, GenAI, social impact, and college research, and is recognized as a SAP Solutions SME and AI Architect.`,

    skills_summary: `Core stats: SAP Solutions (95%), GenAI & LLMs (90%), Backend Systems (88%), Game & Creative (86%), Cloud & DevOps (85%), Frontend & UI (82%).\n\nSkill tree branches:\n• SAP & Enterprise — CPQ (5/5), CPI/S4 HANA (4/5), BTP/Commerce (4/5), AI Core (2/5), Salesforce (3/5)\n• AI & GenAI — LangChain/LangGraph (5/5), RAG/Bedrock (5/5), LLMs (4/5), Agentic AI/MCP (4/5), NLP/Voice (3/5), TensorFlow/Keras (3/5), Model Finetuning (4/5)\n• DSA & ML — DSA (4/5), Dynamic Programming (4/5), Genetic Algorithms (4/5), Knowledge Ontology (4/5), Cognitive Computing (3/5), ML Pipelines (4/5), Evolutionary Algorithms (3/5)\n• Fullstack — Python (5/5), IronPython (4/5), Next.js/React/TS (4/5), GraphQL/REST (4/5), FastAPI/.NET (4/5), PostgreSQL/Redis (4/5), TailwindCSS (3/5)\n• Cloud & DevOps — AWS Lambda/S3/EC2 (4/5), Microservices (4/5), Docker (3/5), CI/CD (3/5)\n• Game & Creative — Panda3D/PyOpenGL (5/5), 2D/3D Game Dev (5/5), Game Jams & Bug Bounty (4/5), Game Modding (4/5), AR/VR (3/5), IoT/HW Integration (3/5)`,

    sap_detail: `Devyani is an SAP CPQ expert (95% proficiency, 5/5 skill) with 8 enterprise engagements:\n\n1. HPI (2024–2025) — Senior Developer — 1.5 years building multi-country pricing engine, ETO product profiling, .NET/REST microservice APIs\n2. IBMHW (2023–2024) — Developer — 1 year: 3D/AR product views, WatsonX automation, GraphQL microservices, ML proficiency scoring\n3. FARO (2022) — Developer — 6 months: approval rules, pricing engine, warranty management, dynamic discounting\n4. IBMSW (2021–2023) — Lead Developer — 2.5-year full quote-to-cash: CPI/S4/VCPS integration, CPQ+Commerce, WatsonX chatbot, approval automation\n5. Konica Minolta (2021–2022) — Developer — 9 months: ticketing, dashboards, product automation, S4/HANA + CPI + VCPS integration\n6. Rogers (2021) — Developer — 2 months: CSV product portfolio automation\n7. DTNA (2021) — Developer — 2 months: PriceFx ↔ CPQ integration\n8. Kelloggs (2020) — Developer — Salesforce Commerce storefront\n\nAlso proficient in SAP CPI (4/5), S4/HANA (4/5), BTP/Commerce (4/5), SAP AI Core (2/5), and Salesforce (3/5).`,

    genai_detail: `Devyani has led 3 major GenAI projects:\n\n1. PMI SMT (2026, ongoing) — Lead Fullstack Developer — Gemini-powered executive mentorship app with voice sensitivity and user profiling\n2. AI Advantage (2025–2026, ongoing) — AI Architect/Agent Developer — Contract data extraction with AWS Strand Agents, RAG/MCP, LangChain/LangGraph. Sold to Disney, ESPN, and BioMarin\n3. SANOFI (2025, complete) — Lead Developer — Full automation pipeline for client delivery (requirements → pre-prod → go-live), converted to Deloitte internal accelerator\n\nAI skill ratings: LangChain/LangGraph (5/5), RAG/AWS Bedrock (5/5), LLMs/GPT-4/Gemini/Watson (4/5), Agentic AI/MCP (4/5), Model Finetuning (4/5), NLP/Voice AI (3/5), TensorFlow/Keras (3/5).`,

    impact_detail: `Impact and social projects (5 total):\n\n1. AM&C Community Apps (2025–2026, ongoing) — Fullstack Developer — End-to-end dashboards, 2D games (Android/iOS), AR/VR apps for Gurgaon AM&C events\n2. Explainosphere (2024, complete) — Fullstack Developer — Universal curiosity learning platform built with FastAPI, Next.js, GPT-4, PostgreSQL, Redis\n3. AMAN Security Device (2023–2025, complete) — Creator & Lead Engineer — Crowd-scanning for concealed weapons with threat-level calculation, tested with BSF battalion 98, built in response to the 2023 Nuh Haryana attacks\n4. E-MedicalHELP (2023, complete) — Lead Developer & Data Analyst — Centralized emergency medical system with NLP voice processing, IoT device integrations, hospital alignment\n5. Navgyan Niyojan (2020–2026, ongoing) — Volunteer Developer — Education curriculum improvement initiative through NGO collaboration`,

    college_detail: `College projects (3 total):\n\n1. CUBE DEALT (2019–2026, ongoing) — Fullstack Solo Developer — Rubik's Cube optimizer using TensorFlow and evolutionary algorithms, now extending to 4x4, 7x7, mirror cube and pyramid cube\n2. MCOACH (2019–2020, complete) — Fullstack Solo Developer — Knowledge ontology system using OwlReady2 and Keras for adaptive learning, based on Knowledge Representation and Cognitive Computing research\n3. CRASH SAVERS (2018, complete) — Application Developer — Smart road safety system combining IoT sensors with holographic projection, associated with IRSC (Indian Road Safety Campaign)`,

    achievements_detail: `9 achievements unlocked:\n\n🏆 LEGENDARY:\n• Double Promotion — Analyst (2020) → Consultant (2022) → Senior Consultant (2025) at Deloitte\n• Enterprise Architect — 8 SAP product implementations for clients worldwide (IBM, HP, FARO, Konica Minolta, Rogers, DTNA, Kelloggs)\n\n⭐ EPIC:\n• TCS DISQ Finalist — Ranked 17th nationally in TCS Digital Callforsolutions 2022\n• Security Guardian — Built & field-tested AMAN threat-detection with BSF battalion 98\n• AI Innovator — Architected production GenAI systems (RAG, agentic workflows, LLMs)\n\n🔵 ELITE:\n• Fullstack Engineer — Mastered frontend, backend, cloud & data layers\n• Game Dev Veteran — Won game jams, raised COVID housing funds, certified by Gaming Monk, modded games at OceanOfGames\n• Community Champion — Built AM&C event apps, led SAP CX training, onboarded new talent\n• Social Impact Hero — Launched platforms for education, healthcare & social good`,

    tech_stack: `Languages: Python (5/5), IronPython (4/5), TypeScript, JavaScript.\nFrameworks: Next.js/React (4/5), FastAPI/.NET (4/5), TailwindCSS (3/5).\nAI/ML: LangChain/LangGraph (5/5), RAG/AWS Bedrock (5/5), TensorFlow/Keras (3/5), GPT-4, Gemini, WatsonX, MCP, Model Finetuning (4/5).\nDSA: Data Structures & Algorithms (4/5), Dynamic Programming (4/5), Genetic Algorithms (4/5), Knowledge Ontology (4/5), ML Pipelines (4/5).\nCloud: AWS Lambda/S3/EC2 (4/5), Docker (3/5), CI/CD (3/5), Microservices (4/5).\nDatabases: PostgreSQL/Redis (4/5). APIs: GraphQL/REST (4/5).\nSAP: CPQ (5/5), CPI/S4 HANA (4/5), BTP/Commerce (4/5), AI Core (2/5).\nGame: Panda3D/PyOpenGL (5/5), 2D/3D Game Dev (5/5), Game Modding (4/5), AR/VR (3/5), IoT (3/5).\nOther: Salesforce (3/5).`,

    inventory: `Devyani's tech inventory (23 items):\n\n🟡 LEGENDARY: Python, SAP CPQ, AWS\n🟣 EPIC: LangChain, LangGraph, Next.js, GPT-4, Gemini, TensorFlow, GraphQL, PostgreSQL, FastAPI, TypeScript, Redis, Docker, React, .NET, IronPython, IBM WatsonX, Panda3D, SAP BTP\n🔵 ELITE: Salesforce, TailwindCSS`,

    contact: `You can reach Devyani via:\n📞 Phone: +(91) 7014405433\n📧 Email: dev16pk@gmail.com\n`,

    gaming: `Devyani has strong development experience in game development (Game & Creative stat: 86%):\n\nSkill ratings:\n• Panda3D / PyOpenGL — 5/5 (MAX)\n• 2D/3D Game Development — 5/5 (MAX)\n• Game Jams & Bug Bounty Hunting — 4/5\n• Game Modding — 4/5\n• AR/VR Dev — 3/5\n• IoT / HW Integration — 3/5\n\nHighlights: Won game jams, raised COVID housing funds through online gaming, certified by Gaming Monk, and modded high-spec games for low-end systems at OceanOfGames. Built AR/VR apps for AM&C community events.`,

    education_detail: `Devyani holds a BTech in Computer Science with specialisation in Cognitive Computing. Her college projects demonstrate strong CS fundamentals:\n\n1. MCOACH — Knowledge ontology system using OwlReady2/Keras for adaptive learning, studying Knowledge Representation and Cognitive Computation\n2. CUBE DEALT — Rubik's Cube optimizer using TensorFlow and evolutionary algorithms\n3. CRASH SAVERS — IoT + holographic road safety system, associated with IRSC`,

    aman: `AMAN Security Device (2023–2025) — Creator & Lead Engineer\n\nA crowd-scanning system for concealed weapons with threat-level calculation. Built in response to the 2023 Nuh Haryana attacks. Tested and launched with BSF battalion 98 support, who arranged real-time and fictional threat simulations.\n\nTech: Computer Vision, IoT, Security.\nMilestones: Research & Motivation → Hardware + CV Build → Threat-Level Algorithm → BSF Field Testing.`,

    ibm: `Devyani worked on two major IBM projects at Deloitte:\n\n1. IBMSW (2021–2023) — Lead Developer — 2.5-year full quote-to-cash engagement: CPI/S4 HANA integration, CPQ+Commerce with VCPS, WatsonX AI chatbot for guided selling, multi-level approval automation, GraphQL APIs. Covered 5 milestones from discovery to go-live with 3-month hypercare.\n\n2. IBMHW (2023–2024) — Developer — 1 year: 3D/AR product views, WatsonX configuration automation, GraphQL microservices for cross-system aggregation, ML proficiency scoring using deterministic mathematical functions for hardware slotting.`,

    dsa_ml: `DSA & ML skill branch:\n• Data Structures & Algorithms — 4/5\n• Dynamic Programming — 4/5\n• Genetic Algorithms — 4/5\n• Knowledge Ontology — 4/5\n• Cognitive Computing — 3/5\n• ML Pipelines — 4/5\n• Evolutionary Algorithms — 3/5\n\nApplied in projects like MCOACH (ontology + Keras), CUBE DEALT (TensorFlow + evolutionary algorithms), IBMHW (ML proficiency scoring), and AI Advantage (RAG pipelines).`
  };

  /* ── Intent patterns → response logic ── */
  const intents = [
    { patterns: [/who (is|are) (you|devyani|she|her)/i, /tell me about (yourself|devyani|her)/i, /introduce/i, /about (you|devyani)/i, /what do you do/i],
      reply: () => KB.bio },

    { patterns: [/\bname\b/i],
      reply: () => `Her name is ${KB.name}. She is ${KB.age} years old, a ${KB.role} with ${KB.experience}. She holds a ${KB.education}.` },

    { patterns: [/role|title|position|designation|job/i],
      reply: () => `Devyani is a ${KB.role}. ${KB.promotions}. She's recognized as a SAP Solutions SME and AI Architect.` },

    { patterns: [/experience|years|how long/i],
      reply: () => `Devyani has ${KB.experience}. ${KB.promotions}. She has delivered 14+ projects spanning SAP Products (8), GenAI (3), Impact (5), and College (3).` },

    { patterns: [/promot/i],
      reply: () => `${KB.promotions}. She joined Deloitte in Sept 2020 as an Analyst, was promoted to Consultant/Developer in 2022 based on her SAP CPQ delivery, and to Senior Consultant/Senior Developer in 2025 after leading GenAI and enterprise projects.` },

    { patterns: [/\bage\b|how old|born|birthday/i],
      reply: () => `Devyani is ${KB.age} years old (Level 26 in profileOS terms).` },

    { patterns: [/educat|degree|btech|b\.?tech|qualification|studied|cognitive/i],
      reply: () => KB.education_detail },

    { patterns: [/company|deloitte|where.*(work|employ)/i],
      reply: () => `Devyani works at ${KB.company}. ${KB.promotions}. She's recognized as a SAP Solutions SME and AI Architect within the organization. She's also an integral part of the Gurgaon AM&C community.` },

    { patterns: [/skill|tech|stack|technolog|language|framework|proficien/i],
      reply: () => KB.tech_stack },

    { patterns: [/stat|power level|score|rating/i],
      reply: () => KB.skills_summary },

    { patterns: [/sap|cpq|enterprise|cpi|btp|vcps|s4.*hana/i],
      reply: () => KB.sap_detail },

    { patterns: [/gen\s?ai|llm|ai advantage|langchain|langgraph|rag|bedrock|gpt|artificial intelligence|machine learn|agentic|mcp\b/i],
      reply: () => KB.genai_detail },

    { patterns: [/impact|social/i],
      reply: () => KB.impact_detail },

    { patterns: [/college|university|academ/i],
      reply: () => KB.college_detail },

    { patterns: [/achieve|award|accomplishment|recognition|trophy|tcs|disq/i],
      reply: () => KB.achievements_detail },

    { patterns: [/inventory|tools?\b|what.*(use|know)|arsenal/i],
      reply: () => KB.inventory },

    { patterns: [/\baman\b|security device|weapon|threat|bsf|nuh|haryana/i],
      reply: () => KB.aman },

    { patterns: [/ibm/i],
      reply: () => KB.ibm },

    { patterns: [/game|gaming|panda3d|opengl|game dev|game jam|game mod/i],
      reply: () => KB.gaming },

    { patterns: [/dsa|algorithm|dynamic program|genetic algo|ontology|cognitive comput|ml pipeline|evolutionary/i],
      reply: () => KB.dsa_ml },

    { patterns: [/finetun|model train/i],
      reply: () => `Devyani has Model Finetuning at 4/5 proficiency in her AI & GenAI skill branch. She applies finetuning in enterprise GenAI contexts like AI Advantage (RAG optimization) and has experience with TensorFlow/Keras for model training in projects like CUBE DEALT and MCOACH.` },

    { patterns: [/project|portfolio|what.*(built|made|created|done|delivered)/i],
      reply: () => `Devyani has delivered 14+ projects across 4 categories:\n\n📋 SAP Products (8): HPI, IBMHW, FARO, IBMSW, Konica Minolta, Rogers, DTNA, Kelloggs\n🤖 GenAI (3): PMI SMT, AI Advantage (Disney/ESPN/BioMarin), SANOFI\n💛 Impact (5): AM&C Community Apps, Explainosphere, AMAN Security Device, E-MedicalHELP, Navgyan Niyojan\n🎓 College (3): CUBE DEALT, MCOACH, CRASH SAVERS\n\nAsk about any specific project for details!` },

    { patterns: [/sanofi/i],
      reply: () => `SANOFI (2025) — Lead Developer\n\nFull automation pipeline for client delivery (requirements → pre-prod → go-live). So effective it was converted to a Deloitte internal accelerator.\n\nMilestones: Pipeline Design → GenAI Integration → Pre-Prod & Go-Live → Deloitte Internal Adoption.\nTech: Automation, Pipeline, GenAI.` },

    { patterns: [/pmi|mentorship/i],
      reply: () => `PMI SMT (2026, ongoing) — Lead Fullstack Developer\n\nGemini-powered executive mentorship app with voice sensitivity and user profiling.\n\nMilestones: User Profiling System → Gemini LLM Integration → Voice Sensitivity → Pilot Launch.\nTech: Gemini, Voice AI, Profiling.` },

    { patterns: [/hpi|hp inc/i],
      reply: () => `HPI (2024–2025) — Senior Developer\n\n1.5-year engagement building a multi-country pricing engine with ETO product profiling and .NET/REST microservice APIs for global markets across EMEA, APAC, and Americas.\n\nMilestones: Requirements & Scoping → ETO Profiling Engine → Microservice APIs → UAT & Deployment.\nTech: CPQ, Microservices, Pricing.` },

    { patterns: [/faro/i],
      reply: () => `FARO (2022) — Developer\n\n6-month engagement: approval rules with role-based escalation, dynamic pricing engine (volume + contract discounting), warranty management, and production go-live.\nTech: CPQ, Pricing, Warranty.` },

    { patterns: [/konica|minolta/i],
      reply: () => `Konica Minolta (2021–2022) — Developer\n\n9-month engagement: ticketing system, real-time reporting dashboards, product catalog automation, sales onboarding flows, and integration with S4/HANA, CPI, and VCPS.\nTech: CPQ, Automation, Reporting, CPI, VCPS.` },

    { patterns: [/rogers|telecom/i],
      reply: () => `Rogers (2021) — Developer\n\n2-month engagement: Built automated CSV ingestion pipeline for Rogers telecom product catalog, automated portfolio creation with validation, and documented the pipeline for team handoff.\nTech: CPQ, CSV, Automation.` },

    { patterns: [/dtna|truck/i],
      reply: () => `DTNA (2021) — Developer\n\n2-month engagement: PriceFx ↔ SAP CPQ integration for the DTNA truck configurator. Built bi-directional API bridge, end-to-end integration testing, and production deployment.\nTech: CPQ, PriceFx.` },

    { patterns: [/salesforce|kellogg/i],
      reply: () => `Kelloggs (2020) — Developer\n\nSalesforce Commerce Cloud storefront for consumer goods. Built product catalog with category hierarchy and promotional pricing.\nTech: Salesforce, Commerce.\n\nDevyani also has Salesforce at 3/5 proficiency in her SAP & Enterprise skill branch.` },

    { patterns: [/explainosphere|learning platform/i],
      reply: () => `Explainosphere (2024) — Fullstack Developer\n\nUniversal curiosity-driven learning platform. FastAPI backend, Next.js frontend, GPT-4 powered explanation engine, PostgreSQL + Redis for caching and sessions.\nTech: FastAPI, Next.js, GPT-4, PostgreSQL.` },

    { patterns: [/e.?medical|emergency.*medical|hospital/i],
      reply: () => `E-MedicalHELP (2023) — Lead Developer & Data Analyst\n\nCentralized emergency medical system with NLP voice-based triage for symptom extraction, IoT device integrations, and nearest-hospital matching with real-time bed availability.\nTech: IoT, NLP, Healthcare, Emergency, Data Analytics.` },

    { patterns: [/navgyan|niyojan|ngo|curriculum/i],
      reply: () => `Navgyan Niyojan (2020–2026, ongoing) — Volunteer Developer\n\nEducation curriculum improvement initiative through NGO collaboration. Built digital tools for curriculum tracking, improvement suggestions, and deployed for community schools.\nTech: Education, NGO.` },

    { patterns: [/am.?c|community app|community event/i],
      reply: () => `AM&C Community Apps (2025–2026, ongoing) — Fullstack Developer\n\nEnd-to-end dashboards, 2D games (Android/iOS), and AR/VR apps for Gurgaon AM&C community events at Deloitte.\nTech: Mobile, AR/VR, Games.` },

    { patterns: [/cube dealt|rubik/i],
      reply: () => `CUBE DEALT (2019–2026, ongoing) — Fullstack Solo Developer\n\nRubik's Cube optimizer using TensorFlow and evolutionary algorithms. 3D visualizer with real-time solve animations, now extending to 4x4, 7x7, mirror cube and pyramid cube.\nTech: TensorFlow, Evolutionary Algorithms, 3D.` },

    { patterns: [/mcoach|owlready/i],
      reply: () => `MCOACH (2019–2020) — Fullstack Solo Developer\n\nKnowledge ontology system using OwlReady2 and Keras for adaptive learning. Studies how knowledge can be better perceived through Knowledge Representation and Cognitive Computation. Published as college thesis.\nTech: OwlReady2, Keras, Ontology.` },

    { patterns: [/crash saver|road safety|irsc|holograph/i],
      reply: () => `CRASH SAVERS (2018) — Application Developer\n\nSmart road safety system combining IoT sensors with holographic projection for real-time driver alerts. Associated with IRSC (Indian Road Safety Campaign) and MORTH.\nTech: IoT, Holograms, Safety.` },

    { patterns: [/python|ironpython|backend/i],
      reply: () => `Python is Devyani's primary language (5/5, MAX proficiency). IronPython is 4/5. Backend Systems stat: 88%.\n\nShe uses Python for: SAP CPQ scripting (IronPython), backend services (FastAPI), AI/ML (LangChain, TensorFlow), and game dev (Panda3D). Other backend tech: FastAPI/.NET (4/5), PostgreSQL/Redis (4/5), GraphQL/REST (4/5).` },

    { patterns: [/frontend|react|next\.?js|ui|tailwind/i],
      reply: () => `Frontend & UI stat: 82%. Skill ratings:\n• Next.js / React / TypeScript — 4/5\n• TailwindCSS — 3/5\n\nBuilt UIs for Explainosphere (Next.js), IBMSW Commerce storefront, Kelloggs, PMI SMT, and this profileOS itself.` },

    { patterns: [/cloud|aws|docker|deploy|lambda|devops/i],
      reply: () => `Cloud & DevOps stat: 85%. Skill ratings:\n• AWS Lambda/S3/EC2 — 4/5\n• Microservices — 4/5\n• Docker/Containers — 3/5\n• CI/CD Pipelines — 3/5\n\nUsed across AI Advantage (AWS Bedrock/Strand Agents), SANOFI (pipeline automation), HPI (microservices), and Explainosphere.` },

    { patterns: [/contact|reach|email|connect|hire|phone|number|mail/i],
      reply: () => KB.contact },

    { patterns: [/how many project/i],
      reply: () => `Devyani has delivered 14+ projects: 8 SAP Product engagements, 3 GenAI projects, 5 impact/community projects, and 3 college projects. 5 are currently ongoing (PMI SMT, AI Advantage, AM&C Community Apps, Navgyan Niyojan, CUBE DEALT).` },

    { patterns: [/strongest|best|top skill/i],
      reply: () => `Devyani's top stats: SAP Solutions (95%), GenAI & LLMs (90%), Backend Systems (88%), Game & Creative (86%), Cloud & DevOps (85%), Frontend & UI (82%).\n\nMAX-level skills (5/5): SAP CPQ, LangChain/LangGraph, RAG/AWS Bedrock, Python, Panda3D/PyOpenGL, 2D/3D Game Dev.` },

    { patterns: [/this (site|app|website|portfolio)/i, /profileos|profile\s?os/i],
      reply: () => `This is Devyani's profileOS — a gamified operating system-style portfolio web app. It features a boot sequence, profile selector, desktop with skill trees, quest logs (project timelines with milestones), achievements, tech inventory, a terminal, the Sky Tiles game, and this chat assistant! Built with vanilla HTML5, CSS3, and JavaScript — no frameworks needed.` },

    { patterns: [/^(hi|hello|hey|sup|yo)\b/i, /greet/i],
      reply: () => pickRandom([
        `Hey there! 👋 I'm Devyani's profile assistant. Ask me anything about her skills, projects, experience, or achievements!`,
        `Hello! Welcome to Devyani's profileOS. What would you like to know about her?`,
        `Hey! Ask me about Devyani's work at Deloitte, her AI projects, SAP expertise, or anything else!`
      ]) },

    { patterns: [/thank|thanks|thx/i],
      reply: () => pickRandom([
        `You're welcome! Feel free to ask anything else about Devyani.`,
        `Happy to help! Anything else you'd like to know?`,
        `No problem! I'm here if you have more questions.`
      ]) },

    { patterns: [/bye|goodbye|see ya/i],
      reply: () => `Goodbye! Thanks for checking out Devyani's profile. 🚀` },

    { patterns: [/help|what can (you|i) (do|ask)/i],
      reply: () => `You can ask me about:\n\n👤 Basics — Who is Devyani? · Age · Education · Contact info\n💼 Career — Experience · Promotions · Deloitte · Role\n🛠️ Skills — Tech stack · Skill tree · Stats · Top skills · DSA · Inventory\n📋 SAP Projects — IBMSW · IBMHW · HPI · FARO · Konica Minolta · Rogers · DTNA · Kelloggs\n🤖 GenAI — AI Advantage · SANOFI · PMI SMT\n💛 Impact — AMAN · Explainosphere · E-MedicalHELP · Navgyan · AM&C\n🎓 College — MCOACH · CUBE DEALT · CRASH SAVERS\n🎮 Gaming — Game dev portfolio · Panda3D\n🏆 Achievements — Awards · TCS DISQ · Promotions` }
  ];

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Fuzzy fallback with keyword scoring ── */
  const keywordMap = {
    'sap': KB.sap_detail,
    'cpq': KB.sap_detail,
    'ai': KB.genai_detail,
    'genai': KB.genai_detail,
    'langchain': KB.genai_detail,
    'langgraph': KB.genai_detail,
    'rag': KB.genai_detail,
    'bedrock': KB.genai_detail,
    'aman': KB.aman,
    'security': KB.aman,
    'bsf': KB.aman,
    'ibm': KB.ibm,
    'watson': KB.ibm,
    'skill': KB.skills_summary,
    'tech': KB.tech_stack,
    'inventory': KB.inventory,
    'tool': KB.inventory,
    'project': `Devyani has delivered 14+ projects across SAP Products (8), GenAI (3), Impact (5), and College (3).`,
    'python': `Python is Devyani's primary language (5/5, MAX). Used for SAP CPQ scripting (IronPython), backend (FastAPI), AI/ML (LangChain, TensorFlow), and game dev (Panda3D).`,
    'achievement': KB.achievements_detail,
    'deloitte': `Devyani is a Senior Developer at Deloitte with 5.5 years of experience. ${KB.promotions}. Recognized as SAP Solutions SME and AI Architect.`,
    'age': `Devyani is ${KB.age} years old (Level ${KB.age}).`,
    'contact': KB.contact,
    'email': KB.contact,
    'phone': KB.contact,
    'education': KB.education_detail,
    'btech': KB.education_detail,
    'cognitive': KB.education_detail,
    'experience': `${KB.experience}. ${KB.promotions}.`,
    'game': KB.gaming,
    'gaming': KB.gaming,
    'impact': KB.impact_detail,
    'social': KB.impact_detail,
    'college': KB.college_detail,
    'award': KB.achievements_detail,
    'promotion': KB.promotions,
    'dsa': KB.dsa_ml,
    'algorithm': KB.dsa_ml,
    'ontology': KB.dsa_ml,
    'sanofi': `SANOFI (2025): Full automation pipeline for client delivery, converted to Deloitte internal accelerator.`,
    'pmi': `PMI SMT (2026): Gemini-powered executive mentorship app with voice sensitivity.`,
    'explainosphere': `Explainosphere (2024): Universal learning platform built with FastAPI, Next.js, GPT-4, PostgreSQL.`,
    'faro': `FARO (2022): 6-month SAP CPQ engagement — pricing engine, warranty management, approval rules.`,
    'rogers': `Rogers (2021): 2-month CSV product portfolio automation for telecom.`,
    'dtna': `DTNA (2021): 2-month PriceFx ↔ CPQ integration for truck configurator.`,
    'kellogg': `Kelloggs (2020): Salesforce Commerce storefront for consumer goods.`,
    'navgyan': `Navgyan Niyojan (2020–2026): Education curriculum improvement initiative via NGO collaboration.`,
    'docker': `Docker/Containers proficiency: 3/5. Used in cloud deployment workflows.`,
    'react': `Next.js/React/TypeScript proficiency: 4/5. Frontend & UI stat: 82%.`,
    'tensorflow': `TensorFlow/Keras proficiency: 3/5. Used in CUBE DEALT and MCOACH projects.`,
    'frontend': `Frontend & UI stat: 82%. Next.js/React/TS (4/5), TailwindCSS (3/5).`,
    'backend': `Backend Systems stat: 88%. Python (5/5), FastAPI/.NET (4/5), PostgreSQL/Redis (4/5).`,
    'cloud': `Cloud & DevOps stat: 85%. AWS (4/5), Microservices (4/5), Docker (3/5), CI/CD (3/5).`
  };

  /* ── Answer engine ── */
  function getAnswer(input) {
    const q = input.trim();
    if (!q) return `Please type a question about Devyani!`;

    // Try intent matching first
    for (const intent of intents) {
      for (const pat of intent.patterns) {
        if (pat.test(q)) return intent.reply();
      }
    }

    // Keyword fallback
    const words = q.toLowerCase().split(/\s+/);
    for (const w of words) {
      for (const [key, val] of Object.entries(keywordMap)) {
        if (w.includes(key) || key.includes(w)) return typeof val === 'function' ? val() : val;
      }
    }

    // Generic fallback
    return pickRandom([
      `I'm not sure about that specific topic, but I can tell you about Devyani's skills, projects, experience, or achievements. Try asking "What are her skills?" or "Tell me about her projects".`,
      `Hmm, I don't have info on that. Ask me about Devyani's SAP CPQ work, GenAI projects, impact projects, or her tech stack!`,
      `I'm specialized in answering questions about Devyani P. Kumar. Try: "Who is Devyani?", "What projects has she done?", or "What are her achievements?"`
    ]);
  }

  /* ── Typing animation ── */
  function typeResponse(container, text, callback) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';
    msgEl.innerHTML = `<div class="chat-avatar"><i class="fas fa-robot"></i></div><div class="chat-bubble bot-bubble"><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>`;
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    const bubble = msgEl.querySelector('.bot-bubble');
    setTimeout(() => {
      // Convert newlines to <br>
      bubble.innerHTML = text.replace(/\n/g, '<br>');
      container.scrollTop = container.scrollHeight;
      if (callback) callback();
    }, 400 + Math.random() * 300);
  }

  /* ── Init chat in window ── */
  function init(body) {
    const msgContainer = body.querySelector('.chat-messages');
    const input = body.querySelector('.chat-input');
    const sendBtn = body.querySelector('.chat-send');

    // Welcome message
    setTimeout(() => {
      typeResponse(msgContainer, `Hey! 👋 I'm Devyani's profile assistant. Ask me anything about her skills, projects, experience, or achievements!`);
    }, 300);

    function sendMessage() {
      const q = input.value.trim();
      if (!q) return;

      // User message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.innerHTML = `<div class="chat-bubble user-bubble">${escChat(q)}</div>`;
      msgContainer.appendChild(userMsg);
      msgContainer.scrollTop = msgContainer.scrollHeight;
      input.value = '';

      // Bot response
      const answer = getAnswer(q);
      typeResponse(msgContainer, answer);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    input.focus();
  }

  function escChat(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  return { init, getAnswer };
})();
