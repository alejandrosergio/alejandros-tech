# Alejandro’sTech

**Español** · [English](README.md)

Sitio oficial de la marca profesional de **Sergio Hernández**, desarrollador .NET y Power Platform con enfoque en desarrollo full stack, automatización e integración de IA.

**Versión actual:** página inicial de próxima apertura. El propietario definirá más adelante cómo se construirá la web completa.

- [Web en español](https://alejandros-tech.alejosergio3000.chatgpt.site/)
- [Web en inglés](https://alejandros-tech.alejosergio3000.chatgpt.site/en/)
- [CV profesional](https://sergio-hernandez-cv.alejosergio3000.chatgpt.site/)
- [LinkedIn](https://www.linkedin.com/in/sergio-alejandro-hernandez-patino/)
- [Perfil de GitHub](https://github.com/alejandrosergio)
- Contacto: [alejandro.dev.sergio@outlook.com](mailto:alejandro.dev.sergio@outlook.com)

## Trabajar en local

Usar Node.js 22 o posterior. Esta versión **no depende de paquetes externos** para funcionar o generarse, por lo que no necesita instalación de dependencias.

```sh
pnpm build
pnpm check
pnpm dev
```

También se pueden ejecutar `node scripts/build.mjs`, `node scripts/check.mjs` y `node scripts/dev.mjs`. La vista local se abre en `http://127.0.0.1:4178/` y `/en/`. Después de editar, generar de nuevo y actualizar el navegador. El servidor de desarrollo no sustituye al alojamiento publicado.

## Organización

```text
src/content/       Marca, contactos públicos y textos ES/EN
src/components/    Generadores HTML reutilizables e iconos
src/styles/        Variables visuales y estilos adaptables
src/client/        Mejora opcional del tema visual
public/            Recursos estáticos de marca
scripts/           Generación, comprobaciones y vista local
dist/              Salida generada, guardada para comparar destinos
docs/              Alcance, diseño, arquitectura, roles y mantenimiento
.openai/           Vínculo con el Site existente
.github/workflows/ Comprobación del código y contenido
```

El contenido principal y el cambio de idioma funcionan sin JavaScript. Las páginas incorporan títulos, descripciones, URL canónica, alternativas de idioma, mapa del sitio y página 404.

## Mantenimiento

Leer [AGENTS.md](AGENTS.md), la [arquitectura](docs/ARCHITECTURE.md) y el [flujo de publicación](docs/PUBLISHING.md). Editar las fuentes y regenerar `dist/`, sin modificar manualmente esa salida.

Cada cambio solicitado se publica en el Site existente y se guarda en GitHub, comprobando ambos resultados. Los historiales de Sites y GitHub son independientes. **Un push a GitHub por sí solo no publica el Site.** No se han configurado despliegues continuos ni sincronizaciones permanentes.

El CV conserva su proyecto independiente. Aquí se enlaza, sin reemplazarlo ni modificarlo.

## Derechos

Copyright © 2026 Alejandro’sTech. Todos los derechos reservados. No se concede una licencia de código abierto para la marca o los recursos de la web. La publicación de las fuentes en GitHub no implica autorización para reutilizar la identidad personal o los recursos de marca.
