# Canonical Hardening

Generated: 2026-06-01T19:09:32.412Z

## Verdict

**Partially remediated locally; production validation pending deployment.**

The fresh production audit sampled canonical tags and found 3 canonical failures. All three sampled failures are safe local code fixes rather than content rewrites.

## Failures Found

| URL | Issue | Production canonical | Local fix |
| --- | --- | --- | --- |
| https://nursenest.ca | canonical_missing | - | Added explicit homepage self-canonical metadata. |
| https://nursenest.ca/advanced-hemodynamic-monitoring | canonical_mismatch | https://nursenest.ca//advanced-hemodynamic-monitoring/en | Replaced reversed shared-alternate call with English-only self canonical. |
| https://nursenest.ca/advanced-labs-interpretation | canonical_mismatch | https://nursenest.ca//advanced-labs-interpretation/en | Replaced reversed shared-alternate call with English-only self canonical. |

## Files Changed

- `nursenest-core/src/app/(marketing)/(default)/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/advanced-labs-interpretation/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/advanced-hemodynamic-monitoring/page.tsx`

## Remaining Gate

Zero critical canonical failures cannot be certified until production is redeployed and the 5xx crawl gate is clean. The current crawl produced 7580 non-200 rows, so many pages were not HTML-inspected for canonical correctness.

CSV: `docs/reports/canonical-errors.csv`
