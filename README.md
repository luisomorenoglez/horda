# HORDA

Un juego de acción arcade en el navegador, tributo al **Gauntlet** clásico (el de las recreativas y la Game Boy Advance). JavaScript vanilla, canvas y cero dependencias.

**los generadores no descansan. tú tampoco.**

🎮 **[Jugar ahora](https://luisomorenoglez.github.io/horda/)**

## Cómo se juega

Elige uno de los 4 héroes y desciende por niveles generados proceduralmente. Las reglas son las de siempre:

- **Tu salud baja sola, un punto por segundo.** La comida 🍗 es tu única salvación.
- Los **generadores** escupen enemigos sin parar hasta que los destruyes.
- Los fantasmas explotan al tocarte, los orcos pegan y los demonios lanzan bolas de fuego.
- Las **llaves** abren puertas; las **pociones** (tecla E) arrasan todo lo que hay en pantalla.
- Encuentra la salida dorada para bajar al siguiente nivel. Cada nivel es peor que el anterior.

## Los héroes

| Héroe | Lo suyo |
|---|---|
| 🔴 **Guerrero** | Disparos que duelen, cadencia lenta |
| 🟡 **Valquiria** | La mejor armadura del reino |
| 🟣 **Mago** | Magia rápida, piel de papel |
| 🟢 **Elfo** | El más veloz del oeste |

## Controles

| Tecla | Acción |
|---|---|
| `WASD` / flechas | Moverse (8 direcciones) |
| `Espacio` | Disparar en la dirección de movimiento |
| `E` | Usar poción (bomba de pantalla) |
| `R` | Volver a empezar (tras morir) |
| `1-4` | Elegir héroe en el título |

## Técnica

- **Sprites pixel-art de 8×8** definidos como texto en el código y pre-renderizados a canvas — no hay ni un solo fichero de imagen.
- **Sonido retro con WebAudio** — tampoco hay ficheros de audio: osciladores y envolventes.
- **Niveles procedurales** con RNG con semilla: salas encadenadas, pasillos, atajos con bucles, y puertas cuya llave siempre se coloca en una sala anterior (no hay softlocks).
- **Bucle en tiempo real** con `requestAnimationFrame`, delta-time con límite (el juego se pausa solo si cambias de pestaña), colisiones AABB contra el mapa de tiles y cámara con seguimiento.

```
js/
├── rng.js      # RNG con semilla (mulberry32)
├── level.js    # generación procedural de niveles
├── sprites.js  # pixel-art 8x8 renderizado a canvas
├── audio.js    # efectos de sonido por síntesis
├── game.js     # estado, física, IA, generadores, clases
├── render.js   # dibujado con cámara + HUD
└── main.js     # bucle, entrada, pantallas
```

## Ideas futuras

- [ ] Multijugador local (2 jugadores en el mismo teclado, como el original)
- [ ] "La comida ha sido destruida" — disparos que destruyen comida
- [ ] Ladrones que te roban y huyen
- [ ] La Muerte: intocable, te drena vida hasta consumirse
- [ ] Suelos de trampa y paredes que se desmoronan
- [ ] Gamepad API

---

Hecho con [Claude Code](https://claude.com/claude-code). Homenaje sin ánimo de lucro; Gauntlet es una marca de sus respectivos dueños — aquí no se usa ni un asset original.
