# Alejandro’sTech

## Purpose and current scope

This is Sergio Hernández’s official professional-brand website. On 3 November 2026 the owner authorized expansion from the coming-soon page into a complete bilingual professional website, inspired by dataconale.com and retaining Alejandro’sTech’s own identity. The current scope includes the home, profile, technology explorer, experience and education, public project case studies, technical notes and contact. Later requests added visitor accessibility/appearance controls, cookie preferences, an introductory loader, a validated Formspree form forwarding to the public Outlook address, scroll-to-top, a custom cursor and a contextual navigation guide. See docs/CONTACT.md for the external form setup and delivery verification boundary.

The current home uses an HTML photographic portrait, following the owner's request on 4 November 2026 to remove the unused 3D feature and its authoring, viewer and tests. The former implementation is available in Git history; see docs/ASSETS.md. Keep the editorial charcoal/coral layout, text-only brand, accessibility, cookies, contact form and contextual guide. Letter Glitch Pixel (A–Z) uses the preset's white/coral palette, with visibly contrasted glyphs and bounded animation. It is excluded from the hero and revealed only outside that region. The hero alone uses Splash Cursor Smoke (gray, intensity 0.6, size 0.5) behind the photo. Both decorations respect pause, reduced motion, contrast and visibility. Reading surfaces span the viewport with an almost opaque reading veil; keep native scrolling functional while its scrollbar is visually replaced by the working section rail. Preserve professional facts and the independent destinations below.

Use the brand **Alejandro’sTech**, with the curly apostrophe and no space before Tech. Repository and URL slugs use `alejandros-tech`.

The loader appears on each full document load/reload, including deep links, with an Underwater-derived Light Rays effect tinted by the saved accessibility accent. Its local speed/glow/intensity are 0.65/0.75/1.2, distinct from the original preset. Its normal minimum is 1200 ms and independent deadline 2400 ms; keyboard and the enter button dismiss it immediately. Reduced motion skips it. Never add session memory that prevents reload display. The photo is smaller on mobile and has a bounded CSS zoom cycle; pause and reduced motion restore its neutral pose. Four disciplines include confirmed API/system integrations, with equivalent mobile content. Content surfaces remain almost opaque and reveal saturated Pixel letters only at module transitions. Accessibility uses an icon-only gear and accent-colored tooltips. CV links open a separate tab; the hero social rail contains LinkedIn and GitHub only.

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

Managed files: `src/`, `public/`, `scripts/`, `dist/`, `docs/`, `.github/`, `.openai/hosting.json`, `package.json`, `pnpm-lock.yaml`, `.gitignore`, `.gitattributes`, `.editorconfig`, `README.md`, `LEEME.md`, `AGENTS.md`. Deliberate deletions must correspond to requested changes.

This is a maintenance workflow during requested work, not an automatic background synchronization service. Do not create recurring jobs without a separate user request.

## Architecture and commands

- Dependency-free static HTML, CSS and browser JavaScript, generated by Node ESM modules.
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

No package installation is needed for this dependency-free version. Keep future dependencies justified and pinned in the lockfile. Add pages or content models only when needed by approved features. Static hosting must remain portable.

## Content and identity

- Public contact: `alejandro.dev.sergio@outlook.com`. Keep Gmail private.
- CV: `https://sergio-hernandez-cv.alejosergio3000.chatgpt.site/`; use `/en/` from the English page.
- LinkedIn: `https://www.linkedin.com/in/sergio-alejandro-hernandez-patino/`.
- GitHub profile: `https://github.com/alejandrosergio`.
- Profile: .NET and Power Platform developer, full stack, automation and AI integration. Keep claims grounded in the owner’s confirmed experience.
- Do not invent measured outcomes, employers, projects, clients, certifications or team sizes. The five-person team and payroll project in earlier conversation were examples, not confirmed facts.
- React is a confirmed current frontend technology. Do not offer historical Java/Angular work as a current specialization or add unconfirmed Python experience.
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
