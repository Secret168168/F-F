/* ✏️ แก้ตรงนี้: ชื่อและข้อความของคุณ (ใช้ \n เพื่อขึ้นบรรทัดใหม่) */
const CONFIG = {
  her: "เธอ",
  him: "เค้า",
  letter: [
    "ตั้งแต่วันแรกที่ได้ขยับความสัมพันธ์\nวันธรรมดาๆ ของเค้า\nก็เริ่มมีความสุขขึ้นทุกวัน",
    "รอยยิ้มของเธอมันน่ารักที่สุดเลย\nทำให้เวลาเค้าเห็นเธอยิ้มมันมีความสุขมากๆ\nทุกครั้งที่ได้คุยกันมีความสุขมากๆเลย",
    "เค้าอาจจะดีบ้างไม่ดีบ้าง\nแต่อยากให้เธอรู้ว่าเค้ารักเธอที่สุดเลย\nเธอสำคัญกับเค้ามากจริงๆ",
    "วันนี้เลยตั้งใจ\nทำสิ่งเล็กๆน้อยๆ ชิ้นนี้ขึ้นมา\nเพื่อถามเธอสักอย่างนึง"
  ],
  noTexts: ["ไม่เอา", "คิดดี ๆ อีกทีนะ 🥺", "ใจร้ายจัง…", "กดตกลงเถอะนะ", "ขอร้องงง 🥺", "ปุ่มนี้พังแล้ว 😝"],
  music: "111.mp3",   // ชื่อไฟล์เพลงของคุณ วางไว้โฟลเดอร์เดียวกับ index.html
  musicStart: 1,        // เริ่มเล่นที่วินาทีที่เท่าไร (ข้ามช่วงอินโทรได้)
  volume: 0.8,          // ความดัง 0 ถึง 1
  final: "จากนี้ไปเค้าจะอยู่ข้างๆเธอ\nทั้งวันที่มีความสุขและวันที่ลำบากนะคะ"
};

const $ = (id) => document.getElementById(id);
const R = (a, b) => a + Math.random() * (b - a);
const P = (a) => a[(Math.random() * a.length) | 0];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".her").forEach((e) => (e.textContent = CONFIG.her));
document.querySelectorAll(".him").forEach((e) => (e.textContent = CONFIG.him));
$("finalMsg").textContent = CONFIG.final;
$("today").textContent = new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

/* ความคืบหน้าของเรื่อง 0 → 1 : ฟ้าค่ำคืนค่อย ๆ กลายเป็นรุ่งอรุณ */
let tgtP = 0, curP = 0;
const setP = (p) => { tgtP = p; document.body.style.setProperty("--p", p); };
setP(0);

/* ================= สวนดอกไม้ (DOM/SVG) ================= */
(function garden() {
  const g = $("garden"), N = innerWidth < 600 ? 14 : 28;
  const FC = ["#ff7fae", "#ffb0cc", "#ff9ec4", "#c9a8ff", "#ffe3ee", "#ff8fa3", "#ffc6a8", "#f5a3ff", "#ffd36e"];
  for (let i = 0; i < N; i++) {
    const tul = Math.random() < 0.35, d = document.createElement("div");
    d.className = "fl";
    d.style.cssText = `left:${((i + R(0.1, 0.9)) / N) * 100}%;--h:${R(30, 120)}px;--s:${R(40, 72)}px;--del:${R(0, 2.4)}s;--sw:${R(3.5, 6)}s;color:${P(FC)}`;
    d.innerHTML = `<i class="stem"></i><i class="leaf"></i><svg viewBox="0 0 100 100"><use href="#${tul ? "tl" : "dz"}"/></svg>`;
    g.appendChild(d);
  }
})();

/* ================= Canvas ================= */
const bg = $("bg"), bc = bg.getContext("2d"), fx = $("fx"), fc = fx.getContext("2d");
let W, H;
function resize() {
  const D = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  [[bg, bc], [fx, fc]].forEach(([c, x]) => { c.width = W * D; c.height = H * D; x.setTransform(D, 0, 0, D, 0, 0); });
}
addEventListener("resize", resize); resize();

const COL = ["#ff6f9f", "#ffb0cc", "#ff9a7a", "#ffd36e", "#c9a8ff", "#fff1f5", "#ff7fae"];

/* ---------- รูปทรงที่วาด ---------- */
function heart(c, x, y, r, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath();
  c.moveTo(0, r * 0.9);
  c.bezierCurveTo(-r * 1.3, r * 0.1, -r * 0.9, -r * 0.9, 0, -r * 0.3);
  c.bezierCurveTo(r * 0.9, -r * 0.9, r * 1.3, r * 0.1, 0, r * 0.9);
  c.fill();
  c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.ellipse(-r * 0.5, -r * 0.3, r * 0.2, r * 0.12, -0.7, 0, 7); c.fill();
  c.restore();
}
function flower(c, x, y, r, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot);
  for (let i = 0; i < 6; i++) {
    c.rotate(Math.PI / 3);
    c.fillStyle = col; c.beginPath(); c.ellipse(0, -r * 0.55, r * 0.3, r * 0.5, 0, 0, 7); c.fill();
    c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(0, -r * 0.5, r * 0.14, r * 0.32, 0, 0, 7); c.fill();
  }
  c.fillStyle = "#ffd45e"; c.beginPath(); c.arc(0, 0, r * 0.22, 0, 7); c.fill(); c.restore();
}
function star(c, x, y, r, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath();
  c.moveTo(0, -r); c.quadraticCurveTo(0, 0, r, 0); c.quadraticCurveTo(0, 0, 0, r); c.quadraticCurveTo(0, 0, -r, 0); c.quadraticCurveTo(0, 0, 0, -r);
  c.fill(); c.restore();
}
function ribbon(c, x, y, r, rot, col, age) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, Math.cos(age * 0.18)); c.fillStyle = col;
  c.fillRect(-r * 0.25, -r * 0.7, r * 0.5, r * 1.4); c.restore();
}
/* ประกายพร้อมหางแสง (วาดด้วยโหมด lighter ให้เรืองแสง) */
function orb(c, x, y, r, rot, col, age, p) {
  const a = c.globalAlpha;
  c.globalCompositeOperation = "lighter"; c.strokeStyle = col; c.lineCap = "round";
  c.lineWidth = r * 2.6; c.globalAlpha = a * 0.28; c.beginPath(); c.moveTo(p.px, p.py); c.lineTo(x, y); c.stroke();
  c.lineWidth = r; c.globalAlpha = a; c.beginPath(); c.moveTo(p.px, p.py); c.lineTo(x, y); c.stroke();
  c.globalCompositeOperation = "source-over";
}
/* คลื่นกระแทกวงแหวน */
function ring(c, x, y, r, rot, col, age, p) {
  c.globalCompositeOperation = "lighter"; c.strokeStyle = col;
  c.lineWidth = Math.max(1, 7 * (1 - age / p.life)); c.beginPath(); c.arc(x, y, age * p.gs, 0, 6.283); c.stroke();
  c.globalCompositeOperation = "source-over";
}
const DRAW = { h: heart, f: flower, s: star, c: ribbon, o: orb, g: ring };

/* ---------- ฉากหลังที่มีชีวิต: ดาว ฟองแสง กลีบดอกไม้ หิ่งห้อย ---------- */
const stars = Array.from({ length: calm ? 50 : 150 }, () => ({ x: R(0, 1), y: R(0, 0.8), r: R(0.4, 1.5), ph: R(0, 6.3), sp: R(0.6, 2.2), z: R(0.2, 1), big: Math.random() < 0.07 }));
const bokeh = Array.from({ length: calm ? 5 : 16 }, () => ({ x: R(0, W), y: R(0, H), r: R(26, 84), vy: R(0.1, 0.35), ph: R(0, 6), rgb: P(["255,120,170", "255,200,130", "190,150,255"]), a: R(0.07, 0.15) }));
const PC = ["#ffc2d9", "#ffa6c6", "#ffe0ec", "#ffd3b8", "#ffb3d1"];
const petals = Array.from({ length: calm ? 8 : innerWidth < 600 ? 16 : 30 }, () => ({ x: R(0, W), y: R(-H, H), s: R(6, 13), vy: R(0.45, 1.15), vx: R(-0.2, 0.5), ph: R(0, 6.3), rot: R(0, 6), vr: R(-0.025, 0.025), fl: R(1, 2.4), col: P(PC) }));
const flies = Array.from({ length: calm ? 5 : 16 }, () => ({ x: R(0, W), y: R(H * 0.35, H), ph: R(0, 6.3), sp: R(0.4, 1) }));
let mx = 0, my = 0;

function petal(c, s) {
  c.beginPath();
  c.moveTo(0, s * 0.9);
  c.bezierCurveTo(-s * 0.9, s * 0.2, -s * 0.7, -s * 0.9, -s * 0.12, -s * 0.9);
  c.lineTo(0, -s * 0.65); c.lineTo(s * 0.12, -s * 0.9);
  c.bezierCurveTo(s * 0.7, -s * 0.9, s * 0.9, s * 0.2, 0, s * 0.9);
  c.fill();
}
function glowDot(c, x, y, r, rgb, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill();
}

function drawBG(t) {
  bc.clearRect(0, 0, W, H);
  curP += (tgtP - curP) * 0.02;
  const sa = 1 - curP * 0.85;

  bc.fillStyle = "#fff";
  for (const s of stars) {
    const a = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph))) * sa;
    if (a < 0.02) continue;
    const x = s.x * W - mx * s.z * 10, y = s.y * H - my * s.z * 6;
    bc.globalAlpha = a;
    if (s.big) star(bc, x, y, s.r * 5.5, 0, "#fff");
    else { bc.beginPath(); bc.arc(x, y, s.r, 0, 6.283); bc.fill(); }
  }

  bc.globalCompositeOperation = "lighter";
  for (const b of bokeh) {
    b.y -= b.vy; if (b.y < -b.r) { b.y = H + b.r; b.x = R(0, W); }
    glowDot(bc, b.x + Math.sin(t * 0.3 + b.ph) * 20 - mx * 14, b.y, b.r, b.rgb, b.a);
  }
  for (const f of flies) {
    f.x += Math.cos(t * f.sp + f.ph) * 0.4; f.y += Math.sin(t * f.sp * 1.3 + f.ph) * 0.35;
    const a = 0.25 + 0.75 * Math.max(0, Math.sin(t * 1.7 + f.ph));
    glowDot(bc, f.x, f.y, 14, "255,226,140", a * 0.6);
    glowDot(bc, f.x, f.y, 3, "255,246,200", a);
  }
  bc.globalCompositeOperation = "source-over";

  bc.globalAlpha = 0.9;
  for (const p of petals) {
    p.y += p.vy; p.x += p.vx + Math.sin(t * 0.8 + p.ph) * 0.6; p.rot += p.vr;
    if (p.y > H + 20) { p.y = -20; p.x = R(0, W); }
    if (p.x > W + 30) p.x = -30;
    bc.save(); bc.translate(p.x, p.y); bc.rotate(p.rot); bc.scale(1, Math.cos(t * p.fl + p.ph));
    bc.fillStyle = p.col; petal(bc, p.s); bc.restore();
  }
  bc.globalAlpha = 1;
}

/* ---------- เอฟเฟกต์โต้ตอบ / ฉลอง ---------- */
const fxp = [];
function spawn(o) {
  if (fxp.length < 1100) fxp.push({ x: 0, y: 0, px: null, py: null, vx: 0, vy: 0, g: 0, d: 1, r: 12, rot: R(0, 6), vr: R(-0.08, 0.08), age: 0, life: 200, sw: 0, ph: R(0, 6), t: "h", col: P(COL), gs: 6, ...o });
}
function burst(x, y, n, speed = 11, size = 1) {
  for (let i = 0; i < n; i++) {
    const a = R(0, 6.283), v = R(2, speed);
    spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, g: 0.13, d: 0.985, r: R(9, 24) * size, t: P(["h", "h", "f", "s", "c", "o", "o"]), life: R(110, 220) });
  }
}
/* สมการหัวใจ: คืนค่า (x, y) โดย y ชี้ขึ้นเป็นลบ */
function heartPt(t) {
  return { x: 16 * Math.pow(Math.sin(t), 3), y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) };
}
function firework(x, y) {
  const col = P(["#ff6f9f", "#ffd36e", "#c9a8ff", "#fff1f5", "#ff9a7a"]);
  if (Math.random() < 0.4) {
    for (let i = 0; i < 46; i++) { const q = heartPt((i / 46) * 6.283); spawn({ x, y, vx: q.x * 0.2, vy: q.y * 0.2, g: 0.02, d: 0.965, r: R(2, 3.4), t: "o", col, life: R(70, 95) }); }
  } else {
    const n = 36;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283, v = R(3, 6.5);
      spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.05, d: 0.96, r: i % 4 ? R(2, 3.6) : R(6, 10), t: i % 4 ? "o" : "h", col, life: R(60, 95) });
    }
  }
  spawn({ t: "g", x, y, gs: 3, life: 24, col, r: 1, vr: 0 });
}

/* หัวใจแสงที่ประกอบตัวขึ้นจากอนุภาค แล้วระเบิดเป็นพลุ */
const hp = []; let heartC = { x: 0, y: 0 }, boomed = true;
function formHeart() {
  const s = Math.min(W * 0.026, H * 0.021), cx = W / 2, cy = H * 0.46;
  heartC = { x: cx, y: cy }; boomed = false; hp.length = 0;
  for (let i = 0; i < 540; i++) {
    const outline = i < 300, q = heartPt(R(0, 6.283)), k = outline ? 1 : Math.sqrt(Math.random()) * 0.92;
    const a = R(0, 6.283), dist = Math.max(W, H) * R(0.55, 0.9);
    hp.push({ sx: cx + Math.cos(a) * dist, sy: cy + Math.sin(a) * dist, tx: cx + q.x * s * k, ty: cy + (q.y - 2.5) * s * k, age: 0, delay: R(0, 22), ph: R(0, 6.3), r: R(1.6, 3.4), col: P(COL) });
  }
}
function cannons() {
  for (let i = 0; i < 46; i++) {
    const side = i % 2 ? 1 : -1;
    spawn({ x: side > 0 ? 0 : W, y: H, vx: side * R(4, 13), vy: R(-21, -9), g: 0.28, d: 0.985, r: R(8, 16), t: P(["c", "c", "f", "h", "s"]), life: R(160, 270) });
  }
}
function boom() {
  const cx = heartC.x || W / 2, cy = heartC.y || H * 0.46, k = calm ? 0.4 : 1;
  spawn({ t: "g", x: cx, y: cy, gs: 10, life: 55, col: "#ffffff", r: 1 });
  spawn({ t: "g", x: cx, y: cy, gs: 6, life: 80, col: "#ffd36e", r: 1 });
  spawn({ t: "g", x: cx, y: cy, gs: 4, life: 100, col: "#ff7fae", r: 1 });
  burst(cx, cy, 90 * k, 14); burst(cx, cy, 50 * k, 9);
  if (!calm) cannons();
}

function drawFX() {
  fc.clearRect(0, 0, W, H);

  if (hp.length) {
    fc.globalCompositeOperation = "lighter";
    for (let i = hp.length - 1; i >= 0; i--) {
      const p = hp[i]; p.age++;
      const a = p.age - p.delay; if (a < 0) continue;
      const k = Math.min(1, a / 60), e = 1 - Math.pow(1 - k, 3);
      let x = p.sx + (p.tx - p.sx) * e + (1 - e) * Math.sin(p.age * 0.12 + p.ph) * 40;
      let y = p.sy + (p.ty - p.sy) * e + (1 - e) * Math.cos(p.age * 0.1 + p.ph) * 40;
      if (k === 1) { const z = 1 + 0.035 * Math.sin(a * 0.35); x = heartC.x + (x - heartC.x) * z; y = heartC.y + (y - heartC.y) * z; }
      if (a >= 100) {
        const ang = Math.atan2(y - heartC.y, x - heartC.x), v = R(2, 8);
        spawn({ t: "o", x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, g: 0.05, d: 0.955, r: R(2, 4), col: p.col, life: R(55, 110) });
        hp.splice(i, 1);
        if (!boomed) { boomed = true; boom(); }
        continue;
      }
      fc.fillStyle = p.col;
      fc.globalAlpha = Math.min(1, a / 12) * 0.2; fc.beginPath(); fc.arc(x, y, p.r * 3.4, 0, 6.283); fc.fill();
      fc.globalAlpha = Math.min(1, a / 12); fc.beginPath(); fc.arc(x, y, p.r, 0, 6.283); fc.fill();
    }
    fc.globalCompositeOperation = "source-over";
  }

  for (let i = fxp.length - 1; i >= 0; i--) {
    const p = fxp[i];
    p.age++; p.px = p.x; p.py = p.y;
    p.vx *= p.d; p.vy = p.vy * p.d + p.g;
    p.x += p.vx + Math.sin(p.age * 0.05 + p.ph) * p.sw; p.y += p.vy; p.rot += p.vr;
    const k = p.age / p.life;
    if (k >= 1 || p.y > H + 50 || p.y < -90) { fxp.splice(i, 1); continue; }
    fc.globalAlpha = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
    DRAW[p.t](fc, p.x, p.y, p.r * Math.min(1, p.age / 9), p.rot, p.col, p.age, p);
  }
  fc.globalAlpha = 1;
}

function loop(now) { drawBG(now / 1000); drawFX(); requestAnimationFrame(loop); }
requestAnimationFrame(loop);

/* ---------- เมาส์/นิ้ว: ประกายตามเมาส์ + พารัลแลกซ์ + ใบรับรองเอียงได้ ---------- */
const cert = document.querySelector(".cert");
let lastTrail = 0;
addEventListener("pointermove", (e) => {
  mx = (e.clientX / W - 0.5) * 2; my = (e.clientY / H - 0.5) * 2;
  const rs = document.documentElement.style; rs.setProperty("--px", mx.toFixed(3)); rs.setProperty("--py", my.toFixed(3));
  if (!calm && document.body.classList.contains("s3-on")) {
    const r = cert.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    cert.style.setProperty("--ry", Math.max(-14, Math.min(14, (x - 0.5) * 16)) + "deg");
    cert.style.setProperty("--rx", Math.max(-14, Math.min(14, -(y - 0.5) * 16)) + "deg");
    cert.style.setProperty("--mx", x * 100 + "%"); cert.style.setProperty("--my", y * 100 + "%");
  }
  if (calm || performance.now() - lastTrail < 38) return;
  lastTrail = performance.now();
  spawn({ x: e.clientX, y: e.clientY, vx: R(-.6, .6), vy: R(-.2, .8), g: 0.03, r: R(1.6, 3.4), t: "o", col: P(["#fff", "#ffd36e", "#ffb0cc"]), life: 38 });
});
addEventListener("pointerdown", (e) => { if (!calm) burst(e.clientX, e.clientY, 9, 5, 0.5); });

/* ================= ฉากและลำดับเรื่อง ================= */
const scenes = [...document.querySelectorAll(".scene")];
const sceneP = { s0: 0, s2: 0.8, s3: 1 };
const show = (id) => {
  scenes.forEach((s) => s.classList.toggle("active", s.id === id));
  document.body.classList.toggle("s3-on", id === "s3");
  if (id in sceneP) setP(sceneP[id]);
};

$("env").addEventListener("click", async () => {
  const env = $("env");
  if (env.classList.contains("open")) return;
  env.classList.add("open");
  startMusic();
  const r = env.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height * 0.3, 34, 8);
  firework(r.left + r.width / 2, r.top - 20);
  await sleep(1700);
  show("s1");
  typeLetter();
});

let li = 0, typing = false, skip = false;
const nb = $("nextBtn"), lt = $("ltxt"), dots = $("dots");
CONFIG.letter.forEach(() => dots.appendChild(document.createElement("i")));

/* แต่ละบรรทัดค่อย ๆ ปรากฏเหมือนเขียนด้วยปากกา (แตะที่ข้อความเพื่อข้าม) */
async function typeLetter() {
  typing = true; skip = false; nb.hidden = true;
  setP(0.12 + 0.55 * (li / Math.max(1, CONFIG.letter.length - 1)));
  [...dots.children].forEach((d, i) => d.classList.toggle("on", i === li));
  lt.className = "ltxt"; lt.innerHTML = "";
  const lines = CONFIG.letter[li].split("\n");
  lines.forEach((t, i) => {
    const s = document.createElement("span");
    s.textContent = t; s.style.animationDelay = i * 1.1 + "s";
    lt.appendChild(s);
  });
  const total = lines.length * 1100 + 500;
  for (let t = 0; t < total && !skip; t += 50) await sleep(50);
  lt.classList.add("all");
  typing = false; nb.hidden = false;
  nb.textContent = li === CONFIG.letter.length - 1 ? "ถึงตอนสำคัญแล้ว" : "อ่านต่อ";
}
lt.addEventListener("click", () => typing && (skip = true));
nb.addEventListener("click", () => {
  if (li < CONFIG.letter.length - 1) { li++; typeLetter(); } else show("s2");
});

/* ปุ่ม "ไม่เอา" วิ่งหนี */
let noN = 0;
const noBtn = $("noBtn"), yesBtn = $("yesBtn");
function dodge(e) {
  e && e.preventDefault();
  noN++;
  const b = noBtn.getBoundingClientRect();
  if (!calm) burst(b.left + b.width / 2, b.top + b.height / 2, 10, 4, 0.5);
  noBtn.textContent = CONFIG.noTexts[Math.min(noN, CONFIG.noTexts.length - 1)];
  noBtn.classList.add("run");
  const w = noBtn.offsetWidth, h = noBtn.offsetHeight, m = 14;
  noBtn.style.left = R(m, Math.max(m, innerWidth - w - m)) + "px";
  noBtn.style.top = R(70, Math.max(80, innerHeight - h - m)) + "px";
  yesBtn.style.transform = `scale(${Math.min(1 + noN * 0.15, 1.75)})`;
  $("askSub").textContent = noN > 2 ? "ปุ่มตกลงใหญ่ขึ้นแล้วนะ กดง่ายมาก 💗" : "เค้าจะดูแลเธออย่างดีที่สุดเลยค่ะ";
}
noBtn.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && dodge());
noBtn.addEventListener("pointerdown", dodge);
noBtn.addEventListener("click", (e) => e.preventDefault());

/* ================= ตอบตกลง ================= */
let timers = [];
const stopFX = () => { timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = []; fxp.length = 0; hp.length = 0; };

yesBtn.addEventListener("click", () => { show("s3"); celebrate(); });

function celebrate() {
  stopFX();
  if (calm) { boomed = true; heartC = { x: W / 2, y: H * 0.46 }; boom(); } else formHeart();
  timers.push(setTimeout(() => {
    timers.push(setInterval(() => firework(R(W * 0.12, W * 0.88), R(H * 0.1, H * 0.5)), 650));
    timers.push(setInterval(() => {
      for (let i = 0; i < 2; i++) spawn({ x: R(0, W), y: -30, vy: R(1.6, 3.6), vx: R(-0.4, 0.4), sw: R(0.4, 1.2), r: R(10, 24), t: P(["f", "f", "h", "s", "c"]), life: 420 });
    }, 110));
    timers.push(setInterval(() => {
      spawn({ x: R(0, W), y: H + 30, vy: R(-3.6, -1.6), sw: R(0.5, 1.4), r: R(12, 28), t: "h", life: 320, vr: R(-0.02, 0.02) });
    }, 260));
  }, calm ? 0 : 1900));
}

$("againBtn").addEventListener("click", () => {
  stopFX();
  noN = 0; noBtn.classList.remove("run"); noBtn.style.left = noBtn.style.top = ""; noBtn.textContent = CONFIG.noTexts[0];
  yesBtn.style.transform = "";
  $("askSub").textContent = "เค้าจะดูแลเธออย่างดีที่สุดเลยค่ะ";
  $("env").classList.remove("open");
  cert.style.removeProperty("--rx"); cert.style.removeProperty("--ry");
  li = 0; show("s0");
});

/* ================= เพลง: ใช้ไฟล์เพลงของคุณเอง ================= */
const audio = new Audio(CONFIG.music);
audio.loop = true; audio.preload = "auto"; audio.volume = 0;
let playing = false, started = false, broken = false, fadeT;

audio.addEventListener("error", () => { broken = true; playing = false; $("musicBtn").classList.remove("on"); $("musicTxt").textContent = "ไม่พบไฟล์เพลง"; });

function fade(to, ms, done) {
  clearInterval(fadeT);
  const from = audio.volume, t0 = performance.now();
  fadeT = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k === 1) { clearInterval(fadeT); done && done(); }
  }, 40);
}
function startMusic() {
  if (playing || broken) return;
  if (!started) { audio.currentTime = CONFIG.musicStart; started = true; }
  playing = true; ui(true);
  audio.play().then(() => fade(CONFIG.volume, 1800)).catch(() => { playing = false; ui(false); });
}
function stopMusic() {
  if (!playing) return;
  playing = false; ui(false);
  fade(0, 600, () => audio.pause());
}
function ui(on) {
  $("musicBtn").classList.toggle("on", on);
  $("musicBtn").setAttribute("aria-pressed", on);
  $("musicTxt").textContent = on ? "ปิดเพลง" : "เปิดเพลง";
}
$("musicBtn").addEventListener("click", () => (playing ? stopMusic() : startMusic()));