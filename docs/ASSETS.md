# Busto y recursos de la portada

## Fuente y límite de representación

`public/assets/sergio-hernandez.jpeg` es la foto de estudio pública del titular. Se conserva como fuente de identidad y procedencia; la sección del perfil ya no la renderiza. El titular eligió expresamente un busto 3D estilizado basado en esa foto y aceptó que fuese una aproximación artística, no un escaneo ni una reproducción exacta.

Una fotografía frontal no confirma la forma completa del cráneo, los perfiles, la anatomía o el cuerpo en otra pose. Las superficies, manos, camisa, barba y cabello del busto se han interpretado para esta composición. No se presenta la geometría como una medición biométrica del titular.

## Geometría actual

- Autoría: `src/model/stylized-bust.mjs`, esculpido procedural determinista propio, sin mallas de terceros ni modelos aprendidos.
- Salida generada: `dist/assets/sergio-stylized-bust.glb`, servida como `/assets/sergio-stylized-bust.glb`.
- Revisión documentada: 1.771.700 bytes, 51.300 vértices y 87.924 triángulos.
- Volumen de cabeza, cuello y torso con camisa, cabello rizado, barba y manos abiertas. Sin cadenas, gafas ni otros accesorios.
- Articulación rígida por nodos: cuerpo, cabeza con pivote en el cuello y ojos izquierdo/derecho independientes. No se afirma un rig facial completo de expresiones.
- El GLB incorpora geometría y materiales base. La apariencia proyectada del sitio usa el recurso separado descrito a continuación.

## Apariencia e imagen alternativa

`public/assets/sergio-bust-appearance.webp` es el recurso actual de apariencia y respaldo: 1254 × 1254, transparencia alfa y 124.536 bytes.

Se preparó con la herramienta integrada de imágenes a partir de tres entradas: una vista frontal renderizada del propio modelo, la foto real del titular y la captura de referencia para el tratamiento de iluminación. La edición conserva la composición del busto y aporta una apariencia fotográfica/esculpida en gris, con camisa y sin accesorios. La semejanza visual es una interpretación asistida por imagen y no demuestra exactitud anatómica del GLB.

La conversión final a WebP conserva dimensiones y transparencia. No añade dependencias a la web. El PNG producido por la herramienta permanece en la biblioteca local de imágenes.

El visualizador proyecta esta apariencia sobre las coordenadas de las superficies en su pose de reposo y combina el resultado con normales, iluminación y transformaciones del modelo real. La cabeza y los ojos siguen su jerarquía 3D al interactuar. La misma imagen queda como alternativa estática cuando no se puede mostrar el modelo. El aspecto frontal más próximo a la foto depende de la textura y del shader del sitio, además de la geometría; abrir solo el GLB en otro programa conserva sus materiales base.

## Prompt de apariencia

Resumen del encargo de edición: usar el frontal del modelo como referencia de forma y pose, la foto de Sergio como referencia de rasgos y la captura editorial como referencia de luz; obtener un busto oscuro y escultórico, en gris, con camisa, manos abiertas y sin cadenas, gafas ni accesorios, sobre fondo transparente.

## Recurso anterior retirado

La edición anterior utilizaba `sergio-portrait-cutout.webp` y dos capas fotográficas con perspectiva CSS. Ese recurso y ese mecanismo se retiran de la portada actual. La foto original de estudio se mantiene; la procedencia histórica completa del recorte permanece en el historial de Git.

## Prompt completo de la herramienta integrada

Use case: identity-preserve / 3D material appearance. Asset type: canonical front appearance map for an existing real volumetric 3D bust, not a website mockup. Image 1 is the EDIT TARGET: an existing front-rendered sculpted model, square framing and pose. Image 2 is the IDENTITY reference of the owner, Sergio: preserve his actual facial proportions, curly hairstyle, eyebrows, beard, nose, eyes and natural neutral expression. Image 3 is LIGHTING/MOOD reference only: dark cinematic, near-black sculptural figure with subtle grazing highlights. Do NOT use that man’s identity, accessories, lettering, or clothes. Refine image 1 into a very high quality realistic sculptural 3D character with Sergio’s recognizable likeness from image 2. He wears a fitted, natural black button-up shirt with subtle fabric folds. Both forearms are loosely raised, palms partly open like image 1. No watch, chain, glasses, earrings, tattoos or other accessories. Remove the toy/mannequin appearance: natural anatomy and eyes, refined curly hair strands, realistic beard, continuous natural neck. Material is monochrome dark graphite with soft skin/fabric detail, black shadows and restrained grey highlights, professional cinematic rendering. CRITICAL: keep the image-1 canvas exactly square, subject scale, position, framing, silhouette, facial landmark positions, shoulder width, limb positions, hands and finger endpoints as close to image 1 as possible because this will be projected back onto that exact 3D surface. Keep head/hair top at y~6%, eye line at y~20%, chin at y~36%, torso bottom y~93%, left and right hands near x~18%/82%, y~55%. Identity fidelity to image 2 matters. Preserve true alpha transparency around the entire figure. No background, no floor, no cast shadow, no text or graphic elements. One frontal bust only.
