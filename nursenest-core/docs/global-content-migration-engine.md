# Global Content Migration Engine

Date: 2026-05-31

Status: internal architecture strategy. No migration should publish content automatically.

## Objective

Move NurseNest from country-by-country content copies to a reusable layered model:

`Global Core` -> `Country Supplement` -> `Exam Supplement`

## Canonical Example

`Heart Failure Global Core`

Used by:

- Canada RN NCLEX-RN.
- United States RN NCLEX-RN.
- United Kingdom RN NMC CBT.
- Australia RN NMBA.
- New Zealand RN NCNZ.
- Ireland RN NMBI.

Country supplements add local escalation, documentation, discharge planning, scope, terminology, and health-system context. Exam supplements add item format, competency mapping, and exam strategy.

## Proposed Migration Shape

| Layer | Owned Fields | Example |
| --- | --- | --- |
| Global Core | Clinical science, pathophysiology, assessment, interventions, patient safety, universal pearls | Heart Failure pathophysiology and nursing priorities |
| Country Supplement | Regulator language, role scope, documentation, health system, cultural safety, local escalation | NHS escalation, NMBA standards, Te Tiriti |
| Exam Supplement | Blueprint domain, item type, scoring, exam strategy, readiness domain | NMC CBT safe practice, NCLEX NGN clinical judgment |

## Content Type Strategy

| Content Type | Migration Pattern |
| --- | --- |
| Lessons | One global lesson with supplement blocks rendered by pathway. |
| Questions | Shared clinical concept with exam-specific stem, options, rationale, and competency tags. |
| Flashcards | Shared global cards plus country/exam include/exclude tags. |
| Simulations | Shared patient state engine plus local escalation and documentation overlays. |
| Clinical Skills | Shared procedure with country-specific scope and documentation notes. |
| Labs | Shared interpretation with unit/reference/critical reporting overlays. |
| Pharmacology | Shared mechanism/safety with drug-name and regulation overlays. |

## Migration Steps

1. Fingerprint existing content by normalized title, topic slug, system, and core clinical concept.
2. Select or create a canonical global core record.
3. Attach country supplements instead of duplicating the full body.
4. Attach exam supplements for blueprint alignment and item-type behavior.
5. Keep all migrated international records `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`.
6. Promote only after clinical, regulator, duplicate, and paywall reviews.

## Safety Rules

- Never migrate live Canadian or U.S. content into hidden international surfaces by changing public route behavior.
- Never infer country-specific clinical guidance without review.
- Never publish generated or migrated international content automatically.
- Keep recovered assets admin-only until a launch gate explicitly approves them.

