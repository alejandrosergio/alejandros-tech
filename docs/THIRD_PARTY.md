# Avisos de terceros

## Letter Glitch · React Bits

El titular solicitó el fondo Letter Glitch del Background Studio, preset Pixel, con la paleta `#ffffff`, `#ff6b6b`, `#40ffaa`, `#4079ff`:

- Referencia: https://reactbits.dev/tools/background-studio?bg=letter-glitch&preset=pixel&glitchColors=ffffff%2Cff6b6b%2C40ffaa%2C4079ff
- Código original: https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/LetterGlitch/LetterGlitch.jsx
- Blob del componente consultado: `19b40635beb5c05b0e3881e5dbd79e453be22ca4`.
- Definición del preset: `src/demo/Backgrounds/presets/LetterGlitch.js`, blob `3e75aaadcb43a6f4f683517b217c03ab77a00421`.
- Autor: David Haz, copyright 2026.
- Licencia: MIT + Commons Clause; texto íntegro en `public/assets/licenses/react-bits.txt`, publicado en `/assets/licenses/react-bits.txt`. Blob de la licencia: `4069ce9d0ef1a712c93d6ce48ade5d5667e0f5ee`.

La web incluye una adaptación integrada de la cuadrícula y los cambios de letras del efecto. El original actual utiliza React y WebGL2. Su preset Pixel usa letras A–Z, tamaño 10, espaciado 1 y Press Start 2P. Esta adaptación conserva el alfabeto y la paleta solicitados mediante un pequeño alfabeto local de píxeles y Canvas 2D, sin descargar fuentes ni incorporar React/WebGL al fondo. Los glifos, el renderer y la integración del ciclo de vida son propios. No se distribuye el Studio ni una biblioteca reutilizable de componentes.

La densidad y los cambios se reducen para conservar la lectura y compartir recursos con el busto 3D. Solo cambian unas pocas letras cada 180 ms, sin destellos extensos, reacción al clic, intro ni ráfagas. El lienzo se limita a 720.000 píxeles en escritorio y 360.000 en móvil, con cuadrícula y memoria acotadas; los temporizadores se suspenden en pestañas ocultas o fuera de vista. Movimiento reducido deja una versión estática tenue; mayor contraste y colores forzados ocultan el efecto.

El botón del pie controla solo el fondo. La pausa de la escena puede sincronizarlo mediante el evento `alejandro:background-motion` con `{ paused: boolean }`; los ajustes de movimiento del visitante tienen prioridad. Sin JavaScript o Canvas 2D queda una textura CSS decorativa. La capa está detrás del contenido, no intercepta el ratón y se oculta a tecnologías de asistencia.

La licencia indicada corresponde a la adaptación de este efecto y no altera la titularidad de las fotografías, la marca, el contenido o el resto del código del sitio. La integración forma parte de esta web; el efecto y sus exportaciones no se ofrecen como producto o paquete independiente.
