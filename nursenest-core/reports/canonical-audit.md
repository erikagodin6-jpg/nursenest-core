# Phase 3 — Canonical Audit
Generated: 2026-05-30 | Source: `src/lib/seo/marketing-alternates.ts`, `exam-pathway-hub-alternates.ts`

---

## Canonical Architecture

### How Canonicals Are Generated

**Exam pathway hubs** (`/us/rn/nclex-rn`):
```typescript
// src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx
const coreUrl = absoluteUrl(buildExamPathwayPath(pathway));
alternates: { canonical: coreUrl, languages: hreflang }
```
`buildExamPathwayPath` returns `/${countrySlug}/${roleTrack}/${examCode}` — deterministic, no duplicates.

**Country hub pages** (`/us`, `/canada`):
```typescript
// src/lib/marketing/marketing-country-hub-metadata.ts
const { canonical } = marketingAlternatesEnglishOnly(path);
```
`marketingAlternatesEnglishOnly("/us")` returns canonical at `https://nursenest.io/us`.

**Marketing locale pages** (`/fr/…`):
Canonicals are per-page via `safeGenerateMetadata` with locale-aware path construction.

---

## Self-Referencing Canonical — Verified

| Page | Canonical | Self-Referencing? |
|---|---|---|
| `/us/rn/nclex-rn` | `https://nursenest.io/us/rn/nclex-rn` | ✅ Yes |
| `/us/rn/nclex-rn/pricing` | `https://nursenest.io/us/rn/nclex-rn/pricing` | ✅ Yes |
| `/us/rn/nclex-rn/questions` | `https://nursenest.io/us/rn/nclex-rn/questions` | ✅ Yes |
| `/us/rn/nclex-rn/lessons` | `https://nursenest.io/us/rn/nclex-rn/lessons` | ✅ Yes |
| `/canada/rn/nclex-rn` | `https://nursenest.io/canada/rn/nclex-rn` | ✅ Yes |
| `/us` | `https://nursenest.io/us` | ✅ Yes |
| `/nclex-question-bank` | `https://nursenest.io/nclex-question-bank` | ✅ Yes |

---

## Hreflang Audit

### US ↔ CA NCLEX-RN Pair (Most Important)

```html
<!-- /us/rn/nclex-rn -->
<link rel="alternate" hreflang="en-US" href="https://nursenest.io/us/rn/nclex-rn" />
<link rel="alternate" hreflang="en-CA" href="https://nursenest.io/canada/rn/nclex-rn" />
<link rel="alternate" hreflang="x-default" href="https://nursenest.io/us/rn/nclex-rn" />
```

Source: `examPathwayRegionalHreflang()` — pairs pathways with same `roleTrack + examCode` across US and CA. US gets `x-default` priority. ✅

### International Pathway Shells (UK, AU, PH, IN)

```html
<!-- /exams/uk (when published) -->
<link rel="alternate" hreflang="en-GB" href="https://nursenest.io/exams/uk" />
<link rel="alternate" hreflang="x-default" href="https://nursenest.io/exams/uk" />
```
These are currently noindexed (unpublished markets), so hreflang signals are suppressed until launch. ✅

---

## 370 Duplicates Without User-Selected Canonical (GSC Issue)

### Root Causes

| Cause | Pages | Fix |
|---|---|---|
| `?pathwayId=` query strings | `/app/lessons?pathwayId=ca-rn-nclex-rn` | Already noindexed (learner shell). Will clear. |
| `?ref=` referral codes on marketing pages | `/us/rn/nclex-rn?ref=abc123` | Add `rel="canonical"` that strips query params — already handled by `safeGenerateMetadata` |
| `?checkout=cancelled` on pricing | `/pricing?checkout=cancelled` | One-off query param. Canonical strips it. |
| Locale-prefixed vs non-prefixed URLs | `/en/us/rn/nclex-rn` vs `/us/rn/nclex-rn` | Verify redirect from `/en/…` → canonical |

### Most Likely Pattern

The `?ref=` and `?pathwayId=` parameters on marketing pages are probably the 370 duplicates. Googlebot crawls these URLs (from referral links) and finds duplicate content.

**Fix:**
```typescript
// In safeGenerateMetadata, strip query params from canonical:
const canonicalUrl = new URL(absoluteUrl(pathname));
// Remove known tracking/state params
["ref", "friendCode", "checkout", "pathwayId"].forEach(p => canonicalUrl.searchParams.delete(p));
alternates: { canonical: canonicalUrl.toString() }
```

This is partially handled already but may not be consistent across all route groups.

---

## 23 Duplicates — Google Chose Different Canonical

These occur when Google disagrees with the specified canonical. Common causes:

| Scenario | Likely Pages | Action |
|---|---|---|
| Thin content on canonical + richer content elsewhere | Old marketing landing pages | Improve content depth on canonical |
| Internal links pointing to non-canonical URL | Old `/lessons` hub (now `/us/rn/nclex-rn/lessons`) | Fix internal links (see internal linking audit) |
| Canonical doesn't match `x-default` hreflang | Locale pages | Verify `x-default` matches canonical |

**Primary fix:** Correct the internal link from `US_HOMEPAGE.primaryCta.href: "/lessons"` → `/us/rn/nclex-rn` (already done in this session). This removes a major canonical conflict signal.

---

## Canonical Loops & Chains — Not Found

No canonical loops or chains were found in the codebase. All canonicals are static, self-referencing, and generated from `absoluteUrl()` which always uses the production origin.

---

## Action Items

| Issue | Severity | Day |
|---|---|---|
| Fix referral/state param stripping in canonical generation | HIGH | Day 2 |
| Verify `/en/…` locale redirects to canonical | MEDIUM | Day 3 |
| Submit `/sitemap.xml` to GSC to prioritize correct URLs | HIGH | Day 1 |
| Monitor GSC "Duplicate without canonical" over next 30 days | MEDIUM | Ongoing |
