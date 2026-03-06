/* ============================================
   chat.js — Smart Profile Chatbot
   Answers questions about Devyani using profile data
   No API key needed — runs 100% client-side
   ============================================ */

const Chat = (() => {
  /* ── Knowledge Base ── */
  const KB = {
    name: 'Devyani P. Kumar',
    role: 'Senior Developer at Deloitte',
    experience: '5.5 years at Deloitte',
    promotions: 'Promoted twice: Analyst → Senior Developer',
    location: 'India',
    company: 'Deloitte',

    bio: `Devyani P. Kumar is a Senior Developer at Deloitte with 5.5 years of experience. She specializes in SAP CPQ solutions, GenAI/LLM architectures, and fullstack development. She has been promoted twice (Analyst → Senior Developer), delivered 14+ projects across enterprise and AI domains, and is recognized as a SAP Solutions SME and AI Architect.`,

    skills_summary: `Core skills include SAP CPQ (95%), GenAI/LLM (90%), Backend/Python (88%), Cloud/AWS (85%), Frontend/React (82%), and Game Dev (75%). Key technologies: Python, IronPython, LangChain, LangGraph, AWS Bedrock, Next.js, React, GraphQL, FastAPI, PostgreSQL, TensorFlow, Salesforce, Docker, and SAP ecosystem (CPQ, CPI, S4, BTP, VCPS).`,

    sap_detail: `Devyani is an SAP CPQ expert (95% proficiency) with 6+ enterprise engagements including IBMSW (2.5 years, full quote-to-cash with Watson AI), HPI (1.5 years, multi-country pricing engine), IBMHW (1 year, 3D/AR product views with Watson), Konica Minolta (9 months, ticketing and dashboards), FARO (6 months, pricing engine), Rogers (2 months, CSV automation), DTNA (2 months, PriceFx integration), and Kelloggs (Salesforce storefront). Also proficient in SAP CPI, S4, VCPS, BTP, and AI Core.`,

    genai_detail: `Devyani has led 3 major GenAI projects: (1) AI Advantage — contract data extraction with AWS Strand Agents, RAG/MCP, LangChain/LangGraph, sold to Disney, ESPN, and BioMarin; (2) SANOFI — full automation pipeline for client delivery (requirements → pre-prod-go-live), converted to Deloitte internal use; (3) PMI SMT — Gemini-powered executive mentorship app with voice sensitivity and user profiling. Proficient in GPT-4, Gemini, Watson, MCP, and agentic AI.`,

    impact_detail: `Impact and social projects include: AMAN Security Device — crowd scanning for concealed weapons/threats with threat-level calculation, deployed for BSF battalion 98 across 16 schools after the 2023 Nuh Haryana attacks; Explainosphere — universal curiosity learning platform (FastAPI, Next.js, GPT-4, PostgreSQL, Redis); E-MedicalHELP — centralized emergency medical system with NLP voice processing; Navgyan Parishad NGO — education curriculum improvement; AM&C Community Apps — dashboards, 2D games, AR/VR apps for community events.`,

    college_detail: `College projects include: MCOACH — knowledge ontology system using OwlReady2 and Keras for adaptive learning; CUBE DEALT — Rubik's Cube optimizer using TensorFlow and evolutionary algorithms; CRASH SAVERS — smart road safety system combining IoT sensors with holographic projection.`,

    achievements_detail: `Key achievements: Triple Promotion (Analyst → Senior Developer), Disney Deal (AI Advantage sold to Disney/ESPN/BioMarin), TCS DISQ 17th rank in India at TCS Nashik, Security Guardian (AMAN device deployed for BSF battalion & 16 schools), Enterprise Veteran (8 SAP CPQ projects), AI Pioneer (3 major GenAI projects), Community Builder (AM&C event apps, SAP CX trainings, R1 recruitment), Game Developer (5+ year portfolio with Panda3D, PyOpenGL), Full Stack Ace, Social Impact champion.`,

    tech_stack: `Languages: Python, IronPython, TypeScript, JavaScript. Frameworks: Next.js, React, FastAPI, .NET. AI/ML: LangChain, LangGraph, TensorFlow, Keras, GPT-4, Gemini, Watson, AWS Bedrock, RAG, MCP. Cloud: AWS (Bedrock, Lambda), Docker, CI/CD. Databases: PostgreSQL, Redis. APIs: GraphQL, REST. SAP: CPQ, CPI, S4, BTP, VCPS, AI Core. Other: Salesforce, PriceFx, Panda3D, PyOpenGL, AR/VR, IoT.`,

    contact: `You can reach Devyani through her profileOS — this gamified web application itself! The site is hosted on GitHub Pages.`,

    gaming: `Devyani has a 5+ year game development portfolio including work with Panda3D, PyOpenGL, 2D/3D game design, open-source modding, and AR/VR development.`,

    education: `Devyani's college projects demonstrate strong CS fundamentals: MCOACH (knowledge ontology with OwlReady2/Keras), CUBE DEALT (Rubik's Cube optimizer with TensorFlow), CRASH SAVERS (IoT + holographic road safety system).`,

    aman: `The AMAN Security Device is one of Devyani's most impactful projects. It performs crowd scanning for concealed weapons and threats with threat-level calculation. It was deployed for BSF battalion 98 across 16 schools after the 2023 Nuh Haryana attacks. Technologies: Computer Vision, IoT, Security.`,

    disney: `The AI Advantage project was sold to Disney, ESPN, and BioMarin. It uses AWS Strand Agents, RAG/MCP architecture, and LangChain/LangGraph for contract data extraction. This is one of Devyani's signature accomplishments.`,

    ibm: `Devyani worked on two major IBM projects: IBMSW (2.5 years — full quote-to-cash with CPI/S4/VCPS integration, CPQ+Commerce, Watson AI chatbot, approval automation, GraphQL) and IBMHW (1 year — 3D/AR product views, Watson automation, GraphQL microservices, ML proficiency scoring).`
  };

  /* ── Intent patterns → response logic ── */
  const intents = [
    { patterns: [/who (is|are) (you|devyani|she|her)/i, /tell me about (yourself|devyani|her)/i, /introduce/i, /about (you|devyani)/i, /what do you do/i],
      reply: () => KB.bio },

    { patterns: [/name/i],
      reply: () => `Her name is ${KB.name}. She is a ${KB.role} with ${KB.experience}.` },

    { patterns: [/role|title|position|designation|job/i],
      reply: () => `Devyani is a ${KB.role}. She has been ${KB.promotions}.` },

    { patterns: [/experience|years|how long/i],
      reply: () => `Devyani has ${KB.experience}. She has been ${KB.promotions} and has delivered 14+ projects spanning SAP CPQ, GenAI, social impact, and more.` },

    { patterns: [/promot/i],
      reply: () => `${KB.promotions}. She started as an Analyst and quickly rose through the ranks to Senior Developer based on consistent delivery across enterprise and AI projects.` },

    { patterns: [/company|deloitte|where.*(work|employ)/i],
      reply: () => `Devyani works at ${KB.company}. She has been there for 5.5 years, rising from Analyst to Senior Developer. She's recognized as a SAP Solutions SME and AI Architect within the organization.` },

    { patterns: [/skill|tech|stack|technolog|language|framework/i],
      reply: () => KB.tech_stack },

    { patterns: [/sap|cpq|enterprise|cpi|btp/i],
      reply: () => KB.sap_detail },

    { patterns: [/gen\s?ai|llm|ai advantage|langchain|langgraph|rag|bedrock|gpt|artificial intelligence|machine learn/i],
      reply: () => KB.genai_detail },

    { patterns: [/impact|social|community|aman|bsf|ngo|explainosphere|medical/i],
      reply: () => KB.impact_detail },

    { patterns: [/college|university|academ|mcoach|cube dealt|crash saver|education/i],
      reply: () => KB.college_detail },

    { patterns: [/achieve|award|accomplishment|recognition|trophy|tcs|disq/i],
      reply: () => KB.achievements_detail },

    { patterns: [/disney|espn|biomarin/i],
      reply: () => KB.disney },

    { patterns: [/aman|security device|weapon|threat|bsf|nuh|haryana/i],
      reply: () => KB.aman },

    { patterns: [/ibm/i],
      reply: () => KB.ibm },

    { patterns: [/game|gaming|panda3d|opengl|game dev/i],
      reply: () => KB.gaming },

    { patterns: [/project|portfolio|what.*(built|made|created|done|delivered)/i],
      reply: () => `Devyani has delivered 14+ projects:\n\n📋 SAP CPQ (8): IBMSW, HPI, IBMHW, Konica Minolta, FARO, Rogers, DTNA, Kelloggs\n🤖 GenAI (3): AI Advantage (Disney deal), SANOFI, PMI SMT\n💛 Impact (5): AMAN Security Device, Explainosphere, E-MedicalHELP, Navgyan Parishad, AM&C Community Apps\n🎓 College (3): MCOACH, CUBE DEALT, CRASH SAVERS` },

    { patterns: [/sanofi/i],
      reply: () => `SANOFI: Full automation pipeline for client delivery (requirements → pre-prod-go-live). This was so effective it was converted to Deloitte internal use. Technologies: Automation, Pipeline, GenAI.` },

    { patterns: [/pmi|mentorship/i],
      reply: () => `PMI SMT: A Gemini-powered executive mentorship app with voice sensitivity and user profiling. Built for personalized mentoring experiences using AI. Technologies: Gemini, Voice AI, Profiling.` },

    { patterns: [/hpi|printer/i],
      reply: () => `HPI: 1.5-year engagement building a multi-country pricing engine with ETO profiling and microservice APIs for global markets. Technologies: CPQ, Microservices, Pricing.` },

    { patterns: [/faro/i],
      reply: () => `FARO: 6-month engagement focused on approval rules, pricing engine, warranty management, and dynamic discounting within SAP CPQ.` },

    { patterns: [/konica|minolta/i],
      reply: () => `Konica Minolta: 9-month engagement covering ticketing, reporting dashboards, product automation, and sales onboarding within SAP CPQ.` },

    { patterns: [/salesforce|kellogg/i],
      reply: () => `Kelloggs: Salesforce storefront development for consumer goods. Devyani is also skilled in Salesforce platform development.` },

    { patterns: [/python|backend/i],
      reply: () => `Devyani's backend proficiency is 88%. She's an expert in Python/IronPython (5/5), FastAPI/.NET (4/5), and works with PostgreSQL, Redis, GraphQL, and REST APIs. Python is her primary language across SAP CPQ scripting, AI/ML, and backend services.` },

    { patterns: [/frontend|react|next|ui/i],
      reply: () => `Frontend proficiency: 82%. She works with Next.js/React/TypeScript (4/5), TailwindCSS (3/5), and has built full UIs for projects like Explainosphere and this profileOS itself.` },

    { patterns: [/cloud|aws|docker|deploy/i],
      reply: () => `Cloud/AWS proficiency: 85%. She works with AWS Bedrock, Lambda (4/5), Docker/Containers (3/5), CI/CD Pipelines (3/5), and Microservices architecture (4/5).` },

    { patterns: [/contact|reach|email|connect|hire/i],
      reply: () => KB.contact },

    { patterns: [/how many project/i],
      reply: () => `Devyani has delivered 14+ projects: 8 SAP CPQ engagements, 3 GenAI projects, 5 impact/community projects, and 3 college projects.` },

    { patterns: [/strongest|best|top skill/i],
      reply: () => `Devyani's top skills by proficiency: SAP CPQ (95%), GenAI/LLM (90%), Backend (88%), Cloud/AWS (85%), Frontend (82%), Game Dev (75%). Her absolute strengths are SAP CPQ and AI architecture.` },

    { patterns: [/this (site|app|website|portfolio)/i, /profileos|profile\s?os/i],
      reply: () => `This is Devyani's profileOS — a gamified operating system-style portfolio web app. It features a boot sequence, profile selector, desktop with skill trees, quest logs, achievements, inventory, terminal, and this chat! Built with vanilla HTML5, CSS3, and JavaScript — no frameworks needed.` },

    { patterns: [/hi|hello|hey|sup|greet|yo\b/i],
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
      reply: () => `You can ask me about:\n• Who is Devyani?\n• Skills & tech stack\n• SAP CPQ experience\n• GenAI projects (AI Advantage, SANOFI, PMI)\n• Impact projects (AMAN, Explainosphere)\n• Achievements & awards\n• Specific projects (IBM, Disney, HPI, FARO...)\n• College background\n• Career stats & promotions` }
  ];

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Fuzzy fallback with keyword scoring ── */
  const keywordMap = {
    'sap': KB.sap_detail,
    'cpq': KB.sap_detail,
    'ai': KB.genai_detail,
    'genai': KB.genai_detail,
    'langchain': KB.genai_detail,
    'disney': KB.disney,
    'aman': KB.aman,
    'security': KB.aman,
    'ibm': KB.ibm,
    'skill': KB.skills_summary,
    'tech': KB.tech_stack,
    'project': `Devyani has delivered 14+ projects across SAP CPQ (8), GenAI (3), Impact (5), and College (3).`,
    'python': `Python is Devyani's primary language (5/5 proficiency). She uses it for SAP CPQ scripting (IronPython), backend (FastAPI), AI/ML (LangChain, TensorFlow), and game dev (Panda3D).`,
    'achievement': KB.achievements_detail,
    'deloitte': `Devyani is a Senior Developer at Deloitte with 5.5 years of experience. Promoted twice.`,
    'experience': `${KB.experience}. ${KB.promotions}.`,
    'game': KB.gaming,
    'impact': KB.impact_detail,
    'college': KB.college_detail,
    'award': KB.achievements_detail,
    'promotion': KB.promotions
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
        if (w.includes(key) || key.includes(w)) return val;
      }
    }

    // Generic fallback
    return pickRandom([
      `I'm not sure about that specific topic, but I can tell you about Devyani's skills, projects, experience, or achievements. Try asking "What are her skills?" or "Tell me about her projects".`,
      `Hmm, I don't have info on that. Ask me about Devyani's SAP CPQ work, GenAI projects (Disney deal!), impact projects, or her tech stack!`,
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
