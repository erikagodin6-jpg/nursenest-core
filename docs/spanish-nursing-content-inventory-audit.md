# Spanish Nursing Content Inventory Audit

Date: 2026-05-31

Scope: Phase 2 Spanish nursing ecosystem planning for future Spanish-language NCLEX and NP publication.

Status: `DRAFT - NOT READY FOR PUBLICATION`

## Executive Summary

The Spanish technical architecture exists, but the Spanish nursing education ecosystem is not publication-ready. Current Spanish content in the repository is limited to generic `es-intl` longtail drafts. These drafts are not sufficient for NCLEX-RN, NCLEX-PN, FNP, AGPCNP, or PMHNP launch because they are not mapped to US Hispanic learners, Puerto Rico, Mexico, Latin America, NCLEX blueprint categories, NP certification domains, Spanish clinical terminology review, or Spanish monetization flows.

Spanish must be built as original Spanish-language nursing education, not machine-translated English.

## Evidence From Current Repository

| Asset area | Current evidence | Finding |
|---|---:|---|
| Spanish language infrastructure | `src/lib/i18n/language-readiness.ts`, `src/lib/i18n/language-subdomains.ts` | Spanish is routable on `es.nursenest.ca` and protected by `noindex,nofollow`. |
| Spanish blog drafts | 140 `es-intl-*` files under `src/content/blog-static-longtail` | Generic international Spanish drafts; not Spanish NCLEX or NP launch content. |
| US NCLEX-RN source lessons | 745 English/source lessons mapped to `us-rn-nclex-rn` | Strong source base; requires original Spanish authoring/localization and 755 additional lesson topics to reach long-term target. |
| US NCLEX-PN source lessons | 99 English/source lessons mapped to `us-lpn-nclex-pn` | Early source base only; major content gap. |
| FNP source lessons | 506 English/source lessons mapped to `us-np-fnp` | Source count exceeds 500 target, but Spanish FNP content is 0 publication-ready. |
| AGPCNP/PMHNP lessons | No explicit Spanish or source pathway count found in static lesson inventory | Requires pathway architecture/content queue validation before production. |
| Static NCLEX questions | 62 English NCLEX items across Tier 1-3 catalogs | Useful structure source only; far below Spanish NCLEX targets. |
| Static practical nursing questions | 75 English CNPLE/REx-PN-style practical nursing items | Not NCLEX-PN Spanish content; may inform PN clinical judgment patterns only. |
| Flashcards | Runtime/DB-backed flashcard infrastructure; no confirmed Spanish NCLEX/NP static pool | Spanish flashcard inventory should be counted as 0 until DB audit confirms reviewed assets. |

## Current Spanish Publication-Ready Counts

Publication-ready means Spanish original or clinically adapted content with clinical review, Spanish language review, SEO review, blueprint mapping, adaptive metadata, and publication approval.

| Pathway | Lessons | Questions | Flashcards | NGN/cases | Blogs |
|---|---:|---:|---:|---:|---:|
| NCLEX-RN Spanish | 0 | 0 | 0 | 0 | 0 |
| NCLEX-PN Spanish | 0 | 0 | 0 | 0 | 0 |
| FNP Spanish | 0 | 0 | 0 | 0 | 0 |
| AGPCNP Spanish | 0 | 0 | 0 | 0 | 0 |
| PMHNP Spanish | 0 | 0 | 0 | 0 | 0 |

## Existing Draft Content Posture

The 140 Spanish `es-intl` drafts should be treated as topic discovery only. They should not be published for the Spanish NCLEX ecosystem without rework because they:

- are international rather than NCLEX/NP-specific,
- are not country-specific for US Hispanic, Puerto Rico, Mexico, or Latin America,
- are not mapped to NCLEX or NP certification blueprints,
- contain generic international links,
- do not prove Spanish clinical language review,
- do not provide premium pathway readiness.

## Source-Reuse Framework

| Source pool | Reuse level | Required transformation |
|---|---|---|
| English NCLEX-RN lessons | High | Re-author in natural professional Spanish; map to NCLEX blueprint and Spanish learner needs. |
| English NCLEX-PN source lessons | Medium | Expand substantially before Spanish build; adapt PN scope and NCLEX-PN style. |
| English FNP source lessons | High | Re-author as Spanish NP certification content; verify US scope, diagnostics, prescribing, and certification alignment. |
| English NGN/question catalogs | Low-medium | Use as item structure examples only; Spanish questions must be newly authored and reviewed. |
| `es-intl` blog drafts | Low | Use topic ideas only; not publication-ready. |

## Required Spanish Metadata

Every Spanish asset must include:

| Field | Required pattern |
|---|---|
| `locale` | `es` initially; future variants may include `es-US`, `es-MX`, `es-PR`, `es-CO` |
| `originalLanguage` | `es`, `en`, or source locale |
| `adaptationStatus` | `original-spanish`, `adapted-from-en`, `clinical-rewrite-needed`, `language-review-needed`, `approved` |
| `clinicalReviewStatus` | `not-started`, `in-review`, `changes-requested`, `approved` |
| `spanishLanguageReviewStatus` | `not-started`, `in-review`, `approved` |
| `seoReviewStatus` | `not-started`, `in-review`, `approved` |
| `publicationStatus` | `draft`, `review`, `approved`, `published` |
| `indexable` | `false` until all gates pass |
| `visibleInNavigation` | `false` until all gates pass |
| `launchReady` | `false` until readiness reaches 95% |

## Recommendation

Build Spanish NCLEX-RN first. It has the largest traffic/revenue opportunity and the strongest existing English source inventory. NCLEX-PN should follow once the Spanish item/rationale pipeline works. FNP can start in parallel as a smaller advanced-practice pilot, but AGPCNP and PMHNP should wait until pathway architecture, reviewer capacity, and Spanish NP terminology standards are proven.

