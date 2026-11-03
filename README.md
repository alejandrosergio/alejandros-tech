# Alejandro’sTech

[Español](LEEME.md) · **English**

The official professional-brand website of **Sergio Hernández**, a .NET and Power Platform developer focused on full stack development, automation and AI integration.

**Current release:** a focused coming-soon page. The complete website will be designed with the owner in a later phase.

- [Spanish website](https://alejandros-tech.alejosergio3000.chatgpt.site/)
- [English website](https://alejandros-tech.alejosergio3000.chatgpt.site/en/)
- [Professional CV](https://sergio-hernandez-cv.alejosergio3000.chatgpt.site/en/)
- [LinkedIn](https://www.linkedin.com/in/sergio-alejandro-hernandez-patino/)
- [GitHub profile](https://github.com/alejandrosergio)
- Contact: [alejandro.dev.sergio@outlook.com](mailto:alejandro.dev.sergio@outlook.com)

## Run locally

Use Node.js 22 or newer. This release has **no third-party runtime or build dependencies**, so no install step is required.

```sh
pnpm build
pnpm check
pnpm dev
```

The equivalent commands are `node scripts/build.mjs`, `node scripts/check.mjs` and `node scripts/dev.mjs`. Preview serves `http://127.0.0.1:4178/` and `/en/`. Rebuild and refresh after editing. The preview is a local development server, not production hosting.

## Structure

```text
src/content/       Brand, public contacts and ES/EN copy
src/components/    Reusable HTML renderers and icons
src/styles/        Shared design tokens and responsive styles
src/client/        Theme enhancement
public/            Static brand assets
scripts/           Build, checks and local preview
dist/              Generated static output, tracked for source parity
docs/              Brief, design, architecture, agent roles and maintenance
.openai/           Link to the existing ChatGPT Site
.github/workflows/ Build and content verification
```

The main content and language navigation work without JavaScript. Pages have localized titles, descriptions, canonical URLs, language alternatives, a sitemap and a custom 404 page.

## Maintenance

Read [AGENTS.md](AGENTS.md), [architecture](docs/ARCHITECTURE.md) and [publishing](docs/PUBLISHING.md) before making changes. Modify sources and rebuild `dist/`; do not hand-edit generated output.

Requested changes are published to the existing ChatGPT Site and saved to GitHub, with both results verified. Sites hosting and the GitHub repository have independent histories. **A GitHub push alone does not deploy this Site.** No continuous production deployment or background synchronization has been configured.

The CV is a separate project. This repository links to it and does not replace or modify it.

## Rights

Copyright © 2026 Alejandro’sTech. All rights reserved. No open-source license is granted for the brand or website assets. Publishing source on GitHub does not imply permission to reuse personal identity or brand assets.
