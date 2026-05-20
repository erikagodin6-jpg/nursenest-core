# hreflang consistency audit — NurseNest

**Sources:** `marketing-alternates.ts`, `exam-pathway-hub-alternates.ts`, `programmatic-metadata.ts`, exam hub `page.tsx`, lessons hub `lessons/page.tsx`, pathway lesson `lessons/[lessonSlug]/page.tsx`, blog post `blog/[postSlug]/page.tsx`, `public-url-validator.ts` (`filterPublicHreflangRecord`), `robots.txt/route.ts` (indexing policy per locale tier).

---

## 1. Design model (intentional split)

| Surface | hreflang strategy | Rationale in code |
|---------|-------------------|-------------------|
| **Shared localized marketing** (`marketingHreflangLanguagesForEnPath`) | `x-default`, `en-CA`, + eligible BCP-47 locales | Only emit alternates where localized routes exist (`getHreflangEligibleLocales`, expansion shell rules) |
| **Exam hubs US/CA** (`examPathwayRegionalHreflang`) | `en-US`, `en-CA`, `x-default` from sibling pathways | **Not** the `/fr/…` marketing tree — would 404 |
| **Intl RN foundation** | `x-default` + region tags (`en-GB`, `en-AU`, …) per `countrySlug` | Regional exam product |
| **Allied health pathway** | **`x-default` only** | Single hub semantics per `examPathwayRegionalHreflang` |
| **Exam hubs in `marketingHreflangLanguagesForEnPath`** | Reduced to `x-default` + `en-CA` | `isExamHubMarketingPath` short-circuit |

---

## 2. Issues (route, risk, cause, tag, fix)

| # | Route / behavior | SEO risk | Likely cause | Tag | Recommended fix |
|---|------------------|----------|--------------|-----|-----------------|
| 1 | `/(default)/[locale]/[slug]/[examCode]/lessons` (non-allied) | **Missing cross-locale hreflang** vs `/fr/…` marketing | `alternates: { canonical }` only — no `languages` | **SAFE_FOR_AI** | Document: exam segment `locale` is **country**, not marketing language; no alternate URL set for fr/es on this tree |
| 2 | `…/lessons/[lessonSlug]` (indexable) | Same — **no `alternates.languages`** | Canonical only in `generateMetadata` | **SAFE_FOR_AI** | Same as #1; optional future: hreflang only if same lesson exists under another public country URL |
| 3 | Expansion vs default-only exam country pages | **Broken hreflang** if wrong cluster used | `marketingHreflangLanguagesForEnPath` + `expansionExamPathSupportsLocalizedMarketingShell` guard | **DEV_ONLY** | Contract tests already exist in localized SEO suite — extend when adding countries |
| 4 | `filterPublicHreflangRecord` drops entries | **Incomplete cluster** | Invalid / non-public URL rejected | **DEV_ONLY** | Monitor `safeServerLog` reject reasons (`*_hreflang_rejected`) |
| 5 | **Partial-tier** marketing locales | hreflang points to **noindex** pages | Robots policy: crawl allowed, index off; sitemap omits | **Medium** | Document for GSC: expect impressions to drop for partial locales until tier=full |
| 6 | **Blog** localized variants | Mismatch vs actual 200 URLs | DB-driven `hreflangEntries` | **High** if stale | Editorial + migration checks when slug changes |
| 7 | **HTTP validation** of hreflang targets (`seo-http-emit-validation.ts`) | Good URLs rejected → metadata fallback | Timeouts / strict mode | **DEV_ONLY** | Tune timeouts; ensure CDN returns 200 for all alternates |

---

## 3. robots.txt ↔ hreflang alignment

| Policy | Where | Consistency |
|--------|-------|-------------|
| `Disallow: /{lang}/` for **disabled** incomplete locales | `robots.txt/route.ts` + `isLocaleRobotsPathDisallowed` | Hreflang should **not** list those paths in sitemap-eligible clusters — `getHreflangEligibleLocales` must stay in sync | **DEV_ONLY** regression if desync |

---

## 4. Open Graph vs hreflang

| Risk | Mitigation in product |
|------|----------------------|
| OG tags do not emit `hreflang` — search engines use `<link rel="alternate">` | Ensure `Metadata.alternates.languages` set wherever cluster exists |

---

## 5. Acceptance

**hreflang** behavior is **consistent with routing reality** for exam trees (regional en-US/en-CA), **reduced** for exam hubs in global marketing alternates, and **absent** on pathway lesson/hub pages where no alternate localized URLs exist — documented as **by design** with residual **blog** and **validation** risks called out.
