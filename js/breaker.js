/* ============================================
   Brick Breaker — Neon Breakout Game
   ============================================ */

const BrickBreaker = (() => {
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
  let paddle, ball, bricks, particles;
  let score, highScore, lives, level, state, loop, lastT;
  let keyHandler = null, keyUpHandler = null;
  let keys = {};

  const BRICK_COLORS = ['#ec4899','#f472b6','#a855f7','#8b5cf6','#6366f1','#818cf8','#06b6d4','#22d3ee'];
  const ROWS = 5;
  const COLS = 8;

  function init(el) {
    container = el;
    highScore = +(localStorage.getItem('breaker_hi') || 0);
    showMenu();
  }

  function showMenu() {
    halt();
    container.innerHTML = `
      <div class="gs-menu" style="background:#1a050f">
        <div class="gs-menu-inner">
          <div class="gs-menu-icon" style="color:#ec4899"><i class="fas fa-table-cells"></i></div>
          <h2 style="color:#ec4899;font-family:var(--font-pixel);font-size:1.1rem;text-shadow:0 0 20px rgba(236,72,153,.5)">BRICK BREAKER</h2>
          <p style="color:#f472b6;font-size:.7rem;margin:.5rem 0 1rem;opacity:.7">Smash all the neon bricks!</p>
          <div style="color:#ec4899;font-family:var(--font-mono);font-size:.75rem;margin-bottom:1rem;opacity:.8">HIGH SCORE: ${highScore}</div>
          <button class="gs-play-btn" style="--btn-color:#ec4899" id="bb-play"><i class="fas fa-play"></i> START</button>
          <div class="gs-instructions">
            <p><i class="fas fa-arrows-left-right"></i> Arrow keys / A-D / Mouse to move paddle</p>
            <p><i class="fas fa-circle"></i> Bounce the ball to break bricks</p>
            <p><i class="fas fa-heart"></i> 3 lives — don't let the ball fall!</p>
          </div>
        </div>
      </div>`;
    container.querySelector('#bb-play').onclick = launch;
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
          <div><span class="gs-hud-label">SCORE</span><span class="gs-hud-val" id="bb-score">0</span></div>
          <div><span class="gs-hud-label">LIVES</span><span class="gs-hud-val" id="bb-lives">❤❤❤</span></div>
          <div><span class="gs-hud-label">LEVEL</span><span class="gs-hud-val" id="bb-level">1</span></div>
        </div>
        <canvas id="bb-canvas"></canvas>
      </div>`;

    canvas = document.getElementById('bb-canvas');
    ctx = canvas.getContext('2d');
    measure();

    score = 0; lives = 3; level = 1; state = 'play';
    particles = [];
    lastT = performance.now();
    initLevel();

    keyHandler = (e) => { keys[e.key.toLowerCase()] = true; if (['arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault(); };
    keyUpHandler = (e) => { keys[e.key.toLowerCase()] = false; };
    document.addEventListener('keydown', keyHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Mouse control
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      paddle.x = e.clientX - rect.left - paddle.w / 2;
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
    });

    // Touch control
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      paddle.x = e.touches[0].clientX - rect.left - paddle.w / 2;
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
    }, {passive: false});

    loop = requestAnimationFrame(tick);
  }

  function measure() {
    const wr = canvas.parentElement;
    W = wr.clientWidth; H = wr.clientHeight - 40;
    canvas.width = W; canvas.height = H;
  }

  function initLevel() {
    paddle = { x: W/2 - 40, y: H - 30, w: 80, h: 10 };
    ball = { x: W/2, y: H - 45, vx: 2.5 + level * 0.3, vy: -(3 + level * 0.2), r: 5 };

    bricks = [];
    const brickW = (W - 20) / COLS;
    const brickH = 18;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        bricks.push({
          x: 10 + c * brickW,
          y: 50 + r * (brickH + 4),
          w: brickW - 4,
          h: brickH,
          color: BRICK_COLORS[r % BRICK_COLORS.length],
          hits: r < 2 ? 2 : 1,
          alive: true
        });
      }
    }
  }

  function tick(t) {
    if (state !== 'play') return;
    const dt = Math.min(t - lastT, 50);
    lastT = t;
    update(dt);
    draw();
    loop = requestAnimationFrame(tick);
  }

  function update(dt) {
    const f = dt / 16;

    // Paddle keyboard movement
    if (keys['arrowleft'] || keys['a']) paddle.x -= 6 * f;
    if (keys['arrowright'] || keys['d']) paddle.x += 6 * f;
    paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));

    // Ball movement
    ball.x += ball.vx * f;
    ball.y += ball.vy * f;

    // Wall bounces
    if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
    if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }
    if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }

    // Ball falls below
    if (ball.y > H + 20) {
      lives--;
      hudUpdate();
      if (lives <= 0) { state = 'dead'; drawGameOver(); return; }
      ball = { x: paddle.x + paddle.w/2, y: H - 45, vx: 2.5 + level*0.3, vy: -(3 + level*0.2), r: 5 };
    }

    // Paddle bounce
    if (ball.vy > 0 &&
        ball.y + ball.r >= paddle.y &&
        ball.y + ball.r <= paddle.y + paddle.h + 4 &&
        ball.x >= paddle.x - ball.r &&
        ball.x <= paddle.x + paddle.w + ball.r) {
      ball.vy = -Math.abs(ball.vy);
      // Angle based on hit position
      const hitPos = (ball.x - paddle.x) / paddle.w; // 0..1
      ball.vx = (hitPos - 0.5) * 6;
      ball.y = paddle.y - ball.r;
      // Ensure minimum vertical speed so ball doesn't go horizontal
      const minVy = 2.5;
      if (Math.abs(ball.vy) < minVy) ball.vy = -minVy;
      // Slight speed increase
      const spd = Math.hypot(ball.vx, ball.vy);
      const maxSpd = 7 + level;
      if (spd > maxSpd) { ball.vx *= maxSpd/spd; ball.vy *= maxSpd/spd; }
    }

    // Brick collision
    for (let i = bricks.length - 1; i >= 0; i--) {
      const b = bricks[i];
      if (!b.alive) continue;
      if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
          ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
        b.hits--;
        if (b.hits <= 0) {
          b.alive = false;
          score += 10 * level;
          if (score > highScore) { highScore = score; localStorage.setItem('breaker_hi', highScore); }
          // Particles
          for (let k = 0; k < 6; k++) {
            particles.push({
              x: b.x + b.w/2, y: b.y + b.h/2,
              vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
              life: 1, r: 2+Math.random()*2, c: b.color
            });
          }
        }
        // Determine bounce direction
        const overlapX = Math.min(ball.x + ball.r - b.x, b.x + b.w - (ball.x - ball.r));
        const overlapY = Math.min(ball.y + ball.r - b.y, b.y + b.h - (ball.y - ball.r));
        if (overlapX < overlapY) ball.vx = -ball.vx;
        else ball.vy = -ball.vy;
        hudUpdate();
        break;
      }
    }

    // Particles
    for (let i = particles.length-1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * f; p.y += p.vy * f; p.life -= 0.03;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Check level clear
    if (bricks.every(b => !b.alive)) {
      level++;
      initLevel();
      hudUpdate();
    }
  }

  function hudUpdate() {
    const s = document.getElementById('bb-score'); if (s) s.textContent = score;
    const l = document.getElementById('bb-lives'); if (l) l.textContent = '❤'.repeat(Math.max(0, lives));
    const lv = document.getElementById('bb-level'); if (lv) lv.textContent = level;
  }

  function draw() {
    // Background
    ctx.fillStyle = '#1a050f';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(236,72,153,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Bricks
    bricks.forEach(b => {
      if (!b.alive) return;
      const alpha = b.hits > 1 ? 0.6 : 1;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, b.h, 3);
      ctx.fill();
      // Inner highlight
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(b.x + 2, b.y + 1, b.w - 4, b.h * 0.4);
      if (b.hits > 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Paddle
    const pg = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.w, 0);
    pg.addColorStop(0, '#ec4899'); pg.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = pg;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 5);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    // Ball trail
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(ball.x - ball.vx*1.5, ball.y - ball.vy*1.5, ball.r*0.7, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(ball.x - ball.vx*3, ball.y - ball.vy*3, ball.r*0.4, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Particles
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawGameOver() {
    draw();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W/2, H/2 - 20);
    ctx.fillStyle = '#ec4899';
    ctx.font = '14px "Fira Code", monospace';
    ctx.fillText(`Score: ${score}  |  Level: ${level}`, W/2, H/2 + 20);
    ctx.fillStyle = '#f472b6';
    ctx.font = '11px "Fira Code", monospace';
    ctx.fillText('Press SPACE or ENTER to continue', W/2, H/2 + 50);
    ctx.fillText('(or tap screen)', W/2, H/2 + 65);

    // Clean up existing key handlers before adding game-over handler
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); document.removeEventListener('keyup', keyUpHandler); }
    keyHandler = null; keyUpHandler = null;
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        showMenu();
      }
    };
    document.addEventListener('keydown', handler);
    keyHandler = handler;

    // Touch to restart
    canvas.addEventListener('touchstart', function touchRestart(e) {
      e.preventDefault();
      canvas.removeEventListener('touchstart', touchRestart);
      if (keyHandler === handler) { document.removeEventListener('keydown', handler); keyHandler = null; }
      showMenu();
    }, {passive: false});
  }

  return { init };
})();
