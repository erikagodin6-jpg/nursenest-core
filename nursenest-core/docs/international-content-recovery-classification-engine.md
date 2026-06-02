# NurseNest International Content Recovery, Classification, and Inheritance Engine

Date: 2026-05-31

Status: Hidden Draft Foundation

Do not publish. Do not expose recovered assets in navigation, sitemap, search, learner dashboards, pricing pages, or public pathway selectors.

## Executive Principle

Recover before creating.

Classify before generating.

Reuse before duplicating.

No new international content should be generated until recovery analysis is complete.

## Recovery Sources

The recovery engine declares these source roots for inventory and classification:

- `src/content/blog-static-longtail/`
- `src/content/pathway-lessons/`
- `src/content/questions/`
- `src/content/clinical-case-studies.json`
- `output/*`
- `data/blog-content/`
- `data/blog-manifest/`
- `tools/i18n/`
- `scripts/i18n/`
- Generated content batches
- Draft import queues
- Automation pipelines

Every recovered candidate remains:

- `status=draft`
- `published=false`
- `adminOnly=true`
- `visibleInNavigation=false`
- `learnerAccessible=false`
- `launchReady=false`
- `noindex=true`

## 1. International Content Inventory

Machine-readable source:

`src/lib/international-content/international-content-recovery-classification-engine.ts`

Initial recovered registry:

| Content ID | Source | Type | Topic | Classification | Inheritance Source |
| --- | --- | --- | --- | --- | --- |
| `recovered-global-heart-failure-core` | `src/content/blog-static-longtail/` | Blog | Heart Failure | `GLOBAL_SHARED_CORE` | `GLOBAL_SHARED_CORE` |
| `recovered-global-copd-core` | `src/content/blog-static-longtail/` | Blog | COPD | `GLOBAL_SHARED_CORE` | `GLOBAL_SHARED_CORE` |
| `recovered-global-sepsis-core` | `src/content/clinical-case-studies.json` | Clinical Case | Sepsis | `GLOBAL_SHARED_CORE` | `GLOBAL_SHARED_CORE` |
| `recovered-uk-nmc-news2-overlay` | `src/content/blog-static-longtail/` | Blog | NEWS2 and Deterioration | `COUNTRY_SPECIFIC` | `GLOBAL_SHARED_CORE:clinical-assessment` |
| `recovered-au-rural-cultural-safety-overlay` | `data/blog-content/australia-nursing/` | Blog | Rural Healthcare and Cultural Safety | `COUNTRY_SPECIFIC` | `GLOBAL_SHARED_CORE:professional-practice` |
| `recovered-nz-te-tiriti-overlay` | `src/content/blog-static-longtail/` | Blog | Te Tiriti and Cultural Safety | `COUNTRY_SPECIFIC` | `GLOBAL_SHARED_CORE:professional-practice` |
| `recovered-us-nclex-ngn-overlay` | `src/content/questions/` | Question | NGN Clinical Judgment | `EXAM_SPECIFIC` | `GLOBAL_SHARED_CORE:clinical-judgment` |
| `recovered-heart-failure-np-role-overlay` | `src/content/pathway-lessons/` | Lesson | Heart Failure | `ROLE_SPECIFIC` | `GLOBAL_SHARED_CORE:heart-failure` |
| `recovered-fr-international-overlay` | `tools/i18n/` | Localization | French International Nursing Overlay | `LANGUAGE_SPECIFIC` | `GLOBAL_SHARED_CORE` |
| `recovered-es-international-overlay` | `tools/i18n/` | Localization | Spanish International Nursing Overlay | `LANGUAGE_SPECIFIC` | `GLOBAL_SHARED_CORE` |

## Required Classification Model

Recovered assets must classify into one of:

- `GLOBAL_SHARED_CORE`
- `COUNTRY_SPECIFIC`
- `EXAM_SPECIFIC`
- `ROLE_SPECIFIC`
- `LANGUAGE_SPECIFIC`
- `FUTURE_EXPANSION`
- `ARCHIVE`
- `REQUIRES_REVIEW`

## 2. Global Core Inventory

Global shared core detection routes broadly reusable clinical assets into `GLOBAL_NURSING_CORE_LIBRARY` or the newer `GLOBAL_SHARED_CORE` overlay model.

Detected global core examples:

- Heart Failure.
- COPD.
- Sepsis.
- Shock.
- ECG.
- ABGs.
- Labs.
- Pharmacology.
- Clinical Assessment.

Repository evidence from `docs/global-content-reuse-map.md`:

| Topic Signal | Files With Matches | Reuse Classification |
| --- | ---: | --- |
| Heart Failure / CHF | 984 | Global Core |
| COPD | 1,176 | Global Core |
| Shock | 1,151 | Global Core |
| Sepsis | 4,414 | Global Core |
| ABG / Arterial Blood Gas | 626 | Global Core |
| ECG / Telemetry | 3,011 | Global Core |
| Pharmacology / Medication Safety | 2,850 | Global Core + Country Supplements |
| Lab Interpretation / Labs | 2,638 | Global Core + Country Supplements |
| Clinical Skills / Assessment | 4,409 | Global Core + Country Supplements |

## 3. Country Overlay Inventory

Country overlays contain local regulation, documentation, terminology, health-system context, and jurisdictional practice expectations.

Initial overlay routing:

| Country | Detected Signals | Target Library |
| --- | --- | --- |
| United Kingdom | NHS, NEWS2, Duty of Candour, Safeguarding, NMC | `COUNTRY_OVERLAY_LIBRARY` |
| Australia | NMBA, Ahpra, Rural Healthcare, Aboriginal Health | `COUNTRY_OVERLAY_LIBRARY` |
| New Zealand | NCNZ, Cultural Safety, Te Tiriti | `COUNTRY_OVERLAY_LIBRARY` |
| Canada | CNO, BCCNM, CLPNA, CRNNL, provincial regulation | `COUNTRY_OVERLAY_LIBRARY` |
| United States | State Boards, NCLEX Governance, NCSBN, Pearson VUE | `COUNTRY_OVERLAY_LIBRARY` |

## 4. Role Overlay Inventory

Role overlays isolate scope-specific learning without duplicating the clinical core.

Example: Heart Failure

| Role | Overlay Focus |
| --- | --- |
| PN | Recognition, monitoring, basic medications, escalation |
| RN | Assessment, prioritization, care planning, clinical judgment |
| NP | Diagnosis, differential diagnosis, management, prescribing |

Target library:

`ROLE_OVERLAY_LIBRARY`

## 5. Exam Overlay Inventory

Exam overlays contain blueprint, question format, scoring, psychometric, and exam-strategy differences.

Detected exam overlays:

- NCLEX-RN.
- NCLEX-PN.
- REx-PN.
- CNPLE.
- FNP.
- AGPCNP.
- PMHNP.
- WHNP.
- PNP-PC.
- NMC CBT.
- AHPRA RN.
- NCNZ RN.

Target library:

`EXAM_OVERLAY_LIBRARY`

## 6. Duplicate Content Report

The recovery engine fingerprints titles, slugs, questions, lessons, flashcards, simulations, clinical cases, and blogs.

Initial duplicate findings:

| Group | Type | Representative Topic | Evidence | Action |
| --- | --- | --- | --- | --- |
| `duplicate-global-heart-failure` | Inherited duplicate | Heart Failure | 984 files with Heart Failure / CHF matches | Map to global core |
| `duplicate-global-sepsis` | Near duplicate | Sepsis | 4,414 files with Sepsis matches | Map to global core |
| `localized-international-nmc-links` | Localized duplicate | NMC CBT international registration links | Repeated NMC CBT internal-link blocks across language variants | Convert to overlay |

Duplicate categories tracked:

- Near duplicates.
- Partial duplicates.
- Localized duplicates.
- Translation duplicates.
- Inherited duplicates.

## 7. Translation Readiness Report

Translation-ready content should be translated from `GLOBAL_SHARED_CORE`, not country-specific copies.

Initial `TRANSLATION_READY_QUEUE`:

- `recovered-global-heart-failure-core`
- `recovered-global-copd-core`
- `recovered-global-sepsis-core`
- `recovered-fr-international-overlay`
- `recovered-es-international-overlay`

Translation gating:

- Content suitable for translation: global clinical core.
- Content requiring localization: country overlays.
- Content requiring regulatory review: country and exam overlays.
- Content requiring terminology review: language overlays and localized clinical phrasing.

## 8. Reuse Opportunity Report

High-value reuse opportunities:

| Opportunity | Reuse Path |
| --- | --- |
| Heart Failure | `GLOBAL_SHARED_CORE` -> role overlays -> country overlays -> language overlays |
| COPD | `GLOBAL_SHARED_CORE` -> respiratory country overlays -> exam overlays |
| Sepsis | `GLOBAL_SHARED_CORE` -> deterioration/escalation overlays -> simulation variants |
| ECG | `GLOBAL_SHARED_CORE` -> scope/escalation overlays -> exam item formats |
| Labs | `GLOBAL_SHARED_CORE` -> unit/reference-range/reporting overlays |
| Pharmacology | `GLOBAL_SHARED_CORE` -> drug governance, brand naming, controlled-medication overlays |
| Clinical Assessment | `GLOBAL_SHARED_CORE` -> country documentation and escalation overlays |

Estimated reusable assets in the initial registry: 8 of 10 candidates.

## 9. Maintenance Savings Report

Shared-core inheritance reduces long-term maintenance by preventing five or more country copies of the same clinical concept.

Planning estimate based on current reuse signals:

| Area | Expected Benefit |
| --- | --- |
| Global clinical lessons | 70-80% reuse across English-speaking RN markets |
| Questions and rationales | Reuse clinical stem/rationale; localize exam framing and regulator language |
| Flashcards | Generate once from canonical lessons/questions; overlay exam relevance |
| Simulations | Reuse deterioration logic; localize escalation/documentation |
| Translation | Translate shared core once; translate overlays separately |

Maintenance risk if not enforced:

- Duplicate clinical updates.
- Inconsistent rationales.
- Conflicting country terminology.
- Translation drift.
- SEO cannibalization.
- Higher clinical review burden.

## 10. International Expansion Roadmap

### Phase 1: Recovery Registry

- Expand machine-readable inventory across all declared source roots.
- Assign content IDs, fingerprints, classification, inheritance source, and hidden-state flags.
- Keep every recovered item draft/admin/noindex.

### Phase 2: Classification and Fingerprinting

- Fingerprint titles, slugs, stems, rationales, pearls, flashcards, simulations, and blog sections.
- Detect near duplicates, partial duplicates, translations, localized variants, and inherited duplicates.
- Route candidates into global core, country overlay, role overlay, exam overlay, language overlay, archive, or review queues.

### Phase 3: Inheritance Mapping

- Map reusable clinical concepts to `GLOBAL_SHARED_CORE`.
- Attach country, role, exam, and language overlays.
- Block generation when a reusable inherited source exists.

### Phase 4: Review Queues

- Clinical review.
- Editorial review.
- Localization review.
- SEO review.
- Inheritance mapping review.
- Duplicate review.

### Phase 5: Expansion Readiness

- Generate country-specific content only where inheritance cannot safely cover the requirement.
- Use overlays for Ireland, UAE, Saudi Arabia, Singapore, India, Philippines, and additional future markets.

## International Recovery Dashboard

Current machine-readable dashboard:

| Metric | Count |
| --- | ---: |
| Global Core Count | 3 |
| Country Overlay Count | 3 |
| Role Overlay Count | 1 |
| Exam Overlay Count | 1 |
| Duplicate Count | 3 |
| Recovery Count | 10 |
| Review Queue Count | 10 |
| Draft Inventory Count | 10 |
| Estimated Reusable Assets | 8 |
| Estimated Duplicate Assets | 3 |
| Translation Ready Count | 5 |

## Publication Protection

Recovered content may not be published until:

- Clinical Review Complete.
- Editorial Review Complete.
- Localization Review Complete.
- SEO Review Complete.
- Inheritance Mapping Complete.

Until those gates clear, recovered assets remain draft, admin-only, noindex, hidden from navigation, and unavailable to learners.
