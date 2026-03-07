/* ============================================
   terminal.js — Profile-aware Terminal Emulator
   ============================================ */

const Terminal = (() => {
  let history = [];
  let histIdx = -1;
  let outputEl, inputEl, promptEl;

  function init(termWindow) {
    outputEl = termWindow.querySelector('.terminal-output');
    inputEl = termWindow.querySelector('.term-input');
    promptEl = termWindow.querySelector('.term-prompt');
    if (!inputEl) return;
    const pName = (PROFILES[App.activeProfile] && PROFILES[App.activeProfile].name) || App.activeProfile || 'os';
    promptEl.textContent = `devyani@${pName.toLowerCase()}:~$`;
    inputEl.addEventListener('keydown', onKey);
    inputEl.focus();
    printWelcome();
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      const cmd = inputEl.value.trim();
      inputEl.value = '';
      if (cmd) { history.push(cmd); histIdx = history.length; }
      printLine(`<span class="term-cmd">${escHtml(promptEl.textContent)} ${escHtml(cmd)}</span>`);
      execute(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; inputEl.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; inputEl.value = history[histIdx]; } else { histIdx = history.length; inputEl.value = ''; }
    }
  }

  function execute(raw) {
    const parts = raw.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const p = PROFILES[App.activeProfile];

    const commands = {
      help: () => {
        printLine('<span class="term-accent">Available commands:</span>');
        printLine('  help        — Show this help');
        printLine('  about       — About me');
        printLine('  skills      — List skill branches');
        printLine('  experience  — Career timeline');
        printLine('  projects    — Project summary');
        printLine('  stats       — Stat bars');
        printLine('  achievements— Achievement list');
        printLine('  education   — Education background');
        printLine('  contact     — Contact info');
        printLine('  clear       — Clear terminal');
        printLine('  neofetch    — System info');
        printLine('  whoami      — Current identity');
        printLine('  ls          — List desktop items');
      },
      about: () => {
        if (!p || !p.about) { printLine('No profile loaded.'); return; }
        printLine(`<span class="term-accent">${escHtml(p.about.name)}</span>`);
        printLine(`<span class="term-gold">${escHtml(p.about.title)}</span>`);
        printLine('');
        printLine(escHtml(p.about.summary));
      },
      skills: () => {
        if (!p || !p.skills) { printLine('No skill data.'); return; }
        p.skills.forEach(b => {
          printLine(`<span class="term-accent">[${escHtml(b.branch)}]</span>`);
          b.nodes.forEach(n => {
            const filled = '█'.repeat(n.pips) + '░'.repeat(5 - n.pips);
            printLine(`  ${escHtml(n.name.padEnd(25))} ${filled}`);
          });
          printLine('');
        });
      },
      experience: () => {
        printLine('<span class="term-accent">Career Timeline</span>');
        printLine('  Sept 2020 — Joined Deloitte as Analyst');
        printLine('  2022 — Promoted to Developer');
        printLine('  2024 — Promoted to Senior Developer');
        printLine('  2025 — 5.5 years, 14+ projects delivered');
        printLine('  Total promotions: 2');
      },
      projects: () => {
        if (!p || !p.quests) { printLine('No project data.'); return; }
        Object.keys(p.quests).forEach(tab => {
          printLine(`<span class="term-gold">[${escHtml(tab)}]</span>`);
          p.quests[tab].forEach(q => {
            printLine(`  ✓ ${escHtml(q.title)} — ${escHtml(q.desc.substring(0, 80))}...`);
          });
          printLine('');
        });
      },
      stats: () => {
        if (!p || !p.stats) { printLine('No stats.'); return; }
        p.stats.forEach(s => {
          const bar = '█'.repeat(Math.round(s.value / 10)) + '░'.repeat(10 - Math.round(s.value / 10));
          printLine(`  ${escHtml(s.name.padEnd(16))} ${bar} ${s.value}%`);
        });
      },
      achievements: () => {
        if (!p || !p.achievements) { printLine('No achievements.'); return; }
        p.achievements.forEach(a => {
          const lock = a.unlocked ? '🏆' : '🔒';
          printLine(`  ${lock} <span class="term-gold">${escHtml(a.title)}</span> — ${escHtml(a.desc)} [${a.rarity}]`);
        });
      },
      education: () => {
        printLine('<span class="term-accent">Education</span>');
        printLine('');
        printLine('<span class="term-gold">MSc — Applications of Mathematics</span>');
        printLine('  Chennai Mathematical Institute (CMI)');
        printLine('  Status  : Ongoing (Distance Learning Programme)');
        printLine('  Research: Rubik\'s Cube Optimization using Evolutionary Algorithms');
        printLine('');
        printLine('<span class="term-gold">BTech — Computer Science (Cognitive Computing)</span>');
        printLine('  IIIT Delhi (IIITD)');
        printLine('  Thesis  : MCOACH (Knowledge Ontology + Keras)');
        printLine('           CUBE DEALT (Evolutionary Algorithms + TensorFlow)');
        printLine('           CRASH SAVERS (IoT + Holographic Projection)');
      },
      contact: () => {
        printLine('<span class="term-accent">Contact</span>');
        printLine('  Email   : dev16pk@gmail.com');
        printLine('  Phone   : +91-7014405433');
      },
      clear: () => { if (outputEl) outputEl.innerHTML = ''; },
      neofetch: () => {
        printLine('<span class="term-accent">Devyani_pOS v20.26</span>');
        printLine(`  Profile : ${p ? escHtml(p.name) : 'none'}`);
        printLine(`  Engine  : Vanilla JS`);
        printLine('  Host    : Browser Runtime');
        printLine(`  Uptime  : ${Math.floor((Date.now() - window.__bootTime) / 1000)}s`);
        printLine(`  Windows : ${document.querySelectorAll('.window').length}`);
      },
      whoami: () => { printLine(p ? escHtml(p.about?.name || p.name) : 'guest'); },
      ls: () => {
        if (!p || !p.desktopIcons) { printLine('Empty desktop.'); return; }
        p.desktopIcons.forEach(i => printLine(`  📁 ${escHtml(i.label)}`));
      }
    };

    if (commands[cmd]) { commands[cmd](); }
    else if (cmd) { printLine(`<span class="term-error">Command not found: ${escHtml(cmd)}</span>. Type <span class="term-accent">help</span> for commands.`); }
    scrollBottom();
  }

  function printWelcome() {
    printLine('<span class="term-accent">Devyani_pOS Terminal v20.26</span>');
    printLine('Type <span class="term-cmd">help</span> for a list of commands.\n');
    scrollBottom();
  }

  function printLine(html) {
    if (!outputEl) return;
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    outputEl.appendChild(div);
  }

  function scrollBottom() {
    if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
  }

  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  return { init };
})();
