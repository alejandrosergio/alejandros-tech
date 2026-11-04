# Recursos visuales y procedencia

## Estado actual

La portada usa la fotografía `public/assets/sergio-natural-appearance.webp` mediante un elemento HTML `img`. Su movimiento es un zoom CSS acotado; no hay modelo, canvas de retrato ni seguimiento de cabeza. La pausa y el movimiento reducido dejan la imagen en su pose neutra. Los lienzos de humo y rayos son decoraciones independientes, no visualizadores de la persona.

Por petición del titular se eliminaron de la fuente el generador, lector, visualizador y pruebas del antiguo busto 3D. Su historial se conserva en Git, sin archivos 3D en la implementación vigente.

## Imágenes que se conservan

| Recurso local en `public/assets/` | Uso actual |
| --- | --- |
| `sergio-natural-appearance.webp` | Retrato de la portada, preparado a partir de la foto original. |
| `sergio-hernandez.jpeg` | Foto pública original de estudio y avatar en la firma de las notas técnicas. |
| `alejandros-tech-preview.jpg` | Vista del proyecto Alejandro’sTech en su tarjeta. |
| `alejandros-tech-first-version.jpg` | Captura de la primera versión en la ficha del proyecto. |
| `cv-preview.jpg` | Vista del CV profesional en tarjeta y ficha de proyecto. |

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
