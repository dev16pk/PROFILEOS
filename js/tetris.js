/* ============================================
   Tetris Neon — The Classic Block Puzzle
   ============================================ */

const TetrisNeon = (() => {
  // roundRect polyfill for older browsers / mobile Safari < 16
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      if (typeof r === 'number') r = [r];
      const rad = r[0] || 0;
      this.moveTo(x + rad, y);
      this.arcTo(x + w, y, x + w, y + h, rad);
      this.arcTo(x + w, y + h, x, y + h, rad);
      this.arcTo(x, y + h, x, y, rad);
      this.arcTo(x, y, x + w, y, rad);
      this.closePath();
    };
  }

  let canvas, ctx, W, H, container;
  let board, piece, nextPiece, ghostY;
  let score, highScore, linesCleared, level, state, loop, lastT, dropAcc, dropIv;
  let keyHandler = null, keyUpHandler = null;
  let keys = {};
  let dasTimer = 0, dasDir = 0, dasActive = false;
  let flashRows = [], flashTimer = 0;
  const DAS_DELAY = 170, DAS_REPEAT = 50;

  const COLS = 10, ROWS = 20;
  const PIECES = [
    { shape: [[1,1,1,1]], color: '#06b6d4', glow: 'rgba(6,182,212,.5)' },           // I
    { shape: [[1,1],[1,1]], color: '#eab308', glow: 'rgba(234,179,8,.5)' },           // O
    { shape: [[0,1,0],[1,1,1]], color: '#a855f7', glow: 'rgba(168,85,247,.5)' },      // T
    { shape: [[1,0,0],[1,1,1]], color: '#f97316', glow: 'rgba(249,115,22,.5)' },      // L
    { shape: [[0,0,1],[1,1,1]], color: '#3b82f6', glow: 'rgba(59,130,246,.5)' },      // J
    { shape: [[0,1,1],[1,1,0]], color: '#22c55e', glow: 'rgba(34,197,94,.5)' },       // S
    { shape: [[1,1,0],[0,1,1]], color: '#ef4444', glow: 'rgba(239,68,68,.5)' }        // Z
  ];

  let cellSize, boardX, boardY;

  function init(el) {
    container = el;
    highScore = +(localStorage.getItem('tetris_hi') || 0);
    showMenu();
  }

  function showMenu() {
    halt();
    container.innerHTML = `
      <div class="gs-menu" style="background:#06080e">
        <div class="gs-menu-inner">
          <div class="gs-menu-icon" style="color:#a855f7"><i class="fas fa-shapes"></i></div>
          <h2 style="color:#a855f7;font-family:var(--font-pixel);font-size:1.1rem;text-shadow:0 0 20px rgba(168,85,247,.5)">TETRIS NEON</h2>
          <p style="color:#c084fc;font-size:.7rem;margin:.5rem 0 1rem;opacity:.7">The legendary block puzzle.</p>
          <div style="color:#a855f7;font-family:var(--font-mono);font-size:.75rem;margin-bottom:1rem;opacity:.8">HIGH SCORE: ${highScore}</div>
          <button class="gs-play-btn" style="--btn-color:#a855f7" id="tt-play"><i class="fas fa-play"></i> PLAY</button>
          <div class="gs-instructions">
            <p><i class="fas fa-arrows-left-right"></i> ← → Move  |  ↑ Rotate</p>
            <p><i class="fas fa-arrow-down"></i> ↓ Soft drop  |  SPACE Hard drop</p>
            <p><i class="fas fa-layer-group"></i> Clear lines to score and level up</p>
          </div>
        </div>
      </div>`;
    container.querySelector('#tt-play').onclick = launch;
  }

  function halt() {
    if (loop) cancelAnimationFrame(loop);
    loop = null;
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); document.removeEventListener('keyup', keyUpHandler); }
    keyHandler = null; keyUpHandler = null;
    keys = {};
  }

  function launch() {
    container.innerHTML = `
      <div class="gs-game-inner">
        <div class="gs-hud">
          <div><span class="gs-hud-label">SCORE</span><span class="gs-hud-val" id="tt-score">0</span></div>
          <div><span class="gs-hud-label">LINES</span><span class="gs-hud-val" id="tt-lines">0</span></div>
          <div><span class="gs-hud-label">LEVEL</span><span class="gs-hud-val" id="tt-level">1</span></div>
        </div>
        <canvas id="tt-canvas"></canvas>
      </div>`;

    canvas = document.getElementById('tt-canvas');
    ctx = canvas.getContext('2d');
    measure();

    board = Array.from({length: ROWS}, () => Array(COLS).fill(null));
    score = 0; linesCleared = 0; level = 1; state = 'play';
    dropAcc = 0; dropIv = 1000;
    dasTimer = 0; dasDir = 0; dasActive = false;
    flashRows = []; flashTimer = 0;
    piece = spawnPiece();
    nextPiece = spawnPiece();
    lastT = performance.now();

    keyHandler = (e) => {
      const k = e.key;
      if (state === 'dead') { if (k === ' ' || k === 'Enter') showMenu(); return; }
      if (state !== 'play') return;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(k)) e.preventDefault();
      if (k === 'ArrowLeft' && !keys['ArrowLeft']) { movePiece(-1, 0); dasDir = -1; dasTimer = 0; dasActive = false; }
      if (k === 'ArrowRight' && !keys['ArrowRight']) { movePiece(1, 0); dasDir = 1; dasTimer = 0; dasActive = false; }
      if (k === 'ArrowUp') rotatePiece();
      if (k === 'ArrowDown') { if (movePiece(0, 1)) { score += 1; dropAcc = 0; } }
      if (k === ' ') hardDrop();
      keys[k] = true;
    };
    keyUpHandler = (e) => {
      keys[e.key] = false;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { dasDir = 0; dasActive = false; }
    };
    document.addEventListener('keydown', keyHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Touch controls
    let touchX = 0, touchY = 0, touchMoved = false;
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (state === 'dead') { showMenu(); return; }
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      touchMoved = false;
    }, {passive: false});
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - touchX;
      const dy = e.touches[0].clientY - touchY;
      if (Math.abs(dx) > cellSize * 0.8) {
        movePiece(dx > 0 ? 1 : -1, 0);
        touchX = e.touches[0].clientX;
        touchMoved = true;
      }
      if (dy > cellSize * 0.8) {
        if (movePiece(0, 1)) { score += 1; dropAcc = 0; }
        touchY = e.touches[0].clientY;
        touchMoved = true;
      }
    }, {passive: false});
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (!touchMoved) {
        const tx = e.changedTouches[0].clientX;
        const rect = canvas.getBoundingClientRect();
        if (tx - rect.left > W * 0.65) rotatePiece();
        else if (tx - rect.left < W * 0.35) rotatePiece();
        else hardDrop();
      }
    });

    loop = requestAnimationFrame(tick);
  }

  function measure() {
    const wr = canvas.parentElement;
    W = wr.clientWidth; H = wr.clientHeight - 40;
    canvas.width = W; canvas.height = H;
    cellSize = Math.max(8, Math.floor(Math.min((H - 20) / ROWS, (W - 40) / COLS)));
    boardX = Math.floor((W - cellSize * COLS) / 2);
    boardY = Math.floor((H - cellSize * ROWS) / 2);
  }

  function spawnPiece() {
    const tmpl = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: tmpl.shape.map(r => [...r]),
      color: tmpl.color,
      glow: tmpl.glow,
      x: Math.floor((COLS - tmpl.shape[0].length) / 2),
      y: 0
    };
  }

  function collides(shape, px, py) {
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++)
        if (shape[r][c]) {
          const nx = px + c, ny = py + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && board[ny][nx]) return true;
        }
    return false;
  }

  function movePiece(dx, dy) {
    if (!collides(piece.shape, piece.x + dx, piece.y + dy)) {
      piece.x += dx; piece.y += dy;
      return true;
    }
    return false;
  }

  function rotatePiece() {
    const s = piece.shape;
    const rows = s.length, cols = s[0].length;
    const rotated = Array.from({length: cols}, (_, c) =>
      Array.from({length: rows}, (_, r) => s[rows - 1 - r][c])
    );
    // Wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!collides(rotated, piece.x + kick, piece.y)) {
        piece.shape = rotated;
        piece.x += kick;
        return;
      }
    }
  }

  function hardDrop() {
    let dropped = 0;
    while (!collides(piece.shape, piece.x, piece.y + 1)) {
      piece.y++;
      dropped++;
    }
    score += dropped * 2;
    lockPiece();
    if (state !== 'play') return;
  }

  function getGhostY() {
    let gy = piece.y;
    while (!collides(piece.shape, piece.x, gy + 1)) gy++;
    return gy;
  }

  function lockPiece() {
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c]) {
          const by = piece.y + r;
          if (by < 0) { state = 'dead'; drawGameOver(); return; }
          board[by][piece.x + c] = piece.color;
        }
    clearLines();
    piece = nextPiece;
    nextPiece = spawnPiece();
    dropAcc = 0;
    if (collides(piece.shape, piece.x, piece.y)) {
      state = 'dead';
      drawGameOver();
    }
  }

  function clearLines() {
    let cleared = 0;
    let clearedRows = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every(c => c !== null)) {
        clearedRows.push(r);
        cleared++;
      }
    }
    if (cleared > 0) {
      // Flash effect before removing
      flashRows = clearedRows;
      flashTimer = 1;
      // Actually remove after recording
      for (let i = clearedRows.length - 1; i >= 0; i--) {
        board.splice(clearedRows[i], 1);
        board.unshift(Array(COLS).fill(null));
      }
      const pts = [0, 100, 300, 500, 800];
      score += (pts[cleared] || 800) * level;
      linesCleared += cleared;
      level = Math.floor(linesCleared / 10) + 1;
      dropIv = Math.max(80, 1000 - (level - 1) * 80);
      if (score > highScore) { highScore = score; localStorage.setItem('tetris_hi', highScore); }
      hudUpdate();
    }
  }

  function hudUpdate() {
    const s = document.getElementById('tt-score'); if (s) s.textContent = score;
    const l = document.getElementById('tt-lines'); if (l) l.textContent = linesCleared;
    const lv = document.getElementById('tt-level'); if (lv) lv.textContent = level;
  }

  function tick(t) {
    if (state !== 'play') return;
    const dt = Math.min(t - lastT, 50);
    lastT = t;

    // DAS (Delayed Auto Shift)
    if (dasDir !== 0 && keys[dasDir === -1 ? 'ArrowLeft' : 'ArrowRight']) {
      dasTimer += dt;
      if (!dasActive && dasTimer >= DAS_DELAY) { dasActive = true; dasTimer = 0; }
      if (dasActive && dasTimer >= DAS_REPEAT) { movePiece(dasDir, 0); dasTimer = 0; }
    }

    // Gravity
    dropAcc += dt;
    if (dropAcc >= dropIv) {
      dropAcc -= dropIv;
      if (!movePiece(0, 1)) {
        lockPiece();
        if (state !== 'play') return; // game over was triggered — don't overwrite it
      }
    }

    // Flash decay
    if (flashTimer > 0) flashTimer -= dt * 0.004;

    draw();
    hudUpdate();
    loop = requestAnimationFrame(tick);
  }

  function draw() {
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, W, H);

    // Board border
    ctx.strokeStyle = 'rgba(168,85,247,.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(boardX - 2, boardY - 2, cellSize * COLS + 4, cellSize * ROWS + 4);

    // Grid
    ctx.strokeStyle = 'rgba(168,85,247,.04)';
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(boardX + c*cellSize, boardY); ctx.lineTo(boardX + c*cellSize, boardY + ROWS*cellSize); ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(boardX, boardY + r*cellSize); ctx.lineTo(boardX + COLS*cellSize, boardY + r*cellSize); ctx.stroke();
    }

    // Locked blocks
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (board[r][c]) drawCell(boardX + c*cellSize, boardY + r*cellSize, board[r][c], 1);

    // Line clear flash
    if (flashTimer > 0) {
      ctx.globalAlpha = Math.max(0, flashTimer) * 0.6;
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 20;
      for (let i = 0; i < flashRows.length; i++) {
        // Flash across the full board width at the cleared row positions
        const fy = boardY + flashRows[i] * cellSize;
        ctx.fillRect(boardX, fy, cellSize * COLS, cellSize);
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // Ghost piece
    if (state === 'play' && piece) {
      const gy = getGhostY();
      for (let r = 0; r < piece.shape.length; r++)
        for (let c = 0; c < piece.shape[r].length; c++)
          if (piece.shape[r][c]) {
            const x = boardX + (piece.x + c) * cellSize;
            const y = boardY + (gy + r) * cellSize;
            ctx.strokeStyle = piece.color;
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            ctx.globalAlpha = 1;
          }

      // Active piece
      for (let r = 0; r < piece.shape.length; r++)
        for (let c = 0; c < piece.shape[r].length; c++)
          if (piece.shape[r][c])
            drawCell(boardX + (piece.x + c)*cellSize, boardY + (piece.y + r)*cellSize, piece.color, 1);
    }

    // Next piece preview
    drawNext();
  }

  function drawCell(x, y, color, alpha) {
    const pad = 1;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.roundRect(x + pad, y + pad, cellSize - pad*2, cellSize - pad*2, 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,.15)';
    ctx.fillRect(x + pad + 1, y + pad + 1, cellSize - pad*2 - 2, (cellSize - pad*2) * 0.35);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function drawNext() {
    if (!nextPiece) return;
    const nx = boardX + COLS * cellSize + 15;
    const ny = boardY + 10;
    ctx.fillStyle = 'rgba(168,85,247,.15)';
    ctx.font = '9px "Fira Code", monospace';
    ctx.fillText('NEXT', nx, ny);
    const s = nextPiece.shape;
    const previewCell = Math.min(cellSize * 0.7, 14);
    for (let r = 0; r < s.length; r++)
      for (let c = 0; c < s[r].length; c++)
        if (s[r][c]) {
          ctx.fillStyle = nextPiece.color;
          ctx.shadowColor = nextPiece.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.roundRect(nx + c * previewCell, ny + 8 + r * previewCell, previewCell - 1, previewCell - 1, 1);
          ctx.fill();
        }
    ctx.shadowBlur = 0;
  }

  function drawGameOver() {
    draw();
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px "Press Start 2P", monospace';
    ctx.fillText('GAME OVER', W/2, H/2 - 30);
    ctx.fillStyle = '#a855f7';
    ctx.font = '13px "Fira Code", monospace';
    ctx.fillText('Score: ' + score + '  |  Lines: ' + linesCleared, W/2, H/2 + 10);
    if (score >= highScore) {
      ctx.fillStyle = '#eab308';
      ctx.font = '11px "Fira Code", monospace';
      ctx.fillText('★ NEW HIGH SCORE ★', W/2, H/2 + 35);
    }
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "Fira Code", monospace';
    ctx.fillText('Press SPACE or ENTER to continue', W/2, H/2 + 60);
    ctx.textAlign = 'start';
  }

  return { init };
})();
