// ================= CONFIG =================
// ✏️ EDIT THIS: your personal letter to Bubli. Keep line breaks with \n
const LETTER_TEXT = `Bubli,

I don't really know how to put this into words, but I wanted to try anyway.

Thank you for being exactly who you are — for the sky blue obsession, the momo cravings, the cute doodles, and every ordinary conversation that somehow never felt ordinary.

You're growing up today, but to me, you'll always be the same person who made me want to remember every little thing you said.

Happy 18th birthday, Bubli. Here's to everything ahead.

— Kaushik`;

// ================= PAGE NAVIGATION =================
const pages = Array.from(document.querySelectorAll('.page'));
let current = 0;
const total = pages.length;

const progressFill = document.getElementById('progressFill');
const pageCounter = document.getElementById('pageCounter');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');

function updateChrome(){
  progressFill.style.width = (((current+1)/total)*100) + '%';
  pageCounter.textContent = (current+1) + ' / ' + total;
  navPrev.classList.toggle('disabled', current===0);
  navNext.classList.toggle('disabled', current===total-1);
}

let isFlipping = false;

function goTo(index, dir){
  if(isFlipping || index<0 || index>=total || index===current) return;
  isFlipping = true;

  const outPage = pages[current];
  const inPage = pages[index];

  outPage.classList.remove('active');
  outPage.classList.add(dir==='next' ? 'turn-out-next' : 'turn-out-prev');

  inPage.classList.add('active');
  inPage.classList.add(dir==='next' ? 'turn-in-next' : 'turn-in-prev');

  let finished = false;
  const resetGuard = () => {
    if(finished) return;
    finished = true;
    outPage.classList.remove('turn-out-next','turn-out-prev','active');
    inPage.classList.remove('turn-in-next','turn-in-prev');
    inPage.removeEventListener('animationend', resetGuard);
    isFlipping = false;
  };

  inPage.addEventListener('animationend', resetGuard, { once: true });
  setTimeout(resetGuard, 580);

  current = index;
  updateChrome();

  if(current===11) startTypewriter();
}

navNext.addEventListener('click', ()=> goTo(current+1,'next'));
navPrev.addEventListener('click', ()=> goTo(current-1,'prev'));

// swipe support
let touchX=0;
document.getElementById('book').addEventListener('touchstart', e=> touchX=e.changedTouches[0].clientX);
document.getElementById('book').addEventListener('touchend', e=>{
  const dx = e.changedTouches[0].clientX - touchX;
  if(Math.abs(dx) < 50) return;
  if(dx < 0) goTo(current+1,'next'); else goTo(current-1,'prev');
});

document.getElementById('openBtn').addEventListener('click', ()=> goTo(1,'next'));
pages[0].classList.add('active');
updateChrome();

// ================= AMBIENT DOODLES =================
const ambient = document.getElementById('ambient');
const emojis = ['🐾','💙','🎈','⭐','🐱'];
for(let i=0;i<10;i++){
  const s = document.createElement('span');
  s.textContent = emojis[i % emojis.length];
  s.style.left = Math.random()*100 + 'vw';
  s.style.animationDuration = (10 + Math.random()*10) + 's';
  s.style.animationDelay = (Math.random()*10) + 's';
  s.style.fontSize = (14 + Math.random()*14) + 'px';
  ambient.appendChild(s);
}

// ================= CONFETTI =================
function confettiBurst(count=40){
  const colors = ['#8fc6e8','#f4a7c0','#e8a855','#c6a4e8','#a4e8c6'];
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='confetti-piece';
    p.style.left = Math.random()*100+'vw';
    p.style.width = p.style.height = (6+Math.random()*6)+'px';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(p);
    const duration = 1800 + Math.random()*1400;
    p.animate([
      {transform:`translateY(0) rotate(0deg)`, opacity:1},
      {transform:`translateY(${window.innerHeight+50}px) rotate(${360+Math.random()*360}deg)`, opacity:0.9}
    ], {duration, easing:'ease-in'});
    setTimeout(()=>p.remove(), duration);
  }
}

// ================= GAME 1: BLOW CANDLES =================
const candlesGroup = document.getElementById('candlesGroup');
const candleXs = [90,130,170,210];
let litCount = candleXs.length;
candleXs.forEach((x,i)=>{
  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('class','candle-flame');
  g.setAttribute('data-i', i);
  g.innerHTML = `
    <rect x="${x-4}" y="55" width="8" height="42" rx="2" fill="#fff6e5"/>
    <ellipse class="flame" cx="${x}" cy="50" rx="7" ry="12" fill="#f4a855"/>
    <ellipse cx="${x}" cy="53" rx="3.5" ry="6" fill="#fff59a"/>
  `;
  candlesGroup.appendChild(g);
});
candlesGroup.querySelectorAll('.candle-flame').forEach(g=>{
  g.addEventListener('click', ()=>{
    const flame = g.querySelector('.flame') || g.querySelector('ellipse');
    if(g.dataset.out) return;
    g.dataset.out = '1';
    g.querySelectorAll('ellipse').forEach(el=>{
      el.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'});
    });
    litCount--;
    if(litCount===0){
      confettiBurst(50);
      document.getElementById('candleMsg').classList.remove('hidden');
      document.getElementById('candleNext').classList.remove('hidden');
    }
  });
});
document.getElementById('candleNext').addEventListener('click', ()=> goTo(3,'next'));

// ================= GAME 2: BASKETBALL =================
const ball = document.getElementById('ball');
const hoopScoreEl = document.getElementById('hoopScore');
let shots = 0, score = 0;
document.getElementById('hoopCourt').addEventListener('click', ()=>{
  if(shots>=3 || ball.classList.contains('shoot')) return;
  ball.classList.add('shoot');
  shots++;
  setTimeout(()=>{
    score++;
    hoopScoreEl.textContent = score;
    confettiBurst(18);
    ball.classList.remove('shoot');
    if(shots>=3){
      document.getElementById('hoopSub').textContent = `Nice shooting, Bubli! ${score}/3 🏀`;
      document.getElementById('hoopNext').classList.remove('hidden');
    }
  }, 700);
});
document.getElementById('hoopNext').addEventListener('click', ()=> goTo(6,'next'));

// ================= GAME 3: BALLOON POP =================
const balloonField = document.getElementById('balloonField');
const balloonWords = ['18!','🎉','Finally!','Adult!','Bubli!','💙'];
let poppedCount = 0;
balloonWords.forEach((word,i)=>{
  const b = document.createElement('div');
  b.className='balloon';
  b.textContent='🎈';
  b.style.left = (8 + i*15) + '%';
  b.style.animationDuration = (6+Math.random()*3)+'s';
  b.style.animationDelay = (Math.random()*2)+'s';
  b.dataset.word = word;
  balloonField.appendChild(b);
  b.addEventListener('click', ()=>{
    if(b.classList.contains('popped')) return;
    b.classList.add('popped');
    const reveal = document.getElementById('popReveal');
    reveal.textContent = word;
    reveal.classList.add('show');
    setTimeout(()=> reveal.classList.remove('show'), 700);
    poppedCount++;
    if(poppedCount===balloonWords.length){
      confettiBurst(40);
      document.getElementById('balloonNext').classList.remove('hidden');
    }
  });
});
document.getElementById('balloonNext').addEventListener('click', ()=> goTo(8,'next'));

// ================= PET HEARTS =================
['petCat','petDog'].forEach(id=>{
  const el = document.getElementById(id);
  el.addEventListener('click', ()=>{
    el.classList.add('popped');
    setTimeout(()=> el.classList.remove('popped'), 900);
  });
});

// ================= TYPEWRITER =================
let typed = false;
function startTypewriter(){
  if(typed) return;
  typed = true;
  const el = document.getElementById('typewriterText');
  let i = 0;
  const speed = 28;
  function tick(){
    if(i <= LETTER_TEXT.length){
      el.textContent = LETTER_TEXT.slice(0,i);
      i++;
      setTimeout(tick, speed);
    }
  }
  tick();
}

// ================= FINALE SURPRISE =================
document.getElementById('surpriseBtn').addEventListener('click', ()=>{
  document.getElementById('surpriseBox').classList.remove('hidden');
  confettiBurst(60);
});

// register service worker (PWA)
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
