# Robots.txt Audit

Generated: 2026-05-30T17:07:34.223Z

## Current Rules

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

## Blocked Pattern Classification

| Pattern | Classification | Recommendation |
| --- | --- | --- |
| /app/ | Should be blocked | Keep blocked; this is private, internal, API, or duplicate rewrite infrastructure. |
| /admin/ | Should be blocked | Keep blocked; this is private, internal, API, or duplicate rewrite infrastructure. |
| /internal/ | Should be blocked | Keep blocked; this is private, internal, API, or duplicate rewrite infrastructure. |
| /api/ | Should be blocked | Keep blocked; this is private, internal, API, or duplicate rewrite infrastructure. |
| /seo/ | Should be blocked | Keep blocked; this is private, internal, API, or duplicate rewrite infrastructure. |

## Public Content Block Review

No public marketing, lesson, blog, question, flashcard, ECG, pharmacology, or lab content path is directly blocked by the current robots.txt rules.

## Decision

- Keep: `/app/`, `/admin/`, `/internal/`, `/api/`, `/seo/`.
- Do not add locale disallows; current code correctly lets Googlebot crawl noindex locale pages so the noindex tag can be seen.
