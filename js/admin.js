/* ============================================
   admin.js — Admin Dashboard Logic
   Password auth + profile data editing
   ============================================ */

const Admin = (() => {
  const ADMIN_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // sha256('admin')
  let currentSection = 'overview';

  /* --- SHA-256 via SubtleCrypto --- */
  async function sha256(msg) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* --- Authenticate --- */
  async function authenticate(pwd) {
    const hash = await sha256(pwd);
    return hash === ADMIN_HASH;
  }

  /* --- Render sidebar --- */
  function renderSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const items = [
      { id: 'overview', icon: 'fa-gauge-high', label: 'Overview' },
      { id: 'edit-about', icon: 'fa-user-pen', label: 'Edit About' },
      { id: 'edit-skills', icon: 'fa-sitemap', label: 'Edit Skills' },
      { id: 'edit-quests', icon: 'fa-scroll', label: 'Edit Projects' },
      { id: 'edit-achievements', icon: 'fa-trophy', label: 'Edit Achievements' },
      { id: 'manage-profiles', icon: 'fa-layer-group', label: 'Manage Profiles' }
    ];
    sidebar.innerHTML = items.map(i => `
      <button class="sidebar-item${i.id === currentSection ? ' active' : ''}" data-section="${i.id}">
        <i class="fas ${i.icon}"></i><span>${i.label}</span>
      </button>`).join('');
    sidebar.querySelectorAll('.sidebar-item').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSection = btn.dataset.section;
        renderSidebar();
        renderMain();
      });
    });
  }

  /* --- Render main content --- */
  function renderMain() {
    const main = document.getElementById('admin-main');
    const renderers = {
      'overview': renderOverview,
      'edit-about': renderEditAbout,
      'edit-skills': renderEditSkills,
      'edit-quests': renderEditQuests,
      'edit-achievements': renderEditAchievements,
      'manage-profiles': renderManageProfiles
    };
    (renderers[currentSection] || renderOverview)(main);
  }

  /* --- Sections --- */
  function renderOverview(el) {
    const liveCount = PROFILE_ORDER.filter(k => !PROFILES[k].comingSoon).length;
    const totalQuests = Object.values(PROFILES.general.quests || {}).reduce((s, a) => s + a.length, 0);
    el.innerHTML = `
      <h2><i class="fas fa-gauge-high"></i> Admin Overview</h2>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-layer-group"></i></div><div class="stat-name">Profiles</div><div class="stat-value">${PROFILE_ORDER.length}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-signal"></i></div><div class="stat-name">Live</div><div class="stat-value">${liveCount}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-scroll"></i></div><div class="stat-name">Projects</div><div class="stat-value">${totalQuests}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-trophy"></i></div><div class="stat-name">Achievements</div><div class="stat-value">${(PROFILES.general.achievements || []).length}</div></div>
      </div>
      <div class="admin-section">
        <h3>Quick Actions</h3>
        <div class="admin-actions">
          <button class="btn-primary" onclick="Admin.go('edit-about')"><i class="fas fa-user-pen"></i> Edit About</button>
          <button class="btn-primary" onclick="Admin.go('edit-quests')"><i class="fas fa-scroll"></i> Edit Projects</button>
          <button class="btn-secondary" onclick="Admin.go('manage-profiles')"><i class="fas fa-layer-group"></i> Manage Profiles</button>
        </div>
      </div>`;
  }

  function renderEditAbout(el) {
    const a = PROFILES.general.about;
    el.innerHTML = `
      <h2><i class="fas fa-user-pen"></i> Edit About</h2>
      <div class="admin-section">
        <h3>General Profile — About</h3>
        <div class="form-group"><label>Name</label><input id="adm-name" value="${esc(a.name)}"></div>
        <div class="form-group"><label>Title</label><input id="adm-title" value="${esc(a.title)}"></div>
        <div class="form-group"><label>Summary</label><textarea id="adm-summary" rows="4">${esc(a.summary)}</textarea></div>
        <div class="admin-actions"><button class="btn-primary" id="save-about"><i class="fas fa-save"></i> Save</button></div>
        <div class="admin-msg success hidden" id="about-msg">Saved successfully!</div>
      </div>`;
    document.getElementById('save-about').addEventListener('click', () => {
      a.name = document.getElementById('adm-name').value;
      a.title = document.getElementById('adm-title').value;
      a.summary = document.getElementById('adm-summary').value;
      saveToStorage();
      showMsg('about-msg');
    });
  }

  function renderEditSkills(el) {
    const branches = PROFILES.general.skills || [];
    el.innerHTML = `<h2><i class="fas fa-sitemap"></i> Edit Skill Tree</h2>` +
      branches.map((b, bi) => `
        <div class="admin-section">
          <h3>${esc(b.branch)}</h3>
          ${b.nodes.map((n, ni) => `
            <div class="form-group" style="display:flex;gap:.5rem;align-items:center;">
              <input style="flex:1" value="${esc(n.name)}" data-b="${bi}" data-n="${ni}" class="skill-name-in">
              <select data-b="${bi}" data-n="${ni}" class="skill-pip-in" style="width:60px">
                ${[1,2,3,4,5].map(v => `<option value="${v}"${v === n.pips ? ' selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>`).join('')}
        </div>`).join('') +
      `<div class="admin-actions"><button class="btn-primary" id="save-skills"><i class="fas fa-save"></i> Save Skills</button></div>
       <div class="admin-msg success hidden" id="skills-msg">Saved successfully!</div>`;
    document.getElementById('save-skills').addEventListener('click', () => {
      el.querySelectorAll('.skill-name-in').forEach(inp => {
        branches[inp.dataset.b].nodes[inp.dataset.n].name = inp.value;
      });
      el.querySelectorAll('.skill-pip-in').forEach(sel => {
        branches[sel.dataset.b].nodes[sel.dataset.n].pips = parseInt(sel.value);
      });
      saveToStorage();
      showMsg('skills-msg');
    });
  }

  function renderEditQuests(el) {
    const quests = PROFILES.general.quests || {};
    const tabs = Object.keys(quests);
    el.innerHTML = `<h2><i class="fas fa-scroll"></i> Edit Projects</h2>` +
      tabs.map(tab => `
        <div class="admin-section">
          <h3>${esc(tab)}</h3>
          ${quests[tab].map((q, qi) => `
            <div class="card">
              <div class="form-group"><label>Title</label><input value="${esc(q.title)}" data-tab="${esc(tab)}" data-qi="${qi}" class="quest-title-in"></div>
              <div class="form-group"><label>Description</label><textarea rows="2" data-tab="${esc(tab)}" data-qi="${qi}" class="quest-desc-in">${esc(q.desc)}</textarea></div>
            </div>`).join('')}
        </div>`).join('') +
      `<div class="admin-actions"><button class="btn-primary" id="save-quests"><i class="fas fa-save"></i> Save Projects</button></div>
       <div class="admin-msg success hidden" id="quests-msg">Saved successfully!</div>`;
    document.getElementById('save-quests').addEventListener('click', () => {
      el.querySelectorAll('.quest-title-in').forEach(inp => {
        quests[inp.dataset.tab][inp.dataset.qi].title = inp.value;
      });
      el.querySelectorAll('.quest-desc-in').forEach(ta => {
        quests[ta.dataset.tab][ta.dataset.qi].desc = ta.value;
      });
      saveToStorage();
      showMsg('quests-msg');
    });
  }

  function renderEditAchievements(el) {
    const achs = PROFILES.general.achievements || [];
    el.innerHTML = `<h2><i class="fas fa-trophy"></i> Edit Achievements</h2>
      <div class="admin-section">
        ${achs.map((a, i) => `
          <div class="card">
            <div class="form-group"><label>Title</label><input value="${esc(a.title)}" data-i="${i}" class="ach-title-in"></div>
            <div class="form-group"><label>Description</label><input value="${esc(a.desc)}" data-i="${i}" class="ach-desc-in"></div>
          </div>`).join('')}
      </div>
      <div class="admin-actions"><button class="btn-primary" id="save-achs"><i class="fas fa-save"></i> Save</button></div>
      <div class="admin-msg success hidden" id="achs-msg">Saved successfully!</div>`;
    document.getElementById('save-achs').addEventListener('click', () => {
      el.querySelectorAll('.ach-title-in').forEach(inp => { achs[inp.dataset.i].title = inp.value; });
      el.querySelectorAll('.ach-desc-in').forEach(inp => { achs[inp.dataset.i].desc = inp.value; });
      saveToStorage();
      showMsg('achs-msg');
    });
  }

  function renderManageProfiles(el) {
    el.innerHTML = `<h2><i class="fas fa-layer-group"></i> Manage Profiles</h2>` +
      PROFILE_ORDER.map(k => {
        const p = PROFILES[k];
        return `<div class="admin-section" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;">
          <div><i class="fas ${p.icon}" style="color:var(--accent-g);margin-right:.4rem"></i><strong>${esc(p.name)}</strong>
            <span class="tag ${p.comingSoon ? 'gold' : 'green'}">${p.comingSoon ? 'Coming Soon' : 'Live'}</span>
          </div>
          <button class="btn-secondary btn-sm toggle-profile" data-key="${k}">${p.comingSoon ? 'Publish' : 'Unpublish'}</button>
        </div>`;
      }).join('') +
      `<div class="admin-msg success hidden" id="profiles-msg">Updated!</div>`;
    el.querySelectorAll('.toggle-profile').forEach(btn => {
      btn.addEventListener('click', () => {
        PROFILES[btn.dataset.key].comingSoon = !PROFILES[btn.dataset.key].comingSoon;
        saveToStorage();
        renderManageProfiles(el);
      });
    });
  }

  /* --- Helpers --- */
  function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function saveToStorage() {
    try { localStorage.setItem('devyanios_profiles', JSON.stringify(PROFILES)); } catch(e) { /* quota */ }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('devyanios_profiles');
      if (raw) {
        const saved = JSON.parse(raw);
        Object.keys(saved).forEach(k => { if (PROFILES[k]) Object.assign(PROFILES[k], saved[k]); });
      }
    } catch(e) { /* corrupt */ }
  }

  function showMsg(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 2000);
  }

  function go(section) {
    currentSection = section;
    renderSidebar();
    renderMain();
  }

  function open() {
    renderSidebar();
    renderMain();
  }

  return { authenticate, open, go, loadFromStorage };
})();
