# Pathway lesson catalog inventory (core six)

**Primary source of truth for this document:** `src/content/pathway-lessons/catalog.json` (versioned lesson bodies).  
**Audit script:** `npx tsx ../scripts/audit-pathway-lesson-inventory.ts` (optional `--enforce` when all pathways ≥ 150).  
**Machine-readable matrix:** `data/reports/pathway-lesson-launch-matrix.json`

**Important:** this document tracks the **catalog / effective lesson inventory** only. It is **not** the same signal as the public launch gate used by country / exam readiness:

- **Committed public launch snapshot:** `src/config/pathway-readiness-snapshot.json`
- **Public/live readiness UI:** `/admin/country-exam-readiness`
- **Runtime RPN route visibility verifier:** `npm run verify:rpn-lessons-visible`

Those sources are DB-backed or runtime-backed and can legitimately diverge from the catalog audit in this file. Do **not** compare the numbers here directly to the public launch snapshot without stating which source you mean.

**Policy:** Do not inflate counts with thin or near-duplicate lessons. Each row must pass structural / premium gates (`pathway-lesson-premium.ts`, `classifyPathwayLesson`) and remain pathway-scoped (US vs Canada, RN vs PN vs NP).

**Systematic expansion:** See **`docs/master-lesson-blueprint.md`** (topic families, lesson types, sharing rules, phased growth to 500+).

---

## A. Count sources and how to use them

| Source | Backing data | What it answers | Use for |
| --- | --- | --- | --- |
| This document (`catalog.json` + scoped-gold effective count) | Versioned lesson bodies in repo | How many durable lesson bodies exist in the catalog | Authoring / content backlog / parity planning |
| `src/config/pathway-readiness-snapshot.json` | DB-backed emitted snapshot (`countPathwayLessons` + question diagnostics) | What public launch gates currently consider published for a pathway | Public launch gating / country-exam readiness |
| `npm run verify:rpn-lessons-visible` | Filesystem + runtime loader + optional site HTML | Whether RPN lessons resolve and render on runtime/public surfaces | Candidate / post-deploy verification |

### Snapshot reference (committed public launch gate)

At the time this doc was last reconciled with the launch gate, `src/config/pathway-readiness-snapshot.json` reported:

| Pathway ID | Snapshot lessons | Snapshot questions |
| --- | ---: | ---: |
| `us-rn-nclex-rn` | 200 | 480 |
| `ca-rn-nclex-rn` | 190 | 420 |
| `us-lpn-nclex-pn` | 175 | 380 |
| `ca-rpn-rex-pn` | 180 | 350 |
| `us-np-fnp` | 91 | 280 |
| `ca-np-cnple` | 0 | 0 |

If these numbers drift, regenerate the snapshot and reconcile this section before using any launch percentage in reports.

---

## B. Current catalog/effective lesson counts by pathway

| Pathway ID        | Exam / role                         | Catalog lessons |
|-------------------|-------------------------------------|----------------:|
| `us-rn-nclex-rn`  | US RN — NCLEX-RN                    | **122** |
| `ca-rn-nclex-rn`  | Canada RN — NCLEX-RN              | **123** |
| `us-lpn-nclex-pn` | US LVN/LPN — NCLEX-PN             | **61** |
| `ca-rpn-rex-pn`   | Canada RPN — REx-PN               | **61** |
| `us-np-fnp`       | US NP — FNP (primary US NP track) | **15** |
| `ca-np-cnple`     | Canada NP — CNPLE (upcoming)      | **0** |

**Related NP hubs (not in the “six” row above):** `us-np-agpcnp`, `us-np-pmhnp` — **0** catalog lessons each today; expand after FNP baseline if product prioritizes those tracks.

**Launch target:** **≥ 150** useful lessons per pathway in the table (same bar for CNPLE once authoring begins).

---

## C. New lesson targets by domain (high level)

Map each **new** lesson to at least one **content intent** (tag via `topicSlug`, `bodySystem`, premium section kinds, and `exam_focus`):

| Domain cluster (exam-agnostic) | How it shows up in catalog |
|--------------------------------|----------------------------|
| Diseases / syndromes | Body-system + diagnosis-oriented `topicSlug` rows; `pathophysiology_overview`, `signs_symptoms` |
| Medications | `pharmacology` topics + NP `pharmacotherapy` / prescribing panels |
| Safety / infection | `safety`, `safety-scope` (PN), infection content in physiological topics |
| Prioritization / clinical judgment | `exam_focus` blocks; NGN-style scenarios in RN/PN |
| Delegation | PN/RN `leadership`, coordinated-care; explicit delegation stems for PN |
| Case studies | Long-form `clinical_application` + one consolidated “case” lesson per high-yield topic where needed |
| Labs / diagnostics | `labs_diagnostics` premium section; renal/ABG/endocrine lessons |
| Procedures / interventions | Per-system procedure lessons; NP procedural counseling where board-relevant |
| Mental health / therapeutic communication | `mental-health` topic cluster |
| Maternal / newborn | `maternity` |
| Pediatric | `pediatrics` |
| Adult health | Cardio, respiratory, endocrine, etc. |
| Community / leadership / ethics | `leadership`, health promotion, professional role (NP) |

**Per-pathway priorities to close gaps to 150**

| Pathway | Approx. net-new to 150 | Focus |
|---------|------------------------:|--------|
| US RN | 28 | Top up thin buckets (e.g. MSK), pharmacology + safety ties, delegation vs management clarity |
| Canada RN | 27 | Same structure as US RN with Canada-specific `country_specific_notes` |
| US LPN | 89 | PN scope: delegation, coordinated care, vocational depth — **not** RN copy |
| Canada RPN | 89 | REx-PN scope overlays; pair with US PN where 34 slugs already align |
| US NP (FNP) | 135 | Lifespan × domain grid (`fnp-us-lesson-enrichment`); differentials + prescribing |
| Canada NP | 150 | Greenfield after competency map; avoid mirroring US FNP verbatim |

---

## D. What was added or adapted (this deliverable)

| Artifact | Purpose |
|----------|---------|
| `data/reports/pathway-lesson-launch-matrix.json` | Snapshot counts, gaps, paired-pathway stats, expansion phases |
| `scripts/audit-pathway-lesson-inventory.mjs` | Repeatable audit; `--enforce` for CI when all pathways meet 150 |
| This doc | Launch matrix + domain framework |

**No new catalog lesson rows were added** in this change — meeting 150+ requires phased authoring with the quality gates above (no junk filler).

**Existing pairing strategy (already in repo)**

- **US RN / Canada RN:** **95** shared `slug` keys — intentional **country adaptations** (same lesson spine, different scope notes).
- **US LPN / Canada RPN:** **34** shared slugs — paired PN lessons; remainder are track-specific.

---

## E. Which pathways meet 150+ catalog lessons

**None** of the six pathways are at **150** yet.

| Meets ≥ 150? |
|--------------|
| No — all below target (see section A). |

---

## F. Expansion plan toward 500+

1. **150 (launch floor):** Close pathway-specific gaps; maintain paired US/CA workflows for RN and PN; FNP expansion uses lifespan × domain matrix; CNPLE seeds after Canadian scope is stable.
2. **150 → 250:** Increase density in **medications**, **labs/diagnostics**, and **case-style** lessons; merge or retire thin duplicates if any appear.
3. **250 → 400:** Sub-clusters (e.g. high-risk OB, peds infectious, geriatrics polypharmacy) with unique learning objectives — no title-level duplicates.
4. **400 → 500+:** Cadence-based additions from blueprint backlog (`src/lib/content-blueprint/`); hub analytics to deprioritize low-engagement slugs.

**Scalable framework (engineering)**

- Keep **one catalog file** per version with `pathways[pathwayId].lessons[]` as today.
- Optional: generation pipelines write **draft** JSON that passes `pathway-lesson-catalog-integrity` tests before merge.
- **NP:** extend `buildFnpExplorerPayload` / topic maps before bulk-adding rows so hubs stay filterable.
- **PN:** keep `pn-foundation` + Client Needs–style `topicSlug` balance; REx-PN always tagged for Canadian regulatory context.

---

## Cross-check commands

```bash
npx tsx ../scripts/audit-pathway-lesson-inventory.ts
# When every core pathway >= 150:
npx tsx ../scripts/audit-pathway-lesson-inventory.ts --enforce
```
