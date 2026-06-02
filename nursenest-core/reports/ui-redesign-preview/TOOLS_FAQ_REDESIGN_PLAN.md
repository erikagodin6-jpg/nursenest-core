# Tools + FAQ — premium design system alignment plan

**Date:** 2026-05-08  
**Scope:** Marketing **public** routes: `(default)/tools`, `[locale]/tools`, tools `[slug]`, `(default)/faq`, `[locale]/faq`. **Out of scope:** `/app/*` study tools, calculator math, SEO/i18n contracts.

## Route map

- `/tools`, `/[locale]/tools` → `ToolsHubClient`
- `/tools/[slug]` → `ToolsToolShell` + `ToolLazyView` (slugs: med-math, lab-values, electrolyte-abg, iv-infusion, transfusion-safety)
- `/faq` → `FaqLegalMarketingView` + `FaqProductScreenshotsSection`
- `/[locale]/faq` → align with default (legal + product FAQ)

## Design references

Homepage premium stack: `premium-redesign-2026.css`, `.nn-marketing-h1`–`h3`, pricing FAQ details pattern, semantic color tokens (no single-hue product UI).

## Validation

`npm run typecheck:critical`, `npm run test:homepage`, Playwright `tools-faq-marketing.spec.ts`.

*Verified By VibeCheck ✅*
