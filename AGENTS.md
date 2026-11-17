# Alejandro’sTech

## Acuerdo compartido con ChatGPT

Este bloque reproduce las instrucciones personalizadas del proyecto de ChatGPT «alejandros-tech». Los detalles técnicos que siguen lo complementan. La alineación es manual y solo se actualiza cuando el usuario lo solicita; no crea sincronizaciones ni autoriza acciones por sí misma.

Este proyecto está dedicado exclusivamente al desarrollo y mantenimiento de Alejandro’sTech, la web profesional de Sergio Alejandro Hernández Patiño. Responde en español claro, cercano y conciso. Explica los resultados sin jerga innecesaria.

CONTEXTO DEL PROYECTO

La carpeta local es C:/Users/Sergi/Documents/Codex/alejandros-tech. Antes de modificar la web, lee AGENTS.md y la documentación pertinente de docs/. Allí están las decisiones vigentes, los datos confirmados y el procedimiento de mantenimiento. Las peticiones posteriores del usuario prevalecen sobre decisiones anteriores.

Usa .codex/sync-state.json como referencia del último estado verificado, sin asumir que los destinos siguen sincronizados. Estas instrucciones no son una orden para iniciar cambios o publicaciones por iniciativa propia.

Destinos:
- Web: https://alejandros-tech.alejosergio3000.chatgpt.site/
- Inglés: https://alejandros-tech.alejosergio3000.chatgpt.site/en/
- GitHub: alejandrosergio/alejandros-tech, rama main.
- Site existente: appgprj_6aea35f321688191a6452b8b65f782ee.

Conserva el vínculo de .openai/hosting.json. No crees otro Site o repositorio para cambios rutinarios. El CV, LinkedIn, perfil de GitHub, correo y otros proyectos son destinos independientes; trabajar aquí no autoriza modificarlos.

FORMA DE TRABAJAR

Completa las acciones solicitadas de principio a fin. Resuelve decisiones rutinarias dentro del alcance autorizado y evita pedir confirmaciones repetidas. Pregunta cuando falte información imprescindible, haya una ambigüedad importante o una herramienta exija aprobación.

Si el usuario pide investigar, planificar o revisar sin modificar, respeta ese límite: no edites, publiques ni envíes formularios de prueba. No añadas funciones, secciones o rediseños no solicitados. Mantén las restricciones aunque el usuario haga preguntas o pida avances durante el trabajo.

DISEÑO, IDIOMAS Y CONTENIDO

Conserva la identidad editorial carbón/coral, los títulos serif, la fotografía en escala de grises y la marca Alejandro’sTech solo en texto. No recuperes el logo A+, el modelo 3D retirado ni efectos descartados sin una nueva petición.

Preserva los ajustes guardados de apariencia y accesibilidad, cookies, loader, navegación, guía contextual, cursor, animaciones y música opcional. Consulta AGENTS.md y docs/DESIGN.md para sus requisitos precisos. Las animaciones deben respetar movimiento reducido, pausa, contraste y visibilidad, sin perjudicar la lectura.

Mantén español e inglés equivalentes en contenido, navegación, mensajes, etiquetas, fuentes, demostraciones y metadatos. Comprueba móvil y escritorio, teclado, ampliación de texto y ausencia de desbordamientos. Los contenidos y enlaces principales deben seguir disponibles sin JavaScript. Conserva un SEO coherente, sin prometer posiciones o puntuaciones.

El perfil confirmado es analista y desarrollador de software, con .NET, Power Platform, React, automatización e IA aplicada. No inventes experiencia, empleadores, clientes, certificaciones, cifras o resultados. Distingue proyectos personales, experiencia profesional, guías y notas originales.

El contacto público es alejandro.dev.sergio@outlook.com. Mantén privados otros correos y datos de cuenta. Los enlaces al CV deben abrir otra pestaña y respetar el idioma.

DEMOS, IA Y COSTES

La consulta documental ligera devuelve fragmentos literales con fuentes; no la presentes como una respuesta generada. El modelo descargable es opcional, se ejecuta en el dispositivo y requiere activación explícita del visitante. Conserva cancelación, gestión de caché y alternativa ligera para dispositivos incompatibles.

No añadas inferencia de pago, claves de API, facturación, compras ni descargas automáticas sin nueva autorización. No presupongas que una suscripción incluye créditos o servicios: compruébalo antes de proponerlos.

La demo de procesos usa datos ficticios y memoria de la pestaña. El ejemplo .NET local y las guías de Power Automate no son un backend publicado ni flujos desplegados. No atribuyas autenticación, persistencia o garantías de producción inexistentes.

Conserva las salidas originales de evaluación, sus huellas y los fallos documentados. No alteres resultados para mejorar métricas. Identifica correctamente la revisión asistida por IA y los límites de la muestra.

IMPLEMENTACIÓN Y ENTREGA

Para cambios solicitados en la web, aplica el acuerdo de AGENTS.md y el procedimiento del skill de Sites instalado: revisar el origen actual, preservar cambios ajenos, implementar, generar dist/, comprobar, publicar en el Site existente y guardar los mismos archivos gestionados en GitHub.

No edites dist/ a mano. Mantén código legible, componentes reutilizables y dependencias justificadas. Elimina código muerto del área modificada sin ampliar innecesariamente el trabajo.

Ejecuta pnpm build y pnpm check, además de las comprobaciones específicas de lo modificado. Si cambia el ejemplo .NET, aplica las verificaciones documentadas de compilación, escenarios y HTTP. Revisa las vistas e interacciones afectadas en ambos idiomas. Reutiliza pruebas válidas cuando sus entradas no hayan cambiado.

Antes de escribir en GitHub, comprueba el estado remoto. Reconcilia diferencias sin sobrescribir trabajo concurrente, sin force-push y sin cambiar la configuración global de Git. Sites y GitHub pueden tener historiales distintos: verifica contenido y huellas, no exijas commits idénticos.

Verifica el despliegue, el contenido de GitHub, la finalización correcta de GitHub Actions y que no queden cambios propios pendientes. Actualiza el estado local de sincronización solo después de verificar ambos destinos.

SEGURIDAD Y COMUNICACIÓN

Mantén las credenciales en memoria y utiliza los mecanismos protegidos del procedimiento oficial. Nunca las imprimas ni guardes en argumentos, archivos o logs. No publiques secretos, perfiles de navegador, .env, .codex/, .sites-runtime/, node_modules/, archivos temporales, SDKs o bin/obj.

No crees sincronizaciones recurrentes ni envíes mensajes a terceros sin una petición específica. Respeta las aprobaciones de las herramientas y las reglas de delegación vigentes.

Durante trabajos largos, comunica avances o límites relevantes. Al terminar, indica qué se completó, cómo se comprobó y cualquier limitación real. Para cambios publicados, incluye la URL y el commit de GitHub. Para revisiones sin cambios, dilo expresamente. No declares una entrega completa si falta una publicación, sincronización o prueba necesaria.

## Detalles técnicos del proyecto local

Las secciones siguientes conservan las decisiones y los procedimientos propios de esta carpeta.

## Purpose and current scope

This is Sergio Hernández’s official professional-brand website. On 3 November 2026 the owner authorized expansion from the coming-soon page into a complete bilingual professional website, inspired by dataconale.com and retaining Alejandro’sTech’s own identity. The current scope includes the home, profile, technology explorer, experience and education, public project case studies, technical notes and contact. Later requests added visitor accessibility/appearance controls, cookie preferences, an introductory loader, a validated Formspree form forwarding to the public Outlook address, scroll-to-top, a custom cursor and a contextual navigation guide. See docs/CONTACT.md for the external form setup and delivery verification boundary.

The current home uses an HTML photographic portrait, following the owner's request on 4 November 2026 to remove the unused 3D feature and its authoring, viewer and tests. The former implementation is available in Git history; see docs/ASSETS.md. Keep the editorial charcoal/coral layout, text-only brand, accessibility, cookies, contact form and contextual guide. Letter Glitch Classic uses monospaced letters, numbers and symbols, the preset's green/blue highlights and matching light palette, with bounded smooth animation. It is excluded from the hero and revealed only outside that region. The hero alone uses Splash Cursor Smoke (gray, intensity 0.6, size 0.5) behind the photo. Both decorations respect pause, reduced motion, contrast and visibility. Reading surfaces span the viewport with an almost opaque reading veil; keep native scrolling functional while its scrollbar is visually replaced by the working section rail. Preserve professional facts and the independent destinations below.

Use the brand **Alejandro’sTech**, with the curly apostrophe and no space before Tech. Repository and URL slugs use `alejandros-tech`.

The loader appears on each full document load/reload, including deep links, with Grid Scan Deep tinted by the saved accessibility accent. It uses a ten-cell perspective room, depth 8, a 4s scan and a 0.7 trail. Its normal hold is 2000 ms after window.load, so asset loading cannot consume that interval. A 10000 ms watchdog applies only while waiting for load; cancel it when load arrives. Keyboard and the enter button dismiss immediately. Reduced motion, high contrast and forced colors skip it. Never add session memory that prevents reload display. The photo is smaller on mobile and has a bounded CSS zoom cycle; pause and reduced motion restore its neutral pose. Four disciplines include confirmed API/system integrations, with equivalent mobile content. Content surfaces remain almost opaque and reveal Classic glyphs only at module transitions. Accessibility uses an icon-only gear and accent-colored tooltips. CV links open a separate tab; the hero social rail contains LinkedIn and GitHub only.

Optional music is an original local Web Audio composition at 112 BPM. Create/resume audio only after explicit Play; Pause, a hidden tab and leaving the document stop and release it. Do not autoplay or persist a playing state across navigation. No external tracks or samples are included; this is provenance, not a claim that the music has no copyright. See docs/AUDIO.md.

## Independent destinations

- Local project: `C:/Users/Sergi/Documents/Codex/alejandros-tech`.
- Sites project: `appgprj_6aea35f321688191a6452b8b65f782ee`.
- Website: `https://alejandros-tech.alejosergio3000.chatgpt.site/`.
- English: `https://alejandros-tech.alejosergio3000.chatgpt.site/en/`.
- GitHub: `alejandrosergio/alejandros-tech`, branch `main`.
- `.openai/hosting.json` binds this source to its own Site. Preserve its ID. Do not create another Site for routine changes.

The CV is a separate project and repository. It is a visual and factual reference only. Changes here do not authorize edits to the CV, LinkedIn, GitHub profile, email accounts or other Sites.

## Maintenance agreement

The user authorized routine requested changes to be applied to source, published to this existing Site, and saved to GitHub. Finish and verify both destinations in each maintenance request, without another conversational confirmation. Respect native tool approvals and any later explicit restriction.

This agreement applies to requested changes to the website. Instruction/configuration-only work, research, planning and explicitly read-only reviews do not authorize website implementation, commits, pushes, deployments, test contact submissions or sync-state updates. Honor the current request's exact scope.

1. Read this file, the installed Sites skill and relevant project documentation.
2. Get the existing Site and open its source through the official Sites source helper using a fresh short-lived credential. Retain the full opening result. Refresh ownership and audience as needed.
3. Read GitHub `main` and its tree. Compare content with the last verified state. Preserve user and concurrent changes. Reconcile differences before writing, without forcing history.
4. Edit `src/`, `public/`, `scripts/` or documentation. `dist/` is generated output and must not be edited manually.
5. Run `pnpm build` and `pnpm check` (or their identical Node script commands). Review affected views and interactions. Reuse still-valid verification when inputs have not changed.
6. Package with the official Sites helper, passing credentials through protected stdin, the retained opening result and remaining commands as argument arrays. Use its exact pushed commit and archive for native version/save/deploy tools.
7. Preserve the audience. This Site is intended to be public. Do not change audience merely to deploy.
8. Save the same managed files to GitHub. Use existing authentication or Git Data tools. With Git Data, base the new tree on the current tree, create a commit with the current parent, and update `main` with expected SHA checking and no force. Preserve unrelated files.
9. Verify deployment success, GitHub reference and file contents/hashes. Sites and GitHub may have different commit histories, so compare content rather than requiring identical commit SHAs.
10. Update a local `.codex/sync-state.json` only after both destinations are verified. It may contain public identifiers, commit SHAs and file hashes, never credentials. Report the website URL, GitHub commit and relevant checks. State any unfinished work accurately.

Managed files: `src/`, `public/`, `scripts/`, `examples/`, `dist/`, `docs/`, `.github/`, `.openai/hosting.json`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.gitignore`, `.gitattributes`, `.editorconfig`, `README.md`, `LEEME.md`, `AGENTS.md`. Deliberate deletions must correspond to requested changes.

This is a maintenance workflow during requested work, not an automatic background synchronization service. Do not create recurring jobs without a separate user request.

## Architecture and commands

- Static HTML, CSS and browser JavaScript generated by Node ESM modules. The document demo uses on-device retrieval and a separately bundled, optional WebLLM worker. Hosting stays static and portable, without a model API, database or server credentials.
- `src/content/site.mjs`: central brand, origin and public contacts.
- `src/content/locales.mjs`: equivalent ES/EN labels and home content. Keep translation keys aligned. `profile.mjs`, `projects.mjs`, `notes.mjs` and `routes.mjs` hold their corresponding content and localised routes.
- `src/components/`: reusable server-side rendering functions.
- `src/styles/`: responsive design tokens and styles.
- `src/client/`: progressive enhancement only. Main content, language links and contacts must work without JavaScript.
- `public/`: local static assets.
- `scripts/`: build, structural checks and loopback-only preview.
- `pnpm build`: regenerate `dist/`.
- `pnpm check`: verify the generated site.
- `pnpm dev`: build and serve `http://127.0.0.1:4178/`. Rebuild and refresh after edits. Stop the owned server after QA.

Use Node 22.13+ and `pnpm install --frozen-lockfile` before the build. WebLLM and esbuild are pinned in the lockfile. Only the demo imports its small controller; its heavy model worker and model files load after explicit visitor activation. Add pages or content models only when needed by approved features. Keep the static output portable.

The document assistant is an original personal prototype, not historical client experience. Its four public bilingual documents and sixteen sections are in `src/content/document-assistant.mjs`; see `docs/AI-DEMO.md`. The owner's latest authorization is lightweight consultation with sources and an optional downloadable model, with no API charges. Default results are verbatim excerpts and must not be presented as generated answers. Optional Qwen3.5 generation runs in the browser after explicit activation, with source and quote checks and an explicit lightweight fallback. Never add paid inference, billing, keys or automatic downloads. Preserve cancellation, unsupported-device handling, cache controls and ES/EN parity.

The owner subsequently authorised completing the remaining deliveries on 7 November 2026. The site has four public personal case studies, five original notes and 26 localized routes, within the same eight homepage modules. The profile refresh on 17 November adds three expandable professional project summaries from the owner's master CV, separate from the runnable personal prototypes. `docs/EVALUATION.md` explains the actual 24-query reference run, AI-assisted qualitative review and known failures. Reference outputs must stay verbatim; the build checks fingerprints and rejects stale inputs. Do not claim an independent human evaluation, general accuracy or RAGAs/ALCE execution.

`examples/workflow-api/` is a personal .NET 10 local reference, not the Site's backend. The browser workflow uses tab memory with fictional data. Shared fixtures cover both implementations. Use `dotnet build examples/workflow-api/src/WorkflowApi/WorkflowApi.csproj -c Release`, `dotnet run --project examples/workflow-api/tests/WorkflowChecks/WorkflowChecks.csproj -c Release`, and `node scripts/check-workflow-http.mjs` after relevant changes. The HTTP checker may select an isolated SDK through `TASK_DOTNET`. Keep SDKs, bin/obj and local processes out of Git. Power Automate documents are bilingual integration guides, not deployed tenant flows; never claim authentication, persistence or exactly-once processing in this bounded reference.

## Content and identity

- Public contact: `alejandro.dev.sergio@outlook.com`. Keep Gmail private.
- CV: `https://sergio-hernandez-cv.alejosergio3000.chatgpt.site/`; use `/en/` from the English page.
- LinkedIn: `https://www.linkedin.com/in/sergio-alejandro-hernandez-patino/`.
- GitHub profile: `https://github.com/alejandrosergio`.
- Profile: .NET and Power Platform developer, full stack, automation and AI integration. Keep claims grounded in the owner’s confirmed experience.
- The applied-AI editorial focus describes language-model integration through APIs in applications and automation, with technical review. Keep the confirmed analyst/developer role. Two cases are digital-identity web projects; the new document assistant is a personal applied-AI prototype. Project screenshots and their alt/social metadata match ES/EN; the assistant uses an original functional diagram, not a fabricated screenshot. See docs/ASSETS.md.
- Do not invent measured outcomes, employers, projects, clients, certifications or team sizes. The five-person team and payroll project in earlier conversation were examples, not confirmed facts.
- React is a confirmed current frontend technology. The master CV and public profile checked on 17 November confirm complementary Node.js/Python experience; keep it complementary. Java/Angular remain part of the earlier career, rather than the main current specialisation.
- The 17 November master CV confirms seniority, over six years of experience, four years of fully remote work and immediate availability for employment or hourly/project work. English is technical reading/use (B1 reference), without conversation; professional communication and interviews are in Spanish. The public CV confirms the phone and WhatsApp number in `site.mjs`. See `docs/CONTENT.md` for sources and the boundaries of the three professional summaries.
- Do not add a launch date, countdown, newsletter, account, form backend, client logos or commercial service promises without a request. New sections must contain complete, confirmed content. Technical notes written for the site are original explanatory content, not evidence of earlier publications or client projects. See `docs/CONTENT.md` for provenance.

## Design and QA

The current design is charcoal/coral/editorial with regular serif headings and a grayscale photographic portrait, following the owner's latest reference. Dark/coral/6 px corners are the default visitor settings; honor existing saved choices and keep system/light themes, five tones and readability controls functional. Desktop navigation remains expanded above 760 px and may wrap into a second row. Scroll reveals last about 1.1 seconds with bounded stagger; reduced motion and keyboard focus must keep content immediately usable. The custom cursor uses a dot and ring, with no redirect-arrow glyph on hover. Alejandro’sTech currently uses a text-only wordmark; the owner retired the A-plus logo pending a new design. See `docs/DESIGN.md`.

Keep ES and EN equally complete. Preserve real links, semantic headings, skip navigation, keyboard focus, labels and adequate touch targets. Keep reflow at narrow widths and text zoom. Fix overflow rather than hiding it. Respect reduced motion and forced colors. Use system fonts and local assets.

Verify both languages, language links, theme switching, mobile and desktop, external-link destinations and no-JavaScript content where relevant. Do not claim universal accessibility certification or arbitrary performance scores.

## Agent roles

One responsible agent integrates the result and owns publication/synchronization. Bounded work may be delegated when allowed by the active session and useful. Suggested roles and handoff requirements live in `docs/AGENT_ROLES.md`; they are instructions, not permanent running agents.

## Credentials and Git

Never commit tokens, `.env`, browser profiles, `.git/`, `.codex/`, `.sites-runtime/`, `node_modules/`, archives or temporary output. Sites credentials remain in memory and travel only through protected stdin, never arguments, files or logs.

Use this owner’s verified GitHub noreply identity for public commits: `74435785+alejandrosergio@users.noreply.github.com`. Do not alter global Git settings. Keep normal fast-forward and optimistic-concurrency checks. Never force-push or overwrite concurrent changes.
