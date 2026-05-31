# French And Spanish International SEO Architecture Build Report

Date: 2026-05-31

Scope: architecture foundation for French and Spanish multilingual expansion. This phase does not translate all content, does not publish translated pathways, and does not expose unfinished French or Spanish pages to search engines.

## Executive Summary

The French and Spanish multilingual SEO foundation now supports:

- French subdomain canonical architecture: `https://fr.nursenest.ca`
- Spanish subdomain canonical architecture: `https://es.nursenest.ca`
- internal Next.js locale-prefixed rendering for existing localized routes,
- host-aware rewrite infrastructure for language subdomains,
- preview/noindex protection for French and Spanish,
- empty French and Spanish language sitemap routes until publication readiness,
- language sitemap index entries,
- subdomain-aware canonical generation,
- subdomain-aware future hreflang generation,
- contract tests for subdomain URL behavior and language sitemaps.

English SEO remains on the apex canonical origin: `https://nursenest.ca`.

## 1. Internationalization Architecture Audit

Current architecture already had strong foundations:

| Area | Evidence | Finding |
|---|---|---|
| Static UI/marketing i18n | `docs/i18n-architecture.md`, `tools/i18n/*`, `public/i18n/*` | Multi-locale UI pipeline exists. |
| Translation policy | `docs/i18n-translation-engineering-policy.md` | Static UI translation rules exist; long-form content must not be forced into flat UI maps. |
| Locale readiness | `src/lib/i18n/language-readiness.ts` | Locale tiers govern indexability, sitemap inclusion, and hreflang eligibility. |
| Localized routes | `src/app/(marketing)/[locale]/*` | Existing internal rendering uses `/{locale}` paths. |
| Localized SEO audits | `src/lib/seo/localized-seo-readiness.ts` | Existing audit model covers localized metadata, breadcrumbs, route support, and sitemap expectations. |

Architecture added:

| File | Purpose |
|---|---|
| `src/lib/i18n/language-subdomains.ts` | Single source of truth for `nursenest.ca`, `fr.nursenest.ca`, and `es.nursenest.ca`. |
| `src/middleware.ts` | Rewrites French and Spanish subdomain requests to internal locale-prefixed Next.js routes without changing the public URL. |
| `src/lib/seo/language-sitemap-xml.ts` | Language sitemap builder for English, French, and Spanish. |

## 2. Routing Implementation Audit

Public URL architecture:

| Language | Public host | Example public URL | Internal render path |
|---|---|---|---|
| English | `nursenest.ca` | `/pricing` | `/pricing` |
| French | `fr.nursenest.ca` | `/pricing` | `/fr/pricing` |
| Spanish | `es.nursenest.ca` | `/pricing` | `/es/pricing` |

Middleware behavior:

- `fr.nursenest.ca/pricing` rewrites internally to `/fr/pricing`.
- `es.nursenest.ca/nclex-rn` rewrites internally to `/es/nclex-rn`.
- `nursenest.ca` remains unchanged.
- `/api`, `/_next`, `/admin`, `/app`, `/internal`, `/preview`, and public static files bypass language rewrites.

This keeps the existing localized route implementation while moving public SEO architecture toward language subdomains.

## 3. SEO Implementation Audit

Changes:

- `absoluteMarketingCanonical("fr", "/pricing")` now resolves to `https://fr.nursenest.ca/pricing`.
- `absoluteMarketingCanonical("es", "/question-bank")` now resolves to `https://es.nursenest.ca/question-bank`.
- English canonical URLs remain `https://nursenest.ca/...`.
- Spanish was moved from `full` to `partial` in `src/lib/i18n/marketing-languages.ts`.
- French and Spanish now emit noindex robots metadata while previewed.

Important constraint:

The internal Next.js paths remain `/{locale}` because the existing app router is already built around `src/app/(marketing)/[locale]`. The public canonical layer now maps those internal paths to language subdomains.

## 4. Hreflang Audit

Current production behavior:

- English remains `x-default` and `en-CA`.
- French and Spanish are excluded from hreflang clusters while they are preview/noindex.

Reason:

Search engines should not receive hreflang alternates to pages that are intentionally noindex and incomplete. Once French or Spanish is promoted to publication-ready, the architecture can emit:

```text
x-default -> https://nursenest.ca/{path}
en-CA -> https://nursenest.ca/{path}
fr-CA -> https://fr.nursenest.ca/{path}
es -> https://es.nursenest.ca/{path}
```

Contract coverage:

- `src/lib/i18n/language-subdomains.contract.test.ts`
- `src/lib/seo/locale-seo-leakage.contract.test.ts`
- `src/lib/seo/localized-seo-readiness.test.ts`

## 5. Sitemap Audit

Sitemap routes now include:

| Route | Status |
|---|---|
| `/sitemap.xml` | Master sitemap index. |
| `/sitemap-en.xml` | English language sitemap. |
| `/sitemap-fr.xml` | Valid empty sitemap while French is preview/noindex. |
| `/sitemap-es.xml` | Valid empty sitemap while Spanish is preview/noindex. |

French and Spanish language sitemaps intentionally emit no URLs until each language is publication-ready.

Updated sitemap index children:

- `sitemap-en.xml`
- `sitemap-fr.xml`
- `sitemap-es.xml`
- existing segmented sitemaps remain intact.

Contract coverage:

- `src/lib/seo/language-sitemap-xml.contract.test.ts`
- `src/lib/seo/sitemap-index.contract.test.ts`
- `src/lib/seo/sitemap-phase2-segmentation.contract.test.ts`

## 6. Translation Readiness Report

Current state:

| Language | Infrastructure | SEO status | Publication status |
|---|---|---|---|
| English | Existing production | Indexable | Published |
| French | Supported internal locale and subdomain canonical layer | Preview/noindex/nofollow | Not ready |
| Spanish | Supported internal locale and subdomain canonical layer | Preview/noindex/nofollow | Not ready |

No content translation was performed in this phase.

No French or Spanish pathway should be presented as fully translated until these surfaces are complete:

- homepage,
- blog,
- exam pathways,
- lessons,
- flashcards,
- practice exams,
- CAT exams,
- pricing,
- about pages,
- legal pages,
- dashboard labels,
- study plans,
- reports,
- analytics labels,
- emails.

## 7. French Readiness Percentage

French architecture readiness: 80%.

French publication readiness: 0%.

Why:

- Routing, canonical, sitemap route, and noindex protection are now present.
- Existing French internal route framework exists.
- Full French content, pathway translation, emails, analytics labels, CAT/practice surfaces, and publication approvals were not created in this phase.

## 8. Spanish Readiness Percentage

Spanish architecture readiness: 80%.

Spanish publication readiness: 0%.

Why:

- Routing, canonical, sitemap route, and noindex protection are now present.
- Existing Spanish internal route framework exists.
- Spanish was intentionally demoted from SEO-full to preview/partial to prevent indexation leaks.
- Full Spanish content, pathway translation, emails, analytics labels, CAT/practice surfaces, and publication approvals were not created in this phase.

## 9. Remaining Work Estimate

| Workstream | French estimate | Spanish estimate | Notes |
|---|---:|---:|---|
| Static UI/key completion | 2-4 weeks | 2-4 weeks | Navigation, forms, buttons, pricing, dashboard labels. |
| Marketing page localization | 3-6 weeks | 3-6 weeks | Homepage, pricing, about, legal, conversion pages. |
| Blog localization foundation | 4-8 weeks | 4-8 weeks | Minimum high-quality translated/editorially reviewed blog corpus. |
| RN lesson translation | 12-20 weeks | 12-20 weeks | Requires clinical translation and nursing education review. |
| Question/rationale translation | 16-28 weeks | 16-28 weeks | Highest risk: rationales, distractors, hints, and clinical pearls must preserve teaching value. |
| CAT/practice/readiness labels | 4-8 weeks | 4-8 weeks | Requires learner analytics language QA. |
| Email and lifecycle sequences | 2-4 weeks | 2-4 weeks | Signup, trial, retention, study reminders. |
| SEO QA and publication promotion | 1-2 weeks | 1-2 weeks | Hreflang, sitemap, canonical, metadata, schema, indexation validation. |

## 10. Recommended Next Steps

1. Keep French and Spanish in preview/noindex until full publication standards are met.
2. Add an admin-controlled language publication toggle backed by the locale readiness registry, rather than editing code to promote locales manually.
3. Build translation inventory dashboards for lessons, questions, flashcards, blogs, NGN cases, practice exams, CAT pools, monetization, and localization readiness.
4. Complete French Canadian first where Canadian RN/RPN/NP positioning matters.
5. Complete Spanish International as a broad acquisition layer, then add regional variants such as `es-MX` and `es-US`.
6. Do not emit French or Spanish hreflang alternates until the target page is indexable and publication-ready.
7. Add production smoke tests for:
   - `fr.nursenest.ca/`
   - `fr.nursenest.ca/pricing`
   - `es.nursenest.ca/`
   - `es.nursenest.ca/pricing`
   - `/sitemap-en.xml`
   - `/sitemap-fr.xml`
   - `/sitemap-es.xml`

## Success Criteria Status

| Requirement | Status |
|---|---|
| French infrastructure built | Complete for architecture phase. |
| Spanish infrastructure built | Complete for architecture phase. |
| Hidden from search engines | Complete: preview/noindex, sitemap exclusion. |
| English SEO preserved | Complete by design: apex canonical remains unchanged. |
| Subdomain canonical support | Complete. |
| Future language expansion support | Foundation complete through shared registry/helpers. |
| Full content translation | Not in scope. |
| Publication of translated content | Not in scope and intentionally blocked. |
