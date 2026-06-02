# NurseNest — Prioritized SEO Remediation Plan

**Date:** 2026-05-30  
**Current errors:** 8,122 (5xx) + 18,985 (404) + 2,037 (robots) + 718 (crawled not indexed) + 5,611 (noindex)  
**Target after remediation:** < 500 (5xx) · < 1,000 (404) · < 100 (robots) · < 200 (crawled not indexed) · ~1,000 (noindex — intentional auth/app only)

---

## Sprint 1 — Critical (This Week)

### 1.1 — Convert Sitemap Routes from force-dynamic to ISR (30 min)

**Impact:** Eliminates ~600 5xx errors. Removes sitemap timeout risk.

For every sitemap route except `/sitemap.xml` (already static):
```typescript
// Remove: export const dynamic = "force-dynamic";
export const revalidate = 3600; // (86400 for allied/new-grad — static content)
```

Files: `sitemap-core.xml/route.ts`, `sitemap-blog.xml/route.ts`, `sitemap-lessons.xml/route.ts`, `sitemap-pathways.xml/route.ts`, `sitemap-localized.xml/route.ts`, `sitemap-clinical-modules.xml/route.ts`, `sitemap-fr-blog.xml/route.ts`, `sitemap-es-blog.xml/route.ts`, `sitemap-allied.xml/route.ts`, `sitemap-new-grad.xml/route.ts`

### 1.2 — Convert High-Traffic force-dynamic Marketing Pages to ISR (1 hr)

**Impact:** Eliminates ~5,400 5xx errors.

```typescript
// Remove force-dynamic, add:
export const revalidate = 1800;
```

Files:
- `(marketing)/(default)/[locale]/[slug]/[examCode]/[exam]/page.tsx` — `revalidate = 1800`
- `(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` — `revalidate = 1800`
- `(marketing)/(default)/[locale]/[slug]/[examCode]/osce/page.tsx` — `revalidate = 3600`
- `(marketing)/(default)/[locale]/[slug]/[examCode]/osce/[stationId]/page.tsx` — `revalidate = 3600`
- `(marketing)/(default)/[locale]/[slug]/[examCode]/study/[topicSlug]/page.tsx` — `revalidate = 3600`
- `(marketing)/(default)/[locale]/[slug]/[examCode]/study-resources/[bodyKey]/page.tsx` — `revalidate = 3600`
- `(marketing)/(default)/pricing/page.tsx` — `revalidate = 900`
- `(marketing)/(default)/flashcards/[slug]/page.tsx` — `revalidate = 3600`

### 1.3 — Fix High-Traffic Pages Accidentally Noindexed (2 hrs)

**Impact:** Could recover lost rankings on critical commercial pages.

```typescript
// In every generateMetadata catch block:
// BEFORE:
return { ...FALLBACK, robots: { index: false } };

// AFTER:
return { ...FALLBACK }; // No robots field = default (index, follow)
```

Specifically check: `/pricing`, `/question-bank`, `/nclex-rn-preparation`, `/canada/rn/nclex-rn`

### 1.4 — Add Locale Redirect for Unsupported Locale Sub-paths (1 hr)

**Impact:** Eliminates ~2,800 404s from non-hosted locales.

```javascript
// next.config.js — in redirects array
const NON_HOSTED_LOCALES = ["ko","tr","it","de","ar","zh-tw","zh","ja","fa","hu","ru","id","th","ur","ht","vi","ta","te","bn","mr","gu","pa"];
// Add redirects:
NON_HOSTED_LOCALES.map(locale => ({
  source: `/${locale}/:path*`,
  destination: `/:path*`,
  permanent: true,
}))
```

---

## Sprint 2 — High Priority (Next 2 Weeks)

### 2.1 — Add Legacy URL Redirects for Old Route Patterns (2 hrs)

**Impact:** Eliminates ~8,400 404s.

```javascript
// next.config.js
{
  source: "/canada/rn/nclex-rn/lessons/:slug",
  destination: "/canada/rn/nclex-rn/lessons",
  permanent: true,
},
{
  source: "/canada/rn/nclex-rn/practice-exams/:path*",
  destination: "/canada/rn/nclex-rn/cat",
  permanent: true,
},
{
  source: "/canada/rpn/rex-pn/lessons/:slug",
  destination: "/canada/rpn/rex-pn/lessons",
  permanent: true,
},
{
  source: "/canada/np/cnple/lessons/:slug",
  destination: "/canada/np/cnple/lessons",
  permanent: true,
},
{
  source: "/us/lpn/nclex-pn/:path*",
  destination: "/us/lpn/nclex-pn",
  permanent: true,
},
```

### 2.2 — Fix AI-Generated Content Links to Non-Existent Pages (4 hrs)

**Impact:** Eliminates ~4,200 404s from internal broken links.

Audit query:
```sql
SELECT id, stem FROM exam_questions WHERE rationale LIKE '%/tools/%' OR rationale LIKE '%/modules/advanced%';
SELECT id, body FROM blog_posts WHERE body LIKE '%/tools/%';
```

Then update content to link to existing pages or remove links.

### 2.3 — Fix Redirect Chains in next.config.js (2 hrs)

**Impact:** Eliminates ~1,500 404s.

Audit script:
```bash
# Extract all redirect targets and check they resolve correctly
node -e "
const config = require('./next.config.js');
config.redirects().then(r => r.forEach(redirect => console.log(redirect.source, '->', redirect.destination)));
"
```

### 2.4 — Add Internal Links to Orphaned CNPLE Pages (2 hrs)

**Impact:** Could unlock ~68 "Crawled Not Indexed" pages.

Add CNPLE topical links section to `/canada/np/cnple` hub page.

### 2.5 — Return 410 for Tool Paths That Will Never Exist (1 hr)

**Impact:** Eliminates ~2,000 404s with proper 410 signal.

```typescript
// middleware.ts or catch-all route
const DEPRECATED_TOOL_PATTERNS = ["/tools/acid-base-calculator", "/tools/opioid-conversion-calculator"];
if (DEPRECATED_TOOL_PATTERNS.some(p => pathname.startsWith(p))) {
  return new NextResponse(null, { status: 410 });
}
```

---

## Sprint 3 — Medium Priority (Month 2)

### 3.1 — Add lastmod to Sitemap Entries (1 hr)

**Impact:** Helps Google prioritize recrawling updated content.

```typescript
const entries: SitemapUrlEntry[] = lessonRows.map((l) => ({
  loc: `${origin}/.../${l.slug}`,
  lastmod: l.updatedAt.toISOString().split("T")[0],
}));
```

### 3.2 — Thin Content Pages — Add noindex or Add Content (4+ hrs)

**Impact:** Properly classifies 280 "Crawled Not Indexed" pages.

For each thin OSCE station page, study resources stub, or regional topic stub with <400 words: either add rich clinical content or add `robots: { index: false, follow: true }`.

### 3.3 — Fix `/api/public/flashcard-tags` 503 (30 min)

**Impact:** Eliminates ~400 5xx errors from crawled API endpoint.

```typescript
if (!isDatabaseUrlConfigured()) {
  return NextResponse.json({ tags: [] }, { status: 200 });
}
```

### 3.4 — Add X-Robots-Tag: noindex to API Routes (1 hr)

**Impact:** Prevents API routes from appearing in GSC going forward.

```typescript
// Middleware
if (pathname.startsWith("/api/")) {
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
```

---

## Sprint 4 — Locale Promotion (Months 2–6)

### 4.1 — Promote French to tier: "full" (4 weeks)

**Impact:** Unlocks ~180 French noindex URLs for indexing. French has the highest translation completion.

Steps:
1. Audit French translation completeness (core navigation, pricing, FAQ)
2. Verify at least 5 published French blog posts
3. Change `{ code: "fr", tier: "partial" }` → `{ code: "fr", tier: "full" }` in `marketing-languages.ts`
4. Verify French URLs appear in `sitemap-localized.xml` and `sitemap-fr-blog.xml`

### 4.2 — Promote German and Korean to tier: "partial" (8+ weeks)

**Impact:** No indexing change (partial stays noindex) but enables switcher display and partial hreflang.

---

## Expected Outcome After All Sprints

| Error Type | Before | After Sprint 1 | After Sprint 2 | After All Sprints |
|---|---|---|---|---|
| 5xx Server Errors | 8,122 | **~800** | ~500 | **< 300** |
| 404 Not Found | 18,985 | 16,000 | **~1,500** | **< 1,000** |
| Blocked by Robots | 2,037 | 2,037 | 1,000 | **< 100** (natural decay) |
| Crawled Not Indexed | 718 | 600 | 400 | **< 200** |
| Noindex (intentional) | 5,611 | 5,400 | 5,200 | **~1,000** (auth/app only) |

**Total reduction: 90%+ across all error types.**

---

## Monitoring Cadence

| Frequency | Action |
|---|---|
| Daily | Check GSC "Coverage" tab for new 5xx spikes |
| Weekly | Track crawl budget usage (Pages crawled/day) |
| Weekly | Track "Indexed pages" count (goal: increase by 100+/week) |
| Monthly | Full GSC export and error count comparison |
| Monthly | Lighthouse SEO score audit on top 20 pages |
