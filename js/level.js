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

  const doors = [];
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1];
    const b = rooms[i];
    const doorSpot = carveCorridor(grid, rng, a.cx, a.cy, b.cx, b.cy);
    // Puertas a partir de la 3ª sala; la llave irá en una sala anterior.
    if (i >= 2 && doorSpot && rng() < 0.4) {
      doors.push({ ...doorSpot, keyRoom: randInt(rng, 0, i - 1) });
    }
  }

  // Un par de atajos entre salas lejanas (sin puertas) para que haya bucles.
  for (let i = 0; i < 2 && rooms.length > 5; i++) {
    const a = pick(rng, rooms);
    const b = pick(rng, rooms);
    if (a !== b) carveCorridor(grid, rng, a.cx, a.cy, b.cx, b.cy);
  }

  for (const d of doors) {
    if (grid[d.y][d.x] === T.FLOOR) grid[d.y][d.x] = T.DOOR;
  }

  const startRoom = rooms[0];
  const exitRoom = rooms[rooms.length - 1];
  grid[exitRoom.cy][exitRoom.cx] = T.EXIT;

  // Poblar: generadores, comida, tesoro, llaves, pociones, enemigos sueltos.
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

  const genChance = Math.min(0.85, 0.45 + depth * 0.06);
  for (let i = 1; i < rooms.length; i++) {
    const room = rooms[i];
    if (rng() < genChance) {
      const s = spot(room);
      if (s) spawns.generators.push({ ...s, kind: pickEnemyKind(rng, depth) });
    }
    if (depth >= 3 && rng() < 0.3) {
      const s = spot(room);
      if (s) spawns.generators.push({ ...s, kind: pickEnemyKind(rng, depth) });
    }
    if (rng() < 0.4) {
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
    // Enemigos ya deambulando al llegar.
    const n = randInt(rng, 0, 2);
    for (let j = 0; j < n; j++) {
      const s = spot(room);
      if (s) spawns.enemies.push({ ...s, kind: pickEnemyKind(rng, depth) });
    }
  }

  return {
    grid,
    rooms,
    start: { x: startRoom.cx, y: startRoom.cy },
    spawns,
  };
}

function pickEnemyKind(rng, depth) {
  const roll = rng();
  if (depth >= 4 && roll < 0.25) return "demon";
  if (depth >= 2 && roll < 0.55) return "grunt";
  return roll < 0.5 ? "ghost" : "grunt";
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

// Devuelve el punto medio del pasillo (candidato a puerta).
function carveCorridor(grid, rng, x1, y1, x2, y2) {
  const horizFirst = rng() < 0.5;
  if (horizFirst) {
    carveH(grid, x1, x2, y1);
    carveV(grid, y1, y2, x2);
    return { x: Math.floor((x1 + x2) / 2), y: y1 };
  }
  carveV(grid, y1, y2, x1);
  carveH(grid, x1, x2, y2);
  return { x: x1, y: Math.floor((y1 + y2) / 2) };
}

function carveH(grid, x1, x2, y) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) grid[y][x] = T.FLOOR;
}

function carveV(grid, y1, y2, x) {
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) grid[y][x] = T.FLOOR;
}
