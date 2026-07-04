// Sprites de 8x8 píxeles definidos como texto y pre-renderizados a canvas.
// Cada letra es un color de la paleta del sprite; "." es transparente.

const HERO_SHAPE = [
  "..HHHH..",
  "..FFFF..",
  "..FFFF..",
  ".BTTTTB.",
  ".BTTTTB.",
  "..TTTT..",
  "..L..L..",
  "..LL.LL.",
];

const SHAPES = {
  ghost: {
    rows: [
      "..WWWW..",
      ".WWWWWW.",
      ".WEWWEW.",
      ".WWWWWW.",
      ".WWWWWW.",
      ".WWWWWW.",
      ".W.WW.W.",
      "........",
    ],
    palette: { W: "#c8d8e8", E: "#182030" },
  },
  grunt: {
    rows: [
      "..GGGG..",
      ".GGGGGG.",
      ".GEGGEG.",
      "..GGGG..",
      ".BGGGGB.",
      ".BGGGGB.",
      "..G..G..",
      "..GG.GG.",
    ],
    palette: { G: "#6a9a45", E: "#f0e020", B: "#4a6a30" },
  },
  demon: {
    rows: [
      ".R....R.",
      ".RR..RR.",
      "..RRRR..",
      ".RRRRRR.",
      "RRERRERR",
      ".RRRRRR.",
      "..R..R..",
      ".R....R.",
    ],
    palette: { R: "#c04030", E: "#ffd030" },
  },
  generator: {
    rows: [
      "........",
      "..PPPP..",
      ".PXXXXP.",
      "PXPCCPXP",
      "PXPCCPXP",
      ".PXXXXP.",
      "..PPPP..",
      "........",
    ],
    palette: { P: "#7a4a9a", X: "#3a1a5a", C: "#e050e0" },
  },
  food: {
    rows: [
      "........",
      "...MMM..",
      "..MMMMM.",
      "..MMMMM.",
      "...MMM..",
      "....BB..",
      ".....BB.",
      "......W.",
    ],
    palette: { M: "#c07840", B: "#e8d8b0", W: "#f8f8f0" },
  },
  key: {
    rows: [
      "........",
      "..YYY...",
      "..Y.Y...",
      "..YYY...",
      "...Y....",
      "...YY...",
      "...Y....",
      "...YY...",
    ],
    palette: { Y: "#e8c840" },
  },
  treasure: {
    rows: [
      "........",
      ".CCCCCC.",
      ".CYYYYC.",
      ".CCCCCC.",
      ".CYCCYC.",
      ".CCCCCC.",
      ".CCCCCC.",
      "........",
    ],
    palette: { C: "#9a6a30", Y: "#f0d050" },
  },
  potion: {
    rows: [
      "...KK...",
      "...KK...",
      "..PPPP..",
      ".PPPPPP.",
      ".PWPPPP.",
      ".PPPPPP.",
      "..PPPP..",
      "........",
    ],
    palette: { K: "#8a6a4a", P: "#4060d0", W: "#90b0f0" },
  },
  exit: {
    rows: [
      "YYYYYYYY",
      "Y......Y",
      "Y.YYYY.Y",
      "Y.Y..Y.Y",
      "Y.Y..Y.Y",
      "Y.YYYY.Y",
      "Y......Y",
      "YYYYYYYY",
    ],
    palette: { Y: "#e8b830" },
  },
};

// Paletas de héroe por clase (color de túnica/casco).
const HERO_PALETTES = {
  guerrero: { H: "#b03030", F: "#e0b090", T: "#b03030", B: "#802020", L: "#604030" },
  valquiria: { H: "#e8c840", F: "#e0b090", T: "#e8c840", B: "#b09020", L: "#705030" },
  mago: { H: "#8040c0", F: "#e0b090", T: "#8040c0", B: "#502880", L: "#403050" },
  elfo: { H: "#40a050", F: "#e0b090", T: "#40a050", B: "#287038", L: "#405030" },
};

const cache = new Map();

export function getSprite(name, size) {
  const k = `${name}:${size}`;
  if (cache.has(k)) return cache.get(k);

  let rows, palette;
  if (name.startsWith("hero_")) {
    rows = HERO_SHAPE;
    palette = HERO_PALETTES[name.slice(5)];
  } else {
    ({ rows, palette } = SHAPES[name]);
  }

  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const px = size / 8;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const ch = rows[y][x];
      if (ch === ".") continue;
      ctx.fillStyle = palette[ch] || "#ff00ff";
      ctx.fillRect(Math.floor(x * px), Math.floor(y * px), Math.ceil(px), Math.ceil(px));
    }
  }
  cache.set(k, c);
  return c;
}

// Tiles del mapa pre-renderizados (muro de ladrillo, suelo, puerta).
export function getTile(kind, size) {
  const k = `tile_${kind}:${size}`;
  if (cache.has(k)) return cache.get(k);

  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");

  if (kind === "wall") {
    ctx.fillStyle = "#3a3a52";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#4a4a66";
    const h = size / 4;
    for (let row = 0; row < 4; row++) {
      const off = row % 2 === 0 ? 0 : size / 2;
      for (let col = -1; col < 2; col++) {
        ctx.fillRect(off + col * size, row * h + 1, size - 2, h - 2);
      }
    }
  } else if (kind === "floor") {
    ctx.fillStyle = "#14141c";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#191924";
    ctx.fillRect(1, 1, size - 2, size - 2);
  } else if (kind === "door") {
    ctx.fillStyle = "#6a4a28";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#845c34";
    for (let i = 0; i < 4; i++) ctx.fillRect(i * (size / 4) + 1, 0, size / 4 - 2, size);
    ctx.fillStyle = "#e8c840";
    ctx.fillRect(size * 0.62, size * 0.45, size * 0.14, size * 0.14);
  }

  cache.set(k, c);
  return c;
}
