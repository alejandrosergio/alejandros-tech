# Arquitectura

## Decisión inicial

Generación estática con módulos ESM de Node.js y HTML/CSS/JavaScript de navegador. Se mantiene la misma familia técnica que el CV, con contenidos y componentes separados. Esta página no necesita un framework, un backend, una base de datos ni servicios de terceros.

La versión inicial no tiene dependencias externas. Esto permite ejecutar las comprobaciones y generar la salida sin instalar paquetes. Un framework se podrá valorar cuando una necesidad concreta lo justifique.

## Flujo

1. `src/content/site.mjs` define identidad, origen y contactos.
2. `src/content/locales.mjs` define ES/EN con las mismas claves.
3. `src/components/page.mjs` genera el documento y sus componentes compartidos.
4. `scripts/build.mjs` genera las dos rutas, 404, robots y sitemap, y copia los recursos.
5. `scripts/check.mjs` comprueba identidad, traducciones, enlaces, recursos y condiciones estructurales.
6. `dist/` se empaqueta mediante el flujo oficial de Sites.

La generación no usa la fecha del sistema ni datos remotos. Con las mismas entradas, produce los mismos archivos. El año de copyright se actualiza explícitamente en el contenido central.

## Crecimiento

Añadir componentes compartidos y rutas conforme se definan. Extraer colecciones de contenido para proyectos o artículos cuando existan. Mantener los textos traducidos, un origen canónico y una sola fuente para contactos.

Las nuevas necesidades de servidor, formularios o almacenamiento requieren una decisión documentada y revisión de compatibilidad con Sites. No incorporar infraestructura anticipada para funciones todavía no pedidas.

## Portabilidad

La salida es estática y puede alojarse en otro proveedor compatible si el titular lo solicita. El alojamiento actual es Sites, no GitHub Pages. Un cambio de proveedor requerirá revisar origen, enlaces, rutas y metadatos, además de publicar y comprobar el nuevo destino.
