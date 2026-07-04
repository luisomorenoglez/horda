import { generateLevel, T, MAP_W, MAP_H } from "./level.js";
import { sfx } from "./audio.js";

export const TILE = 32;

export const CLASSES = {
  guerrero: {
    name: "GUERRERO", desc: "pega fuerte, dispara lento", color: "#b03030",
    speed: 135, dmg: 3, fireRate: 420, shotSpeed: 335, armor: 0.75,
  },
  valquiria: {
    name: "VALQUIRIA", desc: "la mejor armadura", color: "#e8c840",
    speed: 140, dmg: 2, fireRate: 340, shotSpeed: 375, armor: 0.6,
  },
  mago: {
    name: "MAGO", desc: "magia rápida, piel de papel", color: "#8040c0",
    speed: 140, dmg: 3, fireRate: 280, shotSpeed: 440, armor: 1.0,
  },
  elfo: {
    name: "ELFO", desc: "el más veloz", color: "#40a050",
    speed: 185, dmg: 2, fireRate: 260, shotSpeed: 425, armor: 0.9,
  },
};

const ENEMIES = {
  ghost: { hp: 2, speed: 70, dmg: 8, points: 10, kamikaze: true },
  grunt: { hp: 4, speed: 59, dmg: 5, points: 20, kamikaze: false },
  demon: { hp: 6, speed: 48, dmg: 6, points: 50, kamikaze: false, ranged: true },
};

const MAX_ENEMIES = 40;
const PLAYER_SIZE = 20;
const ENEMY_SIZE = 20;
const DRAIN_MS = 1000; // -1 de salud por segundo: la esencia de Gauntlet

export function newGame(classId) {
  const g = {
    classId,
    cls: CLASSES[classId],
    seed: (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0,
    depth: 0,
    score: 0,
    keys: 0,
    potions: 1,
    hp: 500,
    maxHp: 999,
    player: { x: 0, y: 0, size: PLAYER_SIZE, fx: 1, fy: 0 }, // fx/fy = dirección de disparo
    enemies: [],
    generators: [],
    items: [],
    shots: [],
    enemyShots: [],
    map: null,
    fireCooldown: 0,
    drainAcc: 0,
    hurtFlash: 0,
    bombFlash: 0,
    over: false,
    levelBanner: 0,
    messages: [],
  };
  nextLevel(g);
  return g;
}

export function nextLevel(g) {
  g.depth++;
  const lvl = generateLevel(g.seed, g.depth);
  g.map = lvl.grid;
  g.player.x = (lvl.start.x + 0.5) * TILE;
  g.player.y = (lvl.start.y + 0.5) * TILE;
  g.shots = [];
  g.enemyShots = [];
  g.enemies = [];
  g.generators = [];
  g.items = [];
  g.levelBanner = 2000;

  const hpScale = 1 + (g.depth - 1) * 0.18;
  for (const s of lvl.spawns.generators) {
    g.generators.push({
      x: (s.x + 0.5) * TILE, y: (s.y + 0.5) * TILE,
      kind: s.kind, hp: 3 + Math.floor(g.depth / 3),
      timer: 1500 + Math.random() * 2000,
      rate: Math.max(1400, 3200 - g.depth * 180),
    });
  }
  for (const s of lvl.spawns.items) {
    g.items.push({ kind: s.kind, x: (s.x + 0.5) * TILE, y: (s.y + 0.5) * TILE });
  }
  for (const s of lvl.spawns.enemies) {
    spawnEnemy(g, s.kind, (s.x + 0.5) * TILE, (s.y + 0.5) * TILE, hpScale);
  }
  if (g.depth > 1) sfx.level();
}

function spawnEnemy(g, kind, x, y, hpScale = 1 + (g.depth - 1) * 0.18) {
  if (g.enemies.length >= MAX_ENEMIES) return;
  const base = ENEMIES[kind];
  g.enemies.push({
    kind, x, y, size: ENEMY_SIZE,
    hp: Math.round(base.hp * hpScale),
    speed: base.speed * (1 + (g.depth - 1) * 0.04),
    dmg: base.dmg, points: base.points,
    kamikaze: base.kamikaze, ranged: !!base.ranged,
    hitCd: 0, shootCd: 1000 + Math.random() * 1500,
    wobble: Math.random() * Math.PI * 2,
  });
}

// ---- colisiones con el mapa ----

function tileAt(map, px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return T.WALL;
  return map[ty][tx];
}

function boxBlocked(g, x, y, size, isPlayer) {
  const h = size / 2 - 1;
  const corners = [
    [x - h, y - h], [x + h, y - h], [x - h, y + h], [x + h, y + h],
  ];
  for (const [cx, cy] of corners) {
    const t = tileAt(g.map, cx, cy);
    if (t === T.WALL) return true;
    if (t === T.DOOR) {
      if (isPlayer && g.keys > 0) {
        g.keys--;
        openDoor(g, Math.floor(cx / TILE), Math.floor(cy / TILE));
        sfx.door();
        continue;
      }
      return true;
    }
  }
  return false;
}

// Abre la puerta tocada y las puertas contiguas (puertas de más de 1 tile).
function openDoor(g, tx, ty) {
  const stack = [[tx, ty]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
    if (g.map[y][x] !== T.DOOR) continue;
    g.map[y][x] = T.FLOOR;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
}

function moveEntity(g, e, dx, dy, isPlayer = false) {
  if (dx !== 0 && !boxBlocked(g, e.x + dx, e.y, e.size, isPlayer)) e.x += dx;
  if (dy !== 0 && !boxBlocked(g, e.x, e.y + dy, e.size, isPlayer)) e.y += dy;
}

// ---- bucle principal ----

export function update(g, input, dt) {
  if (g.over) return;
  if (g.levelBanner > 0) {
    g.levelBanner -= dt;
    return; // pausa breve al entrar en un nivel
  }

  updatePlayer(g, input, dt);
  if (g.over) return;
  updateShots(g, dt);
  updateEnemies(g, dt);
  updateGenerators(g, dt);
  updateEnemyShots(g, dt);
  drainHealth(g, dt);

  g.hurtFlash = Math.max(0, g.hurtFlash - dt);
  g.bombFlash = Math.max(0, g.bombFlash - dt);
  g.messages = g.messages.filter((m) => (m.t -= dt) > 0);
}

function updatePlayer(g, input, dt) {
  const p = g.player;
  let dx = 0, dy = 0;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);
    const v = (g.cls.speed * dt) / 1000;
    moveEntity(g, p, (dx / len) * v, (dy / len) * v, true);
    p.fx = dx;
    p.fy = dy;
  }

  // disparo
  g.fireCooldown -= dt;
  if (input.fire && g.fireCooldown <= 0) {
    const len = Math.hypot(p.fx, p.fy) || 1;
    g.shots.push({
      x: p.x, y: p.y,
      vx: (p.fx / len) * g.cls.shotSpeed,
      vy: (p.fy / len) * g.cls.shotSpeed,
    });
    g.fireCooldown = g.cls.fireRate;
    sfx.shoot();
  }

  // poción = bomba que arrasa lo que hay en pantalla
  if (input.potion) {
    input.potion = false;
    if (g.potions > 0) {
      g.potions--;
      g.bombFlash = 300;
      sfx.potion();
      for (const e of g.enemies) e.hp -= 10;
      for (const gen of g.generators) gen.hp -= 2;
      reapDead(g);
    }
  }

  // recoger objetos
  for (let i = g.items.length - 1; i >= 0; i--) {
    const it = g.items[i];
    if (Math.hypot(it.x - p.x, it.y - p.y) > TILE * 0.7) continue;
    g.items.splice(i, 1);
    if (it.kind === "food") {
      g.hp = Math.min(g.maxHp, g.hp + 100);
      toast(g, "+100 SALUD");
      sfx.food();
    } else if (it.kind === "key") {
      g.keys++;
      sfx.pickup();
    } else if (it.kind === "treasure") {
      g.score += 100;
      toast(g, "+100");
      sfx.pickup();
    } else if (it.kind === "potion") {
      g.potions++;
      sfx.pickup();
    }
  }

  // salida
  if (tileAt(g.map, p.x, p.y) === T.EXIT) {
    g.score += 200;
    nextLevel(g);
  }
}

function updateShots(g, dt) {
  for (let i = g.shots.length - 1; i >= 0; i--) {
    const s = g.shots[i];
    s.x += (s.vx * dt) / 1000;
    s.y += (s.vy * dt) / 1000;
    const t = tileAt(g.map, s.x, s.y);
    if (t === T.WALL || t === T.DOOR) {
      g.shots.splice(i, 1);
      continue;
    }
    let consumed = false;
    for (const e of g.enemies) {
      if (Math.hypot(e.x - s.x, e.y - s.y) < e.size / 2 + 4) {
        e.hp -= g.cls.dmg;
        consumed = true;
        sfx.hit();
        break;
      }
    }
    if (!consumed) {
      for (const gen of g.generators) {
        if (Math.hypot(gen.x - s.x, gen.y - s.y) < TILE * 0.5) {
          gen.hp -= g.cls.dmg;
          consumed = true;
          sfx.hit();
          break;
        }
      }
    }
    if (consumed) {
      g.shots.splice(i, 1);
      reapDead(g);
    }
  }
}

function reapDead(g) {
  for (let i = g.enemies.length - 1; i >= 0; i--) {
    if (g.enemies[i].hp <= 0) {
      g.score += g.enemies[i].points;
      g.enemies.splice(i, 1);
      sfx.kill();
    }
  }
  for (let i = g.generators.length - 1; i >= 0; i--) {
    if (g.generators[i].hp <= 0) {
      g.score += 100;
      g.generators.splice(i, 1);
      toast(g, "GENERADOR DESTRUIDO +100");
      sfx.kill();
    }
  }
}

function updateEnemies(g, dt) {
  const p = g.player;
  for (let i = g.enemies.length - 1; i >= 0; i--) {
    const e = g.enemies[i];
    const dist = Math.hypot(p.x - e.x, p.y - e.y);

    // contacto
    e.hitCd -= dt;
    if (dist < (e.size + p.size) / 2 + 1) {
      if (e.kamikaze) {
        damagePlayer(g, e.dmg);
        g.enemies.splice(i, 1);
        continue;
      }
      if (e.hitCd <= 0) {
        damagePlayer(g, e.dmg);
        e.hitCd = 700;
      }
      continue; // pegado al jugador: no hace falta moverse
    }

    // persecución si está razonablemente cerca
    if (dist < TILE * 14) {
      e.wobble += dt / 400;
      const v = (e.speed * dt) / 1000;
      let dx = p.x - e.x;
      let dy = p.y - e.y;
      const len = Math.hypot(dx, dy) || 1;
      dx = (dx / len) * v;
      dy = (dy / len) * v;
      if (e.kind === "ghost") {
        dx += Math.cos(e.wobble) * v * 0.5;
        dy += Math.sin(e.wobble) * v * 0.5;
      }
      moveEntity(g, e, dx, dy);
    }

    // demonios lanzan proyectiles
    if (e.ranged && dist < TILE * 9) {
      e.shootCd -= dt;
      if (e.shootCd <= 0) {
        e.shootCd = 1800;
        const len = Math.hypot(p.x - e.x, p.y - e.y) || 1;
        g.enemyShots.push({
          x: e.x, y: e.y,
          vx: ((p.x - e.x) / len) * 230,
          vy: ((p.y - e.y) / len) * 230,
          dmg: e.dmg,
        });
      }
    }
  }
}

function updateGenerators(g, dt) {
  const p = g.player;
  for (const gen of g.generators) {
    const dist = Math.hypot(p.x - gen.x, p.y - gen.y);
    if (dist > TILE * 16) continue; // lejos no generan (rendimiento)
    gen.timer -= dt;
    if (gen.timer <= 0) {
      gen.timer = gen.rate * (0.75 + Math.random() * 0.5);
      spawnEnemy(g, gen.kind, gen.x + (Math.random() - 0.5) * TILE, gen.y + (Math.random() - 0.5) * TILE);
    }
  }
}

function updateEnemyShots(g, dt) {
  const p = g.player;
  for (let i = g.enemyShots.length - 1; i >= 0; i--) {
    const s = g.enemyShots[i];
    s.x += (s.vx * dt) / 1000;
    s.y += (s.vy * dt) / 1000;
    const t = tileAt(g.map, s.x, s.y);
    if (t === T.WALL || t === T.DOOR) {
      g.enemyShots.splice(i, 1);
      continue;
    }
    if (Math.hypot(p.x - s.x, p.y - s.y) < p.size / 2 + 4) {
      damagePlayer(g, s.dmg);
      g.enemyShots.splice(i, 1);
    }
  }
}

function damagePlayer(g, amount) {
  if (g.over) return;
  g.hp -= Math.max(1, Math.round(amount * g.cls.armor));
  g.hurtFlash = 200;
  sfx.hurt();
  checkDeath(g);
}

function drainHealth(g, dt) {
  g.drainAcc += dt;
  while (g.drainAcc >= DRAIN_MS && !g.over) {
    g.drainAcc -= DRAIN_MS;
    g.hp--;
    checkDeath(g);
  }
}

function checkDeath(g) {
  if (g.hp <= 0 && !g.over) {
    g.hp = 0;
    g.over = true;
    sfx.die();
    const best = Number(localStorage.getItem("horda_best") || 0);
    if (g.score > best) localStorage.setItem("horda_best", String(g.score));
  }
}

function toast(g, text) {
  g.messages.push({ text, t: 1500 });
}
