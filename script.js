const sky = document.getElementById("sky");
const input = document.getElementById("noteInput");
const releaseBtn = document.getElementById("releaseBtn");
const clearBtn = document.getElementById("clearBtn");
const cloudBox = document.getElementById("clouds");

for (let i = 0; i < 6; i++) {
  const c = document.createElement("div");
  c.className = "cloud";
  const dur = 110 + Math.random() * 130;
  c.style.width = 90 + Math.random() * 120 + "px";
  c.style.top = 3 + Math.random() * 48 + "%";
  c.style.opacity = (0.65 + Math.random() * 0.3).toFixed(2);
  c.style.animationDuration = dur + "s";
  c.style.animationDelay = -(Math.random() * dur) + "s";
  cloudBox.appendChild(c);
}

const COLORS = [
  "#ff5a5a",
  "#ffa02e",
  "#ffe135",
  "#4cf06a",
  "#2de8e8",
  "#5c9dff",
  "#bf7bff",
  "#ff6ec7",
];
const GAP = 24;
const notes = [];

function area() {
  return { l: 12, r: innerWidth - 12, t: 80, b: innerHeight - 225 };
}

function spaceBetween(a, x, y, w, h) {
  const dx = Math.max(a.x - (x + w), x - (a.x + a.w), 0);
  const dy = Math.max(a.y - (y + h), y - (a.y + a.h), 0);
  return Math.hypot(dx, dy);
}

function createNote(text, color) {
  const el = document.createElement("div");
  el.className = "note";
  el.textContent = text;
  const col = color || COLORS[Math.floor(Math.random() * COLORS.length)];
  el.style.setProperty("--c", col);
  el.style.left = "0";
  el.style.top = "0";
  sky.appendChild(el);

  const w = el.offsetWidth,
    h = el.offsetHeight;
  const A = area();

  let best = null,
    bestScore = -1;
  for (let i = 0; i < 80; i++) {
    const x = A.l + Math.random() * Math.max(1, A.r - A.l - w);
    const y = A.t + Math.random() * Math.max(1, A.b - A.t - h);
    let score = Infinity;
    for (const o of notes) score = Math.min(score, spaceBetween(o, x, y, w, h));
    if (score > bestScore) {
      bestScore = score;
      best = { x, y };
    }
    if (score >= GAP * 1.5) break;
  }

  const n = {
    el,
    w,
    h,
    x: best.x,
    y: best.y,
    vx: (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 10),
    vy: -(4 + Math.random() * 8),
    rot: Math.round((Math.random() - 0.5) * 8),
    phase: Math.random() * 6.28,
    speed: 0.0007 + Math.random() * 0.0004,
  };
  notes.push(n);
  popEffect(n.x + w / 2, n.y + h / 2, col);
  requestAnimationFrame(() => el.classList.add("visible"));

  setTimeout(() => fadeAndRemove(n), 60000 + Math.random() * 30000);
}

function fadeAndRemove(n) {
  if (n.fading) return;
  n.fading = true;
  n.el.classList.add("fading");
  setTimeout(() => {
    n.el.remove();
    const i = notes.indexOf(n);
    if (i > -1) notes.splice(i, 1);
  }, 2400);
}

function clampAndBounce(n, A) {
  if (n.x < A.l) {
    n.x = A.l;
    n.vx = Math.abs(n.vx);
  }
  if (n.x + n.w > A.r) {
    n.x = A.r - n.w;
    n.vx = -Math.abs(n.vx);
  }
  if (n.y < A.t) {
    n.y = A.t;
    n.vy = Math.abs(n.vy);
  }
  if (n.y + n.h > A.b) {
    n.y = A.b - n.h;
    n.vy = -Math.abs(n.vy);
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  const A = area();

  for (const n of notes) {
    n.x += n.vx * dt;
    n.y += n.vy * dt;
    clampAndBounce(n, A);
  }

  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const a = notes[i],
        b = notes[j];
      const ox = Math.min(a.x + a.w + GAP - b.x, b.x + b.w + GAP - a.x);
      const oy = Math.min(a.y + a.h + GAP - b.y, b.y + b.h + GAP - a.y);
      if (ox > 0 && oy > 0) {
        if (ox < oy) {
          const dir = a.x + a.w / 2 < b.x + b.w / 2 ? -1 : 1;
          a.x += (dir * ox) / 2;
          b.x -= (dir * ox) / 2;
          a.vx = dir * Math.abs(a.vx);
          b.vx = -dir * Math.abs(b.vx);
        } else {
          const dir = a.y + a.h / 2 < b.y + b.h / 2 ? -1 : 1;
          a.y += (dir * oy) / 2;
          b.y -= (dir * oy) / 2;
          a.vy = dir * Math.abs(a.vy);
          b.vy = -dir * Math.abs(b.vy);
        }
      }
    }
  }

  for (const n of notes) {
    clampAndBounce(n, A);
    const bob = Math.sin(now * n.speed + n.phase) * 3;
    n.el.style.transform = `translate(${n.x.toFixed(1)}px, ${(n.y + bob).toFixed(1)}px) rotate(${n.rot}deg)`;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function release() {
  const text = input.value.trim();
  if (!text) return;
  createNote(text, selectedColor);
  input.value = "";
  input.focus();
}

releaseBtn.addEventListener("click", release);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") release();
});
clearBtn.addEventListener("click", () => notes.slice().forEach(fadeAndRemove));

let selectedColor = null;
const swatchBox = document.getElementById('swatches');
function addSwatch(color) {
const b = document.createElement('button');
b.type = 'button';
b.className = 'swatch' + (color ? '' : ' random selected');
b.setAttribute('aria-label', color ? 'Colour ' + color : 'Random colour');
if (color) b.style.setProperty('--c', color);
b.addEventListener('click', () => {
selectedColor = color;
swatchBox.querySelectorAll('.swatch').forEach(x => x.classList.remove('selected'));
b.classList.add('selected');
input.focus();
});
swatchBox.appendChild(b);
}
addSwatch(null);
COLORS.forEach(addSwatch);

function popEffect(x, y, color) {
for (let i = 0; i < 16; i++) {
const p = document.createElement('div');
const size = 6 + Math.random() * 8;
p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;` +
`background:${i % 3 === 0 ? '#fff' : color};border:2px solid #1c1c1c;pointer-events:none;`;
sky.appendChild(p);
const ang = Math.random() * Math.PI * 2;
const dist = 50 + Math.random() * 70;
p.animate([
{ transform: 'translate(0,0) scale(1)', opacity: 1 },
{ transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist + 30}px) scale(.3)`, opacity: 0 }
], { duration: 600 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.4,1)' }).onfinish = () => p.remove();
}
}

const CYCLE = 150000; // ms for a full day
const SKY = [ // [top, bottom] at t = 0, .25, .5, .75, 1
['#5b9df0', '#a9d4ff'], // day
['#3b4a9c', '#ff9a5c'], // sunset
['#0a1030', '#1d2b64'], // night
['#4a5fb0', '#ffc98a'], // sunrise
['#5b9df0', '#a9d4ff'] // day
];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * k).toString(16).padStart(2, '0')).join('');

const starsEl = document.getElementById('stars');
for (let i = 0; i < 70; i++) {
const st = document.createElement('div');
st.className = 'star';
st.style.left = Math.random() * 100 + '%';
st.style.top = Math.random() * 65 + '%';
st.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
starsEl.appendChild(st);
}

const sunEl = document.querySelector('.sun'), moonEl = document.querySelector('.moon');
const groundEl = document.querySelector('.ground');
function updateSky() {
const t = (performance.now() % CYCLE) / CYCLE;
const seg = Math.min(Math.floor(t * 4), 3), k = t * 4 - seg;
const top = mix(SKY[seg][0], SKY[seg + 1][0], k);
const bot = mix(SKY[seg][1], SKY[seg + 1][1], k);
document.body.style.background = `linear-gradient(to bottom, ${top}, ${bot} 70%)`;

const a = t * Math.PI * 2;
sunEl.style.left = (50 + 42 * Math.sin(a)) + '%';
sunEl.style.top = (55 - 50 * Math.cos(a)) + '%';
moonEl.style.left = (50 - 42 * Math.sin(a)) + '%';
moonEl.style.top = (55 + 50 * Math.cos(a)) + '%';

const night = (1 - Math.cos(a)) / 2; // 0 day -> 1 deep night
starsEl.style.opacity = Math.max(0, Math.min(1, (night - 0.55) * 3));
const dim = `brightness(${(1 - night * 0.6).toFixed(2)})`;
cloudBox.style.filter = dim;
groundEl.style.filter = dim;
}

updateSky();
setInterval(updateSky, 200);
input.focus();
