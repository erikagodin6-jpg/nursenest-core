# NurseNest — Crawled Not Indexed Audit

**Date:** 2026-05-30  
**Scope:** 718 URLs "Crawled — Currently Not Indexed" in Google Search Console

---

## What "Crawled Not Indexed" Means

Google successfully crawled these pages but chose not to index them. This is distinct from "noindex" (explicit signal) and "404" (server response). Google's decision is based on its assessment of:

- **Content quality** — thin, duplicate, or low-value content
- **Uniqueness** — near-duplicate of another indexed page
- **Signals** — low incoming links, low engagement, low freshness
- **Canonical confusion** — canonical tag conflicts
- **Crawl depth** — pages too deep in the site hierarchy

---

## Category 1 — Thin Programmatic SEO Pages (est. 280 URLs, 39%)

**Pattern:** Programmatic pages generated for exam pathways that have very little unique content — primarily repeating the exam name and a few links.

**Examples (inferred from route analysis):**
```
/{locale}/{slug}/{examCode}/osce
/{locale}/{slug}/{examCode}/osce/[stationId]  (low-traffic OSCE stations)
/{locale}/{slug}/{examCode}/study-resources/[bodyKey]
/clinical-modules/*  (thin topic stubs)
/[locale]/middle-east/[topic]  (sparse content)
/[locale]/china/[topic]  (sparse content)
```

**Why Google rejects them:**
- OSCE station pages with minimal text content (<300 words)
- Study resources stubs that link out but have no original content
- Regional pages (Middle East, China) with template-only content in incomplete locales

**Fix — Option A (Recommended): Consolidate thin pages**
```
/canada/rn/nclex-rn/osce/[stationId]
→ Merge all OSCE station content into: /canada/rn/nclex-rn/osce
  (redirect individual station URLs to hub)
```

**Fix — Option B: Add unique content to each page**
- Each OSCE station page needs ≥500 words of unique clinical content
- Each study-resources sub-page needs unique body system content

**Fix — Option C: Add `noindex` to thin stubs**
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hasRichContent = content?.wordCount > 400;
  return {
    robots: hasRichContent ? undefined : { index: false, follow: true },
  };
}
```

**Impact:** Could unlock ~280 pages for indexing if content is added. Or cleanly exclude them if noindex is added.

---

## Category 2 — Incomplete-Locale Marketing Pages Getting Crawled (est. 220 URLs, 31%)

**Pattern:** Pages in incomplete-tier locales (ta, te, bn, vi, ur, ht, etc.) that are crawlable but noindex. However, some of these appear in "Crawled Not Indexed" not "Excluded: noindex" — suggesting the noindex meta may not be rendering for all pages.

**Examples:**
```
/ta/pricing
/te/blog
/bn/lessons
/vi/question-bank
/ur/about
```

**Why they appear here instead of "Excluded: noindex":**
If the page returns a 200 but the `<meta name="robots" content="noindex">` is not in the `<head>`, Google will crawl and cache the content but not see the noindex signal.

**Investigation needed:**
```bash
# Check if noindex meta is rendering for incomplete locales
curl -s https://www.nursenest.ca/ta/pricing | grep -i "noindex"
# Expected output: <meta name="robots" content="noindex,follow"/>
```

**Fix:** Verify `localeRobotsOverride()` is correctly applied in `safeGenerateMetadata` for all incomplete locales. Check `safe-marketing-metadata.ts` lines 174–180.

**Impact:** If noindex is confirmed working, these 220 URLs will move to "Excluded: noindex" within 4–8 weeks.

---

## Category 3 — Duplicate Content / Near-Duplicate Pages (est. 130 URLs, 18%)

**Pattern:** Multiple pages with very similar content structures where Google has chosen one canonical and rejected others.

**Examples:**
```
/nclex-rn-question-bank     → near-duplicate of /question-bank
/nclex-question-bank-free   → near-duplicate of /free-nclex-practice-questions
/best-nclex-prep-course      → near-duplicate of /nclex-rn-preparation
/lpn-nclex-prep             → thin variant of /nclex-pn-preparation
/free-nclex-questions       → near-duplicate of /free-nclex-practice-questions
```

**Fix:**
1. **Consolidate** — redirect lower-traffic variant to the canonical page with 301
2. **Differentiate** — add meaningfully unique content to each page (different sample questions, different audience copy)
3. **Add canonical tags** explicitly pointing the duplicates to the primary URL:
```typescript
<link rel="canonical" href="https://www.nursenest.ca/question-bank" />
```

**Impact:** Once duplicates are consolidated, ~80 of these 130 pages will redirect to indexed canonical pages.

---

## Category 4 — Deep Crawl Pages with No Inlinks (est. 68 URLs, 9%)

**Pattern:** Pages that exist but have no internal links pointing to them beyond the sitemap. Google crawls via sitemap but deprioritizes because PageRank signal is zero.

**Examples:**
```
/cnple-lab-interpretation    (no inbound internal links)
/cnple-geriatrics            (orphan page)
/cnple-pediatrics            (orphan page)
/cnple-mental-health         (orphan page)
/cnple-prescribing-questions (orphan page)
```

**Root cause:** These CNPLE topical pages were created for SEO but not linked from main CNPLE hub, blog posts, or lesson content.

**Fix — Add internal links:**
1. Add a "Related Topics" section to the main CNPLE hub (`/canada/np/cnple`) linking to all sub-topic pages
2. Add inline links from relevant blog posts and lessons to these pages
3. Add these URLs to the `sitemap-cnple.xml` with appropriate `lastmod` dates

```tsx
// On /canada/np/cnple page:
<RelatedTopics links={[
  { href: "/cnple-lab-interpretation", label: "Lab Interpretation for NPs" },
  { href: "/cnple-prescribing-questions", label: "Prescribing Practice Questions" },
  { href: "/cnple-pediatrics", label: "Pediatrics Clinical Cases" },
  // ...
]} />
```

**Impact:** Increases internal PageRank signal, pushing ~50 of these 68 pages into the index within 3–6 months.

---

## Category 5 — Freshness Signal Too Low (est. 20 URLs, 3%)

**Pattern:** Pages that haven't been updated in 12+ months and cover topics where freshness matters.

**Examples:**
```
/nclex-study-plan           (last modified 18 months ago)
/nclex-vs-rex-pn            (static content, no `lastmod`)
/rex-pn-study-plan          (no `lastmod` in sitemap)
```

**Fix:**
1. Add `lastmod` dates to all sitemap entries from the DB
2. Refresh page content (add current NCLEX-RN Next Generation details, 2025/2026 exam stats)
3. Add `revalidate = 86400` to ensure ISR refreshes the page content regularly

**Impact:** ~15 pages could be indexed after content refresh signals freshness to Google.

---

## Aggregate Fix Priority

| Category | URLs | Primary Fix | Timeline |
|---|---|---|---|
| Thin programmatic pages | ~280 | Add noindex or add content | 2 weeks |
| Incomplete locale noindex verification | ~220 | Verify noindex rendering | 1 week |
| Near-duplicate consolidation | ~130 | 301 redirects + canonical tags | 3 weeks |
| Orphan pages (no inlinks) | ~68 | Add internal links from hub pages | 2 weeks |
| Freshness signal | ~20 | Update content + add `lastmod` | 2 weeks |

**Expected improvement:** If all fixes are applied, 500–650 of the 718 URLs could move from "Crawled Not Indexed" to either "Indexed" or properly "Excluded: noindex".

---

## Measurement

After implementing fixes:
1. Request URL inspection in GSC for the top 50 crawled-not-indexed URLs
2. Track "Crawled — currently not indexed" count weekly
3. Compare sitemap coverage reports before and after
