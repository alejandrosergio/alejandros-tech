# Alejandro’sTech

[Español](LEEME.md) · **English**

Sergio Hernández’s professional website: .NET and React development, Power Platform, automation and AI integration. The first complete edition brings together his profile, technologies, experience, education, public projects and original technical notes.

- [Spanish website](https://alejandros-tech.alejosergio3000.chatgpt.site/)
- [English website](https://alejandros-tech.alejosergio3000.chatgpt.site/en/)
- [Professional CV](https://sergio-hernandez-cv.alejosergio3000.chatgpt.site/en/)
- Contact: [alejandro.dev.sergio@outlook.com](mailto:alejandro.dev.sergio@outlook.com)

## Experience

The home includes the interactive WebGL A+ identity, a professional profile card, an explorer of 18 confirmed technologies, expandable experience entries, two real public project case studies and three original technical notes. Project and note detail pages have equivalent Spanish and English routes.

Light/dark themes, keyboard controls, motion preferences and narrow screens are supported. The main content, routes and contacts work without JavaScript. The skill explorer has a static HTML alternative; the 3D identity has a local SVG fallback. A visitor panel offers five accent tones, text size, card corners, contrast, line spacing, link underlines and reduced motion. Optional settings are saved only with consent. No analytics, external fonts or account system is used.

The bilingual contact form uses the owner’s verified Formspree form to forward enquiries to the public Outlook address. It includes native constraints, accessible field errors, consent, a honeypot, pending/error states and a direct email alternative. Formspree also validates all five fields before sending. The public endpoint is an address for submissions, not an API credential. An accepted HTTP request alone does not prove inbox delivery. See [contact and privacy](docs/CONTACT.md).

## Run locally

Use Node.js 22 or newer. No package installation is needed for this dependency-free site.

```sh
pnpm build
pnpm check
pnpm dev
```

Equivalent commands: `node scripts/build.mjs`, `node scripts/check.mjs`, `node scripts/dev.mjs`. Preview serves `http://127.0.0.1:4178/`. Rebuild and refresh after edits. Stop the owned server after QA.

## Source layout

- `src/content/`: public identity, translated content, profile facts, projects, notes and route pairs.
- `src/components/`: shared HTML renderers and the static A+ artwork.
- `src/client/`: progressive enhancements and the native WebGL renderer.
- `src/styles/`: shared design tokens, layouts and responsive styles.
- `public/`: local brand assets, the public CV portrait and actual project previews.
- `scripts/`: deterministic build, structural checks and loopback-only preview.
- `dist/`: generated output, tracked for content comparison.
- `docs/`: scope, design, content provenance, architecture and publishing.

Read [AGENTS.md](AGENTS.md) and [publishing](docs/PUBLISHING.md) before maintenance. Modify sources and regenerate `dist/`; never hand-edit the generated output.

Requested changes are published to the existing Site and saved to GitHub, with both destinations verified. Their Git histories are independent. A GitHub push alone does not deploy the Site. There is no recurring synchronization service.

The CV remains a separate project and Site. Its public content is a factual reference; maintaining Alejandro’sTech does not authorize changing it.

## Rights

Copyright © 2026 Alejandro’sTech. All rights reserved. No open-source licence is granted for the website, brand or personal assets.
