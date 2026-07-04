// Efectos de sonido retro generados con WebAudio (sin ficheros).
let ctx = null;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function blip(freq, endFreq, dur, type = "square", vol = 0.06) {
  try {
    const a = ac();
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, a.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), a.currentTime + dur);
    gain.gain.setValueAtTime(vol, a.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    osc.connect(gain).connect(a.destination);
    osc.start();
    osc.stop(a.currentTime + dur);
  } catch (_) {
    // sin audio no se juega peor
  }
}

export const sfx = {
  shoot: () => blip(880, 220, 0.08),
  hit: () => blip(200, 80, 0.1, "sawtooth"),
  kill: () => blip(300, 60, 0.18, "sawtooth", 0.07),
  pickup: () => blip(660, 1320, 0.12),
  food: () => blip(440, 880, 0.15, "triangle", 0.09),
  door: () => blip(150, 300, 0.2, "square", 0.08),
  hurt: () => blip(120, 60, 0.15, "sawtooth", 0.09),
  potion: () => blip(220, 1760, 0.4, "sawtooth", 0.08),
  level: () => { blip(440, 880, 0.15); setTimeout(() => blip(660, 1320, 0.2), 120); },
  die: () => { blip(440, 55, 0.6, "sawtooth", 0.1); },
};
