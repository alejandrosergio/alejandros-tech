# Avisos de terceros

## Letter Glitch · React Bits

La petición actual utiliza el preset Pixel con la paleta exacta `#ffffff`, `#ff6b6b`:

- Referencia: https://reactbits.dev/tools/background-studio?bg=letter-glitch&preset=pixel
- Código original: https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/LetterGlitch/LetterGlitch.jsx
- Blob del componente consultado: `19b40635beb5c05b0e3881e5dbd79e453be22ca4`.
- Presets: `src/demo/Backgrounds/presets/LetterGlitch.js`, blob `3e75aaadcb43a6f4f683517b217c03ab77a00421`. Pixel define A–Z, tamaño10, espaciado1 y fuente pixel.
- Autor: David Haz, copyright 2026.
- Licencia MIT + Commons Clause íntegra en `public/assets/licenses/react-bits.txt`, publicada en `/assets/licenses/react-bits.txt`. Blob de licencia: `4069ce9d0ef1a712c93d6ce48ade5d5667e0f5ee`.

La adaptación integrada dibuja A–Z mediante26 glifos locales de unos10px y Canvas2D. No descarga fuentes ni incorpora React/WebGL al fondo. Los glifos, el renderer y su integración son propios. No se distribuye el Studio ni una biblioteca reutilizable de componentes. La selección Binary anterior se retiró.

Solo cambia un grupo acotado del1,5% de letras cada120ms, sin destellos extensos ni repintado completo periódico. El lienzo se limita a 720.000 píxeles en escritorio y 360.000 en móvil; cuadrícula y memoria están acotadas y los temporizadores se suspenden en pestañas ocultas o fuera de vista. Movimiento reducido deja textura estática; contraste elevado y colores forzados ocultan la decoración.

Los espacios libres y los bordes de las secciones dejan ver el fondo. Las superficies de lectura se oscurecen al ocupar el centro de la vista; se ajustan desde el mismo ciclo de desplazamiento de la guía. La pausa y las preferencias de movimiento conservan superficies estáticas.

El botón del pie pausa el fondo; los anillos decorativos se sincronizan con ese estado mediante `alejandro:background-motion` con `{ paused: boolean }`. La capa es decorativa, está detrás del contenido y no intercepta el ratón ni añade lectura asistida. La portada recorta completamente la decoración en su región y suspende el trabajo cuando tapa toda la vista; fuera de ella se revela suavemente. Sin JavaScript o Canvas2D queda una textura CSS en páginas interiores, oculta en la home.

La licencia del efecto no altera la titularidad de fotografías, marca, contenido ni el resto del código. El efecto integrado no se ofrece como producto independiente.

## Splash Cursor · React Bits

La portada utiliza el preset Smoke, con los valores del enlace del titular:

- Referencia: https://reactbits.dev/tools/background-studio?bg=splash-cursor&preset=smoke&intensity=0.6&size=0.5
- Fuente primaria: https://github.com/DavidHDev/react-bits/blob/4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4/src/content/Animations/SplashCursor/SplashCursor.jsx
- Blob del componente: `3a073699c3aa520f99c8c68247edd78bf503e843`.
- Presets: `src/demo/Animations/presets/SplashCursor.js`, blob `d1917aec39dd67a68188ba2ebb5a1065453d9419` del mismo commit.
- Smoke: color `#e4e4e7`, sin arcoíris, intensidad0,6, tamaño0,5, fuerza0,8, remolino18, estela2,5, inercia1 y sombreado0,4; brillo0.
- Autor y licencia: David Haz2026, MIT + Commons Clause; aviso íntegro ya publicado en `/assets/licenses/react-bits.txt`.

La integración conserva la simulación de fluidos WebGL y adapta su ciclo de vida al sitio estático, sin React, fuentes remotas ni solicitudes de red. El tamaño de simulación y el de la tinta se acotan para móvil y escritorio. El lienzo vive dentro de la portada, detrás de la foto y sin interceptar clics, desplazamiento o zoom. Las páginas interiores no cargan el controlador.

Una introducción única de1,1s se inicia tras el loader; la estela tiene una cola máxima de5,9s y después no solicita más fotogramas en reposo. El render se limita a30fps y la calidad se reduce en pantallas estrechas. El contexto WebGL2, los formatos y los shaders se comprueban antes de mostrar el lienzo; ante un fallo permanece la portada sin humo.

La pausa común y las preferencias de accesibilidad prevalecen. La decoración no es necesaria para comprender o navegar la web, y el diseño estático permanece cuando el contexto gráfico no está disponible. No se distribuye un paquete o biblioteca del efecto.

## Light Rays · loader Underwater

- Referencia solicitada: https://reactbits.dev/tools/background-studio?bg=light-rays&preset=underwater
- Fuente: `src/content/Backgrounds/LightRays/LightRays.jsx`, blob `8133de5fefcc6856c6e3d43a363191e30a918049`, commit `4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4` de https://github.com/DavidHDev/react-bits.
- Presets: `src/demo/Backgrounds/presets/LightRays.js`, blob `f33e4854d9cf5861a013c9ca9ed6b2a2609c5f64`.
- Preset Underwater original: origen superior central, velocidad 0,5, apertura 1, longitud 3, densidad 1,6, inclinación 0, nitidez 0,5, brillo 0,6, neblina 0,5, atmósfera 0,7, intensidad 1, atenuación 1, saturación 1, ruido 0, distorsión 0,12, opacidad 1 y sin pulsación.
- Ajuste local solicitado para el loader: velocidad 0,65, brillo 0,75 e intensidad 1,2. Los demás parámetros indicados se conservan; estos tres valores no se atribuyen al preset original.
- El cian de referencia se sustituye por `--accent`, el tono elegido en accesibilidad; se utiliza la variante clara del shader cuando corresponde al tema.
- Autor y licencia: David Haz2026, MIT + Commons Clause, aviso íntegro conservado en `/assets/licenses/react-bits.txt`.

La adaptación usa el shader local con un único pase WebGL2, sin React, OGL, texturas o red. La apertura visual se adapta a 260 ms para que se aprecie durante el loader breve; no se añaden pulsos ni oscilaciones de brillo. El mínimo normal de 1200 ms, límite independiente de 2400 ms y salida directa son lógica del sitio, no del preset. El lienzo está limitado a 900.000 píxeles en escritorio y 360.000 en móvil, con render máximo 30 fps. Al finalizar se cancelan los fotogramas, se eliminan programa/VAO y la superficie vuelve a 1×1. Sin WebGL se muestra un abanico de luz CSS estático en el mismo tono. Movimiento reducido, mayor contraste y colores forzados conservan la entrada directa al contenido.

## Composición musical local

La composición de 112 BPM de `src/client/soundtrack.js` se escribió para Alejandro’sTech y usa síntesis Web Audio, sin grabaciones, pistas, samples ni servicios externos. No procede de React Bits. Los avisos anteriores no conceden una licencia sobre esa composición. Ver [AUDIO.md](AUDIO.md) para comportamiento y procedencia; no se presenta como «sin copyright».
