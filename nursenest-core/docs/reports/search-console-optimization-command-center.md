# Search Console Optimization Command Center

Generated: 2026-05-31T05:07:33.510Z

Source: no local Search Console exports found. Add `current*.csv` or `current*.json`, optional `previous*.csv` or `previous*.json`, and optional `page-profiles.json` to `data/search-console/`.

## Executive SEO Metrics

- Total organic clicks: 0
- Total impressions: 0
- Average CTR: 0.0%
- Average position: 0
- Opportunity pages: 0
- Content decay findings: 0
- Authority expansion opportunities: 0
- Internal link recommendations: 0
- Snippet opportunities: 0
- EEAT refresh findings: 0
- Refresh queue items: 0

## Highest Impression / Low CTR Opportunities

| Tier | Page | Impressions | CTR | Expected CTR | Position | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |

## Content Decay

| Page | Click Change | Impression Change | Current Position | Previous Position | Reasons |
| --- | --- | --- | --- | --- | --- |

## Authority Expansion Opportunities

| Page | Query | Impressions | Position | Type | Recommendation |
| --- | --- | --- | --- | --- | --- |

## Featured Snippet Opportunities

| Page | Query | Position | Impressions | Block | Recommendation |
| --- | --- | --- | --- | --- | --- |

## EEAT Refresh Queue

| Page | Score | Needs Clinical Review | Issues |
| --- | --- | --- | --- |

## Refresh Workflow Queue

| Tier | Revenue Potential | Page | Reasons | Actions |
| --- | --- | --- | --- | --- |

## Cluster Performance

| Cluster | Pages | Impressions | Clicks | CTR | Avg Position | Conversions | Revenue | Authority Score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Quick Wins

| Tier | Revenue Potential | Page | Primary Action |
| --- | --- | --- | --- |

## Permanent Workflow

1. Export current-month GSC rows by page/query/device/country into `data/search-console/current.csv`.
2. Export previous comparison period into `data/search-console/previous.csv`.
3. Add `data/search-console/page-profiles.json` when conversion, EEAT, cluster, and internal-link metadata is available.
4. Run `npx tsx scripts/seo/generate-search-console-optimization-report.mts`.
5. Work Tier 1 refreshes first: high traffic, high revenue potential, immediate refresh.
6. Re-run monthly and compare opportunity closure, cluster growth, and conversion attribution.
