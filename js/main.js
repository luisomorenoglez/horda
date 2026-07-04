import { newGame, update, CLASSES } from "./game.js";
import { render, renderHud } from "./render.js";
import { getSprite } from "./sprites.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");

let game = null;
window.__horda = () => game; // hook de depuración
window.__hordaStep = (dt) => { // avanzar la simulación a mano (pruebas)
  if (game) {
    update(game, input, dt);
    render(ctx, game, performance.now());
    renderHud(game);
  }
};

const input = { up: false, down: false, left: false, right: false, fire: false, potion: false };

const KEYMAP = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right",
  W: "up", S: "down", A: "left", D: "right",
  " ": "fire",
};

window.addEventListener("keydown", (e) => {
  if (e.key in KEYMAP) {
    e.preventDefault();
    input[KEYMAP[e.key]] = true;
  } else if (e.key === "e" || e.key === "E") {
    input.potion = true;
  } else if ((e.key === "r" || e.key === "R") && game && game.over) {
    showTitle();
  } else if (/^[1-4]$/.test(e.key) && !game) {
    startGame(Object.keys(CLASSES)[Number(e.key) - 1]);
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key in KEYMAP) input[KEYMAP[e.key]] = false;
});

// ---- pantalla de título / selección de clase ----

function showTitle() {
  game = null;
  overlay.classList.remove("hidden");
  overlay.innerHTML = "";
  const screen = document.createElement("div");
  screen.id = "title-screen";
  screen.innerHTML = `
    <h1>HORDA</h1>
    <p class="tagline">los generadores no descansan. tú tampoco.</p>
    <p class="pick">elige a tu héroe</p>
    <div id="classes"></div>
    <p class="hint">muévete con WASD/flechas · dispara con ESPACIO · poción con E</p>
  `;
  overlay.appendChild(screen);

  const box = screen.querySelector("#classes");
  Object.entries(CLASSES).forEach(([id, cls], i) => {
    const card = document.createElement("div");
    card.className = "class-card";
    const icon = getSprite(`hero_${id}`, 48);
    icon.style.display = "block";
    card.appendChild(icon);
    card.insertAdjacentHTML(
      "beforeend",
      `<div class="cname" style="color:${cls.color}">${cls.name}</div>
       <div class="cdesc">${cls.desc}</div>
       <div class="ckey">[${i + 1}]</div>`
    );
    card.addEventListener("click", () => startGame(id));
    box.appendChild(card);
  });
}

function startGame(classId) {
  game = newGame(classId);
  overlay.classList.add("hidden");
}

function showDeath() {
  overlay.classList.remove("hidden");
  const best = localStorage.getItem("horda_best") || 0;
  overlay.innerHTML = `
    <div>
      <h2>HAS CAÍDO</h2>
      <p class="sub">puntos: <b>${game.score}</b> · nivel: <b>${game.depth}</b></p>
      <p class="sub">récord: <b>${best}</b></p>
      <p class="sub" style="margin-top:14px;color:var(--dim)">pulsa R para volver a intentarlo</p>
    </div>
  `;
}

// ---- bucle ----

let last = performance.now();
let deathShown = false;

function loop(now) {
  const dt = Math.min(50, now - last);
  last = now;

  if (game) {
    update(game, input, dt);
    render(ctx, game, now);
    renderHud(game);
    if (game.over && !deathShown) {
      deathShown = true;
      showDeath();
    }
    if (!game.over) deathShown = false;
  }

  requestAnimationFrame(loop);
}

showTitle();
requestAnimationFrame(loop);
