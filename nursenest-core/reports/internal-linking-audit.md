# Phase 6 — Internal Linking Audit
Generated: 2026-05-30 | Source: codebase inspection + US homepage content fix applied this session

---

## Summary of Fix Applied This Session

**Critical fix made:** `US_HOMEPAGE.primaryCta.href` was `/lessons` (generic). Changed to `/us/rn/nclex-rn`.

This was a structural internal linking gap that:
- Prevented PageRank flow from the `/us` hub to the canonical US RN hub
- Caused Google to see `/us` → `/lessons` → `/canada/rn/nclex-rn` (CA page) as the authority chain
- Contributed to the "Google chose different canonical" issue

**Fix location:** `src/lib/marketing/countries/registry.ts` — `US_HOMEPAGE.primaryCta.href`

---

## Current Internal Linking Map (US Pathway)

### Primary Authority Chain (Post-Fix)
```
/ (homepage)
 └── /us (country hub, "RN" card)
      └── /us/rn/nclex-rn (canonical US RN hub) ★ primary target
           ├── /us/rn/nclex-rn/lessons (lessons hub)
           │    └── /us/rn/nclex-rn/lessons/{slug} (individual lessons)
           ├── /us/rn/nclex-rn/questions (question bank)
           ├── /us/rn/nclex-rn/cat (CAT exam)
           ├── /us/rn/nclex-rn/pricing (pricing)
           └── /us/rn/nclex-rn/report-card (readiness)
```

### Programmatic SEO Entry Points
```
/nclex-question-bank → links to /us/rn/nclex-rn/questions
/nclex-rn-practice-questions → links to /us/rn/nclex-rn
/cat-nclex-simulator → links to /us/rn/nclex-rn/cat
/free-nclex-practice-questions → links to /us/rn/nclex-rn
/how-to-pass-nclex-2026 → links to /us/rn/nclex-rn
```

---

## Orphan Pages & Weak Links Found

### Issue 1 — US NP hub pages have weak linking to NCLEX-RN hub
**Severity: MEDIUM**

US NP pathways (`/us/np/fnp-exam-prep`, etc.) don't link to the canonical US RN hub. For users considering both RN and NP, there's no internal cross-pathway link.

**Fix:** Add "Also studying for NCLEX-RN?" cross-link widget in NP hub pages.

### Issue 2 — `/us/rn` disambiguation page depth
**Severity: LOW**

`/us/rn` is a thin landing page that lists the RN pathways. It should link prominently to `/us/rn/nclex-rn` as the canonical entry. Verify this is in place.

### Issue 3 — Blog posts need stronger US pathway links
**Severity: MEDIUM**

Blog posts about NCLEX preparation should link to `/us/rn/nclex-rn` and `/nclex-question-bank`. Check that the blog distribution footer includes US-specific pathway links.

**File:** `src/components/seo/marketing-study-cross-links.tsx`

### Issue 4 — NCLEX commercial pages cross-link to each other
**Severity: LOW**

Commercial landing pages have `internalLinks` arrays. Verify these link to the US RN hub and each other (NCLEX link cluster authority).

---

## Link Depth Analysis

| Page | Depth from Homepage | Links Pointing In |
|---|---|---|
| `/us/rn/nclex-rn` | 2 (/ → /us → /us/rn/nclex-rn) | Programmatic pages, US hub, blog posts |
| `/us/rn/nclex-rn/questions` | 3 | Commercial pages, hub |
| `/us/rn/nclex-rn/lessons` | 3 | Commercial pages, hub |
| `/us/rn/nclex-rn/lessons/{slug}` | 4 | Lessons hub, blog |
| `/nclex-question-bank` | 1 (/ → /nclex-question-bank if in nav) | Blog, hub, other commercial |

**Crawl depth is acceptable.** No page is deeper than 4 levels.

---

## Hub Connection Gaps

| Missing Link | From | To | Priority |
|---|---|---|---|
| US → NCLEX lessons | `/us` CTA | `/us/rn/nclex-rn/lessons` | ✅ Fixed (pathwayCards updated) |
| NCLEX blog → US hub | Blog posts about NCLEX | `/us/rn/nclex-rn` | HIGH |
| Programmatic → US pricing | `/nclex-question-bank` etc. | `/us/rn/nclex-rn/pricing` | MEDIUM |
| US NP hub → NCLEX-RN hub | `/us/np/*` pages | `/us/rn/nclex-rn` | LOW |

---

## Breadcrumbs

Breadcrumbs exist via `BreadcrumbBar` component in `src/components/seo/breadcrumb-bar.tsx` and `pathwayOverviewBreadcrumbs()`. The US RN hub generates:

```
Home / United States / RN / NCLEX-RN
```

This is correct and matches the URL structure.

---

## Action Items (Priority Order)

| Action | Impact | Effort | Day |
|---|---|---|---|
| ✅ Fixed `/us` primaryCta → `/us/rn/nclex-rn` | HIGH | Done | Done |
| Add NCLEX-RN cross-links in blog posts about exam prep | HIGH | 2h | Day 2 |
| Verify `/us/rn/nclex-rn` appears in homepage pathway band | HIGH | 1h | Day 1 |
| Add US → pricing page link from question bank commercial page | MEDIUM | 1h | Day 3 |
| Add "Also preparing for NCLEX-RN?" block on NP hub pages | LOW | 2h | Day 7 |
