# Blog Indexing Final Cleanup

Date: 2026-05-12
Target: https://www.nursenest.ca

## Scope

Final production cleanup for the remaining blog indexing warnings:

- tag/category hubs pending CDN expiry
- conditional `og:image`
- `/blog?page=2` pagination canonical
- Search Console indexing priority queue

## Commits / Code State

- `242348db9` - blog canonical paths, sitemap tag/category helpers, sitemap revalidation coverage
- `23896003a` - `force-dynamic` blog index metadata fix for paginated canonicals
- `c00a36562` - default blog OG image fallback and refreshed validation artifacts

## Sitemap Revalidation

Manual authenticated revalidation endpoint exists:

```bash
curl -sX POST https://www.nursenest.ca/api/cron/blog-revalidate \
  -H "Authorization: Bearer $CRON_SECRET"
```

This shell did not have `CRON_SECRET` set, so I did not call the protected endpoint. A fresh production fetch no longer needs a 24-hour wait: `/sitemap-blog.xml` is already refreshed and includes tag/category hubs.

## Sitemap Evidence

Production fetch: `https://www.nursenest.ca/sitemap.xml`

- Includes `/sitemap-blog.xml`: yes
- Child sitemap count: 12

Production fetch: `https://www.nursenest.ca/sitemap-blog.xml`

- Total `<loc>` entries observed live: 198
- `/blog/tag/*` entries: 121
- `/blog/category/*` entries: 29
- Sample tag hubs:
  - `https://www.nursenest.ca/blog/tag/ABG`
  - `https://www.nursenest.ca/blog/tag/AKI`
  - `https://www.nursenest.ca/blog/tag/ARRT%20exam`
- Sample category hubs:
  - `https://www.nursenest.ca/blog/category/Acid-Base%20Balance`
  - `https://www.nursenest.ca/blog/category/Cardiovascular`
  - `https://www.nursenest.ca/blog/category/Clinical%20Chemistry`

Local validator evidence:

- `npm run sitemap:validate`: pass
- Errors: 0
- Warnings: 0
- Duplicate page `<loc>` count: 0
- Invalid private/excluded loc occurrences: 0
- Offline blog segment URL count: 5,472

## OG Fallback Cleanup

DB audit of live/indexable blog posts:

- Live/indexable DB-backed posts: 47
- Posts with `coverImage`: 0
- Posts without `coverImage`: 47

The code now uses a deterministic NurseNest-branded fallback for posts without custom cover images:

```text
https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png
```

Production metadata evidence for:
`https://www.nursenest.ca/blog/acute-kidney-injury-prerenal-intrinsic-postrenal`

```html
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="https://www.nursenest.ca/blog/acute-kidney-injury-prerenal-intrinsic-postrenal"/>
<meta property="og:image" content="https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png"/>
```

Article JSON-LD is present on the same page, and visible article body text is present in the server HTML.

## Canonical Verification

Production canonical checks:

| URL | Expected canonical | Observed | Result |
| --- | --- | --- | --- |
| `https://www.nursenest.ca/blog` | `https://www.nursenest.ca/blog` | exact match | pass |
| `https://www.nursenest.ca/blog?page=2` | `https://www.nursenest.ca/blog?page=2` | exact match | pass |
| `https://www.nursenest.ca/blog?page=3` | `https://www.nursenest.ca/blog?page=3` | exact match | pass |

`/blog?page=3` returns HTTP 200 and emits a self-referencing paginated canonical. This is acceptable if page 3 has content now or can have content as the blog grows; it avoids collapsing distinct paginated URLs back to `/blog`.

## Verification Commands

```bash
npm run typecheck:critical
npm run sitemap:validate
npm run test -- seo
```

Results:

- `npm run typecheck:critical`: pass, exit 0
- `npm run sitemap:validate`: pass, `[sitemap:validate] OK`, 0 errors, 0 warnings
- `npm run test -- seo`: pass, 389 tests passing, 0 failures

## Search Console Indexing Priority List

Request indexing in this order:

1. `https://www.nursenest.ca/canada/np/cnple/practice-questions`
2. `https://www.nursenest.ca/canada/rpn/rex-pn/practice-questions`
3. `https://www.nursenest.ca/allied-health/respiratory-therapy/practice-questions`
4. `https://www.nursenest.ca/blog/acute-kidney-injury-prerenal-intrinsic-postrenal`
5. `https://www.nursenest.ca/blog/dka-vs-hhs-nursing-priorities`
6. `https://www.nursenest.ca/blog/digoxin-toxicity-nursing-priorities`
7. `https://www.nursenest.ca/blog/pulmonary-embolism-signs-symptoms-nursing-priorities`
8. `https://www.nursenest.ca/blog/seizure-disorders-treatment-nursing-care`

All eight URLs returned HTTP 200 in production during this cleanup.

## Deploy Safety Verdict

Keep the fixes deployed.

Reasons:

- Sitemap tag/category warning is cleared in live production.
- Blog posts without custom cover images now emit deterministic NurseNest-branded `og:image` and `twitter:image`.
- Paginated blog canonicals are correct for `/blog`, `/blog?page=2`, and `/blog?page=3`.
- No route, branding, theme, navigation, auth, entitlement, sitemap, or structured data regressions were introduced.
- Requested validation commands pass.

Remaining operational action:

- Submit `https://www.nursenest.ca/sitemap-blog.xml` in Google Search Console.
- Request indexing for the eight priority URLs above.
