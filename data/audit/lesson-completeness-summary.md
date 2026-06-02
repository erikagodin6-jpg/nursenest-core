# Lesson completeness audit

Generated: 2026-04-15T03:30:01.648Z

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
- **Split status model**: `contentReadinessStatus` (English spine) and `localizationReadinessStatus` (overlay depth) are reported alongside legacy `status` — scores are unchanged; overallScore still weights localization at 0.08.

## Totals (from lesson-completeness-summary.json)
- Lessons scanned: **906**
- **Legacy combined `status`** (unchanged thresholds):
- production_ready: **1**
- usable_but_thin: **0**
- structurally_incomplete: **305**
- content_incomplete: **0**
- localization_incomplete: **345**
- not_routable: **0**
- duplicate_or_unclear_source: **255**
- **Content readiness (English spine)** — production_ready_en: **163**, usable_but_thin_en: **183**, structurally_incomplete: **305**, content_incomplete: **0**, not_routable: **0**, duplicate_or_unclear_source: **255**.
- **Localization readiness (overlays)** — localized_ready: **16**, partially_localized: **0**, localization_incomplete: **345**, english_only: **545**, localized_shell_only: **0**.
- **Good English lessons not yet localization-complete** (`production_ready_en` and not `localized_ready`): **162**
- **Blocked mainly by localization** (legacy `status === localization_incomplete`): **345**

## Good English lessons that are not yet localization-complete
Lessons with **`contentReadinessStatus === production_ready_en`** but **`localizationReadinessStatus !== localized_ready`** (overlays missing or only one scanned locale). These have a strong English teaching spine under the same depth gates as before; remaining work is primarily **educational overlay expansion** (or documenting English-primary intent), not fixing a broken lesson shell.
- **Count**: **162**

## Top failing pathways (nursing-first, by volume)
- **ca-rn-nclex-rn** (canada/rn/nclex-rn): 188 lessons · avg score 70.2 · legacy ready 0 · **production_ready_en 29** · thin 0 · structural gaps 39
- **us-rn-nclex-rn** (us/rn/nclex-rn): 187 lessons · avg score 47.8 · legacy ready 0 · **production_ready_en 30** · thin 0 · structural gaps 104
- **us-np-fnp** (us/np/fnp): 161 lessons · avg score 87.4 · legacy ready 1 · **production_ready_en 104** · thin 0 · structural gaps 0
- **ca-rpn-rex-pn** (canada/rpn/rex-pn): 150 lessons · avg score 50.9 · legacy ready 0 · **production_ready_en 0** · thin 0 · structural gaps 61
- **us-lpn-nclex-pn** (us/lpn/nclex-pn): 150 lessons · avg score 50.8 · legacy ready 0 · **production_ready_en 0** · thin 0 · structural gaps 61
- **us-rn-new-grad-transition** (us/rn/new-grad-transition): 40 lessons · avg score 27.7 · legacy ready 0 · **production_ready_en 0** · thin 0 · structural gaps 40

## Top systemic issues (reason histogram)
- no_educational_overlay_in_scanned_locales: **618**
- missing_educational:core_concept_depth: **361**
- missing_educational:overview_intro: **274**
- low_total_word_count: **233**
- missing_educational:summary_takeaways: **225**
- thin_total_word_count: **219**
- Clinical scenario section must include a structured patient vignette (patient/client frame plus clinical context).: **140**
- missing_educational:clinical_application: **126**
- links:no_internal_study_links: **124**
- Legacy section "clinical_scenario" is below the minimum depth (29 < 40 words).: **70**
- Legacy section "core_concept" is below the minimum depth (24 < 40 words).: **52**
- Missing required premium section: tier_specific_relevance: **51**
- Section "country_specific_notes" is missing: add content, mark [not applicable] in body, or document omission in premiumOmittedSections.: **51**
- Missing required premium section: related_next_steps: **51**
- Related / internal study flow: include at least 3 internal links using [anchor](LESSON:slug) or [anchor](/path) in the lesson body (often in Related Lessons / Next Steps).: **51**

## Batch-fix patterns (systemic)
- ca-rn-nclex-rn: most lessons lack ES/FR/TL educational overlay keys — English-primary teaching with localized chrome only.
- us-rn-nclex-rn: most lessons lack ES/FR/TL educational overlay keys — English-primary teaching with localized chrome only.
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
- **Catalog rows scanned**: 906 — **not production_ready**: **905**.
- **By status** (non–production_ready): usable_but_thin **0**, structurally_incomplete **305**, content_incomplete **0**, localization_incomplete **345**, not_routable **0**, duplicate_or_unclear_source **255**.
- **Isolated lessons** (no internal study links and no relatedLessonRefs): **333**.
- **Present in catalog**: Row exists in merged bundled JSON for a pathway.
- **Routable**: Pathway registry status is `active` (marketing hub can exist).
- **Structurally non-empty**: Sections array exists with bodies; may still fail premium/legacy gates.
- **Educationally complete**: Substance buckets (intro, core, application, summary, exam reasoning, safety/priority signals) + depth — not just non-blank fields.
- **Production ready**: High overall score, gate passes, links in band, sufficient depth — rare by design under strict scoring.
Many lessons are **catalog-present** and **structurally non-empty** but still **not production-ready** because depth, links, educational coverage, or localization evidence fail the bar.

## Honest limitations
- DB-only lessons not in bundled JSON are omitted.
- Overlay detection is file-key based; runtime DB overlays are not merged here.
- `inEffectiveHub=false` flags lessons filtered by exam/country context — not “invalid”, just not listed on default hub slice.
- Full repo TypeScript may still report unrelated errors; this audit is standalone.