# Respiratory therapy (RT / RRT) tier — readiness audit

_Generated: 2026-05-11T02:29:50.773Z_

## Tier registration (product)

- **Billing tier:** `TierCode.ALLIED` — RT is **not** a separate Stripe tier; subscribers use the **Allied** plan with profession context `respiratory` (`User.alliedProfessionKey`).
- **Canonical pathway id:** `us-allied-core` (US allied core hub)
- **Exam column scope:** `exam_questions.exam` ∈ expanded keys from pathway `contentExamKeys` (`ALLIED` + publish allowlist variants).
- **Profession hub (marketing):** `/allied/respiratory` — **must not** redirect to RN; legacy country-prefixed URLs may 301 to `/allied/allied-health/*` only.
- **Legacy career types mapped to DB (`careerType`):** `rrt` plus tags `profession:respiratory` / `alliedProfession:respiratory`.
- **Readiness engine:** `pathway-readiness-config.ts` sets **SIMULATION** for `us-allied-core` (not NCLEX CAT readiness branding). Learners may still start **adaptive practice sessions** from `/app/practice-tests?cat=1` when entitled.
- **CAT marketing card:** unlocked on allied hubs (`alliedHubCatSurfaceUnlocked`).

## Profession registry row

| Field | Value |
|-------|-------|
| professionKey | `respiratory` |
| pathwayId | `us-allied-core` |
| segment | `rrt-exam-prep` |
| topicSlugsIn | `patient-assessment`, `vital-signs`, `emergency-response`, `infection-control`, `human-physiology` |

## Exam question bank (US allied + respiratory scope)

> Scope = `questionBankWhereForProfile(US, ALLIED)` ∩ `exam ∈ expanded(ALLIED)` ∩ non-ECG ∩ general study-bank gates ∩ (`careerType ∈ {rrt}` OR profession tags). Matches allied hub inventory ∩ respiratory.

| Metric | Count |
|--------|------:|
| Published | 0 |
| Non-published / null status (in scope) | 0 |
| isAdaptiveEligible (published) | 0 |
| CAT-complete rows (sample scan, max 12000) | 0 |

### Question types (published)

| question_type | count |
|---------------|------:|

### Topics (top 40, published)

| topic | count |
|-------|------:|

### Critical category coverage (published RT pool ∩ heuristic OR)

_Heuristic keyword/tag overlap — for prioritizing imports, not clinical completeness._

| Category | Matching published rows |
|----------|------------------------:|
| Airway management | 0 |
| Oxygen therapy | 0 |
| Ventilation / mechanical ventilation | 0 |
| ABGs / acid-base | 0 |
| Pulmonary diagnostics | 0 |
| Pharmacology (respiratory meds) | 0 |
| Neonatal / pediatric respiratory | 0 |
| Emergency / critical care | 0 |
| Ethics / safety / infection control | 0 |

## Lessons & flashcards

> _Note: `pathway_lessons.allied_profession_key` missing in this DB — lesson count uses **topicSlug** fallback only._

| Surface | Count | Notes |
|--------|------:|-------|
| Pathway lessons (published, alliedProfessionKey **or** topic fallback) | 0 | See registry `topicSlugsIn` |
| Flashcards (ALLIED decks tagged `respiratory`) | 0 | Does not include examQuestionId-linked cards unless counted separately |

## Verification commands

```bash
npm run typecheck:critical
npm run test:homepage
npm run sitemap:validate
npx playwright test tests/e2e/rt/rt-tier-smoke.spec.ts
npm run report:rt-tier-audit
```
