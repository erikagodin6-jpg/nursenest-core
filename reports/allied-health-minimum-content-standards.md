# Allied Health — minimum content standards (draft)

Source-of-truth for **occupation list** and routing: `nursenest-core/src/lib/allied/allied-professions-registry.ts` (`ALLIED_PROFESSIONS`, `ALLIED_PROFESSION_KEYS`).

## Cross-cutting minimums (all occupations)

| Dimension | Minimum | Evidence / enforcement |
|-----------|---------|-------------------------|
| Public taxonomy categories (marketing lesson hub) | **≥ 9** curated categories per profession | `MIN_ALLIED_PROFESSION_TAXONOMY_CATEGORIES` + `ALLIED_PROFESSION_TAXONOMIES` in `allied-profession-taxonomy.ts` |
| Registry pathway | Each occupation row references **`us-allied-core`** (single Stripe tier `ALLIED` today) | `pathwayId` on each `AlliedProfessionMarketing` |
| Premium hub module surface | Study tools + readiness cards match `buildPremiumMarketingModuleCards` for allied (no RN/NP ECG; **no NCLEX NGN tile** on allied hubs) | `exam-pathway-hub-premium-modules.ts` |
| Honest “coming soon” | Locked tiles use subscriber-safe CTAs; no invented question counts | Hub cards + audits |

## Content-type targets (numeric — confirm with product; use audits for actuals)

These are **planning targets**, not claims about current DB inventory. Actual counts must come from:

- `npm run audit:exam-bank` / `scripts/audit-exam-question-bank.ts`
- `scripts/audit/generate-full-parity-audit.mts` (when `DATABASE_URL` configured)
- `src/lib/allied/count-allied-pathway-lessons.ts` (published lesson counts per pathway + optional topic filter)

| Content type | Draft minimum per occupation track | Notes |
|--------------|-------------------------------------|--------|
| Lessons (published, pathway-scoped) | TBD — run DB audit | Filter `pathwayId` + optional `topicSlug` / allied profession metadata |
| Practice / flashcard-eligible questions (`exam_questions` pool) | TBD — sum by `contentExamKeys` for `ALLIED` | Do not conflate with RN pools |
| CAT / adaptive | Follow `pathway-readiness-config` simulation entries for `*-allied-core` | Marketing CAT gates still apply (`pathway-marketing-practice-gates`) |
| Scenario / case studies | TBD — scenario catalog by profession when enabled | `scenarioCatalogCategoryIds` on registry rows |
| Labs (study tools) | Surface present on hub; depth TBD | `/app/labs` drill routes scoped by pathway query |
| Med calc | Surface present | Study tool route |
| Skill refresher | Card present for new-grad RN only; allied uses core study tools | N/A for standard allied hub |

## Occupation-specific curriculum emphasis (bullets)

Aligned to each row’s `examOverview` + taxonomy slugs in `ALLIED_PROFESSION_TAXONOMIES` (abbreviated labels):

| Profession key | Focus areas (study design) |
|----------------|----------------------------|
| `pta` | Therapeutic exercise, gait, ortho/neuro rehab, modalities safety, documentation |
| `ota` | ADLs/IADLs, cognition, pediatrics MH, adaptive equipment, ethics |
| `mlt` | Hematology, chemistry, micro, transfusion, UA/body fluids, QC/safety |
| `imaging` | Positioning, ALARA, contrast, cross-sectional basics, QA |
| `respiratory` | Ventilation, ABGs, oxygen, airway, disease, neonatal (conceptual) |
| `paramedic` | Airway, trauma, cards field, tox/environmental, EMS ops |
| `pharmacy-tech` | Calculations, sterile/non-sterile, regulatory, inventory, top-200 |
| `social-work` | Crisis, MH, addictions, ethics, assessment, documentation |
| `psw-hca` | ADLs, dementia, infection, skin, palliative, reporting |
| `community-health-worker` | Outreach, education, coordination, advocacy |
| `mental-health-addictions` | Safety, boundaries, de-escalation, documentation |
| `medical-assistant` | Vitals, office workflow, infection, scope |
| `dental-assistant` | Infection control, chairside, radiography basics |
| `dental-hygiene` | Periodontal assessment, prevention, ethics |
| `dietetic-technician` | MNT support, screening, food safety |
| `emt` | Assessment, airway, trauma, transport scope |
| `sonography` | Optimization, safety, anatomy correlation |
| `radiography` | Positioning, contrast safety, ALARA |
| `lab-assistant` | Specimens, pre-analytical, chain of custody |

## Naming notes (requested roles vs registry)

| Requested label | Registry key(s) |
|-----------------|-----------------|
| OT (certification assistant track) | `ota` |
| Physio / PTA | `pta` |
| Psychotherapy / counselling licensing | No dedicated key — closest **`mental-health-addictions`** + **`social-work`** |
| RT | `respiratory` |
| MLT / MLS | `mlt`, `lab-assistant` |
