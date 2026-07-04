// Sprites de 16x16 píxeles estilo Gauntlet arcade, definidos como texto
// y pre-renderizados a canvas. Cada letra es un color; "." es transparente.

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
      "..PPPPPPPPPPPP..",
      "..PPPPPPPPPPPP..",
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

export function getSprite(name, size) {
  const k = `${name}:${size}`;
  if (cache.has(k)) return cache.get(k);

  const { rows, palette } = SHAPES[name];
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
  cache.set(k, c);
  return c;
}

// Tiles del mapa al estilo del arcade: muro de bloques azul acero con
// bisel 3D, suelo de losas marrones, puerta-verja y portal de salida.
export function getTile(kind, size) {
  const k = `tile_${kind}:${size}`;
  if (cache.has(k)) return cache.get(k);

  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const u = size / 16;

  if (kind === "wall") {
    ctx.fillStyle = "#202638";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#5a6890"; // cara del bloque
    ctx.fillRect(u, u, size - 2 * u, size - 2 * u);
    ctx.fillStyle = "#8c9cc4"; // bisel superior e izquierdo
    ctx.fillRect(u, u, size - 2 * u, 2 * u);
    ctx.fillRect(u, u, 2 * u, size - 2 * u);
    ctx.fillStyle = "#38405c"; // sombra inferior y derecha
    ctx.fillRect(u, size - 3 * u, size - 2 * u, 2 * u);
    ctx.fillRect(size - 3 * u, u, 2 * u, size - 2 * u);
  } else if (kind === "floor") {
    ctx.fillStyle = "#6b563d";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#52402c"; // juntas de las losas
    ctx.fillRect(0, 0, size, u);
    ctx.fillRect(0, size / 2, size, u);
    ctx.fillRect(size / 2, 0, u, size / 2);
    ctx.fillRect(size / 4, size / 2, u, size / 2);
    ctx.fillStyle = "#77614a"; // brillo sutil
    ctx.fillRect(2 * u, 2 * u, 3 * u, u);
    ctx.fillRect(10 * u, 9 * u, 3 * u, u);
  } else if (kind === "door") {
    ctx.drawImage(getTile("floor", size), 0, 0);
    ctx.fillStyle = "#181008";
    ctx.fillRect(u, 0, size - 2 * u, size);
    ctx.fillStyle = "#d8a830"; // barrotes de la verja
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
