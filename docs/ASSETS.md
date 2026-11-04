# Retrato de la portada

- Original de estudio: `public/assets/sergio-hernandez.jpeg`. Se conserva sin cambios para la tarjeta del perfil.
- Recorte para el inicio: `public/assets/sergio-portrait-cutout.webp`, 1024 × 1536 con transparencia real.
- Preparación: herramienta integrada de imágenes, modo edición / background-extraction. Se inspeccionó el resultado y su canal alfa. El recorte es una imagen preparada a partir de la foto del titular; no es un escaneo facial ni un modelo 3D.
- Entrega en WebP: conversión de formato con el codificador ya disponible en el entorno, sin nuevas dependencias en la web, sin redimensionar y conservando el canal alfa. El PNG generado se conserva en la biblioteca local de imágenes.
- El gris, contraste, máscaras y perspectiva se aplican en CSS. La interacción gira suavemente la capa de cabeza; el torso permanece estable. No se genera una identidad distinta ni se inventa una expresión nueva para cada posición del cursor.

Prompt empleado:

> Use case: background-extraction. Edit target: the provided actual portrait photograph of Sergio. Asset type: transparent portrait cutout for his professional website hero. Remove ONLY the light blue studio background and replace it with actual transparency (alpha channel). Preserve the person EXACTLY: identical face, gaze, eye shape, hair curls and fine hair edges, skin texture, expression, pose with crossed arms, charcoal sweater, white shirt, wristwatch, trousers, original proportions and original framing. Do not beautify, redraw, relight, stylize, retouch, or change the person's identity. Preserve all existing person pixels as faithfully as possible. Keep the original 2:3 portrait framing so head remains around the upper middle and shoulders/arms remain fully visible. No text, graphics, shadow, or background. True transparent background.
