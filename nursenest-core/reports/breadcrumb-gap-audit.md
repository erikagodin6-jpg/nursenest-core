# Breadcrumb gap audit — NurseNest

**Sources:** `src/lib/seo/pathway-breadcrumbs.ts`, `breadcrumb-i18n.ts`, `breadcrumb-utils.ts`, `breadcrumb-bar.tsx` / JSON-LD components, `np-seo-alias-canonical-policy.ts`, representative pages (`pre-nursing/lessons`, `(default)/lessons`, pathway lesson body).

---

## 1. Strengths

| Pattern | Location | SEO benefit |
|---------|----------|-------------|
| **NP alias alignment** | `np-seo-alias-canonical-policy.ts` | BreadcrumbList JSON-LD omits alias base on subpages so schema matches **canonical** core pathway URLs |
| **Absolute URLs in schema** | `toAbsoluteSiteUrl` / `breadcrumb-i18n` | Valid `https://` items for Google |
| **i18n keys on crumbs** | `i18nKey` on `BreadcrumbCrumb` | Enables localized visible labels via `formatMarketingMessage` |

---

## 2. Gaps and risks (issue table)

| # | Route / surface | SEO risk | Likely cause | Tag | Recommended fix |
|---|-----------------|----------|--------------|-----|-----------------|
| 1 | **Locales outside** `BREADCRUMB_LABEL_FALLBACKS` (`breadcrumb-i18n.ts`: hi, tl, pt only) | Visible crumb may fall back to **English structural name** while URL is localized | Limited hardcoded fallbacks when catalog missing | **Medium** | Expand fallbacks or ensure shard always has `breadcrumbs.*` keys |
| 2 | **Production** with missing i18n value | Crumb shows **English** or structural name | `localizeBreadcrumbLabel` returns structuralName when key resolves empty | **SAFE_FOR_AI** | Catalog QA for `breadcrumbs.*` |
| 3 | **Development** empty label | **Throws** (`breadcrumb-i18n.ts`) | Missing translation + no structural name | **DEV_ONLY** | Good guard — fix catalog before ship |
| 4 | `EXAM_LESSONS_INDEX.label` | **Hardcoded English** string constant | `pathway-breadcrumbs.ts` uses literal `"Lessons by exam pathway"` for structural name | **Low** | Display uses `i18nKey: breadcrumbs.examLessonsIndex` — ensure catalog has all locales |
| 5 | Pathway lesson detail | **JSON-LD vs visible bar drift** | Different code paths or `hubBasePath` not passed on NP alias subpages | **Medium** | Code review: same `pathwayOverviewBreadcrumbs` options as canonical policy |
| 6 | Category / pagination on marketing lessons hub | Last crumb may not reflect `?page=` | Breadcrumb builder may omit query | **Low** | Align visible trail with canonical (prefer page in trail or omit page from schema only if policy says so) |
| 7 | Allied global hub | Shorter trail after redirects | Users hit consolidated URL — crumbs should reference global paths only | **Medium** | Verify post-redirect crumb hrefs match `buildAlliedGlobalHubPath` |

---

## 3. JSON-LD coverage gaps

| Surface | BreadcrumbList | Notes |
|---------|----------------|-------|
| Pre-nursing lessons | Present (`BreadcrumbJsonLd`) | — |
| Marketing `/lessons` landing | Present + `WebPageJsonLd` | — |
| Pathway lesson detail | `PathwayLessonMedicalEducationJsonLd` + medical schema | Breadcrumb bar visibility separate — confirm both present where SEO requires |

---

## 4. Consistency with canonical

| Check | Policy reference |
|-------|------------------|
| NP alias overview | Third crumb may use **keyword** URL (`hubBasePath`) matching self-canonical |
| NP alias child | Omit `hubBasePath` so items match core canonical | `np-seo-alias-canonical-policy.ts` |

---

## 5. Acceptance

**Breadcrumb gaps** are mapped: **fallback locale coverage**, **hardcoded index label**, **NP alias / allied consolidation** alignment, and **schema vs visible bar** drift risk. No code changes in this audit.
