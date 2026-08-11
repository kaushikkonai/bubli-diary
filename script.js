// ================= CONFIG & PERSONAL LETTER =================
const LETTER_TEXT = `Mandrita (Bubli),

I don't really know how to put into words how much you mean to me, but I wanted to try anyway.

Thank you for being exactly who you are — for your sky blue obsession, your crazy love for cats and dogs, the 5:00 AM football match screams, the endless JEE backlog rants, and every late night text that made my day brighter.

You survived every study stress, every overthinking session, and every struggle. Today you turn 18, officially an adult! But no matter how grown up you get, you'll always be my favorite person to love, my bestie, my girlfriend, and my whole heart.

Happy 18th Birthday, Mana. Here's to us, forever.

— Kaushik 💙`;

// ================= PAGE NAVIGATION SYSTEM =================
const pages = Array.from(document.querySelectorAll('.page'));
let current = 0;
const total = pages.length;

const progressFill = document.getElementById('progressFill');
const pageCounter = document.getElementById('pageCounter');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');
const dotNav = document.getElementById('dotNav');

// Generate Floating Navigation Dots
for (let i = 0; i < total; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i >= 17 ? ' romantic' : '');
  dot.title = `Page ${i + 1}`;
  dot.addEventListener('click', () => goTo(i, i > current ? 'next' : 'prev'));
  dotNav.appendChild(dot);
}
const dots = Array.from(dotNav.children);

function updateChrome() {
  progressFill.style.width = (((current + 1) / total) * 100) + '%';
  pageCounter.textContent = (current + 1) + ' / ' + total;
  navPrev.classList.toggle('disabled', current === 0);
  navNext.classList.toggle('disabled', current === total - 1);
  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  // Trigger typewriter on Page 22
  if (current === 22) startTypewriter();
  // Init current game canvas if on game page
  initGameForPage(current);
}

let isFlipping = false;

function goTo(index, dir) {
  if (isFlipping || index < 0 || index >= total || index === current) return;
  isFlipping = true;

  const outPage = pages[current];
  const inPage = pages[index];

  outPage.classList.remove('active');
  outPage.classList.add(dir === 'next' ? 'turn-out-next' : 'turn-out-prev');

  inPage.classList.add('active');
  inPage.classList.add(dir === 'next' ? 'turn-in-next' : 'turn-in-prev');

  let finished = false;
  const resetGuard = () => {
    if (finished) return;
    finished = true;
    outPage.classList.remove('turn-out-next', 'turn-out-prev', 'active');
    inPage.classList.remove('turn-in-next', 'turn-in-prev');
    inPage.removeEventListener('animationend', resetGuard);
    isFlipping = false;
  };

  inPage.addEventListener('animationend', resetGuard, { once: true });
  setTimeout(resetGuard, 580);

  current = index;
  updateChrome();
}

navNext.addEventListener('click', () => goTo(current + 1, 'next'));
navPrev.addEventListener('click', () => goTo(current - 1, 'prev'));

// Touch Swipe Navigation
let touchX = 0;
document.getElementById('book').addEventListener('touchstart', e => touchX = e.changedTouches[0].clientX);
document.getElementById('book').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) < 50) return;
  if (dx < 0) goTo(current + 1, 'next'); else goTo(current - 1, 'prev');
});

document.getElementById('openBtn').addEventListener('click', () => goTo(1, 'next'));
document.getElementById('replayBtn').addEventListener('click', () => goTo(0, 'prev'));
pages[0].classList.add('active');

// ================= BACKGROUND MUSIC SYNTHESIZER =================
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

const musicToggleBtn = document.getElementById('musicToggle');
musicToggleBtn.addEventListener('click', () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  isMusicPlaying = !isMusicPlaying;
  musicToggleBtn.classList.toggle('playing', isMusicPlaying);
  musicToggleBtn.querySelector('.music-text').textContent = isMusicPlaying ? 'Music: ON 🎵' : 'Music: OFF';

  if (isMusicPlaying) startAcousticLullaby(); else stopAcousticLullaby();
});

function playNote(freq, duration = 0.5, type = 'sine') {
  if (!audioCtx || !isMusicPlaying) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function startAcousticLullaby() {
  const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 329.63, 293.66]; // C E G C A F E D
  let step = 0;
  musicInterval = setInterval(() => {
    if (!isMusicPlaying) return;
    playNote(notes[step % notes.length], 0.8, 'triangle');
    step++;
  }, 600);
}

function stopAcousticLullaby() {
  if (musicInterval) clearInterval(musicInterval);
}

// Sound Synthesizers for Pets
document.getElementById('purrBtn').addEventListener('click', () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  playNote(400, 0.2, 'sine');
  setTimeout(() => playNote(600, 0.3, 'sine'), 150);
});
document.getElementById('barkBtn').addEventListener('click', () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  playNote(220, 0.15, 'sawtooth');
  setTimeout(() => playNote(180, 0.2, 'sawtooth'), 120);
});

// ================= AMBIENT DOODLES =================
const ambient = document.getElementById('ambient');
const emojis = ['🐾', '💙', '🎈', '⭐', '🐱', '🎂', '✨', '⚽', '💍'];
for (let i = 0; i < 14; i++) {
  const s = document.createElement('span');
  s.textContent = emojis[i % emojis.length];
  s.style.left = Math.random() * 100 + 'vw';
  s.style.animationDuration = (10 + Math.random() * 10) + 's';
  s.style.animationDelay = (Math.random() * 10) + 's';
  s.style.fontSize = (14 + Math.random() * 14) + 'px';
  ambient.appendChild(s);
}

// ================= CONFETTI ENGINE =================
function confettiBurst(count = 40) {
  const colors = ['#38bdf8', '#f472b6', '#f59e0b', '#c084fc', '#4ade80'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      position:fixed;
      left:${Math.random() * 100}vw;
      top:-10px;
      width:${6 + Math.random() * 8}px;
      height:${10 + Math.random() * 12}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      opacity:${0.7 + Math.random() * 0.3};
      z-index:999;
      pointer-events:none;
      transform:rotate(${Math.random() * 360}deg);
      transition:transform 2.5s ease-out, top 2.5s ease-out, opacity 2.5s ease;
    `;
    document.body.appendChild(p);
    setTimeout(() => {
      p.style.top = (60 + Math.random() * 40) + 'vh';
      p.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 100}px)`;
      p.style.opacity = '0';
    }, 20);
    setTimeout(() => p.remove(), 2600);
  }
}

// ================= TYPEWRITER EFFECT =================
let typed = false;
function startTypewriter() {
  if (typed) return;
  typed = true;
  const el = document.getElementById('typewriterText');
  el.textContent = '';
  let idx = 0;
  const timer = setInterval(() => {
    el.textContent += LETTER_TEXT[idx];
    idx++;
    if (idx >= LETTER_TEXT.length) clearInterval(timer);
  }, 35);
}

// Movie Cards Flip Interaction
document.querySelectorAll('.movie-flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// 11:11 Clock Tap Interaction
document.getElementById('clock1111').addEventListener('click', () => {
  confettiBurst(50);
  document.getElementById('wishReveal').classList.remove('hidden');
});

// ================= 7 MINI-GAMES IMPLEMENTATION =================
let activeGameInit = {};

function initGameForPage(pageIdx) {
  if (activeGameInit[pageIdx]) return;
  activeGameInit[pageIdx] = true;

  if (pageIdx === 1) initCandleGame();
  if (pageIdx === 4) initBasketballGame();
  if (pageIdx === 8) initBalloonGame();
  if (pageIdx === 11) initPingPongGame();
  if (pageIdx === 15) initDartGame();
  if (pageIdx === 19) initStarlightGame();
  if (pageIdx === 23) initGiftGame();
}

// GAME 1: Candle Blower
function initCandleGame() {
  const cvs = document.getElementById('candleCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let flames = Array(18).fill(true);
  let blownCount = 0;

  function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    // Cake base
    ctx.fillStyle = '#fce7f3';
    ctx.fillRect(50, 160, 240, 70);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(40, 210, 260, 30);

    // 18 Candles in 2 rows
    for (let i = 0; i < 18; i++) {
      const row = i < 9 ? 0 : 1;
      const col = i % 9;
      const x = 70 + col * 24;
      const y = row === 0 ? 120 : 145;

      // Candle stick
      ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#f59e0b';
      ctx.fillRect(x, y, 8, 40);

      // Flame
      if (flames[i]) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x + 4, y - 6, 6 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(x + 4, y - 6, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function blow() {
    flames = flames.map(() => false);
    blownCount = 18;
    draw();
    confettiBurst(60);
    document.getElementById('candleStatus').textContent = 'All 18 Candles blown out! 🎉 Wish granted!';
    document.getElementById('candleNextBtn').classList.remove('hidden');
    document.getElementById('candleNextBtn').onclick = () => goTo(2, 'next');
  }

  cvs.addEventListener('click', blow);
  document.getElementById('blowBtn').addEventListener('click', blow);
  setInterval(draw, 100);
}

// GAME 2: Basketball Hoop Toss
function initBasketballGame() {
  const cvs = document.getElementById('basketballCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let score = 0;
  let ball = { x: 60, y: 220, vx: 0, vy: 0, isDragging: false, isShot: false };
  const hoop = { x: 270, y: 100, r: 24 };

  function resetBall() {
    ball.x = 60; ball.y = 220; ball.vx = 0; ball.vy = 0; ball.isShot = false;
  }

  cvs.addEventListener('mousedown', () => { if (!ball.isShot) ball.isDragging = true; });
  cvs.addEventListener('mousemove', (e) => {
    if (ball.isDragging) {
      const rect = cvs.getBoundingClientRect();
      ball.x = e.clientX - rect.left;
      ball.y = e.clientY - rect.top;
    }
  });
  cvs.addEventListener('mouseup', () => {
    if (ball.isDragging) {
      ball.isDragging = false;
      ball.isShot = true;
      ball.vx = (120 - ball.x) * 0.12;
      ball.vy = (240 - ball.y) * 0.14;
    }
  });

  function update() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    // Hoop
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(hoop.x, hoop.y, hoop.r, 0, Math.PI); ctx.stroke();

    if (ball.isShot) {
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vy += 0.4; // gravity

      // Score check
      if (Math.hypot(ball.x - hoop.x, ball.y - hoop.y) < hoop.r && ball.vy > 0) {
        score++;
        document.getElementById('hoopScore').textContent = `Baskets: ${score} / 3`;
        confettiBurst(25);
        if (score >= 3) {
          document.getElementById('hoopNextBtn').classList.remove('hidden');
          document.getElementById('hoopNextBtn').onclick = () => goTo(5, 'next');
        }
        resetBall();
      }
      if (ball.y > 280 || ball.x > 340) resetBall();
    }

    // Ball
    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, 14, 0, Math.PI * 2); ctx.fill();

    requestAnimationFrame(update);
  }
  update();
}

// GAME 3: Balloon Pop
function initBalloonGame() {
  const cvs = document.getElementById('balloonCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const words = ['18', 'Mana', 'Bubli', 'Khejur', 'Mimi', '🎉'];
  let balloons = words.map((word, i) => ({
    x: 50 + i * 48, y: 220 + Math.random() * 40, r: 20, word, popped: false, color: ['#38bdf8', '#f472b6', '#f59e0b', '#c084fc'][i % 4]
  }));
  let poppedCount = 0;

  cvs.addEventListener('click', (e) => {
    const rect = cvs.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    balloons.forEach(b => {
      if (!b.popped && Math.hypot(mx - b.x, my - b.y) < b.r + 10) {
        b.popped = true;
        poppedCount++;
        document.getElementById('balloonWordsFound').textContent = `Words found: ${poppedCount} / 6`;
        if (poppedCount >= 6) {
          confettiBurst(50);
          document.getElementById('balloonNextBtn').classList.remove('hidden');
          document.getElementById('balloonNextBtn').onclick = () => goTo(9, 'next');
        }
      }
    });
  });

  function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    balloons.forEach(b => {
      if (!b.popped) {
        b.y -= 0.6; if (b.y < -30) b.y = 280;
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '12px Outfit';
        ctx.fillText(b.word, b.x - 10, b.y + 4);
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// GAME 4: Ping Pong
function initPingPongGame() {
  const cvs = document.getElementById('pingpongCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let paddleX = 130;
  let ball = { x: 170, y: 200, vx: 3, vy: -3 };
  let blocks = [
    { x: 30, y: 40, w: 70, h: 20, alive: true },
    { x: 135, y: 40, w: 70, h: 20, alive: true },
    { x: 240, y: 40, w: 70, h: 20, alive: true },
    { x: 30, y: 75, w: 70, h: 20, alive: true },
    { x: 135, y: 75, w: 70, h: 20, alive: true },
    { x: 240, y: 75, w: 70, h: 20, alive: true }
  ];

  cvs.addEventListener('mousemove', e => {
    const rect = cvs.getBoundingClientRect();
    paddleX = e.clientX - rect.left - 40;
  });

  function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Paddle
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(paddleX, 250, 80, 12);

    // Ball
    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.x < 10 || ball.x > 330) ball.vx *= -1;
    if (ball.y < 10) ball.vy *= -1;
    if (ball.y > 240 && ball.x > paddleX && ball.x < paddleX + 80) ball.vy *= -1;
    if (ball.y > 280) { ball.x = 170; ball.y = 180; ball.vy = -3; }

    ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2); ctx.fill();

    // Blocks
    let remaining = 0;
    blocks.forEach(b => {
      if (b.alive) {
        remaining++;
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(b.x, b.y, b.w, b.h);
        if (ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
          b.alive = false; ball.vy *= -1;
        }
      }
    });

    document.getElementById('pingpongScore').textContent = `Blocks Left: ${remaining}`;
    if (remaining === 0) {
      document.getElementById('pingpongNextBtn').classList.remove('hidden');
      document.getElementById('pingpongNextBtn').onclick = () => goTo(12, 'next');
    } else {
      requestAnimationFrame(loop);
    }
  }
  loop();
}

// GAME 5: Dart Target
function initDartGame() {
  const cvs = document.getElementById('dartCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let hits = 0;
  let dart = { x: 170, y: 240, vx: 0, vy: 0, flying: false };

  cvs.addEventListener('click', () => {
    if (!dart.flying) {
      dart.flying = true;
      dart.vy = -7;
    }
  });

  function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Target Bullseye
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(170, 60, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(170, 60, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(170, 60, 10, 0, Math.PI * 2); ctx.fill();

    if (dart.flying) {
      dart.y += dart.vy;
      if (Math.hypot(dart.x - 170, dart.y - 60) < 25) {
        hits++;
        document.getElementById('dartScore').textContent = `Hits: ${hits} / 3`;
        confettiBurst(20);
        dart.flying = false; dart.y = 240;
        if (hits >= 3) {
          document.getElementById('dartNextBtn').classList.remove('hidden');
          document.getElementById('dartNextBtn').onclick = () => goTo(16, 'next');
        }
      }
      if (dart.y < 0) { dart.flying = false; dart.y = 240; }
    }

    // Dart
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(dart.x - 3, dart.y, 6, 20);

    requestAnimationFrame(loop);
  }
  loop();
}

// GAME 6: Starlight Constellation
function initStarlightGame() {
  const cvs = document.getElementById('starlightCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const stars = [
    { x: 170, y: 80 }, { x: 110, y: 120 }, { x: 230, y: 120 },
    { x: 130, y: 190 }, { x: 210, y: 190 }, { x: 170, y: 230 }
  ];
  let connected = [];

  cvs.addEventListener('click', e => {
    const rect = cvs.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    stars.forEach((s, idx) => {
      if (Math.hypot(mx - s.x, my - s.y) < 25) {
        if (!connected.includes(idx)) connected.push(idx);
        if (connected.length >= stars.length) {
          confettiBurst(40);
          document.getElementById('starlightNextBtn').classList.remove('hidden');
          document.getElementById('starlightNextBtn').onclick = () => goTo(20, 'next');
        }
      }
    });
  });

  function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Lines
    if (connected.length > 1) {
      ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 3;
      ctx.beginPath();
      connected.forEach((idx, i) => {
        const s = stars[idx];
        if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
      });
      ctx.stroke();
    }

    // Stars
    stars.forEach((s, i) => {
      ctx.fillStyle = connected.includes(i) ? '#f472b6' : '#fff';
      ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI * 2); ctx.fill();
    });

    requestAnimationFrame(loop);
  }
  loop();
}

// GAME 7: Unwrap Gift
function initGiftGame() {
  const cvs = document.getElementById('giftCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let unwrapped = false;

  cvs.addEventListener('click', () => {
    if (!unwrapped) {
      unwrapped = true;
      confettiBurst(70);
      document.getElementById('giftNextBtn').classList.remove('hidden');
      document.getElementById('giftNextBtn').onclick = () => goTo(24, 'next');
    }
  });

  function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    if (!unwrapped) {
      // Gift Box
      ctx.fillStyle = '#f472b6'; ctx.fillRect(100, 110, 140, 120);
      ctx.fillStyle = '#fb7185'; ctx.fillRect(90, 90, 160, 30);
      // Ribbon
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(160, 90, 20, 140);
    } else {
      // Opened Heart
      ctx.fillStyle = '#f472b6'; ctx.font = '50px Caveat';
      ctx.fillText('❤️ Happy 18th Birthday, Bubli!', 30, 150);
    }
    requestAnimationFrame(draw);
  }
  draw();
}
