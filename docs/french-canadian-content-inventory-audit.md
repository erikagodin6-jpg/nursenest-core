# French Canadian Content Inventory Audit

Date: 2026-05-31

Scope: Phase 1 French Canadian nursing ecosystem planning for future `fr-CA` publication. This audit covers REx-PN, Canadian NCLEX-RN, and CNPLE readiness using the current NurseNest codebase and content inventory.

Status: `DRAFT - NOT READY FOR PUBLICATION`

## Executive Summary

The multilingual SEO architecture exists, but French Canadian exam-pathway content is not publication-ready. The current repository contains:

- subdomain and noindex infrastructure for French (`fr.nursenest.ca`),
- English Canadian source lessons that can be clinically adapted,
- English Canadian/RN/PN/NP blog inventories that can inform French Canadian briefs,
- 140 French `fr-intl` longtail blog drafts.

The 140 existing French blog drafts are not French Canadian launch content. They are international, generic, and not mapped to Quebec/New Brunswick/Ontario francophone learner needs, Canadian regulatory terminology, REx-PN, Canadian NCLEX-RN, or CNPLE publication gates.

## Evidence From Current Inventory

| Asset area | Current evidence | Finding |
|---|---:|---|
| French language infrastructure | `src/lib/i18n/language-readiness.ts`, `src/lib/i18n/language-subdomains.ts` | French is routable and protected by `noindex,nofollow`. |
| French blog drafts | 140 files beginning with `fr-intl-` under `src/content/blog-static-longtail` | Not Canadian exam-pathway content; keep draft/research-only. |
| REx-PN source lessons | 427 English/source lessons mapped to `ca-rpn-rex-pn` | Useful source base; requires French Canadian rewriting/localization and 73 additional lesson topics to reach 500. |
| Canadian NCLEX-RN source lessons | 746 English/source lessons mapped to `ca-rn-nclex-rn` | Useful source base; requires French Canadian rewriting/localization and 254 additional lessons to reach 1,000. |
| CNPLE source lessons | 415 English/source lessons mapped to `ca-np-cnple` | Source count exceeds 300 target, but French Canadian NP content remains at 0 publication-ready assets. |
| Static NCLEX question catalogs | 62 English NCLEX questions across Tier 1-3 static catalogs | Far below Canadian NCLEX-RN target; not French. |
| Static practical nursing question catalog | 75 English CNPLE/REx-PN-style questions | Useful pattern source only; not French, not enough for REx-PN/CNPLE targets. |
| Flashcards | DB-backed/runtime inventory patterns plus limited static allied flashcards | No confirmed French Canadian exam flashcard inventory in static content. |

## Current French Canadian Publication-Ready Counts

Publication-ready means clinically reviewed, language reviewed, SEO reviewed, blueprint-mapped, metadata-complete, and approved for `fr-CA`.

| Pathway | Lessons | Questions | Flashcards | NGN cases | Bowties | Matrix | Blog articles |
|---|---:|---:|---:|---:|---:|---:|---:|
| REx-PN French Canadian | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Canadian NCLEX-RN French Canadian | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| CNPLE French Canadian | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Source-Reuse Candidates

Reuse means clinical concept reuse, not literal translation.

| Source pool | Reuse posture | Required transformation |
|---|---|---|
| English REx-PN lessons | High | Rewrite in French Canadian clinical language; add Canadian practical nursing scope, delegation, documentation, and provincial framing. |
| English Canadian NCLEX-RN lessons | High | Rewrite for francophone RN learners; preserve NCLEX clinical judgment while localizing units, terminology, and Canadian practice notes. |
| English CNPLE lessons | Medium-high | Re-author in advanced practice French with CNPLE/NP clinical reasoning, prescribing, differential diagnosis, and provincial regulatory nuance. |
| English Canadian PN/RN/NP blogs | Medium | Convert into French Canadian search-intent briefs and rewrite as original French content. |
| `fr-intl` blog drafts | Low | Use only for topic discovery; content tone, links, and examples are not Canadian-specific enough for publication. |

## Major Content Risk

The largest risk is treating French as a translation layer rather than a first-class Canadian nursing pathway. French Canadian learners need content that reflects:

- Canadian regulation and professional accountability,
- Quebec and New Brunswick language expectations,
- French-speaking Ontario and Manitoba nursing education vocabulary,
- REx-PN/CNPLE/NCLEX exam strategy in French,
- Canadian medication naming and documentation conventions,
- practical differences between RN, RPN/LPN, and NP scope.

## Required Metadata For Every French Asset

Every French Canadian content item must store:

| Field | Required value pattern |
|---|---|
| `locale` | `fr-CA` |
| `country` | `CA` |
| `originalLanguage` | `en`, `fr-CA`, or source locale |
| `translationStatus` | `original-fr-ca`, `adapted-from-en`, `clinical-rewrite-needed`, `language-review-needed`, `approved` |
| `clinicalReviewStatus` | `not-started`, `in-review`, `changes-requested`, `approved` |
| `languageReviewStatus` | `not-started`, `in-review`, `approved` |
| `seoReviewStatus` | `not-started`, `in-review`, `approved` |
| `publicationStatus` | `draft`, `review`, `approved`, `published` |
| `indexable` | `false` until all gates pass |
| `visibleInNavigation` | `false` until all gates pass |
| `launchReady` | `false` until all readiness scores reach 95% |

## Recommendation

Prioritize REx-PN first. It has the clearest Canadian practical nursing source inventory and the strongest French Canadian differentiation opportunity. Canadian NCLEX-RN should follow after the REx-PN French production workflow is stable. CNPLE should remain third because NP French content requires more advanced clinical and regulatory review.

