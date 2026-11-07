# Recursos visuales y procedencia

## Estado actual

La portada usa la fotografía `public/assets/sergio-natural-appearance.webp` mediante un elemento HTML `img`. Su movimiento es un zoom CSS acotado; no hay modelo, canvas de retrato ni seguimiento de cabeza. La pausa y el movimiento reducido dejan la imagen en su pose neutra. Los lienzos de humo y rejilla del loader son decoraciones independientes, no visualizadores de la persona.

Por petición del titular se eliminaron de la fuente el generador, lector, visualizador y pruebas del antiguo busto 3D. Su historial se conserva en Git, sin archivos 3D en la implementación vigente.

## Imágenes que se conservan

| Recurso local en `public/assets/` | Uso actual |
| --- | --- |
| `sergio-natural-appearance.webp` | Retrato de la portada, preparado a partir de la foto original. |
| `sergio-hernandez.jpeg` | Foto pública original de estudio y avatar en la firma de las notas técnicas. |
| `alejandros-tech-preview.jpg` | Portada actual en español, en tarjeta, ficha e imagen social del proyecto. |
| `alejandros-tech-preview-en.jpg` | Portada actual en inglés, en tarjeta, ficha e imagen social del proyecto. |
| `cv-preview.jpg` | Captura actual del CV en español, en tarjeta, ficha e imagen social. |
| `cv-preview-en.jpg` | Captura actual del CV en inglés, en tarjeta, ficha e imagen social. |
| `document-assistant-preview.svg` | Diagrama original del flujo del asistente en español, no una captura de conversación. |
| `document-assistant-preview-en.svg` | El mismo diagrama de biblioteca, contexto, modelo y fuentes, en inglés. |

## Capturas actuales de proyectos

Capturas JPEG nativas de navegador, tomadas el 6 de noviembre de 2026, sin retoque, recorte ni generación de imágenes. Se usó una ventana de prueba de 1280 × 900; la captura devuelta mide 1280 × 900 para Alejandro’sTech y 1265 × 889 para el CV. Se conservan sus bytes y dimensiones originales, que el modelo de proyecto declara en el HTML. Cada captura se reutiliza en la tarjeta y en la ficha, evitando copias duplicadas. El idioma del proyecto determina también la imagen social y el texto alternativo.

Las portadas de Alejandro’sTech se capturaron desde la vista local de esta entrega, con tema oscuro/coral y texto al 100%; la publicación se verifica contra esa misma fuente. Las del CV se capturaron de sus páginas públicas `/` y `/en/`, en tema oscuro. El CV y su código no se modificaron. Las capturas no acreditan proyectos nuevos ni resultados de IA.

Las vistas anteriores de `alejandros-tech-preview.jpg` y `cv-preview.jpg` se sustituyen por estas capturas actuales. El recurso sin uso `alejandros-tech-first-version.jpg` se retira de la publicación. La historia visual anterior se conserva en el [commit be6a39b](https://github.com/alejandrosergio/alejandros-tech/commit/be6a39bfc9235e0b9d4dc08d30a6ed745a240099).

Las capturas representan los proyectos publicados; no son proyectos de clientes inventados. La fotografía original es también la fuente de identidad y postura de la preparación del inicio.

## Preparación de la fotografía actual

Recurso: `public/assets/sergio-natural-appearance.webp`, 1024 × 1536, RGBA, 207.142 bytes.

Modo: herramienta integrada ImageGen, edición de la foto original con extracción de fondo y retirada del reloj. Se conservaron el encuadre 2:3, la postura, el cuello natural, la ropa y los rasgos de la foto como referencia. Es una edición asistida, no una garantía de identidad geométrica exacta.

El PNG de origen permanece en la biblioteca local de imágenes y no forma parte de la publicación. La conversión a WebP conserva dimensiones y alfa, sin rescalado.

El tratamiento en gris y el encuadre visible se aplican en CSS. La imagen preparada se conserva sin regenerar ni alterar durante la retirada del código 3D.

## Prompt histórico de preparación

El texto siguiente conserva literalmente la solicitud con la que se preparó la foto actual. Sus referencias al visualizador y a coordenadas de malla explican el destino que tenía entonces; no describen la web vigente ni son instrucciones para reintroducir ese código.

Use case: identity-preserve / background-extraction. Asset type: photographic appearance texture and static fallback for an existing true 3D bust on the owner's professional portfolio. Input image 1 is the EDIT TARGET and sole identity/pose reference. Make exactly two localized edits: remove the entire blue studio background to genuine alpha transparency; remove the watch from the crossed forearm, replacing that small area with natural skin matching that arm, no bracelet. Preserve the original person and his real face, natural short neck, curly hair, beard, eyebrows, eyes, mouth, expression, head tilt, body proportions, original dark textured polo/overshirt with white crew-neck undershirt, exact crossed-arm pose and all existing fingers. Do not invent raised palms, new hands, a long V-shaped neck, open button-up shirt, accessories or a different person. Do not beautify, stylize, sculpt or relight the person. This is a precise cutout of the original photo with only watch removal. CRITICAL keep the exact original 2:3 portrait canvas (1024x1536 or equivalent), same pixel-relative framing, scale and landmark positions, same space above hair and body crop at the bottom. No recentering, no zoom or cropping. Subject's landmarks and crossed hands must stay exactly where they are, because the image is calibrated to real mesh coordinates. Keep natural color and original photographic detail; grayscale treatment will be applied in the 3D renderer. Preserve fine hair alpha edges. Real alpha transparency, not a checkerboard pattern. No background, text, logo, shadow, new props or extra people.

## Recursos retirados

`sergio-bust-appearance.webp` (apariencia cuadrada de manos levantadas) y `sergio-portrait-cutout.webp` (versión fotográfica previa) ya no forman parte de la web. Su procedencia permanece en el historial de Git.

La antigua integración 3D y su documentación se pueden consultar en el [commit histórico 6afb0d1](https://github.com/alejandrosergio/alejandros-tech/commit/6afb0d1dabf0e8bc2f9eba2b5dbb023a9d0ccb57). Era una aproximación estilizada aprobada por el titular, no un escaneo ni una reconstrucción exacta. Este enlace conserva el contexto sin mantener código ni recursos sin uso en la versión actual.

## Runtime del modelo opcional

`public/assets/models/qwen35-08b-webgpu.wasm` es el runtime compilado de MLC para Qwen3.5-0.8B, versión `v0_2_87/base`. Ocupa 7.358.915 bytes y tiene SHA-256 `39623bb05581e04616debfd762b8ea0d0f2d641b3afa8ac1df902aac0dfdb04e`. Se conserva sin modificar desde [su fuente fijada](https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/146ed9cd4b4062e967b017fd2291f7106b50599f/web-llm-models/v0_2_87/base/Qwen3.5-0.8B-q4f16_1_cs1k-webgpu.wasm).

La descarga y ejecución solo se inician al activar la IA en la demo. Los pesos no se distribuyen con el sitio: proceden de la revisión de Hugging Face fijada en `src/content/local-model.mjs`. Ver `AI-DEMO.md` y `THIRD_PARTY.md` para funcionamiento y licencias.
