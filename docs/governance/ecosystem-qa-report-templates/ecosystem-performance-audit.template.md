# Ecosystem performance + stability audit

**Date:** YYYY-MM-DD  
**Environment:**  
**Owner:**

## Build + route integrity

| Check | Result |
|-------|--------|
| `npm run build` (or CI equivalent) | PASS/FAIL |
| Critical route unit/i18n tests | |

## Runtime performance (sampling)

| Route | Metric | Threshold | Observed |
|-------|--------|-----------|----------|
| Lesson hub | TTFB / client JS | | |
| Homepage | LCP (field or lab) | | |

## Payload / query hygiene

| Check | Result |
|-------|--------|
| Lesson hubs — bounded lists | |
| No huge JSON on list routes | |
| Duplicate heavy queries | |

## Stability

| Check | Result |
|-------|--------|
| Error shells on primary journeys | none expected |
| SEO canonical / sitemap continuity | |

## Playwright / scripts

| Command | Result |
|---------|--------|
| `lesson-hub-performance.spec.ts` | |
| `paid-user-key-pages-performance.spec.ts` | |

## Issues

| ID | Severity | Area | Remediation |
|----|----------|------|-------------|
| | | | |
