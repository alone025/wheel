const sectors = [
  { color: "#f82", label: "блокнот" },
  { color: "#0bf", label: "бокс с кометикой" },
  { color: "#fb0", label: "наушники эпл " },
  { color: "#0fb", label: "фен Дайсон" },
  { color: "#b0f", label: "айфон" },
];

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const prizeEl = document.querySelector("#prize"); // Prize display element
const prizeDisplayEl = document.querySelector("#prize-display"); // Container for prize display
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians
let firstSpin = true; // Flag to track if it's the first spin

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);
  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;

  // Update the prize display
  if (!angVel) {
    prizeEl.textContent = sector.label;
    

    // Show the prize display after the first spin
    if (firstSpin) {
      prizeDisplayEl.classList.remove("hidden");
      firstSpin = false; // Reset the flag after the first spin
    }
  }
}

function frame() {
  if (!angVel) return;
  angVel *= friction; // Decrement velocity by friction
  if (angVel < 0.002) angVel = 0; // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  sectors.forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine
  spinEl.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.45);
  });
}

init();
