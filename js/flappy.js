/* ============================================
   Flappy Neon — The Viral Flapper
   ============================================ */

const FlappyNeon = (() => {
  let canvas, ctx, W, H, container;
  let bird, pipes, particles, stars;
  let score, highScore, state, loop, lastT;
  let frameCount = 0;
  let keyHandler = null;
  let usedTouch = false;

  const GRAVITY = 0.35;
  const FLAP = -6.2;
  const PIPE_GAP = 130;
  const PIPE_WIDTH = 44;
  const PIPE_SPEED_BASE = 2.2;
  const PIPE_SPAWN_DIST = 200;

  function init(el) {
    container = el;
    highScore = +(localStorage.getItem('flappy_hi') || 0);
    showMenu();
  }

  function showMenu() {
    halt();
    container.innerHTML = `
      <div class="gs-menu" style="background:#050d18">
        <div class="gs-menu-inner">
          <div class="gs-menu-icon" style="color:#22c55e"><i class="fas fa-dove"></i></div>
          <h2 style="color:#22c55e;font-family:var(--font-pixel);font-size:1.1rem;text-shadow:0 0 20px rgba(34,197,94,.5)">FLAPPY NEON</h2>
          <p style="color:#4ade80;font-size:.7rem;margin:.5rem 0 1rem;opacity:.7">Tap to fly. Don't hit the pipes.</p>
          <div style="color:#22c55e;font-family:var(--font-mono);font-size:.75rem;margin-bottom:1rem;opacity:.8">HIGH SCORE: ${highScore}</div>
          <button class="gs-play-btn" style="--btn-color:#22c55e" id="fl-play"><i class="fas fa-play"></i> FLY</button>
          <div class="gs-instructions">
            <p><i class="fas fa-hand-pointer"></i> Click / Tap / SPACE to flap</p>
            <p><i class="fas fa-mountain"></i> Navigate through pipe gaps</p>
            <p><i class="fas fa-bolt"></i> Speed increases over time</p>
          </div>
        </div>
      </div>`;
    container.querySelector('#fl-play').onclick = launch;
  }

  function halt() {
    if (loop) cancelAnimationFrame(loop);
    loop = null;
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
    usedTouch = false;
  }

  function launch() {
    container.innerHTML = `
      <div class="gs-game-inner">
        <div class="gs-hud" style="justify-content:center">
          <div><span class="gs-hud-label">SCORE</span><span class="gs-hud-val" id="fl-score" style="font-size:1.2rem">0</span></div>
        </div>
        <canvas id="fl-canvas"></canvas>
      </div>`;

    canvas = document.getElementById('fl-canvas');
    ctx = canvas.getContext('2d');
    measure();

    bird = { x: W * 0.25, y: H * 0.45, vy: 0, r: 12, angle: 0 };
    pipes = []; particles = []; stars = [];
    score = 0; state = 'play'; frameCount = 0;
    lastT = performance.now();

    for (let i = 0; i < 60; i++)
      stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.2+0.3, a: Math.random()*0.4+0.15 });

    // Spawn initial pipes
    for (let i = 0; i < 4; i++) addPipe(W + 100 + i * PIPE_SPAWN_DIST);

    keyHandler = (e) => {
      if (state === 'dead' && (e.key === ' ' || e.key === 'Enter')) { showMenu(); return; }
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
    };
    document.addEventListener('keydown', keyHandler);

    canvas.addEventListener('click', () => { if (!usedTouch) flap(); });
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      usedTouch = true;
      if (state === 'dead') { showMenu(); return; }
      flap();
    }, {passive: false});

    loop = requestAnimationFrame(tick);
  }

  function measure() {
    const wr = canvas.parentElement;
    W = wr.clientWidth; H = wr.clientHeight - 40;
    canvas.width = W; canvas.height = H;
  }

  function flap() {
    if (state !== 'play') return;
    bird.vy = FLAP;
    // Trail particles
    for (let i = 0; i < 4; i++)
      particles.push({
        x: bird.x - 8, y: bird.y + (Math.random()-0.5)*6,
        vx: -1.5 - Math.random(), vy: (Math.random()-0.5)*1.5,
        life: 1, r: 2 + Math.random()*2, c: '#22c55e'
      });
  }

  function addPipe(x) {
    const minGapY = 60;
    const maxGapY = H - PIPE_GAP - 60;
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);
    pipes.push({ x, gapY, scored: false });
  }

  function pipeSpeed() {
    return PIPE_SPEED_BASE + Math.min(score * 0.05, 2.5);
  }

  function tick(t) {
    if (state !== 'play') return;
    const dt = Math.min(t - lastT, 40);
    lastT = t;
    frameCount++;
    update(dt);
    if (state !== 'play') return;
    draw();
    loop = requestAnimationFrame(tick);
  }

  function update(dt) {
    const f = dt / 16;
    const spd = pipeSpeed();

    // Bird physics
    bird.vy += GRAVITY * f;
    bird.y += bird.vy * f;
    bird.angle = Math.min(Math.PI/4, Math.max(-Math.PI/4, bird.vy * 0.06));

    // Ceiling / floor
    if (bird.y - bird.r < 0) { bird.y = bird.r; bird.vy = 0; }
    if (bird.y + bird.r > H) { die(); return; }

    // Pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= spd * f;

      // Score
      if (!p.scored && p.x + PIPE_WIDTH < bird.x) {
        p.scored = true;
        score++;
        if (score > highScore) { highScore = score; localStorage.setItem('flappy_hi', highScore); }
        hudUpdate();
      }

      // Remove off-screen
      if (p.x + PIPE_WIDTH < -10) {
        pipes.splice(i, 1);
        continue;
      }

      // Collision
      if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_WIDTH) {
        if (bird.y - bird.r < p.gapY || bird.y + bird.r > p.gapY + PIPE_GAP) {
          die(); return;
        }
      }
    }

    // Spawn new pipes
    const lastPipe = pipes[pipes.length - 1];
    if (lastPipe && lastPipe.x < W - PIPE_SPAWN_DIST) addPipe(W + 20);

    // Particles
    for (let i = particles.length-1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * f; p.y += p.vy * f; p.life -= 0.035;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Stars scroll
    stars.forEach(s => { s.x -= spd * 0.15 * f; if (s.x < 0) { s.x = W; s.y = Math.random()*H; } });
  }

  function die() {
    state = 'dead';
    // Explosion
    for (let i = 0; i < 15; i++)
      particles.push({
        x: bird.x, y: bird.y,
        vx: (Math.random()-0.5)*6, vy: (Math.random()-0.5)*6,
        life: 1, r: 2+Math.random()*3, c: i%2===0 ? '#ef4444' : '#f97316'
      });
    drawGameOver();
  }

  function hudUpdate() {
    const s = document.getElementById('fl-score'); if (s) s.textContent = score;
  }

  function draw() {
    // Sky gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#020810'); bg.addColorStop(0.5, '#050d18'); bg.addColorStop(1, '#081020');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      ctx.globalAlpha = s.a;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Ground line
    ctx.strokeStyle = 'rgba(34,197,94,.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H-1); ctx.lineTo(W, H-1); ctx.stroke();

    // Pipes
    pipes.forEach(p => {
      drawPipe(p.x, 0, PIPE_WIDTH, p.gapY); // top
      drawPipe(p.x, p.gapY + PIPE_GAP, PIPE_WIDTH, H - p.gapY - PIPE_GAP); // bottom
    });

    // Particles (behind bird)
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.shadowColor = p.c; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    // Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.angle);
    // Body
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(0, 0, bird.r, 0, Math.PI * 2); ctx.fill();
    // Eye
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(bird.r * 0.35, -bird.r * 0.25, bird.r * 0.28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#020810';
    ctx.beginPath(); ctx.arc(bird.r * 0.45, -bird.r * 0.25, bird.r * 0.14, 0, Math.PI*2); ctx.fill();
    // Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(bird.r * 0.7, 0);
    ctx.lineTo(bird.r * 1.3, bird.r * 0.15);
    ctx.lineTo(bird.r * 0.7, bird.r * 0.35);
    ctx.closePath();
    ctx.fill();
    // Wing
    const wingAngle = Math.sin(frameCount * 0.15) * 0.3;
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(-bird.r * 0.2, bird.r * 0.1 + wingAngle * 5, bird.r * 0.7, bird.r * 0.35, wingAngle - 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function drawPipe(x, y, w, h) {
    if (h <= 0) return;
    const pg = ctx.createLinearGradient(x, 0, x + w, 0);
    pg.addColorStop(0, '#065f46'); pg.addColorStop(0.3, '#059669'); pg.addColorStop(0.7, '#059669'); pg.addColorStop(1, '#065f46');
    ctx.fillStyle = pg;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.fillRect(x, y, w, h);
    // Pipe cap
    const capH = 8;
    if (y > 0) { // bottom pipe → cap on top
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x - 3, y, w + 6, capH);
    } else { // top pipe → cap on bottom
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x - 3, y + h - capH, w + 6, capH);
    }
    // Edge highlight
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.fillRect(x + 3, y, 4, h);
    ctx.shadowBlur = 0;
  }

  function drawGameOver() {
    draw();
    ctx.fillStyle = 'rgba(0,0,0,.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 22px "Press Start 2P", monospace';
    ctx.fillText('GAME OVER', W/2, H/2 - 35);
    ctx.fillStyle = '#22c55e';
    ctx.font = '16px "Fira Code", monospace';
    ctx.fillText('Score: ' + score, W/2, H/2 + 5);
    if (score >= highScore && score > 0) {
      ctx.fillStyle = '#eab308';
      ctx.font = '11px "Fira Code", monospace';
      ctx.fillText('★ NEW HIGH SCORE ★', W/2, H/2 + 30);
    }
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "Fira Code", monospace';
    ctx.fillText('Press SPACE or ENTER to continue', W/2, H/2 + 55);
    ctx.textAlign = 'start';
  }

  return { init };
})();
