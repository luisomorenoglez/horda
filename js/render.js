import { TILE } from "./game.js";
import { T, MAP_W, MAP_H } from "./level.js";
import { getSprite, getCharSprite, getWeapon, getTile, themeCount } from "./sprites.js";

const WEAPONS = { guerrero: "axe", valquiria: "sword", mago: "fire", elfo: "arrow" };

const VIEW_W = 720;
const VIEW_H = 528;
const SPRITE = TILE; // el arte 16x16 ya trae sus márgenes

export function render(ctx, g, time) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // cámara centrada en el jugador, sin salirse del mapa
  const camX = clamp(g.player.x - VIEW_W / 2, 0, MAP_W * TILE - VIEW_W);
  const camY = clamp(g.player.y - VIEW_H / 2, 0, MAP_H * TILE - VIEW_H);

  const x0 = Math.floor(camX / TILE);
  const y0 = Math.floor(camY / TILE);
  const x1 = Math.min(MAP_W - 1, Math.ceil((camX + VIEW_W) / TILE));
  const y1 = Math.min(MAP_H - 1, Math.ceil((camY + VIEW_H) / TILE));

  // la mazmorra cambia de color al bajar, como en el arcade
  const theme = (g.depth - 1) % themeCount();

  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const t = g.map[ty][tx];
      const dx = tx * TILE - camX;
      const dy = ty * TILE - camY;
      if (t === T.WALL) ctx.drawImage(getTile("wall", TILE, theme), dx, dy);
      else {
        ctx.drawImage(getTile("floor", TILE, theme), dx, dy);
        if (t === T.DOOR) ctx.drawImage(getTile("door", TILE, theme), dx, dy);
        else if (t === T.EXIT) ctx.drawImage(getTile("exit", TILE, theme), dx, dy);
      }
    }
  }

  const bob = Math.sin(time / 180) * 1.5;

  for (const it of g.items) {
    ctx.drawImage(getSprite(it.kind, SPRITE), it.x - SPRITE / 2 - camX, it.y - SPRITE / 2 - camY + bob * 0.6);
  }

  for (const gen of g.generators) {
    const pulse = 1 + Math.sin(time / 250) * 0.08;
    const s = SPRITE * pulse;
    ctx.drawImage(getSprite(`gen_${gen.kind}`, SPRITE), gen.x - s / 2 - camX, gen.y - s / 2 - camY, s, s);
  }

  // enemigos: animados al andar, mirando hacia donde van
  for (const e of g.enemies) {
    const frame = e.moving ? Math.floor(time / 150) % 2 : 0;
    const eBob = e.kind === "ghost" ? bob : e.moving && frame === 1 ? -1 : 0;
    ctx.drawImage(
      getCharSprite(e.kind, e.face, frame, SPRITE),
      e.x - SPRITE / 2 - camX,
      e.y - SPRITE / 2 - camY + eBob
    );
  }

  // disparos: el arma de cada héroe girando en el aire
  const weapon = getWeapon(WEAPONS[g.classId], 18);
  for (const s of g.shots) {
    const spin = WEAPONS[g.classId] === "arrow"
      ? Math.atan2(s.vy, s.vx) // la flecha apunta a donde vuela
      : time / 80; // hacha y espada dan vueltas
    ctx.save();
    ctx.translate(s.x - camX, s.y - camY);
    ctx.rotate(spin);
    ctx.drawImage(weapon, -9, -9);
    ctx.restore();
  }
  const fireball = getWeapon("fire", 16);
  for (const s of g.enemyShots) {
    ctx.drawImage(fireball, s.x - 8 - camX, s.y - 8 - camY);
  }

  // jugador: animado, mirando a su dirección (parpadea al recibir daño)
  if (g.hurtFlash <= 0 || Math.floor(time / 60) % 2 === 0) {
    const p = g.player;
    const frame = p.moving ? Math.floor(time / 140) % 2 : 0;
    ctx.drawImage(
      getCharSprite(`hero_${g.classId}`, p.facing, frame, SPRITE),
      p.x - SPRITE / 2 - camX,
      p.y - SPRITE / 2 - camY + (p.moving && frame === 1 ? -1 : 0)
    );
  }

  // fogonazo de la poción-bomba
  if (g.bombFlash > 0) {
    ctx.fillStyle = `rgba(120, 160, 255, ${(g.bombFlash / 300) * 0.4})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  // avisos flotantes
  ctx.textAlign = "center";
  ctx.font = 'bold 14px "Courier New", monospace';
  let my = 60;
  for (const m of g.messages) {
    ctx.fillStyle = `rgba(232, 184, 48, ${Math.min(1, m.t / 500)})`;
    ctx.fillText(m.text, VIEW_W / 2, my);
    my += 20;
  }

  // cartel de nivel
  if (g.levelBanner > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.fillStyle = "#e8b830";
    ctx.font = 'bold 44px "Courier New", monospace';
    ctx.fillText(`NIVEL ${g.depth}`, VIEW_W / 2, VIEW_H / 2 - 10);
    ctx.fillStyle = "#d0d0dc";
    ctx.font = '15px "Courier New", monospace';
    ctx.fillText("destruye los generadores · busca la salida", VIEW_W / 2, VIEW_H / 2 + 26);
  }
}

export function renderHud(g) {
  const hpEl = document.getElementById("hud-hp");
  hpEl.textContent = g.hp;
  hpEl.classList.toggle("low", g.hp < 100);
  document.getElementById("hud-score").textContent = g.score;
  document.getElementById("hud-keys").textContent = g.keys;
  document.getElementById("hud-potions").textContent = g.potions;
  document.getElementById("hud-level").textContent = g.depth;
  document.getElementById("hud-best").textContent = localStorage.getItem("horda_best") || 0;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
