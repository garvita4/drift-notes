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

const TYPES = [
  {
    id: "sign",
    label: "Sign",
    title: "Sign",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 3h14v12H5z"/>
      <path d="M12 15v6M8 7h8M8 11h5"/>
    </svg>`
  },
  {
    id: "book",
    label: "Book",
    title: "Book",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 6C9 3 5 4 3 5v14c3-1 6-1 9 2"/>
      <path d="M12 6c3-3 7-2 9-1v14c-3-1-6-1-9 2"/>
      <path d="M12 6v15"/>
    </svg>`
  },
  {
    id: "torch",
    label: "Torch",
    title: "Torch",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 11h6l-1 10h-4z"/>
      <path d="M12 2c-2 3 2 3 0 6M8 5c-2 2 1 3 1 5M16 5c2 2-1 3-1 5"/>
    </svg>`
  },
  {
    id: "bottle",
    label: "Bottle",
    title: "Bottle",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 3h4v4l2 2v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9l2-2z"/>
      <path d="M10 7h4M8 13h8"/>
    </svg>`
  }
];

const MOODS = {
  random: {
    label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
  <path d="M4 4l4 4M16 16l4 4M4 20l4-4M16 8l4-4"/>
  <path d="M12 3v18M3 12h18"/>
</svg>`,
    title: "Random",
    color: null,
    vx: [6, 16],
    vy: [-12, -4],
    bob: 3,
    bs: 0.0008,
  },
  happy: {
    label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
  <circle cx="12" cy="12" r="9"/>
  <path d="M8 14s1.5 3 4 3 4-3 4-3M9 9h.01M15 9h.01"/>
</svg>`,
    title: "Happy",
    color: "#ffe135",
    vx: [10, 20],
    vy: [-14, -7],
    bob: 5,
    bs: 0.0016,
  },
  sad: {
    label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
  <circle cx="12" cy="12" r="9"/>
  <path d="M8 17s1.5-3 4-3 4 3 4 3M9 9h.01M15 9h.01"/>
</svg>`,
    title: "Sad",
    color: "#5c9dff",
    vx: [3, 7],
    vy: [3, 6],
    bob: 2,
    bs: 0.0005,
  },
  angry: {
    label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
  <circle cx="12" cy="12" r="9"/>
  <path d="M7 9l4 2M17 9l-4 2M8 17s2-2 4-2 4 2 4 2"/>
</svg>`,
    title: "Angry",
    color: "#ff5a5a",
    vx: [14, 26],
    vy: [-6, -2],
    bob: 2,
    bs: 0.002,
    shake: 2.5,
  },
  calm: {
    label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
  <circle cx="12" cy="12" r="9"/>
  <path d="M8 10h.01M16 10h.01M8 15h8"/>
</svg>`,
    title: "Calm",
    color: "#2de8e8",
    vx: [3, 6],
    vy: [-4, -2],
    bob: 6,
    bs: 0.0004,
  },
};

const THEMES = {
  overworld: {
    label: "Overworld",
  },
  nether: {
    label: "Nether",
    sky: ["#2b0606", "#b8341a"],
    stars: 0,
  },
  end: {
    label: "The End",
    sky: ["#07030f", "#2b1559"],
    stars: 1,
  },
};

const SKY = [
  ["#5b9df0", "#a9d4ff"],
  ["#3b4a9c", "#ff9a5c"],
  ["#0a1030", "#1d2b64"],
  ["#4a5fb0", "#ffc98a"],
  ["#5b9df0", "#a9d4ff"],
];

const GAP = 24;
const CYCLE = 150000;

const SETTINGS_KEY = "driftNotes.settings";
const NOTES_KEY = "driftNotes.notes";

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

const DEFAULTS = {
  sound: true,
  cycle: true,
  burst: true,
  speed: 1,
  life: 75,
  theme: "overworld",
};
const settings = Object.assign({}, DEFAULTS, load(SETTINGS_KEY, {}));

if (!THEMES[settings.theme]) settings.theme = "overworld";

const $ = (id) => document.getElementById(id);
const sky = $("sky"),
  input = $("noteInput"),
  releaseBtn = $("releaseBtn");
const clearBtn = $("clearBtn"),
  soundBtn = $("soundBtn"),
  settingsBtn = $("settingsBtn");
const cloudBox = $("clouds"),
  starsEl = $("stars"),
  embersEl = $("embers");
const statsEl = $("stats"),
  overlay = $("settings");
const sunEl = document.querySelector(".sun"),
  moonEl = document.querySelector(".moon");
const groundEl = document.querySelector(".ground");

const notes = [];
let releasedCount = load(NOTES_KEY, {}).count || 0;
let selectedColor = null;
let selectedType = "sign";
let selectedMood = "random";

for (let i = 0; i < 6; i++) {
  const c = document.createElement("div");
  c.className = "cloud";
  const dur = 110 + Math.random() * 130;
  c.style.width = 90 + Math.random() * 48 + "px";
  c.style.top = (3 + Math.random() * 0.3).toFixed(2);
  c.style.animationDuration = dur + "s";
  cloudBox.appendChild(c);
}

for (let i = 0; i < 70; i++) {
  const st = document.createElement("div");
  st.className = "star";
  st.style.left = Math.random() * 100 + "%";
  st.style.top = Math.random() * 65 + "%";
  st.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
  starsEl.appendChild(st);
}

for (let i = 0; i < 30; i++) {
  const e = document.createElement("div");
  e.className = "ember";
  const size = 3 + Math.random() * 4;
  const dur = 6 + Math.random() * 9;
  e.style.width = size + "px";
  e.style.height = size + "px";
  e.style.left = Math.random() * 100 + "%";
  e.style.animationDuration = dur + "s";
  embersEl.appendChild(e);
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

function area() {
  return { l: 12, r: innerWidth - 12, t: 80, b: innerHeight - 225 };
}

function spaceBetween(a, x, y, w, h) {
  const dx = Math.max(a.x - (x + w), x - (a.x + a.w), 0);
  const dy = Math.max(a.y - (y + h), y - (a.y + a.h), 0);
  return Math.hypot(dx, dy);
}

function rand(range) {
  return range[0] + Math.random() * (range[1] - range[0]);
}
function createNote(text, color) {
  const type = selectedType;
  const mood = selectedMood;
  const moodData = MOODS[mood];

  const el = document.createElement("div");
  el.className = `note type-${type}`;
  el.textContent = text;
  const col =
    color ||
    moodData.color ||
    COLORS[Math.floor(Math.random() * COLORS.length)];
  el.style.setProperty("--c", col);
  el.style.left = "0";
  el.style.top = "0";
  sky.appendChild(el);

  const w = el.offsetWidth,
    h = el.offsetHeight;
  const A = area();

  let best = { x: A.l, y: A.t },
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
    text,
    type,
    mood,
    color: col,
    x: best.x,
    y: best.y,
    vx: (Math.random() < 0.5 ? -1 : 1) * rand(moodData.vx),
    vy: rand(moodData.vy),
    bob: moodData.bob,
    bs: moodData.bs * (0.8 + Math.random() * 0.4),
    shake: moodData.shake || 0,
    rot: Math.round((Math.random() - 0.5) * 8),
    phase: Math.random() * 6.28,
    fading: false,
    pinned: false,
    hover: false,
  };
  notes.push(n);
  popEffect(n.x + w / 2, n.y + h / 2, col);
  requestAnimationFrame(() => el.classList.add("visible"));

  setTimeout(() => fadeAndRemove(n), 60000 + Math.random() * 30000);
  return n;
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
    const bob = Math.sin(now * n.bs + n.phase) * n.bob;
    if (n.shake) {
      n.x += (Math.random() - 0.5) * n.shake;
      n.y += (Math.random() - 0.5) * n.shake;
    }
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

const swatchBox = document.getElementById("swatches");
function addSwatch(color) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "swatch" + (color ? "" : " random selected");
  b.setAttribute("aria-label", color ? "Colour " + color : "Random colour");
  if (color) b.style.setProperty("--c", color);
  b.addEventListener("click", () => {
    selectedColor = color;
    swatchBox
      .querySelectorAll(".swatch")
      .forEach((x) => x.classList.remove("selected"));
    b.classList.add("selected");
    input.focus();
  });
  swatchBox.appendChild(b);
}
addSwatch(null);
COLORS.forEach(addSwatch);

function popEffect(x, y, color) {
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("div");
    const size = 6 + Math.random() * 8;
    p.style.cssText =
      `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;` +
      `background:${i % 3 === 0 ? "#fff" : color};border:2px solid #1c1c1c;pointer-events:none;`;
    sky.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 70;
    p.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist + 30}px) scale(.3)`,
          opacity: 0,
        },
      ],
      {
        duration: 600 + Math.random() * 300,
        easing: "cubic-bezier(.2,.8,.4,1)",
      },
    ).onfinish = () => p.remove();
  }
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function mix(a, b, k) {
  const A = hex(a);
  const B = hex(b);
  return (
    "#" +
    A.map((v, i) =>
      Math.round(v + (B[i] - v) * k)
        .toString(16)
        .padStart(2, "0"),
    ).join("")
  );
}

let skyClock = 0;
let lastSky = {
  top: "#5b9df0",
  bot: "#a9d4ff",
  night: 0,
};

function updateSky() {
  const th = settings.theme;
  let top,
    bot,
    night = 0,
    starAlpha = 0;

  if (th === "overworld") {
    const t = (skyClock % CYCLE) / CYCLE;
    const seg = Math.min(Math.floor(t * 4), 3),
      k = t * 4 - seg;
    top = mix(SKY[seg][0], SKY[seg + 1][0], k);
    bot = mix(SKY[seg][1], SKY[seg + 1][1], k);
    document.body.style.background = `linear-gradient(to bottom, ${top}, ${bot} 70%)`;

    const a = t * Math.PI * 2;
    sunEl.style.left = 50 + 42 * Math.sin(a) + "%";
    sunEl.style.top = 62 - 52 * Math.cos(a) + "%";
    moonEl.style.left = 50 - 42 * Math.sin(a) + "%";
    moonEl.style.top = 62 + 52 * Math.cos(a) + "%";

    night = (1 - Math.cos(a)) / 2;
    starAlpha = Math.max(0, Math.min(1, (night - 0.55) * 3));
    starsEl.style.opacity = Math.max(0, Math.min(1, (night - 0.55) * 3));
    const dim = `brightness(${(1 - night * 0.6).toFixed(2)})`;
    cloudBox.style.filter = dim;
    groundEl.style.filter = dim;
    sunEl.style.display = "";
    moonEl.style.display = "";
  } else {
    [top, bot] = THEMES[th].sky;

    starAlpha = THEMES[th].stars;

    sunEl.style.display = "none";
    moonEl.style.display = "none";

    cloudBox.style.filter = "none";
    groundEl.style.filter = "none";
  }
  starsEl.style.opacity = starAlpha;
  document.body.style.background = `linear-gradient(to bottom, ${top}, ${bot} 70%)`;
  lastSky = {
    top,
    bot,
    night: starAlpha,
  };
}

updateSky();

setInterval(() => {
  if (settings.cycle) {
    skyClock += 200;
  }

  updateSky();
}, 200);

input.focus();

function buildSeg(box, items, current, onPick) {
  const btns = [];
  function set(id) {
    btns.forEach(([itemId, button]) => {
      button.setAttribute("aria-pressed", String(itemId == id));
    });
  }

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "seg-btn";
    button.innerHTML = item.icon || item.label;
    button.title = item.title || "";

    button.setAttribute("aria-label", item.title || item.label);

    button.addEventListener("click", () => {
      set(item.id);
      onPick(item.id);
    });
    box.appendChild(button);
    btns.push([item.id, button]);
  });
  set(current);
  return set;
}

buildSeg($("types"), TYPES, selectedType, (id) => {
  selectedType = id;
  input.focus();
});

buildSeg(
  $("moods"),
  Object.entries(MOODS).map(([id, mood]) => ({
    id,
    label: mood.label,
    title: mood.title,
  })),
  selectedMood,
  (id) => {
    selectedMood = id;
    input.focus();
  },
);

