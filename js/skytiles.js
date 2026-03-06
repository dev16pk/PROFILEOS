/* ============================================
   Sky Tiles  --  Star Wars 3D Space Runway
   Tiles sit FLAT on a perspective runway,
   ship flies between lanes, hyperspace streaks
   ============================================ */

const SkyTiles = (() => {
  /* ---------- constants ---------- */
  const COLS       = 4;
  const MAX_LIVES  = 3;
  const BASE_SPEED = 2.4;
  const SPEED_INC  = 0.18;
  const SPAWN_BASE = 820;
  const SPAWN_MIN  = 320;
  const TILE_DEPTH = 0.12;       // how "long" a tile is in p-space

  const SABER = [
    { n:'Jedi', f:'#4499ff', g:'rgba(68,153,255,.7)',  d:'#1a4488' },
    { n:'Yoda', f:'#33dd66', g:'rgba(51,221,102,.7)',  d:'#116633' },
    { n:'Sith', f:'#ff3344', g:'rgba(255,51,68,.7)',   d:'#991122' },
    { n:'Mace', f:'#bb55ff', g:'rgba(187,85,255,.7)',  d:'#662299' }
  ];

  /* ---------- state ---------- */
  var canvas, ctx, W, H, loop, container;
  var tiles, stars, nebula, particles, streaks;
  var score, highScore, lives, speed, level, state;
  var lastT, spawnAcc, spawnIv;
  var combo, comboTimer, shakeT;
  var runwayScroll;                // scrolling ground lines offset
  var shipLane, shipX, shipTargetX;
  var resizeObs = null;
  var keyHandler = null;
  var orientHandler = null;
  var isLandscape = false;
  /* perspective anchors */
  var VP_Y, RW_TOP, RW_BOT, LW_NEAR;

  /* ===== public ===== */
  function init(el) {
    container = el;
    highScore = +(localStorage.getItem('skytiles_hi') || 0);
    showMenu();
  }

  /* =====================  MENU  ===================== */
  function showMenu() {
    halt();
    container.innerHTML =
      '<div class="st-menu"><div class="st-starfield" id="st-menu-stars"></div>' +
      '<div class="st-menu-content">' +
      '<div class="st-title">SKY TILES</div>' +
      '<div class="st-subtitle">A long time ago in a galaxy far, far away...</div>' +
      '<div class="st-highscore">HIGH SCORE: ' + highScore + '</div>' +
      '<button class="st-play-btn" id="st-play"><i class="fas fa-jedi"></i> START MISSION</button>' +
      '<div class="st-instructions">' +
      '<p><i class="fas fa-hand-pointer"></i> Tap / click tiles on the runway</p>' +
      '<p><i class="fas fa-keyboard"></i> Or press 1 2 3 4 / Arrow keys</p>' +
      '<p><i class="fas fa-shield-alt"></i> 3 shields - miss 3 tiles and it is over</p>' +
      '<p><i class="fas fa-bolt"></i> Speed increases as you rank up</p>' +
      '</div></div></div>';
    container.querySelector('#st-play').onclick = launch;
    seedMenuStars();
  }

  function seedMenuStars() {
    var el = document.getElementById('st-menu-stars');
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < 60; i++) {
      var s = document.createElement('div');
      s.className = 'st-star';
      s.style.left  = Math.random()*100+'%';
      s.style.top   = Math.random()*100+'%';
      s.style.animationDuration = (1+Math.random()*2)+'s';
      s.style.animationDelay    = Math.random()*2+'s';
      el.appendChild(s);
    }
  }

  /* ================  LAUNCH GAME  ================ */
  function launch() {
    container.innerHTML =
      '<div class="st-game-wrap">' +
      '<div class="st-hud">' +
        '<div class="st-hud-left"><span class="st-hud-label">SCORE</span>' +
          '<span class="st-hud-value" id="st-score">0</span></div>' +
        '<div class="st-hud-center"><span class="st-hud-label">RANK</span>' +
          '<span class="st-hud-value" id="st-level">1</span></div>' +
        '<div class="st-hud-right"><span class="st-hud-label">SHIELDS</span>' +
          '<span class="st-hud-value" id="st-lives">' +
          rep('<i class="fas fa-shield-alt st-shield-on"></i> ', MAX_LIVES) +
        '</span></div>' +
      '</div>' +
      '<canvas id="st-canvas"></canvas></div>';

    canvas = document.getElementById('st-canvas');
    ctx    = canvas.getContext('2d');
    measure();

    tiles = []; stars = []; nebula = []; particles = []; streaks = [];
    score = 0; lives = MAX_LIVES; speed = BASE_SPEED; level = 1;
    state = 'play'; spawnAcc = 0; spawnIv = SPAWN_BASE;
    combo = 0; comboTimer = 0; shakeT = 0; runwayScroll = 0;
    shipLane = 1; shipX = laneScreenX(1); shipTargetX = shipX;
    lastT = performance.now();

    makeStars(); makeNebula(); makeStreaks();

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('touchmove', function(e){ e.preventDefault(); }, { passive: false });

    keyHandler = function(e) { onKey(e); };
    document.addEventListener('keydown', keyHandler);

    // orientation change + resize
    orientHandler = function() { setTimeout(function(){ if(state==='play') onResize(); }, 150); };
    window.addEventListener('orientationchange', orientHandler);

    if (resizeObs) resizeObs.disconnect();
    resizeObs = new ResizeObserver(function() { if (state==='play') onResize(); });
    resizeObs.observe(canvas.parentElement);

    loop = requestAnimationFrame(tick);
  }

  /* ============  MEASUREMENT / PERSPECTIVE  ============ */
  function measure() {
    var wr = canvas.parentElement;
    W = wr.clientWidth;  H = wr.clientHeight - 44;
    canvas.width = W;   canvas.height = H;
    isLandscape = W > H * 1.3;
    // in landscape: push runway higher, use narrower lanes to fit
    VP_Y    = H * (isLandscape ? 0.08 : 0.15);
    RW_TOP  = H * (isLandscape ? 0.10 : 0.18);
    RW_BOT  = H * (isLandscape ? 0.95 : 0.93);
    LW_NEAR = (isLandscape ? Math.min(W*0.14, 80) : W * 0.22);
  }

  function onResize() {
    var oW = W, oH = H; measure();
    var sx = W/oW, sy = H/oH;
    for (var i=0;i<stars.length;i++) { stars[i].x*=sx; stars[i].y*=sy; }
    for (var i=0;i<nebula.length;i++) { nebula[i].x*=sx; nebula[i].y*=sy; }
    shipX = laneScreenX(shipLane); shipTargetX = shipX;
  }

  /* --- core 3D helpers --- */
  // p: 0 (horizon) .. 1 (bottom)   returns screen-Y
  function pToY(p) {
    var t = p * p;                // quadratic depth curve
    return RW_TOP + t * (RW_BOT - RW_TOP);
  }
  // at a given screen-Y, how wide is one lane?
  function laneWAtY(y) {
    var frac = (y - RW_TOP) / (RW_BOT - RW_TOP);
    return mix(LW_NEAR * 0.06, LW_NEAR, Math.sqrt(Math.max(0,frac)));
  }
  // total runway half-width at screen-Y
  function rwHalfW(y) { return laneWAtY(y) * COLS * 0.5; }
  // screen X center of a lane at a given Y
  function laneCX(col, y) {
    var lw = laneWAtY(y);
    return W/2 - (COLS * lw)/2 + (col + 0.5) * lw;
  }
  // ship target X from lane index (at bottom of runway)
  function laneScreenX(col) { return laneCX(col, RW_BOT); }

  function mix(a,b,t) { return a+(b-a)*t; }

  /* ============  BACKGROUND OBJECTS  ============ */
  function makeStars() {
    stars = [];
    for (var i=0;i<140;i++) {
      stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.6+0.3,
        sp: Math.random()*0.5+0.08,
        a: Math.random()*0.6+0.3,
        layer: Math.floor(Math.random()*3)
      });
    }
  }
  function makeNebula() {
    nebula = [];
    var cols = [
      'rgba(200,60,20,.1)','rgba(255,120,30,.07)','rgba(180,40,10,.09)',
      'rgba(60,10,80,.06)','rgba(100,20,60,.07)','rgba(200,100,20,.05)'
    ];
    for (var i=0;i<14;i++)
      nebula.push({ x:Math.random()*W, y:Math.random()*H*0.6,
        r:50+Math.random()*100, c:cols[i%cols.length],
        dx:(Math.random()-0.5)*0.12, dy:Math.random()*0.04+0.01 });
  }
  function makeStreaks() {
    streaks = [];
    for (var i=0;i<30;i++)
      streaks.push({
        x: Math.random()*W, y: Math.random()*H,
        len: 6+Math.random()*18, sp: 3+Math.random()*6,
        a: Math.random()*0.25+0.05
      });
  }

  /* ============  GAME LOOP  ============ */
  function tick(t) {
    if (state !== 'play') return;
    var dt = Math.min(t - lastT, 50);
    lastT = t;
    spawnAcc += dt;
    if (spawnAcc >= spawnIv) { spawnAcc -= spawnIv; spawnTile(); }
    update(dt);
    draw();
    loop = requestAnimationFrame(tick);
  }

  /* ============  SPAWN  ============ */
  function spawnTile() {
    var col = Math.floor(Math.random()*COLS);
    // prevent overlap at horizon
    for (var i=0;i<tiles.length;i++)
      if (tiles[i].col===col && tiles[i].p < 0.12) return;
    tiles.push({ col:col, p:-0.04, color:SABER[Math.floor(Math.random()*SABER.length)],
                 alive:true, flash:0 });
  }

  /* ============  UPDATE  ============ */
  function update(dt) {
    var f = dt / 16;   // normalize to ~60fps frame
    var spd = speed * f;

    // --- runway scroll (ground markings moving toward player) ---
    runwayScroll += spd * 0.013;
    if (runwayScroll > 1) runwayScroll -= 1;

    // --- stars parallax ---
    for (var i=0;i<stars.length;i++) {
      var s = stars[i];
      var m = s.layer===0?0.25:s.layer===1?0.6:1.1;
      s.y += s.sp * m * (speed/BASE_SPEED) * f;
      if (s.y > H) { s.y = -2; s.x = Math.random()*W; }
    }
    // --- nebula ---
    for (var i=0;i<nebula.length;i++) {
      var n = nebula[i];
      n.x += n.dx; n.y += n.dy * (speed/BASE_SPEED);
      if (n.y>H*0.65) { n.y=-n.r; n.x=Math.random()*W; }
      if (n.x<-n.r) n.x=W+n.r; if (n.x>W+n.r) n.x=-n.r;
    }
    // --- hyperspace streaks ---
    var streakMul = Math.min(3, speed / BASE_SPEED);
    for (var i=0;i<streaks.length;i++) {
      var sk = streaks[i];
      sk.y += sk.sp * streakMul * f;
      if (sk.y > H+sk.len) { sk.y=-sk.len; sk.x=Math.random()*W; }
    }

    // --- tiles (progress 0..1 along runway) ---
    for (var i=tiles.length-1;i>=0;i--) {
      var t = tiles[i];
      if (!t.alive) { t.flash-=dt*0.004; if(t.flash<=0) tiles.splice(i,1); continue; }
      t.p += spd * 0.012;
      if (t.p > 1.08) { tiles.splice(i,1); loseShield(); }
    }

    // --- particles ---
    for (var i=particles.length-1;i>=0;i--) {
      var p = particles[i];
      p.x+=p.vx*f; p.y+=p.vy*f; p.life-=dt*0.003;
      if (p.life<=0) particles.splice(i,1);
    }

    // --- ship slide toward target lane ---
    var dx = shipTargetX - shipX;
    shipX += dx * Math.min(1, 0.18 * f * 3);
    if (Math.abs(dx)<0.5) shipX = shipTargetX;

    // --- combo decay ---
    if (comboTimer > 0) { comboTimer -= dt; if(comboTimer<=0) combo=0; }
    // --- shake decay ---
    if (shakeT > 0) shakeT -= dt;

    // --- level up ---
    var nl = Math.floor(score/8)+1;
    if (nl>level) {
      level = nl;
      speed = BASE_SPEED + (level-1)*SPEED_INC;
      spawnIv = Math.max(SPAWN_MIN, SPAWN_BASE - (level-1)*45);
      hud();
    }
  }

  /* ============  DRAW  ============ */
  function draw() {
    ctx.save();
    // screen shake
    if (shakeT > 0) {
      var mag = Math.min(6, shakeT * 0.015);
      ctx.translate((Math.random()-0.5)*mag, (Math.random()-0.5)*mag);
    }

    // --- deep space background ---
    var bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#020510'); bg.addColorStop(0.35,'#080a1a'); bg.addColorStop(1,'#04060e');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // --- nebula ---
    for (var i=0;i<nebula.length;i++) {
      var n = nebula[i];
      var ng = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
      ng.addColorStop(0,n.c); ng.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = ng; ctx.fillRect(n.x-n.r,n.y-n.r,n.r*2,n.r*2);
    }

    // --- stars ---
    for (var i=0;i<stars.length;i++) {
      var s = stars[i]; ctx.globalAlpha = s.a;
      ctx.fillStyle = s.layer===2?'#aaccff':s.layer===1?'#fff':'#ffddaa';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // --- hyperspace streaks ---
    var streakMul = Math.min(3, speed / BASE_SPEED);
    for (var i=0;i<streaks.length;i++) {
      var sk = streaks[i];
      ctx.globalAlpha = sk.a * streakMul * 0.5;
      ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sk.x,sk.y);
      ctx.lineTo(sk.x, sk.y - sk.len * streakMul);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // --- 3D RUNWAY ---
    drawRunway();

    // --- TILES (sorted far-first) ---
    var sorted = tiles.slice().sort(function(a,b){return a.p-b.p;});
    for (var i=0;i<sorted.length;i++) drawTile(sorted[i]);

    // --- particles ---
    for (var i=0;i<particles.length;i++) {
      var p = particles[i]; ctx.globalAlpha = Math.max(0,p.life);
      ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1; ctx.shadowBlur=0;

    // --- ship ---
    drawShip();

    // --- combo pop-up ---
    if (combo >= 2 && comboTimer > 0) drawCombo();

    // --- vignette ---
    drawVignette();

    ctx.restore();
  }

  /* --------  RUNWAY  -------- */
  function drawRunway() {
    var cx = W/2;
    // top & bottom half-widths
    var hwTop = rwHalfW(RW_TOP);
    var hwBot = rwHalfW(RW_BOT);

    // fill
    ctx.beginPath();
    ctx.moveTo(cx-hwTop, RW_TOP); ctx.lineTo(cx+hwTop, RW_TOP);
    ctx.lineTo(cx+hwBot, RW_BOT); ctx.lineTo(cx-hwBot, RW_BOT);
    ctx.closePath();
    var rf = ctx.createLinearGradient(0,RW_TOP,0,RW_BOT);
    rf.addColorStop(0,'rgba(15,18,30,.55)');
    rf.addColorStop(0.5,'rgba(22,28,45,.7)');
    rf.addColorStop(1,'rgba(30,38,55,.85)');
    ctx.fillStyle = rf; ctx.fill();

    // clip runway for inner lines
    ctx.save(); ctx.clip();

    // --- scrolling horizontal grid lines ---
    var totalLines = 20;
    for (var i=0;i<totalLines;i++) {
      var rawP = (i/totalLines + runwayScroll) % 1.0;
      var y  = pToY(rawP);
      var hw = rwHalfW(y);
      var alpha = rawP * rawP * 0.18;        // brighter near bottom
      ctx.beginPath(); ctx.moveTo(cx-hw,y); ctx.lineTo(cx+hw,y);
      ctx.strokeStyle = 'rgba(80,140,255,' + alpha + ')';
      ctx.lineWidth = 1; ctx.stroke();
    }

    // --- lane dividers ---
    for (var c=0;c<=COLS;c++) {
      var topX = laneCX(c-0.5, RW_TOP);   // edge between lanes
      var botX = laneCX(c-0.5, RW_BOT);
      var isEdge = (c===0||c===COLS);
      ctx.beginPath(); ctx.moveTo(topX, RW_TOP); ctx.lineTo(botX, RW_BOT);
      ctx.strokeStyle = isEdge ? 'rgba(100,180,255,.3)' : 'rgba(80,140,255,.12)';
      ctx.lineWidth   = isEdge ? 2 : 1;
      ctx.stroke();
    }

    ctx.restore();   // end clip

    // --- edge rail glow ---
    for (var side=-1;side<=1;side+=2) {
      var grd = ctx.createLinearGradient(0,RW_TOP,0,RW_BOT);
      grd.addColorStop(0,'rgba(80,160,255,0)');
      grd.addColorStop(0.4,'rgba(80,160,255,.18)');
      grd.addColorStop(1,'rgba(80,160,255,.35)');
      var topEdge = cx + side * hwTop;
      var botEdge = cx + side * hwBot;
      ctx.beginPath(); ctx.moveTo(topEdge, RW_TOP); ctx.lineTo(botEdge, RW_BOT);
      ctx.strokeStyle = grd; ctx.lineWidth = 2.5; ctx.stroke();
    }

    // --- danger zone glow at bottom ---
    var dg = ctx.createLinearGradient(0,RW_BOT-28,0,RW_BOT);
    dg.addColorStop(0,'rgba(255,50,50,0)'); dg.addColorStop(1,'rgba(255,50,50,.15)');
    ctx.fillStyle = dg; ctx.fillRect(cx-hwBot, RW_BOT-28, hwBot*2, 28);
  }

  /* --------  TILE (trapezoid sitting on runway)  -------- */
  function drawTile(t) {
    if (t.p < 0) return;
    var pFront = Math.min(t.p, 1.0);
    var pBack  = Math.max(pFront - TILE_DEPTH, 0);

    var yF = pToY(pFront);         // front (closer to player = bigger)
    var yB = pToY(pBack);          // back  (further = smaller)
    var lwF = laneWAtY(yF);
    var lwB = laneWAtY(yB);
    var cxF = laneCX(t.col, yF);
    var cxB = laneCX(t.col, yB);

    var pad = 3;             // small gap between lanes
    var wF = lwF - pad*2;
    var wB = lwB - pad*2;

    // flash on hit
    if (!t.alive) {
      ctx.globalAlpha = Math.max(0, t.flash);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = t.color.g; ctx.shadowBlur = 30;
      trapezoid(cxB-wB/2, yB, wB, cxF-wF/2, yF, wF);
      ctx.fill(); ctx.shadowBlur=0; ctx.globalAlpha=1;
      return;
    }

    var depth = pFront * pFront;   // 0..1 how close

    // outer glow
    ctx.shadowColor = t.color.g;
    ctx.shadowBlur  = 6 + 16 * depth;

    // gradient fill (dim at back, bright at front)
    var tg = ctx.createLinearGradient(0, yB, 0, yF);
    tg.addColorStop(0, t.color.d); tg.addColorStop(1, t.color.f);
    ctx.fillStyle = tg;
    trapezoid(cxB-wB/2, yB, wB, cxF-wF/2, yF, wF);
    ctx.fill();

    // border
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.12 + 0.22*depth) + ')';
    ctx.lineWidth = 1; ctx.stroke();
    ctx.shadowBlur = 0;

    // lightsaber core stripe (vertical center)
    var sw = Math.max(1, 2.5 * depth);
    ctx.fillStyle = 'rgba(255,255,255,' + (0.18 + 0.18*depth) + ')';
    ctx.fillRect((cxB+cxF)/2 - sw/2, yB + (yF-yB)*0.12, sw, (yF-yB)*0.76);

    // top sheen
    ctx.fillStyle = 'rgba(255,255,255,' + (0.06 + 0.06*depth) + ')';
    var sheenH = (yF - yB) * 0.3;
    trapezoid(cxB-wB/2, yB, wB, mix(cxB-wB/2, cxF-wF/2, 0.3), yB+sheenH, mix(wB,wF,0.3));
    ctx.fill();

    // pulse animation for tiles close to bottom
    if (depth > 0.6) {
      var pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.008);
      ctx.fillStyle = 'rgba(255,255,255,' + (pulse * 0.06) + ')';
      trapezoid(cxB-wB/2, yB, wB, cxF-wF/2, yF, wF);
      ctx.fill();
    }
  }

  function trapezoid(x1,y1,w1, x2,y2,w2) {
    ctx.beginPath();
    ctx.moveTo(x1,     y1);
    ctx.lineTo(x1+w1,  y1);
    ctx.lineTo(x2+w2,  y2);
    ctx.lineTo(x2,     y2);
    ctx.closePath();
  }

  /* --------  SHIP  -------- */
  function drawShip() {
    var bx = shipX;
    var by = RW_BOT + 2;
    var sw = Math.max(18, W * 0.055);
    var sh = sw * 0.8;

    // shadow under ship
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath();
    ctx.ellipse(bx, by+3, sw*0.8, sw*0.15, 0, 0, Math.PI*2);
    ctx.fill();

    // wings
    ctx.fillStyle = '#2a3852';
    ctx.beginPath();
    ctx.moveTo(bx - sw*1.1, by + 2);
    ctx.lineTo(bx - sw*0.3, by - sh*0.3);
    ctx.lineTo(bx - sw*0.25,by + 1);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bx + sw*1.1, by + 2);
    ctx.lineTo(bx + sw*0.3, by - sh*0.3);
    ctx.lineTo(bx + sw*0.25,by + 1);
    ctx.closePath(); ctx.fill();

    // body
    ctx.fillStyle = '#3a4a6a';
    ctx.beginPath();
    ctx.moveTo(bx,            by - sh);
    ctx.lineTo(bx + sw*0.35,  by - sh*0.15);
    ctx.lineTo(bx + sw*0.25,  by + 2);
    ctx.lineTo(bx - sw*0.25,  by + 2);
    ctx.lineTo(bx - sw*0.35,  by - sh*0.15);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(100,180,255,.35)'; ctx.lineWidth = 1; ctx.stroke();

    // cockpit dome
    ctx.fillStyle = '#6688cc';
    ctx.beginPath();
    ctx.ellipse(bx, by - sh*0.55, sw*0.13, sw*0.1, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.15)';
    ctx.beginPath();
    ctx.ellipse(bx - sw*0.03, by - sh*0.6, sw*0.05, sw*0.04, -0.4, 0, Math.PI*2);
    ctx.fill();

    // engine glow
    ctx.shadowColor = 'rgba(255,100,20,.9)'; ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(255,140,50,.7)';
    ctx.beginPath(); ctx.ellipse(bx - sw*0.18, by+3, sw*0.09, sw*0.04, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx + sw*0.18, by+3, sw*0.09, sw*0.04, 0, 0, Math.PI*2); ctx.fill();
    // bright core
    ctx.fillStyle = 'rgba(255,220,120,.9)';
    ctx.beginPath(); ctx.ellipse(bx - sw*0.18, by+3, sw*0.04, sw*0.02, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx + sw*0.18, by+3, sw*0.04, sw*0.02, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // wing-tip lights
    var blink = Math.sin(performance.now()*0.006) > 0;
    if (blink) {
      ctx.fillStyle = '#ff3333'; ctx.shadowColor = '#ff3333'; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(bx - sw*1.05, by+2, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#33ff33'; ctx.shadowColor = '#33ff33';
      ctx.beginPath(); ctx.arc(bx + sw*1.05, by+2, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  /* --------  COMBO  -------- */
  function drawCombo() {
    var alpha = Math.min(1, comboTimer / 400);
    ctx.globalAlpha = alpha;
    ctx.font = 'bold ' + Math.min(24, 14 + combo*2) + 'px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffe81f';
    ctx.shadowColor = 'rgba(255,232,31,.6)'; ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText(combo + 'x COMBO', W/2, RW_TOP - 8);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.textAlign = 'start';
  }

  /* --------  VIGNETTE  -------- */
  function drawVignette() {
    var vg = ctx.createRadialGradient(W/2,H*0.55,H*0.2, W/2,H*0.55,H*0.9);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.4)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,W,H);
  }

  /* ============  INPUT  ============ */
  function onClick(e) {
    var rc = canvas.getBoundingClientRect();
    handlePointer(e.clientX - rc.left, e.clientY - rc.top);
  }
  function onTouch(e) {
    e.preventDefault();
    var rc = canvas.getBoundingClientRect();
    for (var i=0;i<e.changedTouches.length;i++)
      handlePointer(e.changedTouches[i].clientX - rc.left, e.changedTouches[i].clientY - rc.top);
  }

  function onKey(e) {
    if (state !== 'play') return;
    var lane = -1;
    // 1-4 number keys
    if (e.key==='1'||e.key==='2'||e.key==='3'||e.key==='4')
      lane = parseInt(e.key) - 1;
    // arrow / WASD
    if (e.key==='ArrowLeft' || e.key==='a' || e.key==='A')
      lane = Math.max(0, shipLane - 1);
    if (e.key==='ArrowRight'|| e.key==='d' || e.key==='D')
      lane = Math.min(COLS-1, shipLane + 1);
    if (lane < 0) return;
    e.preventDefault();
    hitLane(lane);
  }

  function handlePointer(mx, my) {
    if (state !== 'play') return;
    // find closest alive tile under pointer
    var best = null, bestDist = Infinity;
    for (var i=0;i<tiles.length;i++) {
      var t = tiles[i];
      if (!t.alive || t.p < 0.06) continue;
      // build the trapezoid corners for this tile
      var pF = Math.min(t.p,1), pB = Math.max(pF-TILE_DEPTH,0);
      var yF = pToY(pF), yB = pToY(pB);
      var lwF = laneWAtY(yF), lwB = laneWAtY(yB);
      var cxF = laneCX(t.col,yF), cxB = laneCX(t.col,yB);
      var pad = 3;

      // point-in-trapezoid: simple AABB first, then precise
      if (my < yB - 4 || my > yF + 4) continue;
      var frac = (yF===yB) ? 0.5 : (my-yB)/(yF-yB);
      var lx = mix(cxB - (lwB-pad*2)/2, cxF - (lwF-pad*2)/2, frac);
      var rx = mix(cxB + (lwB-pad*2)/2, cxF + (lwF-pad*2)/2, frac);
      if (mx < lx - 6 || mx > rx + 6) continue;

      var dcx = mx - mix(cxB,cxF,0.5), dcy = my - (yB+yF)/2;
      var dist = dcx*dcx + dcy*dcy;
      if (dist < bestDist) { bestDist = dist; best = t; }
    }
    if (best) {
      clearTile(best);
      return;
    }
    // even if no tile hit, move ship to the tapped lane
    for (var c=0;c<COLS;c++) {
      var cx = laneCX(c, RW_BOT);
      if (Math.abs(mx - cx) < laneWAtY(RW_BOT) * 0.55) {
        shipLane = c; shipTargetX = laneScreenX(c); break;
      }
    }
  }

  function hitLane(lane) {
    // find the closest alive tile in that lane
    var best = null, bestP = -1;
    for (var i=0;i<tiles.length;i++) {
      var t = tiles[i];
      if (t.alive && t.col === lane && t.p > 0.06 && t.p > bestP)
        { best = t; bestP = t.p; }
    }
    shipLane = lane; shipTargetX = laneScreenX(lane);
    if (best) clearTile(best);
  }

  function clearTile(t) {
    t.alive = false; t.flash = 1;
    // combo
    combo++; comboTimer = 1200;
    var pts = 1 + Math.floor(combo / 3);
    score += pts;
    // move ship to tile lane
    shipLane = t.col; shipTargetX = laneScreenX(t.col);
    hud();
    // explosion at tile front face
    var yF = pToY(Math.min(t.p,1));
    var cx = laneCX(t.col, yF);
    boom(cx, yF, t.color);
  }

  function boom(px, py, color) {
    var count = 16 + combo * 2;
    for (var i=0;i<count;i++) {
      var ang = Math.random()*Math.PI*2;
      var spd = 1.5+Math.random()*4;
      particles.push({
        x:px, y:py, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd - 1,
        r:1.5+Math.random()*3.5, life:1,
        c: i%3===0 ? '#ffffff' : i%3===1 ? color.f : '#ffe81f'
      });
    }
  }

  /* ============  SHIELDS / GAME OVER  ============ */
  function loseShield() {
    lives--; combo = 0; comboTimer = 0;
    shakeT = 300;     // screen shake
    hud();
    if (lives <= 0) endGame();
  }

  function endGame() {
    state = 'over';
    cancelAnimationFrame(loop);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('skytiles_hi', String(highScore));
    }
    container.innerHTML =
      '<div class="st-menu"><div class="st-starfield" id="st-menu-stars"></div>' +
      '<div class="st-menu-content">' +
      '<div class="st-gameover-title">MISSION FAILED</div>' +
      '<div class="st-score-final"><div class="st-final-label">SCORE</div>' +
        '<div class="st-final-value">' + score + '</div></div>' +
      '<div class="st-score-final st-hi"><div class="st-final-label">HIGH SCORE</div>' +
        '<div class="st-final-value">' + highScore + '</div></div>' +
      (score >= highScore && score > 0 ?
        '<div class="st-new-record"><i class="fas fa-jedi"></i> NEW RECORD!</div>' : '') +
      '<div class="st-final-stats">' +
        'Rank ' + level + '  |  ' + score + ' tile' + (score!==1?'s':'') + ' cleared</div>' +
      '<button class="st-play-btn" id="st-retry"><i class="fas fa-redo"></i> RETRY MISSION</button>' +
      '<button class="st-menu-btn" id="st-back-menu"><i class="fas fa-home"></i> MAIN MENU</button>' +
      '</div></div>';
    container.querySelector('#st-retry').onclick = launch;
    container.querySelector('#st-back-menu').onclick = function(){ showMenu(); };
    seedMenuStars();
  }

  /* ============  HUD  ============ */
  function hud() {
    var se = document.getElementById('st-score');
    var le = document.getElementById('st-level');
    var li = document.getElementById('st-lives');
    if (se) se.textContent = score;
    if (le) le.textContent = level;
    if (li) li.innerHTML =
      rep('<i class="fas fa-shield-alt st-shield-on"></i> ', lives) +
      rep('<i class="fas fa-shield-alt st-shield-off"></i> ', MAX_LIVES - lives);
  }

  /* ============  CLEANUP  ============ */
  function halt() {
    state = 'stopped';
    if (loop) cancelAnimationFrame(loop);
    if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
    if (canvas) {
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onTouch);
    }
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
    if (orientHandler) { window.removeEventListener('orientationchange', orientHandler); orientHandler = null; }
  }

  function rep(s,n) { var o=''; for(var i=0;i<n;i++) o+=s; return o; }

  return { init: init };
})();
