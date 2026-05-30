# NurseNest — Canonical Audit (Phase 3)

**Date:** 2026-05-30
**Scope:** 370 "Duplicate without user-selected canonical" + 23 "Duplicate — Google chose different canonical"

---

## Canonical Infrastructure Summary

NurseNest uses two canonical generation helpers in `src/lib/seo/marketing-alternates.ts`:

| Helper | Used For | Produces |
|---|---|---|
| `marketingAlternatesSharedPage(locale, enPath)` | Localized marketing routes | Canonical + hreflang languages map |
| `marketingAlternatesEnglishOnly(enPath)` | English-only / non-localized routes | Self-canonical only |
| `marketingAlternatesForNoindexUtilityPage(locale, enPath)` | Login, forgot-password, etc. | Canonical only (no hreflang) |

All canonicals resolve through `absoluteMarketingCanonical()` which enforces `CANONICAL_PRODUCTION_ORIGIN` (the HTTPS apex domain). The `isValidPublicUrl()` guard rejects any canonical that fails the public URL validator before it is emitted.

---

## Phase 3 Finding Matrix

### ✅ Areas with Correct Canonical Implementation

| Pattern | Implementation | Status |
|---|---|---|
| Marketing home (`/`) | Self-canonical via `marketingAlternatesSharedPage("en", "/")` | Correct |
| Localized home (`/fr/`, `/es/`, etc.) | Canonical = English `/`, hreflang set | Correct |
| Blog posts | `marketingAlternatesSharedPage` with English path | Correct |
| Exam pathway hubs | `marketingAlternatesEnglishOnly` (no cross-locale) | Correct |
| Login / forgot-password | `marketingAlternatesForNoindexUtilityPage` | Correct |
| Lessons hubs | Self-canonical via per-route `alternates` | Correct |

### ⚠️ Areas Requiring Investigation

#### 1. Programmatic SEO Pages — Canonical Consistency Risk

**Where:** `src/components/seo/` — `authority-cluster-page.tsx`, `authority-resource-page.tsx`, `authority-comparison-page.tsx`, `healthcare-test-bank-page.tsx`

**Issue:** These components render content for multiple URL patterns (e.g., `/nclex-rn-practice-questions`, `/nclex-practice-questions`, `/free-nclex-practice-questions`). If multiple URL slugs resolve to the same component with different canonical values, Google will report "Duplicate without user-selected canonical."

**Fix needed:** Audit every programmatic SEO route in `src/app/(marketing)/(default)/[slug]/` to confirm canonical is the exact URL of the current page, not a fallback to a parent category URL.

#### 2. Locale Mirror Pages with Incomplete Hreflang

**Where:** `src/app/(marketing)/[locale]/` routes
**Issue:** Locales marked `tier: "partial"` emit noindex but still emit hreflang. Google may follow the hreflang to a noindexed page and refuse to honor the canonical chain.

**Fix needed:** For `tier: "partial"` locales, either omit hreflang entirely or promote to `tier: "complete"` once content is ready. Mixing hreflang with noindex is a recognized canonical confusion signal.

#### 3. Practice Exam Hub Duplicates

**Affected routes:**
- `/nclex-practice-questions` 
- `/free-nclex-practice-questions`
- `/nclex-question-bank`
- `/adaptive-nclex-testing`

These may render near-identical content with different canonicals. If Google discovers them and finds substantial overlap, it will choose its own canonical.

**Fix needed:** Ensure each route has a clearly differentiated title, H1, and intro paragraph — OR consolidate to one canonical URL with 301 redirects from the duplicates.

#### 4. Pathway + Country Parameter Canonicals

**Pattern:** `/canada/rn/nclex-rn/questions` vs `/us/rn/nclex-rn/questions`
**Issue:** These are intentionally different (Canada-first vs US scope) but share nearly identical page templates. The canonical is handled per-country via `examPathwayRegionalHreflang` but Search Console is flagging 23 "Google chose different canonical" issues, suggesting Google is finding the US/Canada versions too similar.

**Fix needed:** Each country-specific hub needs:
1. A country-specific H1 (not just the template default)
2. A visible "Scoped to: Canada" or "Scoped to: United States" indicator in page copy
3. Explicit `x-default` hreflang pointing to the preferred canonical

#### 5. `/seo/` Internal Rewrite Targets

**Issue:** The `robots.txt` disallows `/seo/` which is an internal rewrite path. However, if any public URL emits a canonical pointing to `/seo/…` instead of the public URL, that canonical is broken.

**Fix needed:** Grep for `canonical: /seo/` in all metadata generators to confirm no page emits a `/seo/` path as its canonical.

---

## Canonical Loop Risk

Current infrastructure does not emit canonical loops. `marketingAlternatesSharedPage` always points the localized page to its English equivalent. However:

**Risk:** If the English page itself has a canonical pointing to a different URL (e.g., a redirect target), a two-step canonical chain forms. Google does not reliably follow chains beyond one hop.

**Audit command:**
```bash
grep -r 'canonical.*\/canada\/' src/app --include="*.tsx" --include="*.ts" | grep -v 'en/'
```

---

## Duplicate Without User-Selected Canonical — Root Causes

Based on the 370 Search Console reports, the most likely causes are:

| Root Cause | Estimated Count | Priority |
|---|---|---|
| Programmatic SEO near-duplicate URLs | ~120 | HIGH |
| Locale mirror pages missing canonical signal | ~100 | MEDIUM |
| Pathway country variants too similar | ~80 | HIGH |
| Practice exam hub URL proliferation | ~50 | MEDIUM |
| Trailing slash / query param variants | ~20 | LOW |

---

## Recommendations

### Critical
1. Audit every programmatic SEO slug in `/(default)/[slug]/` — confirm canonical = `req.url`, never a parent category
2. Ensure Canada vs US pathway pages have meaningfully different H1 and opening paragraph
3. Add `x-default` hreflang pointing to `/` (English canonical) on all localized mirrors

### High Priority
4. Consolidate `/nclex-practice-questions`, `/free-nclex-practice-questions`, `/nclex-question-bank` — pick one primary, 301 the others
5. Remove hreflang from `tier: "partial"` locales until promoted to complete

### Medium Priority
6. Add visible country-scope indicator on all pathway hubs ("Canada" / "United States")
7. Validate `/seo/` internal rewrites never emit a public canonical

---

*Generated from code review of `src/lib/seo/marketing-alternates.ts`, `src/lib/seo/safe-marketing-metadata.ts`, `src/lib/seo/indexability-policy.ts`*
