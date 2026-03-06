/* ============================================
   app.js — Core OS Engine
   Boot → Profile Select → Desktop → Windows
   ============================================ */

const App = (() => {
  // Auto-detect base path for GitHub Pages project pages
  const BASE_PATH = location.hostname.includes('github.io') ? '/PROFILEOS' : '';
  let activeProfile = null;
  let winZ = 100;
  let startMenuOpen = false;
  window.__bootTime = Date.now();

  /* ── Initialise ── */
  function init() {
    Admin.loadFromStorage();
    runBoot();
  }

  /* ══════════════════════════════
     BOOT SEQUENCE
     ══════════════════════════════ */
  function runBoot() {
    const log = document.getElementById('boot-log');
    const bar = document.getElementById('boot-bar');
    const status = document.getElementById('boot-status');
    const lines = [
      'Loading kernel modules...',
      'Mounting profile filesystem...',
      'Initializing skill tree engine...',
      'Loading quest journal...',
      'Connecting achievement service...',
      'Scanning inventory database...',
      'Calibrating stat algorithms...',
      'Building desktop environment...',
      'Devyani_pOS v20.26 ready.'
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i >= lines.length) {
        clearInterval(iv);
        status.textContent = 'Boot complete. Launching profile selector...';
        setTimeout(() => {
          document.getElementById('boot-screen').classList.add('hidden');
          showProfileSelector();
        }, 500);
        return;
      }
      const div = document.createElement('div');
      div.className = 'log-line';
      div.textContent = `[OK] ${lines[i]}`;
      div.style.animationDelay = `${i * 0.05}s`;
      log.appendChild(div);
      bar.style.width = `${((i + 1) / lines.length) * 100}%`;
      status.textContent = lines[i];
      log.scrollTop = log.scrollHeight;
      i++;
    }, 280);
  }

  /* ══════════════════════════════
     PROFILE SELECTOR
     ══════════════════════════════ */
  function showProfileSelector() {
    const sel = document.getElementById('profile-selector');
    sel.classList.remove('hidden');
    generateParticles();
    renderProfileCards();
    bindAdminLogin();
    handleRoute();
  }

  function generateParticles() {
    const container = document.getElementById('selector-particles');
    container.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (4 + Math.random() * 6) + 's';
      p.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(p);
    }
  }

  function renderProfileCards() {
    const container = document.getElementById('profile-cards');
    const liveProfiles = PROFILE_ORDER.filter(key => !PROFILES[key].comingSoon);
    container.innerHTML = liveProfiles.map(key => {
      const p = PROFILES[key];
      const deloitteBadge = p.cardDeloitte ? `<div class="card-deloitte"><span class="dl-text">Deloitte</span><span class="dl-dot"></span></div>` : '';
      return `
        <div class="profile-card" data-profile="${key}">
          <span class="card-badge ${p.badgeClass}">${esc(p.badge)}</span>
          ${deloitteBadge}
          <div class="card-top">
            <div class="card-icon"><i class="fas ${p.icon}"></i></div>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.tagline)}</p>
          </div>
        </div>`;
    }).join('');
    container.querySelectorAll('.profile-card').forEach(card => {
      card.addEventListener('click', () => launchDesktop(card.dataset.profile));
    });
    document.getElementById('admin-login-btn').classList.add('hidden');
  }

  function bindAdminLogin() {
    const btn = document.getElementById('admin-login-btn');
    const modal = document.getElementById('admin-modal');
    const cancel = document.getElementById('admin-cancel');
    const submit = document.getElementById('admin-submit');
    const errEl = document.getElementById('admin-error');
    const passIn = document.getElementById('admin-pass');

    btn.onclick = () => { modal.classList.remove('hidden'); passIn.value = ''; errEl.classList.add('hidden'); passIn.focus(); };
    cancel.onclick = () => modal.classList.add('hidden');
    modal.querySelector('.modal-overlay').onclick = () => modal.classList.add('hidden');
    submit.onclick = async () => {
      const ok = await Admin.authenticate(passIn.value);
      if (ok) { modal.classList.add('hidden'); openAdminDesktop(); }
      else { errEl.classList.remove('hidden'); }
    };
    passIn.addEventListener('keydown', e => { if (e.key === 'Enter') submit.click(); });
  }

  function handleRoute() {
    // Support both /path and ?p=path (404.html SPA redirect)
    let route = '';
    const params = new URLSearchParams(location.search);
    if (params.get('p')) {
      route = params.get('p');
    } else {
      let raw = location.pathname;
      if (BASE_PATH && raw.startsWith(BASE_PATH)) raw = raw.slice(BASE_PATH.length);
      route = raw.replace(/^\//, '').replace(/\/$/, '').toLowerCase();
    }
    // Also support legacy hash routes
    if (!route && location.hash) route = location.hash.replace('#', '');
    if (route === 'admin') {
      document.getElementById('admin-login-btn').click();
    } else if (PROFILES[route] && !PROFILES[route].comingSoon) {
      launchDesktop(route);
    }
  }

  /* ══════════════════════════════
     DESKTOP
     ══════════════════════════════ */
  function launchDesktop(profileKey) {
    activeProfile = profileKey;
    history.pushState(null, '', BASE_PATH + '/' + profileKey);
    const p = PROFILES[profileKey];

    document.getElementById('profile-selector').classList.add('hidden');
    const desktop = document.getElementById('desktop');
    desktop.classList.remove('hidden');
    desktop.style.background = p.wallpaper || '';

    document.getElementById('profile-badge').textContent = p.name;
    document.getElementById('start-menu-role').textContent = p.tagline;
    renderAboutPanel(p);
    renderDesktopIcons(p);
    bindTaskbar();
    pinTerminalToTaskbar();
    startClock();
    setTimeout(() => showToast('Profile Loaded', `Welcome to ${p.name}!`), 800);
  }

  function renderAboutPanel(p) {
    const panel = document.getElementById('about-panel');
    const a = p.about;
    if (!a || !panel) return;
    const attrs = (a.attributes || []).map(at => `
      <div class="attr-box"><span class="attr-key">${esc(at.key)}</span><span class="attr-val">${esc(at.val)}</span><span class="attr-desc">${esc(at.desc)}</span></div>
    `).join('');
    const statCards = (p.stats || []).map(s => `
      <div class="stat-card stat-card--${s.color}">
        <div class="stat-icon">${iconHtml(s.icon)}</div>
        <div class="stat-name">${esc(s.name)}</div>
        <div class="stat-bar"><div class="stat-fill ${s.color}" data-val="${s.value}"></div></div>
        <div class="stat-value">${s.value}%</div>
      </div>`).join('');
    panel.innerHTML = `
      <div class="about-hero">
        <div class="deloitte-badge"><span class="dl-text">Deloitte</span><span class="dl-dot"></span></div>
        <img src="assets/profile.jpg" alt="${esc(a.name)}" class="about-photo">
        <div class="about-info">
          <h2 class="about-name">${esc(a.name)}</h2>
          <p class="about-title">${esc(a.title)}</p>
          <p class="about-summary">${esc(a.summary)}</p>
        </div>
      </div>
      <div class="attr-grid">${attrs}</div>
      <div class="stats-grid" style="margin-top:1rem">${statCards}</div>`;
    setTimeout(() => {
      panel.querySelectorAll('.stat-fill[data-val]').forEach(bar => { bar.style.width = bar.dataset.val + '%'; });
      panel.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
          const wasOpen = card.classList.contains('tip-open');
          panel.querySelectorAll('.stat-card.tip-open').forEach(c => c.classList.remove('tip-open'));
          if (!wasOpen) card.classList.add('tip-open');
        });
      });
    }, 400);
  }

  function renderDesktopIcons(p) {
    const container = document.getElementById('desktop-icons');
    container.innerHTML = (p.desktopIcons || []).map(i => {
      const isClass = i.color && !i.color.startsWith('#') && !i.color.startsWith('rgb');
      const style = isClass ? '' : `style="background:${i.color}"`;
      const cls = isClass ? ` ${i.color}` : '';
      const inner = i.img
        ? `<img src="${i.img}" alt="${esc(i.label)}" class="desk-icon-png">`
        : `<i class="fas ${i.icon}"></i>`;
      return `
      <div class="desktop-icon" data-win="${i.id}">
        <div class="icon-img${cls}" ${style}>${inner}</div>
        <span>${esc(i.label)}</span>
        <div class="desk-tooltip">${esc(i.label)}</div>
      </div>`;
    }).join('');
    container.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', () => openWindow(icon.dataset.win));
    });
  }

  function bindTaskbar() {
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    startBtn.onclick = () => toggleStartMenu();
    document.addEventListener('click', e => {
      if (startMenuOpen && !startMenu.contains(e.target) && !startBtn.contains(e.target)) closeStartMenu();
    });
    document.getElementById('back-to-profiles').onclick = () => {
      document.getElementById('desktop').classList.add('hidden');
      document.getElementById('windows-container').innerHTML = '';
      document.getElementById('taskbar-apps').innerHTML = '';
      activeProfile = null;
      history.pushState(null, '', BASE_PATH + '/');
      showProfileSelector();
    };
    renderStartMenu();
  }

  function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    startMenuOpen = !startMenuOpen;
    menu.classList.toggle('hidden', !startMenuOpen);
  }
  function closeStartMenu() {
    startMenuOpen = false;
    document.getElementById('start-menu').classList.add('hidden');
  }

  function renderStartMenu() {
    const p = PROFILES[activeProfile];
    if (!p) return;
    const items = document.getElementById('start-menu-items');
    items.innerHTML = (p.desktopIcons || []).map(i => `
      <button class="start-item" data-win="${i.id}"><i class="fas ${i.icon}"></i> ${esc(i.label)}</button>
    `).join('');
    items.querySelectorAll('.start-item').forEach(btn => {
      btn.addEventListener('click', () => { openWindow(btn.dataset.win); closeStartMenu(); });
    });
  }

  function startClock() {
    const el = document.getElementById('clock');
    const tick = () => {
      const d = new Date();
      el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    tick();
    setInterval(tick, 10000);
  }

  /* ══════════════════════════════
     WINDOW MANAGER
     ══════════════════════════════ */
  function openWindow(id) {
    const existing = document.querySelector(`.window[data-id="${id}"]`);
    if (existing) { bringToFront(existing); return; }

    const p = PROFILES[activeProfile];
    const cfg = windowConfig(id, p);
    if (!cfg) return;

    const win = document.createElement('div');
    win.className = 'window';
    win.dataset.id = id;
    win.style.width = cfg.w + 'px';
    win.style.height = cfg.h + 'px';
    win.style.left = Math.max(10, Math.min(window.innerWidth - cfg.w - 20, 60 + Math.random() * 120)) + 'px';
    win.style.top = Math.max(10, Math.min(window.innerHeight - cfg.h - 80, 40 + Math.random() * 80)) + 'px';
    win.style.zIndex = ++winZ;

    const isTerminal = id === 'terminal';
    const isChat = id === 'chat';
    const isGame = id === 'skytiles';
    win.innerHTML = `
      <div class="window-header ${isTerminal ? 'terminal-header' : ''}">
        <div class="window-title"><i class="fas ${cfg.icon}"></i> ${esc(cfg.title)}</div>
        <div class="window-controls">
          <button class="win-btn minimize" title="Minimize"><i class="fas fa-minus"></i></button>
          <button class="win-btn maximize" title="Maximize"><i class="fas fa-expand"></i></button>
          <button class="win-btn close" title="Close"><i class="fas fa-xmark"></i></button>
        </div>
      </div>
      <div class="window-body ${isTerminal ? 'terminal-body' : ''} ${isChat ? 'chat-body' : ''} ${isGame ? 'st-body' : ''}">${cfg.body}</div>`;

    document.getElementById('windows-container').appendChild(win);
    bringToFront(win);
    addTaskbarApp(id, cfg);
    bindWindowControls(win, id);
    makeDraggable(win);
    if (isTerminal) Terminal.init(win.querySelector('.window-body'));
    if (isChat) Chat.init(win.querySelector('.window-body'));
    if (isGame) SkyTiles.init(win.querySelector('.st-container'));
    animateStatBars(win);
  }

  function windowConfig(id, p) {
    if (!p) return null;
    const cfgs = {
      about: { title: 'About Me', icon: 'fa-user-astronaut', w: 560, h: 480, body: renderAbout(p) },
      skills: { title: 'Skill Tree', icon: 'fa-sitemap', w: 680, h: 520, body: renderSkills(p) },
      quests: { title: 'Quest Log', icon: 'fa-scroll', w: 640, h: 520, body: renderQuests(p) },
      achievements: { title: 'Achievements', icon: 'fa-trophy', w: 560, h: 500, body: renderAchievements(p) },
      inventory: { title: 'Inventory', icon: 'fa-boxes-stacked', w: 520, h: 420, body: renderInventory(p) },
      chat: { title: 'Ask Me Anything', icon: 'fa-comments', w: 440, h: 480, body: renderChat() },
      terminal: { title: 'Terminal', icon: 'fa-terminal', w: 560, h: 380, body: renderTerminal() },
      skytiles: { title: 'Sky Tiles', icon: 'fa-jedi', w: 420, h: 520, body: '<div class="st-container"></div>' }
    };
    return cfgs[id] || null;
  }

  /* ── Window content renderers ── */
  function renderAbout(p) {
    const a = p.about;
    if (!a) return '<p>No data.</p>';
    const attrs = (a.attributes || []).map(at => `
      <div class="attr-box"><span class="attr-key">${esc(at.key)}</span><span class="attr-val">${esc(at.val)}</span><span class="attr-desc">${esc(at.desc)}</span></div>
    `).join('');
    const statCards = (p.stats || []).map(s => `
      <div class="stat-card stat-card--${s.color}">
        <div class="stat-icon">${iconHtml(s.icon)}</div>
        <div class="stat-name">${esc(s.name)}</div>
        <div class="stat-bar"><div class="stat-fill ${s.color}" data-val="${s.value}"></div></div>
        <div class="stat-value">${s.value}%</div>
      </div>`).join('');
    return `
      <div class="section-title"><i class="fas fa-user-astronaut"></i> ${esc(a.name)}</div>
      <p style="color:var(--gold);font-weight:600;margin-bottom:.5rem">${esc(a.title)}</p>
      <p style="color:var(--text-2);font-size:.8rem;line-height:1.6;margin-bottom:1.25rem">${esc(a.summary)}</p>
      <div class="attr-grid" style="margin-bottom:1.5rem">${attrs}</div>
      <div class="section-title"><i class="fas fa-chart-bar"></i> Core Stats</div>
      <div class="stats-grid">${statCards}</div>`;
  }

  function renderSkills(p) {
    if (!p.skills) return '<p>No skills.</p>';
    const totalNodes = p.skills.reduce((s,b) => s + b.nodes.length, 0);
    const maxedNodes = p.skills.reduce((s,b) => s + b.nodes.filter(n => n.pips >= 5).length, 0);
    return `<div class="section-title pixel-title"><i class="fas fa-sitemap"></i> Skill Tree <span class="skill-counter">${maxedNodes}/${totalNodes} MASTERED</span></div>
      <div class="skill-branches">
      ${p.skills.map(b => {
        const branchXP = b.nodes.reduce((s,n) => s + n.pips, 0);
        const branchMax = b.nodes.length * 5;
        return `
        <div class="skill-branch">
          <div class="branch-hdr ${b.hdrClass}">${iconHtml(b.icon)}<h4>${esc(b.branch)}</h4><span class="branch-xp">${branchXP}/${branchMax} XP</span></div>
          <div class="branch-bar"><div class="branch-bar-fill ${b.hdrClass}" style="width:${(branchXP/branchMax*100).toFixed(0)}%"></div></div>
          <div class="skill-nodes">
            ${b.nodes.map((n, i) => {
              const isMax = n.pips >= 5;
              return `
              ${i > 0 ? '<div class="skill-conn"></div>' : ''}
              <div class="skill-node${isMax ? ' maxed' : ''}">
                <div class="node-icon">${iconHtml(n.icon || b.icon)}</div>
                <div class="node-info"><span class="node-name">${esc(n.name)}</span>
                  <div class="node-meta"><div class="node-pips">${Array.from({length:5}, (_, j) => `<div class="pip${j < n.pips ? ' on' : ''}"></div>`).join('')}</div><span class="node-lvl">${isMax ? 'MAX' : n.pips + '/5'}</span></div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
      </div>`;
  }

  function renderQuests(p) {
    if (!p.quests) return '<p>No quests.</p>';
    const tabs = p.questTabs || Object.keys(p.quests);
    const totalQuests = Object.values(p.quests).flat().length;
    const doneQuests = Object.values(p.quests).flat().filter(q => q.status === 'done').length;
    return `<div class="section-title pixel-title"><i class="fas fa-scroll"></i> Quest Log <span class="quest-counter">${doneQuests}/${totalQuests} COMPLETE</span></div>
      <div class="quest-tabs">${tabs.map((t, i) => {
        const count = (p.quests[t] || []).length;
        return `<button class="quest-tab${i === 0 ? ' active' : ''}" data-tab="${esc(t)}">${esc(t)} <span class="tab-count">${count}</span></button>`;
      }).join('')}</div>
      ${tabs.map((t, i) => `
        <div class="quest-list${i > 0 ? ' hidden' : ''}" data-tab-body="${esc(t)}">
          ${(p.quests[t] || []).map(q => {
            const isActive = q.status === 'active' || q.status === 'ongoing';
            const statusLabel = q.status === 'done' ? 'COMPLETE' : isActive ? 'IN PROGRESS' : 'LOCKED';
            const statusClass = q.status === 'done' ? 'status-done' : isActive ? 'status-active' : 'status-locked';
            const hasTimeline = q.timeline && q.timeline.length;
            return `
            <div class="quest-card ${q.status === 'ongoing' ? 'active' : q.status}${hasTimeline ? ' has-timeline' : ''}">
              <div class="quest-icon-wrap"><div class="quest-icon-circle ${q.logo ? `has-logo logo-${q.logo.split('/').pop().split('.')[0]}` : (q.barColor || 'green')}">${q.logo ? `<img src="${esc(q.logo)}" alt="" class="quest-logo">` : iconHtml(q.icon)}</div></div>
              <div class="quest-body">
                <div class="quest-header"><h4>${esc(q.title)}</h4>${q.date ? `<span class="quest-date"><i class="fas fa-calendar-alt"></i> ${esc(q.date)}</span>` : ''}${q.role ? `<span class="quest-role"><i class="fas fa-user-tag"></i> ${esc(q.role)}</span>` : ''}<span class="quest-status ${statusClass}">${statusLabel}</span></div>
                <p>${esc(q.desc)}</p>
                <div class="quest-tags">${(q.tags || []).map(tg => `<span class="tag">${esc(tg)}</span>`).join('')}</div>
                <div class="quest-bar-wrap"><div class="quest-bar"><div class="quest-bar-fill ${q.barColor}" style="width:${q.bar}%"></div></div><span class="quest-bar-pct">${q.bar}%</span></div>
                ${hasTimeline ? `
                <button class="quest-timeline-toggle" onclick="this.closest('.quest-card').classList.toggle('timeline-open');this.querySelector('.toggle-icon').classList.toggle('rotated')">
                  <i class="fas fa-route"></i> Milestones <span class="toggle-icon"><i class="fas fa-chevron-down"></i></span>
                </button>
                <div class="quest-timeline">
                  ${q.timeline.map((m, idx) => `
                  <div class="qtl-step">
                    <div class="qtl-marker"><span class="qtl-num">${idx + 1}</span></div>
                    <div class="qtl-content">
                      <div class="qtl-phase">${esc(m.phase)}</div>
                      <div class="qtl-detail">${esc(m.detail)}</div>
                    </div>
                  </div>`).join('')}
                </div>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>`).join('')}`;
  }

  function renderAchievements(p) {
    if (!p.achievements) return '<p>No achievements.</p>';
    const unlocked = p.achievements.filter(a => a.unlocked).length;
    const byRarity = { legendary: 0, epic: 0, elite: 0 };
    const achLabel = { legendary: 'Ascended', epic: 'Vanguard', elite: 'Forged' };
    p.achievements.forEach(a => { if (a.unlocked && byRarity[a.rarity] !== undefined) byRarity[a.rarity]++; });
    return `<div class="section-title pixel-title"><i class="fas fa-trophy"></i> Achievements</div>
      <div class="ach-summary">
        <div class="ach-ring"><svg viewBox="0 0 36 36" class="ach-ring-svg"><path class="ach-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><path class="ach-ring-fill" stroke-dasharray="${(unlocked/p.achievements.length*100).toFixed(0)}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /></svg><div class="ach-ring-text"><span class="ach-big">${unlocked}</span></div></div>
        <div class="ach-rarity-breakdown">
          <div class="ach-rb legendary"><i class="fas fa-gem"></i> ${byRarity.legendary} Ascended</div>
          <div class="ach-rb epic"><i class="fas fa-star"></i> ${byRarity.epic} Vanguard</div>
          <div class="ach-rb elite"><i class="fas fa-circle"></i> ${byRarity.elite} Forged</div>
        </div>
      </div>
      <div class="ach-grid">
        ${p.achievements.map(a => `
          <div class="ach-item ${a.rarity}${a.unlocked ? '' : ' locked'}">
            <div class="ach-icon ${a.rarity}">${iconHtml(a.icon)}</div>
            <div class="ach-info"><h4>${esc(a.title)}</h4><p>${esc(a.desc)}</p></div>
            <span class="ach-rarity ${a.rarity}">${achLabel[a.rarity] || a.rarity}</span>
          </div>`).join('')}
      </div>`;
  }

  function renderInventory(p) {
    if (!p.inventory) return '<p>Empty inventory.</p>';
    const counts = { legendary: 0, epic: 0, elite: 0 };
    p.inventory.forEach(i => { if (counts[i.rarity] !== undefined) counts[i.rarity]++; });
    const invLabel = { legendary: 'Mythic', epic: 'Exotic', elite: 'Refined' };
    return `<div class="section-title pixel-title"><i class="fas fa-boxes-stacked"></i> Tech Inventory <span class="inv-counter">${p.inventory.length} items</span></div>
      <div class="inv-legend"><span class="inv-leg legendary"><i class="fas fa-gem"></i> ${counts.legendary} Mythic</span><span class="inv-leg epic"><i class="fas fa-star"></i> ${counts.epic} Exotic</span><span class="inv-leg elite"><i class="fas fa-circle"></i> ${counts.elite} Refined</span></div>
      <div class="inv-grid">
        ${p.inventory.map(item => `
          <div class="inv-item ${item.rarity}" title="${esc(item.name)} (${invLabel[item.rarity] || item.rarity})">
            <div class="inv-slot"><div class="inv-icon">${iconHtml(item.icon)}</div></div>
            <span class="inv-name">${esc(item.name)}</span>
            <span class="inv-rarity-dot ${item.rarity}"></span>
          </div>`).join('')}
      </div>`;
  }

  function renderTerminal() {
    return `<div class="terminal-output"></div>
      <div class="terminal-input-line">
        <span class="term-prompt">devyani@os:~$</span>
        <input type="text" class="term-input" spellcheck="false" autocomplete="off" autofocus>
      </div>`;
  }

  function renderChat() {
    return `<div class="chat-messages"></div>
      <div class="chat-input-bar">
        <input type="text" class="chat-input" placeholder="Ask me anything about Devyani..." spellcheck="false" autocomplete="off">
        <button class="chat-send"><i class="fas fa-paper-plane"></i></button>
      </div>`;
  }

  /* ── Quest tab switching (delegated) ── */
  document.addEventListener('click', e => {
    if (!e.target.classList.contains('quest-tab')) return;
    const parent = e.target.closest('.window-body');
    if (!parent) return;
    parent.querySelectorAll('.quest-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    const tab = e.target.dataset.tab;
    parent.querySelectorAll('.quest-list').forEach(l => l.classList.toggle('hidden', l.dataset.tabBody !== tab));
  });

  /* ── Window controls ── */
  function bindWindowControls(win, id) {
    const close = win.querySelector('.win-btn.close');
    const min = win.querySelector('.win-btn.minimize');
    const max = win.querySelector('.win-btn.maximize');
    close.onclick = () => { win.remove(); removeTaskbarApp(id); };
    min.onclick = () => { win.classList.add('hidden'); };
    max.onclick = () => { win.classList.toggle('maximized'); };
    win.addEventListener('mousedown', () => bringToFront(win));
    win.addEventListener('touchstart', () => bringToFront(win), { passive: true });
  }

  function bringToFront(win) {
    win.style.zIndex = ++winZ;
    win.classList.remove('hidden');
    // highlight taskbar
    document.querySelectorAll('.taskbar-app').forEach(a => a.classList.toggle('active-app', a.dataset.win === win.dataset.id));
  }

  /* ── Taskbar apps ── */
  function addTaskbarApp(id, cfg) {
    const bar = document.getElementById('taskbar-apps');
    const existing = bar.querySelector(`[data-win="${id}"]`);
    if (existing) { existing.classList.add('active-app'); return; }
    const btn = document.createElement('button');
    btn.className = 'taskbar-app active-app';
    btn.dataset.win = id;
    btn.innerHTML = `<i class="fas ${cfg.icon}"></i> ${esc(cfg.title)}`;
    btn.onclick = () => {
      const win = document.querySelector(`.window[data-id="${id}"]`);
      if (win) bringToFront(win);
    };
    bar.appendChild(btn);
  }
  function removeTaskbarApp(id) {
    const btn = document.getElementById('taskbar-apps').querySelector(`[data-win="${id}"]`);
    if (btn && !btn.classList.contains('taskbar-app--pinned')) btn.remove();
  }

  function pinTerminalToTaskbar() {
    const bar = document.getElementById('taskbar-apps');
    if (bar.querySelector('[data-win="terminal"]')) return;
    const btn = document.createElement('button');
    btn.className = 'taskbar-app taskbar-app--pinned';
    btn.dataset.win = 'terminal';
    btn.innerHTML = '<i class="fas fa-terminal"></i> Terminal';
    btn.onclick = () => openWindow('terminal');
    bar.appendChild(btn);
  }

  /* ── Dragging ── */
  function makeDraggable(win) {
    const hdr = win.querySelector('.window-header');
    let dragging = false, ox, oy;

    hdr.addEventListener('mousedown', start);
    hdr.addEventListener('touchstart', start, { passive: false });

    function start(e) {
      if (e.target.closest('.win-btn')) return;
      if (win.classList.contains('maximized')) return;
      dragging = true;
      const pt = e.touches ? e.touches[0] : e;
      ox = pt.clientX - win.offsetLeft;
      oy = pt.clientY - win.offsetTop;
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', stop);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', stop);
    }
    function move(e) {
      if (!dragging) return;
      e.preventDefault();
      const pt = e.touches ? e.touches[0] : e;
      win.style.left = Math.max(0, pt.clientX - ox) + 'px';
      win.style.top = Math.max(0, pt.clientY - oy) + 'px';
    }
    function stop() {
      dragging = false;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', stop);
    }
  }

  /* ── Animate stat bars ── */
  function animateStatBars(win) {
    setTimeout(() => {
      win.querySelectorAll('.stat-fill[data-val]').forEach(bar => {
        bar.style.width = bar.dataset.val + '%';
      });
    }, 200);
  }

  /* ── Admin Desktop ── */
  function openAdminDesktop() {
    document.getElementById('profile-selector').classList.add('hidden');
    document.getElementById('desktop').classList.add('hidden');
    document.getElementById('admin-desktop').classList.remove('hidden');
    history.pushState(null, '', BASE_PATH + '/admin');
    Admin.open();
    document.getElementById('admin-back').onclick = () => {
      document.getElementById('admin-desktop').classList.add('hidden');
      location.hash = '';
      showProfileSelector();
    };
  }

  /* ── Toast ── */
  function showToast(title, text) {
    const t = document.getElementById('toast');
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-text').textContent = text;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 4000);
  }

  /* ── Util ── */
  function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function iconHtml(ic) {
    if (!ic) return '';
    // Devicon: starts with "devicon-"
    if (ic.startsWith('devicon-')) return `<i class="${ic}"></i>`;
    // Font Awesome brand: starts with "fab-"
    if (ic.startsWith('fab-')) return `<i class="fab ${ic.replace('fab-','fa-')}"></i>`;
    // Default: Font Awesome solid
    return `<i class="fas ${ic}"></i>`;
  }

  /* ── Public ── */
  return { init, get activeProfile() { return activeProfile; } };
})();

/* Boot on load */
window.addEventListener('DOMContentLoaded', App.init);
