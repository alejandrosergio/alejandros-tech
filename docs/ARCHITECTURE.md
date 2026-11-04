# Arquitectura

## Base, contenido y rutas

Generación estática con Node ESM y HTML/CSS/JavaScript de navegador. Sin framework, servidor de aplicación, base de datos ni bibliotecas externas de ejecución. La salida es portable entre alojamientos estáticos.

Los modelos de contenido viven en `src/content/`: `site.mjs` centraliza identidad y contactos; `locales.mjs` mantiene ES/EN; `profile.mjs`, `projects.mjs`, `notes.mjs` y `routes.mjs` contienen hechos profesionales, casos, notas y pares de rutas. No se añade una página sin contenido completo. Cada ficha mantiene su equivalente al cambiar de idioma.

`src/components/page.mjs` comparte documento, metadatos, navegación y pie. `hero.mjs` renderiza la portada del busto y su alternativa estática. El perfil usa texto y una columna `.about-approach`; no conserva tarjeta fotográfica ni lógica de volteo. `scripts/build.mjs` genera doce rutas ES/EN, 404, robots, sitemap y recursos en `dist/`.

## Modelo y visualizador

`src/model/stylized-bust.mjs` esculpe determinísticamente un busto volumétrico original y devuelve un GLB 2.0. El build escribe `/assets/sergio-stylized-bust.glb`. La revisión documentada contiene 1.413.336 bytes, 40.931 vértices y 69.996 triángulos. Incluye materiales base, cuerpo vestido y brazos cruzados, cabeza con pivote en el cuello y dos ojos articulados que reutilizan su propia malla. La geometría es una aproximación estilizada aprobada por el titular, no un escaneo ni una reconstrucción exacta.

`bust-glb.js` interpreta únicamente el subconjunto GLB del modelo propio: valida estructura, límites de buffers y geometría, índices, normales y jerarquía. No resuelve URLs, extensiones ni código contenido en metadatos.

`bust-view.js` dibuja la malla con WebGL nativo, normales, profundidad, materiales e iluminación. La imagen local `sergio-natural-appearance.webp` aporta la apariencia en gris mediante proyección calculada desde coordenadas de superficie y matrices de reposo. El GLB mantiene la geometría y los materiales base; la apariencia asistida por imagen y su proyección pertenecen al visualizador del sitio. La resolución se limita a aproximadamente 1,2 millones de píxeles y DPR 1,5.

`portrait.js` carga el GLB local, mide la cabecera y controla orientación por ratón, teclado y arrastre táctil horizontal. Cabeza y ojos se articulan con transformaciones propias; el torso mantiene su pose. El bucle se detiene al asentarse, pausar, salir de pantalla, ocultarse la pestaña o aplicar restricciones de movimiento/contraste. Trata fallos de carga, análisis y contexto gráfico y conserva una alternativa local. Sin JavaScript o WebGL se muestra la imagen; pausa y movimiento reducido conservan una pose 3D neutra. Mayor contraste muestra el respaldo atenuado; colores forzados simplifican la escena. Los detalles de procedencia y apariencia están en `ASSETS.md`.

## Otras mejoras progresivas

`site.js` controla tema, menú móvil, filtros, copiado de correo, enlaces activos, progreso y revelaciones. La navegación queda expandida por encima de 760 px y se puede redistribuir en filas; el menú colapsado es móvil. Las revelaciones usan unos1,1 segundos y escalonado acotado, con foco y preferencias de movimiento prioritarios. Sin JavaScript se conserva contenido, enlaces, responsabilidades desplegables y lista de tecnologías.

`interface.mjs` mantiene las etiquetas ES/EN de controles y formulario; `preferences.mjs` los renderiza. `theme-init.js` aplica preferencias acotadas antes del primer render; los nuevos valores iniciales son oscuro/coral/6 px y se respetan los valores guardados. `preferences.js` controla diálogos y almacenamiento consentido. El loader tiene límite de tiempo y salida directa.

`contact.js` importa las reglas puras de `form-rules.js` y usa el endpoint público de Formspree. No hay claves ni servidor propio. El proveedor solo recibe una petición al enviar el formulario. Ver `CONTACT.md`.

El componente de recorrido y `journey.js` gestionan guía contextual, progreso, subida y cursor. El cursor usa punto y órbita sin glifo de redirección y se detiene en reposo. No hay peticiones para estas funciones; las preferencias de cursor y guía siguen el consentimiento común.

## Estilos y comprobaciones

Los estilos fuente se separan en base/contenido (`styles.css`), controles (`preferences.css`), recorrido (`journey.css`), inicio (`hero.css`) y fondo (`background.css`), con interacción (`interactions.css`), entradas (`reveals.css`) y superficies (`modules.css`). El build los concatena en un único CSS.

`scripts/check.mjs` valida identidad, traducciones, rutas, anclas, referencias ARIA, metadatos, contenido, alternativas y sitemap. `check-bust.mjs` verifica generación determinista, volumen, articulación, presupuestos y rechazo de GLB malformado. `check-portrait.mjs` comprueba entrada, pausa, reposo, preferencias, visibilidad, errores y recuperación del controlador con superficies simuladas. La apariencia y la compilación real de shaders se revisan en navegador. GitHub Actions comprueba sintaxis, generación y correspondencia del `dist/` guardado.

La publicación usa el helper oficial de Sites y su commit/archivo exactos. GitHub tiene un historial independiente y se compara por contenido, conservando cambios concurrentes. El estado local de sincronización se actualiza solo tras verificar ambos destinos.

`letter-glitch.js` mejora el fondo de todas las rutas mediante dígitos locales0/1 del preset Binary y cambios periódicos acotados. La pausa del pie y el evento de la escena `alejandro:background-motion` lo controlan; las preferencias de movimiento tienen prioridad. La capa queda detrás del contenido y se suspende cuando no es visible. Ver `THIRD_PARTY.md`.

La guía calcula por separado la fracción local del módulo y la posición global de la navegación. Su mismo ciclo de desplazamiento actualiza la opacidad de superficies; no añade un ciclo continuo de animación. El cursor custom se excluye en diálogos y deja libre el puntero nativo, también sobre el fondo de la modal.
