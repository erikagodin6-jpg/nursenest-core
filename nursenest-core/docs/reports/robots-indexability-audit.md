# Robots Indexability Audit

Generated: 2026-06-01T01:26:47.645Z

## Search Console Signal

- Reported Blocked by robots.txt: 2,037
- URL export status: No local GSC export rows loaded for blocked; affected URL-level findings remain Unable To Verify from this workspace.

## Current Robots.txt

```txt
User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /internal/
Disallow: /api/
Disallow: /seo/

Sitemap: https://nursenest.ca/sitemap.xml
```

## Rule Classification

| Pattern | Classification | Recommendation |
| --- | --- | --- |
| /app/ | Safe to block | Keep blocked; this is private app, admin, billing, checkout, API, internal, or duplicate rewrite infrastructure. |
| /admin/ | Safe to block | Keep blocked; this is private app, admin, billing, checkout, API, internal, or duplicate rewrite infrastructure. |
| /internal/ | Safe to block | Keep blocked; this is private app, admin, billing, checkout, API, internal, or duplicate rewrite infrastructure. |
| /api/ | Safe to block | Keep blocked; this is private app, admin, billing, checkout, API, internal, or duplicate rewrite infrastructure. |
| /seo/ | Safe to block | Keep blocked; this is private app, admin, billing, checkout, API, internal, or duplicate rewrite infrastructure. |

## Valuable Content Block Check

Current source robots rules do **not** directly block lessons, questions, blog, glossary, flashcards, pharmacology, ECG, labs, marketing pages, or localized pages.

Incomplete locale pages should remain crawlable when they emit page-level `noindex`; blocking them in `robots.txt` prevents Google from seeing that directive.

## Action Items

1. Load the GSC blocked-by-robots URL export into `data/gsc-indexing/blocked.csv` and rerun this audit.
2. If any exported URL contains lesson/blog/question/glossary/pharmacology/ECG/lab/marketing/localized content, remove the robots block and use canonical/noindex policy instead.
3. Keep a single sitemap directive pointing to `https://nursenest.ca/sitemap.xml`.
