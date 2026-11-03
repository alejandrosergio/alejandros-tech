# Arquitectura

## Base

Generación estática con Node ESM y HTML/CSS/JavaScript de navegador. Sin dependencias externas, framework, servidor de aplicación o base de datos. La salida sigue siendo portable entre alojamientos estáticos.

## Contenido y rutas

- `site.mjs`: identidad, origen y contactos públicos.
- `locales.mjs`: etiquetas y contenido ES/EN del inicio.
- `profile.mjs`: experiencia y tecnologías verificadas.
- `projects.mjs`: proyectos públicos y casos completos.
- `notes.mjs`: notas técnicas originales y lecturas de referencia.
- `routes.mjs`: pares de rutas locales por idioma.

Los modelos viven en `src/content/`. No se añade una página sin contenido real. Cada ficha conserva su destino equivalente al cambiar de idioma.

## Renderizado

`src/components/page.mjs` comparte documento, metadatos, navegación y pie entre el inicio y las fichas. `artwork.mjs` conserva el SVG de respaldo. `scripts/build.mjs` genera doce rutas ES/EN, 404, robots, sitemap y recursos. El resultado es determinista y se guarda en `dist/`.

## Mejora progresiva

`site.js` controla tema, menú móvil, tarjeta, filtros de tecnologías, copiado de correo, navegación activa, progreso y revelaciones. Sin JavaScript el contenido, los enlaces, la experiencia desplegable y la lista de tecnologías siguen disponibles.

`brand-3d.js` genera mallas e iluminación en WebGL nativo, sin modelos ni texturas remotas. Atiende pausa, entrada táctil, teclado, visibilidad, movimiento reducido y recuperación gráfica. No es necesario para navegar o leer el sitio.

## Comprobación

`scripts/check.mjs` valida estructura de traducciones, todas las rutas y anclas internas, referencias ARIA, metadatos, IDs, contenido, alternativas estáticas y sitemap. Incluye `check-3d.mjs`, que comprueba la lógica de pausa, entrada táctil, teclado, suspensión y recuperación del contexto con una superficie gráfica simulada. La compilación y apariencia real de los shaders se revisan en el navegador. GitHub Actions comprueba sintaxis, generación y correspondencia del `dist/` guardado.

La publicación usa el helper oficial de Sites y su commit/archivo exactos. GitHub tiene un historial independiente y se compara por contenido, conservando cambios concurrentes.
