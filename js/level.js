import { createRng, randInt, pick } from "./rng.js";

export const T = { WALL: 0, FLOOR: 1, DOOR: 2, EXIT: 3 };
export const MAP_W = 44;
export const MAP_H = 34;

// Genera un nivel: salas encadenadas con pasillos, puertas con llave
// garantizada antes de la puerta (la cadena de salas da el orden).
export function generateLevel(seed, depth) {
  const rng = createRng(seed + depth * 7919);
  const grid = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(T.WALL));
  const rooms = [];
  const maxRooms = 14;

  for (let i = 0; i < maxRooms * 8 && rooms.length < maxRooms; i++) {
    const w = randInt(rng, 5, 10);
    const h = randInt(rng, 4, 8);
    const x = randInt(rng, 1, MAP_W - w - 2);
    const y = randInt(rng, 1, MAP_H - h - 2);
    const room = { x, y, w, h, cx: x + (w >> 1), cy: y + (h >> 1) };
    if (rooms.some((r) => intersects(r, room, 1))) continue;
    carveRoom(grid, room);
    rooms.push(room);
  }

  // Primero se excava TODO (pasillos y atajos); las puertas se deciden
  // después, mirando el mapa final, para que nunca queden flotando.
  const corridors = [];
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1];
    const b = rooms[i];
    corridors.push({ idx: i, path: carveCorridor(grid, rng, a.cx, a.cy, b.cx, b.cy) });
  }
  for (let i = 0; i < 2 && rooms.length > 5; i++) {
    const a = pick(rng, rooms);
    const b = pick(rng, rooms);
    if (a !== b) carveCorridor(grid, rng, a.cx, a.cy, b.cx, b.cy);
  }

  // Puertas solo en cuellos de botella reales: suelo con muro a ambos
  // lados perpendiculares y pasillo a ambos lados de paso.
  const doors = [];
  for (const c of corridors) {
    if (c.idx < 2 || rng() >= 0.45) continue;
    const candidates = c.path.slice(2, -2).filter((p) => isChokepoint(grid, p.x, p.y));
    if (!candidates.length) continue;
    const d = pick(rng, candidates);
    doors.push({ x: d.x, y: d.y, keyRoom: randInt(rng, 0, c.idx - 1) });
  }
  for (const d of doors) grid[d.y][d.x] = T.DOOR;

  const startRoom = rooms[0];
  const exitRoom = rooms[rooms.length - 1];
  grid[exitRoom.cy][exitRoom.cx] = T.EXIT;

  // ---- poblar el nivel; la dificultad escala con la profundidad ----
  const spawns = { generators: [], items: [], enemies: [] };
  const used = new Set();
  const spot = (room) => {
    for (let t = 0; t < 25; t++) {
      const x = randInt(rng, room.x, room.x + room.w - 1);
      const y = randInt(rng, room.y, room.y + room.h - 1);
      const k = y * MAP_W + x;
      if (grid[y][x] !== T.FLOOR || used.has(k)) continue;
      used.add(k);
      return { x, y };
    }
    return null;
  };

  for (const d of doors) {
    const s = spot(rooms[d.keyRoom]);
    if (s) spawns.items.push({ kind: "key", ...s });
    else grid[d.y][d.x] = T.FLOOR; // sin sitio para la llave: la puerta se abre sola
  }

  const genChance = Math.min(0.9, 0.5 + depth * 0.07);
  const extraGenChance = depth >= 2 ? Math.min(0.6, 0.15 + depth * 0.05) : 0;
  const foodChance = Math.max(0.22, 0.42 - depth * 0.02);
  const maxWander = Math.min(4, 1 + Math.floor(depth / 2));

  for (let i = 1; i < rooms.length; i++) {
    const room = rooms[i];
    if (rng() < genChance) {
      const s = spot(room);
      if (s) spawns.generators.push({ ...s, kind: pickEnemyKind(rng, depth) });
    }
    if (rng() < extraGenChance) {
      const s = spot(room);
      if (s) spawns.generators.push({ ...s, kind: pickEnemyKind(rng, depth) });
    }
    if (depth >= 6 && rng() < 0.25) {
      const s = spot(room);
      if (s) spawns.generators.push({ ...s, kind: pickEnemyKind(rng, depth) });
    }
    if (rng() < foodChance) {
      const s = spot(room);
      if (s) spawns.items.push({ kind: "food", ...s });
    }
    if (rng() < 0.5) {
      const s = spot(room);
      if (s) spawns.items.push({ kind: "treasure", ...s });
    }
    if (rng() < 0.18) {
      const s = spot(room);
      if (s) spawns.items.push({ kind: "potion", ...s });
    }
    // Enemigos ya deambulando al llegar (más cuanto más hondo).
    const n = randInt(rng, 0, maxWander);
    for (let j = 0; j < n; j++) {
      const s = spot(room);
      if (s) spawns.enemies.push({ ...s, kind: pickEnemyKind(rng, depth) });
    }
  }

  // La Muerte: a partir del nivel 3 puede rondar una por mazmorra.
  // Es inmune a los disparos y solo se sacia drenándote la vida.
  if (depth >= 3 && rng() < 0.5 && rooms.length > 2) {
    const room = rooms[randInt(rng, 1, rooms.length - 1)];
    const s = spot(room);
    if (s) spawns.enemies.push({ ...s, kind: "death" });
  }

  return {
    grid,
    rooms,
    start: { x: startRoom.cx, y: startRoom.cy },
    spawns,
  };
}

function isChokepoint(grid, x, y) {
  if (grid[y][x] !== T.FLOOR) return false;
  const wall = (xx, yy) => grid[yy]?.[xx] === T.WALL;
  const open = (xx, yy) => grid[yy]?.[xx] === T.FLOOR;
  return (
    (wall(x, y - 1) && wall(x, y + 1) && open(x - 1, y) && open(x + 1, y)) ||
    (wall(x - 1, y) && wall(x + 1, y) && open(x, y - 1) && open(x, y + 1))
  );
}

// El bestiario se abre según bajas: cada pocas profundidades, un
// horror nuevo entra en la rotación con más peso.
function pickEnemyKind(rng, depth) {
  const pool = [
    ["ghost", 3],
    ["grunt", 3],
  ];
  if (depth >= 2) pool.push(["lobber", 2]);
  if (depth >= 3) pool.push(["demon", 2]);
  if (depth >= 4) pool.push(["sorcerer", 2]);
  if (depth >= 5) pool.push(["ogre", 1 + Math.min(2, Math.floor((depth - 5) / 2))]);

  let total = 0;
  for (const [, w] of pool) total += w;
  let roll = rng() * total;
  for (const [kind, w] of pool) {
    roll -= w;
    if (roll <= 0) return kind;
  }
  return "grunt";
}

function intersects(a, b, pad) {
  return (
    a.x - pad < b.x + b.w && a.x + a.w + pad > b.x &&
    a.y - pad < b.y + b.h && a.y + a.h + pad > b.y
  );
}

function carveRoom(grid, room) {
  for (let y = room.y; y < room.y + room.h; y++)
    for (let x = room.x; x < room.x + room.w; x++) grid[y][x] = T.FLOOR;
}

// Excava el pasillo en L y devuelve la lista ordenada de tiles del camino.
function carveCorridor(grid, rng, x1, y1, x2, y2) {
  const path = [];
  if (rng() < 0.5) {
    carveH(grid, x1, x2, y1, path);
    carveV(grid, y1, y2, x2, path);
  } else {
    carveV(grid, y1, y2, x1, path);
    carveH(grid, x1, x2, y2, path);
  }
  return path;
}

function carveH(grid, x1, x2, y, path) {
  const step = x2 >= x1 ? 1 : -1;
  for (let x = x1; x !== x2 + step; x += step) {
    grid[y][x] = T.FLOOR;
    path.push({ x, y });
  }
}

function carveV(grid, y1, y2, x, path) {
  const step = y2 >= y1 ? 1 : -1;
  for (let y = y1; y !== y2 + step; y += step) {
    grid[y][x] = T.FLOOR;
    path.push({ x, y });
  }
}
