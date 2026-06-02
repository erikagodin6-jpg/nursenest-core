# PHASE 3 — Duplicate Content Opportunity Report
Generated: 2026-05-30

## Summary

For the target international markets, NurseNest's existing US/Canada content provides a high reuse foundation. The primary duplication risk is in exam-format-specific question banks — not in clinical science lessons or simulations.

---

## Reuse / Rewrite / New Content Estimates

### United Kingdom (NMC CBT + OSCE)

| Content Type | Volume | Reuse % | Rewrite % | New % |
|---|---|---|---|---|
| Lessons (clinical science) | ~400 existing | 82% | 15% | 3% |
| Questions (exam format) | ~3,000 existing | 30% | 35% | 35% |
| Flashcards | ~2,400 existing | 85% | 12% | 3% |
| Simulations | ~15 scenarios | 95% | 5% | 0% |
| Clinical Skills | 221 procedures | 97% | 3% | 0% |
| NMC CBT-specific content | — | 0% | 0% | 100% |
| OSCE station scripts | — | 0% | 0% | 100% |

**Primary duplication risk:** Questions with US/CA geographic context (exam stem localisation needed — about 35% of question bank)

### Australia (NMBA/AHPRA IQNM)

| Content Type | Volume | Reuse % | Rewrite % | New % |
|---|---|---|---|---|
| Lessons (clinical science) | ~400 existing | 84% | 13% | 3% |
| Questions | ~3,000 existing | 38% | 32% | 30% |
| Flashcards | ~2,400 existing | 85% | 12% | 3% |
| Simulations | ~15 scenarios | 95% | 5% | 0% |
| Clinical Skills | 221 procedures | 96% | 4% | 0% |
| IQNM portfolio content | — | 0% | 0% | 100% |

### New Zealand (NCNZ)

Virtually identical profile to Australia. NCNZ and NMBA competency frameworks are closely aligned.

| Content Type | Reuse % | Rewrite % | New % |
|---|---|---|---|
| Lessons | 84% | 13% | 3% |
| Questions | 40% | 32% | 28% |
| Flashcards | 85% | 12% | 3% |
| Simulations | 95% | 5% | 0% |

### Ireland (NMBI)

Ireland's nursing education is UK-adjacent; highest reuse potential of all non-US/CA markets.

| Content Type | Reuse % | Rewrite % | New % |
|---|---|---|---|
| Lessons | 88% | 10% | 2% |
| Questions | 38% | 35% | 27% |
| Flashcards | 88% | 10% | 2% |
| Simulations | 97% | 3% | 0% |

### United States (from Canada base)

The US is the closest expansion target. NCLEX-RN and Canadian NCLEX-RN share exam format.

| Content Type | Reuse % | Rewrite % | New % |
|---|---|---|---|
| Lessons | 92% | 6% | 2% |
| Questions | 65% | 25% | 10% |
| Flashcards | 90% | 8% | 2% |
| Simulations | 98% | 2% | 0% |

---

## Highest-Value Reuse Targets (Zero Duplication Risk)

The following content categories can be used **without any modification** across all international markets:

1. **ECG Module** — rhythm interpretation is globally identical
2. **Hemodynamics Module** — invasive monitoring principles are universal
3. **Ventilator/RT Module** — respiratory physiology is universal
4. **Clinical Skills Lab** — 221 procedures, globally applicable
5. **Lab Values Module** — reference ranges differ slightly; 90%+ reusable
6. **Pharmacology Core** — mechanism of action, drug classes, safety principles universal
7. **ABG Interpretation** — universal
8. **Shock & Sepsis** — universal
9. **Physiology Simulations** — all 15 conditions, 18 interventions globally applicable

---

## Duplication Risks to Avoid

| Risk | Description | Mitigation |
|---|---|---|
| 5 separate lesson copies | Maintaining UK/AU/NZ/IE/US versions of "Heart Failure" separately | Use Global Core + thin country supplements |
| Question bank fragmentation | Building separate Q banks per country | Tag questions with `examKey` and filter at render |
| Flashcard deck duplication | Separate decks per country | Use shared deck with country-specific card subsets |
| Clinical skill procedure variants | Minor drug name differences triggering full rewrites | Use inline terminology substitution tokens |

---

## Recommended Deduplication Strategy

```
1. Tag all existing content with: global | nclex-rn | rex-pn | cnple | nmc | nmba | ncnz | nmbi
2. All untagged content defaults to "global"
3. Build country supplements as lightweight overlays, not new files
4. Questions: add examFamily field to filter at query time
5. Flashcards: add examTag field to include/exclude per market
```
