# Allied Landing Page Truthfulness Audit

Generated: 2026-06-01T01:33:24.203Z

Scope: post-homepage Allied profession landing pages only. The homepage was not modified or audited for remediation in this pass.

Evidence sources:
- `src/app/(marketing)/(default)/allied-health/[slug]/page.tsx`
- `src/components/marketing/allied-health-pathway-hub.tsx`
- `src/lib/allied/allied-professions-registry.ts`
- `src/lib/allied/allied-readiness-manifest.ts`
- `src/lib/allied/allied-mastery-modules.ts`
- `src/content/pathway-lessons/allied-professions/registry.ts`

## Executive Verdict

The Allied profession pages are not yet truth-safe for broad commercial conversion. Titles and descriptions are generally track-specific and defensible, but the post-homepage experience still risks overpromising when it presents flashcards, adaptive readiness, practice exams, CAT/adaptive study, or full profession readiness as available surfaces. Current repository evidence shows uneven lesson/question depth, zero evidenced profession-specific flashcards in this audit model, and limited simulation/case depth.

## Profession Landing Page Matrix

| Profession | Route | Lessons | Questions | Flashcards | Simulation-like modules | Manifest readiness | Verdict | Required copy action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Respiratory Therapy | /allied-health/rrt-exam-prep | 6 | 90 | 0 | 5 | 100% | Risk | Remove or qualify flashcard availability until decks are evidenced. |
| Paramedicine | /allied-health/paramedic-exam-prep | 6 | 200 | 0 | 6 | 99% | Risk | Remove or qualify flashcard availability until decks are evidenced. |
| Medical Laboratory Technology | /allied-health/mlt-exam-prep | 6 | 11 | 0 | 1 | 98% | Risk | Remove or qualify flashcard availability until decks are evidenced. |
| Physiotherapy | /allied-health/physiotherapy-exam-prep | 6 | 81 | 0 | 2 | 99% | Risk | Remove or qualify flashcard availability until decks are evidenced. |
| Occupational Therapy | /allied-health/occupational-therapy-exam-prep | 6 | 127 | 0 | 3 | 98% | Risk | Remove or qualify flashcard availability until decks are evidenced. |
| PSW | /allied-health/psw-hca-exam-prep | 0 | 0 | 0 | 0 | 97% | Risk | Remove or qualify flashcard availability until decks are evidenced. |
| Social Work | /allied-health/social-work-exam-prep | 6 | 0 | 0 | 0 | 99% | Risk | Remove or qualify flashcard availability until decks are evidenced. |
| Psychotherapy | /allied-health/psychotherapy-exam-prep | 6 | 0 | 0 | 0 | 100% | Risk | Remove or qualify flashcard availability until decks are evidenced. |

## Claim-Level Findings

| Claim area | Observed surface | Truthfulness verdict | Evidence | Action |
| --- | --- | --- | --- | --- |
| Titles and descriptions | `generateMetadata()` uses profession registry title/description. | Partially supported | Registry copy is profession-specific and does not usually state exact counts. | Keep titles, but avoid phrases implying complete exam readiness until per-profession readiness meets launch thresholds. |
| Feature lists | Profession registry `features` plus `AlliedHealthPathwayHub` guided study path. | Risk | Feature lists emphasize pathway isolation and lessons, but hub modules expose Flashcards, Adaptive readiness, and Practice exams even where evidence is incomplete. | Gate or qualify feature cards by profession evidence; do not show unavailable modules as part of a ready study path. |
| CTA copy | `Lessons for This Track`, question-bank and pricing CTAs. | Risk | Some professions have zero or very low attributable question inventory; PSW has no dedicated catalog evidence. | Route CTAs to only demonstrated surfaces or label them as previews/waitlist. |
| Readiness claims | `ALLIED_READINESS_MANIFEST` reports 97-100% for several professions. | Unsupported | Manifest readiness percentages conflict with content parity evidence for lessons, flashcards, questions, simulations, and readiness domains. | Do not display high readiness percentages in learner-facing Allied funnels until calculated from inventory and quality gates. |
| Simulation claims | Clinical scenario/case language and simulation-like module references. | Risk | Simulation counts are module-derived and below target for every audited profession. | Use limited-case language only; reserve `simulation library` claims for professions meeting simulation thresholds. |
| Question bank claims | Question hub and practice CTAs. | Partially supported | RT, Paramedicine, MLT, PT, and OT have some question evidence; PSW, Social Work, and Psychotherapy have none in the audited module mapping. | Show actual counts or suppress question-bank claims for unsupported professions. |
| Flashcard claims | Guided study path includes flashcards. | Unsupported | No profession-specific flashcard inventory is evidenced by this repository-only audit. | Remove, hide, or mark flashcards as coming soon per profession. |

## Non-Homepage Required Remediation

1. Make the Allied profession hub render module cards only when that profession has demonstrable inventory.
2. Replace high readiness percentages with computed readiness derived from lessons, questions, flashcards, simulations, and quality gates.
3. Suppress or qualify flashcard, practice-exam, and CAT/adaptive claims unless the profession has an immediately accessible surface after signup.
4. Add evidence-backed counts near CTAs where inventory is still developing.
