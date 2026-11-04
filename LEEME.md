# Alejandro’sTech

**Español** · [English](README.md)

Web profesional de Sergio Hernández: desarrollo con .NET y React, Power Platform, automatización e integración de IA. La primera edición completa reúne perfil, tecnologías, trayectoria, formación, proyectos públicos y notas técnicas originales.

- [Web en español](https://alejandros-tech.alejosergio3000.chatgpt.site/)
- [Web en inglés](https://alejandros-tech.alejosergio3000.chatgpt.site/en/)
- [CV profesional](https://sergio-hernandez-cv.alejosergio3000.chatgpt.site/)
- Contacto: [alejandro.dev.sergio@outlook.com](mailto:alejandro.dev.sergio@outlook.com)

## Experiencia

El inicio incorpora un retrato editorial a pantalla completa que sigue suavemente al ratón, una tarjeta profesional, un explorador de 18 tecnologías confirmadas, experiencia desplegable, dos casos de proyectos públicos reales y tres notas técnicas originales. Cada proyecto y nota tiene una página completa en español e inglés.

Se mantienen temas claro y oscuro, controles por teclado, preferencias de movimiento y adaptación a pantallas estrechas. El contenido principal, las rutas y los contactos funcionan sin JavaScript. El explorador conserva una alternativa HTML y el retrato sigue siendo una imagen local sin JavaScript. El panel del visitante ofrece cinco tonos, tamaño de texto, redondeado, contraste, interlineado, subrayado y movimiento reducido. Una guía A+ sigue las ocho secciones del inicio con sugerencias contextuales; un botón de subida y un cursor animado acompañan la navegación. La guía se puede ocultar y el cursor del sistema se puede restaurar. Solo guarda ajustes opcionales con consentimiento. No se usan rastreadores, fuentes externas ni cuentas.

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
- `src/client/`: mejoras progresivas y seguimiento ligero del retrato.
- `src/styles/`: variables visuales, composición y estilos adaptables.
- `public/`: marca, retrato público del CV y vistas reales de proyectos.
- `scripts/`: generación determinista, comprobaciones y vista local.
- `dist/`: salida generada y guardada para comparar contenidos.
- `docs/`: alcance, diseño, procedencia del contenido, arquitectura y publicación.

Leer [AGENTS.md](AGENTS.md) y el [flujo de publicación](docs/PUBLISHING.md). Editar las fuentes y regenerar `dist/`, sin modificar manualmente esa salida.

Cada cambio solicitado se publica en el Site existente y se guarda en GitHub, verificando ambos resultados. Sus historiales Git son independientes. Un push a GitHub por sí solo no publica el Site. No hay sincronización permanente.

El CV conserva su proyecto y Site independientes. Es una referencia factual; mantener Alejandro’sTech no autoriza cambios allí.

## Derechos

Copyright © 2026 Alejandro’sTech. Todos los derechos reservados. No se concede una licencia de código abierto para la web, la marca o los recursos personales.
