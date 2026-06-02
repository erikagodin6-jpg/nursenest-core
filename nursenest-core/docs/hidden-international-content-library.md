# Hidden International Content Library

Date: 2026-05-31

Status: internal inventory rules for recovered and future international content.

## Required State

Every future international content candidate must be stored or represented with:

- `published=false`
- `launchReady=false`
- `visibleInNavigation=false`
- `indexable=false`
- `adminOnly=true`

No learner-facing route, marketing page, sitemap, or navigation item may reference hidden international inventory.

## Current Machine-Readable Inventory

The initial hidden inventory lives in:

`src/lib/international-content/hidden-international-content-inventory.ts`

It records recovered candidates for:

- Global heart failure, COPD, and sepsis reuse.
- UK NMC and ACP blog seeds.
- Australia nursing blog seeds.
- New Zealand cultural safety seeds.
- U.S. NCLEX and NGN seeds.
- International translation overlays.

## Inventory Fields

| Field | Purpose |
| --- | --- |
| `id` | Stable recovered candidate identifier. |
| `title` | Human-readable inventory label. |
| `kind` | Lesson, question, flashcard, simulation, clinical skill, blog seed, blueprint, translation overlay, or marketing asset. |
| `scope` | Global, country-specific, or future market scope. |
| `sourcePath` | Repository location where the candidate was recovered. |
| `reuseDisposition` | Reuse, country supplement, exam supplement, or review required. |
| `candidateMarkets` | Markets where the asset may be useful after review. |
| visibility flags | Required hidden state contract. |

## Review Workflow

1. Recover candidate from repo/source.
2. Add to hidden inventory.
3. Fingerprint against existing content.
4. Classify as global core, country supplement, or exam supplement.
5. Review for clinical accuracy and regulator fit.
6. Only then move into a pathway-specific draft queue.

## Publication Gate

Hidden inventory cannot be published directly. It must first pass through:

1. Content quality score.
2. Clinical review.
3. Country/regulator review.
4. Duplicate review.
5. Entitlement and route review.
6. SEO/indexation approval.

