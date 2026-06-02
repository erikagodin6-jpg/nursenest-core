# Sitemap — production deploy QA & Search Console handoff (Phase 6)

**Purpose:** Operational checklist for **after** deploying segmented sitemaps and **handing off** to Search Console—without changing application code in this document.

**Authority:** Current architecture is **index-first**: `/sitemap.xml` = `<sitemapindex>`; **robots.txt** lists **only** the index URL. Child urlsets: `SITEMAP_INDEX_CHILD_FILENAMES` in `src/lib/seo/sitemap-index-children.ts`.

**Related docs:** `docs/planning/sitemap-architecture-audit-and-roadmap.md`, Phases 1–5 reports under `docs/reports/`, especially `sitemap-segmentation-final-seo-evidence.md` and generated `sitemap-segmentation-validation.md`.

---

## 1. Production QA checks (pre- or post-deploy)

Run **automated** checks from the repo (same-origin / offline handlers):

```bash
cd nursenest-core
npm run typecheck:critical
npm run sitemap:validate
npm run sitemap:report
```

| # | Check | How to verify | Pass criteria |
|---|--------|----------------|----------------|
| P1 | **`/sitemap.xml`** returns **sitemap index** XML | `curl -sS "https://www.nursenest.ca/sitemap.xml"` (production host) | Root element `sitemapindex`; **not** a flat `urlset` only |
| P2 | **Every child sitemap** returns valid XML | GET each child listed in index `<loc>` | Parseable XML; root `urlset` per child |
| P3 | **`robots.txt`** references approved strategy | `curl -sS "https://www.nursenest.ca/robots.txt"` | Exactly **one** `Sitemap:` line → **`…/sitemap.xml`** (canonical origin); matches `CANONICAL_SITEMAP_LINES` contract |
| P4 | Child sitemap URLs use **canonical origin** | Inspect index `<loc>` values | All `https://www.nursenest.ca/sitemap-*.xml` (no wrong host, no `http:`) |
| P5 | No forbidden URLs in **page** `<loc>` values | `npm run sitemap:validate` + spot grep | No `/app`, `/admin`, `/api`, `/seo`, no `?` or `#` in locs |
| P6 | **No duplicate** `<loc>` across child segments | Validation script global duplicate check | **0** duplicates reported |
| P7 | **Budgets** respected | Validator output + logs | No segment **≥ 48k** URLs; generation time **≤** `SITEMAP_VALIDATE_SEGMENT_BUDGET_MS` (default 240000 ms unless overridden) |
| P8 | **Blog** URLs include **lastmod** where emitted | View `/sitemap-blog.xml` sample rows | Posts include `<lastmod>` from publish/update rows (`listBlogSitemapEntriesSafe`) |
| P9 | **Lessons / pathways / allied / new-grad** match approved **public** routes | Spot-check known URLs + product registry | Only marketing/public surfaces; no learner shells |

**Optional HTTP smoke (staging/production):** `npm run verify:sitemap` or project-specific SEO HTTP scripts when `BASE_URL` is set—confirms **200** responses on sampled URLs.

---

## 2. Search Console handoff

### 2.1 What to submit

| Policy | Action |
|--------|--------|
| **Current (index + single robots line)** | In Google Search Console → **Sitemaps**, submit **only** `https://www.nursenest.ca/sitemap.xml`. Crawlers discover **child** urlsets via index `<loc>` entries. |
| **Do not** bulk-submit all eight children unless product explicitly adopts an **alternate policy** (duplicate discovery signals, harder ops). Default is **index submission only**. |

### 2.2 Monitoring

| Area | What to watch |
|------|----------------|
| **Indexed vs submitted** | Index coverage / sitemap report: submitted URLs vs indexed; investigate large gaps only if URLs are truly indexable. |
| **Excluded / noindex** | “Excluded” reasons: verify expected **noindex** on partial locales, auth pages, etc.—not “leakage” from sitemap if URLs were never submitted or are correctly noindexed. |
| **Private route leakage** | **Zero** `/app`, `/admin`, `/api` URLs in coverage from sitemap-derived crawls; if seen, treat as incident—review collectors + `filterPublicSitemapEntries`. |
| **Representative inspection** | URL Inspection tool: pick **one URL per segment** (core hub, blog post, pathway hub, lesson detail, localized page, `/tools/*` teaser, allied hub, new-grad hub). Confirm canonical + indexability match expectations. |

### 2.3 Bing / other engines

Repeat **index-only** submission where the engine supports sitemap indexes; avoid redundant per-child submissions unless policy changes.

---

## 3. Rollback plan (operational — only if production incident)

Use only if the **sitemap index** causes a documented production issue (e.g., crawler confusion, unexpected soft 404s on children—not typical).

| Step | Action |
|------|--------|
| 1 | **Revert** the deployment branch/commit that introduced the problematic sitemap behavior (or restore prior route behavior via controlled release). |
| 2 | If historical **merged single urlset** at `/sitemap.xml` existed: restoring it is a **code + deploy** change—do **not** patch production without PR review. Preserve **`filterPublicSitemapEntries`** and **`isValidPublicUrl`** on any restored builder. |
| 3 | **robots.txt**: After rollback, confirm **`Sitemap:`** still points at the **actual** discovery file you ship (index vs merged—must stay **one** canonical line per current contract). Re-read `src/app/robots.txt/route.ts` tests. |
| 4 | **Rerun** `npm run sitemap:validate` and `npm run sitemap:report`; archive output for the incident record. |
| 5 | **Search Console**: Remove obsolete sitemap submission if URL shape changed; resubmit the correct sitemap URL post-fix. |

**Note:** Rollback semantics depend on **git history** and release policy; this section is a checklist, not an automated rollback.

---

## 4. Post-deploy evidence checklist

Capture for release ticket / compliance folder:

| Artifact | Example |
|----------|---------|
| Production **URL** tested | Record exact host (`https://www.nursenest.ca`) |
| **robots.txt** screenshot or saved response | `curl` output or browser screenshot |
| **Sitemap index** screenshot or saved XML | First 50 lines + full line count |
| **Child sitemap** samples | One snippet per segment file (redact if needed) |
| **Validation output** | Paste or attach `npm run sitemap:validate` exit **0** log + `docs/reports/sitemap-segmentation-validation.md` timestamp |
| **Search Console** submission | Date submitted; screenshot of sitemap status |
| **Unresolved warnings** | Validator warnings (e.g. approaching 48k); GSC warnings—list owners |

---

## 5. Commands reference (evidence refresh)

```bash
npm run typecheck:critical
npm run sitemap:validate
npm run sitemap:report
```

Optional: `npm run verify:sitemap` when validating HTTP behavior against a live `BASE_URL`.

---

## 6. Remaining follow-ups

1. **Quarterly** GSC indexed vs submitted review per pathway/blog volume growth.  
2. **Incident playbook**: If validator fails in CI/CD after deploy, block promotion until `duplicate_page_locs` / invalid loc errors clear.  
3. **Stakeholder training**: Search Console users submit **only** the index URL unless leadership changes policy.

---

*Phase 6 — documentation only; no runtime, robots, canonical, hreflang, or page code changes in this deliverable.*
