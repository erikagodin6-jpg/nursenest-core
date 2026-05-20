# Lesson route enforcement audit

Generated: 2026-04-15T02:20:40.927Z

## Summary

| Metric | Count |
|--------|------:|
| Pathways scanned | 4 |
| Lesson rows (catalog merge per pathway) | 675 |
| `publicComplete` | 321 |
| Not public-complete (detail → **404**, hub **hidden**) | 354 |

## Enforcement (code)

- **Decision:** `resolveMarketingPathwayLessonRouteResolution` / `getLessonRouteAccessDecision` — `src/lib/lessons/pathway-lesson-route-access.ts`.
- **Completeness:** `pathwayLessonEligibleForPublicMarketingSurface` → `structuralQuality.publicComplete`.
- **Hubs:** `sortAndFilterLessonsForPathwayContext` drops incomplete lessons.
- **Paywall:** First-section preview only; `sanitizePaywallPreviewSection` strips figures/checkpoints/recall for unpaid users.

## Sample incomplete slugs (first 40)

- `us-rn-nclex-rn` / `ob-emergencies-gold-standard` (legacy)
- `us-rn-nclex-rn` / `pediatric-triage-emergencies-gold-standard` (legacy)
- `us-rn-nclex-rn` / `renal-dialysis-acute-complications-gold-standard` (legacy)
- `us-rn-nclex-rn` / `pulmonary-embolism-recognition-gold` (premium)
- `us-rn-nclex-rn` / `atrial-fibrillation-stroke-prevention-gold` (premium)
- `us-rn-nclex-rn` / `pneumonia-cap-nursing-gold` (premium)
- `us-rn-nclex-rn` / `upper-gi-bleed-prioritization-gold` (premium)
- `us-rn-nclex-rn` / `meningitis-emergency-recognition-gold` (premium)
- `us-rn-nclex-rn` / `opioid-toxicity-naloxone-gold` (premium)
- `us-rn-nclex-rn` / `falls-injury-prevention-gold` (premium)
- `us-rn-nclex-rn` / `adrenal-crisis-addisonian-gold` (premium)
- `us-rn-nclex-rn` / `ards-acute-respiratory-failure-gold` (premium)
- `us-rn-nclex-rn` / `thyroid-storm-emergency-gold` (premium)
- `us-rn-nclex-rn` / `delirium-acute-confusion-gold` (premium)
- `us-rn-nclex-rn` / `respiratory-assessment-ngn` (legacy)
- `us-rn-nclex-rn` / `us-rn-pulmonary-embolism` (premium)
- `us-rn-nclex-rn` / `us-rn-heart-failure` (premium)
- `us-rn-nclex-rn` / `us-rn-myocardial-infarction` (premium)
- `us-rn-nclex-rn` / `us-rn-angina` (premium)
- `us-rn-nclex-rn` / `us-rn-dysrhythmias` (premium)
- `us-rn-nclex-rn` / `us-rn-hypertension` (premium)
- `us-rn-nclex-rn` / `us-rn-shock` (premium)
- `us-rn-nclex-rn` / `us-rn-asthma` (premium)
- `us-rn-nclex-rn` / `us-rn-ards` (premium)
- `us-rn-nclex-rn` / `us-rn-pneumonia` (premium)
- `us-rn-nclex-rn` / `us-rn-copd-respiratory` (premium)
- `us-rn-nclex-rn` / `us-rn-abg-interpretation` (premium)
- `us-rn-nclex-rn` / `us-rn-acid-base-advanced` (premium)
- `us-rn-nclex-rn` / `us-rn-sodium-imbalance` (premium)
- `us-rn-nclex-rn` / `us-rn-potassium-imbalance` (premium)
- `us-rn-nclex-rn` / `us-rn-insulin-hypoglycemia` (premium)
- `us-rn-nclex-rn` / `us-rn-sepsis` (premium)
- `us-rn-nclex-rn` / `us-rn-infection-control` (premium)
- `us-rn-nclex-rn` / `us-rn-anticoagulants` (premium)
- `us-rn-nclex-rn` / `us-rn-antibiotics` (premium)
- `us-rn-nclex-rn` / `us-rn-pain-management` (premium)
- `us-rn-nclex-rn` / `us-rn-delegation` (premium)
- `us-rn-nclex-rn` / `us-rn-fluid-balance` (premium)
- `us-rn-nclex-rn` / `us-rn-prioritization-abcs` (premium)
- `us-rn-nclex-rn` / `us-rn-general-nursing-clinical` (premium)

## Notes

- listPathwayLessonSlugBatch may still list slugs that 404 on detail until batching filters public-complete rows.
