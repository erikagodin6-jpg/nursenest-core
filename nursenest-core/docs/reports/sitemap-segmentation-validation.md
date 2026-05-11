# Sitemap segmentation validation report

Generated: **2026-05-11T04:05:57.700Z** (Phase 4 offline validator — App Router GET handlers).

## Summary

| Field | Value |
| --- | --- |
| Origin | `https://www.nursenest.ca` |
| Per-segment time budget (ms) | `240000` (env `SITEMAP_VALIDATE_SEGMENT_BUDGET_MS`) |
| Index child set matches approved | yes |
| Duplicate page `<loc>` count | **0** |
| Invalid page loc occurrences (excluded/private) | **0** |
| Errors | **0** |
| Warnings | **0** |

## Segment names, URL counts, generation time

| Segment | URLs | Invalid locs | Gen time (ms) | 48k band |
| --- | ---: | ---: | ---: | --- |
| **core** (`sitemap-core.xml`) | 18 | 0 | 3326 | OK |
| **blog** (`sitemap-blog.xml`) | 3916 | 0 | 414 | OK |
| **fr-blog** (`sitemap-fr-blog.xml`) | 1 | 0 | 57 | OK |
| **es-blog** (`sitemap-es-blog.xml`) | 1 | 0 | 82 | OK |
| **pathways** (`sitemap-pathways.xml`) | 25 | 0 | 1061 | OK |
| **lessons** (`sitemap-lessons.xml`) | 1 | 0 | 223 | OK |
| **localized** (`sitemap-localized.xml`) | 48 | 0 | 5 | OK |
| **clinical-modules** (`sitemap-clinical-modules.xml`) | 5 | 0 | 2 | OK |
| **allied** (`sitemap-allied.xml`) | 24 | 0 | 4 | OK |
| **new-grad** (`sitemap-new-grad.xml`) | 46 | 0 | 3 | OK |

## Index validation

- Generation time: **96** ms
- XML well-formed: **yes**
- Approved children (`10`): `https://www.nursenest.ca/sitemap-core.xml`, `https://www.nursenest.ca/sitemap-blog.xml`, `https://www.nursenest.ca/sitemap-fr-blog.xml`, `https://www.nursenest.ca/sitemap-es-blog.xml`, `https://www.nursenest.ca/sitemap-pathways.xml`, `https://www.nursenest.ca/sitemap-lessons.xml`, `https://www.nursenest.ca/sitemap-localized.xml`, `https://www.nursenest.ca/sitemap-clinical-modules.xml`, `https://www.nursenest.ca/sitemap-allied.xml`, `https://www.nursenest.ca/sitemap-new-grad.xml`

## Tests run

- `npm run typecheck:critical`
- `npm run sitemap:validate`
- `npm run sitemap:report`
- `node --import tsx --test src/lib/seo/sitemap-segment-validator.test.ts`

## Follow-up recommendations

- Keep segment collectors disjoint; resolve duplicate `<loc>` rows before scaling pathway/blog inventory.
- Raise `SITEMAP_VALIDATE_SEGMENT_BUDGET_MS` locally if cold DB causes false timeouts.
- Pair with `verify:sitemap` / HTTP smoke against a deployed origin when validating live responses.
