# Avisos de terceros

## IA local opcional · WebLLM / Qwen3.5

- [WebLLM 0.2.87](https://github.com/mlc-ai/web-llm), MLC-AI, Apache-2.0. Aviso completo en `/assets/licenses/web-llm.txt`. El SDK y su runtime se distribuyen en el bundle del worker opcional de la demo.
- Dependencia loglevel, Tim Perry, licencia MIT, conservada en `/assets/licenses/loglevel.txt`.
- [Runtime compilado MLC](https://github.com/mlc-ai/binary-mlc-llm-libs/tree/146ed9cd4b4062e967b017fd2291f7106b50599f), versión `v0_2_87/base`, para Qwen3.5-0.8B; fuente y hash en `ASSETS.md`.
- [Qwen3.5-0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B), Qwen Team, Apache-2.0. Los pesos cuantizados de MLC se descargan desde Hugging Face al activar la IA; no se guardan en el repositorio ni en el archivo de publicación.
- esbuild 0.28.2 es una herramienta de generación con licencia MIT y no forma parte del código de ejecución del navegador.

El visitante activa expresamente la descarga. Las preguntas y respuestas se procesan en su dispositivo. No se conecta una API de pago ni se envía el texto a un proveedor de IA. La conexión de descarga de archivos tiene su funcionamiento normal de red. Ver `AI-DEMO.md` para límites, caché y privacidad. Estas licencias no conceden derechos sobre la marca, fotografías o contenido original del sitio.

## Letter Glitch Classic · React Bits

- Referencia: https://reactbits.dev/tools/background-studio?bg=letter-glitch&preset=classic
- Fuente primaria: https://github.com/DavidHDev/react-bits/blob/4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4/src/content/Backgrounds/LetterGlitch/LetterGlitch.jsx
- Blob del componente: `19b40635beb5c05b0e3881e5dbd79e453be22ca4`; presets en `src/demo/Backgrounds/presets/LetterGlitch.js`, blob `3e75aaadcb43a6f4f683517b217c03ab77a00421` del mismo commit.
- Classic: fuente monoespaciada14px, espaciado0,1, densidad1, base `#2b4539` con opacidad1, destellos `#61dca3`/`#61b3dc`, glitch0,85, velocidad1, suavizado activo y flujo0. Incluye letras, cifras y símbolos. La variante clara usa base `#a3c2b2` y destellos `#047857`/`#0369a1`.
- Autor: David Haz2026. Licencia MIT + Commons Clause íntegra en `public/assets/licenses/react-bits.txt` y `/assets/licenses/react-bits.txt`; blob `4069ce9d0ef1a712c93d6ce48ade5d5667e0f5ee`.

La integración adapta el aspecto Classic a Canvas2D con fuente de sistema, sin React, WebGL, fuentes remotas ni peticiones del fondo. La apariencia tiene una única definición en `src/content/background.mjs`. Se retiraron el alfabeto bitmap, los metadatos y el tratamiento pixelado de Pixel. No se distribuyen el Studio ni una biblioteca reutilizable.

El render local permite hasta25fps de transición de color, cambia grupos de hasta2% cada100ms y limita las celdas de brillo simultáneas a600/240 en escritorio/móvil. El lienzo está limitado a720.000/360.000 píxeles y la cuadrícula a9.000/3.000 celdas. Solo se repintan celdas modificadas o en transición; pausa, pestaña oculta, loader y portada completa suspenden los temporizadores. Movimiento reducido conserva textura estática; contraste elevado y colores forzados ocultan el adorno.

Las superficies de lectura casi opacas protegen el contenido y dejan ver el fondo en sus transiciones. La portada lo recorta para conservar su humo independiente. El control del pie y el evento `alejandro:background-motion` siguen pausando tanto este fondo como los anillos. No se capturan clics ni se altera el scroll. La licencia no afecta a las fotografías, marca ni el resto del contenido.

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

## Grid Scan · loader Deep

- Referencia solicitada: https://reactbits.dev/tools/background-studio?bg=grid-scan&preset=deep
- Fuente: `src/content/Backgrounds/GridScan/GridScan.jsx`, blob `1dcda3a7c39864e5ff5105041cd92fea5e378f3d`, commit `4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4` de https://github.com/DavidHDev/react-bits.
- Presets: `src/demo/Backgrounds/presets/GridScan.js`, blob `6639f8318bb325a664ecf04eede31f95db1b510b`.
- Deep: diez celdas, profundidad 8, atenuación 0,6, sombreado 0,7, reflexión 0,35, puntos, líneas continuas, barrido hacia delante de 4s con pausa de 1,6s, ancho 1, estela 0,7 y brillo 0,6. La introducción conserva el barrido inicial de 2,2s del componente.
- La base de líneas conserva #4d4757. El cian de referencia se sustituye por `--accent`; el núcleo y la neblina responden también al tema claro/oscuro.
- Autor y licencia: David Haz 2026, MIT + Commons Clause, aviso íntegro conservado en `/assets/licenses/react-bits.txt`.

La integración adapta la geometría de sala, trazado, barrido, reflejos y puntos a un pase WebGL2 con brillo local. Se retiran React, webcam, modelos remotos, texturas de bloom, estilos de línea no utilizados, pulsos y controles de puntero. El efecto no descarga recursos ni captura gestos. Su límite es de 900.000 píxeles en escritorio y 360.000 en móvil, con hasta 30fps. El tiempo visible dirige el barrido sin añadir pases de recuperación; las pestañas ocultas no avanzan la animación. Al terminar se cancelan fotogramas, se eliminan programa/VAO y el lienzo vuelve a 1×1. El antiguo efecto de rayos se elimina del código y la salida generada.

La permanencia de 2000ms después de window.load pertenece al sitio. Un vigilante de 10000ms cubre solo la espera del evento y se cancela al recibirlo, por lo que no acorta los dos segundos en una carga lenta. Botón y teclado conservan salida inmediata. Movimiento reducido, alto contraste y colores forzados permiten entrada directa. Sin WebGL aparece una rejilla CSS estática en el tono elegido.

## Composición musical local

La composición de 112 BPM de `src/client/soundtrack.js` se escribió para Alejandro’sTech y usa síntesis Web Audio, sin grabaciones, pistas, samples ni servicios externos. No procede de React Bits. Los avisos anteriores no conceden una licencia sobre esa composición. Ver [AUDIO.md](AUDIO.md) para comportamiento y procedencia; no se presenta como «sin copyright».
