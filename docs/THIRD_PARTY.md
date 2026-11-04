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
