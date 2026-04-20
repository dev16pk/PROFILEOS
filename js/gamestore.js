/* ============================================
   Game Store — Launcher hub for all games
   ============================================ */

const GameStore = (() => {
  const GAMES = [
    {
      id: 'skytiles',
      title: 'Sky Tiles',
      subtitle: 'Star Wars Runway Runner',
      desc: 'Tap tiles on a 3D perspective runway as they fly toward you. Speed increases with rank.',
      icon: 'fa-jedi',
      color: '#ffe81f',
      gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      tags: ['Rhythm', 'Arcade'],
      engine: 'Canvas 2D'
    },
    {
      id: 'tetris',
      title: 'Tetris Neon',
      subtitle: 'The Legendary Block Puzzle',
      desc: 'Stack and clear lines with falling tetrominoes. The most iconic puzzle game ever made.',
      icon: 'fa-shapes',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #0e0620, #1a0a35)',
      tags: ['Puzzle', 'Classic'],
      engine: 'Canvas 2D'
    },
    {
      id: 'flappy',
      title: 'Flappy Neon',
      subtitle: 'The Viral Flapper',
      desc: 'Tap to fly through pipe gaps. One-button gameplay, endlessly addictive.',
      icon: 'fa-dove',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #020810, #081020)',
      tags: ['Arcade', 'Viral'],
      engine: 'Canvas 2D'
    },
    {
      id: 'game2048',
      title: '2048 Mesh',
      subtitle: 'Number Fusion Puzzle',
      desc: 'Slide tiles to merge numbers. Reach 2048 to win — or keep going for a higher score.',
      icon: 'fa-cubes',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #0a1a2e, #0d2540)',
      tags: ['Puzzle', 'Strategy'],
      engine: 'DOM'
    },
    {
      id: 'breaker',
      title: 'Brick Breaker',
      subtitle: 'Neon Breakout',
      desc: 'Smash neon bricks with a bouncing ball. Power-ups, combos, and increasing speed.',
      icon: 'fa-table-cells',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #2e0a1a, #3d1028)',
      tags: ['Arcade', 'Classic'],
      engine: 'Canvas 2D'
    }
  ];

  function init(container) {
    renderStore(container);
  }

  function renderStore(container) {
    container.innerHTML = `
      <div class="gs-store">
        <div class="gs-header">
          <div class="gs-header-left">
            <i class="fas fa-gamepad gs-header-icon"></i>
            <div>
              <h2 class="gs-title">Game Store</h2>
              <p class="gs-subtitle">${GAMES.length} games available</p>
            </div>
          </div>
        </div>
        <div class="gs-grid">
          ${GAMES.map(g => `
            <div class="gs-card" data-game="${g.id}" style="--card-accent:${g.color}">
              <div class="gs-card-banner" style="background:${g.gradient}">
                <i class="fas ${g.icon} gs-card-icon" style="color:${g.color}"></i>
              </div>
              <div class="gs-card-body">
                <h3 class="gs-card-title">${g.title}</h3>
                <p class="gs-card-sub">${g.subtitle}</p>
                <p class="gs-card-desc">${g.desc}</p>
                <div class="gs-card-tags">
                  ${g.tags.map(t => `<span class="gs-tag">${t}</span>`).join('')}
                  <span class="gs-engine">${g.engine}</span>
                </div>
                <button class="gs-launch-btn" data-game="${g.id}">
                  <i class="fas fa-play"></i> Launch
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;

    container.querySelectorAll('.gs-launch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        launchGame(btn.dataset.game, container);
      });
    });
    container.querySelectorAll('.gs-card').forEach(card => {
      card.addEventListener('click', () => {
        launchGame(card.dataset.game, container);
      });
    });
  }

  function launchGame(gameId, container) {
    container.innerHTML = `
      <div class="gs-game-wrap">
        <div class="gs-game-topbar">
          <button class="gs-back-btn" id="gs-back"><i class="fas fa-arrow-left"></i> Back to Store</button>
          <span class="gs-game-label">${GAMES.find(g => g.id === gameId)?.title || gameId}</span>
        </div>
        <div class="gs-game-container" id="gs-game-container"></div>
      </div>`;

    const gameContainer = document.getElementById('gs-game-container');
    document.getElementById('gs-back').onclick = () => renderStore(container);

    switch (gameId) {
      case 'skytiles':
        gameContainer.innerHTML = '<div class="st-container"></div>';
        SkyTiles.init(gameContainer.querySelector('.st-container'));
        break;
      case 'tetris':
        TetrisNeon.init(gameContainer);
        break;
      case 'flappy':
        FlappyNeon.init(gameContainer);
        break;
      case 'game2048':
        Game2048.init(gameContainer);
        break;
      case 'breaker':
        BrickBreaker.init(gameContainer);
        break;
    }
  }

  return { init };
})();
