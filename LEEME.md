# Alejandro’sTech

**Español** · [English](README.md)

Web profesional de Sergio Hernández: desarrollo con .NET y React, Power Platform, automatización e integración de IA. La primera edición completa reúne perfil, tecnologías, trayectoria, formación, proyectos públicos y notas técnicas originales.

- [Web en español](https://alejandros-tech.alejosergio3000.chatgpt.site/)
- [Web en inglés](https://alejandros-tech.alejosergio3000.chatgpt.site/en/)
- [CV profesional](https://sergio-hernandez-cv.alejosergio3000.chatgpt.site/)
- Contacto: [alejandro.dev.sergio@outlook.com](mailto:alejandro.dev.sergio@outlook.com)

## Experiencia

El inicio a pantalla completa incorpora un retrato fotográfico en gris, tres anillos de giro lento y un acercamiento suave de la imagen. La foto es un recorte asistido del retrato de estudio original del titular; su preparación está documentada en [recursos visuales](docs/ASSETS.md). El generador, visualizador y pruebas del antiguo 3D se han eliminado por petición del titular. El perfil usa columnas editoriales de texto sin tarjeta fotográfica duplicada, seguidas de un explorador de 18 tecnologías confirmadas, experiencia desplegable, dos casos de proyectos públicos reales y tres notas técnicas originales. Cada proyecto y nota tiene una página completa en español e inglés.

El sistema visual usa carbón, blanco cálido, coral discreto y títulos serif regulares en toda la web. La navegación permanece expandida por encima de 760 px y puede ocupar varias filas; el menú se colapsa solo en móvil. Las entradas de contenido duran unos 1,1 segundos con escalonado limitado. El cursor conserva punto y anillo sin flecha de redirección.

Se mantienen temas claro y oscuro, controles por teclado, preferencias de movimiento y adaptación a pantallas estrechas. El contenido principal, las rutas, el retrato y los contactos funcionan sin JavaScript. El explorador conserva HTML estático. El panel ofrece cinco tonos, tamaño de texto, redondeado, contraste, interlineado, subrayado y movimiento reducido. La primera visita parte de oscuro/coral/6 px y se respetan elecciones guardadas. Los movimientos decorativos respetan pausa, movimiento reducido, visibilidad y contraste.

Una guía de navegación sigue las ocho secciones del inicio con sugerencias contextuales; un botón de subida acompaña la navegación. La guía se puede ocultar y el cursor del sistema se puede restaurar. Solo se guardan ajustes opcionales con consentimiento. No se usan rastreadores, fuentes externas ni cuentas.

El formulario bilingüe utiliza el formulario verificado de Formspree del titular para enviar consultas al Outlook público. Incluye restricciones nativas, errores accesibles, consentimiento, protección honeypot, estados de envío/error y correo directo alternativo. Formspree valida también los cinco campos antes de enviar. El endpoint público es una dirección para recibir consultas, no una credencial de API. Una petición aceptada por sí sola no demuestra recepción en la bandeja. Ver [contacto y privacidad](docs/CONTACT.md).

## Trabajar en local

Usar Node.js 22 o posterior. Este sitio no necesita instalación de paquetes externos.

```sh
pnpm build
pnpm check
pnpm dev
```

También se pueden ejecutar `node scripts/build.mjs`, `node scripts/check.mjs` y `node scripts/dev.mjs`. Vista local: `http://127.0.0.1:4178/`. Regenerar y actualizar el navegador después de editar. Cerrar el servidor propio al terminar la revisión.

## Organización

- `src/content/`: identidad pública, traducciones, hechos profesionales, proyectos, notas y pares de rutas.
- `src/components/`: generadores HTML compartidos y portada editorial.
- `src/client/`: mejoras progresivas de navegación, preferencias, formulario, movimiento y fondos decorativos.
- `src/styles/`: variables visuales, composición y estilos adaptables.
- `public/`: fotografía preparada del inicio, retrato original también usado en las firmas de notas, capturas de proyectos y avisos locales de atribución.
- `scripts/`: generación determinista, comprobaciones y vista local.
- `dist/`: salida generada y guardada para comparar contenidos.
- `docs/`: alcance, diseño, procedencia del contenido, arquitectura y publicación.

Consultar la [procedencia de los recursos visuales](docs/ASSETS.md) para la foto fuente, su preparación y la implementación histórica. Leer [AGENTS.md](AGENTS.md) y el [flujo de publicación](docs/PUBLISHING.md). Editar las fuentes y regenerar `dist/`, sin modificar manualmente esa salida.

Cada cambio solicitado se publica en el Site existente y se guarda en GitHub, verificando ambos resultados. Sus historiales Git son independientes. Un push a GitHub por sí solo no publica el Site. No hay sincronización permanente.

El CV conserva su proyecto y Site independientes. Es una referencia factual; mantener Alejandro’sTech no autoriza cambios allí.

## Derechos

Copyright © 2026 Alejandro’sTech. Todos los derechos reservados. No se concede una licencia de código abierto para la web, la marca o los recursos personales.

Pixel Letter Glitch usa letras locales A–Z en blanco/coral fuera de la portada. Splash Cursor Smoke decora solo el inicio detrás de la fotografía. Light Rays Underwater aparece en el loader introductorio acotado. Estos efectos locales conservan sus controles de pausa y movimiento; atribución en [THIRD_PARTY.md](docs/THIRD_PARTY.md).
