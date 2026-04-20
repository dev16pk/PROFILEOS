/* ============================================
   2048 Mesh — Number Fusion Puzzle
   ============================================ */

const Game2048 = (() => {
  let container, grid, score, highScore, state, moved;
  let keyHandler = null;
  let touchBound = false;

  const TILE_COLORS = {
    2:    { bg: '#1a2636', fg: '#06b6d4', glow: 'rgba(6,182,212,.3)' },
    4:    { bg: '#1a2f3a', fg: '#22d3ee', glow: 'rgba(34,211,238,.3)' },
    8:    { bg: '#1a2840', fg: '#818cf8', glow: 'rgba(129,140,248,.3)' },
    16:   { bg: '#1e1a40', fg: '#a78bfa', glow: 'rgba(167,139,250,.4)' },
    32:   { bg: '#2a1a30', fg: '#c084fc', glow: 'rgba(192,132,252,.4)' },
    64:   { bg: '#2e1a28', fg: '#ec4899', glow: 'rgba(236,72,153,.4)' },
    128:  { bg: '#2e2010', fg: '#f59e0b', glow: 'rgba(245,158,11,.4)' },
    256:  { bg: '#2e2a08', fg: '#eab308', glow: 'rgba(234,179,8,.5)' },
    512:  { bg: '#2e1a08', fg: '#f97316', glow: 'rgba(249,115,22,.5)' },
    1024: { bg: '#2e0a08', fg: '#ef4444', glow: 'rgba(239,68,68,.5)' },
    2048: { bg: '#0a2e10', fg: '#22c55e', glow: 'rgba(34,197,94,.6)' }
  };

  function init(el) {
    container = el;
    highScore = +(localStorage.getItem('game2048_hi') || 0);
    showMenu();
  }

  function showMenu() {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
    touchBound = false;
    container.innerHTML = `
      <div class="gs-menu" style="background:#0a111e">
        <div class="gs-menu-inner">
          <div class="gs-menu-icon" style="color:#06b6d4"><i class="fas fa-cubes"></i></div>
          <h2 style="color:#06b6d4;font-family:var(--font-pixel);font-size:1.1rem;text-shadow:0 0 20px rgba(6,182,212,.5)">2048 MESH</h2>
          <p style="color:#22d3ee;font-size:.7rem;margin:.5rem 0 1rem;opacity:.7">Slide. Merge. Reach 2048.</p>
          <div style="color:#06b6d4;font-family:var(--font-mono);font-size:.75rem;margin-bottom:1rem;opacity:.8">HIGH SCORE: ${highScore}</div>
          <button class="gs-play-btn" style="--btn-color:#06b6d4" id="g2-play"><i class="fas fa-play"></i> PLAY</button>
          <div class="gs-instructions">
            <p><i class="fas fa-arrow-up"></i> Arrow keys / WASD to slide</p>
            <p><i class="fas fa-compress-arrows-alt"></i> Merge matching tiles</p>
            <p><i class="fas fa-trophy"></i> Reach 2048 to win!</p>
          </div>
        </div>
      </div>`;
    container.querySelector('#g2-play').onclick = launch;
  }

  function launch() {
    grid = Array.from({length: 4}, () => Array(4).fill(0));
    score = 0;
    state = 'play';
    addTile(); addTile();
    render();

    keyHandler = (e) => {
      if (state !== 'play') return;
      const k = e.key.toLowerCase();
      let moved = false;
      if (k === 'arrowup' || k === 'w') { moved = moveUp(); e.preventDefault(); }
      else if (k === 'arrowdown' || k === 's') { moved = moveDown(); e.preventDefault(); }
      else if (k === 'arrowleft' || k === 'a') { moved = moveLeft(); e.preventDefault(); }
      else if (k === 'arrowright' || k === 'd') { moved = moveRight(); e.preventDefault(); }
      if (moved) {
        addTile();
        render();
        if (isGameOver()) { state = 'dead'; showGameOver(); }
        if (hasWon()) { state = 'won'; showWinScreen(); }
      }
    };
    document.addEventListener('keydown', keyHandler);

    bindTouch();
  }

  function bindTouch() {
    if (touchBound) return;
    touchBound = true;
    let tx, ty;
    container.addEventListener('touchstart', (e) => {
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, {passive: true});
    container.addEventListener('touchend', (e) => {
      if (state !== 'play') return;
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      let moved = false;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) moved = moveRight();
        else if (dx < -30) moved = moveLeft();
      } else {
        if (dy > 30) moved = moveDown();
        else if (dy < -30) moved = moveUp();
      }
      if (moved) { addTile(); render(); if (isGameOver()) { state = 'dead'; showGameOver(); } if (hasWon()) { state = 'won'; showWinScreen(); } }
    }, {passive: true});
  }

  function addTile() {
    const empty = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        if (grid[r][c] === 0) empty.push({r, c});
    if (empty.length === 0) return;
    const cell = empty[Math.floor(Math.random() * empty.length)];
    grid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
  }

  function slide(row) {
    let arr = row.filter(v => v !== 0);
    let merged = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i+1]) {
        arr[i] *= 2;
        score += arr[i];
        if (score > highScore) { highScore = score; localStorage.setItem('game2048_hi', highScore); }
        arr.splice(i+1, 1);
        merged = true;
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      const old = [...grid[r]];
      grid[r] = slide(grid[r]);
      if (grid[r].some((v, i) => v !== old[i])) moved = true;
    }
    return moved;
  }
  function moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      const old = [...grid[r]];
      grid[r] = slide(grid[r].reverse()).reverse();
      if (grid[r].some((v, i) => v !== old[i])) moved = true;
    }
    return moved;
  }
  function moveUp() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
      const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      const old = [...col];
      const slid = slide(col);
      for (let r = 0; r < 4; r++) grid[r][c] = slid[r];
      if (slid.some((v, i) => v !== old[i])) moved = true;
    }
    return moved;
  }
  function moveDown() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
      const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      const old = [...col];
      const slid = slide(col.reverse()).reverse();
      for (let r = 0; r < 4; r++) grid[r][c] = slid[r];
      if (slid.some((v, i) => v !== old[i])) moved = true;
    }
    return moved;
  }

  function isGameOver() {
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return false;
        if (c < 3 && grid[r][c] === grid[r][c+1]) return false;
        if (r < 3 && grid[r][c] === grid[r+1][c]) return false;
      }
    return true;
  }

  function hasWon() {
    return grid.some(row => row.some(v => v === 2048));
  }

  function render() {
    container.innerHTML = `
      <div class="g2-wrap">
        <div class="gs-hud">
          <div><span class="gs-hud-label">SCORE</span><span class="gs-hud-val" id="g2-score">${score}</span></div>
          <div><span class="gs-hud-label">BEST</span><span class="gs-hud-val">${highScore}</span></div>
        </div>
        <div class="g2-board">
          ${grid.map(row => row.map(v => {
            const tc = TILE_COLORS[v] || { bg: '#1a2636', fg: '#334155', glow: 'transparent' };
            return `<div class="g2-cell${v ? ' g2-filled' : ''}" style="background:${v ? tc.bg : 'rgba(26,38,54,.4)'};color:${tc.fg};box-shadow:${v ? '0 0 12px '+tc.glow+',inset 0 0 8px '+tc.glow : 'none'}">
              ${v || ''}
            </div>`;
          }).join('')).join('')}
        </div>
      </div>`;
  }

  function showGameOver() {
    const overlay = document.createElement('div');
    overlay.className = 'g2-overlay';
    overlay.innerHTML = `
      <div class="mm-win-box">
        <h2 style="color:#ef4444;font-family:var(--font-pixel);font-size:1rem;margin-bottom:.5rem">GAME OVER</h2>
        <p style="color:#94a3b8;font-size:.85rem">Score: ${score}</p>
        <button class="gs-play-btn" style="--btn-color:#06b6d4;margin-top:.75rem" id="g2-again"><i class="fas fa-redo"></i> TRY AGAIN</button>
        <button class="gs-menu-btn" id="g2-back" style="margin-top:.5rem;background:transparent;color:#8899aa;border:1px solid #2a3a52;padding:.4rem 1rem;border-radius:6px;cursor:pointer;font-family:var(--font);font-size:.75rem">Menu</button>
      </div>`;
    container.querySelector('.g2-wrap').appendChild(overlay);
    document.getElementById('g2-again').onclick = launch;
    document.getElementById('g2-back').onclick = showMenu;
  }

  function showWinScreen() {
    const overlay = document.createElement('div');
    overlay.className = 'g2-overlay';
    overlay.innerHTML = `
      <div class="mm-win-box">
        <h2 style="color:#22c55e;font-family:var(--font-pixel);font-size:1rem;margin-bottom:.5rem">🎉 YOU WIN!</h2>
        <p style="color:#94a3b8;font-size:.85rem">Score: ${score}</p>
        <button class="gs-play-btn" style="--btn-color:#22c55e;margin-top:.75rem" id="g2-continue"><i class="fas fa-play"></i> KEEP GOING</button>
        <button class="gs-menu-btn" id="g2-back2" style="margin-top:.5rem;background:transparent;color:#8899aa;border:1px solid #2a3a52;padding:.4rem 1rem;border-radius:6px;cursor:pointer;font-family:var(--font);font-size:.75rem">Menu</button>
      </div>`;
    container.querySelector('.g2-wrap').appendChild(overlay);
    document.getElementById('g2-continue').onclick = () => { state = 'play'; overlay.remove(); };
    document.getElementById('g2-back2').onclick = showMenu;
  }

  return { init };
})();
