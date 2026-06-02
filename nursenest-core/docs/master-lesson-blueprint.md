# Master lesson blueprint — NurseNest

**Purpose:** Systematic, premium-grade growth toward **≥150** lessons per core pathway (launch) and **500+** long-term, without shallow duplication.  
**Catalog:** `src/content/pathway-lessons/catalog.json` — each lesson row must declare **one primary purpose** (see §6).  
**Related:** `docs/pathway-lesson-launch-inventory.md`, `data/reports/pathway-lesson-launch-matrix.json`.

**Pathway IDs**

| Label | `pathwayId` | Exam / role |
|-------|-------------|-------------|
| US RN | `us-rn-nclex-rn` | NCLEX-RN (US) |
| Canada RN | `ca-rn-nclex-rn` | NCLEX-RN (Canada) |
| US LPN | `us-lpn-nclex-pn` | NCLEX-PN (LVN/LPN) |
| Canada RPN | `ca-rpn-rex-pn` | REx-PN |
| US NP | `us-np-fnp` | FNP (primary US NP track) |
| Canada NP | `ca-np-cnple` | Canadian NP (CNPLE — upcoming) |

---

## 1. Master taxonomy — topic families (19)

Each **family** is a stable bucket for planning, hub SEO, and `topicSlug` / `bodySystem` alignment. Suggested **canonical family slug** (use in metadata and reporting):

| # | Family | Canonical slug | Primary exam relevance |
|---|--------|----------------|------------------------|
| 1 | Cardiovascular | `cardio` | All nursing tiers; NP: prescribing + chronic CAD/HF |
| 2 | Respiratory | `respiratory` | All tiers; ABG / ventilation judgment |
| 3 | Neurological | `neurological` | Stroke, seizures, ICP; NP: neuro complaint workups |
| 4 | Renal / GU | `renal-gu` | Fluids, CKD, AKI, electrolytes tie-in |
| 5 | GI / nutrition | `gastrointestinal` | Liver, GI bleed, nutrition support |
| 6 | Endocrine / metabolic | `endocrine` | DM, thyroid, adrenal; NP: chronic DM panels |
| 7 | Hematology / oncology | `hematology` | Anemia, clotting, onc emergencies (scope-aware) |
| 8 | Infectious disease / sepsis | `infectious` | ID, isolation, sepsis bundles |
| 9 | Fluids / electrolytes / acid-base | `fluids-electrolytes` | Cross-cutting; ties to renal + respiratory |
| 10 | Pharmacology (cross-system) | `pharmacology` | Drug classes, interactions, antidotes |
| 11 | Maternity / newborn | `maternity` | Antepartum, L&D, newborn (tier-appropriate) |
| 12 | Pediatrics | `pediatrics` | Growth, peds dosing, peds emergencies |
| 13 | Mental health | `mental-health` | Therapeutic communication, safety, scope |
| 14 | Med-surg (general adult) | `med-surg` | Peri-op, general ward reasoning when not better placed above |
| 15 | Leadership / delegation / prioritization | `leadership` | RN + PN heavy; NP: interprofessional + system |
| 16 | Safety / infection control | `safety` | PPE, isolation, errors, fall prevention |
| 17 | Emergency / shock / trauma | `emergency` | Triage, shock types, trauma principles |
| 18 | Chronic disease management | `chronic-care` | Outpatient panels (NP-heavy; RN care coordination) |
| 19 | Case-based clinical reasoning | `clinical-reasoning` | Integrated cases (often cross-family) |

*Note: Existing catalog uses additional slugs (e.g. `pn-foundation`, `womens-health`). New lessons should map to one **primary** family above for planning; secondary tags allowed in `topic` text or enrichment.*

---

## 2. Lesson types (within each family)

Every lesson declares **one** primary type (store in internal authoring checklist; optional future field `lessonBlueprintType`).

| Type code | Label | What “good” looks like |
|-----------|--------|-------------------------|
| **OV** | Disease overview | Pathophys + assessment + RN/PN/NP scope boundaries in one coherent arc |
| **SY** | Syndrome recognition | Pattern recognition + red flags + next-step thinking |
| **RX-C** | Medication class | Class effects, monitoring, contraindications (tier-appropriate) |
| **RX-S** | Medication-specific | One high-stakes drug or drug pair (e.g. insulin, warfarin, lithium) |
| **SF** | Safety priority | Error prevention, high-alert meds, infection control moment |
| **PD** | Prioritization / delegation | Who does what, what to escalate; **PN must stay in PN scope** |
| **CS** | Case study | One narrative with branching decisions (NGN-style for RN/PN) |
| **LAB** | Diagnostics / labs | Interpretation + when to escalate (ABG, troponin, cultures, imaging hooks) |
| **IM** | Interventions / nursing management | Interventions, education, handoff — not duplicate of OV unless different objective |

**NP-specific overlay:** Types **RX-C**, **RX-S**, **LAB**, **CS**, and **chronic-care** family often include **prescribing / differential** depth; RN/PN use the same type codes but **shallower** pharmacology and **no** independent prescribing unless jurisdiction allows (Canada NP / US NP per track).

---

## 3. Pathway-specific adaptations

| Dimension | US RN | Canada RN | US LPN | Canada RPN | US NP (FNP) | Canada NP |
|-----------|-------|-----------|--------|------------|-------------|-----------|
| **Primary exam frame** | NCLEX-RN, NGN-style judgment | NCLEX-RN + Canadian acute context | NCLEX-PN vocational | REx-PN + Canadian PN law/scope | AANP/ANCC-style advanced practice | Canadian NP competencies (as published) |
| **Pharmacology depth** | Moderate; class + safety | Same + Canadian labeling/units | Narrower; delegation & administration focus | Same + provincial scope | **High** — prescribing, monitoring, follow-up | **High** — Canadian formularies / standards |
| **Delegation** | Assign/supervise | Same | **Receives** delegation; report up | Same | Lead / collaborate | Autonomous within scope |
| **Leadership** | Management of care | Same | **Limited** — coordinate, report | Same | Panel + system | Panel + system |
| **Country variants** | US units, US scope language | **Mandatory** CA variant (SI, Canadian protocols) | US | **Mandatory** CA variant for REx-PN | US boards | **Never** copy US FNP; build CA-specific |
| **Shared content** | Spine with CA RN | Spine with US RN | Spine with CA RPN where safe | Spine with US LPN where safe | Independent grid (lifespan × domain) | Independent grid |

**Sharing rules**

- **Shared spine (paired):** US RN ↔ Canada RN — same `slug`, different **country_specific_notes**, units, and scope wording.  
- **Shared spine (paired):** US LPN ↔ Canada RPN — same `slug` where clinical content is equivalent; **always** add REx-PN / provincial scope where the exam differs.  
- **Not shared:** NP ↔ RN/PN (different tier objectives). US NP ↔ Canada NP (different regulatory framework).  
- **Case studies (CS):** May reuse *clinical scenario shape* but must rewrite stems for **role** (PN cannot show RN-only orders).

---

## 4. Anti-duplication: distinct purpose per lesson

Each lesson must satisfy **exactly one** primary intent:

1. **One primary type** (OV … IM) + **one primary family** — recorded at authoring time.  
2. **Forbidden:** two lessons with the same **(family + type + focal condition)** unless one is **US** and one is **Canada** paired variant.  
3. **Forbidden:** “overview” + “management” that repeat the same paragraphs — merge or differentiate (e.g. OV = recognition; IM = inpatient management only).  
4. **Case studies (CS):** At most **one** CS per **(family, pathway)** per **150-lesson tranche** unless the **focal diagnosis** differs.  
5. **Medication:** **RX-S** for high-stakes narrow drugs; **RX-C** for class — do not stack both for the same class + same pathway unless one is **adult** and one is **peds**, etc.

---

## 5. Master matrix — families × lesson types (planning density)

Use this to **quota** net-new lessons. Approximate **minimum rows per family per 500-lesson pathway** (adjust per tier: PN slightly fewer in neuro-intervention depth; NP more in chronic + pharm).

| Family | OV | SY | RX-C | RX-S | SF | PD | CS | LAB | IM | *Rough subtotal* |
|--------|----|----|------|------|----|----|----|-----|-----|------------------|
| cardio | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~25–40 |
| respiratory | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~25–40 |
| neuro | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~20–35 |
| renal-gu | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~20–35 |
| GI | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~20–30 |
| endocrine | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~20–35 |
| hematology | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~15–25 |
| infectious | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~20–30 |
| fluids-electrolytes | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ~15–25 |
| pharmacology | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~20–35 |
| maternity | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~15–30 |
| pediatrics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~15–30 |
| mental-health | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~15–25 |
| med-surg | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~10–20 |
| leadership | — | — | — | — | ✓ | ✓ | ✓ | — | ✓ | ~15–25 |
| safety | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~15–25 |
| emergency | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~15–25 |
| chronic-care | ✓ | ✓ | ✓ | ✓ | ✓ | PD | ✓ | ✓ | ✓ | ~20–40 (NP-heavy) |
| clinical-reasoning | — | — | — | — | — | ✓ | ✓ | ✓ | — | ~10–20 (integrated) |

*(✓ = plan for at least one lesson in a full 500+ library; “—” = optional or usually absorbed into other families.)*

---

## 6. Fastest route to **150** lessons per pathway

**Principle:** Fill **high-yield families** first (cardio, respiratory, fluids, pharm, safety, leadership/PD for tier), then round out maternity/peds/mental health to exam weight.

| Pathway | Strategy |
|---------|----------|
| **US RN** | ~28 net-new: prioritize **fluids**, **pharm**, **safety**, **emergency**, **leadership/PD**; add **CS** only where current catalog is thin. |
| **Canada RN** | ~27 net-new: **mirror US RN slugs** with CA variants; do not author from scratch in parallel. |
| **US LPN** | ~89 net-new: prioritize **PD**, **SF**, **OV** at PN depth; **leadership** = delegation/reporting, not management. |
| **Canada RPN** | ~89 net-new: pair with US LPN where possible; **mandatory** REx-PN scope on every new row. |
| **US NP** | ~135 net-new: use **lifespan × family** grid (see FNP hub enrichment); emphasize **chronic-care**, **RX-C/RX-S**, **LAB**, **CS**. |
| **Canada NP** | 150 net-new: start with **adult primary care + mental health + women’s health** pillars per Canadian framework; **no** US paste. |

**Sequencing (all pathways):**  
1) **Safety + infection + pharm high-alert** (fast wins, cross-cutting).  
2) **Top organ systems** (cardio, respiratory, renal, endocrine).  
3) **Special populations** (maternity, peds, mental health).  
4) **Integrated reasoning** (clinical-reasoning + case studies).

---

## 7. Long-term route to **500+** per pathway

| Phase | Target | Focus |
|-------|--------|--------|
| **I — Launch** | 150 | Quotas above; paired US/CA; quality gates |
| **II — Depth** | 150 → 300 | Second pass: **SY**, **LAB**, **CS** density; sub-specialty clusters (HF subsets, COPD exacerbation, DKA vs HHS, etc.) |
| **III — Breadth** | 300 → 500 | Rare-but-testable topics; med-surg overflow; NP chronic panels by comorbidity |
| **IV — Maintenance** | 500+ | Retire/merge **<3 section** legacy rows; analytics-driven refresh |

**Engineering:** Keep `npm run audit:pathway-lessons` green with `--enforce` once all pathways ≥ 150. Extend integrity tests if new metadata fields (`lessonBlueprintType`) are added.

---

## 8. Summary

| Deliverable | Location |
|-------------|----------|
| Master taxonomy (19 families + 9 lesson types) | This document |
| Pathway adaptations | §3 |
| Sharing vs scoped variants | §3–4 |
| Phased growth (150 → 500+) | §6–7 |
| Inventory counts / gaps | `docs/pathway-lesson-launch-inventory.md` |

This blueprint is the **authoring contract** for systematic, premium lesson growth across NurseNest’s six core pathways.
