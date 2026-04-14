# Lesson completeness audit

Generated: 2026-04-14T22:09:20.173Z

## What was scanned
- Bundled pathway lesson catalog (merged JSON: main catalog, allied-bundled, new-grad transition, scoped-gold prepend).
- Per-lesson structural gate from `evaluatePathwayLessonStructuralGate` (premium vs legacy).
- Educational substance heuristics (section depth + exam-reasoning cues).
- Internal study links (LESSON: / root-relative markdown).
- Educational overlay keys under `public/i18n/educational-overlays/*/lessons.json` (non-EN locales).

## Methodology
- **Scores**: structural 0–100, educational 0–100, link 0–100, localization 0–100.
- **Overall** = 0.45×structural + 0.35×educational + 0.12×links + 0.08×localization.
- **Strictness**: A lesson is not “complete” merely because sections exist or SEO fields pass padding.
- **Nursing-first reporting**: Pathways sorted with nursing tiers before allied in rollups and priority queue.

## Totals (from lesson-completeness-summary.json)
- Lessons scanned: **906**
- production_ready: **0**
- usable_but_thin: **0**
- structurally_incomplete: **464**
- content_incomplete: **0**
- localization_incomplete: **187**
- not_routable: **0**
- duplicate_or_unclear_source: **255**

## Top failing pathways (nursing-first, by volume)
- **ca-rn-nclex-rn** (canada/rn/nclex-rn): 188 lessons · avg score 34.1 · ready 0 · thin 0 · structural gaps 136
- **us-rn-nclex-rn** (us/rn/nclex-rn): 187 lessons · avg score 33.9 · ready 0 · thin 0 · structural gaps 135
- **us-np-fnp** (us/np/fnp): 161 lessons · avg score 65.6 · ready 0 · thin 0 · structural gaps 31
- **ca-rpn-rex-pn** (canada/rpn/rex-pn): 150 lessons · avg score 48.5 · ready 0 · thin 0 · structural gaps 61
- **us-lpn-nclex-pn** (us/lpn/nclex-pn): 150 lessons · avg score 48.5 · ready 0 · thin 0 · structural gaps 61
- **us-rn-new-grad-transition** (us/rn/new-grad-transition): 40 lessons · avg score 27.7 · ready 0 · thin 0 · structural gaps 40

## Top systemic issues (reason histogram)
- missing_educational:core_concept_depth: **507**
- no_educational_overlay_in_scanned_locales: **505**
- missing_educational:summary_takeaways: **421**
- missing_educational:overview_intro: **411**
- low_total_word_count: **375**
- missing_educational:clinical_application: **250**
- thin_total_word_count: **193**
- Clinical scenario section must include a structured patient vignette (patient/client frame plus clinical context).: **159**
- links:no_internal_study_links: **127**
- Legacy section "exam_relevance" is below the minimum depth (28 < 30 words).: **97**
- Legacy section "core_concept" is below the minimum depth (30 < 40 words).: **94**
- Legacy section "exam_relevance" is below the minimum depth (27 < 30 words).: **80**
- Legacy section "clinical_scenario" is below the minimum depth (29 < 40 words).: **78**
- Legacy section "core_concept" is below the minimum depth (31 < 40 words).: **76**
- Legacy section "clinical_meaning" is below the minimum depth (42 < 50 words).: **72**

## Batch-fix patterns (systemic)
- ca-rn-nclex-rn: ≥45% of lessons missing core_concept_depth bucket — likely systematic spine depth gap.
- us-rn-nclex-rn: ≥45% of lessons missing core_concept_depth bucket — likely systematic spine depth gap.
- us-np-fnp: ≥45% of lessons missing core_concept_depth bucket — likely systematic spine depth gap.
- us-np-fnp: most lessons lack ES/FR/TL educational overlay keys — English-primary teaching with localized chrome only.
- ca-rpn-rex-pn: ≥45% of lessons missing core_concept_depth bucket — likely systematic spine depth gap.
- ca-rpn-rex-pn: most lessons lack ES/FR/TL educational overlay keys — English-primary teaching with localized chrome only.
- us-lpn-nclex-pn: ≥45% of lessons missing core_concept_depth bucket — likely systematic spine depth gap.
- us-lpn-nclex-pn: most lessons lack ES/FR/TL educational overlay keys — English-primary teaching with localized chrome only.
- us-rn-new-grad-transition: most lessons lack ES/FR/TL educational overlay keys — English-primary teaching with localized chrome only.

## Suggested remediation order
1. Fix structural gate failures on high-volume nursing pathways (NCLEX-RN, NCLEX-PN, etc.).
2. Add internal study links (3–8) and relatedLessonRefs where missing.
3. Deepen educational buckets (intro, core, scenario, takeaways) for `usable_but_thin`.
4. Expand educational overlays where marketing shell is localized but lesson body is EN-primary.
5. Resolve duplicate slugs across pathways with documented canonical routing.

## Lessons that exist but are not actually complete
- **Present in catalog**: Row exists in merged bundled JSON for a pathway.
- **Routable**: Pathway registry status is `active` (marketing hub can exist).
- **Structurally non-empty**: Sections array exists with bodies; may still fail premium/legacy gates.
- **Educationally complete**: Substance buckets + word depth + reasoning cues — not just non-blank fields.
- **Production ready**: High overall score, gate passes, links in band, sufficient depth — rare by design under strict scoring.
Many lessons are **catalog-present** and **structurally non-empty** but still **not production-ready** because depth, links, or educational coverage fail the bar.

## Honest limitations
- DB-only lessons not in bundled JSON are omitted.
- Overlay detection is file-key based; runtime DB overlays are not merged here.
- `inEffectiveHub=false` flags lessons filtered by exam/country context — not “invalid”, just not listed on default hub slice.
- Full repo TypeScript may still report unrelated errors; this audit is standalone.