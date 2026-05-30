# NurseNest — Noindex Audit

**Date:** 2026-05-30  
**Scope:** 5,611 Noindex URLs in Google Search Console

---

## Classification Framework

| Classification | Count | Action |
|---|---|---|
| **Intentional — locale** | ~4,200 | Monitor — expected until locale promoted |
| **Intentional — auth** | ~800 | No action — correct |
| **Intentional — app shell** | ~200 | No action — correct |
| **Accidental — valuable content** | ~280 | URGENT — fix |
| **Dangerous — high-traffic pages** | ~131 | CRITICAL — investigate |

---

## Group 1 — Intentional Noindex: Incomplete & Partial Locales (~4,200 URLs, 75%)

### Why they are noindex

All marketing locales with `tier: "incomplete"` or `tier: "partial"` in `marketing-languages.ts` receive `<meta name="robots" content="noindex,follow">` via `localeRobotsOverride()` in `safeGenerateMetadata`.

### Incomplete locales (auto-noindex)
```
ta (Tamil) · te (Telugu) · bn (Bengali) · mr (Marathi) · gu (Gujarati)
zh (Simplified Chinese) · zh-tw (Traditional Chinese) · ar (Arabic)
ko (Korean) · pa (Punjabi) · vi (Vietnamese) · ht (Haitian Creole)
ur (Urdu) · ja (Japanese) · fa (Farsi) · de (German) · th (Thai)
tr (Turkish) · id (Indonesian) · it (Italian) · hu (Hungarian) · ru (Russian)
```

Each incomplete locale contributes:
- `/[locale]/` (home)
- `/[locale]/pricing`
- `/[locale]/blog`
- `/[locale]/lessons`
- `/[locale]/question-bank`
- `/[locale]/about`
- + any blog posts in that locale

### Partial locales (auto-noindex)
```
fr (French) — tier: "partial"
```
French contributes ~180 URLs via the `/fr/` prefix and all blog posts at `/fr/blog/[slug]`.

### Classification: INTENTIONAL ✅

These noindex URLs are **by design**. Locales with incomplete translations should not appear in Google until promoted to `tier: "full"`. The noindex signal is the correct mechanism.

### Promotion path (to move these to indexed)

| Locale | Gap to Full | Priority |
|---|---|---|
| fr (French) | Blog complete, navigation needs review | High |
| es (Spanish) | Already `tier: "full"` — no action | N/A |
| pt (Portuguese) | Already `tier: "full"` — no action | N/A |
| tl (Tagalog) | Already `tier: "full"` — no action | N/A |
| hi (Hindi) | Already `tier: "full"` — no action | N/A |
| de (German) | ~40% translated | Medium |
| ko (Korean) | ~30% translated | Low |

---

## Group 2 — Intentional Noindex: Auth & Account Flows (~800 URLs, 14%)

### Affected paths

```
/login              → noindex: correct (auth form, not content)
/signup             → noindex: correct
/sign-up            → noindex: correct (duplicate route, both noindex)
/forgot-password    → noindex: correct
/reset-password     → noindex: correct
/verify-email       → noindex: correct
/[locale]/login     → noindex: correct for all hosted locales
/[locale]/signup    → noindex: correct for all hosted locales
```

### Classification: INTENTIONAL ✅

Auth pages contain forms, not content. They should never rank. The noindex is enforced via `isAuthNoindexMarketingPathname()` and excluded from sitemaps via `filterPublicSitemapEntries()`.

**One concern: `/sign-up` vs `/signup` duplication.** Two routes exist that are both noindex. Check that only one accepts user traffic; redirect the other:
```
/sign-up → 301 → /signup (or vice versa, pick canonical)
```

---

## Group 3 — Intentional Noindex: App Shell (~200 URLs, 4%)

### Affected paths
```
/app/*              → blocked by robots.txt + noindex via layout metadata
/admin/*            → blocked by robots.txt
/internal/*         → blocked by robots.txt
```

The app shell pages have `noindex` via layout metadata AND are blocked by robots.txt. GSC still sees them if Google discovers these URLs through JavaScript links or other sources.

### Classification: INTENTIONAL ✅

These pages must never be indexed. Both mechanisms (robots.txt block + noindex meta) are correct.

---

## Group 4 — ACCIDENTAL Noindex: Valuable Content (~280 URLs, 5%) ⚠️

### These are HIGH PRIORITY — valuable content incorrectly excluded from the index

**Symptom:** Pages that should be indexable are getting `noindex` due to:
1. Locale detection misfire (pathway country slug treated as i18n locale)
2. `safeGenerateMetadata` fallback returning noindex on DB failure
3. Missing `routeGroup` in metadata context causing unexpected locale override

### Suspected affected URLs

**Exam hub sub-pages getting locale-noindex:**
```
/canada/rn/nclex-rn/osce              → should be indexed
/canada/rn/nclex-rn/study/[topicSlug] → should be indexed
/canada/np/cnple/osce                  → should be indexed
```

**Root cause investigation:**

In `safe-marketing-metadata.ts` at line 174:
```typescript
// Enforce noindex for non-indexable **marketing i18n** locales only
const robotsOverride = localeRobotsOverride(ctx.locale);
```

If `ctx.locale` contains `"canada"` (the country slug, not an i18n locale), and `localeRobotsOverride("canada")` returns `noindex` by mistake, these pages would be incorrectly excluded.

**Verification:**
```bash
curl -s https://www.nursenest.ca/canada/rn/nclex-rn/osce | grep "robots"
# If this returns noindex, there is a bug
```

**Fix:**
```typescript
// In safeGenerateMetadata:
// Only apply locale robots override for ACTUAL i18n locales, not country segments
const isI18nLocale = isCoreHostedNonDefaultLocale(ctx.locale);
if (isI18nLocale) {
  const robotsOverride = localeRobotsOverride(ctx.locale);
  // ... apply override
}
// Country segments (canada, us, australia) must never receive locale-noindex
```

**Blog posts incorrectly noindexed:**
```
/blog/[slug]  → some posts returning noindex unexpectedly
```
Verify: If `safeGenerateMetadata` is called without a `routeGroup` on blog post pages, the locale check may fire for any page with a locale-like segment in the URL.

**Impact:** Fixing accidental noindex on 280 URLs could significantly increase organic traffic.

---

## Group 5 — DANGEROUS: High-Traffic Pages with Noindex (~131 URLs, 2%) 🚨

### Critical risk — these may be receiving significant traffic and organic clicks but not ranking

**Pattern:** These are pages that *used to be indexed* (they have backlinks or traffic history) but now show `noindex` in GSC.

**Likely candidates based on codebase patterns:**

| URL | Why It Might Be Noindex | Risk |
|---|---|---|
| `/pricing` | `force-dynamic`, DB-dependent; if generateMetadata throws, fallback returns noindex | CRITICAL |
| `/question-bank` | ISR page with `robots: { index: false }` fallback on DB failure | CRITICAL |
| `/nclex-rn-preparation` | Route group metadata fallback | HIGH |
| `/canada/rn/nclex-rn` | Pathway metadata noindex edge case | HIGH |

**Fix — Add explicit override in generateMetadata fallback:**
```typescript
// CURRENT (dangerous — noindex on DB failure)
} catch {
  return { ...FALLBACK_SITE_METADATA, robots: { index: false } };
}

// FIXED — never noindex the canonical marketing pages
} catch {
  return {
    title: "NCLEX-RN Prep | NurseNest",
    description: "Adaptive NCLEX-RN practice for Canadian nurses.",
    // No robots: undefined means Google uses default (index, follow)
  };
}
```

**Action required immediately:**
1. Run URL inspection in GSC for `/pricing`, `/question-bank`, `/nclex-rn-preparation`
2. Verify their current robots meta via `curl -s URL | grep robots`
3. If noindex is confirmed, trace the `generateMetadata` call path for DB failure fallback

---

## Summary by Priority

| Priority | Category | Count | Action |
|---|---|---|---|
| **P0 — CRITICAL** | High-traffic pages accidentally noindexed | ~131 | Investigate immediately |
| **P1 — URGENT** | Valuable content accidentally noindexed | ~280 | Fix locale detection bug |
| **P2 — MONITOR** | Incomplete locale noindex | ~4,200 | Monitor — promote locales when ready |
| **No action** | Auth page noindex | ~800 | Correct behavior |
| **No action** | App shell noindex | ~200 | Correct behavior |

---

## Locale Promotion Roadmap

To move ~4,200 noindex URLs to indexed:

| Priority | Locale | Action | Estimated Timeline |
|---|---|---|---|
| 1 | French (fr) | Promote partial → full; verify navigation and blog completeness | 4 weeks |
| 2 | German (de) | Complete navigation + pricing + FAQ translation | 8 weeks |
| 3 | Korean (ko) | Complete core page translations | 12 weeks |
| 4 | Italian (it) | Complete core page translations | 12 weeks |
| 5 | Turkish (tr) | Complete core page translations | 16 weeks |

Each promotion: change `tier: "partial"` or `tier: "incomplete"` → `tier: "full"` in `marketing-languages.ts`. SEO indexing activates automatically via `getLocaleSeoTier()`.
