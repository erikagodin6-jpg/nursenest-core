# RN Completion Roadmap

Date: 2026-06-01
Status: Revenue pathway completion roadmap

Source of truth: `docs/high-priority-content-gaps.md`, with supporting exact counts from `docs/content-parity-audit.md`, `docs/content-instrumentation-report.md`, and `docs/flashcard-platform-parity-audit.generated.md`.

No public routes, navigation, sitemap entries, pricing changes, entitlement changes, or learner-facing pages are created by this roadmap.

## Current RN Premium Readiness

| Metric | Current Repository-Evidenced Count | Target | Gap | Current % |
| --- | ---: | ---: | ---: | ---: |
| NCLEX-RN lessons | 390 | 500 | 110 | 78.0% |
| NCLEX-RN questions | 900 | 8,000 | 7,100 | 11.3% |
| Canada NCLEX-RN flashcard-derived availability | 6,803 | 10,000 | 3,197 | 68.0% |
| United States NCLEX-RN flashcard-derived availability | 6,796 | 10,000 | 3,204 | 68.0% |
| RN physiology monitor simulation references | 33 | 250 | 217 | 13.2% |

Flashcard counts above come from `docs/flashcard-platform-parity-audit.generated.md`. They represent flashcard-derived availability, not a full status-governed published/draft/review inventory.

## High-Risk RN Loop Audit

| Topic | Lesson Evidence | Authored Question Evidence | Flashcard Evidence | NGN / Case Evidence | Simulation Evidence | Clinical Skill Evidence | Readiness Signal |
| --- | ---: | ---: | --- | ---: | ---: | --- | --- |
| Sepsis | 97 generated lessons | 9 authored questions | Not topic-evidenced | 1 clinical case JSON item | 13 simulations | Not topic-evidenced | Incomplete loop |
| Shock | 26 generated lessons | 6 authored questions | Not topic-evidenced | 0 clinical case JSON items | 8 simulations | Not topic-evidenced | Incomplete loop |
| ACS | 26 generated lessons | 1 authored question | Not topic-evidenced | 0 clinical case JSON items | 5 simulations | Not topic-evidenced | Incomplete loop |
| Stroke | 33 generated lessons | 9 authored questions | Not topic-evidenced | 0 clinical case JSON items | 3 simulations | Not topic-evidenced | Incomplete loop |
| Respiratory Failure | 36 generated lessons | 7 authored questions | Not topic-evidenced | 0 clinical case JSON items | 8 simulations | Not topic-evidenced | Incomplete loop |
| DKA | 22 generated lessons | 2 authored questions | Not topic-evidenced | 0 clinical case JSON items | 3 simulations | Not topic-evidenced | Incomplete loop |
| Hyperkalemia | 31 generated lessons | 4 authored questions | Not topic-evidenced | 1 clinical case JSON item | 4 simulations | Not topic-evidenced | Incomplete loop |
| GI Bleed | 16 generated lessons | 0 authored questions | Not topic-evidenced | 0 clinical case JSON items | 1 simulation | Not topic-evidenced | Incomplete loop |
| Maternal Emergencies | 24 generated lessons | 1 authored question | Not topic-evidenced | 0 clinical case JSON items | 0 simulations | Not topic-evidenced | Incomplete loop |
| Pediatric Emergencies | 100 generated lessons | 6 authored questions | Not topic-evidenced | 0 clinical case JSON items | 0 simulations | Not topic-evidenced | Incomplete loop |

## Missing Inventory To Generate

These are minimum missing assets required to move RN toward premium-market readiness. Counts are based on exact gaps where repository evidence exists.

| Workstream | Missing Inventory | Priority |
| --- | ---: | --- |
| NCLEX-RN questions | 7,100 | P0 |
| Canada RN flashcard-derived availability | 3,197 | P0 |
| United States RN flashcard-derived availability | 3,204 | P0 |
| RN simulation references | 217 | P0 |
| NCLEX-RN lessons | 110 | P1 |
| Topic-level flashcard mappings | Not evidenced | P0 instrumentation blocker |
| Clinical skill topic mappings | Not evidenced | P0 instrumentation blocker |
| NGN/case mappings by high-risk topic | Not evidenced beyond 2 clinical case JSON items | P0 instrumentation blocker |

## Build Sequence

1. Complete RN question depth first because `docs/high-priority-content-gaps.md` ranks RN question bank depth as the top revenue and learner impact gap.
2. Add topic-level flashcard instrumentation before large flashcard generation so high-risk loop completion can be proven.
3. Build simulations for sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, and GI bleed before lower-risk med-surg topics.
4. Fill the 110-lesson NCLEX-RN gap only after verifying generated-index lessons are reconciled with the committed readiness snapshot.
5. Add explicit loop readiness signals: lesson present, flashcards present, questions present, NGN case present, simulation present, clinical skill present, hints present, pearls present, rationales present.

## RN Priority Scorecard

| Initiative | Current % | Target % | Gap % | Effort Basis | Expected ROI | Priority Score |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| RN question bank completion | 11.3% | 95%+ | 83.7 | 7,100 missing questions | Highest current revenue and conversion impact | 100 |
| RN simulation expansion | 13.2% | 95%+ | 81.8 | 217 missing simulation references | High retention and institutional impact | 96 |
| RN high-risk loop completion | Incomplete | 95%+ | Not scoreable | Missing topic flashcard, case, simulation, skill mappings | High exam + clinical safety impact | 95 |
| RN flashcard expansion | 68.0% per NCLEX-RN country pathway | 95%+ | 27.0 | 3,197-3,204 missing flashcard-derived items per country pathway | High activation and retention impact | 93 |
| RN lesson completion | 78.0% | 95%+ | 17.0 | 110 missing committed-snapshot lessons | Medium-high SEO and study-plan impact | 84 |

