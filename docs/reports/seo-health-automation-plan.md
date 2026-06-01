# Future-Proof SEO System

Generated: 2026-06-01T19:09:32.412Z

## Weekly Jobs To Enforce

- Orphan detection from live homepage, blog hub, category hubs, topic hubs, and authority clusters.
- Canonical validation for all sitemap URLs.
- Sitemap validation and renderability sampling before sitemap publication.
- Broken-link detection from rendered HTML.
- Hub coverage validation for RN, RPN, NP, NCLEX-PN, and Allied topics.
- Article freshness scoring using updatedAt, reviewedAt, and clinical topic volatility.

## SEO Health Score Inputs

| Signal | Weight |
| --- | ---: |
| 5xx-free crawlability | 30 |
| Canonical correctness | 15 |
| Sitemap coverage | 15 |
| Internal-link/orphan coverage | 15 |
| Authority cluster coverage | 10 |
| E-E-A-T completeness | 10 |
| Conversion CTA coverage | 5 |

## Current Score

12/100, blocked by production 5xx crawl failures.

## Dashboard Recommendation

Extend the existing SEO/authority command center surfaces rather than creating a separate SEO product. The codebase already has authority command-center and cluster dashboard primitives; the missing piece is a scheduled fresh production audit feeding current metrics into the dashboard.
