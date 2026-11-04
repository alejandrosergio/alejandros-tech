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

`src/components/page.mjs` comparte documento, metadatos, navegación y pie entre el inicio y las fichas. `hero.mjs` concentra la portada fotográfica. `scripts/build.mjs` genera doce rutas ES/EN, 404, robots, sitemap y recursos. El resultado es determinista y se guarda en `dist/`.

## Mejora progresiva

`site.js` controla tema, menú móvil, tarjeta, filtros de tecnologías, copiado de correo, navegación activa, progreso y revelaciones. Sin JavaScript el contenido, los enlaces, la experiencia desplegable y la lista de tecnologías siguen disponibles.

`interface.mjs` mantiene la equivalencia ES/EN de los controles del visitante y del formulario; `preferences.mjs` los renderiza. `theme-init.js` aplica valores acotados antes del primer render y un loader con límite. `preferences.js` controla los diálogos y la persistencia consentida. `contact.js` importa las reglas puras de `form-rules.js` y usa el endpoint público de Formspree al enviar. No hay claves ni servidor propio. Ver `CONTACT.md` para activación, datos y límites de verificación.

`journey.mjs` contiene las ocho sugerencias localizadas del recorrido y su componente renderiza guía, control de subida y cursor. `journey.js` calcula contexto y progreso con un único fotograma por evento de scroll; las animaciones del cursor se detienen en reposo. No hay peticiones de red para estas funciones. `cursor` y `guideHidden` son preferencias opcionales sujetas al mismo consentimiento que el resto de ajustes. Sin JavaScript esos controles permanecen ocultos y el enlace normal del pie permite volver al principio.

`portrait.js` aplica una transformación 2,5D a una capa de cabeza y mantiene el torso estable. Solo sigue un ratón con puntero fino y se detiene al llegar a su objetivo, pausar, salir de pantalla, ocultar la pestaña o solicitar movimiento reducido. Sin JavaScript, en móvil o con mayor contraste, se presenta la foto estática completa. No hay modelo volumétrico, WebGL ni dependencias. El retrato recortado conserva su original de estudio; ver `ASSETS.md`.

Los estilos fuente se separan en base y contenido (`styles.css`), controles del visitante (`preferences.css`), navegación contextual (`journey.css`) e inicio (`hero.css`). El generador los concatena en un único recurso CSS.

## Comprobación

`scripts/check.mjs` valida estructura de traducciones, todas las rutas y anclas internas, referencias ARIA, metadatos, IDs, contenido, alternativas estáticas y sitemap. Incluye `check-portrait.mjs`, que comprueba entrada de ratón, reposo, pausa, preferencias, visibilidad y alternativa estática. La apariencia y el movimiento se revisan también en navegador. GitHub Actions comprueba sintaxis, generación y correspondencia del `dist/` guardado.

La publicación usa el helper oficial de Sites y su commit/archivo exactos. GitHub tiene un historial independiente y se compara por contenido, conservando cambios concurrentes.
