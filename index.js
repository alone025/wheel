const sectors = [
  { color: "#f82", label: "доступ к платному каналу на месяц", probability: 70 },
  { color: "#0bf", label: "бокс с косметикой", probability: 10 },
  { color: "#fb0", label: "наушники Apple", probability: 7 },
  { color: "#0fb", label: "фен Dyson", probability: 5 },
  { color: "#b0f", label: "iPhone", probability: 3 },
];

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const prizeEl = document.querySelector("#prize");
const prizeDisplayEl = document.querySelector("#prize-display");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.95; // Friction for ~3 seconds of spinning
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians
let isSpinning = false;
let targetSectorIndex = null; // The index of the sector to stop at

// Function to draw each sector of the wheel
function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // Add text
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);
  ctx.restore();
}

// Function to calculate the stopping sector based on probabilities
function determineStoppingSector() {
  const probabilities = sectors.map((s) => s.probability);
  const sum = probabilities.reduce((a, b) => a + b, 0);
  const randValue = rand(0, sum);

  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (randValue <= cumulative) {
      return i;
    }
  }
  return 0; // Fallback in case of error
}

// Function to set the initial velocity to ensure stopping at the target sector
function calculateInitialVelocity(targetIndex) {
  const targetAngle = arc * targetIndex + rand(-arc / 4, arc / 4); // Add randomness within sector
  const fullRotations = rand(2, 3); // Number of full rotations
  return ((fullRotations * TAU + targetAngle - ang) % TAU) / (1 - friction);
}

function rotate() {
  const currentSectorIndex = Math.floor((tot - (ang / TAU) * tot) % tot);
  const sector = sectors[currentSectorIndex];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  // Update the spin button
  spinEl.textContent = isSpinning ? "SPINNING..." : "SPIN";
  spinEl.style.background = isSpinning ? "#ccc" : sector.color;

  // Update the prize display only after the wheel stops
  if (!isSpinning) {
    prizeDisplayEl.classList.remove("hidden");

    // Display the pre-determined target sector
    prizeEl.textContent = sectors[targetSectorIndex]?.label || "Error: No prize";
  }
}

function frame() {
  if (!isSpinning) return;

  angVel *= friction; // Apply friction to slow down
  if (angVel < 0.002) {
    angVel = 0;
    isSpinning = false;
  }
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
  rotate();
  engine();

  spinEl.addEventListener("click", () => {
    if (!isSpinning) {
      targetSectorIndex = determineStoppingSector(); // Use probabilities to determine the stopping sector
      angVel = calculateInitialVelocity(targetSectorIndex); // Spin to land on that sector
      isSpinning = true;
    }
  });
}

init();
