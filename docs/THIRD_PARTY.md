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
