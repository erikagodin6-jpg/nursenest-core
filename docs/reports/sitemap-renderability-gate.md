# Sitemap Renderability Gate

Generated: 2026-06-01

## Goal

Production sitemaps should contain only route families that production can render reliably.

## Current State

Sitemaps are reachable:

| Sitemap | Status | Time | Cache |
|---|---:|---:|---|
| `/sitemap.xml` | 200 | 0.012 s | HIT |
| `/sitemap-blog.xml` | 200 | 0.011 s | HIT |

The previous crawl found 6,828 HTTP 504 responses from 7,918 sitemap URLs, but the root cause is shared origin saturation. The current data does not prove that 6,828 URLs are invalid or should be permanently excluded.

## Gate Policy

Before publishing or submitting sitemap segments:

1. Sample each route family.
2. Verify status 200, canonical present, no accidental noindex, and response time under threshold.
3. If a family has systemic 5xx after deployment, quarantine that segment from submission until fixed.
4. Do not quarantine a segment solely because the origin is unhealthy across unrelated families.

## Immediate Decision

NO sitemap segments were removed in this branch.

Reason: deployment of the runtime health fix must happen first. Removing valid public URLs while the origin is still unstable would be an SEO workaround, not an origin recovery.

## Gate Status

Current gate decision: NO-GO for GSC submission until post-deploy crawl passes.

