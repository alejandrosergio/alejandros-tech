# Arquitectura

## Base, contenido y rutas

Generación estática con Node ESM y HTML/CSS/JavaScript de navegador. Sin framework, servidor de aplicación, base de datos ni bibliotecas externas de ejecución. La salida es portable entre alojamientos estáticos.

Los modelos de contenido viven en `src/content/`: `site.mjs` centraliza identidad y contactos; `locales.mjs` mantiene ES/EN; `profile.mjs`, `projects.mjs`, `notes.mjs` y `routes.mjs` contienen hechos profesionales, casos, notas y pares de rutas. No se añade una página sin contenido completo. Cada ficha mantiene su equivalente al cambiar de idioma.

`src/components/page.mjs` comparte documento, metadatos, navegación y pie. `hero.mjs` renderiza la fotografía estática y un lienzo decorativo de humo situado detrás. El perfil usa texto y una columna `.about-approach`; no conserva tarjeta fotográfica ni lógica de volteo. `scripts/build.mjs` genera doce rutas ES/EN, 404, robots, sitemap y recursos en `dist/`.

## Portada fotográfica y movimiento

El retrato es un elemento `img` con el recurso local `sergio-natural-appearance.webp`; no necesita JavaScript para mostrarse. El generador, lector, visualizador y pruebas del antiguo busto 3D se eliminaron por petición del titular. La procedencia de la foto y la referencia histórica están en `ASSETS.md`.

`hero.css` conserva el encuadre editorial y aplica un acercamiento lento de 9,6 segundos, más suave en móvil, además del giro de tres anillos decorativos. `journey.js` asigna `data-scene-motion` según visibilidad, pausa y preferencias. La animación de la foto solo existe en estado `active`; al pasar a estático recupera su transformación neutra. Movimiento reducido también la desactiva directamente desde CSS. No hay seguimiento de cabeza ni controles de orientación del retrato.

`sectionNavigation(t)` exporta los ocho enlaces de sección localizados. `page.mjs` los coloca fuera del contexto aislado del hero para que el indicador fijo permanezca sobre los módulos; los diálogos abiertos lo ocultan. El desplazamiento, las anclas y el teclado siguen siendo nativos.

## Otras mejoras progresivas

`site.js` controla tema, menú móvil, filtros, copiado de correo, enlaces activos y revelaciones. La navegación queda expandida por encima de 760 px y se puede redistribuir en filas; el menú colapsado es móvil. Las revelaciones usan unos 1,1 segundos y escalonado acotado, con foco y preferencias de movimiento prioritarios. Sin JavaScript se conserva contenido, enlaces, responsabilidades desplegables y lista de tecnologías.

`interface.mjs` mantiene las etiquetas ES/EN de controles y formulario; `preferences.mjs` los renderiza. `theme-init.js` aplica preferencias acotadas antes del primer render; los nuevos valores iniciales son oscuro/coral/6 px y se respetan los valores guardados. `preferences.js` controla diálogos y almacenamiento consentido. El loader se presenta en cada carga de documento y espera 2000 ms después de window.load; un vigilante de 10000 ms solo cubre la espera de ese evento y se cancela al llegar. Teclado y botón conservan salida directa. `loader-grid.js` dibuja Grid Scan Deep con el acento elegido, un pase WebGL2 y brillo local; se retiró el controlador anterior de rayos. Movimiento reducido y contraste omiten la introducción. Las pruebas cubren también carga lenta, evento duplicado, guardia cancelada, recarga y liberación de recursos.

`contact.js` importa las reglas puras de `form-rules.js` y usa el endpoint público de Formspree. No hay claves ni servidor propio. El proveedor solo recibe una petición al enviar el formulario. Ver `CONTACT.md`.

El componente de recorrido y `journey.js` gestionan guía contextual, progreso, subida y cursor. El cursor usa punto y órbita sin glifo de redirección y se detiene en reposo. No hay peticiones para estas funciones; las preferencias de cursor y guía siguen el consentimiento común.

## Estilos y comprobaciones

Los estilos fuente se separan en base/contenido (`styles.css`), controles (`preferences.css`), introducción (`loader.css`), recorrido (`journey.css`), inicio (`hero.css`), fondo (`background.css`) y humo (`splash.css`), con interacción (`interactions.css`), entradas (`reveals.css`) y superficies (`modules.css`). El build los concatena en un único CSS.

`scripts/check.mjs` valida identidad, traducciones, rutas, anclas, referencias ARIA, metadatos, contenido, alternativas, sitemap y ausencia de los recursos del retrato retirado. Importa comprobaciones de navegación, recorrido, preferencias, Classic, humo y rayos, que ejercitan los controladores reales con superficies simuladas. La apariencia, reflujo e interacción visual se revisan en navegador; las simulaciones no sustituyen esa revisión. GitHub Actions comprueba sintaxis, generación y correspondencia del `dist/` guardado.

La publicación usa el helper oficial de Sites y su commit/archivo exactos. GitHub tiene un historial independiente y se compara por contenido, conservando cambios concurrentes. El estado local de sincronización se actualiza solo tras verificar ambos destinos.

`background.mjs` concentra el aspecto Classic y `letter-glitch.mjs` lo serializa de forma segura en el HTML. `letter-glitch.js` dibuja letras, números y símbolos monoespaciados con la base verde y destellos verdes/azules; limita cuadrícula, celdas activas y cadencia, y solo repinta lo que cambia. La antigua tabla de glifos Pixel se retiró. La portada recorta su región y detiene el trabajo mientras lo tapa por completo. Las superficies de lectura casi opacas dejan aparecer las letras principalmente en sus transiciones. La pausa del pie y las preferencias de movimiento tienen prioridad. Ver `THIRD_PARTY.md`.

`splash-cursor.js` controla el humo del inicio con WebGL local y sin React ni peticiones de red. `splash.css` limita su superficie y conserva el orden visual detrás del retrato. Solo las dos portadas ES/EN cargan este controlador. El ciclo del fluido se acota y se suspende según visibilidad y ajustes de accesibilidad; el diseño estático no depende de él.

La guía calcula por separado la fracción local del módulo y la posición global de la navegación. Su mismo ciclo de desplazamiento actualiza la opacidad de superficies; no añade un ciclo continuo de animación. El cursor custom se excluye en diálogos y deja libre el puntero nativo, también sobre el fondo de la modal.

## SEO técnico

`seo.mjs` centraliza títulos y descripciones únicos, URL canónica, alternativas ES/EN y x-default, Open Graph, imágenes sociales y Twitter. El HTML incluye un grafo JSON-LD con Person/WebSite, ProfilePage para el inicio, breadcrumbs para las fichas y BlogPosting o CreativeWork según contenido. Fechas y datos proceden de los modelos confirmados; no se añaden puntuaciones, clientes o resultados ficticios. La404 conserva noindex y no emite datos estructurados.

`src/lib/html.mjs` comparte el escape de HTML y la serialización de JSON para script; se prueban también cadenas capaces de cerrar un script. Build genera sitemap con alternativas recíprocas y robots.txt; check valida sus rutas, imágenes y metadatos junto al contenido disponible sin JavaScript. La decoración está excluida del árbol accesible y no sustituye texto indexable.

Referencias de mantenimiento: [guía SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) y [versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions). La indexación y la posición las decide el buscador; este proyecto no añade servicios externos ni verificaciones de cuentas automáticamente.
