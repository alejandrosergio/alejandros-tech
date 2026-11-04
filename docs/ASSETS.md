# Busto y recursos de la portada

## Fuente y representación

`public/assets/sergio-hernandez.jpeg` es la foto pública de estudio del titular. La nueva pose del busto toma esa postura real de brazos cruzados y la ropa original. La cabeza y los ojos conservan articulación independiente y seguimiento acotado del cursor.

La geometría sigue siendo una interpretación volumétrica estilizada, no un escaneo ni una reconstrucción exacta. La fotografía aporta identidad visual y detalle superficial; una sola vista no confirma perfiles, profundidad ni anatomía oculta.

## Geometría actual

- Autoría local determinista: `src/model/stylized-bust.mjs`.
- Salida generada: `dist/assets/sergio-stylized-bust.glb`.
- 1.413.336 bytes, 40.931 vértices y 69.996 triángulos.
- Cabeza cerrada con volumen, cabello y barba; cuerpo estático de superficie continua cerrada, con silueta de la postura real y relieve frontal suave de antebrazos cruzados. El cuello, la ropa y los detalles de manos se apoyan en la apariencia fotográfica.
- Se retiraron las palmas levantadas, las orejas externas y las piezas superpuestas de dedos, collar, botones y hombros. El cuerpo usa un único volumen continuo de 0,8407 unidades de profundidad, sin burbujas ni huecos entre piezas.
- Sin reloj, cadenas, gafas ni otros accesorios. No se afirma un rig facial completo ni anatomía medida.

## Apariencia actual

Recurso: `public/assets/sergio-natural-appearance.webp`, 1024 × 1536, RGBA, 207.142 bytes. Se usa como apariencia sobre las superficies reales y como alternativa estática.

Modo: herramienta integrada ImageGen, edición de la foto original con extracción de fondo y retirada del reloj. Se conservaron el encuadre 2:3, la postura, el cuello natural, la ropa y los rasgos de la foto como referencia. Es una edición asistida, no una garantía de identidad geométrica exacta.

El PNG de origen permanece en la biblioteca local de imágenes y no forma parte de la publicación. La conversión a WebP conserva dimensiones y alfa, sin rescalado.

El visualizador proyecta la apariencia sobre las coordenadas de reposo de la malla, aplica iluminación y convierte a gris. El material usa recorte alfa para evitar cuñas grises fuera de la silueta fotografiada. La cabeza gira alrededor del cuello y cada ojo usa su nodo; no se utiliza un plano fotográfico como sustituto del GLB. El movimiento se limita para reducir deformaciones de la proyección. Abrir solo el GLB conserva geometría y materiales base, sin la apariencia del visualizador.

## Prompt completo

Use case: identity-preserve / background-extraction. Asset type: photographic appearance texture and static fallback for an existing true 3D bust on the owner's professional portfolio. Input image 1 is the EDIT TARGET and sole identity/pose reference. Make exactly two localized edits: remove the entire blue studio background to genuine alpha transparency; remove the watch from the crossed forearm, replacing that small area with natural skin matching that arm, no bracelet. Preserve the original person and his real face, natural short neck, curly hair, beard, eyebrows, eyes, mouth, expression, head tilt, body proportions, original dark textured polo/overshirt with white crew-neck undershirt, exact crossed-arm pose and all existing fingers. Do not invent raised palms, new hands, a long V-shaped neck, open button-up shirt, accessories or a different person. Do not beautify, stylize, sculpt or relight the person. This is a precise cutout of the original photo with only watch removal. CRITICAL keep the exact original 2:3 portrait canvas (1024x1536 or equivalent), same pixel-relative framing, scale and landmark positions, same space above hair and body crop at the bottom. No recentering, no zoom or cropping. Subject's landmarks and crossed hands must stay exactly where they are, because the image is calibrated to real mesh coordinates. Keep natural color and original photographic detail; grayscale treatment will be applied in the 3D renderer. Preserve fine hair alpha edges. Real alpha transparency, not a checkerboard pattern. No background, text, logo, shadow, new props or extra people.

## Recursos retirados

`sergio-bust-appearance.webp` (apariencia cuadrada de manos levantadas) y `sergio-portrait-cutout.webp` (versión fotográfica previa) ya no forman parte de la web. Su procedencia permanece en el historial de Git. La foto original se conserva como referencia.
