# NP CAT Readiness Audit

**Generated:** 2026-06-01  
**Source:** Live production database — post-publication counts  
**CAT minimum floor:** 30 adaptive-eligible published questions (per `cat-readiness-floor.ts`)

---

## CAT Gate: All Five Pathways Pass ✅

| Pathway | Total Questions | CAT-Eligible | Floor (30) | Status |
|---------|----------------|-------------|-----------|--------|
| FNP | 10,375 | **8,715** | 30 | ✅ PASS |
| AGPCNP | 5,000 | **4,196** | 30 | ✅ PASS |
| PMHNP | 4,000 | **4,000** | 30 | ✅ PASS |
| WHNP | 4,000 | **3,338** | 30 | ✅ PASS |
| PNP-PC | 4,000 | **3,348** | 30 | ✅ PASS |

All pathways clear the 30-item floor by orders of magnitude. Effective pool after deduplication (see duplicate audit) still exceeds floor by 35–127×.

---

## Difficulty Distribution

The CAT engine selects items using Item Response Theory (IRT) difficulty targeting. A well-calibrated pool needs items at all five difficulty levels.

| Pathway | D1 (Foundation) | D2 (Easy) | D3 (Medium) | D4 (Hard) | D5 (Very Hard) | D1+D2 Flag |
|---------|----------------|-----------|-------------|-----------|----------------|------------|
| FNP | **0** | **0** | 2,492 | 3,733 | 2,490 | ⚠️ MISSING |
| AGPCNP | **0** | **0** | 1,200 | 1,797 | 1,199 | ⚠️ MISSING |
| PMHNP | **0** | **0** | 1,143 | 1,715 | 1,142 | ⚠️ MISSING |
| WHNP | **0** | **0** | 954 | 1,432 | 952 | ⚠️ MISSING |
| PNP-PC | **0** | **0** | 957 | 1,435 | 956 | ⚠️ MISSING |

**All five pathways are missing difficulty levels 1 (foundation) and 2 (easy) entirely.**

The difficulty rotation in the publisher uses pattern `[3, 4, 4, 5, 3, 5, 4]` — which produces only D3/D4/D5. This means:
- The CAT engine cannot select items for learners with low initial ability estimates
- Early-session item selection defaults to the D3 floor for every NP pathway
- Learners at the bottom of the ability distribution receive consistently hard items
- IRT calibration curves will appear truncated at the low end

**Difficulty ratio across D3/D4/D5:**
The publisher uses a `[3,4,4,5,3,5,4]` cycle, producing approximately 29%/43%/29% at D3/D4/D5. This is a reasonable hard-skewed distribution for NP certification exam prep, but the complete absence of D1/D2 is a structural gap.

---

## Question Format Distribution

| Format | FNP | AGPCNP | PMHNP | WHNP | PNP-PC | CAT-Eligible |
|--------|-----|--------|-------|------|--------|-------------|
| MCQ (standard) | 36.0% | 35.7% | 50.5% | 33.8% | 34.8% | ✅ Yes |
| SATA | 16.0% | 16.1% | 16.5% | 16.6% | 16.3% | ✅ Yes |
| Bowtie | 8.0% | 8.0% | 8.3% | 8.3% | 8.2% | ✅ Yes |
| Differential diagnosis | 8.0% | 8.0% | 8.3% | 8.3% | 8.2% | ✅ Yes |
| Clinical management | 8.0% | 8.0% | 8.3% | 8.3% | 8.2% | ✅ Yes |
| Diagnostic interpretation | 8.0% | 8.0% | 8.2% | 8.3% | 8.2% | ✅ Yes |
| Matrix | 8.0% | 8.0% | — | 8.3% | 8.2% | ❌ Not eligible |
| Ordered response | 8.0% | 8.0% | — | 8.3% | 8.2% | ❌ Not eligible |

PMHNP uses 6 question types vs. 8 for the others — matrix and ordered-response were excluded by the PMHNP publisher's `buildQuestionByType` switch statement. This reduces non-CAT-eligible items to 0% for PMHNP, explaining its 100% CAT-eligible rate.

Matrix and ordered-response items are `isAdaptiveEligible = false` by design (their format does not fit standard IRT-based item selection). They serve mock-exam and practice-mode uses only.

---

## Blueprint Category Coverage

NP certification exams test across multiple blueprint domains. Coverage gaps here directly impact blueprint validity.

### FNP
| Category | Count | % of Pool |
|----------|-------|-----------|
| Clinical Assessment and Diagnosis | 4,323 | 41.7% |
| Chronic Disease Management | 2,117 | 20.4% |
| Professional Practice | 870 | 8.4% |
| Health Promotion and Prevention | 841 | 8.1% |
| Pharmacotherapeutics | 564 | 5.4% |
| *(no category)* | 1,660 | 16.0% |

FNP coverage is reasonable but **16% of questions have no blueprint category** (SATA items — format not assigned `nclexClientNeedsCategory`).

### AGPCNP
| Category | Count | % |
|----------|-------|---|
| Clinical Assessment and Diagnosis | 1,941 | 38.8% |
| Chronic Disease Management | 1,500 | 30.0% |
| Professional Practice | 627 | 12.5% |
| Health Promotion and Prevention | 77 | 1.5% |
| Pharmacotherapeutics | 51 | 1.0% |
| *(no category)* | 804 | 16.1% |

**Health Promotion (1.5%) and Pharmacotherapeutics (1.0%) are critically under-represented** for AGPCNP. These map to prevention counselling and medication management — core AGPCNP competency areas.

### PMHNP
| Category | Count | % |
|----------|-------|---|
| Clinical Assessment and Diagnosis | 2,573 | 64.3% |
| Pharmacotherapeutics | 765 | 19.1% |
| Professional Practice | 662 | 16.6% |

**Only 3 blueprint categories** — no Chronic Disease Management, no Health Promotion. PMHNP certification includes long-term psychiatric condition management and health promotion for mentally ill populations. These domains are absent.

### WHNP
| Category | Count | % |
|----------|-------|---|
| Clinical Assessment and Diagnosis | 1,817 | 45.4% |
| Health Promotion and Prevention | 787 | 19.7% |
| Pharmacotherapeutics | 457 | 11.4% |
| Professional Practice | 277 | 6.9% |
| *(no category)* | 662 | 16.6% |

WHNP has good Health Promotion representation (19.7%) appropriate for contraception/preventive gynecology. Missing Chronic Disease Management entirely.

### PNP-PC
| Category | Count | % |
|----------|-------|---|
| Clinical Assessment and Diagnosis | 1,312 | 32.8% |
| Health Promotion and Prevention | 1,017 | 25.4% |
| Chronic Disease Management | 652 | 16.3% |
| Pharmacotherapeutics | 185 | 4.6% |
| Professional Practice | 182 | 4.6% |
| *(no category)* | 652 | 16.3% |

PNP-PC has the most balanced blueprint coverage of the five pathways.

---

## Body System Coverage

Body system breadth determines whether the CAT engine can select topically varied items across a session.

| Pathway | Systems Covered | Dominant System | Dominance % |
|---------|----------------|-----------------|-------------|
| FNP | 16 | Cardiovascular | 5.7% |
| AGPCNP | 11 | Mental Health | 12.2% |
| PMHNP | 8 | Mental Health | 59.1% |
| WHNP | 3 | Women's Health | 78.5% |
| PNP-PC | 9 | Endocrine | 24.4% |

**WHNP is critically narrow: 78.5% of items in a single body system (Women's Health).** A 85-question CAT session would deliver ~67 Women's Health items and ~9 from other systems. This fails basic content validity for a Women's Health NP exam that includes pharmacology, preventive medicine, and reproductive primary care.

**PMHNP: 59.1% Mental Health.** More defensible given the specialty scope, but Geriatrics (13.7%), Pediatrics (6.8%), and Pharmacology (6.8%) are the only supplements.

**FNP is the best-covered** at 16 body systems with no system exceeding 5.7%.

---

## Item Discrimination

Quality score was set uniformly to 95 for all published questions (`qualityScore: 95`). This indicates scores are declared, not empirically derived from learner response data.

| Pathway | Quality p10 | Quality p50 |
|---------|------------|------------|
| All | 95 | 95 |

**No empirical item discrimination data exists yet.** Discrimination values (a-parameters in IRT) will only become available after learners answer these questions. The database rows have `blueprintWeight: 1.1` for adaptive-eligible items and `0.7` for non-adaptive — these are static declarations, not calibrated parameters.

**CAT session quality implication:** The CAT engine's first sessions on these items will run in "cold start" mode — it cannot differentiate item quality until response data accumulates.

---

## Categories Below CAT Minimums

The CAT engine requires a minimum pool per difficulty level to build balanced sessions. With D1/D2 missing:

| Pathway | D1 | D2 | Session impact |
|---------|----|----|----------------|
| FNP | 0 | 0 | Cannot select foundation/easy items |
| AGPCNP | 0 | 0 | Cannot select foundation/easy items |
| PMHNP | 0 | 0 | Cannot select foundation/easy items |
| WHNP | 0 | 0 | Cannot select foundation/easy items |
| PNP-PC | 0 | 0 | Cannot select foundation/easy items |

Body system gaps below practical minimum for multi-session coverage:

| Pathway | Underrepresented systems |
|---------|--------------------------|
| WHNP | Cardiovascular (0), Respiratory (0), Renal (0), Endocrine (0) — 12+ systems absent |
| PMHNP | Cardiovascular (0), Renal (0), GI (0), Endocrine (0), Women's Health (0) — 7+ systems absent |
| PNP-PC | Cardiovascular (0), Renal (0), GI (0), Respiratory (limited) |

---

## Readiness Verdict per Pathway

| Pathway | CAT Gate | Difficulty | Blueprint | Body Systems | Verdict |
|---------|---------|-----------|-----------|-------------|---------|
| FNP | ✅ | ⚠️ D1/D2 missing | ✅ 5 categories | ✅ 16 systems | **Functional — gaps manageable** |
| AGPCNP | ✅ | ⚠️ D1/D2 missing | ⚠️ Prevention/Pharm thin | ✅ 11 systems | **Functional — blueprint gaps** |
| PMHNP | ✅ | ⚠️ D1/D2 missing | ⚠️ 3 categories only | ⚠️ 8 systems | **Functional — narrow scope** |
| WHNP | ✅ | ⚠️ D1/D2 missing | ⚠️ No chronic disease | ❌ 3 systems | **Risk — critically narrow body systems** |
| PNP-PC | ✅ | ⚠️ D1/D2 missing | ✅ 5 categories | ✅ 9 systems | **Functional — best balanced** |

---

## Remediation Plan

### Immediate

**1. Add D1/D2 items to all pathways** — each pathway needs ≥ 100 D1 and ≥ 100 D2 items. Update publisher to include `difficulty: 1` and `difficulty: 2` in the rotation:

```typescript
// Replace current [3, 4, 4, 5, 3, 5, 4] pattern:
function difficulty(index: number): number {
  return [1, 2, 3, 3, 4, 4, 5, 3, 4, 5, 2, 3][index % 12]!;
}
```

**2. WHNP body system expansion** — the 3-system pool needs to include at least Pharmacology, Cardiovascular, and Reproductive as separate system entries. The WHNP publisher lesson filter (`WHNP_INCLUDED_LESSON_RE`) currently collapses all content under "Women's Health" — expand the filter to preserve body system granularity from source lessons.

**3. PMHNP blueprint expansion** — add "Health Promotion" and "Chronic Disease Management" categories to PMHNP domain definitions. Psychiatric patients have high rates of metabolic syndrome, cardiovascular disease, and substance-related chronic conditions — these are legitimate PMHNP blueprint domains.

### Short-term (2 weeks)

**4. Cross-pathway AGPCNP blueprint fix** — Health Promotion (1.5%) and Pharmacotherapeutics (1.0%) are critically low for AGPCNP. Add 2–3 dedicated domains for preventive care in older adults and polypharmacy management.

**5. Harvest blueprint categories from existing SATA items** — 16% of questions have no `nclexClientNeedsCategory`. These are all SATA items. Assign the correct blueprint category during the `questionRow()` construction in each publisher.

**6. Empirical discrimination baseline** — after first 500 learner responses per pathway, run a difficulty/discrimination calibration to identify items below a-parameter threshold and quarantine them.

### Medium-term

**7. Body system rebalancing for WHNP and PMHNP** — generate a second batch of 1,000 items per pathway targeting underrepresented systems (cardiovascular, renal, pharmacology, chronic disease) to bring system coverage to ≥ 8 systems each.
