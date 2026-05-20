# Allied SEO differentiation audit

Source: `src/content/pathway-lessons/allied-bundled-catalog.json`  
Pathways: us-allied-core, ca-allied-core

## Runtime differentiation

Marketing lesson pages on allied core pathways apply `buildAlliedAwareLessonPublicSeoSurface()` when `alliedProfessionKey` is set on the lesson row (metadata, H1, JSON-LD headline/description, and `about: Occupation`). Catalog-only rows without that field rely on distinct titles/descriptions in JSON.

## Summary

| Check | Count |
|---|--:|
| Duplicate slugs (within a pathway list) | 0 |
| Duplicate normalized titles (different slugs) | 0 |
| Duplicate meta descriptions (different slugs; US/CA mirrors excluded) | 0 |
| Duplicate lesson intros (different slugs) | 0 |
| Near-duplicate intros (different slugs; Jaccard ≥ 0.92) | 0 |

**Gate:** **PASS**

## Informational

- **US/CA mirrored lessons** (same slug, identical meta — excluded from duplicate gates): 15 description groups.

## Duplicate slugs

_None._

## Duplicate titles

_None._

## Duplicate meta descriptions

_None._

## Duplicate intros (exact normalized)

_None._

## Near-duplicate intros

_None._

