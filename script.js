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

/* ================= Canvas: พื้นหลัง + เอฟเฟกต์ ================= */
const bg = $("bg"), fx = $("fx"), bc = bg.getContext("2d"), fc = fx.getContext("2d");
let W, H;
function resize() {
  const D = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  [bg, fx].forEach((c) => { c.width = W * D; c.height = H * D; c.getContext("2d").setTransform(D, 0, 0, D, 0, 0); });
}
addEventListener("resize", resize); resize();

const COL = ["#ff8fb8", "#ffb3d1", "#ffc9dd", "#ff6fa3", "#f3a6ff", "#ffd9ea", "#ffa3c4"];

function flower(c, x, y, r, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col;
  for (let i = 0; i < 5; i++) { c.rotate(Math.PI * 0.4); c.beginPath(); c.ellipse(0, -r * 0.55, r * 0.37, r * 0.6, 0, 0, 7); c.fill(); }
  c.fillStyle = "#ffe38a"; c.beginPath(); c.arc(0, 0, r * 0.2, 0, 7); c.fill(); c.restore();
}
function heart(c, x, y, r, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath();
  c.moveTo(0, r * 0.9);
  c.bezierCurveTo(-r * 1.3, r * 0.1, -r * 0.9, -r * 0.9, 0, -r * 0.3);
  c.bezierCurveTo(r * 0.9, -r * 0.9, r * 1.3, r * 0.1, 0, r * 0.9);
  c.fill(); c.restore();
}
function star(c, x, y, r, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath();
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4, d = i % 2 ? r * 0.26 : r; c.lineTo(Math.cos(a) * d, Math.sin(a) * d); }
  c.closePath(); c.fill(); c.restore();
}
const DRAW = { f: flower, h: heart, s: star };

/* พื้นหลัง: กลีบดอกไม้ลอยช้า ๆ + ดาวระยิบ */
const petals = Array.from({ length: calm ? 8 : 22 }, () => ({ x: R(0, 1), y: R(0, 1), r: R(7, 15), vy: R(0.25, 0.7), ph: R(0, 6), rot: R(0, 6), vr: R(-0.01, 0.01), t: P(["f", "f", "h"]), col: P(COL) }));
const twinkles = Array.from({ length: calm ? 14 : 46 }, () => ({ x: R(0, 1), y: R(0, 1), r: R(3, 9), ph: R(0, 6), sp: R(0.015, 0.04) }));

/* เอฟเฟกต์: อนุภาคทั้งหมดอยู่ในอาร์เรย์เดียว */
const fxp = [];
function spawn(o) {
  if (fxp.length < 520) fxp.push({ x: 0, y: 0, vx: 0, vy: 0, g: 0, d: 1, r: 12, rot: R(0, 6), vr: R(-0.08, 0.08), age: 0, life: 200, sw: 0, ph: R(0, 6), t: "h", col: P(COL), ...o });
}
function burst(x, y, n, speed = 11) {
  for (let i = 0; i < n; i++) {
    const a = R(0, 6.283), v = R(2, speed);
    spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, g: 0.13, d: 0.985, r: R(9, 24), t: P(["h", "h", "f", "f", "s"]), life: R(130, 230) });
  }
}
function firework(x, y) {
  const col = P(["#ff6fa3", "#ffd36e", "#f3a6ff", "#fff"]), n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.283, v = R(3.5, 5.5);
    spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.05, d: 0.96, r: R(5, 10), t: i % 3 ? "s" : "h", col, life: R(60, 90) });
  }
}

function frame(t) {
  bc.clearRect(0, 0, W, H);
  twinkles.forEach((s) => {
    const a = 0.25 + 0.75 * Math.abs(Math.sin(t * s.sp * 0.1 + s.ph));
    bc.globalAlpha = a; star(bc, s.x * W, s.y * H, s.r * (0.6 + a * 0.5), s.ph, "#fff");
  });
  petals.forEach((p) => {
    p.y += p.vy / H * 1.4; p.rot += p.vr;
    if (p.y > 1.06) { p.y = -0.06; p.x = R(0, 1); }
    bc.globalAlpha = 0.8;
    DRAW[p.t](bc, (p.x + Math.sin(t * 0.0006 + p.ph) * 0.05) * W, p.y * H, p.r, p.rot, p.col);
  });

  fc.clearRect(0, 0, W, H);
  for (let i = fxp.length - 1; i >= 0; i--) {
    const p = fxp[i];
    p.age++; p.vx *= p.d; p.vy = p.vy * p.d + p.g;
    p.x += p.vx + Math.sin(p.age * 0.05 + p.ph) * p.sw; p.y += p.vy; p.rot += p.vr;
    const k = p.age / p.life;
    if (k >= 1 || p.y > H + 50 || p.y < -90) { fxp.splice(i, 1); continue; }
    fc.globalAlpha = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
    DRAW[p.t](fc, p.x, p.y, p.r * Math.min(1, p.age / 9), p.rot, p.col);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ประกายตามนิ้ว/เมาส์ */
let lastTrail = 0;
addEventListener("pointermove", (e) => {
  if (calm || performance.now() - lastTrail < 45) return;
  lastTrail = performance.now();
  spawn({ x: e.clientX, y: e.clientY, vx: R(-.6, .6), vy: R(-.2, .8), g: 0.03, r: R(4, 9), t: "s", col: P(["#fff", "#ffd36e", "#ffb3d1"]), life: 40 });
});

/* ================= ฉากและลำดับเรื่อง ================= */
const scenes = [...document.querySelectorAll(".scene")];
const show = (id) => { scenes.forEach((s) => s.classList.toggle("active", s.id === id)); document.body.classList.toggle("s3-on", id === "s3"); };

$("env").addEventListener("click", async () => {
  const env = $("env");
  if (env.classList.contains("open")) return;
  env.classList.add("open");
  startMusic();
  const r = env.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height * 0.3, 28, 7);
  await sleep(1700);
  show("s1");
  typeLetter();
});

let li = 0, typing = false, skip = false;
const nb = $("nextBtn"), lt = $("ltxt"), dots = $("dots");
CONFIG.letter.forEach(() => dots.appendChild(document.createElement("i")));

async function typeLetter() {
  typing = true; skip = false; nb.hidden = true;
  [...dots.children].forEach((d, i) => d.classList.toggle("on", i === li));
  const text = CONFIG.letter[li];
  lt.classList.add("caret"); lt.textContent = "";
  for (let i = 1; i <= text.length; i++) {
    if (skip) break;
    lt.textContent = text.slice(0, i);
    const c = text[i - 1];
    await sleep(c === "\n" ? 380 : c === " " ? 120 : 52);
  }
  lt.textContent = text; lt.classList.remove("caret");
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
  noBtn.textContent = CONFIG.noTexts[Math.min(noN, CONFIG.noTexts.length - 1)];
  noBtn.classList.add("run");
  const w = noBtn.offsetWidth, h = noBtn.offsetHeight, m = 14;
  noBtn.style.left = R(m, Math.max(m, innerWidth - w - m)) + "px";
  noBtn.style.top = R(70, Math.max(80, innerHeight - h - m)) + "px";
  yesBtn.style.transform = `scale(${Math.min(1 + noN * 0.15, 1.75)})`;
  yesBtn.style.animation = "none";
  $("askSub").textContent = noN > 2 ? "ปุ่มตกลงใหญ่ขึ้นแล้วนะ กดง่ายมาก 💗" : "เค้าจะดูแลเธออย่างดีที่สุดเลยค่ะ";
}
noBtn.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && dodge());
noBtn.addEventListener("pointerdown", dodge);
noBtn.addEventListener("click", (e) => e.preventDefault());

/* ================= ตอบตกลง ================= */
let timers = [];
yesBtn.addEventListener("click", () => { show("s3"); celebrate(); });

function celebrate() {
  const cx = W / 2, cy = H / 2, kids = calm ? 0.4 : 1;
  [0, 300, 700].forEach((d, k) => timers.push(setTimeout(() => burst(cx, cy, (70 + k * 25) * kids, 13 + k * 2), d)));
  // พลุดาวและหัวใจ
  timers.push(setInterval(() => firework(R(W * 0.12, W * 0.88), R(H * 0.1, H * 0.55)), 850));
  // ฝนดอกไม้ตกเต็มหน้าจอ
  timers.push(setInterval(() => {
    for (let i = 0; i < 2; i++) spawn({ x: R(0, W), y: -30, vy: R(1.6, 3.6), vx: R(-0.4, 0.4), sw: R(0.4, 1.2), r: R(10, 24), t: P(["f", "f", "h", "s"]), life: 420 });
  }, 110));
  // หัวใจลอยขึ้นจากด้านล่าง
  timers.push(setInterval(() => {
    spawn({ x: R(0, W), y: H + 30, vy: R(-3.6, -1.6), sw: R(0.5, 1.4), r: R(12, 28), t: "h", life: 320, vr: R(-0.02, 0.02) });
  }, 260));
}

$("againBtn").addEventListener("click", () => {
  timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = [];
  fxp.length = 0;
  noN = 0; noBtn.classList.remove("run"); noBtn.style.left = noBtn.style.top = ""; noBtn.textContent = CONFIG.noTexts[0];
  yesBtn.style.transform = ""; yesBtn.style.animation = "";
  $("askSub").textContent = "เค้าจะดูแลเธออย่างดีที่สุดเลยค่ะ";
  $("env").classList.remove("open");
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