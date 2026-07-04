// Sprites de 16x16 píxeles estilo Gauntlet arcade, definidos como texto
// y pre-renderizados a canvas. Cada letra es un color; "." es transparente.
//
// Los personajes se animan: el frame alterno de andar se genera
// desplazando las piernas hacia dentro, la vista "arriba" borra la cara
// y la vista lateral es un volteo horizontal.

const SHAPES = {
  hero_guerrero: {
    rows: [
      "................",
      "..WW........WW..",
      ".WWW........WWW.",
      "..HHHHHHHHHHHH..",
      "..HHHHHHHHHHHH..",
      "...SSESSSSES....",
      "...SSSSSSSSSS...",
      "..RRRRRRRRRRRR..",
      ".SRRRRRRRRRRRRS.",
      ".S.RRRRRRRRRR.S.",
      "CC..RRRRRRRR....",
      "CC..RRR..RRR....",
      "....RR....RR....",
      "....BB....BB....",
      "...BBB....BBB...",
      "................",
    ],
    palette: { W: "#d8d8cc", H: "#8890a4", S: "#e0b088", E: "#201810", R: "#b03028", B: "#5a3a22", C: "#8a6a40" },
  },
  hero_valquiria: {
    rows: [
      "................",
      ".W....HHHH....W.",
      ".WW..HHHHHH..WW.",
      ".WWW.HHHHHH.WWW.",
      "....HHHHHHHH....",
      "...SSESSSSES....",
      "...SSSSSSSSSS...",
      "..YYYYYYYYYYYY..",
      ".SYYYYYYYYYYYYS.",
      ".S.YYYYYYYYYY.S.",
      "DD..YYYYYYYY....",
      "DD..YYY..YYY....",
      "....RR....RR....",
      "....BB....BB....",
      "...BBB....BBB...",
      "................",
    ],
    palette: { W: "#e8e8e0", H: "#d8b030", S: "#e0b088", E: "#201810", Y: "#c8a028", D: "#b0b8c8", R: "#8a2020", B: "#5a3a22" },
  },
  hero_mago: {
    rows: [
      ".......PP.......",
      "......PPPP......",
      ".....PPPPPP.....",
      "....PPPPPPPP....",
      "..PPPPPPPPPPPP..",
      "...SSESSSSES....",
      "...WWWWWWWWWW...",
      "..PPWWWWWWWWPP..",
      ".SPPPPPPPPPPPPS.",
      ".S.PPPPPPPPPP.S.",
      "...PPPPPPPPPP...",
      "...PPPPPPPPPP...",
      "..PPPP...PPPP...",
      "..PPPP...PPPP...",
      "................",
      "................",
    ],
    palette: { P: "#7038b8", S: "#e0b088", E: "#201810", W: "#e8e8e8" },
  },
  hero_elfo: {
    rows: [
      "................",
      ".....GGGGGG.....",
      "....GGGGGGGG....",
      "...GGGGGGGGGG...",
      "...GSSESSSESG...",
      "....SSSSSSSS....",
      "...LLLLLLLLLL...",
      "..SLLLLLLLLLLS..",
      "..S.LLLLLLLL.S..",
      "CC..LLLLLLLL....",
      "C...LLL..LLL....",
      "C....LL..LL.....",
      ".....BB..BB.....",
      "....BBB..BBB....",
      "................",
      "................",
    ],
    palette: { G: "#2f7a3a", S: "#e0b088", E: "#201810", L: "#57a34a", C: "#8a6a40", B: "#5a3a22" },
  },
  ghost: {
    rows: [
      "................",
      ".....WWWWWW.....",
      "....WWWWWWWW....",
      "...WWWWWWWWWW...",
      "...WWWWWWWWWW...",
      "...WBBWWWWBBW...",
      "...WBBWWWWBBW...",
      "...WWWWWWWWWW...",
      "...WWWWBBWWWW...",
      "...WWWWBBWWWW...",
      "...WWWWWWWWWW...",
      "...WWWWWWWWWW...",
      "...WWWWWWWWWW...",
      "...WW.WWWW.WW...",
      "...W...WW...W...",
      "................",
    ],
    palette: { W: "#e8ecf4", B: "#101018" },
  },
  grunt: {
    rows: [
      "................",
      ".....GGGGGG.....",
      "....GGGGGGGG....",
      "....GEEGGEEG....",
      "....GGGGGGGG....",
      ".....GTTTTG.....",
      "....DDDDDDDD....",
      "...GDDDDDDDDG...",
      "..CCDDDDDDDD....",
      "..CC.DDDDDD.....",
      ".....DD..DD.....",
      ".....GG..GG.....",
      "....GGG..GGG....",
      "................",
      "................",
      "................",
    ],
    palette: { G: "#5f8a3a", E: "#f0d020", T: "#e8e8d8", D: "#6a5030", C: "#7a5a34" },
  },
  demon: {
    rows: [
      "..R.........R...",
      "..RR.......RR...",
      "...RRRRRRRRRR...",
      "...RRRRRRRRRR...",
      "..RRYYRRRRYYRR..",
      "..RRRRRRRRRRRR..",
      "..RRWWWWWWWWRR..",
      "...RRRRRRRRRR...",
      ".DRRRRRRRRRRRRD.",
      "DD.RRRRRRRRRR.DD",
      "....RRRRRRRR....",
      "....RRR..RRR....",
      "....RR....RR....",
      "...RRR....RRR...",
      "................",
      "................",
    ],
    palette: { R: "#c03828", Y: "#f0d020", W: "#f0f0e0", D: "#801818" },
  },
  death: {
    rows: [
      "................",
      "......KKKK......",
      ".....KKKKKK.....",
      "....KKKKKKKK....",
      "....KWWWWWWK....",
      "....KWBWWBWK....",
      "....KWWWWWWK....",
      "....KKWWWWKK....",
      "...KKKKKKKKKK...",
      "..KKKKKKKKKKKK..",
      "..KKKKKKKKKKKK..",
      "..KKKKKKKKKKKK..",
      "...KKKKKKKKKK...",
      "...KK.KKKK.KK...",
      "................",
      "................",
    ],
    palette: { K: "#262636", W: "#e8e8e0", B: "#000000" },
  },
  gen_ghost: {
    rows: [
      "................",
      "................",
      "......WWWW......",
      ".....WWWWWW.....",
      ".....WBWWBW.....",
      ".....WWWWWW.....",
      "......WBBW......",
      "...WW.WWWW.WW...",
      "..WWWWWWWWWWWW..",
      ".WWBWWWWWWWWBWW.",
      "WWWWWWWWWWWWWWWW",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: { W: "#e0dcc8", B: "#201c14" },
  },
  gen_grunt: {
    rows: [
      "................",
      "....DDDDDDDD....",
      "...DDDDDDDDDD...",
      "..DDDDDDDDDDDD..",
      "..BBBBBBBBBBBB..",
      "..BBBBBBBBBBBB..",
      "..BBBKKKKKKBBB..",
      "..BBBK....KBBB..",
      "..BBBK....KBBB..",
      "..BBBK....KBBB..",
      "..BBBBBBBBBBBB..",
      "..BBBBBBBBBBBB..",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: { D: "#4a3520", B: "#7a5a34", K: "#140f08" },
  },
  gen_demon: {
    rows: [
      "................",
      "....F..FF..F....",
      "...FF.FFFF.FF...",
      "..FFFFFFFFFFFF..",
      "..RRRRRRRRRRRR..",
      "..RRYYRRRRYYRR..",
      "..RRRRRRRRRRRR..",
      "...RRRRRRRRRR...",
      ".DDDDDDDDDDDDDD.",
      ".DDDDDDDDDDDDDD.",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: { F: "#f08828", R: "#b02818", Y: "#f0d020", D: "#401010" },
  },
  food: {
    rows: [
      "................",
      "................",
      ".....TTTTTT.....",
      "....TTTTTTTT....",
      "...TTTTTTTTTT...",
      "...TTTTTTTTTT...",
      "...TTTTTTTTWW...",
      "....TTTTTT..W...",
      "..PPPPPPPPPPPP..",
      ".PPPPPPPPPPPPPP.",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: { T: "#c88a3c", W: "#f0ead8", P: "#b8bcc8" },
  },
  key: {
    rows: [
      "................",
      "................",
      "................",
      "................",
      "................",
      "...YYY..........",
      "..Y...Y.........",
      "..Y...YYYYYYYYY.",
      "..Y...Y...Y.Y.Y.",
      "...YYY.....Y.Y..",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: { Y: "#e8c030" },
  },
  treasure: {
    rows: [
      "................",
      "................",
      "................",
      "...BBBBBBBBBB...",
      "..BBBBBBBBBBBB..",
      "..BYYYYYYYYYYB..",
      "..BBBBBBBBBBBB..",
      "..BBBBBYYBBBBB..",
      "..BBBBBYYBBBBB..",
      "..BBBBBBBBBBBB..",
      "..BBBBBBBBBBBB..",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: { B: "#8a5c28", Y: "#f0c840" },
  },
  potion: {
    rows: [
      "................",
      "................",
      ".......KK.......",
      ".......KK.......",
      "......GGGG......",
      ".....PPPPPP.....",
      "....PPPPPPPP....",
      "....PWPPPPPP....",
      "....PPPPPPPP....",
      ".....PPPPPP.....",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
    palette: { K: "#8a6242", G: "#90a8c0", P: "#3050c8", W: "#a8c0f0" },
  },
};

const cache = new Map();

// Frame alterno de andar: las piernas (filas bajas) convergen hacia dentro.
function altRows(rows) {
  return rows.map((r, i) => {
    if (i < 10) return r;
    const left = ("." + r.slice(0, 8)).slice(0, 8);
    const right = r.slice(9) + ".";
    return left + right;
  });
}

function drawRows(rows, palette, size) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const px = size / 16;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const ch = rows[y][x];
      if (ch === ".") continue;
      ctx.fillStyle = palette[ch] || "#ff00ff";
      ctx.fillRect(Math.floor(x * px), Math.floor(y * px), Math.ceil(px), Math.ceil(px));
    }
  }
  return c;
}

function flip(canvas) {
  const c = document.createElement("canvas");
  c.width = canvas.width;
  c.height = canvas.height;
  const ctx = c.getContext("2d");
  ctx.translate(c.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(canvas, 0, 0);
  return c;
}

// Sprite estático (ítems, generadores, iconos).
export function getSprite(name, size) {
  const k = `${name}:${size}`;
  if (cache.has(k)) return cache.get(k);
  const { rows, palette } = SHAPES[name];
  const c = drawRows(rows, palette, size);
  cache.set(k, c);
  return c;
}

// Sprite de personaje con dirección ("down" | "up" | "left" | "right")
// y frame de animación (0 | 1).
export function getCharSprite(name, dir, frame, size) {
  const k = `${name}:${dir}:${frame}:${size}`;
  if (cache.has(k)) return cache.get(k);

  const { rows, palette } = SHAPES[name];
  let r = frame === 1 ? altRows(rows) : rows;
  if (dir === "up") r = r.map((row) => row.replace(/E/g, "S"));
  let c = drawRows(r, palette, size);
  if (dir === "left") c = flip(c);
  cache.set(k, c);
  return c;
}

// Proyectiles: el arma de cada héroe, dibujada pequeña para girarla al vuelo.
export function getWeapon(kind, size) {
  const k = `weapon_${kind}:${size}`;
  if (cache.has(k)) return cache.get(k);

  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const u = size / 12;

  if (kind === "axe") {
    ctx.fillStyle = "#8a6a40"; // mango en diagonal
    for (let i = 0; i < 8; i++) ctx.fillRect((2 + i) * u, (9 - i) * u, u * 1.4, u * 1.4);
    ctx.fillStyle = "#c8ccd8"; // filo
    ctx.fillRect(7 * u, u, 4 * u, 3 * u);
    ctx.fillRect(6 * u, 2 * u, u, 2 * u);
  } else if (kind === "sword") {
    ctx.fillStyle = "#d0d4e0"; // hoja
    ctx.fillRect(5 * u, u, 2 * u, 7 * u);
    ctx.fillStyle = "#c8a028"; // guarda y pomo
    ctx.fillRect(3.5 * u, 8 * u, 5 * u, 1.4 * u);
    ctx.fillRect(5 * u, 9.4 * u, 2 * u, 2 * u);
  } else if (kind === "fire") {
    const grad = ctx.createRadialGradient(size / 2, size / 2, u, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "#fff0a0");
    grad.addColorStop(0.5, "#f09030");
    grad.addColorStop(1, "rgba(200,40,20,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  } else if (kind === "arrow") {
    ctx.fillStyle = "#8a6a40"; // astil horizontal
    ctx.fillRect(u, 5.4 * u, 8 * u, 1.2 * u);
    ctx.fillStyle = "#c8ccd8"; // punta
    ctx.fillRect(9 * u, 4.5 * u, u, 3 * u);
    ctx.fillRect(10 * u, 5 * u, u, 2 * u);
    ctx.fillStyle = "#d8d8cc"; // plumas
    ctx.fillRect(0, 4.5 * u, u, u);
    ctx.fillRect(0, 6.5 * u, u, u);
  }

  cache.set(k, c);
  return c;
}

// Paletas de nivel, como el arcade: el color de la mazmorra cambia al bajar.
const THEMES = [
  { wallFace: "#5a6890", wallHi: "#8c9cc4", wallLo: "#38405c", outline: "#202638", floor: "#6b563d", joint: "#52402c", spark: "#77614a" },
  { wallFace: "#58885a", wallHi: "#8cc08c", wallLo: "#365838", outline: "#1e2c1e", floor: "#565a6a", joint: "#3e424e", spark: "#686c7e" },
  { wallFace: "#985058", wallHi: "#c88890", wallLo: "#602830", outline: "#2c1418", floor: "#4e3e30", joint: "#3a2d22", spark: "#5c4a3a" },
  { wallFace: "#a89058", wallHi: "#d0c088", wallLo: "#706030", outline: "#302810", floor: "#3e5a5a", joint: "#2c4444", spark: "#4a6a6a" },
];

export function themeCount() {
  return THEMES.length;
}

export function getTile(kind, size, themeIdx = 0) {
  const k = `tile_${kind}:${size}:${themeIdx}`;
  if (cache.has(k)) return cache.get(k);

  const t = THEMES[themeIdx % THEMES.length];
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const u = size / 16;

  if (kind === "wall") {
    ctx.fillStyle = t.outline;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = t.wallFace;
    ctx.fillRect(u, u, size - 2 * u, size - 2 * u);
    ctx.fillStyle = t.wallHi; // bisel superior e izquierdo
    ctx.fillRect(u, u, size - 2 * u, 2 * u);
    ctx.fillRect(u, u, 2 * u, size - 2 * u);
    ctx.fillStyle = t.wallLo; // sombra inferior y derecha
    ctx.fillRect(u, size - 3 * u, size - 2 * u, 2 * u);
    ctx.fillRect(size - 3 * u, u, 2 * u, size - 2 * u);
  } else if (kind === "floor") {
    ctx.fillStyle = t.floor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = t.joint;
    ctx.fillRect(0, 0, size, u);
    ctx.fillRect(0, size / 2, size, u);
    ctx.fillRect(size / 2, 0, u, size / 2);
    ctx.fillRect(size / 4, size / 2, u, size / 2);
    ctx.fillStyle = t.spark;
    ctx.fillRect(2 * u, 2 * u, 3 * u, u);
    ctx.fillRect(10 * u, 9 * u, 3 * u, u);
  } else if (kind === "door") {
    ctx.drawImage(getTile("floor", size, themeIdx), 0, 0);
    ctx.fillStyle = "#181008";
    ctx.fillRect(u, 0, size - 2 * u, size);
    ctx.fillStyle = "#d8a830"; // barrotes
    for (let i = 0; i < 4; i++) ctx.fillRect((2 + i * 4) * u, 0, u * 1.2, size);
    ctx.fillRect(u, 7 * u, size - 2 * u, u * 1.4); // travesaño
  } else if (kind === "exit") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#e8b830";
    ctx.lineWidth = u;
    ctx.strokeRect(u / 2, u / 2, size - u, size - u);
    ctx.fillStyle = "#f0f0f0";
    ctx.font = `bold ${Math.floor(size * 0.32)}px "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("EXIT", size / 2, size / 2 + u / 2);
  }

  cache.set(k, c);
  return c;
}
